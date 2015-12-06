"use strict";

var STATE_MOVING = "MOVING";

var IN_ROOM = "IN_ROOM";
var LEFT_ROOM = "LEFT_ROOM";
var LEFT_LIFT = "LEFT_LIFT";
var IN_ROOM_QUEUE = "IN_ROOM_QUEUE";
var IN_LIFT_QUEUE = "IN_LIFT_QUEUE";
var VISITS_COMPLETE = "VISITS_COMPLETE";

var IN_LIFT_QUEUE_UP = "IN_LIFT_QUEUE_UP";
var IN_LIFT_QUEUE_DOWN = "IN_LIFT_QUEUE_DOWN";

var LIFT_UP = "LIFT_UP";
var LIFT_DOWN = "LIFT_DOWN";
var AT_ROOM = "AT_ROOM";

var CORRIDOR_TO_ROOM = "CORRIDOR_TO_ROOM";
var CORRIDOR_TO_LIFT = "CORRIDOR_TO_LIFT";
var OUTSIDE = "OUTSIDE";

function startTime(agents) {
    return agents.reduce(function (min, agent) { return min < agent.arrival.time ? min : agent.arrival.time; }, agents[0].arrival.time);
}

function timeToSeconds(time) {
    var timeParts = time.split(":");
    return (parseInt(timeParts[0], 10) * 3600) + (parseInt(timeParts[1], 10) * 60) + parseInt(timeParts[2], 10);
}

// The building has several floors, and on each floor there are rooms numbered XXYY, where XX stands for the floor number, YY for the room number, and XX > 0; YY <= 10.
function toRoom(room) {
    return { floor: parseInt(room.substr(0, 2), 10), room: parseInt(room, 10) };
}

//  the time in seconds (S) that agent may spend in the room.
function toDuration(duration) {
    return parseInt(duration, 10);
}

function readLine(line) {
    var args = line.split(" ");
    var id = args[0];
    var time = timeToSeconds(args[1]);
    var rooms = [];

    for (var i = 2; i < args.length; i += 2) {
        var room = toRoom(args[i]);
        room.duration = toDuration(args[i + 1]);
        rooms.push(room);
    }

    rooms.push({ floor: 1, room: 0, duration: 0 });

    var arrival = { time: time + 10, floor: 1, location: rooms[0].floor === 1 ? AT_ROOM : LIFT_UP };
    var agent = { id: args[0], state: STATE_MOVING, arrival: arrival, rooms: rooms, floor: 1, log: [], startTime: args[1] };

    addHistory(agent, time, OUTSIDE, 1);
    addHistory(agent, time + 5, rooms[0].floor === 1 ? CORRIDOR_TO_ROOM : CORRIDOR_TO_LIFT, 1);

    return agent;
}

function addHistory(agent, time, location, floor, duration) {
    if (!agent.history) { agent.history = []; }

    var roomNo = agent.rooms[0].room % 100;

    agent.history.push({ time: time, location: location, floor: floor, room: roomNo, nextRoom: agent.rooms[0].room, duration: duration });
}

function readLines(lines) {
    return lines.map(function (line) { return readLine(line); });
}

function isNotOnDestinationFloor(agentInLift) {
    return agentInLift.floor !== agentInLift.destination;
}

function ejectAgentsOutOfLifts(lifts) {
    lifts.up = lifts.up.filter(isNotOnDestinationFloor);
    lifts.down = lifts.down.filter(isNotOnDestinationFloor);
}

function ejectsAgentsOutOfRooms(rooms, time) {
    rooms.forEach(function (room, index) {
        if (room && room.exitTime === time) {
            rooms[index] = undefined;
        }
    });
}

function moveAgentsInLift(lift, move) {
    lift.forEach(function (agentInLift) { agentInLift.floor += move; });
}

function moveAgentsInLifts(lifts) {
    moveAgentsInLift(lifts.up, 0.5);
    moveAgentsInLift(lifts.down, -0.5);
}

function isInARoom(agent) {
    return agent.state === IN_ROOM;
}

function isTimeToLeaveRoom(rooms, agent) {
    return rooms[agent.rooms[0].room] === undefined || rooms[agent.rooms[0].room].id !== agent.id;
}

function leaveRoom(agent, time) {
    log(agent, "Left room " + agent.rooms[0].room, time);
    agent.rooms.splice(0, 1);
    agent.state = LEFT_ROOM;
}

function agentNeedsToMove(agent) {
    return agent.state === LEFT_ROOM;
}

function needsToUseLift(agent) {
    return agent.floor !== agent.rooms[0].floor;
}

function moveAgent(agent, time) {
    if (needsToUseLift(agent)) {
        moveToLift(agent, time);
    }
    else {
        moveToRoom(agent, time);
    }
}

function moveToRoom(agent, time) {
    addHistory(agent, time, LEFT_ROOM, agent.floor, -1);
    addHistory(agent, time + 5, CORRIDOR_TO_ROOM, agent.floor);

    agent.state = STATE_MOVING;
    agent.arrival = { time: time + 10, floor: agent.rooms[0].floor, location: AT_ROOM };
}

function moveToLift(agent, time) {
    addHistory(agent, time, LEFT_ROOM, agent.floor, -1);
    addHistory(agent, time + 5, CORRIDOR_TO_LIFT, agent.floor);

    agent.state = STATE_MOVING;
    agent.arrival = { time: time + 10, floor: agent.floor, location: agent.floor > agent.rooms[0].floor ? LIFT_DOWN : LIFT_UP };
}

function agentHasArrived(agent, time) {
    return agent.arrival.time === time;
}

function enterQueueState(agent, time) {
    agent.state = agent.arrival.location === AT_ROOM ? IN_ROOM_QUEUE : IN_LIFT_QUEUE;
    agent.floor = agent.arrival.floor;

    log(agent, agent.state + " floor " + agent.floor, time);
}

function agentNeedsToEnterLift(agent) {
    return agent.state === IN_LIFT_QUEUE;
}

function agentNeedsToEnterRoom(agent) {
    return agent.state === IN_ROOM_QUEUE;
}

function liftIsFree(lifts, agent) {
    var lift = agent.arrival.location === LIFT_UP ? lifts.up : lifts.down;

    return lift
        .filter(function (agentInLift) { return agentInLift.floor === agent.arrival.floor; })
        .length === 0;
}

function enterLift(lifts, agent, time) {
    log(agent, "Enter lift " + agent.arrival.location + " floor " + agent.floor, time);
    var lift = agent.arrival.location === LIFT_UP ? lifts.up : lifts.down;
    lift.push({ id: agent.id, floor: agent.floor, destination: agent.rooms[0].floor });

    if (agent.arrival.location === LIFT_UP) {
        for (var i = agent.floor; i < agent.rooms[0].floor; i++) {
            var floorDiff = i - agent.floor;
            addHistory(agent, time + (floorDiff * 10), LIFT_UP, i);
            addHistory(agent, time + (floorDiff * 10) + 5, LIFT_UP, i + 0.5);
        }
        floorDiff = agent.rooms[0].floor - agent.floor;
        addHistory(agent, time + (floorDiff * 10), LEFT_LIFT, agent.rooms[0].floor);
        addHistory(agent, time + (floorDiff * 10) + 5, CORRIDOR_TO_ROOM, agent.rooms[0].floor);
    }
    else {
        for (var i = agent.floor; i > agent.rooms[0].floor; i--) {
            var floorDiff = agent.floor - i;
            addHistory(agent, time + (floorDiff * 10), LIFT_DOWN, i);
            addHistory(agent, time + (floorDiff * 10) + 5, LIFT_DOWN, i - 0.5);
        }
        floorDiff = agent.floor - agent.rooms[0].floor;
        addHistory(agent, time + (floorDiff * 10), LEFT_LIFT, agent.rooms[0].floor);
        addHistory(agent, time + (floorDiff * 10) + 5, CORRIDOR_TO_ROOM, agent.rooms[0].floor);
    }

    var floorDiff = Math.abs(agent.floor - agent.rooms[0].floor);
    agent.arrival = { time: time + (floorDiff * 10) + 10, floor: agent.rooms[0].floor, location: AT_ROOM };
    agent.state = STATE_MOVING;
}

function roomIsFree(rooms, agent) {
    return rooms[agent.rooms[0].room] === undefined;
}

function enterRoom(rooms, agent, time) {
    if (agent.rooms[0].room === 0) {
        agent.exitTime = toHHMMSS(time);
        agent.rooms = [];
        agent.state = VISITS_COMPLETE;
        log(agent, VISITS_COMPLETE, time);
    }
    else {
        rooms[agent.rooms[0].room] = { id: agent.id, exitTime: time + agent.rooms[0].duration };
        agent.state = IN_ROOM;
        log(agent, IN_ROOM + " " + agent.rooms[0].room, time);
    }
}

function padToTwoDigits(n) {
    return ("0" + n.toString()).substr(-2, 2);
}

function toHHMMSS(time) {
    var hours = Math.floor(time / 3600);
    time -= (hours * 3600);
    var mins = Math.floor(time / 60);
    var seconds = time - (mins * 60);
    return padToTwoDigits(hours) + ":" + padToTwoDigits(mins) + ":" + padToTwoDigits(seconds);
}

function tick(time, agents, lifts, rooms) {
    moveAgentsInLifts(lifts);

    ejectAgentsOutOfLifts(lifts, time);
    ejectsAgentsOutOfRooms(rooms, time);

    agents.forEach(function (agent) {
        if (isInARoom(agent)) {
            if (isTimeToLeaveRoom(rooms, agent)) {
                leaveRoom(agent, time)
            }
            else {
                var duration = agent.history[agent.history.length - 1].duration - 5;
                addHistory(agent, time, IN_ROOM, agent.floor, duration);
            }
        };

        if (agentNeedsToMove(agent)) { moveAgent(agent, time); }

        if (agentHasArrived(agent, time)) { enterQueueState(agent, time); }

        if (agentNeedsToEnterLift(agent)) {
            if (liftIsFree(lifts, agent)) {
                enterLift(lifts, agent, time);
            }
            else {
                addHistory(agent, time, agent.arrival.location === LIFT_UP ? IN_LIFT_QUEUE_UP : IN_LIFT_QUEUE_DOWN, agent.floor);
            }
        }

        if (agentNeedsToEnterRoom(agent)) {
            if (roomIsFree(rooms, agent)) {
                addHistory(agent, time, IN_ROOM, agent.floor, agent.rooms[0].duration);
                enterRoom(rooms, agent, time);
            }
            else {
                addHistory(agent, time, IN_ROOM_QUEUE, agent.floor);
            }
        }
    });
}

function visitToHeadquarters(lines) {
    var allAgents = readLines(lines);
    var time = startTime(allAgents);
    var lifts = { up: [], down: [] };
    var rooms = [];

    var agents = allAgents.slice(0).sort(function (a, b) { return a.id < b.id ? -1 : 1; });

    while (true) {
        agents = agents.filter(function (agent) { return agent.rooms.length > 0; });

        if (agents.length === 0) { break; }

        tick(time, agents, lifts, rooms);
        time += 5;
    }

    return allAgents;
}

function log(agent, description, time) {
    if (time === undefined) { time = 0; }
    if (agent.log === undefined) { return; }
    agent.log.push(toHHMMSS(time) + " " + description);
}

function toResult(agents) {
    return agents.map(function (agent) {
        return agent.startTime + " " + agent.exitTime;
    });
}

function LogVisitToHeadquarters(lines) {
    var agents = visitToHeadquarters(lines);
    var resultLines = toResult(agents);
    resultLines.forEach(function (line) { console.log(line); });
}

//var fs = require("fs");
//var lines = fs.readFileSync(process.argv[2]).toString().split('\n');
//LogVisitToHeadquarters(lines);

var lines = [
    "A 09:00:00 0203 5 0210 10 0305 5 0604 10 0605 10 0901 10 0908 10",
    "B 09:00:25 0205 10 0404 5 0501 5 0602 5 0703 5 0807 5",
    "C 09:00:45 0109 10 0110 5 0207 5 0208 10 0401 10 0510 5",
    "D 09:01:15 0310 5 0404 5 0503 10 0603 5 0604 5 0704 10 0708 5 0910 5 1005 10",
];

var linesTest = [
    "N 09:00:00 0104 30 0108 15",
    "L 09:00:30 0107 15 0108 95",
];

var linesLarge = [
    "N 09:00:00 0104 30 0108 15 0201 15 0204 15 0209 5 0210 85 0302 65 0307 10 0308 15 0309 40 0402 25 0407 20 0408 20 0409 55 0704 45 0710 75 0804 55 0904 15 0906 5 0907 35 0910 25 1007 65 1008 40",
    "L 09:00:30 0107 15 0108 95 0205 90 0206 65 0208 70 0303 20 0305 85 0308 40 0309 45 0408 40 0410 20 0503 15 0504 25 0507 75 0607 80 0608 90 0705 85 0808 80 0907 80 1002 5 1004 5 1008 85",
    "P 09:01:40 0101 75 0102 80 0104 10 0206 70 0210 30 0303 60 0305 75 0309 50 0310 55 0409 55 0509 65 0602 55 0604 85 0706 90 0804 5 0808 35 0901 60 0903 5 0904 25 0908 70 0910 45 1003 20 1007 60",
    "I 09:01:55 0103 25 0202 60 0210 55 0306 90 0401 5 0402 50 0405 20 0406 35 0505 95 0508 20 0509 35 0510 25 0602 35 0605 5 0608 70 0707 95 0803 80 0808 30 0903 30 0904 70 0905 20 0906 20 0907 85 1006 25 1010 10",
    "Q 09:02:20 0101 35 0103 95 0104 55 0105 20 0107 60 0204 70 0307 10 0403 45 0406 65 0410 20 0506 60 0603 95 0606 75 0701 80 0703 55 0704 30 0809 65 0901 35 0906 25 0907 60 0910 95 1002 35 1003 80 1005 50",
    "K 09:02:50 0102 35 0104 75 0107 70 0203 50 0208 80 0310 25 0409 75 0502 70 0504 15 0506 25 0507 10 0509 25 0604 50 0701 65 0704 25 0810 75 0902 55 0907 35 0908 20 1002 15",
    "Z 09:04:05 0107 15 0109 75 0202 75 0204 60 0305 5 0306 80 0307 85 0308 50 0410 5 0503 40 0507 30 0601 25 0607 60 0609 95 0702 25 0704 25 0707 60 0710 20 0804 15 0902 70 0903 75 1001 40 1002 90 1006 65",
    "D 09:05:25 0109 55 0110 80 0306 35 0307 70 0409 55 0603 5 0606 60 0607 25 0608 90 0704 35 0802 90 0901 45 0902 70 0903 70 0904 70 0908 85 0910 80 1001 55 1005 5 1006 20",
    "C 09:06:00 0101 60 0104 55 0107 65 0109 10 0201 90 0210 5 0305 35 0309 10 0409 35 0501 15 0502 80 0506 95 0509 45 0605 70 0610 10 0708 25 0805 95 0806 40 0903 15 0910 5 1003 35 1009 5",
    "H 09:07:15 0101 20 0103 80 0105 75 0108 35 0110 25 0209 15 0306 30 0308 25 0501 85 0504 20 0606 90 0610 70 0703 60 0705 75 0707 90 0709 70 0801 90 0806 40 0807 35 0809 90 0901 75 0903 80 0909 95 1003 65 1009 45 1010 30",
    "J 09:08:30 0109 25 0110 75 0206 45 0208 70 0301 10 0305 40 0308 40 0401 40 0402 95 0407 90 0408 75 0409 20 0504 80 0510 90 0608 15 0702 70 0707 85 0802 75 0903 5 0910 55 1001 35 1002 35 1003 15 1004 55 1005 5 1007 65 1008 90",
    "V 09:08:50 0103 45 0306 95 0309 15 0405 10 0408 60 0410 65 0505 35 0507 65 0604 70 0607 15 0608 85 0609 25 0704 20 0707 90 0708 30 0808 75 0809 60 0907 70 1001 70 1004 45 1007 30",
    "G 09:09:50 0101 35 0107 45 0108 15 0202 75 0203 35 0206 95 0302 40 0306 85 0310 15 0407 20 0502 35 0503 30 0505 45 0508 85 0509 25 0608 55 0801 65 0906 85 0908 20 1003 60 1004 5",
    "W 09:11:10 0104 95 0204 60 0207 25 0209 5 0401 70 0402 70 0406 85 0506 55 0508 5 0510 5 0601 35 0609 25 0705 5 0803 25 0804 85 0809 65 0901 75 0903 20 0906 50 0908 65 0909 15 0910 80 1002 70 1007 70",
    "T 09:12:20 0104 35 0204 75 0206 15 0207 90 0208 20 0303 70 0308 90 0310 75 0401 50 0501 60 0506 95 0510 85 0601 40 0707 50 0708 80 0803 70 0806 75 0905 95 0909 30 1004 50 1010 45",
    "A 09:13:05 0101 75 0102 20 0105 50 0108 65 0209 90 0302 95 0303 85 0304 35 0404 65 0405 35 0603 80 0608 60 0702 40 0703 25 0707 55 0708 15 0801 70 0802 50 0808 15 0906 65 0909 70 1003 75 1005 65 1009 75",
    "S 09:13:10 0106 40 0107 15 0203 75 0208 50 0303 50 0401 80 0407 70 0410 90 0506 35 0510 20 0602 20 0604 20 0610 40 0708 30 0801 90 0808 30 0809 85 0903 10 0905 75 0907 80 1005 80 1006 90",
    "E 09:13:35 0102 60 0107 5 0108 45 0207 25 0302 15 0306 35 0401 35 0402 55 0409 55 0503 30 0505 95 0506 60 0507 35 0508 70 0602 20 0605 85 0701 40 0702 5 0708 50 0804 80 0810 85 1003 65 1005 90 1007 20 1009 60",
    "R 09:14:20 0102 55 0106 70 0109 20 0210 95 0301 25 0402 55 0405 65 0407 55 0410 95 0504 20 0505 5 0509 45 0510 75 0603 35 0606 95 0610 15 0706 20 0707 65 0708 30 0801 40 0802 5 0807 25 0904 20 0908 50 1008 50",
    "Y 09:14:55 0103 95 0210 15 0301 35 0302 5 0305 45 0406 30 0408 95 0409 10 0505 75 0508 15 0510 80 0706 60 0709 40 0710 55 0802 85 0803 35 0808 90 0901 40 1002 15 1003 5 1004 20 1006 10 1007 80",
    "B 09:15:35 0105 85 0110 15 0202 85 0205 55 0206 20 0209 5 0308 35 0310 60 0403 25 0404 10 0502 45 0503 50 0504 75 0506 45 0508 85 0610 40 0705 35 0706 45 0708 5 0709 90 0710 15 0803 30 0807 75 0809 60 0902 5 1007 75 1010 80",
    "O 09:16:35 0101 30 0107 85 0108 50 0109 70 0208 85 0308 75 0309 55 0401 35 0402 45 0403 10 0405 35 0507 75 0609 95 0703 35 0705 40 0710 50 0803 10 1002 65 1006 55 1007 35",
    "M 09:17:50 0102 40 0103 80 0104 10 0105 70 0107 50 0110 50 0205 30 0207 5 0210 80 0307 95 0309 75 0405 5 0501 15 0506 80 0508 65 0605 5 0701 60 0706 85 0804 20 0807 40 0808 5 0907 65 0909 85 1004 20",
    "X 09:18:25 0102 60 0204 65 0205 45 0206 25 0207 55 0209 50 0308 65 0401 85 0402 25 0501 70 0504 15 0510 50 0603 40 0605 50 0607 35 0701 35 0705 10 0901 40 0904 15 0907 95 1006 95 1008 85",
    "U 09:19:50 0101 25 0108 80 0304 35 0309 80 0401 85 0402 15 0403 5 0405 5 0409 60 0410 70 0503 70 0505 80 0602 60 0603 25 0607 65 0702 20 0708 5 0802 25 0804 35 0807 90 0903 80 0910 70 1004 65 1006 80",
    "F 09:20:50 0106 70 0110 10 0203 90 0205 55 0209 60 0302 25 0303 20 0308 80 0402 55 0403 45 0409 25 0410 75 0505 80 0509 55 0603 85 0607 90 0608 65 0709 10 0808 90 0901 65 0903 45 0904 35 0906 50 0907 75 1006 35"];

describe("Visit to the headquarters - ", function () {
    it("Time to seconds", function () {
        expect(timeToSeconds("09:00:00")).toEqual(32400);
        expect(timeToSeconds("09:00:25")).toEqual(32400 + 25);
        expect(timeToSeconds("09:01:15")).toEqual(32400 + 60 + 15);
    });

    it("to Room", function () {
        expect(toRoom("0203")).toEqual({ floor: 2, room: 203 });
        expect(toRoom("0708")).toEqual({ floor: 7, room: 708 });
        expect(toRoom("1002")).toEqual({ floor: 10, room: 1002 });
    });

    it("to Duration", function () {
        expect(toDuration("10")).toEqual(10);
        expect(toDuration("95")).toEqual(95);
    });

    it("Read Line A", function () {
        var agent = readLine(lines[0])

        expect(agent.id).toEqual("A");

        expect(agent.state).toEqual(STATE_MOVING);

        expect(agent.arrival).toEqual({ time: 32400 + 10, floor: 1, location: LIFT_UP });

        expect(agent.rooms).toEqual([
                { floor: 2, room: 203, duration: 5 },
                { floor: 2, room: 210, duration: 10 },
                { floor: 3, room: 305, duration: 5 },
                { floor: 6, room: 604, duration: 10 },
                { floor: 6, room: 605, duration: 10 },
                { floor: 9, room: 901, duration: 10 },
                { floor: 9, room: 908, duration: 10 },
                { floor: 1, room: 0, duration: 0 }
        ]);
    });

    it("Read Line B", function () {
        var agent = readLine(lines[1])

        expect(agent.id).toEqual("B");

        expect(agent.state).toEqual(STATE_MOVING);

        expect(agent.arrival).toEqual({ time: 32400 + 25 + 10, floor: 1, location: LIFT_UP });
    });

    it("Read Line C", function () {
        var agent = readLine(lines[2])

        expect(agent.id).toEqual("C");

        expect(agent.state).toEqual(STATE_MOVING);

        expect(agent.arrival).toEqual({ time: 32400 + 45 + 10, floor: 1, location: AT_ROOM });
    });

    it("Read Line D", function () {
        var agent = readLine(lines[3])

        expect(agent.id).toEqual("D");

        expect(agent.state).toEqual(STATE_MOVING);

        expect(agent.arrival).toEqual({ time: 32400 + 60 + 15 + 10, floor: 1, location: LIFT_UP });

        expect(agent.rooms).toEqual([
                { floor: 3, room: 310, duration: 5 },
                { floor: 4, room: 404, duration: 5 },
                { floor: 5, room: 503, duration: 10 },
                { floor: 6, room: 603, duration: 5 },
                { floor: 6, room: 604, duration: 5 },
                { floor: 7, room: 704, duration: 10 },
                { floor: 7, room: 708, duration: 5 },
                { floor: 9, room: 910, duration: 5 },
                { floor: 10, room: 1005, duration: 10 },
                { floor: 1, room: 0, duration: 0 }
        ]);
    });

    it("Read Lines", function () {
        var agents = readLines(lines);
        expect(agents.length).toEqual(4);
        expect(startTime(agents)).toEqual(32400 + 10);
    });

    it("eject Agents Out Of Lifts", function () {
        var lifts = {
            up: [{ id: "A", floor: 2, destination: 2 }, { id: "B", floor: 2.5, destination: 3 }, { id: "C", floor: 3, destination: 3 }],
            down: [{ id: "D", floor: 1, destination: 1 }, { id: "E", floor: 2, destination: 3 }, { id: "F", floor: 3.5, destination: 3 }]
        }

        ejectAgentsOutOfLifts(lifts);

        expect(lifts.up).toEqual([{ id: "B", floor: 2.5, destination: 3 }]);
        expect(lifts.down).toEqual([{ id: "E", floor: 2, destination: 3 }, { id: "F", floor: 3.5, destination: 3 }]);
    });

    it("eject Agents Out Of Rooms", function () {
        var rooms = [];
        rooms[123] = { id: "B", exitTime: 40000 };
        rooms[129] = { id: "C", exitTime: 40010 };
        rooms[999] = { id: "D", exitTime: 40000 };
        rooms[127] = { id: "E", exitTime: 39990 };

        ejectsAgentsOutOfRooms(rooms, 40000);

        expect(rooms[123]).toEqual(undefined);
        expect(rooms[129]).toEqual({ id: "C", exitTime: 40010 });
        expect(rooms[999]).toEqual(undefined);
        expect(rooms[127]).toEqual({ id: "E", exitTime: 39990 });
    });

    it("moveAgentsInLifts", function () {
        var lifts = {
            up: [{ id: "A", floor: 2, destination: 2 }, { id: "B", floor: 2.5, destination: 3 }, { id: "C", floor: 3, destination: 3 }],
            down: [{ id: "D", floor: 1, destination: 1 }, { id: "E", floor: 2, destination: 3 }, { id: "F", floor: 3.5, destination: 3 }]
        }

        moveAgentsInLifts(lifts);

        expect(lifts.up).toEqual([{ id: "A", floor: 2.5, destination: 2 }, { id: "B", floor: 3, destination: 3 }, { id: "C", floor: 3.5, destination: 3 }]);
        expect(lifts.down).toEqual([{ id: "D", floor: 0.5, destination: 1 }, { id: "E", floor: 1.5, destination: 3 }, { id: "F", floor: 3, destination: 3 }]);
    });

    it("is In A Room", function () {
        expect(isInARoom({ state: IN_ROOM })).toEqual(true);
        expect(isInARoom({ state: STATE_MOVING })).toEqual(false);
    });

    it("is Time To Leave Room", function () {
        var rooms = [];
        rooms[123] = { id: "B", exitTime: 40000 };
        rooms[127] = { id: "E", exitTime: 39990 };

        var agent1 = { id: "C", rooms: [{ room: 310 }, { room: 311 }] };
        var agent2 = { id: "E", rooms: [{ room: 127 }, { room: 311 }] };

        expect(isTimeToLeaveRoom(rooms, agent1)).toEqual(true);
        expect(isTimeToLeaveRoom(rooms, agent2)).toEqual(false);
    });

    it("leave Room", function () {
        var agent1 = { rooms: [{ room: 310 }, { room: 311 }] };
        var agent2 = { rooms: [{ room: 311 }] };

        leaveRoom(agent1);
        leaveRoom(agent2);

        expect(agent1.rooms).toEqual([{ room: 311 }]);
        expect(agent2.rooms).toEqual([]);
    });

    it("agent Needs To Move", function () {
        expect(agentNeedsToMove({ state: LEFT_ROOM })).toEqual(true);
        expect(agentNeedsToMove({ state: IN_ROOM })).toEqual(false);
        expect(agentNeedsToMove({ state: STATE_MOVING })).toEqual(false);
    });

    it("needs To Use Lift", function () {
        var agent1 = { floor: 1, rooms: [{ floor: 2 }, {}] };
        var agent2 = { floor: 2, rooms: [{ floor: 2 }, {}] };

        expect(needsToUseLift(agent1)).toEqual(true);
        expect(needsToUseLift(agent2)).toEqual(false);
    });

    it("moveToRoom", function () {
        var agent = { rooms: [{ floor: 1 }, {}] };
        moveToRoom(agent, 40000);
        expect(agent.state).toEqual(STATE_MOVING);
        expect(agent.arrival).toEqual({ time: 40000 + 10, floor: 1, location: AT_ROOM });
    });

    it("moveToLift", function () {
        var agent1 = { floor: 2, rooms: [{ floor: 1 }, {}] };
        moveToLift(agent1, 40000);
        expect(agent1.state).toEqual(STATE_MOVING);
        expect(agent1.arrival).toEqual({ time: 40000 + 10, floor: 2, location: LIFT_DOWN });

        var agent2 = { floor: 2, rooms: [{ floor: 3 }, {}] };
        moveToLift(agent2, 40000);
        expect(agent2.state).toEqual(STATE_MOVING);
        expect(agent2.arrival).toEqual({ time: 40000 + 10, floor: 2, location: LIFT_UP });
    });

    it("agentHasArrived", function () {
        var agent = { state: STATE_MOVING, arrival: { time: 40010, floor: 1, location: IN_ROOM } };

        expect(agentHasArrived(agent, 40010)).toEqual(true);
        expect(agentHasArrived(agent, 40020)).toEqual(false);
    });

    it("enterQueueState", function () {
        var agent1 = { state: STATE_MOVING, arrival: { time: 40010, floor: 1, location: AT_ROOM } };
        enterQueueState(agent1);
        expect(agent1.state).toEqual(IN_ROOM_QUEUE);

        var agent2 = { state: STATE_MOVING, arrival: { time: 40010, floor: 1, location: LIFT_DOWN } };
        enterQueueState(agent2);
        expect(agent2.state).toEqual(IN_LIFT_QUEUE);

        var agent3 = { state: STATE_MOVING, arrival: { time: 40010, floor: 1, location: LIFT_UP } };
        enterQueueState(agent3);
        expect(agent3.state).toEqual(IN_LIFT_QUEUE);
    });

    it("agentNeedsToEnterLift", function () {
        expect(agentNeedsToEnterLift({ state: STATE_MOVING })).toEqual(false);
        expect(agentNeedsToEnterLift({ state: IN_LIFT_QUEUE })).toEqual(true);
        expect(agentNeedsToEnterLift({ state: IN_ROOM })).toEqual(false);
        expect(agentNeedsToEnterLift({ state: IN_ROOM_QUEUE })).toEqual(false);
    });

    it("agentNeedsToEnterRoom", function () {
        expect(agentNeedsToEnterRoom({ state: STATE_MOVING })).toEqual(false);
        expect(agentNeedsToEnterRoom({ state: IN_LIFT_QUEUE })).toEqual(false);
        expect(agentNeedsToEnterRoom({ state: IN_ROOM })).toEqual(false);
        expect(agentNeedsToEnterRoom({ state: IN_ROOM_QUEUE })).toEqual(true);
    });

    it("liftIsFree", function () {
        var lifts = {
            up: [{ id: "A", floor: 2, destination: 2 }, { id: "B", floor: 2.5, destination: 3 }, { id: "C", floor: 3, destination: 3 }],
            down: [{ id: "D", floor: 1, destination: 1 }, { id: "E", floor: 2, destination: 3 }, { id: "F", floor: 3.5, destination: 3 }]
        }

        var agent1 = { arrival: { location: LIFT_UP, floor: 2 } };
        var agent2 = { arrival: { location: LIFT_UP, floor: 4 } };
        var agent3 = { arrival: { location: LIFT_DOWN, floor: 2 } };
        var agent4 = { arrival: { location: LIFT_DOWN, floor: 3 } };

        expect(liftIsFree(lifts, agent1)).toEqual(false);
        expect(liftIsFree(lifts, agent2)).toEqual(true);
        expect(liftIsFree(lifts, agent3)).toEqual(false);
        expect(liftIsFree(lifts, agent4)).toEqual(true);
    });

    it("enterLift", function () {
        var lifts = {
            up: [{ id: "A", floor: 2, destination: 2 }],
            down: [{ id: "D", floor: 1, destination: 1 }]
        }

        var agent2 = { id: "D", floor: 1, arrival: { location: LIFT_UP }, rooms: [{ floor: 4 }] };
        var agent4 = { id: "E", floor: 10, arrival: { location: LIFT_DOWN }, rooms: [{ floor: 2 }] };

        enterLift(lifts, agent2, 30000);
        enterLift(lifts, agent4, 30000);

        expect(lifts.up).toEqual([{ id: "A", floor: 2, destination: 2 }, { id: "D", floor: 1, destination: 4 }])
        expect(lifts.down).toEqual([{ id: "D", floor: 1, destination: 1 }, { id: "E", floor: 10, destination: 2 }])

        expect(agent2.state).toEqual(STATE_MOVING);
        expect(agent4.state).toEqual(STATE_MOVING);

        expect(agent2.arrival).toEqual({ time: 30000 + (3 * 10) + 10, floor: 4, location: AT_ROOM });
        expect(agent4.arrival).toEqual({ time: 30000 + (8 * 10) + 10, floor: 2, location: AT_ROOM });
    });

    it("roomIsFree", function () {
        var rooms = [];
        rooms[123] = { id: "B", exitTime: 40000 };
        rooms[129] = { id: "C", exitTime: 40010 };

        expect(roomIsFree(rooms, { rooms: [{ room: 124 }] })).toEqual(true);
        expect(roomIsFree(rooms, { rooms: [{ room: 123 }] })).toEqual(false);
    });

    it("enterRoom", function () {
        var rooms = [];
        rooms[123] = { id: "B", exitTime: 40000 };
        rooms[129] = { id: "C", exitTime: 40010 };

        var agent = { id: "E", rooms: [{ room: 124, duration: 25 }] }
        enterRoom(rooms, agent, 30000);

        expect(rooms[124]).toEqual({ id: "E", exitTime: 30000 + 25 });
        expect(agent.state).toEqual(IN_ROOM);
    });

    it("visitToHeadquarters", function () {
        var agents = visitToHeadquarters(lines);
        expect(agents[0].exitTime).toEqual("09:05:50");
        expect(agents[1].exitTime).toEqual("09:05:40");
        expect(agents[2].exitTime).toEqual("09:04:40");
        expect(agents[3].exitTime).toEqual("09:08:15");

        agents[0].history.forEach(function (h) {
            console.log(h.time + " " + h.location + " " + h.floor + " " + (h.room != -1 ? h.room : ""));
        });
    });

    it("visitToHeadquarters 1 agent", function () {
        var lines2 = [
            "A 09:00:00 0303 10",
        ];

        var agents = visitToHeadquarters(lines2);
        expect(agents[0].exitTime).toEqual("09:01:30");
    });

    it("visitToHeadquarters lift queue", function () {
        var lines2 = [
            "B 09:00:00 0305 10",
            "A 09:00:00 0303 10",
        ];

        var agents = visitToHeadquarters(lines2);
        expect(agents[1].id).toEqual("A");
        expect(agents[1].exitTime).toEqual("09:01:30");

        expect(agents[0].id).toEqual("B");
        expect(agents[0].exitTime).toEqual("09:01:35");
    });

    it("visitToHeadquarters room queue", function () {
        var lines2 = [
            "B 09:00:00 0105 10",
            "A 09:00:00 0105 10",
        ];

        var agents = visitToHeadquarters(lines2);
        expect(agents[1].id).toEqual("A");
        expect(agents[1].exitTime).toEqual("09:00:30");

        expect(agents[0].id).toEqual("B");
        expect(agents[0].exitTime).toEqual("09:00:40");
    });

    it("visitToHeadquarters linesLarge", function () {
        var agents = visitToHeadquarters(linesLarge);
        var resultLines = toResult(agents);
        expect(resultLines[0]).toEqual("09:00:00 09:21:20");
    });
});
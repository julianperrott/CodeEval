/* https://www.codeeval.com/open_challenges/142/

Visit to the Headquarters

Challenge Description:

The Department of Security has a new headquarters. The building has several floors, and on each floor there are rooms numbered XXYY, where XX stands for the floor number, YY for the room number, and XX > 0; YY <= 10. The building has paternoster – a passenger elevator, which consists of several cabins that move slowly up and down without stopping. From time to time, the agents visit the headquarters. During the visit they go to see several rooms and stay in each room for some time. Due to the security reasons, only one agent can be in the room at the same time. The same rule applies to the elevators, only one agent can be in the elevator at the same time. The visits are planned to be completed within one day. Each agent visits the headquarters once a day. 

The agent enters the building on the 1st floor, passes the reception, and visits the rooms according to his/her list. Agents always visit the rooms in the increasing room number. The agents form a linear hierarchy according to the personal codes that were assigned to them. Agents with higher seniority have smaller codes in lexicographical order. The two agents cannot have the same code. 

If there are more than one agent who wants to enter a room, or an elevator, they have to form a queue. The queue is formed according to the codes. The higher the seniority of the agent, the closer to the top of the queue he stands. Agents can enter the elevator every 5 seconds. There is a queue for up and down directions of the elevator on each floor. After visiting the last room in the headquarters, the agent uses elevator to the first floor (if necessary) and exits the building. 

The time necessary to move from one point in the headquarters to another is set as follows:
1.Entering the building (passing the reception and reaching the elevator or a room on the first floor) takes 10 seconds.
2.Exiting the building (stepping out of the elevator or a room on the first floor and passing the reception) takes 10 seconds.
3.On the same floor, the way from the elevator to the room (or to the queue in front of the room), or from the room to the elevator (or to the queue in front of the elevator), or from one room to another (or to the queue in front of the room) takes 10 seconds.
4.The way up or down from one floor to another using an elevator takes 10 seconds.

Write a program that determines time when the agent leaves the headquarters.

Input sample:

Your program should accept a filename as its first argument. Each line of the file contains the description of the agent visit. The description of each visit consists of agent's one character code (C), time (T) when the agent enters the headquarters, and the room numbers (XXYY) followed by the time in seconds (S) that agent may spend in the room. E.g. 
C T XXYY S XXYY S XXYY S ...

The time when the agent enters the headquarters is in the HH:MM:SS format. E.g. 

A 09:00:00 0203 5 0210 10 0305 5 0604 10 0605 10 0901 10 0908 10
B 09:00:25 0205 10 0404 5 0501 5 0602 5 0703 5 0807 5
C 09:00:45 0109 10 0110 5 0207 5 0208 10 0401 10 0510 5
D 09:01:15 0310 5 0404 5 0503 10 0603 5 0604 5 0704 10 0708 5 0910 5 1005 10

Output sample:

For each test case print out the time when agent entered the headquarters and the time when agent left the headquarters in the HH:MM:SS format separated by a single space. E.g. 

09:00:00 09:05:50
09:00:25 09:05:40
09:00:45 09:04:40
09:01:15 09:08:15

Constraints:
•S is in range [5, 100]
•C is in range [A, Z]

*/

"use strict";

var visitController = function ($interval) {
    var vm = this;
    vm.name = "admin";
    vm.roomsPerFloor = 10;
    vm.floors = [];

    vm.start = function () {
        $interval(function () { vm.forward(); }, 2000, 900);
    }

    for (var f = 1; f < 11; f++) {
        var floor = {
            floor: f, rooms: [], floorLower: f - 0.5
        };
        vm.floors.push(floor);
        for (var room = 1; room <= vm.roomsPerFloor; room++) {
            floor.rooms.push({
                name: room.toString(), agents: [], queue: []
            });
        }
    };

    vm.sortedFloors = vm.floors.slice(0).sort(function (a, b) {
        return a.floor < b.floor ? 1 : -1;
    })

    vm.agents = visitToHeadquarters(linesLarge);

    vm.endTime = vm.agents.reduce(function (max, agent) {
        return agent.history[agent.history.length - 1].time < max ? max : agent.history[agent.history.length - 1].time;
    }, 0);

    vm.startTime = vm.agents.reduce(function (min, agent) {
        return agent.history[0].time > min ? min : agent.history[0].time;
    }, 999999);
    vm.time = vm.startTime;

    function renderTime() {
        vm.outside = [];

        vm.finished = vm.agents
            .filter(function (agent) { return agent.history[agent.history.length - 1].time < vm.time; })
            .sort(function (a, b) { return a.history[a.history.length - 1].time < b.history[b.history.length - 1].time ? -1:1; })
            .map(function (agent) { return agent.id; });

        vm.pending = vm.agents
            .filter(function (agent) { return agent.history[0].time > vm.time; })
            .sort(function (a, b) { return a.history[0].time > b.history[0].time ? -1: 1; })
            .map(function (agent) { return agent.id; });

        vm.floors.forEach(function (floor) {
            // clear corridor
            floor.corridorToRoom = [];
            floor.corridorToLift = [];
            floor.corridorLeftRoom = [];
            floor.corridorLeftLift = [];

            // clear lift
            floor.liftUp = [];
            floor.liftUpQueue = [];
            floor.liftDown = [];
            floor.liftDownQueue = [];
            floor.liftUpLower = [];
            floor.liftDownLower = [];

            // clear rooms
            floor.rooms.forEach(function (room) {
                room.agents = [];
                room.queue = [];
            });
        });

        vm.agents.forEach(function (agent) {
            var historyEvents = agent.history.filter(function (h) {
                return h.time == vm.time
            });
            if (historyEvents.length > 1) {
                throw ("too many events found on agent for time");
            }
            if (historyEvents.length == 1) {
                var he = historyEvents[0];

                var floor = vm.floors[Math.floor(he.floor) - 1];
                var floorAbove = vm.floors[Math.floor(he.floor)];
                if (floor.floor != Math.floor(he.floor)) {
                    throw ("failed to find correct floor");
                }

                var room = [];
                if (he.room != undefined && he.room > 0) {
                    room = floor.rooms[he.room - 1];
                }

                var agentInfo = agent.id + "_" + he.nextRoom;

                switch (he.location) {
                    case IN_ROOM:
                        if (he.room == 0) {
                            vm.finished.push(agent.id);
                            break;
                        }
                        room.agents.push(agent.id + " (" + he.duration + " secs)");
                        break;
                    case LEFT_ROOM:
                        floor.corridorLeftRoom.push(agentInfo);
                        break;
                    case LEFT_LIFT:
                        floor.corridorLeftLift.push(agentInfo);
                        break;
                    case IN_ROOM_QUEUE:
                        room.queue.push(agent.id);
                        break;
                    case IN_LIFT_QUEUE_UP:
                        floor.liftUpQueue.push(agentInfo);
                        break;
                    case IN_LIFT_QUEUE_DOWN:
                        floor.liftDownQueue.push(agentInfo);
                        break;
                    case LIFT_UP:
                        if (Math.floor(he.floor) === he.floor) { floor.liftUp.push(agentInfo); }
                        else {
                            floorAbove.liftUpLower.push(agentInfo);
                        }
                        break;
                    case LIFT_DOWN:
                        if (Math.floor(he.floor) === he.floor) { floor.liftDown.push(agentInfo);; }
                        else {
                            floorAbove.liftDownLower.push(agentInfo);
                        }
                        break;
                    case CORRIDOR_TO_ROOM:
                        floor.corridorToRoom.push(agentInfo);
                        break;
                    case CORRIDOR_TO_LIFT:
                        floor.corridorToLift.push(agentInfo);
                        break;
                    case OUTSIDE:
                        vm.outside.push(agentInfo);
                        break;
                    default:
                        throw ("unknown location found");
                }
            };
        });
    }

    vm.back = function () {
        if (vm.time > vm.startTime) {
            vm.time -= 5;
            renderTime();
        }
    }

    vm.forward = function () {
        if (vm.time < vm.endTime) {
            vm.time += 5;
            renderTime();
        }
    }

    vm.checkEvents = function ($event) {
        if ($event.keyCode == 37) {
            vm.back();
        }
        if ($event.keyCode == 39) {
            vm.forward();
        }
    }

    vm.toHHMMSS = function (time) {
        return toHHMMSS(time);
    }

    vm.chooseStyle = function (agents, oneStyle, multipleStyle, defaultStyle) {
        if (agents.length == 0) {
            return defaultStyle == undefined ? "" : defaultStyle;
        }
        if (agents.length == 1) {
            return oneStyle;
        }
        return multipleStyle;
    }

    vm.showAgents = function (agents, prefix) {
        if (agents.length == 0) {
            return prefix;
        }

        return prefix == undefined ? agents.join(", ") : prefix + ": " + agents.join(", ");
    }

    renderTime();
};
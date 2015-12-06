/* https://www.codeeval.com/open_challenges/88/
Juggle Fest

Sponsoring Company: 

Challenge Description:
 
Many developers here at Yodle are avid jugglers. To celebrate their prowess we are organizing a Yodle Open JuggleFest, but we need your help planning it. There will be thousands of participants split into teams. Each team will attempt to complete a juggling circuit consisting of several tricks. 
Each circuit emphasizes different aspects of juggling, requiring hand to eye coordination (H), endurance (E) and pizzazz (P) in various amounts for successful completion. Each juggler has these abilities in various amounts as well. How good a match they are for a circuit is determined by the dot product of the juggler's and the circuit's H, E, and P values. The higher the result, the better the match. 
Each participant will be on exactly one team and there will be a distinct circuit for each team to attempt. Each participant will rank in order of preference their top X circuits. Since we would like the audiences to enjoy the performances as much as possible, when assigning jugglers to circuits we also want to consider how well their skills match up to the circuit. In fact we want to match jugglers to circuits such that no juggler could switch to a circuit that they prefer more than the one they are assigned to and be a better fit for that circuit than one of the other jugglers assigned to it. 
To help us create the juggler/circuit assignments write a program in a language of your choice that takes as input a file of circuits and jugglers and outputs a file of circuits and juggler assignments. The number of jugglers assigned to a circuit should be the number of jugglers divided by the number of circuits. Assume that the number of circuits and jugglers will be such that each circuit will have the same number of jugglers with no remainder. 

Input sample:

One line per circuit or juggler. All circuits will come before any jugglers. Circuit lines start with a C and juggler lines start with a J. Names of circuits and jugglers will never have spaces. A skill and the rating for that skill are separated by a colon. Circuit lines have the circuit names followed by skills. Juggler lines have the juggler names followed by skills, followed by circuits in order of preference, separated by commas. Example: 

C C0 H:7 E:7 P:10
C C1 H:2 E:1 P:1
C C2 H:7 E:6 P:4

J J0 H:3 E:9 P:2 C2,C0,C1
J J1 H:4 E:3 P:7 C0,C2,C1
J J2 H:4 E:0 P:10 C0,C2,C1
J J3 H:10 E:3 P:8 C2,C0,C1
J J4 H:6 E:10 P:1 C0,C2,C1
J J5 H:6 E:7 P:7 C0,C2,C1
J J6 H:8 E:6 P:9 C2,C1,C0
J J7 H:7 E:1 P:5 C2,C1,C0
J J8 H:8 E:2 P:3 C1,C0,C2
J J9 H:10 E:2 P:1 C1,C2,C0
J J10 H:6 E:4 P:5 C0,C2,C1
J J11 H:8 E:4 P:7 C0,C1,C2

Output sample:

You should have one line per circuit assignment. Each line should contain the circuit name followed by the juggler name, followed by that juggler's circuits in order of preference and the match score for that circuit. The line should include all jugglers matched to the circuit. The example below is a valid assignment for the input file above (has 3 lines). 

C2 J6 C2:128 C1:31 C0:188, J3 C2:120 C0:171 C1:31, J10 C0:120 C2:86 C1:21, J0 C2:83 C0:104 C1:17
C1 J9 C1:23 C2:86 C0:94, J8 C1:21 C0:100 C2:80, J7 C2:75 C1:20 C0:106, J1 C0:119 C2:74 C1:18
C0 J5 C0:161 C2:112 C1:26, J11 C0:154 C1:27 C2:108, J2 C0:128 C2:68 C1:18, J4 C0:122 C2:106 C1:23

Run your program on the input which contains 2000 circuits and 12000 jugglers. The correct output is the sum of the names of the jugglers (taking off the leading letter J) that are assigned to circuit C1970. So for example if the jugglers assigned to circuit C1970 were J1,J2,J3,J4,J5 and J6 the correct answer would be 

21 
*/
/*
var fs = require("fs");
var lines = fs.readFileSync(process.argv[2]).toString().split('\n');
console.log(juggleFest(lines));
*/

function dotProduct(a, b) {
    return a.reduce(function (sum, v, i) {
        return sum + (v * b[i]);
    }, 0);
}

function toCircuit(line) {
    var args = line.split(" ");
    return { id: toId(args), skills: toSkills(args) };
}

function toJuggler(line) {
    var args = line.split(" ");
    var preferences = args[5].split(",").map(function (v) { return parseInt(v.substr(1)) });
    return { id: toId(args), skills: toSkills(args), preferences: preferences };
}

function toId(args) { return parseInt(args[1].substr(1)); }

function toSkills(args) { return args.slice(2, 5).map(function (v) { return parseInt(v.split(":")[1]); }); }

function toJuggleArgs(lines) {
    var circuits = [];
    var jugglers = [];

    lines.forEach(function (line) {
        if (line.substr(0, 1) == "C") {
            var circuit = toCircuit(line);
            circuits[circuit.id] = circuit;
        }
        else if (line.substr(0, 1) == "J") {
            var juggler = toJuggler(line);
            jugglers[juggler.id] = juggler;
        }
    });

    return { circuits: circuits, jugglers: jugglers };
}

function calculateCircuitPreferences(juggleArgs) {
    var circuitPreferences = [];

    juggleArgs.jugglers.forEach(function (j, jugglerIndex) {
        j.preferences.forEach(function (preference, preferenceIndex) {
            var score = dotProduct(j.skills, juggleArgs.circuits[preference].skills);
            if (circuitPreferences[preference] === undefined) { circuitPreferences[preference] = []; }
            circuitPreferences[preference].push({ juggler: jugglerIndex, preference: preferenceIndex, score: score });
        });
    });

    return circuitPreferences.map(function (prefs) {
        return prefs === undefined ? [] : sortByScore(prefs);
    });
}

function sortByScore(scores) {
    return scores.sort(function (a, b) { return b.score - a.score; });
}

function juggleFest(lines) {
    var juggleArgs = toJuggleArgs(lines);
    var circuitPreferences = calculateCircuitPreferences(juggleArgs);
    var maxPreference = juggleArgs.jugglers.reduce(function (max, juggler) { return max > juggler.preferences.length ? max : juggler.preferences.length; }, 0);
    var circuitCount = juggleArgs.circuits.filter(function (v) { return v !== undefined; }).length;
    var capacity = juggleArgs.jugglers.length / circuitCount;
    var circuitsAllocation = [];
    var jugglerCircuit = [];

    allocationsMade = true;

    circuitPreferences.forEach(function (c, circuitIndex) { circuitsAllocation[circuitIndex] = []; });

    while (allocationsMade) {

        // allocate for the highest preference until we can't allocate anymore
        for (var preferenceIndex = 0; preferenceIndex < maxPreference; preferenceIndex++) {
            allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
            if (allocationsMade) { break; }
        }

        // return a computed result if circuit 1970 is filled
        if (circuitsAllocation[1970] !== undefined && circuitsAllocation[1970].length === capacity) {
            return circuitsAllocation[1970].reduce(function (acc, v) { return acc + v; }, 0)
        }
    }

    return circuitsAllocation;
}


function assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitsWithPreferences, capacity) {

    var allocationsMade = false;

    // go through the circuits and allocate up to capacity
    circuitsWithPreferences.forEach(function (jugglersWithAPreferenceForThisCircuit, circuitIndex) {

        if (circuitsAllocation[circuitIndex].length < capacity) { // circuit is not full

            var jugglersToCheck = capacity - circuitsAllocation[circuitIndex].length;

            jugglersWithAPreferenceForThisCircuit
                .filter(function (candidateJuggler) { return jugglerCircuit[candidateJuggler.juggler] === undefined; }) // not allocated jugglers only
                .forEach(function (candidateJuggler, index) {
                    if (index >= jugglersToCheck) { return; }// only check potential jugglers to the capacity
                    if (candidateJuggler.preference <= preferenceIndex) {
                        jugglerCircuit[candidateJuggler.juggler] = circuitIndex; // allocate to circuit to juggler
                        circuitsAllocation[circuitIndex].push(candidateJuggler.juggler); // allocate to juggler to circuit
                        allocationsMade = true;
                    }
                });
        }
    });

    return allocationsMade;
}




describe("Juggle Fest - ", function () {

    var lines = [
        "C C0 H:7 E:7 P:10",
        "C C1 H:2 E:1 P:1",
        "C C2 H:7 E:6 P:4",
        "",
        "J J0 H:3 E:9 P:2 C2,C0,C1",
        "J J1 H:4 E:3 P:7 C0,C2,C1",
        "J J2 H:4 E:0 P:10 C0,C2,C1",
        "J J3 H:10 E:3 P:8 C2,C0,C1",
        "J J4 H:6 E:10 P:1 C0,C2,C1",
        "J J5 H:6 E:7 P:7 C0,C2,C1",
        "J J6 H:8 E:6 P:9 C2,C1,C0",
        "J J7 H:7 E:1 P:5 C2,C1,C0",
        "J J8 H:8 E:2 P:3 C1,C0,C2",
        "J J9 H:10 E:2 P:1 C1,C2,C0",
        "J J10 H:6 E:4 P:5 C0,C2,C1",
        "J J11 H:8 E:4 P:7 C0,C1,C2"]

    var lines1970_1 = [
        "C C0 H:7 E:7 P:10",
        "C C1970 H:2 E:1 P:1",
        "C C2 H:7 E:6 P:4",
        "",
        "J J0 H:3 E:9 P:2 C2,C0,C1970",
        "J J1 H:4 E:3 P:7 C0,C2,C1970",
        "J J2 H:4 E:0 P:10 C0,C2,C1970",
        "J J3 H:10 E:3 P:8 C2,C0,C1970",
        "J J4 H:6 E:10 P:1 C0,C2,C1970",
        "J J5 H:6 E:7 P:7 C0,C2,C1970",
        "J J6 H:8 E:6 P:9 C2,C1970,C0",
        "J J7 H:7 E:1 P:5 C2,C1970,C0",
        "J J8 H:8 E:2 P:3 C1970,C0,C2",
        "J J9 H:10 E:2 P:1 C1970,C2,C0",
        "J J10 H:6 E:4 P:5 C0,C2,C1970",
        "J J11 H:8 E:4 P:7 C0,C1970,C2"]

    var lines1970_2 = [
        "C C0 H:7 E:7 P:10",
        "C C1 H:2 E:1 P:1",
        "C C1970 H:7 E:6 P:4",
        "",
        "J J0 H:3 E:9 P:2 C1970,C0,C1",
        "J J1 H:4 E:3 P:7 C0,C1970,C1",
        "J J2 H:4 E:0 P:10 C0,C1970,C1",
        "J J3 H:10 E:3 P:8 C1970,C0,C1",
        "J J4 H:6 E:10 P:1 C0,C1970,C1",
        "J J5 H:6 E:7 P:7 C0,C1970,C1",
        "J J6 H:8 E:6 P:9 C1970,C1,C0",
        "J J7 H:7 E:1 P:5 C1970,C1,C0",
        "J J8 H:8 E:2 P:3 C1,C0,C1970",
        "J J9 H:10 E:2 P:1 C1,C1970,C0",
        "J J10 H:6 E:4 P:5 C0,C1970,C1",
        "J J11 H:8 E:4 P:7 C0,C1,C1970"]

    it("dotProduct 1", function () { expect(dotProduct([1, 3, -5], [4, -2, -1])).toEqual(3) });
    it("dotProduct 2", function () { expect(dotProduct([1, 2, 3], [4, -5, 6])).toEqual(12) });
    it("dotProduct 3", function () { expect(dotProduct([-4, -9], [-1, 2])).toEqual(-14) });

    it("toCircuit 1", function () { expect(toCircuit("C C0 H:7 E:7 P:10")).toEqual({ id: 0, skills: [7, 7, 10] }) });
    it("toCircuit 2", function () { expect(toCircuit("C C1 H:2 E:1 P:1")).toEqual({ id: 1, skills: [2, 1, 1] }) });
    it("toCircuit 3", function () { expect(toCircuit("C C2 H:7 E:6 P:4")).toEqual({ id: 2, skills: [7, 6, 4] }) });

    it("toJuggler 1", function () { expect(toJuggler("J J0 H:3 E:9 P:2 C2,C0,C1")).toEqual({ id: 0, skills: [3, 9, 2], preferences: [2, 0, 1] }) });

    it("toJuggleArgs", function () {
        var juggleArgs = toJuggleArgs(lines);
        expect(juggleArgs.circuits.length).toEqual(3);
        expect(juggleArgs.jugglers.length).toEqual(12);
    });

    it("calculateCircuitPreferences", function () {
        var juggleArgs = toJuggleArgs(lines);
        var circuitPreferences = calculateCircuitPreferences(juggleArgs);

        expect(circuitPreferences[0]).toEqual([{ juggler: 6, preference: 2, score: 188 }, { juggler: 3, preference: 1, score: 171 }, { juggler: 5, preference: 0, score: 161 }, { juggler: 11, preference: 0, score: 154 }, { juggler: 2, preference: 0, score: 128 }, { juggler: 4, preference: 0, score: 122 }, { juggler: 10, preference: 0, score: 120 }, { juggler: 1, preference: 0, score: 119 }, { juggler: 7, preference: 2, score: 106 }, { juggler: 0, preference: 1, score: 104 }, { juggler: 8, preference: 1, score: 100 }, { juggler: 9, preference: 2, score: 94 }]);
        expect(circuitPreferences[1]).toEqual([{ juggler: 3, preference: 2, score: 31 }, { juggler: 6, preference: 1, score: 31 }, { juggler: 11, preference: 1, score: 27 }, { juggler: 5, preference: 2, score: 26 }, { juggler: 4, preference: 2, score: 23 }, { juggler: 9, preference: 0, score: 23 }, { juggler: 8, preference: 0, score: 21 }, { juggler: 10, preference: 2, score: 21 }, { juggler: 7, preference: 1, score: 20 }, { juggler: 1, preference: 2, score: 18 }, { juggler: 2, preference: 2, score: 18 }, { juggler: 0, preference: 2, score: 17 }]);
        expect(circuitPreferences[2]).toEqual([{ juggler: 6, preference: 0, score: 128 }, { juggler: 3, preference: 0, score: 120 }, { juggler: 5, preference: 1, score: 112 }, { juggler: 11, preference: 2, score: 108 }, { juggler: 4, preference: 1, score: 106 }, { juggler: 9, preference: 1, score: 86 }, { juggler: 10, preference: 1, score: 86 }, { juggler: 0, preference: 0, score: 83 }, { juggler: 8, preference: 2, score: 80 }, { juggler: 7, preference: 0, score: 75 }, { juggler: 1, preference: 1, score: 74 }, { juggler: 2, preference: 1, score: 68 }]);
    });

    it("sortByScore", function () {
        var result = sortByScore([{ juggler: 0, preference: 1, score: 104 }, { juggler: 1, preference: 0, score: 119 }, { juggler: 2, preference: 0, score: 128 }, { juggler: 3, preference: 1, score: 171 }, { juggler: 4, preference: 0, score: 122 }, { juggler: 5, preference: 0, score: 161 }, { juggler: 6, preference: 2, score: 188 }, { juggler: 7, preference: 2, score: 106 }, { juggler: 8, preference: 1, score: 100 }, { juggler: 9, preference: 2, score: 94 }, { juggler: 10, preference: 0, score: 120 }, { juggler: 11, preference: 0, score: 154 }]);
        expect(result).toEqual([{ juggler: 6, preference: 2, score: 188 }, { juggler: 3, preference: 1, score: 171 }, { juggler: 5, preference: 0, score: 161 }, { juggler: 11, preference: 0, score: 154 }, { juggler: 2, preference: 0, score: 128 }, { juggler: 4, preference: 0, score: 122 }, { juggler: 10, preference: 0, score: 120 }, { juggler: 1, preference: 0, score: 119 }, { juggler: 7, preference: 2, score: 106 }, { juggler: 0, preference: 1, score: 104 }, { juggler: 8, preference: 1, score: 100 }, { juggler: 9, preference: 2, score: 94 }]);
    });

    it("assignJugglersForPreference 0", function () {


        var juggleArgs = toJuggleArgs(lines);
        var circuitPreferences = calculateCircuitPreferences(juggleArgs);

        var circuitsAllocation = [];
        circuitPreferences.forEach(function (c, circuitIndex) { circuitsAllocation[circuitIndex] = []; });
        var jugglerCircuit = [];
        var preferenceIndex = 0;
        var capacity = 4;

        // round 1
        var allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(true);
        expect(circuitsAllocation[0]).toEqual([5, 11]);
        expect(circuitsAllocation[1]).toEqual([9]);
        expect(circuitsAllocation[2]).toEqual([6, 3]);

        // round 2
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(true);
        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0]);

        // round 3
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(false);
        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0]);
    });

    it("assignJugglersForPreference 1", function () {
        var juggleArgs = toJuggleArgs(lines);
        var circuitPreferences = calculateCircuitPreferences(juggleArgs);
        var circuitsAllocation = [];
        circuitPreferences.forEach(function (c, circuitIndex) { circuitsAllocation[circuitIndex] = []; });
        var jugglerCircuit = [];
        var preferenceIndex = 0;
        var capacity = 4;

        // round 1 + 2
        while (assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity)) { };

        // round 3
        preferenceIndex = 1;
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(true);
        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8, 7]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0, 10]);

        // round 4
        preferenceIndex = 0;
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(false);

        // round 5
        preferenceIndex = 1;
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(false);
        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8, 7]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0, 10]);

        // round 6
        preferenceIndex = 2;
        allocationsMade = assignJugglersForPreference(circuitsAllocation, jugglerCircuit, preferenceIndex, circuitPreferences, capacity);
        expect(allocationsMade).toEqual(true);
        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8, 7, 1]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0, 10]);
    });

    it("juggleFest lines", function () {
        var circuitsAllocation = juggleFest(lines);

        expect(circuitsAllocation[0]).toEqual([5, 11, 2, 4]);
        expect(circuitsAllocation[1]).toEqual([9, 8, 7, 1]);
        expect(circuitsAllocation[2]).toEqual([6, 3, 0, 10]);
    });

    it("juggleFest lines1970_1", function () {
        expect(juggleFest(lines1970_1)).toEqual(9 + 8 + 7 + 1);
    });

    it("juggleFest lines1970_2", function () {
        expect(juggleFest(lines1970_2)).toEqual(6 + 3 + 0 + 10);
    });
})


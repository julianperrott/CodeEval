/* https://www.codeeval.com/open_challenges/151/

CRACKING EGGS
CHALLENGE DESCRIPTION:

You have a N story building and K eggs. They are especially strong eggs so they're able to withstand impact up to a certain number of floors.

Your goal is to identify the number of drops you need make to determine number of floors it can withstand.

INPUT SAMPLE:

The first argument will be a path to a filename containing a space separated list of 2 integers, first one is number eggs, second one - number of floors. E.g.

2 100
OUTPUT SAMPLE:

The output contains one integer - the worst worst case upper bound on the number of drops you must make to determine this floor.

14
*/
function crackingEggs(line) {
    var args = line.split(" ");
    var eggs = parseInt(args[0], 10);
    var floors = parseInt(args[1], 10);
    var cnt = 0;
    while (floorMax(eggs, cnt) < floors) { cnt++; }
    return cnt;
}

function floorMax(eggs, cnt) {
    var drops = 0;
    if (eggs==1) { return cnt;}
    for (var i = 0; i < cnt; i++) { drops += floorMax(eggs - 1, i) + 1; }
    return drops;
}

describe("floorMax", function () {
    it("7 0", function () { expect(floorMax(7, 0)).toEqual(0); });
    it("7 1", function () { expect(floorMax(7, 1)).toEqual(1); });
    it("7 2", function () { expect(floorMax(7, 2)).toEqual(3); });
    it("7 3", function () { expect(floorMax(7, 3)).toEqual(7); });
    it("7 4", function () { expect(floorMax(7, 4)).toEqual(15); });
    it("7 5", function () { expect(floorMax(7, 5)).toEqual(31); });
    it("7 6", function () { expect(floorMax(7, 6)).toEqual(63); });
    it("7 7", function () { expect(floorMax(7, 7)).toEqual(127); });
    it("7 8", function () { expect(floorMax(7, 8)).toEqual(254); });
});

describe("crackingEggs", function () {
    it("3 100", function () {
        expect(crackingEggs("3 100")).toEqual(9);
    });

    it("2 100", function () {
        expect(crackingEggs("2 100")).toEqual(14);
    });

    it("7 1600", function () {
        expect(crackingEggs("7 1600")).toEqual(11);
    });
});

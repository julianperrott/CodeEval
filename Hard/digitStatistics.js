/* https://www.codeeval.com/open_challenges/144/

DIGIT STATISTICS
CHALLENGE DESCRIPTION:

Given the numbers "a" and "n" find out how many times each digit from zero to nine is the last digit of the number in a sequence [ a, a2, a3, ... an-1, an ]

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line of input contains two space separated integers "a" and "n" E.g: 

2 5
OUTPUT SAMPLE:

For each line of input print out how many times the digits zero, one, two ... nine occur as the last digit of numbers in the sequence E.g:

0: 0, 1: 0, 2: 2, 3: 0, 4: 1, 5: 0, 6: 1, 7: 0, 8: 1, 9: 0
In this example, the sequence consists of numbers 2, 4, 8, 16 and 32. Among the last digits, the digit two occurs twice, and each of the digits four, six and eight occurs once.

Constraints: 
1 ≤ n ≤ 1 000 000 000 000,
2 ≤ a ≤ 9

*/
function digitStatistics(line) {
    var digitMap = [
        [[], []],
        [[], []],
        [[2, 4, 8, 6], [0, 1, 3, 5, 7, 9]],
        [[3, 9, 7, 1], [0, 2, 4, 5, 6, 8]],
        [[4, 6], [0, 1, 2, 3, 5, 7, 8, 9]],
        [[5], [0, 1, 2, 3, 4, 6, 7, 8, 9]],
        [[6], [0, 1, 2, 3, 4, 5, 7, 8, 9]],
        [[7, 9, 3, 1], [0, 2, 4, 5, 6, 8]],
        [[8, 4, 2, 6], [0, 1, 3, 5, 7, 9]],
        [[9, 1], [0, 2, 3, 4, 5, 6, 7, 8]]
    ];

    var args = line.split(" ");
    var a = parseInt(args[0], 10);
    var n = parseInt(args[1], 10);

    var digitRange = digitMap[a][0];
    var div = Math.floor(n / digitRange.length);
    var mod = n % digitRange.length;

    return Array.apply(null, { length: digitRange.length })
        .map(function (x, i) { return [digitRange[i], div + (i < mod ? 1 : 0)]; })
        .concat(digitMap[a][1].map(function (n) { return [n, 0]; }))
        .sort(function (a, b) { return a[0] > b[0] ? 1 : -1; })
    .map(function (x) { return x[0] + ": " + x[1]; })
    .join(", ");
}


describe("digitStatistics", function () {            
    it("1", function () { expect(digitStatistics("5 440753953974")).toEqual("0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 440753953974, 6: 0, 7: 0, 8: 0, 9: 0"); });
    it("2", function () { expect(digitStatistics("5 917037257207")).toEqual("0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 917037257207, 6: 0, 7: 0, 8: 0, 9: 0"); });
    it("3", function () { expect(digitStatistics("7 879574178476")).toEqual("0: 0, 1: 219893544619, 2: 0, 3: 219893544619, 4: 0, 5: 0, 6: 0, 7: 219893544619, 8: 0, 9: 219893544619"); });
    it("4", function () { expect(digitStatistics("4 43127267275")).toEqual("0: 0, 1: 0, 2: 0, 3: 0, 4: 21563633638, 5: 0, 6: 21563633637, 7: 0, 8: 0, 9: 0"); });
    it("5", function () { expect(digitStatistics("3 91119881546")).toEqual("0: 0, 1: 22779970386, 2: 0, 3: 22779970387, 4: 0, 5: 0, 6: 0, 7: 22779970386, 8: 0, 9: 22779970387"); });
    it("6", function () { expect(digitStatistics("2 103975287223")).toEqual("0: 0, 1: 0, 2: 25993821806, 3: 0, 4: 25993821806, 5: 0, 6: 25993821805, 7: 0, 8: 25993821806, 9: 0"); });
    it("7", function () { expect(digitStatistics("2 300497978750")).toEqual("0: 0, 1: 0, 2: 75124494688, 3: 0, 4: 75124494688, 5: 0, 6: 75124494687, 7: 0, 8: 75124494687, 9: 0"); });
    it("8", function () { expect(digitStatistics("7 365085818434")).toEqual("0: 0, 1: 91271454608, 2: 0, 3: 91271454608, 4: 0, 5: 0, 6: 0, 7: 91271454609, 8: 0, 9: 91271454609"); });
    it("9", function () { expect(digitStatistics("7 345596346067")).toEqual("0: 0, 1: 86399086516, 2: 0, 3: 86399086517, 4: 0, 5: 0, 6: 0, 7: 86399086517, 8: 0, 9: 86399086517"); });
    it("10", function () { expect(digitStatistics("5 467634585126")).toEqual("0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 467634585126, 6: 0, 7: 0, 8: 0, 9: 0"); });
    it("11", function () { expect(digitStatistics("9 571591857521")).toEqual("0: 0, 1: 285795928760, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 285795928761"); });
    it("12", function () { expect(digitStatistics("8 331501781944")).toEqual("0: 0, 1: 0, 2: 82875445486, 3: 0, 4: 82875445486, 5: 0, 6: 82875445486, 7: 0, 8: 82875445486, 9: 0"); });
});
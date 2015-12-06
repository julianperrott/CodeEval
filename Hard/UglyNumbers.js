/* https://www.codeeval.com/open_challenges/42/
    UGLY NUMBERS

     CHALLENGE DESCRIPTION:

    Credits: This challenge has appeared in a google competition before.
    Once upon a time in a strange situation, people called a number ugly if it was divisible by any of the one-digit primes (2, 3, 5 or 7). Thus, 14 is ugly, but 13 is fine. 39 is ugly, but 121 is not. Note that 0 is ugly. Also note that negative numbers can also be ugly: -14 and -39 are examples of such numbers.

    One day on your free time, you are gazing at a string of digits, something like:

        123456
    You are amused by how many possibilities there are if you are allowed to insert plus or minus signs between the digits. For example you can make:
        1 + 234 - 5 + 6 = 236
    which is ugly. Or

    123 + 4 - 56 = 71
    which is not ugly.

    It is easy to count the number of different ways you can play with the digits: Between each two adjacent digits you may choose put a plus sign, a minus sign, or nothing. Therefore, if you start with D digits there are 3^(D-1) expressions you can make. Note that it is fine to have leading zeros for a number. If the string is '01023', then '01023', '0+1-02+3' and '01-023' are legal expressions.

    Your task is simple: Among the 3^(D-1) expressions, count how many of them evaluate to an ugly number.

    INPUT SAMPLE:

    Your program should accept as its first argument a path to a filename. Each line in this file is one test case. Each test case will be a single line containing a non-empty string of decimal digits. The string in each test case will be non-empty and will contain only characters '0' through '9'. Each string is no more than 13 characters long. E.g.

    1
    9
    011
    12345
    OUTPUT SAMPLE:

    Print out the number of expressions that evaluate to an ugly number for each test case, each one on a new line. E.g.

    0
    1
    6
    64
*/

function countZeros(line) {
    for (var i = 0; i < line.length; i++) {
        if (line.substring(i, i + 1) !== "0") { return i; }
    };
    return line.length;
}

function isUgly(n) {
    return n % 2 === 0 || n % 3 === 0 || n % 5 === 0 || n % 7 === 0 ? 1 : 0;
};

function calcTotal(ob) {
    var accInt = parseInt(ob.acc,10);

    if (ob.sign === "+") { return ob.total + accInt; }
    return ob.total - accInt;
};

function procSum(ob, nextChar) {
    var newTotal = calcTotal(ob);

    return [{ total: ob.total, sign: ob.sign, acc: ob.acc + nextChar },
        { total: newTotal, sign: "+", acc: nextChar },
        { total: newTotal, sign: "-", acc: nextChar }];
}

function recOperators(paths, remainder) {
    if (remainder.length === 0) {
        return paths.map(function (ob) { return calcTotal(ob); });
    }

    var ar = paths.map(function (ob) {
        return procSum(ob, remainder.substring(0, 1));
    });

    return recOperators([].concat.apply([], ar), remainder.substring(1));
};

function uglyNumbers(line) {
    var zc = countZeros(line);
    var nl = line.substring(zc);

    if (line.length === zc) {
        return Math.pow(3, zc - 1);
    };

    var n = recOperators([{ total: 0, sign: '+', acc: nl.substring(0, 1) }], nl.substring(1))
        .reduce(function (acc, n) {
            return acc + isUgly(n);
        }, 0);

    var p = Math.pow(3, zc);
    return p * n;
}

describe("countZeros", function () {
    it("0", function () { expect(countZeros("0")).toEqual(1); });
    it("0000", function () { expect(countZeros("0000")).toEqual(4); });
    it("1000", function () { expect(countZeros("1000")).toEqual(0); });
    it("001000", function () { expect(countZeros("001000")).toEqual(2); });
});

describe("isUgly", function () {
    it("-2", function () { expect(isUgly("-2")).toEqual(1); });
    it("-5", function () { expect(isUgly("-5")).toEqual(1); });
    it("-11", function () { expect(isUgly("-11")).toEqual(0); });
    it("2", function () { expect(isUgly("2")).toEqual(1); });
    it("4", function () { expect(isUgly("3")).toEqual(1); });
    it("5", function () { expect(isUgly("5")).toEqual(1); });
    it("7", function () { expect(isUgly("8")).toEqual(1); });
    it("11", function () { expect(isUgly("11")).toEqual(0); });
});

describe("calcTotal", function () {
    it("7+23", function () { expect(calcTotal({ total: 7, sign: '+', acc: "23" })).toEqual(30); });
    it("7-23", function () { expect(calcTotal({ total: 7, sign: '-', acc: "23" })).toEqual(-16); });
});

describe("procSum", function () {
    var expected = [{ total: 7, sign: "+", acc: "234" },
        { total: 30, sign: "+", acc: "4" },
        { total: 30, sign: "-", acc: "4" }];

    it("1", function () { expect(procSum({ total: 7, sign: '+', acc: "23" }, "4")).toEqual(expected); });
});

describe("recOperators", function () {
    it("1", function () { expect(recOperators([{ total: 0, sign: '+', acc: "1" }], "23")).toEqual([123, 15, 9, 24, 6, 0, -22, 2, -4]); });
});

describe("uglyNumbers", function () {
    it("0", function () { expect(uglyNumbers("0")).toEqual(1); });
    it("1", function () { expect(uglyNumbers("1")).toEqual(0); });
    it("9", function () { expect(uglyNumbers("9")).toEqual(1); });
    it("011", function () { expect(uglyNumbers("011")).toEqual(6); });
    it("12345", function () { expect(uglyNumbers("12345")).toEqual(64); });
    it("045", function () { expect(uglyNumbers("045")).toEqual(6); });
    it("0000000000277", function () { expect(uglyNumbers("0000000000277")).toEqual(413343); });

    it("18870690", function () { expect(uglyNumbers("18870690")).toEqual(1815); });
    it("0568836", function () { expect(uglyNumbers("0568836")).toEqual(588); });
    it("04", function () { expect(uglyNumbers("04")).toEqual(3); });
    it("85", function () { expect(uglyNumbers("85")).toEqual(2); });

    it("57083779", function () { expect(uglyNumbers("57083779")).toEqual(1651); });

    it("a", function () { expect(uglyNumbers("85")).toEqual(2); });
    it("b", function () { expect(uglyNumbers("87")).toEqual(2); });
    it("c", function () { expect(uglyNumbers("93")).toEqual(3); });
    it("d", function () { expect(uglyNumbers("7444092353")).toEqual(15062); });
    it("e", function () { expect(uglyNumbers("586663")).toEqual(191); });
    it("g", function () { expect(uglyNumbers("5330")).toEqual(19); });
    it("h", function () { expect(uglyNumbers("13")).toEqual(2); });
    it("i", function () { expect(uglyNumbers("7087856491")).toEqual(15088); });
    it("j", function () { expect(uglyNumbers("922393988")).toEqual(5071); });
    it("k", function () { expect(uglyNumbers("9441369642")).toEqual(15606); });
    it("l", function () { expect(uglyNumbers("90")).toEqual(3); });

    it("8180", function () { expect(uglyNumbers("81080")).toEqual(39); });

});
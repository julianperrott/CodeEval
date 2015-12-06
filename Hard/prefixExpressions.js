/* https://www.codeeval.com/open_challenges/7/

    PREFIX EXPRESSIONS
    CHALLENGE DESCRIPTION:

        You are given a prefix expression. Write a program which evaluates it.

        INPUT SAMPLE:

        Your program should accept a file as its first argument. The file contains one prefix expression per line.

        For example:

        * + 2 3 4
    Your program should read this file and insert it into any data structure you like. Traverse this data structure and evaluate the prefix expression. Each token is delimited by a whitespace. You may assume that sum ‘+’, multiplication ‘*’ and division ‘/’ are the only valid operators appearing in the test data.

    OUTPUT SAMPLE:

        Print to stdout the output of the prefix expression, one per line.

        For example:

        20
    CONSTRAINTS:

        The evaluation result will always be an integer ≥ 0.
    The number of the test cases is ≤ 40.
*/

function prefixExpr(line) {
    var args = line.split(" ");
    var eCnt = Math.floor(args.length / 2);
    var eArgs = args.slice(0, eCnt).reverse();
    var nums = args.slice(eCnt).map(function (s) { return parseInt(s); })

    var s = nums.shift();

    return Math.floor(Array.apply(null, { length: eCnt })
        .reduce(function (acc, cv, i) {
            if (eArgs[i] == "*") { return acc * nums[i]; }
            if (eArgs[i] == "+") { return acc + nums[i] }
            return acc / nums[i];
        }, s));
}

describe("prefixExpr", function () {
    it("1", function () { expect(prefixExpr("+ * + * 9 1 6 7 9")).toEqual(114) });
    it("2", function () { expect(prefixExpr("* * + + + * + + + * * / / * * / * * / 8 1 0 5 8 8 0 4 1 4 9 4 5 7 9 6 2 2 0 5")).toEqual(0) });
    it("3", function () { expect(prefixExpr("* + / + * * 1 8 6 9 6 0 2")).toEqual(19) });
    it("4", function () { expect(prefixExpr("* + + * + * + + / / * 5 9 2 5 8 1 1 7 9 4 6 6")).toEqual(1167) });
    it("5", function () { expect(prefixExpr("* + * * + / * / * + / + / 0 9 3 3 5 4 7 0 5 8 7 4 3 9")).toEqual(2043) });
    it("6", function () { expect(prefixExpr("+ / * + / + + * * / + + 6 8 0 2 5 0 0 8 2 4 3 1 1")).toEqual(25) });
    it("7", function () { expect(prefixExpr("* + 2 3 4")).toEqual(20) });
    it("8", function () { expect(prefixExpr("/ * + 9 1 6 6")).toEqual(10) });
    it("9", function () { expect(prefixExpr("+ + + * + / / * * * + * / / * + * + * * * * 5 2 4 6 0 2 7 4 8 9 5 6 8 1 8 9 1 6 1 0 0 5 3")).toEqual(8) });
    it("10", function () { expect(prefixExpr("+ + / + + * * * * / + / * * / / 9 6 1 0 8 4 9 3 3 2 2 7 2 5 7 0 1")).toEqual(38) });
    it("11", function () { expect(prefixExpr("+ + * + 3 4 2 4 7")).toEqual(25) });
    it("12", function () { expect(prefixExpr("/ * / * / * / + / + + * * / * + 7 5 1 8 4 6 1 2 7 4 9 0 9 7 3 2 1")).toEqual(0) });
    it("13", function () { expect(prefixExpr("/ 8 4")).toEqual(2) });
    it("14", function () { expect(prefixExpr("* * + + + * * + * + / / * / / + + / * / 3 6 5 4 3 0 9 6 5 2 1 7 6 3 0 1 0 8 7 8 9")).toEqual(1080) });
    it("15", function () { expect(prefixExpr("/ * + + * 8 4 0 4 6 1")).toEqual(216) });
    it("16", function () { expect(prefixExpr("+ / * / * + + + * / * 2 0 7 0 9 5 5 8 4 6 6 3")).toEqual(41) });
    it("17", function () { expect(prefixExpr("+ / * * / * * + / / + / / * * / + + / * + 1 9 5 4 8 2 2 4 4 8 6 0 6 5 5 6 7 1 3 0 7 3")).toEqual(3) });
    it("18", function () { expect(prefixExpr("* * 3 8 0")).toEqual(0) });
    it("19", function () { expect(prefixExpr("* * / 8 5 6 5")).toEqual(48) });
    it("20", function () { expect(prefixExpr("+ * + 8 0 3 2")).toEqual(26) });
    it("21", function () { expect(prefixExpr("* * + * * 8 9 9 4 3 1")).toEqual(1956) });
    it("22", function () { expect(prefixExpr("/ * * * * / + + + + 7 6 3 8 8 6 9 5 1 1 4")).toEqual(60) });
    it("23", function () { expect(prefixExpr("* * * + / + + + + + / * 1 0 8 8 4 6 4 7 4 1 6 2 5")).toEqual(495) });
    it("24", function () { expect(prefixExpr("/ * 0 2 6")).toEqual(0) });
    it("25", function () { expect(prefixExpr("* * + / * * + * * / + + * * / * * * + + * / / 1 4 2 3 8 2 6 3 7 7 0 2 6 0 5 4 8 0 9 5 4 7 9 1")).toEqual(3950) });
    it("26", function () { expect(prefixExpr("+ + + + + + + + + / 0 9 7 4 0 7 6 1 8 7 8")).toEqual(48) });
    it("27", function () { expect(prefixExpr("* + + * + / * + + * * * + / / * * * * + * * * 8 1 2 4 4 6 7 7 0 4 3 1 5 6 2 9 5 5 9 7 3 2 1 0")).toEqual(0) });
    it("28", function () { expect(prefixExpr("* * / * + * + / / + / / * 3 8 2 1 9 2 2 0 6 9 7 8 0 8")).toEqual(0) });
    it("29", function () { expect(prefixExpr("* * * + * + + 4 0 0 7 7 8 0 3")).toEqual(0) });
    it("30", function () { expect(prefixExpr("+ + * * * / / / * * * / + / + / / + * * / * * * + + 1 2 9 0 8 7 7 5 6 9 6 1 2 5 7 3 0 4 2 8 5 4 8 6 9 3 3")).toEqual(6) });
    it("31", function () { expect(prefixExpr("* 0 0")).toEqual(0) });
    it("32", function () { expect(prefixExpr("/ 4 4")).toEqual(1) });
    it("33", function () { expect(prefixExpr("* + * + / + / / * 0 3 1 9 2 9 3 9 5 4")).toEqual(136) });
    it("34", function () { expect(prefixExpr("* * + * / * * + + * + / + 2 5 8 2 6 2 8 4 7 9 7 6 5 0")).toEqual(0) });
    it("35", function () { expect(prefixExpr("* + * + * / + + / + + + / * / + / * + / + / / * 2 1 3 2 0 6 9 5 8 6 5 4 5 4 8 4 3 2 3 7 9 0 9 7 0")).toEqual(0) });
    it("36", function () { expect(prefixExpr("+ + * + + / * + * 5 6 0 9 8 6 2 0 9 3")).toEqual(12) });
    it("37", function () { expect(prefixExpr("+ / + * * + 5 3 9 1 8 5 1")).toEqual(17) });
    it("38", function () { expect(prefixExpr("+ + + * 0 5 9 9 1")).toEqual(19) });
    it("39", function () { expect(prefixExpr("/ * + + + 1 7 8 5 2 2")).toEqual(21) });
    it("40", function () { expect(prefixExpr("+ 0 8")).toEqual(8) });
});
function fizzbuzz(line) {
    var args = line.split(" ");
    var fizz = parseInt(args[0]);
    var buzz = parseInt(args[1]);
    var max = parseInt(args[2]);

    return Array.apply(null, { length: max })
        .map(Number.call, Number)
        .map(function (n) {
            n++;
            if (n % fizz != 0 && n % buzz != 0) { return n; }
            return (n % fizz == 0 ? "F" : "") + ( n % buzz == 0 ? "B" : "")
        })
        .join(" ");
}

describe("", function () {
    it("3 5 10", function () {
        expect(fizzbuzz("3 5 10")).toEqual("1 2 F 4 B F 7 8 F B");
    });
    it("2 7 15", function () {
        expect(fizzbuzz("2 7 15")).toEqual("1 F 3 F 5 F B F 9 F 11 F 13 FB 15");
    });
});
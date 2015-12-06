/* https://www.codeeval.com/open_challenges/44/

    FOLLOWING INTEGER
    CHALLENGE DESCRIPTION:

    Credits: This challenge has appeared in a past google competition 

    You are writing out a list of numbers.Your list contains all numbers with exactly Di digits in its decimal representation which are equal to i, for each i between 1 and 9, inclusive. You are writing them out in ascending order. For example, you might be writing every number with two '1's and one '5'. Your list would begin 115, 151, 511, 1015, 1051. Given N, the last number you wrote, compute what the next number in the list will be. The number of 1s, 2s, ..., 9s is fixed but the number of 0s is arbitrary.

    INPUT SAMPLE:

        Your program should accept as its first argument a path to a filename. Each line in this file is one test case. Each test case will contain an integer n < 10^6. E.g.

    115
    842
    8000
    OUTPUT SAMPLE:

        For each line of input, generate a line of output which is the next integer in the list. E.g.

    151
    2048
    80000
*/

function followingInteger(line) {
    // handle longer integer required.
    if (isMax(line)) {
        return AddZero(line);
    }
    return increaseInteger(line);
}

function increaseInteger(line) {
    // determine if the first digit must change
    if (isMax(line.substring(1))) {
        return replaceFirstDigit(line);
    }

    return line.substring(0, 1) + increaseInteger(line.substring(1));
};

function replaceFirstDigit(line) {
    var firstChar = line.substring(0, 1);

    var sorted = line.substring(1).split("").sort();

    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i] > firstChar) {
            var newFirstChar = sorted[i];
            sorted.splice(i, 1);
            sorted.push(firstChar);
            sorted.sort();
            sorted.splice(0, 0, newFirstChar);
            return sorted.join("");
        }
    }
}

function isMax(line) {
    return line == line.split("").sort().reverse().join("");
}

function AddZero(line) {
    var result = removeZeros(line);

    while (result.length < line.length + 1) {
        result.splice(1, 0, "0");
    };

    return result.join("");
}

function removeZeros(line) {
    return line
        .split("")
        .filter(function (value) { return value != "0"; })
        .sort();
}


describe("Following Integer", function () {
    it("51100", function () {
        expect(followingInteger("51100")).toEqual("100015");
    });

    it("511", function () {
        expect(followingInteger("511")).toEqual("1015");
    });

    it("1432", function () {
        expect(followingInteger("1432")).toEqual("2134");
    });

    it("71239", function () {
        expect(followingInteger("71239")).toEqual("71293");
    });

    it("115", function () {
        expect(followingInteger("115")).toEqual("151");
    });

    it("151", function () {
        expect(followingInteger("151")).toEqual("511");
    });

    it("511", function () {
        expect(followingInteger("511")).toEqual("1015");
    });

    it("1015", function () {
        expect(followingInteger("1015")).toEqual("1051");
    });

    it("842", function () {
        expect(followingInteger("842")).toEqual("2048");
    });

    it("8000", function () {
        expect(followingInteger("8000")).toEqual("80000");
    });
});
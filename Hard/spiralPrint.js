/* https://www.codeeval.com/open_challenges/57/

    SPIRAL PRINTING

    CHALLENGE DESCRIPTION:

    Write a program to print a 2D array (n x m) in spiral order (clockwise)

    INPUT SAMPLE:

    Your program should accept as its first argument a path to a filename. The input file contains several lines. Each line is one test case. Each line contains three items (semicolon delimited). The first is 'n'(rows), the second is 'm'(columns) and the third is a single space separated list of characters/numbers in row major order. E.g.

    3;3;1 2 3 4 5 6 7 8 9
    OUTPUT SAMPLE:

    Print out the matrix in clockwise fashion, one per line, space delimited. E.g.

    1 2 3 6 9 8 7 4 5
*/

function spiralPrint(line) {
    var args = line.split(";");
    var rows = parseInt(args[0], 10);
    var cols = parseInt(args[1], 10);

    var arr = args[2].split(" ");
    var i = 0;
    var grid = [];
    while (i < arr.length) { grid.push(arr.slice(i, i += cols)); }

    return sprint(0, []).join(" ");

    function sprint(loop, path) {
        var vlen = rows - 2 - (2 * loop);
        var varray = vlen < 1 ? [] : Array.apply(null, { length: rows - 2 - (2 * loop) });

        var top = rows - loop <= loop ? [] : grid[loop].slice(loop, cols - loop)
        var down = cols - 1 - loop < loop ? [] : varray.map(function (x, i) { return grid[i + 1 + loop][cols - 1 - loop] });
        var bot = rows - 1 - loop <= loop ? [] : grid[rows - 1 - loop].slice(loop, cols - loop).reverse();
        var up = cols - 1 - loop <= loop ? [] : varray.map(function (x, i) { return grid[i + 1 + loop][loop] }).reverse();

        var newpath = path.concat(top).concat(down).concat(bot).concat(up);
        if (newpath.length == path.length) { return path; }
        return sprint(loop + 1, newpath);
    };
}

describe("spiralPrint", function () {
    it("1", function () {
        expect(spiralPrint("3;3;1 2 3 4 5 6 7 8 9")).toEqual("1 2 3 6 9 8 7 4 5");
    });

    it("2", function () {
        expect(spiralPrint("4;7;1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28")).toEqual("1 2 3 4 5 6 7 14 21 28 27 26 25 24 23 22 15 8 9 10 11 12 13 20 19 18 17 16");
    });

    it("3", function () {
        expect(spiralPrint("10;3;a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D")).toEqual("a b c f i l o r u x A D C B y v s p m j g d e h k n q t w z");
    });

    it("4", function () {
        expect(spiralPrint("4;3;1 2 3 4 5 6 7 8 9 10 11 12")).toEqual("1 2 3 6 9 12 11 10 7 4 5 8");
    });
});

/*
1 2 3
4 5 6
7 8 9
10 11 12

1 2 3,6 9,12 11 10,7 4
5,8
*/
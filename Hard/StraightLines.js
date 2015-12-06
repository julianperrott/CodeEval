/* https://www.codeeval.com/open_challenges/204/

Straight lines

Challenge Description:

It’s high time you remembered geometry lessons at school: graphs, coordinates, shapes, and others.
 You have the coordinates of the points. The point location is determined by X and Y coordinate system. Your task is to count how many straight lines that will cross three or more points you can create.
 For example, in the figure #1, the number of such lines is one, while in the figures #2 and #3, we can create two lines. 
 
Input sample:

The first argument is a path to a file. Each line includes a test case with point coordinates that are separated by the pipe symbol '|'. Point coordinates might be negative; they are in a range from -20 to 20. 

For example: 

1 1 | 1 2 | 1 4 | 3 2
1 1 | 1 2 | 1 4 | 3 2 | 4 2
1 2 | 1 4 | 2 3 | 3 2 | 3 4

Output sample:

Print the number of lines that cross three or more points in a straight line. 

For example: 

1
2
2

Constraints:
1. A straight line is a line that contains three or more coordinate points. That is, if you add a point with coordinates [2, 2] to the figure #2, there will be two straight lines anyway. 
2.Point coordinates can be in a range from -20 to 20.
3.The number of test cases is 40.

*/

function collinear(xx, yy, x1, y1, x3, y3) {
    return yy * (x1 - x3) === (y1 - y3) * xx;
}

function straightLines(line) {
    var coords = line.split("|").map(function (arg) {
        return arg.trim().split(" ").map(function (v) { return parseInt(v); });
    });

    var x = 0;
    var y = 1;

    var lines = [];

    function alreadyFound(i, j, k) {
        var linesWith2 = lines.filter(function (v) {
            return (v.indexOf(i) > -1 ? 1 : 0) + (v.indexOf(j) > -1 ? 1 : 0) + (v.indexOf(k) > -1 ? 1 : 0) > 1;
        });

        if (linesWith2.length === 0) { return false; }

        linesWith2[0].push(i);
        linesWith2[0].push(j);
        linesWith2[0].push(k);
        
        return true;
    }

    for (var i = 0; i < coords.length - 2; i++) {
        for (var j = i + 1; j < coords.length - 1; j++) {
            var yy = coords[i][y] - coords[j][y];
            var xx = coords[i][x] - coords[j][x];

            for (var k = j + 1; k < coords.length; k++) {
                if (collinear(xx, yy, coords[i][x], coords[i][y], coords[k][x], coords[k][y])) {

                    if (!alreadyFound(i, j, k)) {
                        lines.push([i, j, k]);
                    }
                }
            }
        }
    }

    return lines.length;
}


describe("straight Lines",function(){
    it("1",function(){ expect(straightLines("1 1 | 1 2 | 1 4 | 3 2")).toEqual(1); });
    it("2",function(){ expect(straightLines("1 1 | 1 2 | 1 4 | 3 2 | 4 2")).toEqual(2); });
    it("3", function () { expect(straightLines("1 2 | 1 4 | 2 3 | 3 2 | 3 4")).toEqual(2); });

    it("4", function () { expect(straightLines("11 -18 | -13 -4 | 4 9")).toEqual(0); });
    it("5", function () { expect(straightLines("5 9 | -6 19 | -8 -18 | 13 15 | 7 -4 | -20 17 | 20 -19 | 3 -16 | -6 4 | -6 -9 | 11 -6 | -4 -11 | -12 0 | 19 12")).toEqual(1); });
    it("6", function () { expect(straightLines("-9 6 | -13 -12 | 16 16 | -16 -7 | 18 -11 | 11 13 | 14 5 | -1 -13 | -19 7 | 3 -19 | 9 14 | -19 3 | -14 15 | 5 -6 | 13 -9 | 2 -5 | -4 17")).toEqual(1); });
    it("7", function () { expect(straightLines("16 -12 | -11 -2 | -5 15 | -12 -4 | -6 -6 | -4 10 | 14 0 | 9 -3 | 7 -9")).toEqual(1); });
    it("8", function () { expect(straightLines("-13 12 | -6 9 | 13 8 | -20 -5 | -12 4 | 5 13 | -5 20 | -7 -17 | 8 0 | -15 -5 | -19 -18 | 14 19 | -19 -19 | -1 -18 | -10 -20 | 0 4 | 15 20 | 19 15 | -18 -4 | 19 16 | -19 -6 | 18 -7 | -16 8 | 3 -2 | -18 -19")).toEqual(1); });
    it("9", function () { expect(straightLines("-11 -10 | 17 0 | -19 -13 | 5 20 | 6 4 | 5 3 | 13 -4 | -15 17 | -11 -2 | 6 7 | 15 20 | 11 -14 | 6 15 | 13 19 | 11 -12 | -12 -20 | -8 0 | -4 8 | -18 12 | -7 -14 | 17 -6 | 8 12 | 11 -11 | 3 17 | -6 -18 | 9 12 | 16 -5 | -9 19 | -19 -17")).toEqual(5); });
    it("10", function () { expect(straightLines("-13 -15 | 1 4 | 14 -15 | -11 13 | 1 15 | 11 8 | -12 11 | -14 -15 | 18 18 | 3 14 | -15 13 | -3 -7 | 11 -13 | 2 -12 | 14 -3 | 11 -18 | 14 5")).toEqual(4); });
    it("11", function () { expect(straightLines("-8 12 | 2 -13 | -15 -15 | 0 -1 | 5 6 | -15 -7 | 6 -8 | -20 -19 | -18 7 | -12 16 | -7 0 | 5 -3 | -12 1 | -15 -11 | -15 10 | 1 20 | -11 8 | 4 -9 | -4 -2 | -10 -8")).toEqual(2); });
    it("12", function () { expect(straightLines("5 -3 | -19 -14 | 12 -18 | 13 10 | -19 -2 | -18 -17 | -9 -12 | -8 4 | -13 -13 | -20 14 | 12 -11 | 5 -11")).toEqual(1); });
    it("13", function () { expect(straightLines("-4 -10 | 0 -13 | -7 -9 | 6 11 | 1 1 | -6 -8 | -8 5 | -15 12 | -4 5 | -6 16 | 2 -12 | 12 -11 | -10 18 | 16 1 | 5 3 | -19 10 | 1 -14 | -18 -18 | -13 -11 | 5 13")).toEqual(3); });
    it("14", function () { expect(straightLines("13 -7 | -18 -15 | -18 -14 | 13 1 | -18 10 | -10 13")).toEqual(1); });
    it("15", function () { expect(straightLines("15 -4 | 20 -1 | -6 10 | 13 -4 | 8 -8")).toEqual(0); });
    it("16", function () { expect(straightLines("-9 -18 | 0 -6 | 10 9 | 6 -10 | 8 -1 | -1 9 | -16 14 | 16 13 | -10 -19 | 14 3 | 13 -10")).toEqual(1); });
    it("17", function () { expect(straightLines("17 -14 | 4 -19 | 12 6 | 9 6 | 7 -5 | 18 0 | -10 -14 | 3 0 | 0 5 | -12 12 | 6 -13 | 11 -20 | 20 2 | -15 13 | 0 15 | 3 9 | 13 0 | -19 -1 | 15 10 | -5 5")).toEqual(1); });
    it("18", function () { expect(straightLines("17 13 | -17 -14 | 14 -10 | 1 -5 | -18 -4 | 12 -19 | 13 1 | -8 12 | 2 -3 | -12 1 | 7 8 | -20 -15 | 6 -11 | -8 -5 | -8 7 | -16 -20 | 16 -18 | 2 -2 | 15 9 | -13 6 | -20 3 | -5 8 | -10 2 | 10 -12 | 15 1 | -7 -13 | 14 19")).toEqual(8); });
    it("19", function () { expect(straightLines("0 0 | -20 0 | -20 -10 | 0 -10 | -10 0 | -10 -20 | -10 -10 | -20 -20 | 0 -20")).toEqual(8); });
    it("20", function () { expect(straightLines("0 -3 | 6 5 | 17 5 | 5 4 | -20 -6 | 16 -7 | 11 6 | 16 11 | -13 16 | -15 -12 | 14 -4 | 8 -17 | 14 -12 | -2 -7")).toEqual(1); });
    it("21", function () { expect(straightLines("15 14 | 20 -6 | 17 8 | 20 20 | 20 12 | -7 16 | 16 12 | -15 -12 | -8 5 | 15 -19 | 20 7 | 6 1 | 11 17 | 6 12 | -16 -18 | -5 11 | 3 -10 | -8 -4 | 20 -20 | 10 12 | -16 -6 | -16 -7 | -5 -20")).toEqual(5); });
    it("22", function () { expect(straightLines("-2 4 | -18 19 | -16 2 | -19 3 | -11 -5 | -7 5 | 16 19 | 2 0 | 2 -10 | 11 -5 | -11 4 | -19 -16 | -4 5 | 9 -13 | -8 -7 | -13 17 | -11 2 | -19 7 | -19 0 | -6 13 | -13 -10 | 13 16 | -20 -11 | -6 9 | 14 0 | -15 -12 | 4 -7 | 0 -20")).toEqual(8); });
    it("23", function () { expect(straightLines("-6 5 | 18 -10 | 1 -7 | -3 18 | -10 -18 | -9 11 | 18 13 | -10 -12 | 16 18 | -7 -2 | -8 5 | 11 2 | -19 -10 | 13 -15 | 11 11 | -2 -1 | -18 0 | 8 1 | 20 8 | -2 -19 | 18 18 | -3 13 | -3 4 | -10 -9 | 8 15 | 8 -11 | 10 16")).toEqual(10); });
    it("24", function () { expect(straightLines("1 1 | 1 3 | 1 4 | 3 3")).toEqual(1); });
    it("25", function () { expect(straightLines("-7 -8 | -2 8 | -20 -7")).toEqual(0); });
    it("26", function () { expect(straightLines("10 20 | 15 9 | -2 7 | -11 7 | -20 -1 | -15 -12 | 14 9 | -4 5 | 0 -8 | 10 2 | -16 -9 | -4 14 | -19 10")).toEqual(0); });
    it("27", function () { expect(straightLines("19 19 | -13 -4 | -16 -20 | -15 11 | 9 -14 | -3 -12 | 0 -15 | 15 19 | 10 6 | -13 13 | -9 -7 | 5 -8 | -20 -7 | 13 6 | -18 -1 | -17 3")).toEqual(1); });
    it("28", function () { expect(straightLines("17 8 | 4 -13 | 18 -14 | 20 -8 | 10 -14 | -1 -3 | 15 6 | -16 -13 | 9 11 | 17 -6 | 3 -4 | 16 -19 | -8 1 | -18 -18 | 8 -11 | 1 -4 | 17 9 | 14 -17 | -1 -7 | -15 17 | -2 17 | 20 -4 | -2 -10")).toEqual(7); });
    it("29", function () { expect(straightLines("-14 -3 | 10 -7 | 0 -8 | 1 12")).toEqual(0); });
    it("30", function () { expect(straightLines("-2 -10 | -19 9 | 12 -3 | 1 6 | -18 -5 | -15 2 | 4 -8 | -12 2 | -11 -6 | -6 -17 | -2 3 | 3 -5 | 17 14")).toEqual(1); });
    it("31", function () { expect(straightLines("20 13 | -3 -3 | 3 12 | -10 14 | 9 -12 | -5 -14 | 16 -2 | 17 -6")).toEqual(0); });
    it("32", function () { expect(straightLines("-20 -5 | 1 -5 | 6 17 | -7 18 | -5 -6 | -19 -14 | 7 -1 | 13 -15 | 13 -13 | -3 7 | 9 14 | 13 10 | 14 -11 | 2 5 | 14 6 | -8 -6 | -15 -5 | -6 11 | -12 9")).toEqual(4); });
    it("33", function () { expect(straightLines("12 9 | 6 14 | 20 15 | -17 15")).toEqual(0); });
    it("34", function () { expect(straightLines("16 -3 | -12 0 | 11 -18 | 3 7 | 5 14 | 13 20 | 18 4 | 4 1 | -9 -19 | -12 -18 | 15 0 | 7 -9 | -2 -18 | 2 13 | -19 6 | -1 -19 | -20 2 | -19 -5 | 18 -10 | -14 9 | -13 6 | 14 -14")).toEqual(3); });
    it("35", function () { expect(straightLines("16 10 | 18 15 | 10 7 | -14 17 | -16 15 | -13 -11 | 19 -20")).toEqual(0); });
    it("36", function () { expect(straightLines("18 -20 | -6 18 | -11 3 | 3 5 | -8 3 | -1 -2 | -14 13 | -16 -9 | -1 4 | -18 -1 | -11 4 | 4 -5 | 2 -15")).toEqual(1); });
    it("37", function () { expect(straightLines("-11 1 | -13 6 | -16 11 | 19 7 | 19 16 | -7 -4 | 2 -2 | 16 8")).toEqual(1); });
    it("38", function () { expect(straightLines("17 20 | 1 -7 | -20 12 | -18 13 | -10 5 | -2 -4 | -2 -18 | 6 -18 | -3 -8 | 13 5 | 12 -14 | 16 -3 | -15 -10 | -13 19 | -15 3 | 8 17 | -15 11 | 19 15 | 2 1 | 8 8")).toEqual(1); });
    it("39", function () { expect(straightLines("-14 8 | -15 5 | -17 -12 | -13 16 | 16 -1")).toEqual(0); });
    it("40", function () { expect(straightLines("-4 -5 | -20 11 | 0 1 | 8 -3 | 18 -18 | 1 -11 | -18 -12 | -7 1 | -12 10 | -14 8")).toEqual(1); });
    it("41", function () { expect(straightLines("1 1 | 1 3 | 1 4 | 3 3 | 4 3")).toEqual(2); });
    it("42", function () { expect(straightLines("-8 -6 | 1 -14 | 3 -17 | -6 -15 | -6 10")).toEqual(0); });
    it("43", function () { expect(straightLines("-14 20 | 6 10 | 11 -19 | 5 0 | 13 14 | 0 2 | 13 16 | 2 -7 | 20 4")).toEqual(0); });

});


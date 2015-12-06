/* https://www.codeeval.com/open_challenges/72/
Minimum Path Sum

Challenge Description:

You are given an n*n matrix of integers. You can move only right and down. Calculate the minimal path sum from the top left to the bottom right 

Input sample:

Your program should accept as its first argument a path to a filename. The first line will have the value of n(the size of the square matrix). This will be followed by n rows of the matrix. (Integers in these rows will be comma delimited). After the n rows, the pattern repeats. E.g. 
2
4,6
2,8
3
1,2,3
4,5,6
7,8,9

Output sample:

Print out the minimum path sum for each matrix. E.g. 
14
21

*/

function minPathSum(grid) {
    var col, row;
    if (grid.length === 0) { return 0; }

    var a = [[]];
    a[0].push(grid[0][0]);

    //populate path right (first row)
    for (col = 1; col < grid.length; col++) {
        a[0].push(a[0][col - 1] + grid[0][col]);
    }

    // calculate shorted path to each cell
    for (row = 1; row < grid.length; row++) {
        a.push([a[row - 1][0] + grid[row][0]]);
        for (col = 1; col < grid.length; col++) {
            a[row].push(Math.min(a[row][col - 1] + grid[row][col], a[row - 1][col] + grid[row][col]));
        }
    }

    // return shortest path to the final cell
    return a[grid.length - 1][grid.length - 1];
}

function toIntArray(line) {
    return line.split(",").map(function (v) { return parseInt(v.trim()); });
}

function toGrids(lines) {
    var i = 0;
    var linesArray = lines.split('\n');
    var results = [];

    while (i < linesArray.length) {
        var len = parseInt(linesArray[i]);
        var gridLines = linesArray.slice(i + 1, i + 1 + len);
        var grid = gridLines.map(toIntArray);
        results.push(grid);
        i += 1 + len;
    }
    return results;
}

describe("minPathSum", function () {
    it("2x2", function () { expect(minPathSum([[4, 6], [2, 8]])).toEqual(14); });
    it("3x3", function () { expect(minPathSum([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual(21); });
});

describe("toGrids", function () {
    var lines = "4\n84, 368, 211, 443\n205, 150, 157, 107\n72, 178, 15, 404\n278, 136, 284, 301\n3\n2, 484, 255\n238, 56, 478\n483, 396, 326";
    it("2 grids", function () { expect(toGrids(lines)).toEqual([[[84, 368, 211, 443], [205, 150, 157, 107], [72, 178, 15, 404], [278, 136, 284, 301]], [[2, 484, 255], [238, 56, 478], [483, 396, 326]]]); });
});

describe("minPathSum", function () {
    var lines = "2\n4,6\n2,8\n3\n1,2,3\n4,5,6\n7,8,9";
    var sums = toGrids(lines).map(minPathSum);
    it("2 grids", function () { expect(sums).toEqual([14, 21]); });
});



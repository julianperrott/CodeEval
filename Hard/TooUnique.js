/* https://www.codeeval.com/open_challenges/162/

Too unique

Challenge Description:

You are given a matrix of size N×M elements, filled with lowercase ASCII letters from ‘a’ to ‘z’. Find the max size of rectangular contiguous submatrix of unique (i.e. non repeated within a given submatrix) elements. Find all submatrices of unique elements of this size and replace their elements with asterisks ‘*’. 

Input sample:

The first argument is a file that contains the input matrix. E.g. 
rzqicaiiaege
ccwnulljybtu
jxtxupauwuah
oqikzgqrzpdq
vblalwdjbdwn
ahjeencuclbo

Output sample:

Print to stdout the result of the matrix with replaced elements, where all elements of the biggest submatrixes of unique elements are replaced with asterisks ‘*’. E.g. 
rzqicaiiae**
ccwnulljyb**
jxtx***uwu**
oqik****zp**
vbla****bd**
ahje****cl**

Constraints:
1.The size of matrix in the input is 60×20 elements.

*/
function tooUnique(grid) {
    var scores = search(grid);
    replace(grid, scores);
    return grid;
}

function replace(grid, scores) {
    var stars="************************************************************";
    scores.forEach(function(score){
        for (var row = score.y; row < score.y + score.depth; row++) {
            grid[row] = grid[row].substr(0, score.x) + stars.substr(0, score.width) + grid[row].substr(score.x + score.width);
        }
    });
}

function search(grid) {
    var bestScores = [];
    var x, y;
    for (x = 0; x < grid[0].length; x++) {
        for (y = 0; y < grid.length; y++) {
            searchAtCoordinate(grid, x, y, bestScores);
        }
    }
    return bestScores;
}

function searchAtCoordinate(grid, x, y, bestScores) {
    var newScores = score(grid, x, y, 0, grid[0].length - x, grid.length - y, []);
    submitScores(bestScores, newScores);
}

function submitScores(bestScores, newScores) {
    if (bestScores.length > 0) {
        if (newScores[0].score < bestScores[0].score) {
            return;
        }
        if (newScores[0].score > bestScores[0].score) {
            while (bestScores.length) { bestScores.pop(); }
        }
    }
    newScores.forEach(function (s) { bestScores.push(s); });
}

function score(grid, x, y, size, maxWidth, maxDepth, xyScores) {

    function submitScore(width, depth) {
        submitScores(xyScores, [{ x: x, y: y, width: width, depth: depth, score: width * depth }]);
    }

    size++;
    if (!isUnique(grid, x, y, size, size)) {
        return xyScores; // can't make this sub grid any bigger
    }

    var newMaxWidth = scoreHorizontally(grid, x, y, size, maxWidth);
    var newMaxDepth = scoreVertically(grid, x, y, size, maxDepth);

    submitScore(size, size);
    submitScore(newMaxWidth, size);
    submitScore(size, newMaxDepth);

    return score(grid, x, y, size, newMaxWidth, newMaxDepth, xyScores);
}

function scoreHorizontally(grid, x, y, size, maxWidth) {
    var newMaxWidth = size;
    for (var width = size + 1; width <= maxWidth; width++) {
        if (!isUnique(grid, x, y, width, size)) { return newMaxWidth; }
        newMaxWidth = width;
    }
    return newMaxWidth;
}

function scoreVertically(grid, x, y, size, maxDepth) {
    var newMaxDepth = size;
    for (var depth = size + 1; depth <= maxDepth; depth++) {
        if (!isUnique(grid, x, y, size, depth)) { return newMaxDepth; }
        newMaxDepth = depth;
    }
    return newMaxDepth;
}

function isUnique(grid, x, y, width, depth) {
    if (x + width > grid[0].length) { return false; } // over grid width
    if (y + depth > grid.length) { return false; } // over grid depth

    var chars = [], col, row;
    for (col = x; col < x + width; col++) {
        for (row = y; row < y + depth; row++) {
            chars.push(grid[row][col]);
            if (chars.indexOf(chars[chars.length - 1]) != chars.length - 1) { return false; }
        }
    }
    return true;
}


describe("isUnique - ", function () {
    var grid = [
    "rzqicaiiaege",
    "ccwnulljybtu",
    "jxtxupauwuah",
    "oqikzgqrzpdq",
    "vblalwdjbdwn",
    "vhjeencuclbo"];

    it("height 1 is unique", function () { expect(isUnique(grid, 0, 0, 6, 1)).toEqual(true); });
    it("height 1 is not unique", function () { expect(isUnique(grid, 0, 0, 8, 1)).toEqual(false); });

    it("width 1 is unique", function () { expect(isUnique(grid, 0, 0, 1, 5)).toEqual(true); });
    it("width 1 is not unique", function () { expect(isUnique(grid, 0, 0, 1, 6)).toEqual(false); });

    it("2x2 is unique", function () { expect(isUnique(grid, 1, 0, 2, 2)).toEqual(true); });
    it("2x2 not unique", function () { expect(isUnique(grid, 0, 0, 2, 2)).toEqual(false); });
});

describe("tooUnique - ", function () {
    var grid = [
  "rzqicaiiaege",
  "ccwnulljybtu",
  "jxtxupauwuah",
  "oqikzgqrzpdq",
  "vblalwdjbdwn",
  "ahjeencuclbo"];

    var result = tooUnique(grid);
    it("line 0", function () { expect(result[0]).toEqual("rzqicaiiae**"); });
    it("line 1", function () { expect(result[1]).toEqual("ccwnulljyb**"); });
    it("line 2", function () { expect(result[2]).toEqual("jxtx***uwu**"); });
    it("line 3", function () { expect(result[3]).toEqual("oqik****zp**"); });
    it("line 4", function () { expect(result[4]).toEqual("vbla****bd**"); });
    it("line 5", function () { expect(result[5]).toEqual("ahje****cl**"); });
});

describe("score - ", function () {
    var grid = [
        "rzqicaiiaege",
        "ccwnulljybtu",
        "jxtxupauwuah",
        "oqikzgqrzpdq",
        "vblalwdjbdwn",
        "ahjeencuclbo"];

    it("score", function () { expect(score(grid, 4, 3, 0, 6, 3, [])).toEqual([]); });
    it("search", function () { expect(search(grid)).toEqual([]); });
});
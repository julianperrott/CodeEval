/* https://www.codeeval.com/open_challenges/79/

MINESWEEPER
CHALLENGE DESCRIPTION:

You will be given an M*N matrix. Each item in this matrix is either a '*' or a '.'. A '*' indicates a mine whereas a '.' does not. The objective of the challenge is to output a M*N matrix where each element contains a number (except the positions which actually contain a mine which will remain as '*') which indicates the number of mines adjacent to it. Notice that each position has at most 8 adjacent positions e.g. left, top left, top, top right, right, ...

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains M,N, a semicolon and the M*N matrix in row major form. E.g.

3,5;**.........*...
4,4;*........*......
OUTPUT SAMPLE:

Print out the new M*N matrix (in row major form) with each position(except the ones with the mines) indicating how many adjacent mines are there. E.g.

**100332001*100
*10022101*101110
*/

function mineSweeper(line) {
    var args = line.split(";");
    var argsRc = args[0].split(",");
    var rows = parseInt(argsRc[0]);
    var cols = parseInt(argsRc[1]);
    var mines = args[1];

    var moves = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

    return Array.apply(null, { length: mines.length })
                .map(function (v, i) { return countMines(i); })
                .join("");

    function countMines(pos) {
        if (mines[pos] == "*") { return "*" };

        return moves.map(function (move) { return mineAt(pos, move) })
            .reduce(function (p, c) { return p + c; }, 0);
    }

    function mineAt(pos, move) {
        var col = move[0] + (pos % cols)
        var row = move[1] + Math.floor(pos / cols)
        if (row < 0 || row == rows) { return 0; } // out of bounds y
        if (col < 0 || col == cols) {return 0; } // out of bounds x
        
        var newPos = (cols*row)+col;
        return mines[newPos]=="*" ? 1 : 0;
    }
}

describe("minesweeper", function () {
    it("1", function () {
        expect(mineSweeper("3,5;**.........*...")).toEqual("**100332001*100");
    });
    it("2", function () {
        expect(mineSweeper("4,4;*........*......")).toEqual("*10022101*101110");
    });
});
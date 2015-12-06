/* https://www.codeeval.com/open_challenges/56/

Robot Movements

Challenge Description:
 
A robot is located in the upper-left corner of a 4×4 grid. The robot can move either up, down, left, or right, but cannot go to the same location twice. The robot is trying to reach the lower-right corner of the grid. Your task is to find out the number of unique ways to reach the destination. 

Input sample:

There is no input for this program. 

Output sample:

Print out the number of unique ways for the robot to reach its destination. The number should be printed out as an integer ≥0. 

*/

function robotMovements() {
    var grid = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

    function countPaths(x, y) {
        var n = x + (y * 4);
        if (x < 0 || x > 3 || y < 0 || y > 3 || grid[n]) { return 0; } // out of bounds or already visited

        if (x === 3 && y === 3) { return 1; } // destination reached

        grid[n] = true; // visited

        var result = 0;
        result += countPaths( x + 1, y);
        result += countPaths( x, y + 1);
        result += countPaths( x - 1, y);
        result += countPaths( x, y - 1);

        grid[n] = false; // un-visit

        return result;
    }

    return countPaths(0, 0);
}

describe("robotMovements", function () {
    it("Should equal 184", function () { expect(robotMovements()).toEqual(184);  });
})

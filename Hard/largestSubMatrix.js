/* https://www.codeeval.com/open_challenges/105/

Largest Sub-Matrix

Challenge Description:

You have the matrix of positive and negative integers. Find a sub-matrix with the largest sum of its elements. In this case sub-matrix means a continuous rectangular part of the given matrix. There is no limitation for sub-matrix dimensions. It only has to be rectangular. 

Input sample:

Your program should accept as its first argument a path to a filename. Read the matrix from this file. Example of the matrix is the following: 
-1 -4 -5 -4
-5 8 -1 3
-2 1 3 2
1 5 6 -9

After some calculations you may find that the sub-matrix with the largest sum of the input is: 
8 -1
1 3
5 6

Output sample:

Print out the sum of elements for the largest sub-matrix. For the given input it is: 
22

*/

function largestSubMatrix(matrix) {

    for (var i = 1 ; i < matrix.length ; i++) {
        for (var j = 0 ; j < matrix.length ; j++) {
            matrix[i][j] += matrix[i - 1][j];
        }
    }

    function bestRectangle(rowI, rowJ, best) {
        var result = rowI.reduce(function (acc, value, i) {
            var rowSum = acc[1] + value - (rowJ === undefined ? 0 : rowJ[i]);
            var best = Math.max(acc[2], rowSum - acc[0]);
            var minLeft = Math.min(acc[0], rowSum);
            return [minLeft, rowSum, best];

        }, [0, 0, best]); //minLeft rowSum best

        return result[2];
    }

    var best = 0;
    for (var i = 0 ; i < matrix.length ; i++) {
        for (var j = -1 ; j < i ; j++) {
            best = bestRectangle(matrix[i], matrix[j], best);
            console.log(i+", "+j+", "+best)
        }
    }

    return best;
}

describe("largest sub matrix", function () {
    it("scenario 1", function () {
        expect(largestSubMatrix([[-1, -4, -5, -4], [-5, 8, -1, 3], [-2, 1, 3, 2], [1, 5, 6, -9]])).toEqual(22);
    });

    it("scenario 2", function () {
       var s2= [[78, -81, -66, 76, -96, 99, -93, -13, 30, 40, -9, 97, -52, 98, -86, 80, 68, -68, 44, -7],
           [-96, -93, -18, 55, -50, -67, -10, 33, 44, -100, -20, -47, -50, 34, 10, -36, -79, 98, 30, -19],
           [65, -37, -37, 81, 15, 58, 37, -40, -56, 80, -89, 54, 34, -84, -17, 48, -31, -11, 16, 76],
           [33, 56, -15, -33, 58, -68, 81, 50, -34, 80, -91, 93, -54, -55, 93, 97, -1, -8, 24, -43],
           [-99, 94, -71, -59, -67, 26, -46, 78, -42, 73, -48, 31, -63, 55, 33, 30, 19, 31, -72, 65],
           [-26, 99, -51, 5, 30, 97, 25, 97, -86, 79, -35, 38, 42, -87, -1, -40, -60, 7, 10, 87],
           [86, 99, -33, 66, -22, 99, 50, 90, 99, 49, -67, 58, -11, -54, 88, -91, 82, 43, -22, 7],
           [95, -5, 84, 6, -71, 80, -51, -40, 32, -51, 72, 68, 58, 51, -41, -100, -58, -9, -45, -61],
           [57, 11, 67, 52, -7, 51, 19, -3, 42, -75, -13, 61, -49, -58, 39, -46, -97, 46, 24, 69],
           [-93, 100, -62, -21, -7, -19, -80, 21, 16, -69, -72, 20, -88, -94, 100, -91, 64, -33, -64, 26],
           [36, 22, 83, 89, -16, -60, -4, -12, 89, 65, -72, 59, 48, 79, -60, -64, -15, -24, -2, -31],
           [-13, -45, 74, 71, 27, -17, -12, -6, -27, -18, -83, -10, -54, 16, 25, 85, 59, 72, 22, 52],
           [62, -98, -20, -7, 61, -5, 45, -54, 83, 96, 92, -30, -78, 100, 93, -41, 1, -42, -65, -66],
           [43, 52, 3, -87, -42, 51, 3, -47, 3, -6, -47, -97, -75, 28, 28, -95, -81, 83, 36, 90],
           [-92, 47, -98, 67, -51, -12, -11, -88, 12, 45, -93, 62, -76, -62, -24, -94, 42, 78, 77, -2],
           [-63, 52, 33, -71, -88, -11, -54, -28, -35, 35, 89, 17, -68, 5, -42, -15, -71, -26, -100, -76],
           [-58, 96, -25, -26, -11, 17, -94, -65, -3, -21, 98, -80, 8, 58, -39, -96, 20, -15, -16, -89],
           [82, -23, 98, 54, -30, 37, 8, 10, 93, 12, -58, -18, 15, -39, 6, 44, -28, -12, 67, 84],
           [51, 0, 31, -71, 63, -45, 41, -79, 2, 87, 76, -67, -24, 95, -37, 28, -52, 59, 46, 16],
       [15, -4, 3, -20, 27, 32, 13, 55, -99, -61, -50, -23, 43, 51, -50, -9, -42, -87, -57, 87]];

      // expect(largestSubMatrix(s2)).toEqual(1723);
    });
});
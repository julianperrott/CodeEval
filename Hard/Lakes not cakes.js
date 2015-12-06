/* https://www.codeeval.com/open_challenges/213/

Lakes, not cakes

Challenge Description:

It was a dark and stormy night when Alice was wandering in the black forest. The rain fell in torrents into deep lakes scattered all over the area… Wait! Lakes… forest…? Really? Well, yeah, it’s not a true horror story, but it is fits our challenge perfectly. So, you have a map of the forest. You are sure there are some lakes in there, but you do not know their number. 
 Write a program that will count how many lakes are in the forest. We count all adjacent o symbols as one lake (by adjacent we mean symbols that are located one cell up, down, left, right, or diagonally from the needed symbol). 

Input sample:

The first argument is a path to a file. Each line includes a test case, which contains a map of the forest of different size. Forest areas are separated by a vertical bar |. 
# - forest 
o - lake 

For example: 

o # o | # # # | o # o
o # o | # o # | o # o

Output sample:

Print the number of lakes for each test case. 

For example: 

4
1

Constraints:
1.A forest may be of different width and height from 3 to 30 symbols.
2.Diagonal symbols are also counted as adjacent.
3.The number of test cases is 40.

*/

function toCoord(map) {
    return map
        .split("|")
        .map(function (b) { return b.trim(); })
        .map(function (row, rowIndex) {
            return row.split(" ")
                .map(function (mapItem, colIndex) {
                    return mapItem == "o" ? [rowIndex, colIndex] : undefined;
                })
                .filter(function (val) { return val; });
        })
        .reduce(function (acc, val) { return acc.concat(val); }, []);
}

function getAdjacentLakeIds(lakeCoords, i) {
    var adjacent = [];
    for (var j = i - 1; j > -1; j--) {

        if (lakeCoords[j][0] < lakeCoords[i][0] - 1) {
            return adjacent; // moved 2 rows back
        }

        // is the lake adjacent
        if (lakeCoords[j][1] == lakeCoords[i][1] + 1 || lakeCoords[j][1] == lakeCoords[i][1] || lakeCoords[j][1] == lakeCoords[i][1] - 1) {
            adjacent.push(j);
        }
    }

    return adjacent;
}

function parseLakes(lakeCoords) {
    var lakeCount = lakeCoords.length;
    var lakeGroup = 0;
    var lakeGroups = [];

    var getLakeGroupIndex = function (index) { return lakeGroups[index]; };
    var distinct = function (acc, val) {
        if (acc.indexOf(val) == -1) { acc.push(val); }
        return acc;
    };

    for (var i = 0; i < lakeCoords.length; i++) {
        var adjacentIndexes = getAdjacentLakeIds(lakeCoords, i);

        if (adjacentIndexes.length === 0) {
            lakeGroup++;
            lakeGroups.push(lakeGroup);
        }
        else if (adjacentIndexes.length === 1) {
            lakeCount--;
            lakeGroups.push(lakeGroups[adjacentIndexes[0]]); // adopt the same lake group
        }
        else {
            // get the distinct lake group ids
            var distinctLakesGroups = adjacentIndexes.map(getLakeGroupIndex)
                .sort()
                .reduce(distinct, []);

            lakeGroups.push(distinctLakesGroups[0]); // adopt the same lake group as the lowest 

            if (distinctLakesGroups.length > 1) {
                for (var j = 0; j < i; j++) {
                    if (distinctLakesGroups.indexOf(lakeGroups[j]) > 0) {
                        lakeGroups[j] = distinctLakesGroups[0]; // replace 
                    }
                }
            }
            lakeCount -= distinctLakesGroups.length;
        }
    }
    return lakeCount;
}

describe("toCoord", function () {
    it("3x3 1", function () { expect(toCoord("o # o | # # # | o # o")).toEqual([[0, 0], [0, 2], [2, 0], [2, 2]]) });
    it("3x3 2", function () { expect(toCoord("o # o | # o # | o # o")).toEqual([[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]) });
});

describe("parseLakes", function () {
    it("3x3 1", function () { expect(parseLakes(toCoord("o # o | # # # | o # o"))).toEqual(4); });
    it("3x3 2", function () { expect(parseLakes(toCoord("o # o | # o # | o # o"))).toEqual(1); });
    it("3x3 3", function () { expect(parseLakes(toCoord("o # o | o # o | o o o"))).toEqual(1); });
    it("3x3 4", function () { expect(parseLakes(toCoord("o # o | o # o | # o #"))).toEqual(1); });
    it("3x3 5", function () { expect(parseLakes(toCoord("# o # | o # o | # o #"))).toEqual(1); });
    it("4x4 1", function () { expect(parseLakes(toCoord("# o # o | o # # o | # o # # | # o # # |"))).toEqual(2); });
});



/*

walk backwards through them looking for adjacent lakes.. until the x is x-2 from the lake or the y is -2

if the list has no members, assign the lake group to the lake and increase it by one.
if the list has one member, decrease the lake count by one, assign the other lake group to this one.
if the list has more than one member , decrease the lake count by one, assign the other lake group to this one.
 + find the highest lake group in the matches, if it is different make all lakes with this number to this numer
	+ reduce the lake count by one
*/
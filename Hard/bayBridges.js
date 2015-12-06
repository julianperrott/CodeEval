/* https://www.codeeval.com/open_challenges/109/

Bay Bridges

Challenge Description:

A new technological breakthrough has enabled us to build bridges that can withstand a 9.5 magnitude earthquake for a fraction of the cost. Instead of retrofitting existing bridges which would take decades and cost at least 3x the price we're drafting up a proposal rebuild all of the bay area's bridges more efficiently between strategic coordinates outlined below. 

You want to build the bridges as efficiently as possible and connect as many pairs of points as possible with bridges such that no two bridges cross. When connecting points, you can only connect point 1 with another point 1, point 2 with another point 2. 

At example given on the map we should connect all the points except points with number 4. 

Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 

1: ([37.788353, -122.387695], [37.829853, -122.294312])
2: ([37.429615, -122.087631], [37.487391, -122.018967])
3: ([37.474858, -122.131577], [37.529332, -122.056046])
4: ([37.532599,-122.218094], [37.615863,-122.097244])
5: ([37.516262,-122.198181], [37.653383,-122.151489])
6: ([37.504824,-122.181702], [37.633266,-122.121964])

Each input line represents a pair of coordinates for each possible bridge. 

Output sample:

You should output bridges in ascending order. 

1
2
3
5
6

*/

function intersect(AB, CD) {
    function ccw(A, B, C) {
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
    }

    var A = AB[0];
    var B = AB[1];
    var C = CD[0];
    var D = CD[1];

    return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D);
}

function toCoord(line) {
    return line.split("]")[0].split(",").map(function (v) { return parseFloat(v); });
}

function toBridge(line) {
    var args = line.split(":");
    var coords = args[1].split("[");
    return [toCoord(coords[1]), toCoord(coords[2])];
}

function toBridges(lines) {
    return lines.map(toBridge);
}

//bridge:  [[37.742517, -122.322012], [37.575469, -122.307824],[15]]); 
function toOverlaps(bridges) {
    var overlaps = [];

    for (var i = 0; i < bridges.length; i++) {
        overlaps[i] = [];
    }

    for (var i = 0; i < bridges.length; i++) {
        for (var j = i + 1; j < bridges.length; j++) {
            if (intersect(bridges[i], bridges[j])) {
                overlaps[i].push(j);
                overlaps[j].push(i);
            }
        }
    }
    return overlaps;
}

function getBridgeWithMostOverlaps(overlaps) {
    var bridgeWithMostOverlaps = -1;
    var mostOverlaps = 0;

    overlaps.forEach(function (bridge,i) {
        if (bridge !== undefined && bridge.length > mostOverlaps) {
            bridgeWithMostOverlaps = i;
            mostOverlaps = bridge.length;
        }
    });

    return bridgeWithMostOverlaps;
}

function removeBridgeWithMostOverlaps(overlaps,index) {
    overlaps[index].forEach(function (overlapsWithBridge) {
        overlaps[overlapsWithBridge] = overlaps[overlapsWithBridge]
            .filter(function (overlapBridge) { return overlapBridge != index; });
    });

    overlaps[index] = undefined;
}

function bayBridges(lines) {
    var bridges = toBridges(lines);
    var overlaps = toOverlaps(bridges);

    var bridgeWithMostOverlaps = getBridgeWithMostOverlaps(overlaps);

    while (bridgeWithMostOverlaps !== -1) {
        removeBridgeWithMostOverlaps(overlaps, bridgeWithMostOverlaps);
        bridgeWithMostOverlaps = getBridgeWithMostOverlaps(overlaps);
    }

    var result = overlaps.map(function (v, i) {
        if (v !== undefined) { return i + 1; }
    }).filter(function (v) { return v !== undefined; });

    return result;
}

describe("args", function () {
    it("toCoord", function () { expect(toCoord("37.742517, -122.322012]")).toEqual([37.742517, -122.322012]); });
    it("toBridge", function () { expect(toBridge("15: ([37.742517, -122.322012], [37.575469, -122.307824])")).toEqual([[37.742517, -122.322012], [37.575469, -122.307824]]); });

    var lines =
      ["1: ([37.475491, -122.382018], [37.808843, -122.058424])",
      "2: ([37.598550, -122.283910], [37.497912, -122.274641])",
      "3: ([37.634441, -122.254628], [37.762277, -122.292024])",
      "4: ([37.765089, -122.128227], [37.719315, -122.118835])",
      "5: ([37.517667, -122.261042], [37.650041, -122.246155])",
      "6: ([37.499734, -122.209789], [37.475781, -122.211818])",
      "7: ([37.513664, -122.221101], [37.451033, -122.154752])",
      "8: ([37.432438, -122.235186], [37.555993, -122.049470])",
      "9: ([37.740202, -122.206123], [37.439940, -122.026493])",
      "10: ([37.577342, -122.075553], [37.789367, -122.237747])",
      "11: ([37.686377, -122.083115], [37.563666, -122.062874])",
      "12: ([37.475551, -122.382847], [37.624867, -122.104703])",
      "13: ([37.671698, -122.092111], [37.490343, -122.351093])",
      "14: ([37.560247, -122.281976], [37.816397, -122.263955])",
      "15: ([37.742517, -122.322012], [37.575469, -122.307824])"]

    it("toOverlaps", function () {
        var bridges = toBridges(lines);
        var overlaps = toOverlaps(bridges);
        expect(overlaps).toEqual([[1, 3, 4, 8, 9, 11, 13], [0, 11, 12, 13], [13], [0], [0, 11, 12], [], [7], [6, 8], [0, 7, 11, 12], [0, 11, 12], [], [0, 1, 4, 8, 9, 12], [1, 4, 8, 9, 11], [0, 1, 2], []]);
    });

    it("getBridgeWithMostOverlaps", function () {
        var bridges = toBridges(lines);
        var overlaps = toOverlaps(bridges);
        var bridgeWithMostOverlaps = getBridgeWithMostOverlaps(overlaps);
        expect(bridgeWithMostOverlaps).toEqual(0);
    });

    it("removeBridgeWithMostOverlaps 0", function () {
        var overlaps = [[1, 3, 4, 8, 9, 11, 13], [0, 11, 12, 13], [13], [0], [0, 11, 12], [], [7], [6, 8], [0, 7, 11, 12], [0, 11, 12], [], [0, 1, 4, 8, 9, 12], [1, 4, 8, 9, 11], [0, 1, 2], []];
        removeBridgeWithMostOverlaps(overlaps, 0);
        expect(overlaps).toEqual([undefined, [11, 12, 13], [13], [], [11, 12], [], [7], [6, 8], [7, 11, 12], [11, 12], [], [1, 4, 8, 9, 12], [1, 4, 8, 9, 11], [1, 2], []]);
    });

    it("removeBridgeWithMostOverlaps 1", function () {
        var overlaps = [undefined, [11, 12, 13], [13], [], [11, 12], [], [7], [6, 8], [7, 11, 12], [11, 12], [], [1, 4, 8, 9, 12], [1, 4, 8, 9, 11], [1, 2], []];
        removeBridgeWithMostOverlaps(overlaps, 1);
        expect(overlaps).toEqual([undefined, undefined, [13], [], [11, 12], [], [7], [6, 8], [7, 11, 12], [11, 12], [], [4, 8, 9, 12], [4, 8, 9, 11], [2], []]);
    });

    it("bayBridges 1", function () {
        expect(bayBridges(lines)).toEqual([2,3,4,5,6,7,9,10,11,15]);
    });

    var lines2 = ["1: ([37.788353, -122.387695], [37.829853, -122.294312])",
        "2: ([37.429615, -122.087631], [37.487391, -122.018967])",
        "3: ([37.474858, -122.131577], [37.529332, -122.056046])",
        "4: ([37.532599,-122.218094], [37.615863,-122.097244])",
        "5: ([37.516262,-122.198181], [37.653383,-122.151489])",
        "6: ([37.504824,-122.181702], [37.633266,-122.121964])"];

    it("bayBridges 2", function () {
        expect(bayBridges(lines2)).toEqual([1,2,3,5,6]);
    });
})


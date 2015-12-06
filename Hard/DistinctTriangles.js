/* https://www.codeeval.com/open_challenges/188/

Distinct Triangles

Challenge Description:

Alice the archaeologist has just entered the tomb of the Pharaoh. She turns on her flashlight and notices an undirected graph painted on the wall, with V nodes and E edges. Suddenly, the stone door behind her slams shut. Fortunately, Alice knows the way out - she must place N pebbles upon the altar to re-open the door, where N is the number of triangles in the graph. 

For example:

N is 2 in this graph. 

0-------1
|     / |
|   /   |
| /     |
2-------3

Input sample:

The first argument is a file with different test cases. Each test case begins with two integers, V and E (1 <= V, E <= 100), separated by a space and finishes with following symbol ";". Then, E edges, which represented as two integers separated by space, Each edge is comma separated. Each vertex is in the range (0 <= vertex < V). 

For example:

4 5;0 2,0 1,1 2,1 3,2 3
9 3;1 3,1 8,3 8
9 3;5 6,5 7,6 7

Output sample:

Print out the number of distinct triangles formed over three vertices and edges in the graph.

For example:

2
1
1

Constraints:
1.1 <= V, E <= 100
2.0 <= vertex < V
3.Number of test cases is 10.

*/

function distinctTriangles(line) {
    var edges = line.split(";")[1];
    var edgesArray = edges
        .split(",")
        .map(stringToIntArray)
        .reduce(distinct, [])
        .sort(sortEdges);

    return countTriangles(edgesArray);
}

function stringToIntArray(edge) {
    return edge.split(" ")
        .map(function (v) { return parseInt(v); })
        .sort();
}

function distinct(unique, edge) {
    var matches = unique.filter(function (uEdge) { return uEdge[0] == edge[0] && uEdge[1] == edge[1]; });
    if (matches.length === 0) { unique.push(edge); }
    return unique;
}

function sortEdges(e1, e2) {
    if (e1[0] < e2[0]) { return -1; }
    if (e1[0] > e2[0]) { return 1; }
    if (e1[1] < e2[1]) { return -1; }
    if (e1[1] > e2[1]) { return 1; }
    return 0;
}

function countTriangles(edges) {

    if (edges.length < 3) { return 0; }

    var edge = edges.splice(0, 1);

    var edgesSt = edges.filter(function (e) { return edge[0][0] == e[0]; });
    var edgesEnd = edges.filter(function (e) { return edge[0][1] == e[0] || edge[0][1] == e[1]; });

    var cnt = 0;

    edgesSt.forEach(function (st) {
        edgesEnd.forEach(function (en) {
            if (st[1]==en[0] || st[1] == en[1]){
                cnt++;
            }
        });
    });

    return cnt + countTriangles(edges);
}


describe("Distinct Trianges - ", function () {
    it("countTriangles s0", function () { expect(countTriangles([[0, 2], [0, 1], [1, 2], [1, 3], [2, 3]])).toEqual(2); });
    it("countTriangles s1", function () { expect(countTriangles([[1, 3], [1, 8], [3, 8]])).toEqual(1); });
    it("countTriangles s2", function () { expect(countTriangles([[5, 6], [5, 7], [6, 7]])).toEqual(1); });

    it("distinctTriangles s0", function () { expect(distinctTriangles("4 5;0 2,0 1,1 2,1 3,2 3")).toEqual(2); });
    it("distinctTriangles s1", function () { expect(distinctTriangles("9 3;1 3,1 8,3 8")).toEqual(1); });
    it("distinctTriangles s2", function () { expect(distinctTriangles("9 3;5 6,5 7,6 7")).toEqual(1); });
    it("distinctTriangles s2", function () { expect(distinctTriangles("9 3;5 6,5 7,5 7,6 7,7 5")).toEqual(1); });

    it("distinctTriangles s3", function () { expect(distinctTriangles("9 3;3 7,3 7,1 1")).toEqual(0); });
    it("distinctTriangles s4", function () { expect(distinctTriangles("9 3;1 3,1 8,3 8")).toEqual(1); });
    it("distinctTriangles s5", function () { expect(distinctTriangles("9 6;3 4,1 4,1 3,1 8,3 8,4 8")).toEqual(4); });
    it("distinctTriangles s6", function () { expect(distinctTriangles("12 14;0 1,0 4,1 2,1 4,2 3,2 7,3 7,4 8,4 9,7 10,7 11,8 9,9 10,10 11")).toEqual(4); });
    it("distinctTriangles s7", function () { expect(distinctTriangles("4 5;0 2,0 1,1 2,1 3,2 3")).toEqual(2); });
    it("distinctTriangles s8", function () { expect(distinctTriangles("9 5;1 3,1 4,1 8,3 8,4 8")).toEqual(2); });
    it("distinctTriangles s9", function () { expect(distinctTriangles("9 4;1 3,1 5,3 4,4 5")).toEqual(0); });
    it("distinctTriangles s10", function () { expect(distinctTriangles("9 13;0 1,0 3,1 2,1 3,1 4,1 5,2 5,3 4,3 6,5 7,5 8,6 7,7 8")).toEqual(4); });
    it("distinctTriangles s11", function () { expect(distinctTriangles("9 3;5 6,5 7,6 7")).toEqual(1); });
    it("distinctTriangles s12", function () { expect(distinctTriangles("9 5;1 3,1 5,3 4,4 5,1 4")).toEqual(2); });
});


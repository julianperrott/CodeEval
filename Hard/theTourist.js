/*
    Note: not working
*/

function toRoutes(line) {
    return line.split("|")
        .map(function (route) {
            return route.trim()
                .split(" ")
                .map(function (v) { return parseInt(v); });
        });
}

function sortByLength(routes) {
    return routes.sort(function (a, b) { return a[2] - b[2]; });
}

function Kruskal(routes) {
    var edgeLists = [];

    function findEdgeListFor(city){
        for (var i = 0; i < edgeLists.length; i++) {
            if (edgeLists[i].cities.indexOf(city) > -1) { return i; }
        }
        return -1;
    }

    routes.forEach(function (route) {

        var start = route[0];
        var end = route[1];
        var distance = route[2];

        var edgeListStart = findEdgeListFor(start);
        var edgeListEnd = findEdgeListFor(end);

        if (edgeListStart == edgeListEnd) {
            if (edgeListStart == -1) {
                edgeLists.push({ cities: [start, end], distance: distance, routes: [route] } ); //new edge list
            }
            else {
                // creates a cycle so ignore
            }
        }
        else if (edgeListStart == -1) {
            //add to end edge list
            edgeLists[edgeListEnd].cities.push(start);
            edgeLists[edgeListEnd].distance += distance;
            edgeLists[edgeListEnd].routes.push(route);
        }
        else if (edgeListEnd == -1) {
            //add to start edge list
            edgeLists[edgeListStart].cities.push(end);
            edgeLists[edgeListStart].distance += distance;
            edgeLists[edgeListStart].routes.push(route);
        } else {
            // joins two different edge lists
            edgeLists[edgeListStart].cities = edgeLists[edgeListStart].cities.concat(edgeLists[edgeListEnd].cities);
            edgeLists[edgeListStart].distance += edgeLists[edgeListEnd].distance + distance;
            edgeLists[edgeListStart].routes.push(route);
            edgeLists[edgeListStart].routes = edgeLists[edgeListStart].routes.concat(edgeLists[edgeListEnd].routes);
            edgeLists.splice(edgeListEnd, 1);
        }
    });

    return edgeLists;
}

function theTourist(line) {
    var result = Kruskal(sortByLength(toRoutes(line)));
    
    if (result.length > 1) {
        return "False";
    }

    return result[0].distance.toString();
}


describe("The tourist - ", function () {
    var case1 = "1 2 1 | 2 3 2 | 3 1 3";
    var case2 = "1 2 2 | 2 3 2 | 3 4 2 | 4 1 2 | 2 4 3";
    var case3 = "4 1 5 | 9 2 10 | 9 5 3 | 1 3 2 | 8 1 5 | 4 3 7 | 5 10 6 | 7 9 4 | 4 5 2 | 2 8 10 | 4 2 1 | 9 4 3 | 4 7 3 | 3 2 10 | 3 6 5";
    var case4 = "1 2 1 | 2 4 3 | 4 3 7 | 3 6 9 | 5 6 6 | 6 7 4 | 7 8 2 | 8 1 1";

    it("toRoutes 1", function () { expect(toRoutes(case1)).toEqual([[1, 2, 1], [2, 3, 2], [3, 1, 3]]) });
    it("toRoutes 2", function () { expect(toRoutes(case2)).toEqual([[1, 2, 2], [2, 3, 2], [3, 4, 2], [4, 1, 2], [2, 4, 3]]); });

    it("sortByLength 1", function () { expect(sortByLength([[1, 2, 3], [2, 3, 2], [3, 1, 1]])).toEqual([[3, 1, 1], [2, 3, 2], [1, 2, 3]]) });

    it("Kruskal 1", function () { expect(Kruskal(sortByLength(toRoutes(case1)))).toEqual([{ cities: [1, 2, 3], distance: 3, routes: [[1, 2, 1], [2, 3, 2]] }]) });
    it("Kruskal 2", function () { expect(Kruskal(sortByLength(toRoutes(case2)))).toEqual([{ cities: [1, 2, 3, 4], distance: 6, routes: [[1, 2, 2], [2, 3, 2], [3, 4, 2]] }]) });
    it("Kruskal 3", function () { expect(Kruskal(sortByLength(toRoutes(case3)))).toEqual([{ cities: [4, 2, 5, 9, 7, 1, 3, 8, 6, 10], distance: 32, routes: [[4, 2, 1], [4, 5, 2], [9, 5, 3], [4, 7, 3], [4, 1, 5], [1, 3, 2], [8, 1, 5], [3, 6, 5], [5, 10, 6]] }]) });
    it("Kruskal 4", function () { expect(Kruskal(sortByLength(toRoutes(case4)))).toEqual([{ cities: [1, 2, 8, 7, 4, 6, 5, 3], distance: 24, routes: [[1, 2, 1], [8, 1, 1], [7, 8, 2], [2, 4, 3], [6, 7, 4], [5, 6, 6], [4, 3, 7]] }]) });

    it("theTourist 1", function () { expect(theTourist(case1)).toEqual("3") });
    it("theTourist 2", function () { expect(theTourist(case2)).toEqual("6") });
    it("theTourist 3", function () { expect(theTourist(case3)).toEqual("32") });
    it("theTourist 4", function () { expect(theTourist(case4)).toEqual("24") });
});


function can_visit(p){
    var v = Math.abs(p[0]).toString() + Math.abs(p[1]).toString();
    var value = v.split("").reduce(function (acc, v) { return acc + parseInt(v); }, 0);
    return value <= 19
}


function neighbors(p){
    return [[p[0] + 1, p[1]], [p[0], p[1] + 1], [p[0] - 1, p[1]], [p[0], p[1] - 1]];
}

function gridWalk() {
    var visited = ["0,0"];
    var queue = [[0, 0]];

    while(queue.length>0)
    {
        var p = queue.pop();
        neighbors(p).forEach(function (n) {
            var v = n[0] + "," + n[1];

            if (can_visit(n) && visited.indexOf(v)==-1){
                visited.push(v);
                queue.push(n);
            }
        });
    }
    return visited.length;
}

describe("grid walk", function () {
    it("canVisit [2,3]", function () { expect(can_visit([2, 3])).toEqual(true); })
    it("canVisit [19,18]", function () { expect(can_visit([19, 18])).toEqual(true); })
    it("canVisit [19,19]", function () { expect(can_visit([19, 19])).toEqual(false); })
    it("test",function(){ expect(gridWalk()).toEqual(102485); })
});
/* https://www.codeeval.com/open_challenges/114/

Package Problem

Sponsoring Company: 

Challenge Description:
 
You want to send your friend a package with different things. 
Each thing you put inside the package has such parameters as index number, weight and cost. 

The package has a weight limit. 
Your goal is to determine which things to put into the package so that the total weight is less than or equal to the package limit and the total cost is as large as possible. 

You would prefer to send a package which weights less in case there is more than one package with the same price. 

Input sample:

Your program should accept as its first argument a path to a filename. The input file contains several lines. Each line is one test case. 

Each line contains the weight that the package can take (before the colon) and the list of things you need to choose. Each thing is enclosed in parentheses where the 1st number is a thing's index number, the 2nd is its weight and the 3rd is its cost. E.g. 

81 : (1,53.38,$45) (2,88.62,$98) (3,78.48,$3) (4,72.30,$76) (5,30.18,$9) (6,46.34,$48)
8 : (1,15.3,$34)
75 : (1,85.31,$29) (2,14.55,$74) (3,3.98,$16) (4,26.24,$55) (5,63.69,$52) (6,76.25,$75) (7,60.02,$74) (8,93.18,$35) (9,89.95,$78)
56 : (1,90.72,$13) (2,33.80,$40) (3,43.15,$10) (4,37.97,$16) (5,46.81,$36) (6,48.77,$79) (7,81.80,$45) (8,19.36,$79) (9,6.76,$64)

Output sample:

For each set of things that you put into the package provide a list (items’ index numbers are separated by comma). E.g. 

4
-
2,7
8,9

Constraints:
1.Max weight that a package can take is ≤ 100
2.There might be up to 15 items you need to choose from
3.Max weight and cost of an item is ≤ 100

*/

/*
var fs = require("fs");
fs.readFileSync(process.argv[2]).toString().split('\n').forEach(function (line) {
    if (line !== "") {
        console.log(packageProblem(line));
    }
});
*/
function packageProblem(line) {
    var items = line.split(':')[1]
        .trim()
        .split(' ')
        .map(function (things) {
            var args = things.split(',');

            value = parseInt(args[2].substr(1, args[2].length - 2));
            weight = parseInt(parseFloat(args[1]) * 100);
            return [value, weight];
        });

    var max_weight = parseInt(line.split(':')[0].trim()) * 100;

    function sum(scenario, index) {
        return items.filter(function (item, i) {
            return (scenario & indexPow[i]) > 0;
        })
        .reduce(function (acc, item) { return acc + item[index]; }, 0);
    }

    var indexPow = [];
    for (var i = 0; i < items.length; i++) {
        indexPow.push(Math.pow(2, i));
    }

    var best_value = 0;
    var best_weight = Infinity;
    var best_used = -1;

    // check all possible scenarios
    for (var i = 1; i < Math.pow(2, items.length) ; i++) {

        var value = sum(i, 0);
        var weight = sum(i, 1);

        if (weight < max_weight && (value > best_value || (value == best_value && weight < best_weight))) {
            best_value = value;
            best_weight = weight;
            best_used = i;
        }
    }

    if (best_used == -1) { return "-";}

    return items.reduce(function (acc, v, i) {
        if ((best_used & Math.pow(2, i)) > 0) { acc.push(i + 1); }
        return acc;
    }, [])
        .sort(function (a, b) { return a - b;})
        .join(",");
}


describe("Package Problem", function () {
    it("81", function () { expect(packageProblem("81 : (1,53.38,$45) (2,88.62,$98) (3,78.48,$3) (4,72.30,$76) (5,30.18,$9) (6,46.34,$48)")).toEqual("4"); });
    it("8", function () { expect(packageProblem("8 : (1,15.3,$34)")).toEqual("-"); });
    it("75", function () { expect(packageProblem("75 : (1,85.31,$29) (2,14.55,$74) (3,3.98,$16) (4,26.24,$55) (5,63.69,$52) (6,76.25,$75) (7,60.02,$74) (8,93.18,$35) (9,89.95,$78)")).toEqual("2,7"); });
    it("56", function () { expect(packageProblem("56 : (1,90.72,$13) (2,33.80,$40) (3,43.15,$10) (4,37.97,$16) (5,46.81,$36) (6,48.77,$79) (7,81.80,$45) (8,19.36,$79) (9,6.76,$64)")).toEqual("8,9"); });


    it("97", function () { expect(packageProblem("97 : (1,62.59,$72) (2,56.53,$47) (3,79.75,$87) (4,95.02,$54) (5,90.54,$49) (6,14.19,$61) (7,71.52,$7) (8,85.99,$23)")).toEqual("3,6"); });
    it("74", function () { expect(packageProblem("74 : (1,71.71,$44) (2,29.47,$50) (3,96.58,$8) (4,41.09,$55) (5,52.18,$55) (6,72.24,$91) (7,4.35,$76)")).toEqual("4,7"); });

    it("51", function () { expect(packageProblem("51 : (1,59.91,$21) (2,85.39,$89) (3,82.16,$90) (4,50.91,$97) (5,74.17,$73) (6,43.05,$97) (7,87.53,$63)")).toEqual("6"); });
    it("77", function () { expect(packageProblem("77 : (1,7.49,$18) (2,85.20,$72) (3,27.88,$28) (4,24.39,$68) (5,47.65,$52) (6,2.89,$30) (7,82.04,$99) (8,16.36,$93)")).toEqual("3,4,6,8"); });
    it("66", function () { expect(packageProblem("66 : (1,56.47,$54) (2,37.88,$33) (3,97.80,$28) (4,25.30,$37) (5,18.03,$93) (6,15.50,$86) (7,72.65,$2) (8,76.70,$73) (9,60.99,$16) (10,15.65,$27) (11,8.80,$46) (12,43.89,$13) (13,71.56,$56)")).toEqual("5,6,10,11"); });
    it("75", function () { expect(packageProblem("75 : (1,78.77,$30) (2,25.06,$34) (3,96.06,$8) (4,58.51,$34) (5,20.56,$52) (6,42.45,$62) (7,43.53,$11) (8,57.44,$67) (9,91.09,$23) (10,36.99,$43) (11,85.15,$61)")).toEqual("5,6"); });
    it("71", function () { expect(packageProblem("71 : (1,10.28,$72) (2,98.12,$67) (3,29.12,$58) (4,91.42,$74) (5,93.54,$38) (6,14.37,$21) (7,46.89,$79)")).toEqual("1,3,6"); });
    it("64", function () { expect(packageProblem("64 : (1,60.77,$89) (2,2.84,$30) (3,38.82,$8) (4,85.99,$69) (5,55.80,$98) (6,31.58,$40) (7,34.94,$98) (8,55.79,$7) (9,66.00,$66)")).toEqual("2,7"); });
    it("74", function () { expect(packageProblem("74 : (1,55.96,$73) (2,67.58,$36) (3,97.60,$27) (4,18.30,$100) (5,79.82,$20)")).toEqual("4"); });
    it("71", function () { expect(packageProblem("71 : (1,50.89,$49) (2,13.89,$25) (3,60.33,$86) (4,49.74,$7) (5,47.33,$96) (6,23.68,$34) (7,83.09,$46) (8,31.29,$31) (9,48.02,$39) (10,60.13,$68) (11,38.96,$100) (12,77.70,$89)")).toEqual("6,11"); });
    it("79", function () { expect(packageProblem("79 : (1,25.77,$48) (2,39.89,$5) (3,67.00,$80) (4,96.35,$75) (5,79.21,$33) (6,10.99,$56) (7,79.48,$39) (8,34.24,$87) (9,31.92,$75) (10,37.38,$63) (11,59.47,$84) (12,91.62,$78)")).toEqual("6,8,9"); });
    it("64", function () { expect(packageProblem("64 : (1,96.88,$43) (2,45.98,$9) (3,30.29,$49) (4,91.12,$21) (5,44.01,$49)")).toEqual("3"); });
    it("99", function () { expect(packageProblem("99 : (1,11.68,$82) (2,49.70,$99) (3,69.92,$50) (4,23.76,$26) (5,78.26,$28)")).toEqual("1,2,4"); });
    it("77", function () { expect(packageProblem("97 : (1,60.69,$16) (2,7.20,$73) (3,24.08,$97) (4,10.23,$50) (5,31.00,$53) (6,94.35,$73) (7,35.56,$53) (8,4.94,$36) (9,63.67,$39)")).toEqual("2,3,4,5,8"); });
    it("56", function () { expect(packageProblem("56 : (1,90.72,$13) (2,33.80,$40) (3,43.15,$10) (4,37.97,$16) (5,46.81,$36) (6,48.77,$79) (7,81.80,$45) (8,19.36,$79) (9,6.76,$64)")).toEqual("8,9"); });
    it("2", function () { expect(packageProblem("2 : (1,2.5,$15)")).toEqual("-"); });
    it("69", function () { expect(packageProblem("69 : (1,94.29,$86) (2,57.32,$12) (3,58.30,$100) (4,56.51,$20) (5,60.96,$8) (6,4.35,$84) (7,82.56,$22) (8,97.80,$39) (9,27.61,$20) (10,43.69,$70) (11,15.92,$52) (12,65.86,$71)")).toEqual("6,10,11"); });
    it("81", function () { expect(packageProblem("81 : (1,38.03,$67) (2,19.94,$66) (3,52.68,$24) (4,22.77,$26) (5,28.33,$67)")).toEqual("2,4,5"); });
    it("51", function () { expect(packageProblem("51 : (1,60.15,$79) (2,36.19,$78) (3,93.93,$39) (4,32.52,$12) (5,0.55,$79) (6,13.71,$62) (7,35.48,$36) (8,29.28,$82) (9,32.23,$81) (10,82.07,$94) (11,52.00,$56)")).toEqual("5,6,8"); });
    it("96", function () { expect(packageProblem("96 : (1,24.25,$98) (2,49.66,$58) (3,6.52,$85) (4,13.86,$28) (5,64.04,$79) (6,43.69,$4) (7,18.90,$100) (8,80.21,$17) (9,99.70,$61) (10,35.15,$55) (11,39.17,$34) (12,92.32,$54) (13,1.45,$25)")).toEqual("1,3,7,10,13"); });
});




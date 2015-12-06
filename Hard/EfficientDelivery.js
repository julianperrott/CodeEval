/* https://www.codeeval.com/open_challenges/123/

Efficient Delivery

Challenge Description:

A shipping company is providing oil delivery between two continents using tankers. They’re trying to increase their efficiency by keeping their ships in port to wait for additional oil to prevent setting to sea only partially loaded. 
    As a logistician, the challenge for you will be to determine all variations of efficient delivery based on the available tankers and the total amount of oil in barrels needed to achieve maximum efficiency. 
    A tanker's carrying capacity is expressed in barrels of oil that it can take on board. 
    E.g. the company has only two kind of tankers with the capacity of 2 and 5 barrels and the amount of oil to be transferred is 12 barrels. In this case there are two options of efficient delivery: 
    1. load 6 tankers with the capacity of 2. [6,0] 
    2. load 1 tanker with the capacity of 2 and 2 tankers with the capacity of 5. [1,2] 
    In case the company had three kind of tankers with the capacity of 6, 7, 8 barrels and 10 barrels of oil to be transferred then there would be no option for efficient delivery and the minimum amount of oil needed would be 12 [2,0,0] so the answer in this case is 2. 
    So you see that if there is no option to load the tankers effectively, you need to find out the minimum amount of oil which needs to be added to the given quantity to make the efficient delivery possible. 

Input sample:

Your program should accept as its first argument a path to a filename containing rows with available tankers in brackets in sorted order, and the amount of oil after a comma. E.g. 

(2,5), 12
(6,9,20), 44
(197,8170), 155862
(2,4,8), 8


Output sample:

Print out all possible variations of efficient delivery in sorted order if the efficient delivery exists. In another case print out the amount of oil to be added. E.g. 


[1,2][6,0]
[1,2,1][4,0,1]
[0,0,1][0,2,0][2,1,0][4,0,0]

Constrains: Number of test cases is in range [20, 40] 
    The number of tankers is in range [2, 5] 
    A tanker's capacity is in range of [2, 10000] barrels 
    Oil amount is in range of [1, 200000] barrels 

*/

function efficientDelivery(line) {

    var tankers = toTankers(line);
    var solutions = [];
    var requiredOil = 999999;

    function updateRequiredOil(value) {
        if (value < requiredOil) { requiredOil = value; }
    }

    function fitOilInTankers(oil, tankerIndex, solution) {
        if (oil === 0) { // success
            while (tankerIndex < tankers.length) {
                solution.push(0);
                tankerIndex++;
            }

            solutions.push(solution);
            return;
        }

        if (tankerIndex >= tankers.length) { // failed to fit
            return;
        }

        var tankerCapacity = tankers[tankerIndex];

        if (oil < tankerCapacity) { // tanker is too large
            updateRequiredOil(tankerCapacity - oil);
            solution.push(0);
            fitOilInTankers(oil, tankerIndex + 1, solution);
            return;
        }

        var maxTankersNeeded = Math.floor(oil / tankerCapacity);

        // oil required to fill 1 more tanker
        updateRequiredOil((tankerCapacity * (maxTankersNeeded + 1)) - oil);

        for (var i = 0; i <= maxTankersNeeded; i++) {
            fitOilInTankers(oil - (i * tankerCapacity), tankerIndex + 1, solution.concat([i]));
        }
    }

    fitOilInTankers(toOil(line), 0, []);

    if (solutions.length > 0) {
        return solutions.map(function (v) {
            return "[" + v + "]";
        }).join("");
    }
    else
    {
        return requiredOil.toString();
    }
}

function toTankers(line){
    return line.split(" ")[0]
        .split(")")[0]
        .split("(")[1]
        .split(",")
        .map(function (v) { return parseInt(v); });
}

function toOil(line) {
    return parseInt(line.split(" ")[1]);
}


describe("", function () {
    it("(197,8170), 155862", function () { expect(efficientDelivery("(197,8170), 155862")).toEqual("3"); });
    it("(138,316,531,875,913), 2990", function () { expect(efficientDelivery("(138,316,531,875,913), 2990")).toEqual("2"); });
    it("(396,428,569,886,971), 4351", function () { expect(efficientDelivery("(396,428,569,886,971), 4351")).toEqual("1"); });
    it("(173,239,258,300), 1951", function () { expect(efficientDelivery("(173,239,258,300), 1951")).toEqual("2"); });
    it("(2,5), 12", function () { expect(efficientDelivery("(2,5), 12")).toEqual("[1,2][6,0]"); });
    it("(218,349,712,896), 5017", function () { expect(efficientDelivery("(218,349,712,896), 5017")).toEqual("1"); });
    it("(366,380,560,896,913), 5104", function () { expect(efficientDelivery("(366,380,560,896,913), 5104")).toEqual("[0,4,0,4,0][1,0,2,2,2]"); });
    it("(2,4,8), 8", function () { expect(efficientDelivery("(2,4,8), 8")).toEqual("[0,0,1][0,2,0][2,1,0][4,0,0]"); });
    it("(93,539,619,643,652), 4635", function () { expect(efficientDelivery("(93,539,619,643,652), 4635")).toEqual("[4,2,2,1,2][16,1,0,0,4][20,4,1,0,0][29,0,0,2,1]"); });
    it("(35,118,619,955), 1225", function () { expect(efficientDelivery("(35,118,619,955), 1225")).toEqual("[35,0,0,0]"); });
    it("(84,376,469,632,925), 3316", function () { expect(efficientDelivery("(84,376,469,632,925), 3316")).toEqual("[11,3,0,2,0][23,2,0,1,0][35,1,0,0,0]"); });
    it("(102,160,188,297,543), 1629", function () { expect(efficientDelivery("(102,160,188,297,543), 1629")).toEqual("[0,0,0,0,3][2,0,6,1,0]"); });
    it("(34,798,852,903,936), 4606", function () { expect(efficientDelivery("(34,798,852,903,936), 4606")).toEqual("[10,3,0,0,2][40,3,1,0,0][61,2,0,0,1][112,1,0,0,0]"); });
    
    it("toTankers", function () { expect(toTankers("(34,798,852,903,936), 4606")).toEqual([34, 798, 852, 903, 936]); });
    it("toOil", function () { expect(toOil("(34,798,852,903,936), 4606")).toEqual(4606); });
});
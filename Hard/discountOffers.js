function discountOffers(line) {
    var args = line.split(";");
    var customers = args[0].split(",");
    var products = args[1].split(",");

    var custScores = customers.map(function (customer, i) {
        // return { index: i, customer: customer, scores: products.map(function (product) { return suitabilityScore(customer, product) }) };
        return products.map(function (product) { return suitabilityScore(customer, product) });
    });

    var result = HG.hungarianAlgortithm(custScores);
    return result/100;
}


function suitabilityScore(customer, product) {
    var customerVowelCount = countMatchingChars(customer.toLowerCase(), "aeiouy");
    var customerConsonantsCount = countMatchingChars(customer.toLowerCase(), "bcdfghjklmnpqrstvwxz");
    var customerCharacterCount = countMatchingChars(customer.toLowerCase(), "abcdefghijklmnopqrstuvwxyz");
    var productCharacterCount = countMatchingChars(product.toLowerCase(), "abcdefghijklmnopqrstuvwxyz");

    var score = (productCharacterCount % 2 == 0) ? (customerVowelCount * 1.5) : customerConsonantsCount;
    return (hasShardFactors(productCharacterCount, customerCharacterCount) ? (1.5 * score) : score) * 100;
}

function countMatchingChars(value, match) {
    var count = 0;
    for (var i = 0; i < value.length; i++) {
        if (match.indexOf(value[i]) > -1) { count = count + 1; }
    }
    return count;
}

function hasShardFactors(num1, num2) {
    var n1f = factorsFrom2(num1);
    var n2f = factorsFrom2(num2);

    for (var i = 0; i < n1f.length; i++) {
        if (n2f.indexOf(n1f[i]) > -1) { return true; }
    }
    return false;
}

function factorsFrom2(num) {
    var n_factors = [];
    for (var i = 2; i <= Math.floor(Math.sqrt(num)) ; i++) {
        if (num % i === 0) {
            n_factors.push(i);
            if (num / i !== i) { n_factors.push(num / i); }
        }
    }

    if (n_factors.length == 0) { return [num] };

    return n_factors;
}

/* http://twofourone.blogspot.co.uk/2009/01/hungarian-algorithm-in-javascript.html */

/* Implementation of the Hungarian Algorithm to determine
* "best" squad.  This is a "reverse" implementation.
* References:
* http://en.wikipedia.org/wiki/Hungarian_algorithm
* http://www.ams.jhu.edu/~castello/362/Handouts/hungarian.pdf (Example #2)
* http://www.public.iastate.edu/~ddoty/HungarianAlgorithm.html // Non-square
*/
var HG = {

    /* 2 dimension arrays */
    matrix: null,
    stars: null,
    /* Single arrays */
    rCov: [],
    cCov: [],
    rows: 0,
    cols: 0,
    dim: 0,
    solutions: 0, // "k"
    FORBIDDEN_VALUE: -999999,

    hungarianAlgortithm: function (loadmatrix) {
        HG.init(loadmatrix);
        // Step 1
        HG.matrix = HG.subtractRowMins(HG.matrix);
        // Step 2
        HG.findZeros(HG.matrix);
        var done = false;
        while (!done) {
            // Step 3
            var covCols = HG.coverColumns(HG.matrix);
            if (covCols > HG.solutions - 1) {
                done = true;
            }
            if (!done) {
                // Step 4 (calls Step 5)
                done = HG.coverZeros(HG.matrix);
                while (done) {
                    // Step 6
                    var smallest = HG.findSmallestUncoveredVal(HG.matrix);
                    HG.matrix = HG.uncoverSmallest(smallest, HG.matrix);
                    done = HG.coverZeros(HG.matrix);
                }
            }
        }
        return HG.getSolution(loadmatrix)
    },

    init: function (loadmatrix) {
        HG.cols = loadmatrix[0].length;
        HG.rows = loadmatrix.length;
        HG.dim = Math.max(HG.rows, HG.cols);
        HG.solutions = HG.dim;

        var reverse = true;
        var initValue = reverse ? HG.findMaxValue(loadmatrix) : 0;
        HG.matrix = HG.initMatrix(HG.dim, HG.dim, initValue);
        HG.stars = HG.initMatrix(HG.dim, HG.dim, initValue);

        HG.matrix = HG.loadMatrix(HG.matrix, true, loadmatrix);

        HG.rCov = new Array(HG.dim);
        HG.cCov = new Array(HG.dim);
        HG.initArray(HG.cCov, 0); // Zero it out
        HG.initArray(HG.rCov, 0);
    },

    initMatrix: function (sizeX, sizeY, initValue) {
        var matrix = new Array(sizeX);
        for (var i = 0; i < sizeX; i++) {
            matrix[i] = new Array(sizeY);
            HG.initArray(matrix[i], initValue);
        }
        return matrix;
    },

    loadMatrix: function (matrix, reverse, loadmatrix) {
        for (var i = 0; i < loadmatrix.length; i++) {
            for (var j = 0; j < loadmatrix[i].length; j++) {
                matrix[i][j] = loadmatrix[i][j];
            }
        }
        if (reverse) {
            // This reverses the matrix.  We need to to create a cost based solution.
            matrix = HG.reverseMatrix(HG.findMaxValue(matrix), matrix);
        }
        return matrix;
    },

    findMaxValue: function (matrix) {
        var max = 0.0;
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] > max) {
                    max = matrix[i][j];
                }
            }
        }
        return Number(max);
    },

    reverseMatrix: function (max, matrix) {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = (Number(max) - Number(matrix[i][j])).toFixed(0);
            }
        }
        return matrix;
    },

    subtractRowMins: function (matrix) {
        for (var i = 0; i < matrix.length; i++) {
            var min = Number.MAX_VALUE;
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] < min) {
                    min = Number(matrix[i][j]);
                }
            }
            for (var k = 0; k < matrix[i].length; k++) {
                matrix[i][k] = matrix[i][k] - min;
            }
        }
        return matrix;
    },

    subtractColMins: function (matrix) {
        for (var j = 0; j < matrix[0].length; j++) {
            var min = Number.MAX_VALUE;
            for (var i = 0; i < matrix.length; i++) {
                if (matrix[i][j] < min) {
                    min = Number(matrix[i][j]);
                }
            }
            for (var k = 0; k < matrix[0].length; k++) {
                matrix[k][j] = matrix[k][j] - min;
            }
        }
        return matrix;
    },

    findZeros: function (matrix) {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 0) {
                    if (HG.rCov[i] == 0 && HG.cCov[j] == 0) {
                        HG.stars[i][j] = 1;
                        HG.cCov[j] = 1;
                        HG.rCov[i] = 1;
                    }
                }
            }
        }
        // Clear Covers
        HG.initArray(HG.cCov, 0);
        HG.initArray(HG.rCov, 0);
    },

    initArray: function (theArray, initVal) {
        for (var i = 0; i < theArray.length; i++) {
            theArray[i] = Number(initVal);
        }
    },

    coverColumns: function (matrix) {
        var count = 0;
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (HG.stars[i][j] == 1) {
                    HG.cCov[j] = 1;
                }
            }
        }
        for (var k = 0; k < HG.cCov.length; k++) {
            count = Number(HG.cCov[k]) + Number(count);
        }
        return count;
    },

    /**
     * step 4
     * Cover all the uncovered zeros one by one until no more
     * cover the row and uncover the column
     */
    coverZeros: function (matrix) {
        var retVal = true;
        var zero = HG.findUncoveredZero(matrix); // Returns a Coords object..

        while (zero.row > -1 && retVal == true) {
            HG.stars[zero.row][zero.col] = 2 //Prime it
            var starCol = HG.foundStarInRow(zero.row, matrix);
            if (starCol > -1) {
                HG.rCov[zero.row] = 1;
                HG.cCov[starCol] = 0;
            } else {
                HG.starZeroInRow(zero); // Step 5
                retVal = false;
            }
            if (retVal == true) {
                zero = HG.findUncoveredZero(matrix);
            }
        }
        return retVal;
    },

    findUncoveredZero: function (matrix) {
        var coords = new HgCoords();
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 0 && HG.rCov[i] == 0 && HG.cCov[j] == 0) {
                    coords.row = i;
                    coords.col = j;
                    j = matrix[i].length;
                    i = matrix.length - 1;
                }
            }

        }
        return coords;
    },

    foundStarInRow: function (zeroRow, matrix) {
        var retVal = -1;
        for (var j = 0; j < matrix[zeroRow].length; j++) {
            if (HG.stars[zeroRow][j] == 1) {
                retVal = j;
                j = matrix[zeroRow].length;
            }
        }
        return retVal;
    },

    /**
     * step 5
     * augmenting path algorithm
     * go back to step 3
     */
    starZeroInRow: function (zero) { // Takes a Coords Object
        //TrU.log("Step 5: Uncovered Zero:" + zero.row + "," + zero.col, TrU.DEBUG);
        var done = false;
        var count = 0;
        var path = HG.initMatrix(HG.dim * 2, 2);

        path[count][0] = zero.row;
        path[count][1] = zero.col;
        while (!done) {
            var row = HG.findStarInCol(path[count][1]);
            if (row > -1) {
                count++;
                path[count][0] = row;
                path[count][1] = path[count - 1][1];
            } else {
                done = true;

            }
            if (!done) {
                var col = HG.findPrimeInRow(path[count][0]);
                count++;
                path[count][0] = path[count - 1][0];
                path[count][1] = col;
            }
        }
        HG.convertPath(path, count);

        // Clear Covers
        HG.initArray(HG.cCov, 0);
        HG.initArray(HG.rCov, 0);
        HG.erasePrimes();
    },

    findStarInCol: function (col) {
        var retVal = -1;
        for (var i = 0; i < HG.stars.length; i++) {
            if (HG.stars[i][col] == 1) {
                retVal = i;
                i = HG.stars.length;
            }
        }
        return retVal;
    },

    findPrimeInRow: function (row) {
        var retVal = -1;
        for (var j = 0; j < HG.stars[row].length; j++) {
            if (HG.stars[row][j] == 2) {
                retVal = j;
                j = HG.stars[row].length;
            }
        }
        return retVal;
    },

    /* Should convert all primes to stars and reset all stars.
     * Count is needed to be sure we look at all items in the path
     */
    convertPath: function (path, count) {
        HG.logMatrix(path, "Step 5: Converting Path.  Count = " + count);
        for (var i = 0; i < count + 1; i++) {
            var x = path[i][0];
            var y = path[i][1];
            if (HG.stars[x][y] == 1) {
                HG.stars[x][y] = 0;
            } else if (HG.stars[x][y] == 2) {
                HG.stars[x][y] = 1;
            }
        }
    },

    erasePrimes: function () {
        for (var i = 0; i < HG.stars.length; i++) {
            for (var j = 0; j < HG.stars[i].length; j++) {
                if (HG.stars[i][j] == 2) {
                    HG.stars[i][j] = 0;
                }
            }
        }
    },

    findSmallestUncoveredVal: function (matrix) {
        var min = Number.MAX_VALUE;
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (HG.rCov[i] == 0 && HG.cCov[j] == 0) {
                    if (min > matrix[i][j]) {
                        min = matrix[i][j];
                    }
                }
            }
        }
        return min;
    },

    logMatrix:function (matrix,text){
        console.log(text);
    },

    /**
     * step 6
     * modify the matrix
     * if the row is covered, add the smallest value
     * if the column is not covered, subtract the smallest value
     */
    uncoverSmallest: function (smallest, matrix) {
        //TrU.log("Uncover Smallest: " + smallest);
        HG.logMatrix(matrix, "B4 Smallest uncovered");

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (HG.rCov[i] == 1) {
                    matrix[i][j] += smallest;
                }
                if (HG.cCov[j] == 0) {
                    matrix[i][j] -= smallest;
                }
            }
        }
        HG.logMatrix(matrix, "Smallest uncovered");
        return matrix;
    },

    getSolution: function (loadmatrix) {
        var total = 0;
        var lineup = [];
        // Changed from length of stars, since we must ignore some rows due to padding.
        for (var i = 0; i < HG.rows; i++) {
            for (var j = 0; j < HG.cols; j++) {
                if (HG.stars[i][j] == 1) {
                    HG.logMatrix(loadmatrix,i + "," + j + " = " + loadmatrix[i][j]);
                    total += loadmatrix[i][j];
                }
            }
        }
        return total;
    }
}

function HgCoords() {
    this.row = -1;
    this.col = -1;
}

/* end of Hungarian */



//describe("suitabilityScore", function () {

//    it("Walter Sobchak 16lb bowling ball", function () { expect(suitabilityScore("Walter Sobchak", "16lb bowling ball")).toEqual(13.5); });
//    it("Jareau Wade,Batman No. 1", function () { expect(suitabilityScore("Jareau Wade", "Batman No. 1")).toEqual(13.5); });
//    it("Rob Eroh,Football - Official Size", function () { expect(suitabilityScore("Rob Eroh", "Football - Official Size")).toEqual(4.5); });
//    it("Mahmoud Abdelkader,Bass Amplifying Headphones", function () { expect(suitabilityScore("Mahmoud Abdelkader", "Bass Amplifying Headphones")).toEqual(10.5); });
//    it("Wenyi Cai,Elephant food - 1024 lbs", function () { expect(suitabilityScore("Wenyi Cai", "Elephant food - 1024 lbs")).toEqual(3.0); });
//    it("Gabriel Sinkin,Three Wolf One Moon T-shirt", function () { expect(suitabilityScore("Gabriel Sinkin", "Three Wolf One Moon T-shirt")).toEqual(7.5); });
//    it("Aaron Adelson,Dom Perignon 2000 Vintage", function () { expect(suitabilityScore("Aaron Adelson", "Dom Perignon 2000 Vintage")).toEqual(13.5); });
//});

describe("discount offers", function () {
//    it("1", function () {
//        var line = "Jack Abraham,John Evans,Ted Dziuba;iPad 2 - 4-pack,Girl Scouts Thin Mints,Nerf Crossbow";
//        expect(discountOffers(line)).toEqual(21.00);
//    });

//    it("2", function () {
//        var line = "Jeffery Lebowski,Walter Sobchak,Theodore Donald Kerabatsos,Peter Gibbons,Michael Bolton,Samir Nagheenanajar;Half & Half,Colt M1911A1,16lb bowling ball,Red Swingline Stapler,Printer paper,Vibe Magazine Subscriptions - 40 pack";
//        expect(discountOffers(line)).toEqual(83.5);
//    });

//    it("3", function () {
//        var line = "Jareau Wade,Rob Eroh,Mahmoud Abdelkader,Wenyi Cai,Justin Van Winkle,Gabriel Sinkin,Aaron Adelson;Batman No. 1,Football - Official Size,Bass Amplifying Headphones,Elephant food - 1024 lbs,Three Wolf One Moon T-shirt,Dom Perignon 2000 Vintage";
//        expect(discountOffers(line)).toEqual(71.25);
//    });

//    it("4", function () {
//        var line = "Theodore Donald Kerabatsos,Michael Bolton;Elephant food - 1024 lbs,Nerf Crossbow,Vibe Magazine Subscriptions - 40 pack,Widescreen Monitor - 30-inch,iPad 2 - 4-pack";
//        expect(discountOffers(line)).toEqual(30.5);
//    });

    function AreEqual(value,line){
        expect(discountOffers(line)).toEqual(value);
    }

//    it("5", function () {
//        AreEqual(30.5, "Theodore Donald Kerabatsos, Michael Bolton; Elephant food - 1024 lbs, Nerf Crossbow, Vibe Magazine Subscriptions - 40 pack, Widescreen Monitor - 30 - inch, iPad 2 - 4 - pack");
//        AreEqual(69.5, "Justin Van Winkle, Gabriel Sinkin, Jeffery Lebowski, Mahmoud Abdelkader, Jack Abraham, Walter Sobchak; Batman No. 1, Half & Half, Widescreen Monitor - 30 - inch, 16lb Bowling ball, Dom Perignon 2000 Vintage, Vibe Magazine Subscriptions - 40 pack, Three Wolf One Moon T - shirt, Girl Scouts Thin Mints, Football - Official Size, iPad 2 - 4 - pack, Bass Amplifying Headphones");
//        AreEqual(72.5, "Gabriel Sinkin, Jareau Wade, Peter Gibbons, Rob Eroh, Jack Abraham, Jeffery Lebowski, Justin Van Winkle, Aaron Adelson, Ted Dziuba, John Evans; Batman No. 1, Three Wolf One Moon T - shirt, iPad 2 - 4 - pack, Red Swingline Stapler, Widescreen Monitor - 30 - inch, Nerf Crossbow");
//        AreEqual(12.5, "Rob Eroh, Michael Bolton; iPad 2 - 4 - pack, Red Swingline Stapler, Three Wolf One Moon T - shirt");
//        AreEqual(107.25, "Walter Sobchak, Ted Dziuba, Jack Abraham, Rob Eroh, Jareau Wade, Jeffery Lebowski, Michael Bolton, Gabriel Sinkin, Theodore Donald Kerabatsos, Wenyi Cai, Aaron Adelson, John Evans, Mahmoud Abdelkader, Justin Van Winkle, Samir Nagheenanajar; Football - Official Size, Colt M1911A1, Three Wolf One Moon T - shirt, Widescreen Monitor - 30 - inch, Dom Perignon 2000 Vintage, Elephant food - 1024 lbs, Nerf Crossbow");
//        AreEqual(60.75, "Jeffery Lebowski, Jack Abraham, Jareau Wade, Rob Eroh, Gabriel Sinkin, Michael Bolton, John Evans, Mahmoud Abdelkader, Theodore Donald Kerabatsos, Walter Sobchak, Ted Dziuba, Justin Van Winkle; iPad 2 - 4 - pack, Colt M1911A1, Football - Official Size, Printer paper");
//        AreEqual(142.25, "Ted Dziuba, Mahmoud Abdelkader, Michael Bolton, Jeffery Lebowski, Jack Abraham, Walter Sobchak, Theodore Donald Kerabatsos, Wenyi Cai, Rob Eroh, Jareau Wade, Aaron Adelson, Peter Gibbons; Batman No. 1, Three Wolf One Moon T - shirt, 16lb Bowling ball, Red Swingline Stapler, Dom Perignon 2000 Vintage, Colt M1911A1, Girl Scouts Thin Mints, Printer paper, Elephant food - 1024 lbs, Half & Half, Widescreen Monitor - 30 - inch, Bass Amplifying Headphones, Vibe Magazine Subscriptions - 40 pack, Football - Official Size, iPad 2 - 4 - pack, Nerf Crossbow");
//        AreEqual(115.0, "Jareau Wade, Mahmoud Abdelkader, Jeffery Lebowski, Jack Abraham, Ted Dziuba, Justin Van Winkle, Gabriel Sinkin, Samir Nagheenanajar, Wenyi Cai, Peter Gibbons, Walter Sobchak, Michael Bolton, Theodore Donald Kerabatsos, Aaron Adelson, Rob Eroh, John Evans; Widescreen Monitor - 30 - inch, Dom Perignon 2000 Vintage, 16lb Bowling ball, Vibe Magazine Subscriptions - 40 pack, iPad 2 - 4 - pack, Nerf Crossbow, Girl Scouts Thin Mints, Football - Official Size");
//        AreEqual(10.0, "Michael Bolton, Mahmoud Abdelkader; Red Swingline Stapler");
//        AreEqual(62.25, "Wenyi Cai, Mahmoud Abdelkader, Jeffery Lebowski, Aaron Adelson, Jareau Wade; Vibe Magazine Subscriptions - 40 pack, Girl Scouts Thin Mints, Colt M1911A1, 16lb Bowling ball, Printer paper, Dom Perignon 2000 Vintage, Batman No. 1, Widescreen Monitor - 30 - inch, Elephant food - 1024 lbs, Nerf Crossbow, Red Swingline Stapler, Bass Amplifying Headphones, iPad 2 - 4 - pack");
//        AreEqual(112.0, "Aaron Adelson, Michael Bolton, Gabriel Sinkin, Samir Nagheenanajar, Rob Eroh, Walter Sobchak, Jack Abraham, Theodore Donald Kerabatsos, Jeffery Lebowski; Elephant food - 1024 lbs, Vibe Magazine Subscriptions - 40 pack, iPad 2 - 4 - pack, Widescreen Monitor - 30 - inch, Half & Half, Printer paper, Football - Official Size, Nerf Crossbow, Three Wolf One Moon T - shirt, Colt M1911A1, Dom Perignon 2000 Vintage, Girl Scouts Thin Mints, 16lb Bowling ball");
//        AreEqual(13.5, "Gabriel Sinkin, Walter Sobchak, John Evans, Jack Abraham, Jeffery Lebowski, Jareau Wade, Peter Gibbons, Michael Bolton, Justin Van Winkle; Batman No. 1");
//        AreEqual(27.0, "Michael Bolton, Justin Van Winkle; Bass Amplifying Headphones, Nerf Crossbow, Dom Perignon 2000 Vintage, Colt M1911A1, Football - Official Size, Elephant food - 1024 lbs, 16lb Bowling ball, Girl Scouts Thin Mints, Three Wolf One Moon T - shirt, Printer paper, Red Swingline Stapler, Half & Half, Vibe Magazine Subscriptions - 40 pack, iPad 2 - 4 - pack, Batman No. 1, Widescreen Monitor - 30 - inch");
//        AreEqual(96.0, "Walter Sobchak, Ted Dziuba, Samir Nagheenanajar, Mahmoud Abdelkader, Wenyi Cai, Jeffery Lebowski, Theodore Donald Kerabatsos, Michael Bolton, Aaron Adelson, John Evans, Jack Abraham, Peter Gibbons, Justin Van Winkle, Gabriel Sinkin; Nerf Crossbow, 16lb Bowling ball, Widescreen Monitor - 30 - inch, Printer paper, Elephant food - 1024 lbs, Football - Official Size");
//        AreEqual(15.0, "Ted Dziuba, Samir Nagheenanajar, Theodore Donald Kerabatsos, Michael Bolton, John Evans, Justin Van Winkle, Walter Sobchak, Jeffery Lebowski, Mahmoud Abdelkader, Gabriel Sinkin, Jareau Wade;");
//        AreEqual(135.0, "Samir Nagheenanajar, Justin Van Winkle, Jack Abraham, Rob Eroh, Michael Bolton, Peter Gibbons, Jeffery Lebowski, Walter Sobchak, Theodore Donald Kerabatsos, Ted Dziuba, John Evans, Mahmoud Abdelkader; Dom Perignon 2000 Vintage, Half & Half, Batman No. 1, iPad 2 - 4 - pack, Printer paper, Three Wolf One Moon T - shirt, Girl Scouts Thin Mints, 16lb Bowling ball, Bass Amplifying Headphones, Red Swingline Stapler, Colt M1911A1, Nerf Crossbow");
//        AreEqual(8.0, "Michael Bolton; iPad 2 - 4 - pack, Girl Scouts Thin Mints, Printer paper, Widescreen Monitor - 30 - inch, Colt M1911A1, Bass Amplifying Headphones, Elephant food - 1024 lbs");
//        AreEqual(12.0, "Aaron Adelson, Mahmoud Abdelkader, Gabriel Sinkin, John Evans, Samir Nagheenanajar, Jareau Wade, Jack Abraham, Rob Eroh, Justin Van Winkle, Peter Gibbons;");
//        AreEqual(14, "Ted Dziuba, Rob Eroh, Jeffery Lebowski, Jareau Wade, Jack Abraham, Theodore Donald Kerabatsos, Walter Sobchak, John Evans, Samir Nagheenanajar, Gabriel Sinkin, Michael Bolton; Red Swingline Stapler;");
//        AreEqual(0, ";Vibe Magazine Subscriptions - 40 pack, Printer paper, Red Swingline Stapler, Dom Perignon 2000 Vintage, 16lb Bowling ball");
//    });

    it("6", function () {
        AreEqual(122.75, "Mahmoud Abdelkader,Jareau Wade,Wenyi Cai,Aaron Adelson,Peter Gibbons,Gabriel Sinkin,Jeffery Lebowski,Ted Dziuba,John Evans,Jack Abraham,Walter Sobchak;Dom Perignon 2000 Vintage,iPad 2 - 4-pack,Widescreen Monitor - 30-inch,Bass Amplifying Headphones,Elephant food - 1024 lbs,Printer paper,16lb Bowling ball,Colt M1911A1,Batman No. 1,Vibe Magazine Subscriptions - 40 pack,Half & Half,Red Swingline Stapler,Three Wolf One Moon T-shirt,Nerf Crossbow,Girl Scouts Thin Mints");
        AreEqual(128.75, "Aaron Adelson,Michael Bolton,Samir Nagheenanajar,Wenyi Cai,Gabriel Sinkin,Rob Eroh,Ted Dziuba,Jareau Wade,Theodore Donald Kerabatsos,Justin Van Winkle;Half & Half,Printer paper,Elephant food - 1024 lbs,Nerf Crossbow,Widescreen Monitor - 30-inch,Red Swingline Stapler,Vibe Magazine Subscriptions - 40 pack,Girl Scouts Thin Mints,Bass Amplifying Headphones,Colt M1911A1,Dom Perignon 2000 Vintage,Football - Official Size,iPad 2 - 4-pack,Batman No. 1,16lb Bowling ball,Three Wolf One Moon T-shirt");
        AreEqual(104.75, "Jeffery Lebowski,Wenyi Cai,Rob Eroh,Samir Nagheenanajar,Ted Dziuba,Peter Gibbons,Walter Sobchak,Aaron Adelson,Gabriel Sinkin;16lb Bowling ball,Elephant food - 1024 lbs,Bass Amplifying Headphones,Nerf Crossbow,Widescreen Monitor - 30-inch,Batman No. 1,Girl Scouts Thin Mints,Half & Half,Red Swingline Stapler,Vibe Magazine Subscriptions - 40 pack,Three Wolf One Moon T-shirt,Printer paper,iPad 2 - 4-pack");
    });



    
});

//describe("HG", function () {
//    it("HG", function () {
//        var matrix=[];
//            matrix.push([4, 12, 10, 11]);
//            matrix.push([12,6,16,15]);
//            matrix.push([16,20,18,16]);
//            matrix.push([13,16,15,14]);

//            var result = HG.hungarianAlgortithm(matrix);
//            expect(result).toEqual(60);
//    });
//});

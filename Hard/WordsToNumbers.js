/* https://www.codeeval.com/open_challenges/110/

Text to Number

Challenge Description:

You have a sting which contains a number represented as English text. Your task is to translate these numbers into their integer representation. The numbers can range from negative 999,999,999 to positive 999,999,999. The following is an exhaustive list of English words that your program must account for: 
negative,
zero, one, two, three, four, five, six, seven, eight, nine,
ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen,
twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety,
hundred,
thousand,
million


Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 
fifteen
negative six hundred thirty eight
zero
two million one hundred seven

- Negative numbers will be preceded by the word negative. 
- The word "hundred" is not used when "thousand" could be. E.g. 1500 is written "one thousand five hundred", not "fifteen hundred". 

Output sample:

Print results in the following way. 
15
-638
0
2000107

*/

function wordsToNums(line) {
    var numWords = [
    { word: "zero", m: 0 }, { word: "one", m: 1 }, { word: "two", m: 2 }, { word: "three", m: 3 }, { word: "four", m: 4 }, { word: "five", m: 5 },
    { word: "six", m: 6 }, { word: "seven", m: 7 }, { word: "eight", m: 8 }, { word: "nine", m: 9 },
    { word: "ten", m: 10 }, { word: "eleven", m: 11 }, { word: "twelve", m: 12 }, { word: "thirteen", m: 13 }, { word: "fourteen", m: 14 },
    { word: "fifteen", m: 15 }, { word: "sixteen", m: 16 }, { word: "seventeen", m: 17 }, { word: "eighteen", m: 18 }, { word: "nineteen", m: 19 },
    { word: "twenty", m: 20 }, { word: "thirty", m: 30 }, { word: "forty", m: 40 }, { word: "fifty", m: 50 }, { word: "sixty", m: 60 }, { word: "seventy", m: 70 },
    { word: "eighty", m: 80 }, { word: "ninety", m: 90 }
    ];

    var multipliers = [{ word: "million", m: 1000000 }, { word: "thousand", m: 1000 }, { word: "hundred", m: 100 }];

    if (line.indexOf("negative") == 0) { return -toNumber(line.substring("negative ".length), 0); }
    else { return toNumber(line, 0); }

    function toNumber(words, multiplierId) {

        if (multiplierId < multipliers.length) {
            var multiplier = multipliers[multiplierId];
            var index = words.indexOf(multiplier.word);
            if (index > -1) {
                var leftWords = words.substring(0, index);
                var rightWords = words.substring(index + multiplier.word.length);
                return (multiplier.m * toNumber(leftWords, multiplierId + 1)) + toNumber(rightWords, multiplierId + 1);
            }
            else {
                return toNumber(words, multiplierId + 1);
            }
        }

        var n = words.split(" ").map(function (word) {
            var matches = numWords
                .filter(function (nw) { return nw.word == word; });

            return matches.length == 0 ? 0 : matches.reduce(function (p, c) { return p + c.m; }, 0);
        }).reduce(function (p, c) { return p + c; }, 0)

        return n;
    }
}

describe("wordsToNums", function () {
    it("50", function () { expect(wordsToNums("fifty")).toEqual(50); });
    it("10", function () { expect(wordsToNums("ten")).toEqual(10); });
    it("5", function () { expect(wordsToNums("five")).toEqual(5); });
    it("22", function () { expect(wordsToNums("twenty two")).toEqual(22); });
    it("340", function () { expect(wordsToNums("three hundred forty")).toEqual(340); });
    it("520000098", function () { expect(wordsToNums("five hundred twenty million ninety eight")).toEqual(520000098); });
    it("69400", function () { expect(wordsToNums("sixty nine thousand four hundred")).toEqual(69400); });
    it("600197018", function () { expect(wordsToNums("six hundred million one hundred ninety seven thousand eighteen")).toEqual(600197018); });
    it("-90", function () { expect(wordsToNums("negative ninety")).toEqual(-90); });

    it("-350001070", function () { expect(wordsToNums("negative three hundred fifty million one thousand seventy")).toEqual(-350001070); });
    it("29", function () { expect(wordsToNums("twenty nine")).toEqual(29); });
    it("316013040", function () { expect(wordsToNums("three hundred sixteen million thirteen thousand forty")).toEqual(316013040); });
    it("15517", function () { expect(wordsToNums("fifteen thousand five hundred seventeen")).toEqual(15517); });
    it("-490833650", function () { expect(wordsToNums("negative four hundred ninety million eight hundred thirty three thousand six hundred fifty")).toEqual(-490833650); });
    it("-610", function () { expect(wordsToNums("negative six hundred ten")).toEqual(-610); });
    it("20", function () { expect(wordsToNums("twenty")).toEqual(20); });
    it("-25741", function () { expect(wordsToNums("negative twenty five thousand seven hundred forty one")).toEqual(-25741); });
    it("-61015", function () { expect(wordsToNums("negative sixty one thousand fifteen")).toEqual(-61015); });
    it("-60", function () { expect(wordsToNums("negative sixty")).toEqual(-60); });
    it("1000000", function () { expect(wordsToNums("one million")).toEqual(1000000); });
    it("612", function () { expect(wordsToNums("six hundred twelve")).toEqual(612); });
    it("-342000563", function () { expect(wordsToNums("negative three hundred forty two million five hundred sixty three")).toEqual(-342000563); });
    it("-110", function () { expect(wordsToNums("negative one hundred ten")).toEqual(-110); });
    it("-1716", function () { expect(wordsToNums("negative one thousand seven hundred sixteen")).toEqual(-1716); });
    it("611000000", function () { expect(wordsToNums("six hundred eleven million")).toEqual(611000000); });
    it("718", function () { expect(wordsToNums("seven hundred eighteen")).toEqual(718); });
    it("0", function () { expect(wordsToNums("zero")).toEqual(0); });
    it("11340", function () { expect(wordsToNums("eleven thousand three hundred forty")).toEqual(11340); });
    it("200060", function () { expect(wordsToNums("two hundred thousand sixty")).toEqual(200060); });
    it("400080052", function () { expect(wordsToNums("four hundred million eighty thousand fifty two")).toEqual(400080052); });
    it("55000040", function () { expect(wordsToNums("fifty five million forty")).toEqual(55000040); });
    it("60365", function () { expect(wordsToNums("sixty thousand three hundred sixty five")).toEqual(60365); });
    it("514", function () { expect(wordsToNums("five hundred fourteen")).toEqual(514); });
    it("614097", function () { expect(wordsToNums("six hundred fourteen thousand ninety seven")).toEqual(614097); });
    it("13000014", function () { expect(wordsToNums("thirteen million fourteen")).toEqual(13000014); });
    it("1000101", function () { expect(wordsToNums("one million one hundred one")).toEqual(1000101); });
    it("600", function () { expect(wordsToNums("six hundred")).toEqual(600); });
    it("-729", function () { expect(wordsToNums("negative seven hundred twenty nine")).toEqual(-729); });
    it("-375000070", function () { expect(wordsToNums("negative three hundred seventy five million seventy")).toEqual(-375000070); });
    it("-870086060", function () { expect(wordsToNums("negative eight hundred seventy million eighty six thousand sixty")).toEqual(-870086060); });
    it("-340", function () { expect(wordsToNums("negative three hundred forty")).toEqual(-340); });
    it("611297875", function () { expect(wordsToNums("six hundred eleven million two hundred ninety seven thousand eight hundred seventy five")).toEqual(611297875); });
    it("6", function () { expect(wordsToNums("six")).toEqual(6); });
    it("-650", function () { expect(wordsToNums("negative six hundred fifty")).toEqual(-650); });
    it("-520000098", function () { expect(wordsToNums("negative five hundred twenty million ninety eight")).toEqual(-520000098); });
});
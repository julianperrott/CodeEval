/* https://www.codeeval.com/open_challenges/55/

Type Ahead
 
Challenge Description:

Your task is to build a type-ahead feature for an upcoming product. 

When the user enters a word or set of words, we want to be able to "predict" what they're going to type next with some level of accuracy. We've chosen to implement this using the N-Gram algorithm defined here. 

Your program should return a tuple of predictions sorted high to low based on the prediction score (upto a maximum of three decimal places, or pad with zeroes upto three decimal places i.e. 0.2 should be shown as 0.200), (if predictions share the same score, they are sorted alphabetically.) Words should be split by whitespace with all non-alphanumeric characters stripped off the beginning and end. 
Prediction scores are calculated like this: Occurrences of a word after an N-gram / total number of words after an N-gram e.g. for an N-gram of length 2: 
ONE TWO ONE TWO THREE TWO THREE

"TWO" has the following predictions: 
THREE:0.666,ONE:0.333

"THREE" occurred 2 times after a "TWO" and "ONE" occurred 1 time after a "TWO", for a total of 3 occurrences after a "TWO". 

Your program will run against the following text, ignoring all punctuation i.e. Hardcode it into your program: 
Mary had a little lamb its fleece was white as snow;
And everywhere that Mary went, the lamb was sure to go.
It followed her to school one day, which was against the rule;
It made the children laugh and play, to see a lamb at school.
And so the teacher turned it out, but still it lingered near,
And waited patiently about till Mary did appear.
"Why does the lamb love Mary so?" the eager children cry; "Why, Mary loves the lamb, you know" the teacher did reply."

Input sample:

Your program should accept as its first argument a path to a filename.The input file contains several lines. Each line is one test case. Each line contains a number followed by a string, separated by a comma. E.g. 
2,the

The first number is the n-gram length. The second string is the text printed by the user and whose prediction you have to print out. 

Output sample:

For each set of input produce a single line of output which is the predictions for what the user is going to type next. E.g. 
lamb,0.375;teacher,0.250;children,0.125;eager,0.125;rule,0.125

*/

function typeAhead(line, words) {

    var args = line.split(',');
    var nGramLength = Number(args[0]) - 1;
    var userText = args[1].split(' ');

    var nGramLastWord = words.reduce(function (acc, word, i) {
        for (var j = 0; j < nGramLength; j++) { if (words[i + j] != userText[j]) { return acc; } }
        acc.push(words[i + nGramLength]);
        return acc;
    }, []);

    return nGramLastWord
        .sort()
        .reduce(function (acc, word) {
            if (acc.length > 0 && acc[acc.length - 1].word == word) { acc[acc.length - 1].cnt++; }
            else { acc.push({ word: word, cnt: 1 }) }
            return acc;
        }, [])
        .sort(function (a, b) { return a.cnt == b.cnt ? (a.word < b.word ? -1 : 1) : (b.cnt - a.cnt); })
        .map(function (nextWord) { return nextWord.word + ',' + (nextWord.cnt / nGramLastWord.length).toFixed(3) })
        .join(';');
}

describe("Type Ahead -", function () {

var text = 'Mary had a little lamb its fleece was white as snow;\
And everywhere that Mary went, the lamb was sure to go.\
It followed her to school one day, which was against the rule;\
It made the children laugh and play, to see a lamb at school.\
And so the teacher turned it out, but still it lingered near,\
And waited patiently about till Mary did appear.\
"Why does the lamb love Mary so?" the eager children cry; "Why, Mary loves the lamb, you know" the teacher did reply."';

    text = text.replace(/[^A-Za-z ]/g, ' ').trim();
    var words = text.split(/\s+/);

    it("1", function () { expect(typeAhead("2,the", words)).toEqual("lamb,0.375;teacher,0.250;children,0.125;eager,0.125;rule,0.125"); });
    it("2", function () { expect(typeAhead("4,her to school", words)).toEqual("one,1.000"); });

    it("3", function () { expect(typeAhead("2,so", words)).toEqual("the,1.000"); });
    it("4", function () { expect(typeAhead("4,its fleece was", words)).toEqual("white,1.000"); });
    it("5", function () { expect(typeAhead("2,day", words)).toEqual("which,1.000"); });
    it("6", function () { expect(typeAhead("3,the lamb", words)).toEqual("love,0.333;was,0.333;you,0.333"); });
    it("7", function () { expect(typeAhead("4,Why Mary loves", words)).toEqual("the,1.000"); });
    it("8", function () { expect(typeAhead("4,her to school", words)).toEqual("one,1.000"); });
    it("9", function () { expect(typeAhead("2,till", words)).toEqual("Mary,1.000"); });
    it("10", function () { expect(typeAhead("3,snow And", words)).toEqual("everywhere,1.000"); });
    it("11", function () { expect(typeAhead("3,sure to", words)).toEqual("go,1.000"); });
    it("12", function () { expect(typeAhead("2,sure", words)).toEqual("to,1.000"); });
    it("13", function () { expect(typeAhead("3,did appear", words)).toEqual("Why,1.000"); });
    it("14", function () { expect(typeAhead("2,appear", words)).toEqual("Why,1.000"); });
    it("15", function () { expect(typeAhead("4,know the teacher", words)).toEqual("did,1.000"); });

});
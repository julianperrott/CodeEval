/* https://www.codeeval.com/open_challenges/69/

    DISTINCT SUBSEQUENCES
    CHALLENGE DESCRIPTION:

        A subsequence of a given sequence S consists of S with zero or more elements deleted. Formally, a sequence Z = z1z2..zk is a subsequence of X = x1x2...xm, if there exists a strictly increasing sequence of indicies of X 
    such that for all j=1,2,...k we have Xij = Zj. E.g. Z=bcdb is a subsequence of X=abcbdab with corresponding index sequence <2,3,5,7>

    INPUT SAMPLE:

    Your program should accept as its first argument a path to a filename. Each line in this file contains two comma separated strings. The first is the sequence X and the second is the subsequence Z. E.g.

    babgbag,bag
    rabbbit,rabbit

    OUTPUT SAMPLE:

    Print out the number of distinct occurrences of Z in X as a subsequence E.g.

    5
    3
*/

function subSequenceCount(line) {
    var params = line.split(",");
    var sequence = params[0];
    var sub = params[1];

    var subsequences = function(position, path) {
        var charsToFind = sub.length - path.length;
        var charRemaining = sequence.length - position;
        var newPath = path.concat([position]);
        var nextSubCharFound = sequence.charAt(position) === sub.charAt(path.length)

        var found = !nextSubCharFound ? [] : charsToFind == 1 ? [newPath] : subsequences(position + 1, newPath)
        var notfound = charsToFind >= charRemaining ? [] : subsequences(position + 1, path)

        return found.concat(notfound);
    }

    return subsequences(0, []).length.toString();
}

describe("DISTINCT SUBSEQUENCES", function () {
    it("bag", function () { expect(subSequenceCount("babgbag,bag")).toEqual("5"); });
    it("rabbit", function () { expect(subSequenceCount("rabbbit,rabbit")).toEqual("3"); });
});
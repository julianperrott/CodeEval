"use strict";

/* https://www.codeeval.com/open_challenges/28/
STRING SEARCHING
CHALLENGE DESCRIPTION:

You are given two strings. Determine if the second string is a substring of the first (Do NOT use any substr type library function). The second string may contain an asterisk(*) which should be treated as a regular expression i.e. matches zero or more characters. The asterisk can be escaped by a \ char in which case it should be interpreted as a regular '*' character. To summarize: the strings can contain alphabets, numbers, * and \ characters.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. The input file contains two comma delimited strings per line. E.g.

Hello,ell
This is good, is
CodeEval,C*Eval
Old,Young
OUTPUT SAMPLE:

If the second string is indeed a substring of the first, print out a 'true'(lowercase), else print out a 'false'(lowercase), one per line. E.g.

true
true
true
false 
 */

var WILDCARD = "#";

function search(line) {
    var params = line.split(",");
    var value = params[0];
    var terms = getSearchTerms(params[1]);

    return searchForTerm(value, terms);
}

function searchForTerm(value, terms) {
    if (terms.length == 0) {
        return true; // found all terms
    }

    var remainder = value;

    if (terms[0] != WILDCARD) {
        var stringFoundAtIndex = findIndexOfString(value, terms[0]);

        if (stringFoundAtIndex == -1) {
            return false; // didn't find term
        }

        // remove up to end of found term
        remainder = value
            .split("")
            .filter(function (el, index) { return index > stringFoundAtIndex + terms[0].length; })
            .join("");
    }

    // term has been found
    terms.shift();

    return searchForTerm(remainder, terms);
}

function findIndexOfString(value, search) {
    // find search in value
    for (var startIndex = 0; startIndex <= value.length - search.length; startIndex++) {
        var found = true;
        for (var searchIndex = 0; searchIndex < search.length; searchIndex++) {
            if (value[startIndex + searchIndex] != search[searchIndex]) {
                found = false;
                break;
            }
        }

        if (found) {
            return startIndex;
        }
    }

    return -1;
}


function getSearchTerms(line) {
    var result = line
        .split("")
        .reduce(parseSearchTermCharacter, [[]])
        .map(function (ar) { return ar.join(""); })
        .filter(function (v) { return v.length > 0; });

    return result;
}
function parseSearchTermCharacter(terms, char) {
    if (char == "*") {
        parseSearchTermAsterisk(terms);
    }
    else {
        terms[terms.length - 1].push(char);
    }
    return terms;
}

function parseSearchTermAsterisk(terms) {
    var currentTerm = terms[terms.length - 1];

    if (currentTerm.length > 0) {
        if (currentTerm[currentTerm.length - 1] == "\\") {
            currentTerm.pop();
            currentTerm.push(["*"]);
        }
        else {
            terms.push([WILDCARD]);
            terms.push([]);
        }
    }
    else {
        currentTerm.push([WILDCARD]);
        terms.push([]);
    }
}


describe("getSearchTerms", function () {
    it("single term", function () { expect(getSearchTerms("abc").length).toEqual(1); });
    it("wildcard at end of terms", function () { expect(getSearchTerms("abc*").length).toEqual(2); });
    it("wildcard at end of terms - term 0 = abc", function () { expect(getSearchTerms("abc*")[0]).toEqual("abc"); });
    it("wildcard at end of terms - term 1 = *", function () { expect(getSearchTerms("abc*")[1]).toEqual(WILDCARD); });
    it("wildcard at start of terms", function () { expect(getSearchTerms("*abc").length).toEqual(2); });
    it("wildcard in middle of terms", function () { expect(getSearchTerms("def*abc").length).toEqual(3); });
    it("escaped *", function () { expect(getSearchTerms("def\\*abc").length).toEqual(1); });
});

describe("search", function () {
    it("single term - found", function () { expect(search("Vj6vE,vE")).toEqual(true); });
    it("wildcard term - found", function () { expect(search("Vc9 2DwsSMIbTuUk 0EdvYkXxLb1qGtgGqkE,dvYkX*q")).toEqual(true); });
    it("single term - not found", function () { expect(search("kK Ov5PHBOlcfN23AnqGuWvuxxsn gvkVLBdqXG,uxG")).toEqual(false); });
    it("escaped * - not found", function () { expect(search("GuOh,\*")).toEqual(false); });
    it("wildcard only - found", function () { expect(search("GuOh,*")).toEqual(true); });
});


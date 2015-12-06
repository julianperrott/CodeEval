/* https://www.codeeval.com/open_challenges/6/

Longest Common Subsequence

Challenge Description:

You are given two sequences. Write a program to determine the longest common subsequence between the two strings (each string can have a maximum length of 50 characters). NOTE: This subsequence need not be contiguous. The input file may contain empty lines, these need to be ignored. 

Input sample:

The first argument will be a path to a filename that contains two strings per line, semicolon delimited. You can assume that there is only one unique subsequence per test case. E.g. 
XMJYAUZ;MZJAWXU

Output sample:

The longest common subsequence. Ensure that there are no trailing empty spaces on each line you print. E.g. 
MJAU

*/

function longestCommonSubsequence(line) {
    var args = line.split(";");
    var arg1 = args[0].trim();
    var arg2 = args[1].trim();
    var result = lcs(arg1, arg2);
    return result;
}

function mapRow(lastRow, aa, b) {

    var currentRow = b.split("").reduce(function (acc2, bb, j) {
        acc2.push(aa == bb ? lastRow[j] + 1 : Math.max(acc2[acc2.length - 1], lastRow[j + 1]));
        return acc2;
    }, [0]);

    return currentRow;
}

function lcs(a, b) {

    var firstRow = [];
    for (var i = 0; i <= Math.max(a.length, b.length) ; i++) { firstRow.push(0); }

    var lengths = a.split("").reduce(function (acc, aa) {
        var lastRow = acc[acc.length - 1];
        acc.push(mapRow(lastRow, aa, b));
        return acc;
    }, [firstRow]);

    function result(x, y) {
        if (x === 0 || y === 0) { return ""; }
        if (lengths[x][y] == lengths[x - 1][y]) { return result(x - 1, y); }
        if (lengths[x][y] == lengths[x][y - 1]) { return result(x, y - 1); }
        return result(x - 1, y - 1) + a[x - 1];
    }

    return result(a.length, b.length);
}

describe("",function(){
    it("1", function () { expect(longestCommonSubsequence("XMJYAUZ; MZJAWXU")).toEqual("MJAU"); });
    it("2", function () { expect(longestCommonSubsequence("TWYFXGTRODWLJAKILK;MHNXZUAZUNS")).toEqual("XA"); });

    it("3", function () { expect(longestCommonSubsequence("ANYVZHHSZOCLXYBVKD;VUUJTDWAKEQWXNVWWHZYQ")).toEqual("ANVHZY"); });
    it("4", function () { expect(longestCommonSubsequence("PGUYDQAWLJARQ;EBJGFDHEVYVDMZWYADDVD")).toEqual("GYDWA"); });
    it("5", function () { expect(longestCommonSubsequence("hello world mordor;lord of the rings")).toEqual("lord or"); });
    it("6", function () { expect(longestCommonSubsequence("XABHKMHNEKILQSPAXKYSR;ABYVTKDYUUUBXELVWDSEEP")).toEqual("ABKELSP"); });
    it("7", function () { expect(longestCommonSubsequence("KKOIJCBUJHMJWILMZ;KMEWCXXUEQTDEAWOVT")).toEqual("KCUW"); });
    it("8", function () { expect(longestCommonSubsequence("thisisatest;testing123testing")).toEqual("tsitest"); });
    it("9", function () { expect(longestCommonSubsequence("UZRTRUTOYNTJYYTJ;WAFWIXWSCTOFC")).toEqual("TO"); });
    it("10", function () { expect(longestCommonSubsequence("XFLDXPUHFVBSUI;ACCBKQBKQLSPH")).toEqual("LPH"); });
    it("11", function () { expect(longestCommonSubsequence("IGDONUJKILXDKGBOIII;AQRROXKGOTMZFDMAYYSVP")).toEqual("OXKGO"); });
    it("12", function () { expect(longestCommonSubsequence("FGJMYCSIQEQLWMLTNURI;XEZJIDXEXMGRIGGANJEHY")).toEqual("JIEMRI"); });
    it("13", function () { expect(longestCommonSubsequence("UXULJGBZOGPSCOOPRXU;DZAOSTPKNM")).toEqual("ZOSP"); });
    it("14", function () { expect(longestCommonSubsequence("VUBBINCXIWSXCILOZBH;DZULQOJFZABAV")).toEqual("ULOZB"); });
    it("15", function () { expect(longestCommonSubsequence("SBWWVGAWZFNKTSOBQU;PXTSMDWIGNMGGMVCOE")).toEqual("SWGNO"); });
    it("16", function () { expect(longestCommonSubsequence("LHAHAVGEMEDR;OHUMEGUCFUZXDD")).toEqual("HMED"); });
    it("17", function () { expect(longestCommonSubsequence("YXPJHQGWSZABCHZVAXU;OGOGTDCXVDQXSZLJAIDE")).toEqual("XQSZA"); });
    it("18", function () { expect(longestCommonSubsequence("the quick brown fox;the fast brown dogs")).toEqual("the  brown o"); });
    it("19", function () { expect(longestCommonSubsequence("UEOOQHXSFNGUTQ;TSVQEEQAQKEBRJVYBBIMD")).toEqual("EQQ"); });
    it("20", function () { expect(longestCommonSubsequence("TCXKTQJOLXZN;WXGNHCPXZPOJHACPBEROP")).toEqual("CXJO"); });
    it("21", function () { expect(longestCommonSubsequence("OSXXIWZUFLBMWX;STBRVFASDODSHIUETX")).toEqual("OSIUX"); });

});





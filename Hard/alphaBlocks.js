/* https://www.codeeval.com/open_challenges/201/
ALPHABET BLOCKS
CHALLENGE DESCRIPTION:

We all remember those childhood times when we learned how to use alphabet blocks to form different words, such as MOM, DAD, TRAIN, and others. We propose you to remind this time for a while and imagine yourself being a child.
So, you have a set of alphabet blocks. There is a letter on each of the six faces of every block. Also, you have a word associated with your childhood that you want to form.
Write a program that will verify if it is possible to form the necessary word out of the set. If yes, then print "True" to stdout; otherwise, print "False".
You can choose only one letter from an alphabet block and place blocks in any order.

INPUT SAMPLE:

The first argument is a path to a file. Each line contains test cases that have three arguments separated by the pipe symbol "|". 
1. The first argument in the line is a number that shows how many blocks are in the set. 
2. The second one is a word that you want to form. 
3. The third one is a list of arrays of letters. One face of the alphabet block includes one letter from array. 
For example: 
There is an array of letters "ABCDEF". It refers to one toy block with the following faces: 
"A", "B", "C", "D", "E", "F".

4 | DOG | UPZRHR INOYLC KXDHNQ BAGMZI
6 | HAPPY | PKMFQP KTXGCV OSDMAJ SDSIMY OEPGLE JZCDHI
5 | PLAIN | BFUBZD XMQBNM IDXVCN JCOIAM OZYAYH
OUTPUT SAMPLE:

Print "True" to stdout if you can form the necessary word, or "False" if you cannot do this.

True
True
False
CONSTRAINTS:

The word length is from 4 to 18 characters.
Number of blocks in the set is always equal to or greater than the word length.
You can take only one block from the set to form one letter in the word.
The letters in the word and letters on the faces of one block may repeat: the word might be "MOM" or there might be a block with "AAAAAA" faces.
The number of test cases is 40.
*/

function alphaBlocks(line) {
    var args = line.split(" ");
    var word = args[2];
    var blocks = args.slice(4);

    var blocksForEachLetter = word
        .split("")
        .map(function (letter) {
            return blocks.reduce(function (acc, b, i) {
                return b.indexOf(letter) == -1 ? acc : acc.concat(i);
            }, []);
        })

    return fitBlocksToLetters(blocksForEachLetter);
}

function countBlockFrequency(blocksForEachLetter) {
    var blocks = [].concat.apply([], blocksForEachLetter).sort(); // flattern list of blocks
    var max = Math.max.apply(Math, blocks); // find out how many blocks there are
    return Array.apply(null, { length: max + 1 }) // for each
        .map(function (x, i) {
            var cnt = blocks.filter(function (n) { return n == i; }).length; // count frequency
            return [i, cnt]; // return tuple as array
        })
        .filter(function (n) { return n[1] > 0 }) // remove the zero counts
        .sort(function (a, b) { // sort
            if (a[1] == b[1]) { return a[0] == b[0] ? 0 : a[0] < b[0] ? -1 : 1; } // by count
            return a[1] < b[1] ? -1 : 1; // by block number
        });
}

function removeBlock(blockToRemove, blocks) {
    return blocks.map(function (letter) {
        return letter.filter(function (block) { return block != blockToRemove; });
    });
}

function fitBlocksToLetters(blocksForEachLetter) {
    if (blocksForEachLetter.length == 0) {
        return 1; // success
    }

    // sort block letters by length. i.e. letters with fewest possible blocks first
    var sortedBlocks = blocksForEachLetter.sort(function (a, b) { return a.length == b.length ? 0 : a.length < b.length ? -1 : 1; });

    // if first has 0 blocks then we have failed
    if (sortedBlocks[0].length == 0) { return 0; }

    // does first have one possible block, if so assign it
    if (sortedBlocks[0].length == 1) {
        var newblocksForEachLetter = removeBlock(sortedBlocks[0][0], sortedBlocks.slice(1));
        return fitBlocksToLetters(newblocksForEachLetter);
    }

    var firstBlock = countBlockFrequency(blocksForEachLetter)[0][0];

    //find indexes of letters the block is found in
    var letterIndicies = sortedBlocks.reduce(function (acc, v, i) {
        if (v.indexOf(firstBlock) == -1) { return acc; }
        return acc.concat(i);
    }, []);

    return letterIndicies.reduce(function (acc, i) {
        if (acc == 1) { return acc; }
        var newblocksForEachLetter = removeBlock(firstBlock, blocksForEachLetter.filter(function (b, bi) { return i != bi; }));
        return fitBlocksToLetters(newblocksForEachLetter);
    }, 0);
}

// count how often each block appears

var testLetters = [
    [2, 3, 7, 8, 13, 15, 17],
    [0, 12, 14, 16],
    [1, 10, 11, 12, 13, 15],
    [5, 7, 9],
    [3, 11, 16],
    [5, 7, 9],
    [2, 3, 7, 8, 13, 15, 17],
    [0, 1, 2, 5, 10],
    [0, 12, 14, 16]
];

describe("count", function () {
    var expected = [[1, 2], [8, 2], [9, 2], [10, 2], [11, 2], [14, 2], [17, 2], [0, 3], [2, 3], [3, 3], [5, 3], [12, 3], [13, 3], [15, 3], [16, 3], [7, 4]];
    it("cnts", function () { expect(countBlockFrequency(testLetters)).toEqual(expected); });
});

describe("removeBlock", function () {
    it("remove 3", function () { expect(removeBlock(3, [[2, 3, 4], [3, 7], [4, 5]])).toEqual([[2, 4], [7], [4, 5]]); });
});

describe("fitBlocksToLetters", function () {
    it("has empty letter", function () { expect(fitBlocksToLetters([[2, 3, 4], [], [4, 5]])).toEqual(0); });
    it("has 1 letter", function () { expect(fitBlocksToLetters([[2, 3, 4], [3], [4, 5]])).toEqual(1); });
    it("solvable 1", function () { expect(fitBlocksToLetters([[1, 2, 3, 4], [4, 5], [6, 7]])).toEqual(1); });
    it("unsolvable 1", function () { expect(fitBlocksToLetters([[1, 2, 3, 4], [4, 5], [4, 5], [4], [6, 7]])).toEqual(0); });
});

describe("alphaBlocks", function () {
    it("1", function () { expect(alphaBlocks("5 | VLQGF | VKCHBB EOAPTE INJKHE GXXOVT LDOYIE")).toEqual(0); });
    it("2", function () { expect(alphaBlocks("9 | YBTAWAES | CEJWCF VPLQVQ EWMQKK XFCDCJ VYKANK WYCGFV GEUMGB FULCGL TLMCVV")).toEqual(0); });
    it("3", function () { expect(alphaBlocks("9 | ECXTLHV | YXXSEP NXNCXL CESABN JXXSVH IYSZHH MVBEOS VJIAYT QBWTTS RFFNHH")).toEqual(1); });
    it("4", function () { expect(alphaBlocks("18 | EQTOSOEKQ | ZNQKRY DAKTDX EBRUDK IEAMSD NAIIJP RKOFAC MXRJCL JEBUDO IEERUB LDCYRO KHBYPT YZSTFP TUQZXQ HULNTE DIQLZA VIRTBE RRSJQD FEPIIL")).toEqual(1); });
    it("5", function () { expect(alphaBlocks("18 | WRMH | VTXZEO UMHPOM JIBCQL BMOUKW ASQBNT SSUXAP JQNNAN YFDHRF POUUVF VKXTRW FIBSCK FVEIYH QDMBMP KDHFWT PHYJSP XQUQRR HDZGNV WRHPSE")).toEqual(1); });
    it("6", function () { expect(alphaBlocks("5 | JXEC | VSREVC YOLOBD PJRBKC VEIUUY SWBMRE")).toEqual(0); });
    it("7", function () { expect(alphaBlocks("5 | MARY | UPZRHR INOYLC KXDHNQ BADMZI GBZKMN")).toEqual(1); });
    it("8", function () { expect(alphaBlocks("7 | VIEA | DREIKI JODORU ADWNPB TCOTIP XSTVTA OIQWXU NXMUDA")).toEqual(1); });
    it("9", function () { expect(alphaBlocks("7 | BQOMWSR | NBHIDK QCKMHW WAQRJP NIALYX IIEKVT LAAOYH CPTOYR")).toEqual(0); });
    it("10", function () { expect(alphaBlocks("6 | MEGAN | PKMFQP KTXGCV OSDMAJ SDSIMJ OEPGLE JZCDNI")).toEqual(1); });
    it("11", function () { expect(alphaBlocks("8 | ZRKMYSQ | AQRDAL NIPJBE UZMHUR LNRQNO ORBLVM GGGRWP RTPYLE GQIVWB")).toEqual(0); });
    it("12", function () { expect(alphaBlocks("13 | TCPRCZOYYYKL | ZWRBAI ZDPXZR JBHEKB AMYUMD RVNQVA VWTHNY XFUHOW ARWTUV IHZTXY GDZVRW EQAVZV GZGIAO EKFHFW")).toEqual(0); });
    it("13", function () { expect(alphaBlocks("18 | OTXVJZXBTWGLHGJ | YHPJJP XSENMV EQRDQJ HCCPDE YIFJPV YNEXQF GGWJCI MLVBSJ DKVYXA EQAOYN TCUVJS RBRIQI FIBBGH AAEBPQ KMREYC LSQHSA UVWOLR LYJYVH")).toEqual(0); });
    it("14", function () { expect(alphaBlocks("17 | KTVLYSZSNDVTD | TVPZZT VWFQUA GJKKRV AIMPFL PUQMEC BFAEBD PIYGEI MEGCDV RBZWOS TTCHGJ XJLSIR PTHHGR BWUWPH IRZZLQ SSKCGE TREIFI CLXQLB")).toEqual(0); });
    it("15", function () { expect(alphaBlocks("18 | XVNHESID | FPJRPO EOBLSR OAQZGE ROXKKH YJPBUM XGVCHU QFZXKR CWEHOK GIADZW AARFXG SHODIY OWLXHR DITSJL TVKHSW SOSXOA RZEBIV AAQAIU ELVIOE")).toEqual(0); });
    it("16", function () { expect(alphaBlocks("7 | OXQE | YDWORH RNTAXK FOEWNC RSQUJM OXTKTR KNLGLJ YBFUCX")).toEqual(1); });
    it("17", function () { expect(alphaBlocks("5 | LINDA | BFUBZD XMQBNM IDXVCN JCOIAM OZYAYH")).toEqual(0); });
    it("18", function () { expect(alphaBlocks("9 | FFTZWTF | IAFAFA XWUQWX BAAHUM PXRLQG PCMURX DMWMNW GQMDBW RAFTEG WSJUNA")).toEqual(0); });
    it("19", function () { expect(alphaBlocks("12 | RAGRVMDIGI | CVULVB QRHJLX SMQKGB INVLHH QNPODC CUWWFZ GZBNMK DUPUGI ONYSYE FOAUAI QJFRFJ AVNAFK")).toEqual(1); });
    it("20", function () { expect(alphaBlocks("16 | EPIFKPFUELZGCW | ESJZBC DHGBZA NXEBQO JCCOLX ICMKDQ CURBDX LLBKEL YAGIPM WNOGBY GAKBYX LWXMEG GANVNN QXFEJX JBDTPX XBKCFR JVVQGE")).toEqual(1); });
    it("21", function () { expect(alphaBlocks("11 | MSDWKLR | HLNLRU SZCKMS CXZDJP MVYVPJ GGBOUR STEVYN TQCGMF FYFYAL JKVEMK OQTWEL SRFANM")).toEqual(1); });
    it("22", function () { expect(alphaBlocks("14 | USSQAIWS | HCGDUZ VBVZEH VTJGYP RBPPBW TRUOMY HLNNSF MQSMRU IXCQCY MCYRSW ZJNPKA QTPFKP RSTHVK ORRSGK CXPSAU")).toEqual(1); });
    it("23", function () { expect(alphaBlocks("7 | YQQS | YUBQOW NHQEXK IZLFBJ HFQIFZ MBWKMG KZXBJB FDRNZH")).toEqual(0); });
    it("24", function () { expect(alphaBlocks("10 | CZMB | TLGNQN FASFIU KXWJNF VFUKLX EWPUEU CFWKIU OGSBQW WXOQAO VRAMZJ FZPJTU")).toEqual(1); });
    it("25", function () { expect(alphaBlocks("5 | RCCB | PLUGFQ UUMOFX LGKWIW XMGQDN KAWSSF")).toEqual(0); });
    it("26", function () { expect(alphaBlocks("14 | BEOY | NOMKME NMJHEB SRZOMP UMNEWH FUUXXX MLKSQR ZGMULC KEWKHC HEEJNJ ANJHFO SKMUSH RKLQGF MWIRVK XLLRWB")).toEqual(0); });
    it("27", function () { expect(alphaBlocks("17 | EKIOOXPYTQ | RWGRGI DYCABD JBPGMK ZJTJPT UGKVLU ISYJFK PRGXCT GFCBOX LZSOXW UIBRFZ YJFQLP YNLAYO ZALQMG DJJJBV MZSZMR ILRVEZ EDXKXH")).toEqual(1); });
    it("28", function () { expect(alphaBlocks("9 | OOHTPNG | RVMELA ISNMQC GCXLNY XTDYQZ OGBLUX VFUJXH UHDQNG WVEEWU KAIENA")).toEqual(0); });
    it("29", function () { expect(alphaBlocks("9 | HGNI | OOFSVR QGOWXW HTTKAI VBAMRP LWFVXW GCBEXE ERCDEI VETATI MHXHGT")).toEqual(0); });
    it("30", function () { expect(alphaBlocks("4 | PHTM | GNSZAR ZDTJOM NZJMQC TBRIDH")).toEqual(0); });
    it("31", function () { expect(alphaBlocks("5 | NHYX | RPBZCC UVEUMN SWICUI YQCRMX HZXHQR")).toEqual(0); });
    it("32", function () { expect(alphaBlocks("4 | OIGX | VMPVSP YVNADC UFIPJK WBQJXJ")).toEqual(0); });
    it("33", function () { expect(alphaBlocks("10 | OGICMIATJW | SKUIDQ FNUEUM LANDHV VWDOIR KWZKAG PXLFOE SMHIGU ZEGJBY ZKAZYP TUTDGC")).toEqual(0); });
    it("34", function () { expect(alphaBlocks("10 | QGKSDISLO | CBFRPR TBXJKW SCOJGI RTOFAO TCWEQW ARNFXH CICJNV AAUSGX DVBPYL QFSAIZ")).toEqual(0); });
    it("35", function () { expect(alphaBlocks("15 | NDGTMIZQZBG | JNHFEO UNOTPG FISTCD VXYAKD KKZRNH KOJSBK SFAHRV QOJVQB NJIITA AQTWDG VWDNZA BCDYMN IYMRYJ VZPQSI BEXSZB")).toEqual(1); });
    it("36", function () { expect(alphaBlocks("4 | TJYL | SDIEQP DNRHZH DIENBJ LKLAQQ")).toEqual(0); });
    it("37", function () { expect(alphaBlocks("13 | CEHXSRP | SIICFG JUUQIK QAJMXL CQUYYR CERBBP FTNHSV YCPWXT HLEIIU WQQJML EYGHQS QSZACN FFRCQQ GVRUNI")).toEqual(1); });
    it("38", function () { expect(alphaBlocks("13 | SSLOZWHQBBFSB | WIXUPE ATUZDT ZJJDID TUNKUV URHQJE BBPCBU CBZHFS VYTTSP IWMFYU LBDHOI AFXZBB MSEWVE QYZVFR")).toEqual(0); });
    it("39", function () { expect(alphaBlocks("12 | ZBME | FZSRAS UPJRQU JBBOGH QHRVDX DFCTXM BMQHMU UHXXSP CRCHEA TCMODK MTRGEE DPFTNF SFUYAQ")).toEqual(1); });
    it("40", function () { expect(alphaBlocks("11 | EFTIH | IHHWJW BSCNLM NZQXXI SLJJZS TGECFW BDKWSD NLLAJY UYVXLA LSXQHH AWXLHX RKHUTK")).toEqual(0); });
});
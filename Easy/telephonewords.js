function telephoneWords(line) {
    var telephone = ["0", "1", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];

    return line.split("").reduce(function (words, key) {
        var keysLetters = telephone[parseInt(key, 10)].split("");
        return [].concat.apply([],
            words.map(function (word) {
                return keysLetters.map(function (letter) { return word + letter; });
            }));
    }, [""])
    .sort()
    .join(",");
}

describe("telephoneWords", function () {
    it("415", function () {
        var result = telephoneWords("415");
        expect(result).toEqual("g1j,g1k,g1l,h1j,h1k,h1l,i1j,i1k,i1l");
    });
});
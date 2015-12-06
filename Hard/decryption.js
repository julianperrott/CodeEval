/*
https://www.codeeval.com/open_challenges/61/

Decryption

Challenge Description:

    For this challenge you are given an encrypted message and a key. You have to determine the encryption and encoding technique and then print out the corresponding plaintext message. You can assume that the plaintext corresponding to this message, and all messages you must handle, will be comprised of only the characters A-Z and spaces; no digits or punctuation. 

    Input sample:

    There is no input for this program. The encrypted message and key is: 
    message: "012222 1114142503 0313012513 03141418192102 0113 2419182119021713 06131715070119",
    keyed_alphabet: "BHISOECRTMGWYVALUZDNFJKPQX"

    Output sample:

    Print out the plaintext message. (in CAPS)

    */
function decrypt() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var message = "012222 1114142503 0313012513 03141418192102 0113 2419182119021713 06131715070119";
    var key = "BHISOECRTMGWYVALUZDNFJKPQX";

    return message.split(" ")
        .map(function (word) {
            return word.match(/.{1,2}/g)
                .map(function (s) { return alphabet[key.indexOf(alphabet[parseInt(s)])]; })
                .join("");
        })
        .join(" ");
}

describe("decryption", function () {
    it("1", function () {
        expect(decrypt()).toEqual("ALL PEERS START SEEDING AT MIDNIGHT KTHZBAI");
    });
});

                     

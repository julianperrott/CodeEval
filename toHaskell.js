function toHaskell(data) {
    data = replaceAll(data,"describe(", "describe ");
    data = replaceAll(data,", function () {", " $ do ");
    data = replaceAll(data,"expect(", " ");
    data = replaceAll(data,"it(", "it ");
    data = replaceAll(data,")).toEqual(", " `shouldBe` ");
    data = replaceAll(data,"); });", "");
    data = replaceAll(data,"true", "True");
    data = replaceAll(data, "false", "False");
    data = replaceAll(data, "});", "");
    //data = replaceAll(data, "(", " ");
    //data = replaceAll(data, ";", " ");
    data = replaceAll(data, "var ", " ");
    return data;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

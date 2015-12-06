/* https://www.codeeval.com/open_challenges/210/

Brainf*ck

Challenge Description:

Looking for something utterly mind-blowing? Look no further, you hit the right place!
 This challenge is inextricably linked with Brainf*ck, the most famous esoteric programming language invented by Urban Müller. Is this the first time you hear about Brainf*ck? Find out more Brainf*ck (wiki)

Brainf*ck consists of only 8 basic commands:
> - move to the next cell;
< - move to the previous cell;
+ - increment the value in the current cell by 1;
- - decrement the value of the current cell by 1;
. - output the value of the current cell;
, - input the value outside and store it in the current cell;
[ - if the value of the current cell is zero, move forward on the text to the program to] taking into account nesting;
] - if the value of the current cell is not zero, go back on the text of the program to [considering nesting;

So, you should write a program that will get the code on the Brainf*ck language, calculate this code, and display the final result of the program. It can be a simple output of letters or a complex cycle; in any case, your program should handle it.

Input sample:

The first argument is a path to a file. Each line includes a test case where there is a program written on the Brainf*ck language.

For example:

+[--->++<]>+++.[->+++++++<]>.[--->+<]>----.
++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.

Output sample:

You should print the result of the program that you will get.

For example:

Yo!
Hello World!

Constraints:
1.Programs can include the code of any complexity.
2.The number of test cases is 10.

*/
function brainFck(line) {
    line = line.trim();
    var result = [];
    var cell = [];
    var nesting = [];

    var lineIndex = 0;
    var cellIndex = 0;

    while (lineIndex < line.length) {
        if (cell[cellIndex] === undefined) { cell[cellIndex] = 0; }

        switch (line[lineIndex]) {
            case '>': cellIndex++; break;
            case '<': cellIndex--; break;
            case '+': cell[cellIndex] = (cell[cellIndex] + 1) % 256; break;
            case '-': cell[cellIndex] = (cell[cellIndex] + 255) % 256; break;
            case '.': result.push(String.fromCharCode(cell[cellIndex])); break;
            case '[':
                if (cell[cellIndex] !== 0) { nesting.push(lineIndex); }
                else { lineIndex = findCloseBracket(line, lineIndex); }
                break;
            case ']': lineIndex = nesting.pop() - 1; break;
            default: break;
        }

        lineIndex++;
    }

    return result.join("");
}

function findCloseBracket(line, lineIndex) {
    var nesting = 0;
    for (var i = lineIndex + 1; i < line.length; i++) {
        if (line[i] === '[') { nesting++; }
        if (line[i] === ']') {
            if (nesting !== 0) { nesting--; }
            else { return i; }
        }
    }
}

describe("BrainF*ck", function () {
    it("1", function () { expect(brainFck("+[--->++<]>+++.[->+++++++<]>.[--->+<]>----.")).toEqual("Yo!"); });
    it("2", function () { expect(brainFck("++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.")).toEqual("Hello World!"); });
});
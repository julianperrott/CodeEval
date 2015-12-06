/* https://www.codeeval.com/open_challenges/108/

Computer Terminal

Sponsoring Company: Peanut labs
   
Challenge Description:
 
In this problem you are writing the software for a small terminal with a 10-row, 10-column display (perhaps for a point-of-sale terminal). Rows and columns are numbered 0 through 9. The character that introduces a control sequence is ^, the circumflex. The character (or in one case, the two characters) immediately following the control sequence introducer will direct your software in performing its special functions. 

Here is the complete list of control sequences you will need to interpret: 
^c - clear the entire screen; the cursor row and column do not change 
^h - move the cursor to row 0, column 0; the image on the screen is not changed 
^b - move the cursor to the beginning of the current line; the cursor row does not change 
^d - move the cursor down one row if possible; the cursor column does not change 
^u - move the cursor up one row, if possible; the cursor column does not change 
^l - move the cursor left one column, if possible; the cursor row does not change 
^r - move the cursor right one column, if possible; the cursor row does not change 
^e - erase characters to the right of, and including, the cursor column on the cursor's row; the cursor row and column do not change 
^i - enter insert mode 
^o - enter overwrite mode 
^^ - write a circumflex (^) at the current cursor location, exactly as if it was not a special character; this is subject to the actions of the current mode (insert or overwrite) 
^DD - move the cursor to the row and column specified; each D represents a decimal digit; the first D represents the new row number, and the second D represents the new column number 

 No illegal control sequences will ever be sent to the terminal. The cursor cannot move outside the allowed screen locations (that is, between row 0, column 0 and row 9, column 9). 
 When a normal character (not part of a control sequence) arrives at the terminal, it is displayed on the terminal screen in a manner that depends on the terminal mode. When the terminal is in overwrite mode (as it is when it is first turned on), the received character replaces the character at the cursor's location. But when the terminal is in insert mode, the characters to the right of and including the cursor's location are shifted right one column, and the new character is placed at the cursor's location; the character previously in the rightmost column of the cursor's row is lost. 
 Regardless of the mode, the cursor is moved right one column, if possible. 

Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 

^h^c
^04^^
^13/ \^d^b  /   \
^u^d^d^l^l^l^l^l^l^l^l^l
^r^r^l^l^d<CodeEval >^l^l^d/^b \
^d^r^r^66/^b  \
^b^d   \ /
^d^l^lv^d^b===========^i^94O123456
789^94A=======^u^u^u^u^u^u^l^l\^o^b^r/

Output sample:

Print results in the following way. 
    ^
   / \
  /   \
 /     \
<CodeEval>
 \     /
  \   /
   \ /
    v
====A=====

*/
function terminal() {
    var row, col, screen, mode, screenSize = 10;

    var paramDump = function () { return { row: row, col: col, mode: mode }; }

    var move = function (newRow, newCol) {
        var newRowInt = parseInt(newRow, 10);
        var newColInt = parseInt(newCol, 10);
        if (newRowInt < 0 || newRowInt >= screenSize || newColInt < 0 || newColInt >= screenSize) { throw "Invalid move command"; }
        row = newRowInt;
        col = newColInt;
    }

    function clear() {
        screen = [];
        var r = [];
        for (var i = 0; i < screenSize; i++) { r.push(' '); }
        for (var i = 0; i < screenSize; i++) { screen.push(r.slice()); }
    }

    var cursorHome = function() { row = col = 0; }
    var cursorTobeginOfLine = function() { col = 0; }
    var cursorDown = function() { if (row < screenSize - 1) { row++; } }
    var cursorUp = function() { if (row > 0) { row--; } }
    var cursorLeft = function() { if (col > 0) { col--; } }
    var cursorRight = function() { if (col < screenSize - 1) { col++; } }
    var erase = function() { for (var i = col; i < screenSize; i++) { screen[row][i] = " "; } }
    var modeInsert = function() { mode = "i"; }
    var modeOverWrite = function() { mode = "o"; }

    var write = function (ch) {
        if (mode == "o") {
            screen[row][col] = ch;
        } else{
            var r = screen[row];
            r.splice( col, 0, ch );
            screen[row] = r.slice(0, 10);
        }
        cursorRight();
    };

    var readScreen = function () { return screen; };

    clear();
    cursorHome();
    modeOverWrite();

    return {
        move: move,
        write: write,
        readScreen: readScreen,
        clear: clear,
        cursorHome: cursorHome,
        cursorTobeginOfLine: cursorTobeginOfLine,
        cursorDown: cursorDown,
        cursorUp: cursorUp,
        cursorLeft: cursorLeft,
        cursorRight: cursorRight,
        erase: erase,
        modeInsert: modeInsert,
        modeOverWrite: modeOverWrite,
        paramDump: paramDump
    };
};

function trimr(row) {
    var i = 10;
    while (i > 0) {
        if (row[i - 1] != ' ') { break; }
        i--;
    }
    return row.slice(0, i);
}

function TerminalCommands(terminal) {

    function command(commandText, func) {
        return {
            isCommand: function (line) { return line.substr(0, 2) == commandText; },
            len: function (line) { return commandText.length; },
            execute: func
        }
    }

    function moveCommand(func) {
        return {
            isCommand: function (line) {
                var newRow = line.substr(1, 1);
                var newCol = line.substr(2, 1);
                return line.substr(0, 1) == "^" && newRow >= 0 && newCol >= 0;
            },
            len: function (line) { return 3; },
            execute: function (line) { func(line.substr(1, 1), line.substr(2, 1)); }
        }
    }

    function writeCharCommand(func) {
        return {
            isCommand: function (line) { return line.substr(0, 1) != "^"; },
            len: function (line) { return 1; },
            execute: function (line) { func(line.substr(0, 1)); }
        }
    }

    return  [
    command("^c", terminal.clear),
    command("^h", terminal.cursorHome),
    command("^b", terminal.cursorTobeginOfLine),
    command("^d", terminal.cursorDown),
    command("^u", terminal.cursorUp),
    command("^l", terminal.cursorLeft),
    command("^r", terminal.cursorRight),
    command("^e", terminal.erase),
    command("^i", terminal.modeInsert),
    command("^o", terminal.modeOverWrite),
    command("^^", function (line) { terminal.write("^"); }),
    moveCommand(terminal.move),
    writeCharCommand(terminal.write)];
}

function getCommands(commands,line) {
    var result = [];

    while (line.length > 0) {

        var matchingCommands = commands.filter(function (cmd) { return cmd.isCommand(line); });

        if (matchingCommands.length == 0 || matchingCommands.length > 1) {
            throw ("Expected only one command to match '" + line + "' but found: " + matchingCommands.length);
        }

        var command = matchingCommands[0];
        var len = command.len(line);

        result.push({ command: command, line: line.substr(0, len) });
        line = line.substr(len);
    }
    return result;
}


describe("Terminal", function () {

    var input = [
        "^h^c",
        "^04^^",
        "^13/ \\^d^b  /   \\",
        "^u^d^d^l^l^l^l^l^l^l^l^l",
        "^r^r^l^l^d<CodeEval >^l^l^d/^b \\",
        "^d^r^r^66/^b  \\",
        "^b^d   \\ /",
        "^d^l^lv^d^b===========^i^94O123456",
        "789^94A=======^u^u^u^u^u^u^l^l\\^o^b^r/"];

    var input2 = [
        "jB^csA^^J^lyPpOYjUix",
        "kB^^^enrL^l^bBL",
        "^c^hvwvVChGs^l",
        "V^cD^hcKBijSE",
        "Dm^ocD^^F^iWn^d^l^^",
        "^uif^ev^24^i^e^u^eSxXH^eZQ^eC",
        "EtJ^cZ^u^oa^eebS",
        "j^roX^ltuJ^eogOw^o^uL^i",
        "^h^c",
        "^04^^",
        "^13/ \\^d^b  /   \\",
        "^u^d^d^l^l^l^l^l^l^l^l^l",
        "^r^r^l^l^d<CodeEval >^l^l^d/^b \\",
        "^d^r^r^66/^b  \\",
        "^b^d   \\ /",
        "^d^l^lv^d^b===========^i^94O12345",
        "6789^94A=======^u^u^u^u^u^u^l^l\\^o^b^r/",
        "^h+^d|^d|^d|^d^r^d|^d|^d|^d|^d+^b+^u^l|",
        "^u|^u|^u|^u^r^u|^u|^u|^u=+^o^l^l=^l^l",
        "=^l^l=^l^l^l=^l^l=^l^l=",
        "^09^d|^d|^d|^d^d|^d|^d|^d|"];


    var t = terminal();
    var commands = TerminalCommands(t);

    describe("getCommands", function () {
        it("line 0", function () {
            var cmds = getCommands(commands,input[0]);
            expect(cmds.length).toEqual(2);
        });
        it("line 1", function () {
            var cmds = getCommands(commands,input[1]);
            expect(cmds.length).toEqual(2);
        });
        it("line 2", function () {
            var cmds = getCommands(commands,input[2]);
            expect(cmds.length).toEqual(13);
        });
    });

    describe("commands", function () {
        it("start state", function () {
            var t = terminal();
            var param = t.paramDump();
            expect(param.row).toEqual(0);
            expect(param.col).toEqual(0);
            expect(param.mode).toEqual("o");
        });
        it("cursorDown", function () {
            var t = terminal();
            t.cursorDown();
            expect(t.paramDump().row).toEqual(1);
            t.cursorDown();
            expect(t.paramDump().row).toEqual(2);
            for (var i = 0; i < 20; i++) { t.cursorDown(); }
            expect(t.paramDump().row).toEqual(9);
        });

        it("cursorUp", function () {
            var t = terminal();
            t.cursorUp();
            expect(t.paramDump().row).toEqual(0);
            t.cursorDown();
            expect(t.paramDump().row).toEqual(1);
            t.cursorUp();
            expect(t.paramDump().row).toEqual(0);
        });

        it("cursorRight", function () {
            var t = terminal();
            t.cursorRight();
            expect(t.paramDump().col).toEqual(1);
            t.cursorRight();
            expect(t.paramDump().col).toEqual(2);
            for (var i = 0; i < 20; i++) { t.cursorRight(); }
            expect(t.paramDump().col).toEqual(9);
        });


        it("cursorLeft", function () {
            var t = terminal();
            t.cursorLeft();
            expect(t.paramDump().col).toEqual(0);
            t.cursorRight();
            expect(t.paramDump().col).toEqual(1);
            t.cursorLeft();
            expect(t.paramDump().col).toEqual(0);
        });

        it("cursorTobeginOfLine", function () {
            var t = terminal();
            t.cursorTobeginOfLine();
            expect(t.paramDump().col).toEqual(0);
            t.cursorRight();
            t.cursorRight();
            t.cursorRight();
            t.cursorTobeginOfLine();
            expect(t.paramDump().col).toEqual(0);
        });

        it("cursorHome", function () {
            var t = terminal();
            t.cursorHome();
            expect(t.paramDump().col).toEqual(0);
            expect(t.paramDump().row).toEqual(0);
            t.cursorRight();
            t.cursorRight();
            t.cursorRight();
            t.cursorDown();
            t.cursorDown();
            t.cursorHome();
            expect(t.paramDump().col).toEqual(0);
            expect(t.paramDump().row).toEqual(0);
        });

        it("mode", function () {
            var t = terminal();
            expect(t.paramDump().mode).toEqual("o");
            t.modeInsert();
            expect(t.paramDump().mode).toEqual("i");
            t.modeOverWrite();
            expect(t.paramDump().mode).toEqual("o");
            t.modeOverWrite();
            expect(t.paramDump().mode).toEqual("o");
        });

        it("move", function () {
            var t = terminal();
            t.move(9, 1);
            expect(t.paramDump().row).toEqual(9);
            expect(t.paramDump().col).toEqual(1);
            t.move("2", "3");
            expect(t.paramDump().row).toEqual(2);
            expect(t.paramDump().col).toEqual(3);
            t.move("0", "0");
            expect(t.paramDump().row).toEqual(0);
            expect(t.paramDump().col).toEqual(0);
        });

        it("write overWrite", function () {
            var t = terminal();
            t.move(5, 5);
            t.modeOverWrite();
            t.write("x");
            t.write("y");
            t.write("z");
            t.write("a");
            t.write("b");
            expect(t.readScreen()[5]).toEqual([' ', ' ', ' ', ' ', ' ', 'x', 'y', 'z', 'a', 'b']);
            t.write("c");
            expect(t.readScreen()[5]).toEqual([' ', ' ', ' ', ' ', ' ', 'x', 'y', 'z', 'a', 'c']);
            t.move(5, 6);
            t.write("m");
            expect(t.readScreen()[5]).toEqual([' ', ' ', ' ', ' ', ' ', 'x', 'm', 'z', 'a', 'c']);
        });

        it("write insert", function () {
            var t = terminal();
            t.move(5, 5);
            t.modeInsert();
            t.write("x");
            t.write("y");
            t.write("z");
            t.write("a");
            t.write("b");
            expect(t.readScreen()[5]).toEqual([' ', ' ', ' ', ' ', ' ', 'x', 'y', 'z', 'a', 'b']);
            t.move(5, 5);
            t.write("c");
            expect(t.readScreen()[5]).toEqual([' ', ' ', ' ', ' ', ' ','c', 'x', 'y', 'z', 'a']);
        });
    });

    describe("Output scenarios to console", function () {
        it("scenario 1", function () {
            var t = terminal();
            var commands = TerminalCommands(t);

            input.forEach(function (line) {
                var cmds = getCommands(commands, line);
                cmds.forEach(function (cmd) {
                    cmd.command.execute(cmd.line);
                });
            });
            
            t.readScreen().forEach(function (l) {
                console.log(trimr(l).join(""));
            });

        });

        it("scenario 2", function () {
            var t = terminal();
            var commands = TerminalCommands(t);

            input2.forEach(function (line) {
                var cmds = getCommands(commands, line);
                cmds.forEach(function (cmd) {
                    cmd.command.execute(cmd.line);
                });
            });

            t.readScreen().forEach(function (l) {
                console.log(trimr(l).join(""));
            });
        });
    });
});

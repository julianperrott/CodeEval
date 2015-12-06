/* https://www.codeeval.com/open_challenges/195/

Crime House





Challenge Description:

This challenge appeared in Google Code Jam competition, licensed under Creative Commons Attribution License 

While working for the police, you've identified a house where people go to commit crimes, called Crime House. One day, you set up a camera over the door of the house and record a video. 

You don't know how many people were in Crime House at the start of the day, but you can see people enter and leave through the front door. Unfortunately, because the people entering and leaving Crime House are criminals, sometimes they wear masks; and you aren't quite sure if the front door is the only way in or out. 

Sometimes you can guess who was wearing a mask. If criminal #5 entered the house, then someone wearing a mask left, then criminal #5 entered the house again, then either the person wearing the mask was criminal #5, or there is another way out of Crime House. 

At the end of the day, when Crime House has closed its doors for the night, you watch your video. Because you're an optimist, you want to figure out if it's possible that there are no other entrances or exits from crime house; and if so, you want to figure out the minimum number of people who could be in Crime House at the end of the day. 

Input sample:

The first argument is a path to a file. Each line of the input file contains one test case. Each test case starts with a single integer N, the number of times people pass through the front door of Crime House in the day. Next, after the semicolon, follows N events, separated by a pipe. Each event contains information about one person entering or leaving Crime House through the front door. 

That information consists of a single character, E or L, followed by a space and then an integer id. If the first character is E, that indicates someone entered Crime House through the front door; if it's L, someone left through the front door. If id is greater than zero, the person with that identifier entered or left Crime House. If id is zero, then the person who entered or left Crime House was wearing a mask, and we don't know who he or she was. 

3; E 5|L 0|E 5
2; L 1|L 1
4; L 1|E 0|E 0|L 1
7; L 2|E 0|E 1|E 2|E 0|E 3|L 4
13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4

Output sample:

For each test case, output one line containing the answer. If it's possible that there are no other entrances or exits from Crime House, then the answer should be the minimum number of people who could be in Crime House at the end of the day. If that's impossible, it should be "CRIME TIME". 

1
CRIME TIME
1
4
0


Constraints:
1.The number of test cases is 20.
2.Ids of criminals are in range from 0 to 2000 inclusive.
3.The number of events is in range from 1 to 15 inclusive.

*/

function crimeTime(line) {
    var crimLog = [];
    var unknownEnter = [];
    var unknownLeave = [];

    var LEAVE = -1;
    var ENTER = 1;

    var CountInHouse = function () {
        return crimLog
            .filter(function (v) { return v.direction == ENTER; })
            .length;
    };

    var GetCriminal = function (id) {
        return crimLog.filter(function (v) { return v.id == id; })[0];
    };

    try {
        line.split(";")[1]
            .trim()
            .split("|")
            .forEach(function (event, index) {
                var args = event.split(" ");
                var direction = args[0] == "E" ? ENTER : LEAVE;
                var id = args[1];

                if (id == "0") {
                    if (direction == ENTER) {
                        unknownEnter.push(index);
                        return;
                    }
                    else { // LEAVE
                        if (CountInHouse() == 0) {

                            if (unknownEnter.length > 0) {
                                // an unknown person has left the house, remove the earliest entry
                                unknownEnter.shift();
                                return;
                            }

                            return; // discard unknown leave - as no one is in the house
                        };

                        unknownLeave.push(index); // store index of leave
                        return;
                    }
                }

                var criminal = GetCriminal(id);

                // new criminal discovered
                if (criminal == undefined) {
                    crimLog.push({ id: id, direction: direction, index: index });

                    // is the unknown criminal leaving
                    if (direction == LEAVE) {
                        // could they have entered wearing a mask ?
                        if (unknownEnter.length > 0) {
                            // assume that they did, remove earliest entry
                            unknownEnter.shift();
                        }
                    }

                    return;
                };

                if (direction == ENTER) {
                    if (criminal.direction == ENTER) {
                        //already in, could they have left wearing a mask ?
                        //find the first leaving after they went in, 
                        // we will assume that is when they left
                        var availableUnknownLeaves = unknownLeave
                            .filter(function (leaveIndex) { return leaveIndex > criminal.index })
                            .sort();

                        if (availableUnknownLeaves.length == 0) {
                            // unable to find an anonymous leaving to after they went in.
                            throw "CRIME TIME";
                        }

                        // remove the used anonymous leaving
                        unknownLeave = unknownLeave.filter(function (leaveIndex) { return leaveIndex != availableUnknownLeaves[0]; });

                        // update the index criminal entered the house
                        criminal.index = index;
                        return;
                    } else {
                        //its ok we known they are outside so mark them back in
                        criminal.direction = direction;
                        criminal.index = index;
                        return;
                    }
                }
                else { // LEAVE
                    if (criminal.direction == ENTER) {
                        //its ok we known they are inside so mark them as outside
                        criminal.direction = direction;
                        criminal.index = index;
                        return;
                    }
                    else {
                        // so we think they are outside, but they are leaving again.
                        // do we have any anonymous entrances available ?

                        var availableUnknownEnters = unknownEnter
                           .filter(function (enterIndex) { return enterIndex > criminal.index })
                           .sort();

                        if (availableUnknownEnters.length == 0) {
                            // unable to find an anonymous entry to after they left.
                            throw "CRIME TIME";
                        }

                        // remove the used anonymous leaving
                        unknownEnter = unknownEnter.filter(function (enterIndex) { return enterIndex != availableUnknownEnters[0]; });

                        criminal.index = index;
                        return;
                    };
                };
            });
    } catch (e) {
        if (e !== "CRIME TIME") { throw e; }
        return e;
    }

    criminalsInside = crimLog.filter(function (c) { return c.direction == ENTER; });

    unknownLeave.forEach(function (leaveIndex) {
        var firstCriminalEnteringBeforeUnknownLeave = criminalsInside.filter(function (c) { return c.index < leaveIndex; }).sort()[0];

        if (firstCriminalEnteringBeforeUnknownLeave !== undefined) {
            criminalsInside = criminalsInside.filter(function (c) { return c.index !== firstCriminalEnteringBeforeUnknownLeave.index; });
        }
        else {
            var firstUnknownEntryBeforeUnknownLeave = unknownEnter.filter(function (index) { return index < leaveIndex; }).sort()[0];
            if (unknownEnter!==undefined){
                unknownEnter = unknownEnter.filter(function (index) { return index !== firstUnknownEntryBeforeUnknownLeave; });
            }
        }
    });

    return (criminalsInside.length + unknownEnter.length).toString();
};

describe("crimeTime", function () {
    it('Scenario 0 - a', function () { expect(crimeTime('7; E 1920|E 0|E 1878|E 663|L 202|L 1421|L 0')).toEqual('2'); });
    it('Scenario 0 - b', function () { expect(crimeTime('8; E 1|L 0|E 0|L 1|L 0')).toEqual('0'); });
    it('Scenario 0 - c', function () { expect(crimeTime('8; E 1|L 0|E 0|L 1')).toEqual('0'); });
    it('Scenario 1', function () { expect(crimeTime('3; E 5|L 0|E 5')).toEqual('1'); });
    it('Scenario 2', function () { expect(crimeTime('2; L 1|L 1')).toEqual('CRIME TIME'); });
    it('Scenario 3', function () { expect(crimeTime('4; L 1|E 0|E 0|L 1')).toEqual('1'); });
    it('Scenario 4', function () { expect(crimeTime('7; L 2|E 0|E 1|E 2|E 0|E 3|L 4')).toEqual('4'); });
    it('Scenario 5', function () { expect(crimeTime('13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4')).toEqual('0'); });
    it('Scenario 6', function () { expect(crimeTime('15; L 0|L 0|L 348|E 0|L 1036|L 1679|E 0|E 0|E 0|E 0|E 630|L 1760|E 0|E 0|L 0')).toEqual('5'); });
    it('Scenario 7', function () { expect(crimeTime('15; L 0|L 0|E 0|L 671|E 0|E 0|E 1480|E 0|L 1878|L 0|L 1316|E 0|E 0|E 0|E 0')).toEqual('5'); });
    it('Scenario 8', function () { expect(crimeTime('13; L 348|E 0|L 1036|L 1679|E 0|E 0|E 0|E 0|E 630|L 1760|E 0|E 0|L 0')).toEqual('5'); });
    it('Scenario 9', function () { expect(crimeTime('13; E 0|L 671|E 0|E 0|E 1480|E 0|L 1878|L 0|L 1316|E 0|E 0|E 0|E 0')).toEqual('5'); });
    it('Scenario 10', function () { expect(crimeTime('8; E 1|L 0|E 3|E 2|E 0|L 2|L 1|L 0')).toEqual('0'); });
    it('Scenario 11', function () { expect(crimeTime('15; E 0|L 0|L 0|L 0|L 0|L 528|L 0|E 0|E 0|E 0|E 0|L 0|L 0|L 1268|L 353')).toEqual('0'); });
    it('Scenario 12', function () { expect(crimeTime('15; L 1568|L 981|E 0|L 0|E 0|L 0|L 0|L 0|L 1802|E 1624|L 0|E 0|E 29|E 981|L 0')).toEqual('2'); });
    it('Scenario 13', function () { expect(crimeTime('15; E 0|E 0|E 0|E 1881|L 0|E 0|E 0|L 0|L 0|E 0|E 0|E 0|L 1543|E 0|L 1217')).toEqual('5'); });
    it('Scenario 14', function () { expect(crimeTime('14; L 1|L 2|L 3|L 4|L 5|E 0|E 0|E 0|E 0|L 1|L 2|L 3|L 4|L 5')).toEqual('CRIME TIME'); });
    it('Scenario 15', function () { expect(crimeTime('15; L 294|E 0|L 1451|L 0|E 0|E 0|L 0|E 1039|E 0|E 0|L 139|E 0|L 0|E 1664|E 0')).toEqual('5'); });
    it('Scenario 16', function () { expect(crimeTime('15; E 0|L 0|E 0|L 1756|E 0|E 0|E 0|L 0|L 0|E 0|L 0|L 0|L 0|E 591|E 0')).toEqual('2'); });
    it('Scenario 17', function () { expect(crimeTime('15; E 1920|E 0|E 1878|E 0|L 0|E 663|E 981|L 202|L 1421|E 0|L 0|L 0|L 981|E 0|L 0')).toEqual('1'); });
    it('Scenario 18', function () { expect(crimeTime('7; L 2|E 0|E 1|E 2|E 0|E 3|L 4')).toEqual('4'); });
    it('Scenario 19', function () { expect(crimeTime('15; E 1700|E 0|E 0|E 0|L 1482|E 0|L 0|E 0|E 951|E 0|L 0|L 0|E 0|E 0|E 0')).toEqual('7'); });
    it('Scenario 20', function () { expect(crimeTime('15; L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0')).toEqual('0'); });
    it('Scenario 21', function () { expect(crimeTime('2; L 1|L 1')).toEqual('CRIME TIME'); });
    it('Scenario 22', function () { expect(crimeTime('15; L 0|E 303|E 0|E 596|L 0|L 0|E 0|L 0|E 0|L 0|L 1685|E 0|E 0|E 0|L 1685')).toEqual('2'); });
    it('Scenario 23', function () { expect(crimeTime('14; E 303|E 0|E 596|L 0|L 0|E 0|L 0|E 0|L 0|L 1685|E 0|E 0|E 0|L 1685')).toEqual('2'); });
    it('Scenario 24', function () { expect(crimeTime('15; L 0|E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0')).toEqual('4'); });
    it('Scenario 25', function () { expect(crimeTime('14; E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0')).toEqual('4'); });
    it('Scenario 26', function () { expect(crimeTime('15; E 181|L 0|E 0|L 0|E 0|E 0|E 0|E 0|L 154|E 0|E 1126|L 96|E 0|E 0|L 96')).toEqual('5'); });
    it('Scenario 27', function () { expect(crimeTime('15; E 0|L 0|E 261|E 0|L 0|L 0|L 919|E 0|L 0|L 0|L 762|E 0|L 0|E 0|E 700')).toEqual('2'); });
    it('Scenario 28', function () { expect(crimeTime('2; L 1|L 1')).toEqual('CRIME TIME'); });
    it('Scenario 29', function () { expect(crimeTime('15; L 0|L 556|E 0|E 0|E 0|E 1019|L 0|L 0|E 0|E 0|L 0|L 0|L 1401|L 835|E 0')).toEqual('1'); });
    it('Scenario 30', function () { expect(crimeTime('14; L 556|E 0|E 0|E 0|E 1019|L 0|L 0|E 0|E 0|L 0|L 0|L 1401|L 835|E 0')).toEqual('1'); });
    it('Scenario 31', function () { expect(crimeTime('13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4')).toEqual('0'); });
    it('Scenario 32', function () { expect(crimeTime('15; E 0|E 0|E 0|E 0|E 0|E 0|E 0|L 660|L 1112|L 1731|L 1064|L 884|L 963|L 22|L 1607')).toEqual('0'); });
    it('Scenario 33', function () { expect(crimeTime('15; E 1398|L 0|E 1358|L 418|L 0|E 0|L 0|L 0|L 1737|E 1040|L 0|L 0|E 0|L 0|L 0')).toEqual('0'); });
    it('Scenario 34', function () { expect(crimeTime('15; E 184|E 91|E 433|E 165|E 1142|E 146|E 1772|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0')).toEqual('0'); });
    it('Scenario 35', function () { expect(crimeTime('15; L 0|E 0|E 0|L 0|L 0|E 0|E 0|L 0|L 1110|L 0|E 374|L 0|L 0|L 0|L 0')).toEqual('0'); });
    it('Scenario 36', function () { expect(crimeTime('15; L 0|E 1271|L 0|L 0|E 1271|E 0|L 0|L 0|E 0|L 0|E 0|L 0|L 0|L 129|L 0')).toEqual('0'); });
    it('Scenario 37', function () { expect(crimeTime('15; E 0|E 1567|E 1693|L 0|E 0|L 0|L 0|E 0|E 0|L 0|E 0|L 1426|E 0|L 0|L 1210')).toEqual('1'); });
    it('Scenario 38', function () { expect(crimeTime('15; L 0|E 1184|L 0|L 0|E 0|L 0|E 485|E 0|L 0|E 0|L 0|L 0|E 1184|L 275|E 1751')).toEqual('2'); });
    it('Scenario 39', function () { expect(crimeTime('15; L 0|L 0|L 0|L 0|L 1469|L 0|E 0|L 0|L 0|L 0|L 164|L 1647|E 0|L 0|E 0')).toEqual('1'); });
    it('Scenario 40', function () { expect(crimeTime('3; E 5|L 0|E 5')).toEqual('1'); });
    it('Scenario 41', function () { expect(crimeTime('4; L 1|E 0|E 0|L 1')).toEqual('1'); });
    it('Scenario 42', function () { expect(crimeTime('15; E 0|E 1610|L 1265|L 0|L 0|L 140|L 0|E 0|L 0|E 0|E 0|E 924|L 287|L 0|E 0')).toEqual('2'); });
    it('Scenario 43', function () { expect(crimeTime('15; E 0|L 0|E 0|L 1756|E 0|E 0|E 0|L 0|L 0|E 0|L 0|L 0|L 0|E 591|E 0')).toEqual('2'); });
    it('Scenario 44', function () { expect(crimeTime('15; E 0|L 0|E 261|E 0|L 0|L 0|L 919|E 0|L 0|L 0|L 762|E 0|L 0|E 0|E 700')).toEqual('2'); });
    it('Scenario 45', function () { expect(crimeTime('15; E 0|L 0|L 0|E 1233|E 0|L 0|E 0|E 0|E 769|L 0|E 0|E 0|L 0|L 0|L 0')).toEqual('2'); });
    it('Scenario 46', function () { expect(crimeTime('15; E 519|L 0|L 0|L 0|E 0|E 0|L 0|L 0|L 0|L 0|L 0|E 0|L 0|E 0|E 0')).toEqual('2'); });
    it('Scenario 47', function () { expect(crimeTime('15; L 1568|L 981|E 0|L 0|E 0|L 0|L 0|L 0|L 1802|E 1624|L 0|E 0|E 29|E 981|L 0')).toEqual('2'); });
    it('Scenario 48', function () { expect(crimeTime('15; E 0|E 0|L 0|E 0|E 1926|L 0|E 0|L 0|E 0|E 0|E 0|E 988|L 0|L 1077|L 0')).toEqual('3'); });
    it('Scenario 49', function () { expect(crimeTime('15; E 0|E 594|L 520|E 0|L 985|E 1272|L 0|E 0|L 0|E 594|E 0|L 148|E 0|E 0|L 1821')).toEqual('3'); });
    it('Scenario 50', function () { expect(crimeTime('15; E 0|E 992|E 835|E 1542|L 0|E 0|L 789|E 1031|L 0|L 1437|L 0|E 0|E 387|E 0|L 1031')).toEqual('3'); });
    it('Scenario 51', function () { expect(crimeTime('15; L 0|E 1221|E 0|L 0|L 0|E 1206|L 0|E 0|L 0|L 0|E 0|E 0|E 0|E 1210|L 0')).toEqual('3'); });
    it('Scenario 52', function () { expect(crimeTime('15; L 0|L 472|L 0|L 0|E 0|E 0|E 0|L 0|E 0|L 0|E 0|E 1446|L 472|E 0|L 0')).toEqual('3'); });
    it('Scenario 53', function () { expect(crimeTime('15; L 0|E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0')).toEqual('4'); });
    it('Scenario 54', function () { expect(crimeTime('15; E 0|E 0|E 0|E 1881|L 0|E 0|E 0|L 0|L 0|E 0|E 0|E 0|L 1543|E 0|L 1217')).toEqual('5'); });
    it('Scenario 55', function () { expect(crimeTime('15; L 294|E 0|L 1451|L 0|E 0|E 0|L 0|E 1039|E 0|E 0|L 139|E 0|L 0|E 1664|E 0')).toEqual('5'); });
    it('Scenario 56', function () { expect(crimeTime('15; L 691|E 1119|E 0|L 0|L 1200|L 1119|E 0|E 0|E 1366|E 0|E 0|E 933|L 0|E 430|L 658')).toEqual('5'); });
    it('Scenario 57', function () { expect(crimeTime('15; L 0|E 0|L 0|E 0|E 0|E 0|E 0|E 0|L 0|E 0|E 138|L 868|L 0|E 0|E 0')).toEqual('6'); });
    it('Scenario 58', function () { expect(crimeTime('15; E 0|E 0|L 0|L 0|L 0|L 0|E 1422|E 0|E 0|E 0|E 714|E 0|L 0|E 502|E 0')).toEqual('7'); });
    it('Scenario 59', function () { expect(crimeTime('15; E 0|E 1554|E 0|L 0|E 0|E 0|L 0|L 0|E 0|E 1049|L 0|E 0|E 0|E 0|E 0')).toEqual('7'); });
    it('Scenario 60', function () { expect(crimeTime('15; E 1700|E 0|E 0|E 0|L 1482|E 0|L 0|E 0|E 951|E 0|L 0|L 0|E 0|E 0|E 0')).toEqual('7'); });
    it('Scenario 61', function () { expect(crimeTime('15; E 0|L 0|E 1590|L 1800|L 0|L 1800|E 147|E 0|E 0|E 0|E 0|E 0|L 0|E 0|L 0')).toEqual('CRIME TIME'); });
    it('Scenario 62', function () { expect(crimeTime('15; E 0|L 478|L 0|L 0|L 478|L 0|L 1255|E 1464|L 0|L 0|E 1464|E 0|E 0|L 0|L 0')).toEqual('CRIME TIME'); });
    it('Scenario 63', function () { expect(crimeTime('15; L 0|L 0|L 0|E 1392|L 0|E 0|E 0|L 0|L 0|L 0|L 749|L 0|E 0|E 845|L 749')).toEqual('1'); });
    it('Scenario 64', function () { expect(crimeTime('15; L 0|L 0|L 0|L 0|L 0|L 0|E 0|E 0|E 0|E 0|E 0|E 0|E 0|E 1|E 1')).toEqual('CRIME TIME'); });
    it('Scenario 65', function () { expect(crimeTime('15; L 0|L 574|E 0|L 0|L 574|E 0|L 0|E 0|L 1402|L 88|L 0|E 0|E 0|E 0|L 0')).toEqual('2'); });
    it('Scenario 66', function () { expect(crimeTime('15; L 1705|L 0|E 1292|E 0|L 0|L 0|L 0|E 0|L 0|L 1705|E 0|L 0|L 0|E 0|L 0')).toEqual('0'); });
    it('Scenario 67', function () { expect(crimeTime('2; L 1|L 1')).toEqual('CRIME TIME'); });
});
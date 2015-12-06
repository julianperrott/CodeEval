/* https://www.codeeval.com/open_challenges/64/
CLIMBING STAIRS
CHALLENGE DESCRIPTION:

You are climbing a stair case. It takes n steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains a positive integer which is the total number of stairs. 
Ignore all empty lines. E.g.

10
20
OUTPUT SAMPLE:

Print out the number of ways to climb to the top of the staircase. E.g.

89
10946
Constraints: 
The total number of stairs is <= 1000
 */

function climbingStairs(line) {
    var pos = parseInt(line, 10);
    return fib(pos);
}

function fib(n) {
    var a1 = "1";
    var a2 = "2";
    var a3 = a2;
    var cnt = 2;

    while (cnt < n) {
        a3 = add(a1, a3);
        a1 = a2;
        a2 = a3;
        cnt++;
    }

    return a3;
}

function add(addend1, addend2) {

    var carry = 0;
    var i1 = addend1.length - 1
    var i2 = addend2.length - 1

    var buf = [];

    while( i1 >= 0 || i2 >= 0 || carry != 0){
        var digit1 = i1 < 0 ? 0 : parseInt(addend1.substring(i1,i1+1),10);
        var digit2 = i2 < 0 ? 0 : parseInt(addend2.charAt(i2,i2+1),10);
        var digit = digit1 + digit2 + carry;

        if (digit > 9) {
            carry = 1;
            digit -= 10;
        } else {
            carry = 0;
        }

        i1--;
        i2--;

        buf.push(digit);
    }

    return buf.reverse().join("");
}

describe("add", function () {
    it("1023+3439", function () { expect(add("1023", "3439")).toEqual("4462"); });

    it("1023+1", function () { expect(add("1023", "1")).toEqual("1024"); });
    it("1+3439", function () { expect(add("1", "3439")).toEqual("3440") });
});

describe("climbingStairs", function () {
    it("10", function () { expect(climbingStairs("10")).toEqual("89"); });
    it("20", function () { expect(climbingStairs("20")).toEqual("10946"); });
    it("998", function () { expect(climbingStairs("998")).toEqual("26863810024485359386146727202142923967616609318986952340123175997617981700247881689338369654483356564191827856161443356312976673642210350324634850410377680367334151172899169723197082763985615764450078474174626"); });
    it("999", function () { expect(climbingStairs("999")).toEqual("43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228875"); });
});
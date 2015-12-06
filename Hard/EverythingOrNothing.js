/* https://www.codeeval.com/open_challenges/216/

Everything or nothing

Challenge Description:

Today, you have a top-secret assignment. You will have access to a super confidential information about documents with the highest security rate. There are only three such documents in the world which include extremely important information. If any of these files fall into the wrong hands, there is a risk that the global balance of power can be destroyed. 
 Only 6 people have access to these files, each with the different access rights—from a total ban to a full access. Several lines of code from these files leaked into the Internet recently. Your task will be to check the code that we provide. But, be careful: if you agree to take this task, you automatically sign an agreement on non-disclosure of confidential information; otherwise, we will have to … you. 

 The following is a transcript of all rights to the files: 
 0 - total ban;
 1 - grant;
 2 - write;
 3 - write, grant;
 4 - read;
 5 - read, grant;
 6 - read, write;
 7 - full access (read, write, grant); 

 The following table shows what access to a particular file each of these 6 users had. 

         file_1   file_2   file_3
user_1     7        3        0
user_2     6        2        4
user_3     5        1        5
user_4     3        7        1
user_5     6        0        2
user_6     4        2        6

Input sample:

The first argument is a path to a file. Each line includes a test case with several lines of code separated by a space. In each line, first comes the user name, then the file name, and finally what the user done with this file. 
 If it is granting an access to someone, then the code contains the action that is granted followed by a name of a user who has been granted access. For each test case, a table above will be a starting point. That is, if the action is user_3=>file_3=>grant=>read=>user_1, the number in the table for user_1 will change from 0 to 4. However, for the next test cases, it will again be 0. 

For example: 

user_1=>file_1=>read user_2=>file_2=>write
user_1=>file_1=>grant=>read=>user_4 user_4=>file_1=>read
user_4=>file_1=>read

Output sample:

You must go through all the lines of code, and if at least one is not correct, print False; otherwise, bring True. 

True
True
False

Constraints:
1. The table with users is the same for each test case, but it can change within a test case depending on the code. 
2.The number of lines of code in a test case can be from 1 to 8.
3.User with grant permissions can provide rights on read and write to himself.
4.The number of test cases is 40.

*/
function authorisation() {
    var users = ["user_1", "user_2", "user_3", "user_4", "user_5", "user_6"];
    var files = ["file_1", "file_2", "file_3"];
    var actions = ["grant", "write", "read"];
    var permissions = [[7, 3, 0], [6, 2, 4], [5, 1, 5], [3, 7, 1], [6, 0, 2], [4, 2, 6]];

    function toUserIndex(value) {
        var index = users.indexOf(value);
        if (index < 0) { throw "Invalid user: " + value; }
        return index;
    }

    function toFileIndex(value){
        var index= files.indexOf(value);
        if (index<0) { throw "Invalid file: "+ value;}
        return index;
    }

    function toPermission(value){
        var index= actions.indexOf(value);
        if (index <0) { throw "Invalid permission: "+value;}
        return Math.pow(2,index);
    }

    function hasPermission(userIndex, fileIndex, permission) {
        if (permissions.length <= userIndex || userIndex < 0) { throw "User index not found in permissions: " + userIndex; }
        if (permissions[userIndex] <= fileIndex || fileIndex < 0) { throw "File index not found in user permissions: " + userIndex + "," + fileIndex; }
        return (permissions[userIndex][fileIndex] & permission) > 0;
    }

    var isAuthorised = function (user,file,permission) {
        return hasPermission(toUserIndex(user), toFileIndex(file), toPermission(permission));
    };

    var grant = function (user,file,permission,toUser) {
        if (!isAuthorised(user,file,"grant")){
            return false;
        }
        var userIndex = toUserIndex(toUser);
        var fileIndex = toFileIndex(file);
        permissions[userIndex][fileIndex] = permissions[userIndex][fileIndex] | toPermission(permission);
        return true;
    };

    return {
        isAuthorised: isAuthorised,
        grant: grant,
    };
}

function authorise(line) {

    var auth = authorisation();

    function authoriseCommand(auth, command) {
        var args = command.split("=>");
        if (args.length == 3) {
            return auth.isAuthorised(args[0], args[1], args[2]);
        } else if (args.length == 5) {
            return auth.grant(args[0], args[1], args[3], args[4]);
        } else {
            throw "Unknown command structure: " + command;
        }
    }

    return line.split(" ").reduce(function(valid, command)
    {
        return !valid ? false : authoriseCommand(auth, command);
    },true);
}

describe("authorisation", function () {
    it("grant allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_1", "grant")).toEqual(true);
    });

    it("read allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_1", "read")).toEqual(true);
    });

    it("write allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_1", "write")).toEqual(true);
    });

    it("grant not allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_3", "grant")).toEqual(false);
    });

    it("read not allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_3", "read")).toEqual(false);
    });

    it("write not allowed", function () {
        var auth = authorisation();
        expect(auth.isAuthorised("user_1", "file_3", "write")).toEqual(false);
    });

    it("user unknown", function () {
        var auth = authorisation();
        expect(function () { auth.isAuthorised("user_99", "file_1", "grant") }).toThrow("Invalid user: user_99");
    });

    it("user unknown", function () {
        var auth = authorisation();
        expect(function () { auth.isAuthorised("user_1", "file_99", "grant") }).toThrow("Invalid file: file_99");
    });

    it("permission unknown", function () {
        var auth = authorisation();
        expect(function () { auth.isAuthorised("user_1", "file_1", "banana") }).toThrow("Invalid permission: banana");
    });

    it("grant valid", function () {
        var auth = authorisation();
        expect(auth.grant("user_4", "file_1","read", "user_5" )).toEqual(true);
    });

    it("grant to unknown user", function () {
        var auth = authorisation();
        expect(function () { auth.grant("user_4", "file_1", "read", "user_99") }).toThrow("Invalid user: user_99");
    });

    it("grant of unknown permission", function () {
        var auth = authorisation();
        expect(function () { auth.grant("user_4", "file_1", "banana", "user_5") }).toThrow("Invalid permission: banana");
    });

    it("grant but not authorised", function () {
        var auth = authorisation();
        expect(auth.grant("user_1", "file_3", "read", "user_5")).toEqual(false);
    });

    it("scenario 1", function () {
        expect(authorise("user_1=>file_1=>read user_2=>file_2=>write")).toEqual(true);
    });

    it("scenario 2", function () {
        expect(authorise("user_1=>file_1=>grant=>read=>user_4 user_4=>file_1=>read")).toEqual(true);
    });

    it("scenario 3", function () {
        expect(authorise("user_4=>file_1=>read")).toEqual(false);
    });
});



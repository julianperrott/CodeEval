{- https://www.codeeval.com/open_challenges/42/
UGLY NUMBERS
SPONSORING COMPANY:

  

CHALLENGE DESCRIPTION:


Credits: This challenge has appeared in a google competition before.
Once upon a time in a strange situation, people called a number ugly if it was divisible by any of the one-digit primes (2, 3, 5 or 7). Thus, 14 is ugly, but 13 is fine. 39 is ugly, but 121 is not. Note that 0 is ugly. Also note that negative numbers can also be ugly: -14 and -39 are examples of such numbers.

One day on your free time, you are gazing at a string of digits, something like:

123456
You are amused by how many possibilities there are if you are allowed to insert plus or minus signs between the digits. For example you can make: 
1 + 234 - 5 + 6 = 236
which is ugly. Or

123 + 4 - 56 = 71
which is not ugly. 

It is easy to count the number of different ways you can play with the digits: Between each two adjacent digits you may choose put a plus sign, a minus sign, or nothing. Therefore, if you start with D digits there are 3^(D-1) expressions you can make. Note that it is fine to have leading zeros for a number. If the string is '01023', then '01023', '0+1-02+3' and '01-023' are legal expressions. 

Your task is simple: Among the 3^(D-1) expressions, count how many of them evaluate to an ugly number.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file is one test case. Each test case will be a single line containing a non-empty string of decimal digits. The string in each test case will be non-empty and will contain only characters '0' through '9'. Each string is no more than 13 characters long. E.g.

1
9
011
12345
OUTPUT SAMPLE:

Print out the number of expressions that evaluate to an ugly number for each test case, each one on a new line. E.g.

0
1
6
64
-}
module CodeEval.UglyNumbers2 where
import Test.Hspec
import Data.List.Split

calcTotal::(Int,Char,String) -> Int
calcTotal (total,sign,acc)
      | sign =='+' = total + accInt
      | otherwise = total - accInt
  where accInt =  read acc::Int

procSum::(Int,Char,String)->Char->[(Int,Char,String)]
procSum (total,sign,acc) nextChar =  [(total, sign, acc ++ [nextChar])] ++ [(newTotal, '+', [nextChar])] ++ [(newTotal, '-', [nextChar])]
    where newTotal = calcTotal (total,sign,acc)

recOperators::[(Int,Char,String)]->String->[Int]
recOperators paths remainder
  | length remainder == 0 = map (\path-> calcTotal path) paths
  | otherwise = (\x -> recOperators x (tail remainder))  $ concat $ map (\x-> procSum x (head remainder)) paths

isUgly:: Int-> Int
isUgly n
  | mod n 2 == 0 = 1
  | mod n 3 == 0 = 1
  | mod n 5 == 0 = 1
  | mod n 7 == 0 = 1
  | otherwise = 0

countZeros::String->Int
countZeros line = cntZero 0 line
  where
    cntZero n xs
      | xs == "0" = n+1
      | head xs == '0' = cntZero (n+1) (tail xs)
      | otherwise = n

uglyNumbers::String->Int
uglyNumbers line
  | length line == zc = 3^(zc-1)
  | otherwise = (3^zc) * (sum $ map isUgly $ recOperators [(0,'+',[head nl])] (tail nl))
  where
    zc = countZeros line
    nl = drop zc line

test = hspec $ do
  describe "uglyNumbers" $ do
    it "0" $ do uglyNumbers "0"  `shouldBe` 1
    it "1" $ do uglyNumbers "1"  `shouldBe` 0
    it "9" $ do uglyNumbers "9"  `shouldBe` 1
    it "011" $ do uglyNumbers "011"  `shouldBe` 6
    it "12345" $ do uglyNumbers "12345"  `shouldBe` 64
    it "045" $ do uglyNumbers "045"  `shouldBe` 6
    it "0000000000277" $ do uglyNumbers "0000000000277"  `shouldBe` 413343
    it "08" $ do uglyNumbers "08"  `shouldBe` 3
    it "64920" $ do uglyNumbers "64920"  `shouldBe` 58
    it "95" $ do uglyNumbers "95"  `shouldBe` 3
    it "81080" $ do uglyNumbers "81080"  `shouldBe` 39 -- 53
    it "779936487" $ do uglyNumbers "779936487"  `shouldBe` 5087
    it "354038" $ do uglyNumbers "354038"  `shouldBe` 175 --177
    it "13" $ do uglyNumbers "13"  `shouldBe` 2
    it "1426" $ do uglyNumbers "1426"  `shouldBe` 18
    it "1316" $ do uglyNumbers "1316"  `shouldBe` 22
    it "0" $ do uglyNumbers "0"  `shouldBe` 1
    it "8509528845" $ do uglyNumbers "8509528845"  `shouldBe` 15401 --15391
    it "9" $ do uglyNumbers "9"  `shouldBe` 1
    it "1" $ do uglyNumbers "1"  `shouldBe` 0
    it "645558908" $ do uglyNumbers "645558908"  `shouldBe` 5029 --5079
    it "15075" $ do uglyNumbers "15075"  `shouldBe` 65
    it "247761" $ do uglyNumbers "247761"  `shouldBe` 181
    it "965" $ do uglyNumbers "965"  `shouldBe` 8
    it "0000000000277" $ do uglyNumbers "0000000000277"  `shouldBe` 413343
    it "3050775" $ do uglyNumbers "3050775"  `shouldBe` 579 --586
    it "011" $ do uglyNumbers "011"  `shouldBe` 6



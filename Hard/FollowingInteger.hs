module CodeEval.FollowingInteger where

{- https://www.codeeval.com/open_challenges/44/

FOLLOWING INTEGER
CHALLENGE DESCRIPTION:

Credits: This challenge has appeared in a past google competition 

You are writing out a list of numbers.Your list contains all numbers with exactly Di digits in its decimal representation which are equal to i, for each i between 1 and 9, inclusive. You are writing them out in ascending order. For example, you might be writing every number with two '1's and one '5'. Your list would begin 115, 151, 511, 1015, 1051. Given N, the last number you wrote, compute what the next number in the list will be. The number of 1s, 2s, ..., 9s is fixed but the number of 0s is arbitrary.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file is one test case. Each test case will contain an integer n < 10^6. E.g.

115
842
8000
OUTPUT SAMPLE:

For each line of input, generate a line of output which is the next integer in the list. E.g.

151
2048
80000
-}

import Test.Hspec
import Data.List

isMax::String -> Bool
isMax line = line == (reverse $ sort line)

addZero::String->String
addZero line = [noZeroLine!!0] ++ replicate zerosToAdd '0' ++ tail noZeroLine
  where 
    noZeroLine = sort $ filter (\c-> c /='0') line
    zerosToAdd = 1 + (length line - length noZeroLine)

replaceFirstDigit::String->String
replaceFirstDigit line = [(fst replaceChar)] ++ newTail
  where
    firstChar = line!!0
    oldTail = sort $ tail line
    replaceChar = (filter (\x -> fst x > firstChar)  $ zip oldTail [0..])!!0
    newTail = sort $ (take (snd replaceChar) oldTail) ++ [firstChar] ++ (drop (1+(snd replaceChar)) oldTail)

followingInteger::String->String
followingInteger line
  | isMax line = addZero line
  | isMax (tail line) = replaceFirstDigit line
  | otherwise = [head line] ++ followingInteger (tail line)


test = hspec $ do
  describe "followingInteger" $ do
    it "51100" $ do followingInteger "51100" `shouldBe` "100015"
    it "511" $ do followingInteger "511" `shouldBe` "1015"
    it "1432" $ do followingInteger "1432" `shouldBe` "2134"
    it "71239" $ do followingInteger "71239" `shouldBe` "71293"
    it "115" $ do followingInteger "115" `shouldBe` "151"
    it "151" $ do followingInteger "151" `shouldBe` "511"
    it "511" $ do followingInteger "511" `shouldBe` "1015"
    it "1015" $ do followingInteger "1015" `shouldBe` "1051"
    it "842" $ do followingInteger "842" `shouldBe` "2048"
    it "8000" $ do followingInteger "8000" `shouldBe` "80000"




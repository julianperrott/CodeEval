{- https://www.codeeval.com/open_challenges/38/

STRING LIST
CHALLENGE DESCRIPTION:

Credits: Challenge contributed by Max Demian. 

You are given a number N and a string S. Print all of the possible ways to write a string of length N from the characters in string S, comma delimited in alphabetical order.

INPUT SAMPLE:

The first argument will be the path to the input filename containing the test data. Each line in this file is a separate test case. Each line is in the format: N,S i.e. a positive integer, followed by a string (comma separated). E.g.

1,aa
2,ab
3,pop
OUTPUT SAMPLE:

Print all of the possible ways to write a string of length N from the characters in string S comma delimited in alphabetical order, with no duplicates. E.g.

a
aa,ab,ba,bb
ooo,oop,opo,opp,poo,pop,ppo,ppp

-}
module CodeEval.StringList where
import Test.Hspec
import Data.List
import Data.List.Split


stringList::String -> String
stringList line = intercalate "," $ stringPermutations "" n chars
  where
    args = splitOn "," line
    n = read (args!!0)::Int
    chars = sort $ nub $ args!!1


stringPermutations :: String -> Int-> String -> [String]
stringPermutations word n chars
  | length word == n = [word]
  | otherwise = concat $ map (\x -> stringPermutations (word++[x]) n chars) chars

test = hspec $ do
  describe "stringList" $ do
       it "1,aa" $ do stringList "1,aa" `shouldBe` "a"
       it "2,ab" $ do stringList "2,ab" `shouldBe` "aa,ab,ba,bb"
       it "3,pop" $ do stringList "3,pop" `shouldBe` "ooo,oop,opo,opp,poo,pop,ppo,ppp"

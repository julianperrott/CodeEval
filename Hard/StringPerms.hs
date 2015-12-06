{- https://www.codeeval.com/open_challenges/14/
STRING PERMUTATIONS
Write a program which prints all the permutations of a string in alphabetical order. We consider that digits < upper case letters < lower case letters. The sorting should be performed in ascending order.

INPUT SAMPLE:

Your program should accept a file as its first argument. The file contains input strings, one per line.

For example:

hat
abc
Zu6

OUTPUT SAMPLE:

Print to stdout the permutations of the string separated by comma, in alphabetical order.

For example:

aht,ath,hat,hta,tah,tha
abc,acb,bac,bca,cab,cba
6Zu,6uZ,Z6u,Zu6,u6Z,uZ6

-}
module CodeEval.StringPerms where
import Data.List
import Test.Hspec

stringPermutations:: String -> String
stringPermutations xs = intercalate "," $ sort $ stringPerms "" xs
  where 
    stringPerms pre remainder
          | length remainder == 1 = [pre ++ remainder]
          | otherwise = nub $ concatMap (\x -> stringPerms (pre ++ [remainder!!x]) (charsRemaining x)) [0..(length remainder)-1]
        where charsRemaining x =  (take x remainder) ++ (drop (x+1) remainder)


test = hspec $ do

  describe "stringPermutations" $ do
    it "hat" $ do stringPermutations "hat" `shouldBe` "aht,ath,hat,hta,tah,tha"
    it "abc" $ do stringPermutations "abc" `shouldBe` "abc,acb,bac,bca,cab,cba"
    it "Zu6" $ do stringPermutations "Zu6" `shouldBe` "6Zu,6uZ,Z6u,Zu6,u6Z,uZ6"


{-
import System.Environment
import System.Exit
import Data.List

main = getArgs >>= parse >>= putStr . process

parse [] = usage  >> exit
parse [f] = readFile f

process s = unlines $ map processLine $ lines s

usage   = putStrLn "Usage: foo <file>"
exit    = exitWith ExitSuccess

processLine:: String -> String
processLine xs = intercalate "," $ sort $ stringPerms "" xs
  where 
    stringPerms pre remainder
          | length remainder == 1 = [pre ++ remainder]
          | otherwise = nub $ concatMap (\x -> stringPerms (pre ++ [remainder!!x]) (charsRemaining x)) [0..(length remainder)-1]
        where charsRemaining x =  (take x remainder) ++ (drop (x+1) remainder)
-}
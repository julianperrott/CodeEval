module CodeEval.StringSearching where

{- https://www.codeeval.com/open_challenges/28/
STRING SEARCHING
CHALLENGE DESCRIPTION:

You are given two strings. Determine if the second string is a substring of the first (Do NOT use any substr type library function). The second string may contain an asterisk(*) which should be treated as a regular expression i.e. matches zero or more characters. The asterisk can be escaped by a \ char in which case it should be interpreted as a regular '*' character. To summarize: the strings can contain alphabets, numbers, * and \ characters.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. The input file contains two comma delimited strings per line. E.g.

Hello,ell
This is good, is
CodeEval,C*Eval
Old,Young
OUTPUT SAMPLE:

If the second string is indeed a substring of the first, print out a 'true'(lowercase), else print out a 'false'(lowercase), one per line. E.g.

true
true
true
false
-}

import Test.Hspec
import Data.List.Split

parseSearchTermAsterisk::String->[String]
parseSearchTermAsterisk term
  | length term == 0 = ["#"]++[""]
  | last term == '\\' = [(init term) ++ "*"]
  | otherwise = [term]++["#"]++[""]

parseSearchTermCharacter::[String]->Char->[String]
parseSearchTermCharacter terms char
  | char == '*' = init terms ++ parseSearchTermAsterisk (last terms)
  | otherwise = init terms ++ [(last terms)++[char]]


getSearchTerms::String->[String]
getSearchTerms line = filter (\v -> length v >0) $ foldl parseSearchTermCharacter [""] line

findIndexOfString::String->String->Int
findIndexOfString value search
    | indexes == [] = -1
    | otherwise = head indexes 
    where
    indexes = filter (\i-> (take (length search) $ drop i value) == search) [0..(length value-length search)]

doSearch::String->Bool
doSearch line = searchForTerm value terms
  where
      args = splitOn "," line
      value = args!!0
      terms = getSearchTerms (args!!1)

searchForTerm::String->[String]->Bool
searchForTerm value terms
  | length terms == 0 = True
  | searchTerm == "#" = searchForTerm value termsTail
  | termIndex == -1 = False -- didn't find term
  | otherwise = searchForTerm newValue termsTail
  where 
    searchTerm = head terms
    termIndex = findIndexOfString value searchTerm
    newValue = drop (termIndex+length searchTerm) value
    termsTail = drop 1 terms

test = hspec $ do
    describe "getSearchTerms" $ do
        it "single term" $ do (length $ getSearchTerms "abc") `shouldBe` 1
        it "wildcard at end of terms" $ do (length $ getSearchTerms "abc*") `shouldBe` 2
        it "wildcard at end of terms - term 0 = abc" $ do (getSearchTerms "abc*")!!0 `shouldBe` "abc"
        it "wildcard at end of terms - term 1 = *" $ do (getSearchTerms "abc*")!!1 `shouldBe` "#"
        it "wildcard at start of terms" $ do (length $ getSearchTerms "*abc") `shouldBe` 2
        it "wildcard in middle of terms" $ do (length $ getSearchTerms "def*abc") `shouldBe` 3
        it "escaped *" $ do (length $ getSearchTerms "def\\*abc") `shouldBe` 1

    describe "search" $ do
        it "single term - found" $ do doSearch "Vj6vE,vE" `shouldBe` True
        it "wildcard term - found" $ do doSearch "Vc9 2DwsSMIbTuUk 0EdvYkXxLb1qGtgGqkE,dvYkX*q" `shouldBe` True
        it "single term - not found" $ do doSearch "kK Ov5PHBOlcfN23AnqGuWvuxxsn gvkVLBdqXG,uxG" `shouldBe` False
        it "escaped * - not found" $ do doSearch "GuOh,\\*" `shouldBe` False
        it "wildcard only - found" $ do doSearch "GuOh,*" `shouldBe` True

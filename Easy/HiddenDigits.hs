module CodeEval.HiddenDigits where
{- https://www.codeeval.com/open_challenges/122/
HIDDEN DIGITS

CHALLENGE DESCRIPTION:

In this challenge you're given a random string containing hidden and visible digits. The digits are hidden behind lower case latin letters as follows: 0 is behind 'a', 1 is behind ' b ' etc., 9 is behind 'j'. Any other symbol in the string means nothing and has to be ignored. So the challenge is to find all visible and hidden digits in the string and print them out in order of their appearance.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains a string. You may assume that there will be no white spaces inside the string. E.g.

abcdefghik
Xa,}A#5N}{xOBwYBHIlH,#W
(ABW>'yy^'M{X-K}q,
6240488

OUTPUT SAMPLE:

For each test case print out all visible and hidden digits in order of their appearance. Print out NONE in case there is no digits in the string. E.g.

012345678
05
NONE
6240488

-}

import Test.Hspec
import Data.List
import Data.Char

hiddenDigits :: String -> String
hiddenDigits line
    | length toDigits == 0 = "NONE"
    | otherwise = toDigits
    where
        toDigits = filter (/=' ') $ map convert line
        convert c = case elemIndex c "abcdefghij0123456789" of
          Just n  -> intToDigit $ mod n 10
          Nothing -> ' '


test = hspec $ do
  describe "various" $ do
    it "abc" $ do hiddenDigits "abcdefghik" `shouldBe` "012345678"
    it "Xa" $ do hiddenDigits "Xa,}A#5N}{xOBwYBHIlH,#W" `shouldBe` "05"
    it "(ABW" $ do hiddenDigits "(ABW>'yy^'M{X-K}q," `shouldBe` "NONE"
    it "6240488" $ do hiddenDigits "6240488" `shouldBe` "6240488"
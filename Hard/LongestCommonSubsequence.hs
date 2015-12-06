module CodeEval.LongestCommonSubsequence where

{- https://www.codeeval.com/open_challenges/6/

Longest Common Subsequence

Challenge Description:

You are given two sequences. Write a program to determine the longest common subsequence between the two strings (each string can have a maximum length of 50 characters). NOTE: This subsequence need not be contiguous. The input file may contain empty lines, these need to be ignored. 

Input sample:

The first argument will be a path to a filename that contains two strings per line, semicolon delimited. You can assume that there is only one unique subsequence per test case. E.g. 
XMJYAUZ;MZJAWXU

Output sample:

The longest common subsequence. Ensure that there are no trailing empty spaces on each line you print. E.g. 
MJAU

-}

import Test.Hspec

import Data.List.Split (splitOn)
import Data.List (replicate)

lcs::String->String->[[Int]]
lcs a b = foldl (\acc aa-> acc++ [mapRow (last acc) aa]) [firstRow] a
  where
    bzip =  zip b [0..]
    firstRow = replicate (length b+1) 0
    mapRow::[Int]->Char->[Int]
    mapRow lastRow aa= foldl calcLcs [0] bzip
      where
        calcLcs acc (bb,j)
          | aa == bb = acc ++ [lastRow!!j+1]
          | otherwise = acc ++ [max (last acc) (lastRow!!(j+1))]

longestCommonSubsequence::String->String
longestCommonSubsequence line = reverse $ result (length a) (length b)
  where
    args = splitOn ";" line
    a = args!!0
    b = args!!1
    lengths = lcs a b 
    lv xx yy 
      | xx >= length lengths = error "xx too large" -- ++ (show xx)
      | yy >= length (lengths!!xx) = error "yy too large" -- ++ (show yy)
      | otherwise = (lengths!!xx)!!yy
    result::Int->Int->String
    result x y
      | x == 0 || y == 0 = []
      | lv x y == lv (x -1) y = result (x -1) y
      | lv x y == lv x (y-1) = result x (y-1)
      | otherwise = [a!!(x - 1)] ++ result (x -1) (y-1)

test = hspec $ do
  describe "lcs - " $ do 
    it "1" $ do   longestCommonSubsequence "XMJYAUZ;MZJAWXU" `shouldBe` "MJAU"
    it "2" $ do   longestCommonSubsequence "TWYFXGTRODWLJAKILK;MHNXZUAZUNS" `shouldBe` "XA"
    it "3" $ do   longestCommonSubsequence "ANYVZHHSZOCLXYBVKD;VUUJTDWAKEQWXNVWWHZYQ" `shouldBe` "ANVHZY"
    it "4" $ do   longestCommonSubsequence "PGUYDQAWLJARQ;EBJGFDHEVYVDMZWYADDVD" `shouldBe` "GYDWA"
    it "5" $ do   longestCommonSubsequence "hello world mordor;lord of the rings" `shouldBe` "lord or"
    it "6" $ do   longestCommonSubsequence "XABHKMHNEKILQSPAXKYSR;ABYVTKDYUUUBXELVWDSEEP" `shouldBe` "ABKELSP"
    it "7" $ do   longestCommonSubsequence "KKOIJCBUJHMJWILMZ;KMEWCXXUEQTDEAWOVT" `shouldBe` "KCUW"
    it "8" $ do   longestCommonSubsequence "thisisatest;testing123testing" `shouldBe` "tsitest"
    it "9" $ do   longestCommonSubsequence "UZRTRUTOYNTJYYTJ;WAFWIXWSCTOFC" `shouldBe` "TO"
    it "10" $ do   longestCommonSubsequence "XFLDXPUHFVBSUI;ACCBKQBKQLSPH" `shouldBe` "LPH"
    it "11" $ do   longestCommonSubsequence "IGDONUJKILXDKGBOIII;AQRROXKGOTMZFDMAYYSVP" `shouldBe` "OXKGO"
    it "12" $ do   longestCommonSubsequence "FGJMYCSIQEQLWMLTNURI;XEZJIDXEXMGRIGGANJEHY" `shouldBe` "JIEMRI"
    it "13" $ do   longestCommonSubsequence "UXULJGBZOGPSCOOPRXU;DZAOSTPKNM" `shouldBe` "ZOSP"
    it "14" $ do   longestCommonSubsequence "VUBBINCXIWSXCILOZBH;DZULQOJFZABAV" `shouldBe` "ULOZB"
    it "15" $ do   longestCommonSubsequence "SBWWVGAWZFNKTSOBQU;PXTSMDWIGNMGGMVCOE" `shouldBe` "SWGNO"
    it "16" $ do   longestCommonSubsequence "LHAHAVGEMEDR;OHUMEGUCFUZXDD" `shouldBe` "HMED"
    it "17" $ do   longestCommonSubsequence "YXPJHQGWSZABCHZVAXU;OGOGTDCXVDQXSZLJAIDE" `shouldBe` "XQSZA"
    it "18" $ do   longestCommonSubsequence "the quick brown fox;the fast brown dogs" `shouldBe` "the  brown o"
    it "19" $ do   longestCommonSubsequence "UEOOQHXSFNGUTQ;TSVQEEQAQKEBRJVYBBIMD" `shouldBe` "EQQ"
    it "20" $ do   longestCommonSubsequence "TCXKTQJOLXZN;WXGNHCPXZPOJHACPBEROP" `shouldBe` "CXJO"
    it "21" $ do   longestCommonSubsequence "OSXXIWZUFLBMWX;STBRVFASDODSHIUETX" `shouldBe` "OSIUX"






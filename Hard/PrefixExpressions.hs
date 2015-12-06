{- https://www.codeeval.com/open_challenges/7/

PREFIX EXPRESSIONS
CHALLENGE DESCRIPTION:

You are given a prefix expression. Write a program which evaluates it.

INPUT SAMPLE:

Your program should accept a file as its first argument. The file contains one prefix expression per line.

For example:

* + 2 3 4
Your program should read this file and insert it into any data structure you like. Traverse this data structure and evaluate the prefix expression. Each token is delimited by a whitespace. You may assume that sum ‘+’, multiplication ‘*’ and division ‘/’ are the only valid operators appearing in the test data.

OUTPUT SAMPLE:

Print to stdout the output of the prefix expression, one per line.

For example:

20
CONSTRAINTS:

The evaluation result will always be an integer ≥ 0.
The number of the test cases is ≤ 40.
-}

module CodeEval.PrefixExpressions where

import Test.Hspec
import Data.List.Split

prefixExpr::String-> Int
prefixExpr line = floor $ foldl (\acc e -> calc acc e) s steps
  where
    args = splitOn " " line
    eCnt = div (length args) 2
    eArgs = reverse $ take eCnt args
    nums = drop (eCnt+1) args
    steps = map (\x-> (eArgs!!x,read (nums!!x)::Double)) [0..eCnt-1]
    s = (\x->read x::Double) $ head $ drop eCnt args
    calc:: Double -> (String,Double) -> Double
    calc n step
        | (fst step) == "*" = n * m
        | (fst step) == "+" = n + m
        | otherwise =  n / m
        where m = snd step

test = hspec $ do
  describe "prefixExpr" $ do
    it "1" $ do prefixExpr "+ * + * 9 1 6 7 9" `shouldBe` 114
    it "2" $ do prefixExpr "* * + + + * + + + * * / / * * / * * / 8 1 0 5 8 8 0 4 1 4 9 4 5 7 9 6 2 2 0 5" `shouldBe` 0
    it "3" $ do prefixExpr "* + / + * * 1 8 6 9 6 0 2" `shouldBe` 19
    it "4" $ do prefixExpr "* + + * + * + + / / * 5 9 2 5 8 1 1 7 9 4 6 6" `shouldBe` 1167
    it "5" $ do prefixExpr "* + * * + / * / * + / + / 0 9 3 3 5 4 7 0 5 8 7 4 3 9" `shouldBe` 2043
    it "6" $ do prefixExpr "+ / * + / + + * * / + + 6 8 0 2 5 0 0 8 2 4 3 1 1" `shouldBe` 25
    it "7" $ do prefixExpr "* + 2 3 4" `shouldBe` 20
    it "8" $ do prefixExpr "/ * + 9 1 6 6" `shouldBe`  10
    it "9" $ do prefixExpr "+ + + * + / / * * * + * / / * + * + * * * * 5 2 4 6 0 2 7 4 8 9 5 6 8 1 8 9 1 6 1 0 0 5 3" `shouldBe` 8
    it "10" $ do prefixExpr "+ + / + + * * * * / + / * * / / 9 6 1 0 8 4 9 3 3 2 2 7 2 5 7 0 1" `shouldBe` 38
    it "11" $ do prefixExpr "+ + * + 3 4 2 4 7" `shouldBe` 25
    it "12" $ do prefixExpr "/ * / * / * / + / + + * * / * + 7 5 1 8 4 6 1 2 7 4 9 0 9 7 3 2 1" `shouldBe` 0
    it "13" $ do prefixExpr "/ 8 4" `shouldBe` 2
    it "14" $ do prefixExpr "* * + + + * * + * + / / * / / + + / * / 3 6 5 4 3 0 9 6 5 2 1 7 6 3 0 1 0 8 7 8 9" `shouldBe` 1080
    it "15" $ do prefixExpr "/ * + + * 8 4 0 4 6 1" `shouldBe` 216
    it "16" $ do prefixExpr "+ / * / * + + + * / * 2 0 7 0 9 5 5 8 4 6 6 3" `shouldBe` 41
    it "17" $ do prefixExpr "+ / * * / * * + / / + / / * * / + + / * + 1 9 5 4 8 2 2 4 4 8 6 0 6 5 5 6 7 1 3 0 7 3" `shouldBe` 3
    it "18" $ do prefixExpr "* * 3 8 0" `shouldBe` 0
    it "19" $ do prefixExpr "* * / 8 5 6 5" `shouldBe` 48
    it "20" $ do prefixExpr "+ * + 8 0 3 2" `shouldBe` 26
    it "21" $ do prefixExpr "* * + * * 8 9 9 4 3 1" `shouldBe` 1956
    it "22" $ do prefixExpr "/ * * * * / + + + + 7 6 3 8 8 6 9 5 1 1 4" `shouldBe` 60
    it "23" $ do prefixExpr "* * * + / + + + + + / * 1 0 8 8 4 6 4 7 4 1 6 2 5" `shouldBe` 495
    it "24" $ do prefixExpr "/ * 0 2 6" `shouldBe` 0
    it "25" $ do prefixExpr "* * + / * * + * * / + + * * / * * * + + * / / 1 4 2 3 8 2 6 3 7 7 0 2 6 0 5 4 8 0 9 5 4 7 9 1" `shouldBe` 3950
    it "26" $ do prefixExpr "+ + + + + + + + + / 0 9 7 4 0 7 6 1 8 7 8" `shouldBe` 48
    it "27" $ do prefixExpr "* + + * + / * + + * * * + / / * * * * + * * * 8 1 2 4 4 6 7 7 0 4 3 1 5 6 2 9 5 5 9 7 3 2 1 0" `shouldBe` 0
    it "28" $ do prefixExpr "* * / * + * + / / + / / * 3 8 2 1 9 2 2 0 6 9 7 8 0 8" `shouldBe` 0
    it "29" $ do prefixExpr "* * * + * + + 4 0 0 7 7 8 0 3" `shouldBe` 0
    it "30" $ do prefixExpr "+ + * * * / / / * * * / + / + / / + * * / * * * + + 1 2 9 0 8 7 7 5 6 9 6 1 2 5 7 3 0 4 2 8 5 4 8 6 9 3 3" `shouldBe` 6
    it "31" $ do prefixExpr "* 0 0" `shouldBe` 0
    it "32" $ do prefixExpr "/ 4 4" `shouldBe` 1
    it "33" $ do prefixExpr "* + * + / + / / * 0 3 1 9 2 9 3 9 5 4" `shouldBe` 136
    it "34" $ do prefixExpr "* * + * / * * + + * + / + 2 5 8 2 6 2 8 4 7 9 7 6 5 0" `shouldBe` 0
    it "35" $ do prefixExpr "* + * + * / + + / + + + / * / + / * + / + / / * 2 1 3 2 0 6 9 5 8 6 5 4 5 4 8 4 3 2 3 7 9 0 9 7 0" `shouldBe` 0
    it "36" $ do prefixExpr "+ + * + + / * + * 5 6 0 9 8 6 2 0 9 3" `shouldBe` 12
    it "37" $ do prefixExpr "+ / + * * + 5 3 9 1 8 5 1" `shouldBe` 17
    it "38" $ do prefixExpr "+ + + * 0 5 9 9 1" `shouldBe` 19
    it "39" $ do prefixExpr "/ * + + + 1 7 8 5 2 2" `shouldBe` 21 
    it "40" $ do prefixExpr "+ 0 8" `shouldBe` 8

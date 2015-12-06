module CodeEval.LongestPath where

{-https://www.codeeval.com/open_challenges/182/

Longest Path

Challenge Description:

You are given a 2D N×N matrix. Each element of the matrix is a letter: from ‘a’ to ‘z’. Your task is to find the length L of the longest path in which not a single letter is repeated. The path can start at any cell, the transfer to the next element can be vertical or horizontal. 

Example of a 5×5 matrix, where L=15: 
 
Input sample:

The first argument is a file with test cases. Each line contains a serialized N×N matrix . 

For example: 

qttiwkajeerhdgpikkeaaabwl
vavprkykiloeizzt
skwajgaaxqpfcxmadpwaraksnkbgcaukbgli
kaja
bjzanjikh

Output sample:

Print to stdout the length of the longest path of unique elements for each test case, one per line. 

For example: 

15
11
16
3
7

-}

import Test.Hspec

longestPath::String->Int
longestPath line = maximum $ map searchAt $ [0..length line -1]
  where
    size =  (floor . sqrt . fromIntegral) $ length line
    searchAt pos = search pos 1 $ replaceCharWithStar line (line!!pos)
      where
        search::Int->Int->String->Int
        search position len xline = maximum $ map try  [(0,-1),(0,1),(-1,0),(1,0)]
          where
            dm = divMod position size
            x = snd dm
            y = fst dm
            try (xx,yy)
              | xx + x < 0 || xx + x == size  = len
              | yy + y < 0 || yy + y == size  = len
              | charAtpp == '*' = len
              | otherwise = search newPosition (len+1) $ replaceCharWithStar xline charAtpp
              where
                newPosition = position + xx + (yy * size)
                charAtpp = xline!!newPosition


replaceCharWithStar::String->Char->String
replaceCharWithStar xs ch = map (\c-> if c == ch then '*' else c ) xs

test = hspec $ do
    describe "Longest Path - " $ do 
        it "1" $ do longestPath "qttiwkajeerhdgpikkeaaabwl" `shouldBe` 15
        it "2" $ do longestPath "vavprkykiloeizzt" `shouldBe` 11
        it "3" $ do longestPath "skwajgaaxqpfcxmadpwaraksnkbgcaukbgli" `shouldBe` 16
        it "4" $ do longestPath "kaja" `shouldBe` 3
        it "5" $ do longestPath "bjzanjikh" `shouldBe` 7

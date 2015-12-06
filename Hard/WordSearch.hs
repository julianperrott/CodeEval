{- https://www.codeeval.com/open_challenges/65/

WORD SEARCH
CHALLENGE DESCRIPTION:

Given a 2D board and a word, find if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cell, where adjacent cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.

INPUT SAMPLE:

The board to be used may be hard coded as:

[
[ABCE],
[SFCS],
[ADEE]
]
Your program should accept as its first argument a path to a filename. Each line in this file contains a word. E.g.

ASADB
ABCCED
ABCF
OUTPUT SAMPLE:

Print out True if the word exists in the board, False otherwise. E.g.

False
True
False

-}

module CodeEval.WordSearch where
import Test.Hspec

board = ["ABCE","SFCS","ADEE"]
maxX = length (board!!0)
maxY = length board
boardMax = (maxY * maxX) -1

charAt :: Int -> Char
charAt pos = board!!(pos `div` maxX)!!(pos `mod` maxX)

move::Int->(Int,Int)->Int
move pos (mx,my)
  | x<0 || x>= maxX = pos
  | y<0 || y>= maxY = pos
  | otherwise = (y*maxX)+x
  where
    x = (pos `mod` maxX) + mx
    y = (pos `div` maxX) + my

search::[Int]->Int->String->Bool
search _ _ [] = True
search path pos word
  | elem pos path =  False -- position already visited
  | charAt pos /= head word = False -- char at position is not the first of the word
  | search newPath (move pos (0,-1)) newWord = True -- up
  | search newPath (move pos (0,1)) newWord = True -- down
  | search newPath (move pos (-1,0)) newWord = True -- left
  | search newPath (move pos (1,0)) newWord = True -- right
  | otherwise = False
  where
    newPath = path++[pos]
    newWord = tail word

wordSearch::String -> Bool
wordSearch word = elem True $ map (\x -> search [] x word ) [0..boardMax]

test = hspec $ do
    describe "wordsearch" $ do
        it "ASADB" $ do wordSearch "ASADB" `shouldBe` False
        it "ABCCED" $ do wordSearch "ABCCED" `shouldBe` True
        it "ABCF" $ do wordSearch "ABCF" `shouldBe` False
        it "CCBA" $ do wordSearch "CCBA" `shouldBe` True
        it "DECCBA" $ do wordSearch "DECCBA" `shouldBe` True
    describe "charAt" $ do
        it "0" $ do charAt 0 `shouldBe` 'A'
        it "1" $ do charAt 1 `shouldBe` 'B'
        it "2" $ do charAt 2 `shouldBe` 'C'
        it "3" $ do charAt 3 `shouldBe` 'E'
        it "4" $ do charAt 4 `shouldBe` 'S'
        it "5" $ do charAt 5 `shouldBe` 'F'
        it "6" $ do charAt 6 `shouldBe` 'C'
        it "7" $ do charAt 7 `shouldBe` 'S'
        it "8" $ do charAt 8 `shouldBe` 'A'
        it "9" $ do charAt 9 `shouldBe` 'D'
        it "10" $ do charAt 10 `shouldBe` 'E'
        it "11" $ do charAt 11 `shouldBe` 'E'
    describe "move" $ do
        it "0 up" $ do move 0 (0,-1) `shouldBe` 0
        it "0 down" $ do move 0 (0,1) `shouldBe` 4
        it "0 left" $ do move 0 (-1,0) `shouldBe` 0
        it "0 right" $ do move 0 (1,0) `shouldBe` 1
        it "6 up" $ do move 6 (0,-1) `shouldBe` 2
        it "6 down" $ do move 6 (0,1) `shouldBe` 10
        it "6 left" $ do move 6 (-1,0) `shouldBe` 5
        it "6 right" $ do move 6 (1,0) `shouldBe` 7
        it "11 up" $ do move 11 (0,-1) `shouldBe` 7
        it "11 down" $ do move 11 (0,1) `shouldBe` 11
        it "11 left" $ do move 11 (-1,0) `shouldBe` 10
        it "11 right" $ do move 11 (1,0) `shouldBe` 11
    describe "search" $ do
        it "0 A" $ do search [] 0 "A" `shouldBe` True
        it "1 A" $ do search [] 1 "A" `shouldBe` False
        it "0 ABC" $ do search [] 0 "ABC" `shouldBe` True
        it "0 ABCD" $ do search [] 0 "ABCD" `shouldBe` False
        it "0 ABCCED" $ do search [] 0 "ABCCED" `shouldBe` True                      
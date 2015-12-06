{- https://www.codeeval.com/open_challenges/79/

MINESWEEPER
CHALLENGE DESCRIPTION:

You will be given an M*N matrix. Each item in this matrix is either a '*' or a '.'. A '*' indicates a mine whereas a '.' does not. The objective of the challenge is to output a M*N matrix where each element contains a number (except the positions which actually contain a mine which will remain as '*') which indicates the number of mines adjacent to it. Notice that each position has at most 8 adjacent positions e.g. left, top left, top, top right, right, ...

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains M,N, a semicolon and the M*N matrix in row major form. E.g.

3,5;**.........*...
4,4;*........*......
OUTPUT SAMPLE:

Print out the new M*N matrix (in row major form) with each position(except the ones with the mines) indicating how many adjacent mines are there. E.g.

**100332001*100
*10022101*101110
-}

module CodeEval.MineSweeper where

import Test.Hspec
import Data.List.Split

minesweeper::String->String
minesweeper line = findMines rows cols (args!!1)
  where
    args = splitOn ";" line
    argsRc = splitOn "," (args!!0)
    rows = read (argsRc!!0)::Int
    cols = read (argsRc!!1)::Int

findMines::Int->Int->String->String
findMines rows cols grid = concat $ map countMines $ [0..(length grid)-1]
  where
    countMines pos
      | grid!!pos=='*' = "*"
      | otherwise = show $ sum $ map (mineAt pos) [(-1,-1),(0,-1),(1,-1),(-1,0),(0,0),(1,0),(-1,1),(0,1),(1,1)]
    mineAt::Int->(Int,Int)->Int
    mineAt pos (dx,dy)
      | row < 0 || row == rows = 0 -- out of bounds y
      | col < 0 || col == cols = 0 -- out of bounds x
      | grid!!newPos =='*' = 1
      | otherwise = 0
      where
        col = dx + (pos `mod` cols)
        row = dy + (pos `div` cols)
        newPos = (cols*row)+col


test = hspec $ do
  describe "minesweeper" $ do
      it "1" $ do minesweeper "3,5;**.........*..." `shouldBe` "**100332001*100"
      it "2" $ do minesweeper "4,4;*........*......" `shouldBe` "*10022101*101110"
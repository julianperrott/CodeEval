{- https://www.codeeval.com/open_challenges/57/

SPIRAL PRINTING

CHALLENGE DESCRIPTION:

Write a program to print a 2D array (n x m) in spiral order (clockwise)

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. The input file contains several lines. Each line is one test case. Each line contains three items (semicolon delimited). The first is 'n'(rows), the second is 'm'(columns) and the third is a single space separated list of characters/numbers in row major order. E.g.

3;3;1 2 3 4 5 6 7 8 9
OUTPUT SAMPLE:

Print out the matrix in clockwise fashion, one per line, space delimited. E.g.

1 2 3 6 9 8 7 4 5
-}
module CodeEval.SpiralPrinting where

import Test.Hspec
import Data.List
import Data.List.Split

chunks :: Int -> [a] -> [[a]]
chunks _ [] = []
chunks n xs =
    let (ys, zs) = splitAt n xs
    in  ys : chunks n zs

spiralPrint::String->String
spiralPrint line = unwords $ sprint 0 []
  where
    args = splitOn ";" line
    rows = read (head args)::Int
    cols = read  (args!!1)::Int
    grid = chunks cols $ splitOn " " (args!!2)
    sprint::Int->[String]->[String]
    sprint loop path
      | null (top++down++bot++up) = path
      | otherwise = sprint (loop+1) (path++top++down++bot++up)
      where
        top
          | rows-loop <= loop = []
          | otherwise = take (cols - (loop*2)) $ drop loop (grid!!loop)
        down
          | cols-1-loop < loop = []
          | otherwise = map (\x -> grid!!x!!(cols-1-loop)) [1+loop..rows -2 -loop]
        bot
          | (rows -1 -loop) <= loop = []
          | otherwise = reverse $ take (cols - (loop*2)) $ drop loop $ grid!!(rows -1 -loop)
        up
          | cols-1-loop<=loop = []
          | otherwise = reverse $ map (\x -> grid!!x!!loop) [1+loop..rows -2 -loop]

test = hspec $ do
  describe "SpiralPrinting" $ do
    it "1" $ do spiralPrint "3;3;1 2 3 4 5 6 7 8 9" `shouldBe` "1 2 3 6 9 8 7 4 5"
    it "2" $ do spiralPrint "4;7;1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28" `shouldBe` "1 2 3 4 5 6 7 14 21 28 27 26 25 24 23 22 15 8 9 10 11 12 13 20 19 18 17 16"
    it "3" $ do spiralPrint "10;3;a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D" `shouldBe` "a b c f i l o r u x A D C B y v s p m j g d e h k n q t w z"
    it "4" $ do spiralPrint "4;3;1 2 3 4 5 6 7 8 9 10 11 12" `shouldBe` "1 2 3 6 9 12 11 10 7 4 5 8"
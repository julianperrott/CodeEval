module CodeEval.LargestSubMatrix where

{- https://www.codeeval.com/open_challenges/105/

Largest Sub-Matrix

Challenge Description:

You have the matrix of positive and negative integers. Find a sub-matrix with the largest sum of its elements. In this case sub-matrix means a continuous rectangular part of the given matrix. There is no limitation for sub-matrix dimensions. It only has to be rectangular. 

Input sample:

Your program should accept as its first argument a path to a filename. Read the matrix from this file. Example of the matrix is the following: 
-1 -4 -5 -4
-5 8 -1 3
-2 1 3 2
1 5 6 -9

After some calculations you may find that the sub-matrix with the largest sum of the input is: 
8 -1
1 3
5 6

Output sample:

Print out the sum of elements for the largest sub-matrix. For the given input it is: 
22

-}

import Test.Hspec

import Data.List.Split (splitOn)
import Data.List (replicate)


import Data.List (replicate)
import Data.List.Split (splitOn)

sumMatrix::[[Int]]->[[Int]]
sumMatrix matrix = sumM [head matrix] (tail matrix)
  where
    sumRows r1 r2 = map (\x-> fst x+snd x) $ zip r1 r2
    sumM matrixSum rowsLeft
      | rowsLeft == [] = matrixSum
      | otherwise = sumM newMatrixSum (tail rowsLeft)
      where
        newMatrixSum = matrixSum ++ [(sumRows (last matrixSum) (head rowsLeft))]


bestRectangle::[Int]->[Int]->Int->Int
bestRectangle rowI rowJ best = getBest $ foldl calcBest (0,0,best) (zip rowI rowJ)
  where
    getBest (_,_,best) = best
    calcBest (minLeft,rowSum,best) (ivalue,jvalue) = (newMinLeft, newRowSum, newBest)
      where
        newRowSum = rowSum + ivalue - jvalue
        newBest = max best (newRowSum - minLeft)
        newMinLeft = min minLeft newRowSum


largestSubMatrix::[String]->Int
largestSubMatrix xs = foldl bestForRow 0 [0..length matrix-1]
  where
    matrix = map (\line-> map (\x-> read x::Int) $ splitOn " " line) $ filter (\x-> length x > 0 ) xs
    sMatrix = sumMatrix matrix
    bestForRow best i = foldl bestForRows best [-1..(i-1)]
      where
        bestForRows aBest j
          | j == -1 = bestRectangle (sMatrix!!i) (replicate (length matrix) 0) aBest
          | otherwise = bestRectangle (sMatrix!!i) (sMatrix!!j) aBest

test = hspec $ do
  describe "largestSubMatrix - " $ do 
    it "1" $ do largestSubMatrix ["-1 -4 -5 -4","","-5 8 -1 3","-2 1 3 2","1 5 6 -9",""] `shouldBe` 22

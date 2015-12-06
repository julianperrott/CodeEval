module CodeEval.RobotMovement where

{- https://www.codeeval.com/open_challenges/56/

Robot Movements

Challenge Description:
 
A robot is located in the upper-left corner of a 4×4 grid. The robot can move either up, down, left, or right, but cannot go to the same location twice. The robot is trying to reach the lower-right corner of the grid. Your task is to find out the number of unique ways to reach the destination. 

Input sample:

There is no input for this program. 

Output sample:

Print out the number of unique ways for the robot to reach its destination. The number should be printed out as an integer ≥0. 

-}

import Test.Hspec

countPaths::[Bool]->Int->Int->Int
countPaths grid x y
  | x < 0 || x > 3 || y < 0 || y > 3 || grid!!n = 0
  | x ==3 && y == 3 = 1
  | otherwise = (count 1 0) + (count (-1) 0) + (count 0 1) + (count 0 (-1))
  where
    n = x + (y * 4)
    newGrid = take n grid ++ [True] ++ drop (n+1) grid
    count xx yy = countPaths newGrid (x+xx) (y+yy)

robot = countPaths [False,False,False,False,False,False,False,False,False,False,False,False,False,False,False,False] 0 0

main = hspec $ do
  describe "robot - " $ do 
    it "1" $ do robot `shouldBe` 184
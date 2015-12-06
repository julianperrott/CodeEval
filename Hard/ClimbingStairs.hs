{- https://www.codeeval.com/open_challenges/64/

CLIMBING STAIRS
CHALLENGE DESCRIPTION:

You are climbing a stair case. It takes n steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains a positive integer which is the total number of stairs. 
Ignore all empty lines. E.g.

10
20
OUTPUT SAMPLE:

Print out the number of ways to climb to the top of the staircase. E.g.

89
10946
Constraints: 
The total number of stairs is <= 1000
-}
module CodeEval.ClimbingStairs where

import Test.Hspec
import Data.List
import Data.Bits

climbingStairs::String->String
climbingStairs line = show . snd . foldl' fib' (1, 0) . dropWhile not $ [testBit n k | k <- let s = finiteBitSize n in [s-1,s-2..0]]
    where
      n = 1+(read line::Int)
      fib' (f, g) p
        | p         = (f*(f+2*g), ss)
        | otherwise = (ss, g*(2*f-g))
        where ss = f*f+g*g

test = hspec $ do
  describe "climbingStairs" $ do
    it "10" $ do climbingStairs "10" `shouldBe` "89"
    it "20" $ do climbingStairs "20" `shouldBe` "10946"
                 
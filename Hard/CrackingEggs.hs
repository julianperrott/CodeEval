{- https://www.codeeval.com/open_challenges/151/

CRACKING EGGS
CHALLENGE DESCRIPTION:

You have a N story building and K eggs. They are especially strong eggs so they're able to withstand impact up to a certain number of floors.

Your goal is to identify the number of drops you need make to determine number of floors it can withstand.

INPUT SAMPLE:

The first argument will be a path to a filename containing a space separated list of 2 integers, first one is number eggs, second one - number of floors. E.g.

2 100
OUTPUT SAMPLE:

The output contains one integer - the worst worst case upper bound on the number of drops you must make to determine this floor.

14
-}
module CodeEval.CrackingEggs where

import Test.Hspec
import Data.List.Split

floorMax::Int->Int->Int
floorMax eggs cnt
  | eggs == 1 = cnt
  | otherwise = foldl (\acc i-> acc+ 1+ (floorMax (eggs-1) i)) 0 [0..cnt-1]

crackingEggs::String->Int
crackingEggs line = doCount 0
  where
    args = splitOn " " line
    eggs = read (args!!0)::Int
    floors = read (args!!1)::Int
    doCount::Int->Int
    doCount cnt
      | floorMax eggs cnt >= floors = cnt
      | otherwise = doCount (cnt+1)

test = hspec $ do
  describe "CrackingEggs" $ do
    it "2 100" $ do crackingEggs "2 100" `shouldBe` 14
    it "3 100" $ do crackingEggs "3 100" `shouldBe` 9
    it "7 1600" $ do crackingEggs "7 1600" `shouldBe` 11
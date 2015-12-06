module CodeEval.GridWalk where

{- https://www.codeeval.com/open_challenges/60/


Grid Walk

Sponsoring Company:

Challenge Description:
 
There is a monkey which can walk around on a planar grid. The monkey can move one space at a time left, right, up or down. That is, from (x, y) the monkey can go to (x+1, y), (x-1, y), (x, y+1), and (x, y-1). 

Points where the sum of the digits of the absolute value of the x coordinate plus the sum of the digits of the absolute value of the y coordinate are lesser than or equal to 19 are accessible to the monkey. For example, the point (59, 79) is inaccessible because 5 + 9 + 7 + 9 = 30, which is greater than 19. Another example: the point (-5, -7) is accessible because abs(-5) + abs(-7) = 5 + 7 = 12, which is less than 19. How many points can the monkey access if it starts at (0, 0), including (0, 0) itself? 

Input sample:

There is no input for this program.

Output sample:

Print the number of points the monkey can access. It should be printed as an integer — for example, if the number of points is 10, print "10", not "10.0" or "10.00", etc.

-}

import Test.Hspec

import Data.List (elemIndex)
import Data.Maybe (isNothing)
import Data.Map (fromList,insert,empty,notMember,Map,size, singleton)

toKey::(Int,Int)->String
toKey (x,y) = show x ++","++ show y

digsum::Int->Int
digsum x = f 0 (abs x)
  where
    f a 0 = a
    f a n = f (a+r) q
      where
              (q,r) = n `divMod` 10

isNotVisited::Map String Int->(Int,Int)->Bool
isNotVisited visited x = notMember (toKey x) visited

walk::Map String Int->[(Int,Int)]->Int
walk visited [] = size visited
walk visited (p:ps) = walk newVisited newQueue
  where
    newQueue = candidates++ps
    newVisited = foldl (\acc x->insert (toKey x) 0 acc ) visited candidates
    canVisit n = (<=19) $ (digsum (fst n)) + (digsum (snd n))
    x = fst p
    y = snd p
    candidates = filter (\x-> (canVisit x) && (isNotVisited visited x)) $ [(x+1, y), (x, y+1), (x-1, y), (x, y-1)]

gridWalk::Int
gridWalk = walk (singleton "0,0" 0) [(0,0)]

test = hspec $ do
  describe "Grid Walk - " $ do 
    it "1" $ do gridWalk `shouldBe` 102485






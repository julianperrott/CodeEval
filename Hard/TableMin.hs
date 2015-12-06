{- https://www.codeeval.com/open_challenges/85/
FIND MIN
CHALLENGE DESCRIPTION:

Credits: This problem appeared in the Facebook Hacker Cup 2013 Hackathon. 

After sending smileys, John decided to play with arrays. Did you know that hackers enjoy playing with arrays? John has a zero-based index array, m, which contains n non-negative integers. However, only the first k values of the array are known to him, and he wants to figure out the rest. 

John knows the following: for each index i, where k <= i < n, m is the minimum non-negative integer which is *not* contained in the previous *k* values of m. 

For example, if k = 3, n = 4 and the known values of m are [2, 3, 0], he can figure out that m[3] = 1. John is very busy making the world more open and connected, as such, he doesn't have time to figure out the rest of the array. It is your task to help him. Given the first k values of m, calculate the nth value of this array. (i.e. m[n - 1]).Because the values of n and k can be very large, we use a pseudo-random number generator to calculate the first k values of m. Given positive integers a, b, c and r, the known values of m can be calculated as follows: 
m[0] = a 
m = (b * m[i - 1] + c) % r, 0 < i < k 


Your program should accept as its first argument a path to a filename. Each line in this file contains 6 comma separated positive integers which are the values of n,k,a,b,c,r in order. 
E.g.

78,51,3,5,5,51230
186,75,68,16,539,312
137,135,48,17,461,512
98,22,6,30,524,100
46,18,7,11,9,46
OUTPUT SAMPLE:

Print out the nth element of m for each test case e.g.

26
34
1
6
12

-}
module CodeEval.TableMin where
import Test.Hspec

import Data.List.Split

tableMin::String-> Int
tableMin s = last $ calc m 0
  where
    args = map (\x -> read x::Int)  $ splitOn "," s
    n = args!!0
    k = args!!1
    a = args!!2
    b = args!!3
    c = args!!4
    r = args!!5
    m = foldl (\acc n -> acc++[(b * (last acc) + c) `mod` r]) [a] [1..(k-1)]
    calc mm j
      | length mm == n = mm
      | (elem j $ drop ((length mm) -k) mm)  = calc mm (j+1) -- j exists so can't append it
      | otherwise = calc (mm ++ [j]) 0 -- j not found so append


test = hspec $ do
  describe "TableMin" $ do
    it "78,51,3,5,5,51230" $ do tableMin "78,51,3,5,5,51230" `shouldBe` 26
    it "186,75,68,16,539,312" $ do tableMin "186,75,68,16,539,312" `shouldBe` 34
    it "137,135,48,17,461,512" $ do tableMin "137,135,48,17,461,512" `shouldBe` 1
    it "98,22,6,30,524,100" $ do tableMin "98,22,6,30,524,100" `shouldBe` 6
    it "46,18,7,11,9,46" $ do tableMin "46,18,7,11,9,46" `shouldBe` 12
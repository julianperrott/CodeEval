{- https://www.codeeval.com/open_challenges/198/
LESS MONEY, MORE PROBLEMS
CHALLENGE DESCRIPTION:

This challenge appeared in Google Code Jam competition, licensed under Creative Commons Attribution License

Up until today, the nation you live in has used D different positive integer denominations of coin for all transactions. Today, the queen got angry when a subject tried to pay his taxes with a giant sack of low-valued coins, and she just decreed that no more than C coins of any one denomination may be used in any one purchase. For instance, if C = 2 and the existing denominations are 1 and 5, it is possible to buy something of value 11 by using two 5s and one 1, or something of value 12 by using two 5s and two 1s, but it is impossible to buy something of value 9 or 17.

You cannot directly challenge the queen's decree, but you happen to be in charge of the mint, and you can issue new denominations of coin. You want to make it possible for any item of positive value at most V to be purchased under the queen's new rules. (Note that this may not necessarily have been possible before the queen's decree.) Moreover, you want to introduce as few new denominations as possible, and your final combined set of pre-existing and new denominations may not have any repeats.

What is the smallest number of new denominations required?

INPUT SAMPLE:

The first argument is a path to a file. Each line of the input file contains one test case. Each test case consists of three parts separated by pipe symbol: 1) an integer C; 2) an integer V; 3) sorted list of space separated integers - all current denominations.

1 | 3 | 1 2
1 | 6 | 1 2 5
2 | 3 | 3
1 | 100 | 1 5 10 25 50 100
OUTPUT SAMPLE:

For each test case, output one line containing the minimum number of new denominations required, as described above.

0
1
1
3
CONSTRAINTS:

The number of test cases is 40.
1 ≤ C ≤ 100.
1 ≤ V ≤ 109.
The number of current denominations is in range from 1 to 100.
-}

module CodeEval.LessMoney where

import Test.Hspec
import Control.Monad
import Control.Monad.ST
import Data.Array.ST
import Data.Foldable
import Control.Monad
import Data.Bits

(>>.):: Int -> Int -> Int
(>>.) = shiftR

(<<.):: Int -> Int -> Int
(<<.) = shiftL

-- private static bool shouldSetBit(string move, int id, int j)
shouldSetBit :: Char -> Int -> Int -> Bool
shouldSetBit move criminalId j = a /= b
  where
    a = mod (j >>. criminalId) 2
    b = if move == 'E' then 1 else 0

-- private static int getElementId(string move, int criminalId, int j)
getElementId :: Char -> Int -> Int -> Int
getElementId move criminalId j
  | move == 'E' = j + (1 <<. criminalId)
  | otherwise = j - (1 <<. criminalId)

-- private static void ProcessBitForMove(string move, int criminalId, bool[] newCrimBits, int j)
processBitForMove move criminalId j newCrimBits = when (shouldSetBit move criminalId j) $ do writeArray newCrimBits (getElementId move criminalId j) True


--public static void processCriminal(string move, int criminalId, int j, int N, bool[] newCrimBits)
processCriminal2 move criminalId j arr n
    | criminalId /= -1 = processBitForMove move criminalId j arr
    | otherwise = last $ map (\k -> processBitForMove move k j arr) [0..(n-1)]

-- public static void processCriminal(string move, int criminalId, int j, bool[] newCrimBits, int N)
processCriminal move criminalId j arr n k
    | criminalId /= -1 = do
        processBitForMove move criminalId j arr
        return 0
    | k == n = do return 0
    | otherwise = do
        processBitForMove move k j arr
        z <- processCriminal move (-1) j arr n (k+1)
        return 0


testProcessCriminal::Int->Char->Int->Int->Int->String
testProcessCriminal size move criminalId j n = runST $ do
    arr <- newArray (0,size-1) False :: ST s (STArray s Int Bool)
    processCriminal move criminalId j arr n 0
    newXs <- getElems arr
    return (map (\x-> if x then '1' else '0') newXs)


testProcessBitForMove::Int->Char->Int->Int->String
testProcessBitForMove size move criminalId j = runST $ do
    arr <- newArray (0,size-1) False :: ST s (STArray s Int Bool)
    processBitForMove move criminalId j arr
    newXs <- getElems arr
    return (map (\x-> if x then '1' else '0') newXs)

test = hspec $ do
  describe "processCriminal" $ do
    it "Unknown 0" $ do testProcessCriminal 8 'E' (-1) 0 3 `shouldBe` "01101000"
    it "Unknown 1" $ do testProcessCriminal 8 'E' (-1) 1 3 `shouldBe` "00010100"
    it "Unknown 2" $ do testProcessCriminal 8 'E' (-1) 2 3 `shouldBe` "00010010"
    it "Unknown 3" $ do testProcessCriminal 8 'E' (-1) 3 3 `shouldBe` "00000001"
    it "Unknown 4" $ do testProcessCriminal 8 'E' (-1) 4 3 `shouldBe` "00000110"
    it "Unknown 5" $ do testProcessCriminal 8 'E' (-1) 5 3 `shouldBe` "00000001"
    it "Unknown 6" $ do testProcessCriminal 8 'E' (-1) 6 3 `shouldBe` "00000001"
    it "Unknown 7" $ do testProcessCriminal 8 'E' (-1) 7 3 `shouldBe` "00000000"
    it "Known 1" $ do testProcessCriminal 8 'E' 1 4 4 `shouldBe` "00000010"

  describe "processBitForMove" $ do
    it "E 1 4" $ do testProcessBitForMove 8 'E' 1 4 `shouldBe` "00000010"

{-
  describe "getElementId" $ do
    it "E 2 2" $ do getElementId 'E' 2 2 `shouldBe` 2+4
    it "E 3 3" $ do getElementId 'E' 3 3 `shouldBe` 3+8
    it "E 4 4" $ do getElementId 'E' 4 4 `shouldBe` 4+16
    it "L 2 200" $ do getElementId 'L' 2 200 `shouldBe` 200-4
    it "L 3 200" $ do getElementId 'L' 3 200 `shouldBe` 200-8
    it "L 4 200" $ do getElementId 'L' 4 200 `shouldBe` 200-16
  describe "shouldSetBit" $ do
    it "L 8 3" $ do shouldSetBit 'L' 8 3 `shouldBe` False
    it "L 4 2" $ do shouldSetBit 'L' 4 2 `shouldBe` False
    it "L 2 1" $ do shouldSetBit 'L' 2 1 `shouldBe` False
    it "L 1 0" $ do shouldSetBit 'L' 1 0 `shouldBe` False
    it "L 16 65536" $ do shouldSetBit 'L' 16 65536 `shouldBe` True
    it "L 8 256" $ do shouldSetBit 'L' 8 256 `shouldBe` True
    it "L 4 16" $ do shouldSetBit 'L' 4 16 `shouldBe` True
    it "L 2 4" $ do shouldSetBit 'L' 2 4 `shouldBe` True
    it "L 0 1" $ do shouldSetBit 'L' 0 1 `shouldBe` True
    it "L 4 48" $ do shouldSetBit 'L' 4 48 `shouldBe` True
    it "E 8 512" $ do shouldSetBit 'E' 8 512 `shouldBe` True
    it "E 4 32" $ do shouldSetBit 'E' 4 32 `shouldBe` True
    it "E 2 8" $ do shouldSetBit 'E' 2 8 `shouldBe` True
    it "E 1 4" $ do shouldSetBit 'E' 1 4 `shouldBe` True
    it "E 8 256" $ do shouldSetBit 'E' 8 256 `shouldBe` False
    it "E 4 16" $ do shouldSetBit 'E' 4 16 `shouldBe` False
    it "E 2 4" $ do shouldSetBit 'E' 2 4 `shouldBe` False
    it "E 1 2" $ do shouldSetBit 'E' 1 2 `shouldBe` False
-}


module CodeEval.DigitStatistics where

{- https://www.codeeval.com/open_challenges/144/

DIGIT STATISTICS
CHALLENGE DESCRIPTION:

Given the numbers "a" and "n" find out how many times each digit from zero to nine is the last digit of the number in a sequence [ a, a2, a3, ... an-1, an ]

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line of input contains two space separated integers "a" and "n" E.g: 

2 5
OUTPUT SAMPLE:

For each line of input print out how many times the digits zero, one, two ... nine occur as the last digit of numbers in the sequence E.g:


0: 0, 1: 0, 2: 2, 3: 0, 4: 1, 5: 0, 6: 1, 7: 0, 8: 1, 9: 0
In this example, the sequence consists of numbers 2, 4, 8, 16 and 32. Among the last digits, the digit two occurs twice, and each of the digits four, six and eight occurs once.

Constraints: 
1 ≤ n ≤ 1 000 000 000 000,
2 ≤ a ≤ 9

-}

import Test.Hspec
import Data.List
import Data.List.Split


digitMap = [([],[]), --0
    ([],[]), --1
    ([2,4,8,6],[0,1,3,5,7,9]),
    ([3,9,7,1],[0,2,4,5,6,8]),
    ([4,6],[0,1,2,3,5,7,8,9]),
    ([5],[0,1,2,3,4,6,7,8,9]),
    ([6],[0,1,2,3,4,5,7,8,9]),
    ([7,9,3,1],[0,2,4,5,6,8]),
    ([8,4,2,6],[0,1,3,5,7,9]),
    ([9,1],[0,2,3,4,5,6,7,8])
    ]

digitStats::String->String
digitStats line = intercalate ", " $ map shownum $ count a n
  where
    args = splitOn " " line
    a = read (head args)::Int
    n = read (args!!1)::Integer
    shownum x =  show (fst x) ++ ": "++ show(snd x)

sortGT (a1, _) (a2, _)
  | a1 < a2  = LT
  | a1 > a2 = GT
  | otherwise = EQ

count::Int->Integer->[(Integer,Integer)]
count a n = sortBy sortGT $ digitZero ++ (map mapCount [0..digitCount-1])
  where
    digitRange = fst (digitMap!!a)
    digitZero = map (\x->(x,0)) $ snd (digitMap!!a)
    digitCount = length digitRange
    cnt = divMod n (toInteger digitCount)
    mapCount::Int -> (Integer,Integer)
    mapCount x
      | toInteger x < (snd cnt) = (digitRange!!x ,(fst cnt)+1)
      | otherwise = (digitRange!!x ,(fst cnt))

test = hspec $ do
  describe "digitStats" $ do
    it "1" $ do digitStats "5 440753953974" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 440753953974, 6: 0, 7: 0, 8: 0, 9: 0"
    it "2" $ do digitStats "5 917037257207" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 917037257207, 6: 0, 7: 0, 8: 0, 9: 0"
    it "3" $ do digitStats "7 879574178476" `shouldBe` "0: 0, 1: 219893544619, 2: 0, 3: 219893544619, 4: 0, 5: 0, 6: 0, 7: 219893544619, 8: 0, 9: 219893544619"
    it "4" $ do digitStats "4 43127267275" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 21563633638, 5: 0, 6: 21563633637, 7: 0, 8: 0, 9: 0"
    it "5" $ do digitStats "3 91119881546" `shouldBe` "0: 0, 1: 22779970386, 2: 0, 3: 22779970387, 4: 0, 5: 0, 6: 0, 7: 22779970386, 8: 0, 9: 22779970387"
    it "6" $ do digitStats "2 103975287223" `shouldBe` "0: 0, 1: 0, 2: 25993821806, 3: 0, 4: 25993821806, 5: 0, 6: 25993821805, 7: 0, 8: 25993821806, 9: 0"
    it "7" $ do digitStats "2 300497978750" `shouldBe` "0: 0, 1: 0, 2: 75124494688, 3: 0, 4: 75124494688, 5: 0, 6: 75124494687, 7: 0, 8: 75124494687, 9: 0"
    it "8" $ do digitStats "7 365085818434" `shouldBe` "0: 0, 1: 91271454608, 2: 0, 3: 91271454608, 4: 0, 5: 0, 6: 0, 7: 91271454609, 8: 0, 9: 91271454609"
    it "9" $ do digitStats "7 345596346067" `shouldBe` "0: 0, 1: 86399086516, 2: 0, 3: 86399086517, 4: 0, 5: 0, 6: 0, 7: 86399086517, 8: 0, 9: 86399086517"
    it "10" $ do digitStats "5 467634585126" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 467634585126, 6: 0, 7: 0, 8: 0, 9: 0"
    it "11" $ do digitStats "9 571591857521" `shouldBe` "0: 0, 1: 285795928760, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 285795928761"
    it "12" $ do digitStats "8 331501781944" `shouldBe` "0: 0, 1: 0, 2: 82875445486, 3: 0, 4: 82875445486, 5: 0, 6: 82875445486, 7: 0, 8: 82875445486, 9: 0"
    it "13" $ do digitStats "7 56720427346" `shouldBe` "0: 0, 1: 14180106836, 2: 0, 3: 14180106836, 4: 0, 5: 0, 6: 0, 7: 14180106837, 8: 0, 9: 14180106837"
    it "14" $ do digitStats "8 868519438959" `shouldBe` "0: 0, 1: 0, 2: 217129859740, 3: 0, 4: 217129859740, 5: 0, 6: 217129859739, 7: 0, 8: 217129859740, 9: 0"
    it "15" $ do digitStats "6 276708409805" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 276708409805, 7: 0, 8: 0, 9: 0"
    it "16" $ do digitStats "8 290142909706" `shouldBe` "0: 0, 1: 0, 2: 72535727426, 3: 0, 4: 72535727427, 5: 0, 6: 72535727426, 7: 0, 8: 72535727427, 9: 0"
    it "17" $ do digitStats "8 887934415088" `shouldBe` "0: 0, 1: 0, 2: 221983603772, 3: 0, 4: 221983603772, 5: 0, 6: 221983603772, 7: 0, 8: 221983603772, 9: 0"
    it "18" $ do digitStats "9 345985509758" `shouldBe` "0: 0, 1: 172992754879, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 172992754879"
    it "19" $ do digitStats "4 672297630282" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 336148815141, 5: 0, 6: 336148815141, 7: 0, 8: 0, 9: 0"
    it "20" $ do digitStats "6 874014458345" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 874014458345, 7: 0, 8: 0, 9: 0"
    it "21" $ do digitStats "3 127959868263" `shouldBe` "0: 0, 1: 31989967065, 2: 0, 3: 31989967066, 4: 0, 5: 0, 6: 0, 7: 31989967066, 8: 0, 9: 31989967066"
    it "22" $ do digitStats "9 43090360424" `shouldBe` "0: 0, 1: 21545180212, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 21545180212"
    it "23" $ do digitStats "6 531348009213" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 531348009213, 7: 0, 8: 0, 9: 0"
    it "24" $ do digitStats "4 455892328655" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 227946164328, 5: 0, 6: 227946164327, 7: 0, 8: 0, 9: 0"
    it "25" $ do digitStats "2 785722410126" `shouldBe` "0: 0, 1: 0, 2: 196430602532, 3: 0, 4: 196430602532, 5: 0, 6: 196430602531, 7: 0, 8: 196430602531, 9: 0"
    it "26" $ do digitStats "5 54951909962" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 54951909962, 6: 0, 7: 0, 8: 0, 9: 0"
    it "27" $ do digitStats "6 589070610444" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 589070610444, 7: 0, 8: 0, 9: 0"
    it "28" $ do digitStats "5 860062789887" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 860062789887, 6: 0, 7: 0, 8: 0, 9: 0"
    it "29" $ do digitStats "6 924794963511" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 924794963511, 7: 0, 8: 0, 9: 0"
    it "30" $ do digitStats "5 409808844443" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 409808844443, 6: 0, 7: 0, 8: 0, 9: 0"
    it "31" $ do digitStats "7 537815960297" `shouldBe` "0: 0, 1: 134453990074, 2: 0, 3: 134453990074, 4: 0, 5: 0, 6: 0, 7: 134453990075, 8: 0, 9: 134453990074"
    it "32" $ do digitStats "4 122325068219" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 61162534110, 5: 0, 6: 61162534109, 7: 0, 8: 0, 9: 0"
    it "33" $ do digitStats "3 40740321376" `shouldBe` "0: 0, 1: 10185080344, 2: 0, 3: 10185080344, 4: 0, 5: 0, 6: 0, 7: 10185080344, 8: 0, 9: 10185080344"
    it "34" $ do digitStats "2 29282129402" `shouldBe` "0: 0, 1: 0, 2: 7320532351, 3: 0, 4: 7320532351, 5: 0, 6: 7320532350, 7: 0, 8: 7320532350, 9: 0"
    it "35" $ do digitStats "5 826842072242" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 826842072242, 6: 0, 7: 0, 8: 0, 9: 0"
    it "36" $ do digitStats "7 755813667612" `shouldBe` "0: 0, 1: 188953416903, 2: 0, 3: 188953416903, 4: 0, 5: 0, 6: 0, 7: 188953416903, 8: 0, 9: 188953416903"
    it "37" $ do digitStats "2 106585010487" `shouldBe` "0: 0, 1: 0, 2: 26646252622, 3: 0, 4: 26646252622, 5: 0, 6: 26646252621, 7: 0, 8: 26646252622, 9: 0"
    it "38" $ do digitStats "2 495413957119" `shouldBe` "0: 0, 1: 0, 2: 123853489280, 3: 0, 4: 123853489280, 5: 0, 6: 123853489279, 7: 0, 8: 123853489280, 9: 0"
    it "39" $ do digitStats "9 297696899325" `shouldBe` "0: 0, 1: 148848449662, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 148848449663"
    it "40" $ do digitStats "5 720328856650" `shouldBe` "0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 720328856650, 6: 0, 7: 0, 8: 0, 9: 0"

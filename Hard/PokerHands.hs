module CodeEval.PokerHands where
    
{-https://www.codeeval.com/open_challenges/86/
POKER HANDS CHALLENGE DESCRIPTION:

In the card game poker, a hand consists of five cards and are ranked, from lowest to highest, in the following way:

High Card: Highest value card.
One Pair: Two cards of the same value.
Two Pairs: Two different pairs.
Three of a Kind: Three cards of the same value.
Straight: All cards are consecutive values.
Flush: All cards of the same suit.
Full House: Three of a kind and a pair.
Four of a Kind: Four cards of the same value.
Straight Flush: All cards are consecutive values of same suit.
Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
The cards are valued in the order:

2, 3, 4, 5, 6, 7, 8, 9, Ten, Jack, Queen, King, Ace.
If two players have the same ranked hands then the rank made up of the highest value wins; for example, a pair of eights beats a pair of fives. But if two ranks tie, for example, 
both players have a pair of queens, then highest cards in each hand are compared; if the highest cards tie then the next highest cards are compared, and so on.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains 2 hands (left and right). Cards and hands are separated by space. E.g.

6D 7H AH 7S QC 6H 2D TD JD AS
JH 5D 7H TC JS JD JC TS 5S 7S
2H 8C AD TH 6H QD KD 9H 6S 6C
JS JH 4H 2C 9H QH KC 9D 4D 3S
TC 7H KH 4H JC 7D 9S 3H QS 7S
OUTPUT SAMPLE:

Print out the name of the winning hand or "none" in case the hands are equal. E.g.

left
none
right
left
right
-}

import Test.Hspec

import Data.List
import Data.List.Split
import Data.Char

handScore:: String -> [Int] -- "6D 7H AH 7S QC" -> [n]++[7,7,14,12,6]
handScore hand
  | head isStraightFlush > 0 = isStraightFlush
  | head (nOfAKind 4 8) > 0 = nOfAKind 4 8
  | head fullHouse > 0 = fullHouse
  | head flush > 0 = flush
  | head straight > 0 = straight
  | head (nOfAKind 3 4) > 0 = nOfAKind 3 4
  | head twoPair > 0 = twoPair
  | head (nOfAKind 2 2) > 0 = nOfAKind 2 2
  | otherwise = [1] ++ cards
  where
    cards = reverse $ sort $ map (toNum . head) $ splitOn " " hand -- [14,12,7,7,6]
    suits = map last $ splitOn " " hand -- "DHHSC"
    cardFrequency = filter ((1<).fst) $ map (\l -> (length l, head l)) (group (reverse $ sort cards)) -- [(2,7)]
    cardFrequencyHead = snd $ head cardFrequency -- [(2,7)]
    cardFrequencyNext = snd $ cardFrequency!!1 -- [(2,7)]
    nOfAKind n s
      | length cardFrequency == 0 = [0]
      | (maximum $ map fst cardFrequency) /= n = [0]
      | otherwise = [s] ++ replicate n cardFrequencyHead ++ (filter (/=cardFrequencyHead) cards)
    twoPair
      | length cardFrequency < 2 = [0]
      | otherwise = [3] ++ replicate 2 cardFrequencyHead ++ replicate 2 cardFrequencyNext ++ (filter (/=cardFrequencyNext)  $ filter (/=cardFrequencyHead) cards)
    straight
      | length cardFrequency > 0 = [0] -- no duplicates
      | (head cards)-4 == last cards = [5] ++ cards -- straight ace high
      | head cards == 14 && cards!!1 == 5 = [5] ++ tail cards ++ [1] -- straight ace low
      | otherwise = [0]
    flush
      | (length $ group suits) > 1 = [0]
      | otherwise = [6] ++ cards
    fullHouse
      | length cardFrequency < 2 = [0]
      | fst (cardFrequency!!0) == 3 = [7] ++ replicate 3 (snd (cardFrequency!!0)) ++ replicate 2 (snd (cardFrequency!!1))
      | fst (cardFrequency!!1) == 3 = [7] ++ replicate 3 (snd (cardFrequency!!1)) ++ replicate 2 (snd (cardFrequency!!0))
      | otherwise = [0]
    isStraightFlush
      | head flush > 0 && head straight >0 = [9]++cards
      | otherwise = [0]
    toNum c
      | c == 'A' = 14
      | c == 'K' = 13
      | c == 'Q' = 12
      | c == 'J' = 11
      | c == 'T' = 10
      | otherwise = digitToInt c



pokerHands:: String -> String
pokerHands hands = score [handScore $ take 14 hands,handScore $ drop 15 hands]
  where
    score:: [[Int]] -> String
    score [[],[]] = "none"
    score hands
      | head left > head right = "left"
      | head left < head right = "right"
      | otherwise = score [tail left,tail right]
      where
        left = hands!!0
        right = hands!!1


{- 
1 High Card: Highest value card.
2 One Pair: Two cards of the same value.
3 Two Pairs: Two different pairs.
4 Three of a Kind: Three cards of the same value.
5 Straight: All cards are consecutive values.
6 Flush: All cards of the same suit.
7 Full House: Three of a kind and a pair.
8 Four of a Kind: Four cards of the same value.
9 Straight Flush: All cards are consecutive values of same suit.
-}

test = hspec $ do

  describe "handScore" $ do
      it "6D 7H AH 7S QC" $ do handScore "6D 7H AH 7S QC" `shouldBe` [2,7,7,14,12,6]
      it "6D 7H AH 7S AC" $ do handScore "6D 7H AH 7S AC" `shouldBe` [3,14,14,7,7,6]
      it "6D 7H AH 7S 7C" $ do handScore "6D 7H AH 7S 7C" `shouldBe` [4,7,7,7,14,6]
      it "4D 6H 5C 8C 7H" $ do handScore "4D 6H 5C 8C 7H" `shouldBe` [5,8,7,6,5,4]
      it "4D 3H 5C 2C AH" $ do handScore "4D 3H 5C 2C AH" `shouldBe` [5,5,4,3,2,1]
      it "4D 3D 9D 2D AD" $ do handScore "4D 3D 9D 2D AD" `shouldBe` [6,14,9,4,3,2]
      it "4D 3H 3D 3D 4D" $ do handScore "4D 3H 3D 3D 4D" `shouldBe` [7,3,3,3,4,4]
      it "4D 3H 4D 3D 4D" $ do handScore "4D 3H 4D 3D 4D" `shouldBe` [7,4,4,4,3,3]
      it "4D 4H 4D 3D 4D" $ do handScore "4D 4H 4D 3D 4D" `shouldBe` [8,4,4,4,4,3]
      it "AD KD QD JD TD" $ do handScore "AD KD QD JD TD" `shouldBe` [9,14,13,12,11,10]
  describe "pokerHands" $ do
    it "6D 7H AH 7S QC 6H 2D TD JD AS" $ do pokerHands "6D 7H AH 7S QC 6H 2D TD JD AS" `shouldBe` "left"
    it "JH 5D 7H TC JS JD JC TS 5S 7S" $ do pokerHands "JH 5D 7H TC JS JD JC TS 5S 7S" `shouldBe` "none"
    it "2H 8C AD TH 6H QD KD 9H 6S 6C" $ do pokerHands "2H 8C AD TH 6H QD KD 9H 6S 6C" `shouldBe` "right"
    it "JS JH 4H 2C 9H QH KC 9D 4D 3S" $ do pokerHands "JS JH 4H 2C 9H QH KC 9D 4D 3S" `shouldBe` "left"
    it "TC 7H KH 4H JC 7D 9S 3H QS 7S" $ do pokerHands "TC 7H KH 4H JC 7D 9S 3H QS 7S" `shouldBe` "right"




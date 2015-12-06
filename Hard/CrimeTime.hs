module CodeEval.CrimeTime where

{- https://www.codeeval.com/open_challenges/195/
CRIME HOUSE
CHALLENGE DESCRIPTION:

This challenge appeared in Google Code Jam competition, licensed under Creative Commons Attribution License

While working for the police, you've identified a house where people go to commit crimes, called Crime House. One day, you set up a camera over the door of the house and record a video.

You don't know how many people were in Crime House at the start of the day, but you can see people enter and leave through the front door. Unfortunately, because the people entering and leaving Crime House are criminals, sometimes they wear masks; and you aren't quite sure if the front door is the only way in or out.

Sometimes you can guess who was wearing a mask. If criminal #5 entered the house, then someone wearing a mask left, then criminal #5 entered the house again, then either the person wearing the mask was criminal #5, or there is another way out of Crime House.

At the end of the day, when Crime House has closed its doors for the night, you watch your video. Because you're an optimist, you want to figure out if it's possible that there are no other entrances or exits from crime house; and if so, you want to figure out the minimum number of people who could be in Crime House at the end of the day.

INPUT SAMPLE:

The first argument is a path to a file. Each line of the input file contains one test case. Each test case starts with a single integer N, the number of times people pass through the front door of Crime House in the day. Next, after the semicolon, follows N events, separated by a pipe. Each event contains information about one person entering or leaving Crime House through the front door.

That information consists of a single character, E or L, followed by a space and then an integer id. If the first character is E, that indicates someone entered Crime House through the front door; if it's L, someone left through the front door. If id is greater than zero, the person with that identifier entered or left Crime House. If id is zero, then the person who entered or left Crime House was wearing a mask, and we don't know who he or she was.


1
2
3
4
5
3; E 5|L 0|E 5
2; L 1|L 1
4; L 1|E 0|E 0|L 1
7; L 2|E 0|E 1|E 2|E 0|E 3|L 4
13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4
OUTPUT SAMPLE:

For each test case, output one line containing the answer. If it's possible that there are no other entrances or exits from Crime House, then the answer should be the minimum number of people who could be in Crime House at the end of the day. If that's impossible, it should be "CRIME TIME".


1
2
3
4
5
1
CRIME TIME
1
4
0
CONSTRAINTS:

The number of test cases is 20.
Ids of criminals are in range from 0 to 2000 inclusive.
The number of events is in range from 1 to 15 inclusive.
-}



import Test.Hspec
import Control.Monad
import Control.Monad.ST
import Data.Array.ST
import Data.Foldable
import Data.Bits

import Data.List
import Data.List.Split
import Data.Maybe
import Control.Monad.Loops

getCrimeArgs::String->(String, [Int])
getCrimeArgs line = (moveArr, criminals)
  where
    args = splitOn ";" line
    n = read (head args)::Int
    moveArgs = map (splitOn " ") $ splitOn "|" $ tail (args!!1)
    moveArr = Data.List.concat $ map (head) moveArgs
    crimArr = map (\x-> read x::Int) $ map (head .drop 1) moveArgs
    distinctCrims = nub $ filter (>0) $ crimArr
    el x = elemIndex x distinctCrims
    toIndex x
      | x == 0 = -1
      | el x == Nothing = -1
      | otherwise = fromJust (el x)
    criminals = map toIndex crimArr

(>>.):: Int -> Int -> Int
(>>.) = shiftR

(<<.):: Int -> Int -> Int
(<<.) = shiftL

shouldSetBit :: Char -> Int -> Int -> Bool
shouldSetBit move criminalId j = a /= b
  where
    a = mod (j >>. criminalId) 2
    b = if move == 'E' then 1 else 0

getElementId :: Char -> Int -> Int -> Int
getElementId move criminalId j
  | move == 'E' = j + (1 <<. criminalId)
  | otherwise = j - (1 <<. criminalId)

processBitForMove move criminalId j newCrimBits = when (shouldSetBit move criminalId j) $ 
    do 
        writeArray newCrimBits (getElementId move criminalId j) True
        return ()

processCriminal move criminalId j arr n
    | criminalId /= -1 = do
        processBitForMove move criminalId j arr
        return ()
    | otherwise = do
        mapM (\k -> processBitForMove move k j arr) [0..n-1]
        return ()

handleMove crimBits move criminalId newCrimBits n cblen =
    do
        mapM (\j -> do
            val <- readArray crimBits j
            when (val == True) $ do
              processCriminal move criminalId j newCrimBits n
              return ()
            )
            [0..cblen-1]
        return ()


processHandleMoves moves criminals crimBits i
    | i == length moves = do return crimBits
    | otherwise = do
        newCrimBits <- newArray (0,1 <<.(length moves)-1) False :: ST s (STArray s Int Bool)
        handleMove crimBits (moves!!i) (criminals!!i) newCrimBits (length moves) (1 <<.(length moves))
        x <- processHandleMoves moves criminals newCrimBits (i+1)
        return x

processMoves:: [Char]-> [Int]-> [Bool]
processMoves moves criminals =  runST $ do
    crimBits <- newArray (0,1 <<.(length moves)-1) True :: ST s (STArray s Int Bool)
    res <- processHandleMoves moves criminals crimBits 0
    newXs <- getElems res
    return newXs

processMovesResult :: [Char]-> [Int]-> String
processMovesResult moves criminals
    | length hamming == 0 = "CRIME TIME"
    | otherwise = show $ head hamming
    where result = processMoves moves criminals
          hamming = sort $ map (popCount. snd) $ filter (\x->fst x)$ zip result [0..(length result)-1]

crimeTime::String->String
crimeTime line = processMovesResult (fst args) (snd args)
    where args= getCrimeArgs line

test = hspec $ do
  --describe "crimeTime" $ do
        --it "1" $ do crimeTime "15; E 0|L 478|L 0|L 0|L 478|L 0|L 1255|E 1464|L 0|L 0|E 1464|E 0|E 0|L 0|L 0" `shouldBe` "CRIME TIME"
      --it "2" $ do crimeTime "14; L 556|E 0|E 0|E 0|E 1019|L 0|L 0|E 0|E 0|L 0|L 0|L 1401|L 835|E 0" `shouldBe` "1"
    {-                    
        it "3" $ do crimeTime "15; E 0|E 992|E 835|E 1542|L 0|E 0|L 789|E 1031|L 0|L 1437|L 0|E 0|E 387|E 0|L 1031" `shouldBe` "3"
        it "4" $ do crimeTime "15; E 0|E 0|L 0|E 0|E 1926|L 0|E 0|L 0|E 0|E 0|E 0|E 988|L 0|L 1077|L 0" `shouldBe` "3"
        it "5" $ do crimeTime "15; L 0|E 303|E 0|E 596|L 0|L 0|E 0|L 0|E 0|L 0|L 1685|E 0|E 0|E 0|L 1685" `shouldBe` "2"
        it "6" $ do crimeTime "15; E 0|E 0|L 0|L 0|L 0|L 0|E 1422|E 0|E 0|E 0|E 714|E 0|L 0|E 502|E 0" `shouldBe` "7"
        it "7" $ do crimeTime "14; E 303|E 0|E 596|L 0|L 0|E 0|L 0|E 0|L 0|L 1685|E 0|E 0|E 0|L 1685" `shouldBe` "2"
        it "8" $ do crimeTime "15; E 0|E 1610|L 1265|L 0|L 0|L 140|L 0|E 0|L 0|E 0|E 0|E 924|L 287|L 0|E 0" `shouldBe` "2"
        it "9" $ do crimeTime "14; L 1|L 2|L 3|L 4|L 5|E 0|E 0|E 0|E 0|L 1|L 2|L 3|L 4|L 5" `shouldBe` "CRIME TIME"
        it "10" $ do crimeTime "15; E 0|E 0|E 0|E 1881|L 0|E 0|E 0|L 0|L 0|E 0|E 0|E 0|L 1543|E 0|L 1217" `shouldBe` "5"
        it "11" $ do crimeTime "15; E 519|L 0|L 0|L 0|E 0|E 0|L 0|L 0|L 0|L 0|L 0|E 0|L 0|E 0|E 0" `shouldBe` "2"
        it "12" $ do crimeTime "15; L 0|E 1221|E 0|L 0|L 0|E 1206|L 0|E 0|L 0|L 0|E 0|E 0|E 0|E 1210|L 0" `shouldBe` "3"
        it "13" $ do crimeTime "4; L 1|E 0|E 0|L 1" `shouldBe` "1"
        it "14" $ do crimeTime "15; E 0|L 0|E 261|E 0|L 0|L 0|L 919|E 0|L 0|L 0|L 762|E 0|L 0|E 0|E 700" `shouldBe` "2"
        it "15" $ do crimeTime "15; E 1700|E 0|E 0|E 0|L 1482|E 0|L 0|E 0|E 951|E 0|L 0|L 0|E 0|E 0|E 0" `shouldBe` "7"
        it "16" $ do crimeTime "15; E 0|E 0|E 0|E 1881|L 0|E 0|E 0|L 0|L 0|E 0|E 0|E 0|L 1543|E 0|L 1217" `shouldBe` "5"
        it "17" $ do crimeTime "15; L 1568|L 981|E 0|L 0|E 0|L 0|L 0|L 0|L 1802|E 1624|L 0|E 0|E 29|E 981|L 0" `shouldBe` "2"
        it "18" $ do crimeTime "15; E 0|L 0|E 261|E 0|L 0|L 0|L 919|E 0|L 0|L 0|L 762|E 0|L 0|E 0|E 700" `shouldBe` "2"
        it "19" $ do crimeTime "2; L 1|L 1" `shouldBe` "CRIME TIME"
        it "20" $ do crimeTime "15; L 294|E 0|L 1451|L 0|E 0|E 0|L 0|E 1039|E 0|E 0|L 139|E 0|L 0|E 1664|E 0" `shouldBe` "5"
        it "21" $ do crimeTime "13; E 0|L 671|E 0|E 0|E 1480|E 0|L 1878|L 0|L 1316|E 0|E 0|E 0|E 0" `shouldBe` "5"
        it "22" $ do crimeTime "3; E 5|L 0|E 5" `shouldBe` "1"
        it "23" $ do crimeTime "13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4" `shouldBe` "0"
        it "24" $ do crimeTime "13; L 4|L 1|L 2|E 0|L 1|E 0|L 2|E 0|L 2|E 0|E 0|L 1|L 4" `shouldBe` "0"
        it "25" $ do crimeTime "15; L 0|E 0|L 0|E 0|E 0|E 0|E 0|E 0|L 0|E 0|E 138|L 868|L 0|E 0|E 0" `shouldBe` "6"
        it "26" $ do crimeTime "4; L 1|E 0|E 0|L 1" `shouldBe` "1"
        it "27" $ do crimeTime "15; E 181|L 0|E 0|L 0|E 0|E 0|E 0|E 0|L 154|E 0|E 1126|L 96|E 0|E 0|L 96" `shouldBe` "5"
        it "28" $ do crimeTime "15; E 0|L 0|E 1590|L 1800|L 0|L 1800|E 147|E 0|E 0|E 0|E 0|E 0|L 0|E 0|L 0" `shouldBe` "CRIME TIME"
        it "29" $ do crimeTime "15; L 0|L 0|E 0|L 671|E 0|E 0|E 1480|E 0|L 1878|L 0|L 1316|E 0|E 0|E 0|E 0" `shouldBe` "5"
        it "30" $ do crimeTime "15; L 0|L 472|L 0|L 0|E 0|E 0|E 0|L 0|E 0|L 0|E 0|E 1446|L 472|E 0|L 0" `shouldBe` "3"
        it "31" $ do crimeTime "15; E 0|E 1554|E 0|L 0|E 0|E 0|L 0|L 0|E 0|E 1049|L 0|E 0|E 0|E 0|E 0" `shouldBe` "7"
        it "32" $ do crimeTime "15; L 0|L 556|E 0|E 0|E 0|E 1019|L 0|L 0|E 0|E 0|L 0|L 0|L 1401|L 835|E 0" `shouldBe` "1"
        it "33" $ do crimeTime "7; L 2|E 0|E 1|E 2|E 0|E 3|L 4" `shouldBe` "4"
        it "34" $ do crimeTime "15; E 1700|E 0|E 0|E 0|L 1482|E 0|L 0|E 0|E 951|E 0|L 0|L 0|E 0|E 0|E 0" `shouldBe` "7"
        it "35" $ do crimeTime "15; E 0|E 594|L 520|E 0|L 985|E 1272|L 0|E 0|L 0|E 594|E 0|L 148|E 0|E 0|L 1821" `shouldBe` "3"
        it "36" $ do crimeTime "15; L 0|L 0|L 0|L 0|L 1469|L 0|E 0|L 0|L 0|L 0|L 164|L 1647|E 0|L 0|E 0" `shouldBe` "1"
        it "37" $ do crimeTime "15; L 0|E 1271|L 0|L 0|E 1271|E 0|L 0|L 0|E 0|L 0|E 0|L 0|L 0|L 129|L 0" `shouldBe` "0"
        it "38" $ do crimeTime "15; L 0|L 574|E 0|L 0|L 574|E 0|L 0|E 0|L 1402|L 88|L 0|E 0|E 0|E 0|L 0" `shouldBe` "2"
        it "39" $ do crimeTime "8; E 1|L 0|E 3|E 2|E 0|L 2|L 1|L 0" `shouldBe` "0"
        it "40" $ do crimeTime "15; L 0|E 1184|L 0|L 0|E 0|L 0|E 485|E 0|L 0|E 0|L 0|L 0|E 1184|L 275|E 1751" `shouldBe` "2"
        it "41" $ do crimeTime "15; L 691|E 1119|E 0|L 0|L 1200|L 1119|E 0|E 0|E 1366|E 0|E 0|E 933|L 0|E 430|L 658" `shouldBe` "5"
        it "42" $ do crimeTime "15; E 0|L 0|L 0|E 1233|E 0|L 0|E 0|E 0|E 769|L 0|E 0|E 0|L 0|L 0|L 0" `shouldBe` "2"
        it "43" $ do crimeTime "15; E 184|E 91|E 433|E 165|E 1142|E 146|E 1772|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0" `shouldBe` "0"
        it "44" $ do crimeTime "7; L 2|E 0|E 1|E 2|E 0|E 3|L 4" `shouldBe` "4"
        it "45" $ do crimeTime "15; E 0|E 0|E 0|E 0|E 0|E 0|E 0|L 660|L 1112|L 1731|L 1064|L 884|L 963|L 22|L 1607" `shouldBe` "0"
        it "46" $ do crimeTime "13; L 348|E 0|L 1036|L 1679|E 0|E 0|E 0|E 0|E 630|L 1760|E 0|E 0|L 0" `shouldBe` "5"
        it "47" $ do crimeTime "15; E 0|E 1567|E 1693|L 0|E 0|L 0|L 0|E 0|E 0|L 0|E 0|L 1426|E 0|L 0|L 1210" `shouldBe` "1"
        it "48" $ do crimeTime "2; L 1|L 1" `shouldBe` "CRIME TIME"
        it "49" $ do crimeTime "15; L 294|E 0|L 1451|L 0|E 0|E 0|L 0|E 1039|E 0|E 0|L 139|E 0|L 0|E 1664|E 0" `shouldBe` "5"
        it "50" $ do crimeTime "15; L 0|E 0|E 0|L 0|L 0|E 0|E 0|L 0|L 1110|L 0|E 374|L 0|L 0|L 0|L 0" `shouldBe` "0"
        it "51" $ do crimeTime "15; E 0|L 0|L 0|L 0|L 0|L 528|L 0|E 0|E 0|E 0|E 0|L 0|L 0|L 1268|L 353" `shouldBe` "0"
        it "52" $ do crimeTime "15; L 0|L 0|L 348|E 0|L 1036|L 1679|E 0|E 0|E 0|E 0|E 630|L 1760|E 0|E 0|L 0" `shouldBe` "5"
        it "53" $ do crimeTime "14; E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0" `shouldBe` "4"
        it "54" $ do crimeTime "15; L 1568|L 981|E 0|L 0|E 0|L 0|L 0|L 0|L 1802|E 1624|L 0|E 0|E 29|E 981|L 0" `shouldBe` "2"
        it "55" $ do crimeTime "15; E 1398|L 0|E 1358|L 418|L 0|E 0|L 0|L 0|L 1737|E 1040|L 0|L 0|E 0|L 0|L 0" `shouldBe` "0"
        it "56" $ do crimeTime "15; E 1920|E 0|E 1878|E 0|L 0|E 663|E 981|L 202|L 1421|E 0|L 0|L 0|L 981|E 0|L 0" `shouldBe` "1"
        it "57" $ do crimeTime "3; E 5|L 0|E 5" `shouldBe` "1"
        it "58" $ do crimeTime "15; E 0|L 0|E 0|L 1756|E 0|E 0|E 0|L 0|L 0|E 0|L 0|L 0|L 0|E 591|E 0" `shouldBe` "2"
        it "59" $ do crimeTime "15; L 1705|L 0|E 1292|E 0|L 0|L 0|L 0|E 0|L 0|L 1705|E 0|L 0|L 0|E 0|L 0" `shouldBe` "0"
        it "60" $ do crimeTime "15; L 0|L 0|L 0|L 0|L 0|L 0|E 0|E 0|E 0|E 0|E 0|E 0|E 0|E 1|E 1" `shouldBe` "CRIME TIME"
        it "61" $ do crimeTime "15; E 0|L 0|E 0|L 1756|E 0|E 0|E 0|L 0|L 0|E 0|L 0|L 0|L 0|E 591|E 0" `shouldBe` "2"
        it "62" $ do crimeTime "15; L 0|E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0" `shouldBe` "4"
        it "63" $ do crimeTime "15; L 0|E 495|E 458|L 0|E 0|L 0|E 0|E 0|L 0|E 0|L 0|E 0|E 0|E 0|L 0" `shouldBe` "4"
        it "64" $ do crimeTime "2; L 1|L 1" `shouldBe` "CRIME TIME"
        it "65" $ do crimeTime "2; L 1|L 1" `shouldBe` "CRIME TIME"
        it "66" $ do crimeTime "15; L 0|L 0|L 0|E 1392|L 0|E 0|E 0|L 0|L 0|L 0|L 749|L 0|E 0|E 845|L 749" `shouldBe` "1"
        it "67" $ do crimeTime "15; L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0|L 0" `shouldBe` "0"
    -}

    {-}
  describe "getCrimeArgs" $ do
     it "1" $ do getCrimeArgs "3; E 5|L 0|E 5" `shouldBe` ("ELE",[0,-1,0])
     it "2" $ do getCrimeArgs "15; E 181|L 0|E 0|L 0|E 0|E 0|E 0|E 0|L 154|E 0|E 1126|L 96|E 0|E 0|L 96" `shouldBe` ("ELELEEEELEELEEL",[ 0, -1, -1, -1, -1, -1, -1, -1, 1, -1, 2, 3, -1, -1, 3])
     it "3" $ do getCrimeArgs "15; E 0|L 478|L 0|L 0|L 478|L 0|L 1255|E 1464|L 0|L 0|E 1464|E 0|E 0|L 0|L 0" `shouldBe` ("ELLLLLLELLEEELL",[ -1,0,-1,-1,0,-1,1,2,-1,-1,2,-1,-1,-1,-1])
-}
    {-
  describe "processMovesResult" $ do
    it "ELLLLLLELLEEELL" $ do processMovesResult "ELLLLLLELLEEELL" [-1,0,-1,-1,0,-1,1,2,-1,-1,2,-1,-1,-1,-1] `shouldBe` "CRIME TIME"
    it "1" $ do processMovesResult "ELE" [0,-1,0] `shouldBe` "1"
    it "2" $ do processMovesResult "LL" [ 0, 0 ] `shouldBe`  "CRIME TIME"
    it "3" $ do processMovesResult "LEEL" [0, -1, -1, 0 ] `shouldBe` "1"
    it "4" $ do processMovesResult "LEEEEEL" [ 0, -1, 1, 0, -1, 2, 3 ] `shouldBe` "4"
    it "5" $ do processMovesResult "LLLELELELEELL" [0, 1, 2, -1, 1, -1, 2, -1, 2, -1, -1, 1, 0] `shouldBe` "0"
               -}
    
                               {-
    it "LEEEELLEELLLLE" $ do processMovesResult "LEEEELLEELLLLE" [0,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,2,3,-1] `shouldBe` "1"
    it "EEEELELELLLEEEL" $ do processMovesResult "EEEELELELLLEEEL" [-1,0,1,2,-1,-1,3,4,-1,5,-1,-1,6,-1,4] `shouldBe` "3"
    it "EELEELELEEEELLL" $ do processMovesResult "EELEELELEEEELLL" [-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,1,-1,2,-1] `shouldBe` "3"
    it "LEEELLELELLEEEL" $ do processMovesResult "LEEELLELELLEEEL" [-1,0,-1,1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,2] `shouldBe` "2"
    it "EELLLLEEEEEELEE" $ do processMovesResult "EELLLLEEEEEELEE" [-1,-1,-1,-1,-1,-1,0,-1,-1,-1,1,-1,-1,2,-1] `shouldBe` "7"
    it "EEELLELELLEEEL" $ do processMovesResult "EEELLELELLEEEL" [0,-1,1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,2] `shouldBe` "2"
    it "EELLLLLELEEELLE" $ do processMovesResult "EELLLLLELEEELLE" [-1,0,1,-1,-1,2,-1,-1,-1,-1,-1,3,4,-1,-1] `shouldBe` "2"
    it "LLLLLEEEELLLLL" $ do processMovesResult "LLLLLEEEELLLLL" [0,1,2,3,4,-1,-1,-1,-1,0,1,2,3,4] `shouldBe` "CRIME TIME"
    it "EEEELEELLEEELEL" $ do processMovesResult "EEEELEELLEEELEL" [-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,2] `shouldBe` "5"
    it "ELLLEELLLLLELEE" $ do processMovesResult "ELLLEELLLLLELEE" [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "2"
    it "LEELLELELLEEEEL" $ do processMovesResult "LEELLELELLEEEEL" [-1,0,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,2,-1] `shouldBe` "3"
    it "LEEL" $ do processMovesResult "LEEL" [0,-1,-1,0] `shouldBe` "1"
    it "ELEELLLELLLELEE" $ do processMovesResult "ELEELLLELLLELEE" [-1,-1,0,-1,-1,-1,1,-1,-1,-1,2,-1,-1,-1,3] `shouldBe` "2"
    it "EEEELELEEELLEEE" $ do processMovesResult "EEEELELEEELLEEE" [0,-1,-1,-1,1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1] `shouldBe` "7"
    it "EEEELEELLEEELEL" $ do processMovesResult "EEEELEELLEEELEL" [-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,2] `shouldBe` "5"
    it "LLELELLLLELEEEL" $ do processMovesResult "LLELELLLLELEEEL" [0,1,-1,-1,-1,-1,-1,-1,2,3,-1,-1,4,1,-1] `shouldBe` "2"
    it "ELEELLLELLLELEE" $ do processMovesResult "ELEELLLELLLELEE" [-1,-1,0,-1,-1,-1,1,-1,-1,-1,2,-1,-1,-1,3] `shouldBe` "2"
    it "LL" $ do processMovesResult "LL" [0,0] `shouldBe` "CRIME TIME"
    it "LELLEELEEELELEE" $ do processMovesResult "LELLEELEEELELEE" [0,-1,1,-1,-1,-1,-1,2,-1,-1,3,-1,-1,4,-1] `shouldBe` "5"
    it "ELEEEELLLEEEE" $ do processMovesResult "ELEEEELLLEEEE" [-1,0,-1,-1,1,-1,2,-1,3,-1,-1,-1,-1] `shouldBe` "5"
    it "ELE" $ do processMovesResult "ELE" [0,-1,0] `shouldBe` "1"
    it "LLLELELELEELL" $ do processMovesResult "LLLELELELEELL" [0,1,2,-1,1,-1,2,-1,2,-1,-1,1,0] `shouldBe` "0"
    it "LLLELELELEELL" $ do processMovesResult "LLLELELELEELL" [0,1,2,-1,1,-1,2,-1,2,-1,-1,1,0] `shouldBe` "0"
    it "LELEEEEELEELLEE" $ do processMovesResult "LELEEEEELEELLEE" [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,-1,-1,-1] `shouldBe` "6"
    it "LEEL" $ do processMovesResult "LEEL" [0,-1,-1,0] `shouldBe` "1"
    it "ELELEEEELEELEEL" $ do processMovesResult "ELELEEEELEELEEL" [0,-1,-1,-1,-1,-1,-1,-1,1,-1,2,3,-1,-1,3] `shouldBe` "5"
    it "ELELLLEEEEEELEL" $ do processMovesResult "ELELLLEEEEEELEL" [-1,-1,0,1,-1,1,2,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "CRIME TIME"
    it "LLELEEEELLLEEEE" $ do processMovesResult "LLELEEEELLLEEEE" [-1,-1,-1,0,-1,-1,1,-1,2,-1,3,-1,-1,-1,-1] `shouldBe` "5"
    it "LLLLEEELELEELEL" $ do processMovesResult "LLLLEEELELEELEL" [-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,0,-1,-1] `shouldBe` "3"
    it "EEELEELLEELEEEE" $ do processMovesResult "EEELEELLEELEEEE" [-1,0,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1] `shouldBe` "7"
    it "LLEEEELLEELLLLE" $ do processMovesResult "LLEEEELLEELLLLE" [-1,0,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,2,3,-1] `shouldBe` "1"
    it "LEEEEEL" $ do processMovesResult "LEEEEEL" [0,-1,1,0,-1,2,3] `shouldBe` "4"
    it "EEEELELEEELLEEE" $ do processMovesResult "EEEELELEEELLEEE" [0,-1,-1,-1,1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1] `shouldBe` "7"
    it "EELELELELEELEEL" $ do processMovesResult "EELELELELEELEEL" [-1,0,1,-1,2,3,-1,-1,-1,0,-1,4,-1,-1,5] `shouldBe` "3"
    it "LLLLLLELLLLLELE" $ do processMovesResult "LLLLLLELLLLLELE" [-1,-1,-1,-1,0,-1,-1,-1,-1,-1,1,2,-1,-1,-1] `shouldBe` "1"
    it "LELLEELLELELLLL" $ do processMovesResult "LELLEELLELELLLL" [-1,0,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,1,-1] `shouldBe` "0"
    it "LLELLELELLLEEEL" $ do processMovesResult "LLELLELELLLEEEL" [-1,0,-1,-1,0,-1,-1,-1,1,2,-1,-1,-1,-1,-1] `shouldBe` "2"
    it "ELEEELLL" $ do processMovesResult "ELEEELLL" [0,-1,1,2,-1,2,0,-1] `shouldBe` "0"
    it "LELLELEELELLELE" $ do processMovesResult "LELLELEELELLELE" [-1,0,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,0,2,3] `shouldBe` "2"
    it "LEELLLEEEEEELEL" $ do processMovesResult "LEELLLEEEEEELEL" [0,1,-1,-1,2,1,-1,-1,3,-1,-1,4,-1,5,6] `shouldBe` "5"
    it "ELLEELEEELEELLL" $ do processMovesResult "ELLEELEEELEELLL" [-1,-1,-1,0,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1] `shouldBe` "2"
    it "EEEEEEELLLLLLLL" $ do processMovesResult "EEEEEEELLLLLLLL" [0,1,2,3,4,5,6,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "0"
    it "LEEEEEL" $ do processMovesResult "LEEEEEL" [0,-1,1,0,-1,2,3] `shouldBe` "4"
    it "EEEEEEELLLLLLLL" $ do processMovesResult "EEEEEEELLLLLLLL" [-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7] `shouldBe` "0"
    it "LELLEEEEELEEL" $ do processMovesResult "LELLEEEEELEEL" [0,-1,1,2,-1,-1,-1,-1,3,4,-1,-1,-1] `shouldBe` "5"
    it "EEELELLEELELELL" $ do processMovesResult "EEELELLEELELELL" [-1,0,1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,3] `shouldBe` "1"
    it "LL" $ do processMovesResult "LL" [0,0] `shouldBe` "CRIME TIME"
    it "LELLEELEEELELEE" $ do processMovesResult "LELLEELEEELELEE" [0,-1,1,-1,-1,-1,-1,2,-1,-1,3,-1,-1,4,-1] `shouldBe` "5"
    it "LEELLEELLLELLLL" $ do processMovesResult "LEELLEELLLELLLL" [-1,-1,-1,-1,-1,-1,-1,-1,0,-1,1,-1,-1,-1,-1] `shouldBe` "0"
    it "ELLLLLLEEEELLLL" $ do processMovesResult "ELLLLLLEEEELLLL" [-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,1,2] `shouldBe` "0"
    it "LLLELLEEEEELEEL" $ do processMovesResult "LLLELLEEEEELEEL" [-1,-1,0,-1,1,2,-1,-1,-1,-1,3,4,-1,-1,-1] `shouldBe` "5"
    it "EELELEELELEEEL" $ do processMovesResult "EELELEELELEEEL" [0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "4"
    it "LLELELLLLELEEEL" $ do processMovesResult "LLELELLLLELEEEL" [0,1,-1,-1,-1,-1,-1,-1,2,3,-1,-1,4,1,-1] `shouldBe` "2"
    it "ELELLELLLELLELL" $ do processMovesResult "ELELLELLLELLELL" [0,-1,1,2,-1,-1,-1,-1,3,4,-1,-1,-1,-1,-1] `shouldBe` "0"
    it "EEEELEELLELLLEL" $ do processMovesResult "EEEELEELLELLLEL" [0,-1,1,-1,-1,2,3,4,5,-1,-1,-1,3,-1,-1] `shouldBe` "1"
    it "ELE" $ do processMovesResult "ELE" [0,-1,0] `shouldBe` "1"
    it "ELELEEELLELLLEE" $ do processMovesResult "ELELEEELLELLLEE" [-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1] `shouldBe` "2"
    it "LLEELLLELLELLEL" $ do processMovesResult "LLEELLLELLELLEL" [0,-1,1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1] `shouldBe` "0"
    it "LLLLLLEEEEEEEEE" $ do processMovesResult "LLLLLLEEEEEEEEE" [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0] `shouldBe` "CRIME TIME"
    it "ELELEEELLELLLEE" $ do processMovesResult "ELELEEELLELLLEE" [-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1] `shouldBe` "2"
    it "LEELELEELELEEEL" $ do processMovesResult "LEELELEELELEEEL" [-1,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "4"
    it "LEELELEELELEEEL" $ do processMovesResult "LEELELEELELEEEL" [-1,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "4"
    it "LL" $ do processMovesResult "LL" [0,0] `shouldBe` "CRIME TIME"
    it "LL" $ do processMovesResult "LL" [0,0] `shouldBe` "CRIME TIME"
    it "LLLELEELLLLLEEL" $ do processMovesResult "LLLELEELLLLLEEL" [-1,-1,-1,0,-1,-1,-1,-1,-1,-1,1,-1,-1,2,1] `shouldBe` "1"
    it "LLLLLLLLLLLLLLL" $ do processMovesResult "LLLLLLLLLLLLLLL" [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] `shouldBe` "0"
-}

  describe "processMoves" $ do
    it "ELLLLLLELLEEELL" $ do processMoves "ELLLLLLELLEEELL" [-1,0,-1,-1,0,-1,1,2,-1,-1,2,-1,-1,-1,-1] `shouldBe` []
{-
    it "1" $ do (toBitString $ processMoves "ELE" [0,-1,0]) `shouldBe` "01010101"
    it "2" $ do (toBitString $ processMoves "LL" [ 0, 0 ]) `shouldBe`  "0000"
    it "3" $ do (toBitString $ processMoves "LEEL" [0, -1, -1, 0 ]) `shouldBe` "0010101010101010"
    it "4" $ do (toBitString $ processMoves "LEEEEEL" [ 0, -1, 1, 0, -1, 2, 3 ]) `shouldBe` "00000000000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000"
    it "5" $ do (toBitString $ processMoves "LLLELELELEELL" [0, 1, 2, -1, 1, -1, 2, -1, 2, -1, -1, 1, 0]) `shouldBe`  "10000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000"


  describe "handleMove" $ do
    it "L 2 3" $ do testHandleMove crim 'L' 2 3 `shouldBe` "10100000"
    it "L 1 3" $ do testHandleMove crim 'L' 1 3 `shouldBe` "10001000"
    it "L 0 3" $ do testHandleMove crim 'L' 0 3 `shouldBe` "00000000"
    it "E 2 3" $ do testHandleMove crim 'E' 2 3 `shouldBe` "00001010"
    it "E 1 3" $ do testHandleMove crim 'E' 1 3 `shouldBe` "00100010"
    it "E 0 3" $ do testHandleMove crim 'E' 0 3 `shouldBe` "01010101"


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
-}
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
toBitString::[Bool]->String
toBitString = map (\x-> if x then '1' else '0')

testProcessCriminal::Int->Char->Int->Int->Int->String
testProcessCriminal size move criminalId j n = runST $ do
    arr <- newArray (0,size-1) False :: ST s (STArray s Int Bool)
    processCriminal move criminalId j arr n
    newXs <- getElems arr
    return (toBitString newXs)


testProcessBitForMove::Int->Char->Int->Int->String
testProcessBitForMove size move criminalId j = runST $ do
    arr <- newArray (0,size-1) False :: ST s (STArray s Int Bool)
    processBitForMove move criminalId j arr
    newXs <- getElems arr
    return (toBitString newXs)

testHandleMove :: [Bool] -> Char -> Int -> Int ->String
testHandleMove crimBit move criminalId n =  runST $ do -- n == move count
    arr <- newArray (0,(length crimBit)-1) False :: ST s (STArray s Int Bool)
    crimBitarr <- newListArray (0,(length crimBit)-1) crimBit :: ST s (STUArray s Int Bool)
    handleMove crimBitarr move criminalId arr n (length crimBit)
    newXs <- getElems arr
    return (map (\x-> if x then '1' else '0') newXs)

crim = [True,False,True,False,True,False,True,False]


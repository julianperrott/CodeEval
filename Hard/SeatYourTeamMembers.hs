module CodeEval.SeatYourTeamMembers where

{- https://www.codeeval.com/open_challenge_scores/?pkbid=118

Seat your team members

Challenge Description:

Your team is moving to a new office. In order to make it feel comfortable on a new place you decided to give the possibility to pick the places where they want to sit. After the team visited the new office, each team member gave you a list of working places that he/she would like to occupy. Your goal is to determine a possibility of making all of your team members feel comfortable according to those lists. 

 All working places in the new office are numbered from 1 to N. And each team member gave you the list which contained the places in unsorted order. 

Input sample:

Your program should accept as its first argument a path to a filename. Each line of the file contains an integer N of available places in the office as the first digit and the lists of places that have been chosen by each team member. These lists are enclosed by square brackets. E.g. 
4; 1:[1, 3, 2], 2:[1], 3:[4, 3], 4:[4, 3]
3; 1:[1, 3, 2], 2:[1], 3:[1]

Output sample:

For each line of input print out the simple "Yes" or "No" answer for the following question: "Is there a possibility to make all of your team members feel comfortable at the new office?". E.g. 
Yes
No

Constraints: 
 N is an integer in range [1, 50]. 
 The number of team members is <= N. 
 Each team member can pick 1 to N numbers of working places. 

-}

import Test.Hspec

import Data.List
import Data.List.Split

countSeatPrefs::[Int]->[[Int]]->[(Int,Int)]
countSeatPrefs seats prefs = map countPref seats
  where
    countPref seat = (seat,sum $ map hasSeat prefs)
      where
        hasSeat pref
          | elemIndex seat pref == Nothing = 0
          | otherwise = 1

sortCounts::[(Int,Int)]->[(Int,Int)]
sortCounts counts = sortBy sortC counts
  where
    sortC a b
      | snd a < snd b = LT
      | snd a > snd b = GT
      | otherwise = EQ

getIndexsForSeat::[[Int]]->Int->[Int]
getIndexsForSeat prefs seat = map snd $ filter (\pref-> (elemIndex seat (fst pref)) /= Nothing ) $ zip prefs [0..]

removeSeat::[Int]->Int->[Int]
removeSeat seats seat = filter (\x-> x/=seat) seats

removeSeatFromPrefs::[[Int]]->Int->[[Int]]
removeSeatFromPrefs prefs seat = map (\x-> removeSeat x seat) prefs

canSeat::[Int]->[[Int]]->Bool
canSeat seats prefs
    | length seats == 0 = True
    | singlePrefIndexes == [] = allocateLeastPopularSeat seats prefs
    | otherwise = allocateSinglePreference seats prefs (singlePrefIndexes!!0)
    where singlePrefIndexes = getSinglePreferences prefs

allocateSinglePreference::[Int]->[[Int]]->Int->Bool
allocateSinglePreference seats prefs index = canSeat newSeats (removeIndex newprefs index)
    where
     seat = head $ prefs!!index
     newSeats = removeSeat seats seat
     newprefs = removeSeatFromPrefs prefs seat

allocateLeastPopularSeat::[Int]->[[Int]]->Bool
allocateLeastPopularSeat seats prefs = allocateSeatByIndex newSeats newprefs indexsForSeat
    where
        counts = sortCounts $ countSeatPrefs seats prefs
        seat = fst $ head counts
        indexsForSeat = getIndexsForSeat prefs seat
        newSeats = removeSeat seats seat
        newprefs = removeSeatFromPrefs prefs seat

allocateSeatByIndex::[Int]->[[Int]]->[Int]->Bool
allocateSeatByIndex seats prefs indexsForSeat
    | indexsForSeat == [] = False
    | canSeat seats (removeIndex prefs (head indexsForSeat)) = True
    | otherwise = allocateSeatByIndex seats prefs (tail indexsForSeat)

getSinglePreferences::[[Int]]->[Int]
getSinglePreferences prefs = map snd $ filter (\x-> (length (fst x) == 1)) $ zip prefs [0..]

removeIndex::[a]->Int->[a]
removeIndex xs x = take x xs ++ drop (x+1) xs

toSeats::String->[Int]
toSeats line = [1..seatMax]
    where
      seatMax = read num::Int
      num = head $ splitOn ";" line

toPrefs::String->[[Int]]
toPrefs line = map toPreferenceArray $ tail $ splitOn ":" $ (splitOn ";" line)!!1

toPreferenceArray::String->[Int]
toPreferenceArray arg = map (\x-> read x::Int)  $ splitOn "," $ head $ splitOn "]" $ (splitOn "[" arg)!!1

seatYourTeamMembers::String->String
seatYourTeamMembers line 
    | canSeat (toSeats line) (toPrefs line) = "Yes"
    | otherwise = "No"

sc1 = "15; 1:[14, 13, 5, 4, 10, 3, 12, 9], 2:[15, 3, 8, 4], 3:[14, 10, 11, 8, 1], 4:[8, 14, 5], 5:[3], 6:[8, 6, 2, 10, 14, 5, 9, 7, 12, 11], 7:[4, 9, 11, 6, 15, 2, 13, 8], 8:[8, 14, 7, 15, 6, 1, 12, 2], 9:[11], 10:[14, 7, 12, 2, 6], 11:[4, 7, 5, 11, 6, 12, 14, 3, 9, 10, 2], 12:[13, 14, 6, 12], 13:[12, 1, 8, 15, 5, 7, 6, 13, 4, 11, 2], 14:[6, 11, 7, 3, 14, 15, 4], 15:[3, 2, 14, 11, 4, 1, 9, 5]"
sc2 = "4; 1:[1, 2], 2:[1, 2], 3:[1, 2], 4:[3, 4]"
sc3 = "6; 1:[4, 3, 2, 5, 1], 2:[4, 5, 1], 3:[4, 5, 1], 4:[4, 5], 5:[4, 5, 1], 6:[5]"
sc4 = "14; 1:[13, 6, 1, 4], 2:[12, 3, 10, 5, 13, 8, 9, 14], 3:[9, 3, 10], 4:[2, 12, 10], 5:[7, 5, 11, 6, 4, 13, 14], 6:[7], 7:[6, 13, 7, 11, 5, 1, 3, 2, 4, 10, 12], 8:[1, 12, 6, 7], 9:[8, 14, 4, 11, 6, 7, 13, 9, 5, 10, 3], 10:[8, 14, 13, 2, 3, 9, 12], 11:[10, 6, 11, 7, 8, 9], 12:[14, 13, 1, 4, 9, 3, 12], 13:[14, 10, 5, 8, 1, 13], 14:[12, 13, 4, 5]"
sc5 = "14; 1:[11, 9, 4, 7, 2, 8, 3, 14], 2:[4, 11, 9, 12, 2, 14], 3:[3, 2, 4, 5, 8, 12, 10, 9, 1], 4:[10, 2, 14, 4], 5:[6, 12], 6:[3, 8, 2, 6, 5, 7, 9], 7:[11, 10, 13, 12, 14, 6, 1, 7], 8:[3, 4], 9:[14, 13, 8], 10:[5, 11, 3, 7, 6, 10, 12], 11:[4, 11, 12, 1, 8, 9], 12:[13], 13:[12, 10, 7, 2], 14:[3, 7, 2, 11, 9, 8, 6]"
sc6 = "5; 1:[4, 3, 2, 5, 1], 2:[4, 3, 2, 5, 1], 3:[4, 3, 2, 5, 1], 4:[4, 3, 2, 5, 1], 5:[4, 3, 2, 5, 1]"
sc7 = "15; 1:[12, 9, 3, 2, 6, 15, 5, 4, 14, 8, 1], 2:[10, 3, 14, 1, 8, 12, 9, 2], 3:[14, 4, 9, 6, 7, 5, 2, 8], 4:[11, 12, 5, 14, 2, 15, 10], 5:[10, 9], 6:[13, 2, 6, 10, 1], 7:[9, 8, 1, 2, 15, 4, 11, 7], 8:[13, 3], 9:[10, 8, 15], 10:[13, 1, 9, 4, 10, 3, 11, 14], 11:[8], 12:[13, 6, 15, 1, 3, 9, 7, 4], 13:[1, 11, 6], 14:[1, 7, 8, 2, 6, 13, 3], 15:[3]"
sc8 = "5; 1:[4, 3, 2, 5, 1], 2:[4, 3, 2, 5, 1], 3:[4, 3, 2, 5, 1], 4:[1], 5:[1]"
sc9 = "5; 1:[4, 3, 2], 2:[4, 3, 2], 3:[4, 3, 2], 4:[4, 3, 2], 5:[4, 3, 2]"
sc10 = "14; 1:[13, 10, 7, 4], 2:[6, 4], 3:[14], 4:[5, 13, 7, 4], 5:[9, 6, 12], 6:[13, 5, 4, 3, 2, 6], 7:[1, 3, 5, 4, 7, 2], 8:[4, 11, 6, 14, 12], 9:[5, 9, 10, 4, 1, 6, 12, 11, 13, 14, 2], 10:[2, 1, 9, 11, 4, 12, 8, 10], 11:[10, 1, 4, 7], 12:[9, 11, 13, 1, 6, 4, 5, 12, 7, 14, 8, 3], 13:[12, 11, 3, 10, 14, 1, 13, 7], 14:[5, 6]"
sc11 = "14; 1:[4, 10], 2:[8, 10, 3, 5, 7, 6, 12], 3:[14, 3], 4:[2, 11, 1, 14], 5:[11, 2, 8, 10], 6:[8, 6, 4, 12, 13, 5, 1, 7], 7:[11, 5, 14, 7, 6, 1, 2, 8, 12], 8:[5, 11, 4, 14, 9, 7, 1, 12], 9:[9, 7, 8, 5, 2], 10:[6, 8, 1], 11:[10, 1, 14, 3, 2], 12:[5], 13:[3, 2, 8, 7, 13, 12, 6, 1, 10], 14:[9, 2, 11, 7, 10, 3, 13, 14, 1, 12, 4]"
sc12 = "14; 1:[4, 8, 11, 2, 1, 9, 7], 2:[2, 6, 11, 3, 13], 3:[7, 8, 9, 4, 6], 4:[11, 10], 5:[6, 1, 10, 4, 5], 6:[12, 3, 10, 2, 6, 11, 7], 7:[5, 8, 1], 8:[8, 1, 4, 7, 13, 6, 3, 11], 9:[3, 5, 6, 7], 10:[6, 7, 1, 8], 11:[13, 12, 2, 1, 7, 4, 9], 12:[13, 2, 6, 11, 1, 9], 13:[13, 6, 9, 4, 1, 10, 3], 14:[4, 9, 1, 3, 8, 6, 11]"
sc13 = "13; 1:[9, 1, 10, 5], 2:[1, 4, 13, 12, 9, 6, 11, 3], 3:[6, 13, 1], 4:[13, 5, 1, 10, 8, 11, 3, 7, 9, 12], 5:[10, 4], 6:[7, 6, 4, 8, 11], 7:[1, 4, 8, 11, 7, 10, 12], 8:[4, 6, 7, 9, 11, 1], 9:[10, 13], 10:[10, 9, 4, 11, 8, 7, 6, 13], 11:[7, 9, 4, 11, 10, 12, 13, 8], 12:[11, 9, 12, 7, 1], 13:[1, 7, 6, 3, 13, 10]"
sc14 = "15; 1:[9, 11, 6, 2, 13, 10, 8, 7, 14], 2:[11, 3, 5, 6, 2, 8, 1, 14, 10, 7], 3:[13, 1, 5, 12, 10, 7, 2, 15], 4:[13, 8, 4, 12, 15], 5:[3, 7, 11, 1], 6:[3, 6], 7:[11, 8, 4, 6, 12, 7, 9, 13, 14], 8:[2, 9, 1, 13, 7, 4, 5, 3, 6], 9:[9, 8], 10:[4, 12, 2, 7, 9], 11:[1, 12, 2, 6, 9], 12:[9, 15, 3, 13, 14], 13:[15, 5, 10, 11, 9, 1, 3, 14, 13], 14:[12, 11, 7, 3, 13, 2, 6, 14, 10], 15:[12]"
sc15 = "15; 1:[15, 6, 11, 14, 2], 2:[15], 3:[6, 14, 4, 12], 4:[5], 5:[8, 1, 15, 7, 11, 9, 12, 14, 2, 4, 10], 6:[7, 13, 5, 4], 7:[11, 15, 10, 5, 9, 1, 8, 6], 8:[13, 5, 15, 6, 7, 12, 11, 10, 1], 9:[8, 6, 4, 2, 14, 7], 10:[12, 10, 15, 1, 2], 11:[15, 6, 10, 12], 12:[15, 11, 12, 9, 4, 13, 14, 8, 2], 13:[1, 9, 10, 6, 14, 13, 11], 14:[2], 15:[5, 2, 4, 11, 13]"
sc16 = "15; 1:[1, 10, 5, 11, 3, 14, 12, 8], 2:[2, 8], 3:[2, 12, 10, 8, 6, 9], 4:[11, 15, 8, 10], 5:[2, 7, 1, 5, 6, 3], 6:[4, 8, 9, 6, 7, 2, 1, 3], 7:[7, 11], 8:[15, 4, 9, 11, 7, 1], 9:[4, 13, 15, 5, 2], 10:[10, 5, 11, 2, 8], 11:[13, 6, 11, 10, 14, 1, 5, 7], 12:[13, 9, 14, 12, 11, 1, 8, 6, 15], 13:[10, 15, 13, 11, 14, 3, 8, 2], 14:[9, 15, 13, 8, 7], 15:[4, 5, 7]"
sc17 = "6; 1:[4], 2:[1], 3:[2], 4:[3], 5:[6], 6:[5]"
sc18 = "13; 1:[6, 4, 13, 9, 12, 7, 10, 5], 2:[3, 12, 11, 4, 13, 7, 2, 1], 3:[1, 8, 4, 13, 7, 9], 4:[4, 13, 5, 9, 12, 10, 7], 5:[3, 10, 9, 1, 8, 13, 4, 11, 2], 6:[11, 7, 8, 10, 12, 3, 9, 5, 13], 7:[4, 9, 5, 12, 10, 2], 8:[10, 11, 6, 13, 9, 2, 3, 7, 12], 9:[10, 7, 1, 3, 13, 9], 10:[1, 8, 11, 12, 13, 2, 5, 9], 11:[6, 7, 12, 1, 4, 9], 12:[4], 13:[1]"
sc19 = "14; 1:[6, 13, 12, 2], 2:[7, 14, 4, 1, 8, 3, 13], 3:[9, 14, 13, 7, 2, 11, 4], 4:[13, 3, 7, 2, 4, 8, 11, 1], 5:[1, 9, 3, 6, 7, 11, 5], 6:[10, 5, 14, 2, 7, 11], 7:[8], 8:[1, 10, 2, 8, 7, 9, 6], 9:[13, 9, 2, 3, 1, 8, 6, 14], 10:[14, 7, 10, 11, 8, 9], 11:[1, 3, 8, 12, 13, 4, 10, 5, 7, 9, 14], 12:[6, 10, 1, 14, 3, 11, 4], 13:[3, 6, 10, 11, 1, 8, 13], 14:[11, 4, 1, 12, 14]"
sc20 = "14; 1:[12], 2:[11, 1, 9, 2, 8, 3], 3:[9, 10, 14, 5, 8, 7, 3, 2], 4:[11, 5], 5:[4], 6:[4, 10, 7], 7:[13, 14, 6, 8, 3, 11, 2, 1, 5, 7, 9], 8:[6, 3, 1, 2, 11, 12, 10, 4], 9:[8, 2, 13, 3, 11, 6, 1, 12], 10:[3, 7, 1, 9, 14], 11:[6, 11, 5, 8, 7, 12, 13, 3, 9, 10, 4], 12:[7, 13, 6, 5, 1, 9, 4, 8], 13:[6, 1], 14:[1, 6]"

seats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
prefs = [[6, 13, 12, 2], [7, 14, 4, 1, 8, 3, 13], [9, 14, 13, 7, 2, 11, 4], [13, 3, 7, 2, 4, 8, 11, 1], [1, 9, 3, 6, 7, 11, 5], [10, 5, 14, 2, 7, 11], [8], [1, 10, 2, 8, 7, 9, 6], [13, 9, 2, 3, 1, 8, 6, 14], [14, 7, 10, 11, 8, 9], [1, 3, 8, 12, 13, 4, 10, 5, 7, 9, 14], [6, 10, 1, 14, 3, 11, 4], [3, 6, 10, 11, 1, 8, 13], [11, 4, 1, 12, 14]]

counts = [(1,9),(2,6),(3,7),(4,6),(5,3),(6,6),(7,8),(8,8),(9,6),(10,6),(11,8),(12,3),(13,7),(14,8)]

test = hspec $ do
  describe "Seat - " $ do 
    it "countSeatPrefs" $ do countSeatPrefs seats prefs `shouldBe` counts
    it "sortCounts" $ do sortCounts counts `shouldBe` [(5, 3), (12, 3), (2, 6), (4, 6), (6, 6), (9, 6), (10, 6), (3, 7), (13, 7), (7, 8), (8, 8), (11, 8), (14, 8), (1, 9)]
    it "getIndexsForSeat" $ do getIndexsForSeat prefs 5 `shouldBe` [4, 5, 10]
    it "removeSeat" $ do removeSeat seats 5 `shouldBe` [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    it "removeSeatFromPrefs" $ do removeSeatFromPrefs prefs 5 `shouldBe` [[6, 13, 12, 2], [7, 14, 4, 1, 8, 3, 13], [9, 14, 13, 7, 2, 11, 4], [13, 3, 7, 2, 4, 8, 11, 1], [1, 9, 3, 6, 7, 11], [10, 14, 2, 7, 11], [8], [1, 10, 2, 8, 7, 9, 6], [13, 9, 2, 3, 1, 8, 6, 14], [14, 7, 10, 11, 8, 9], [1, 3, 8, 12, 13, 4, 10, 7, 9, 14], [6, 10, 1, 14, 3, 11, 4], [3, 6, 10, 11, 1, 8, 13], [11, 4, 1, 12, 14]]
    it "canSeat" $ do canSeat seats prefs `shouldBe` True
    it "getSinglePreferences" $ do  getSinglePreferences prefs `shouldBe` [6]
    it "removeIndex" $ do removeIndex seats 2 `shouldBe` [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    it "toSeats 1" $ do toSeats "4; 1:[1, 3, 2], 2:[1], 3:[4, 3], 4:[4, 3]" `shouldBe` [1, 2, 3, 4]
    it "toSeats 2" $ do  toSeats "3; 1:[1, 3, 2], 2:[1], 3:[1]" `shouldBe` [1, 2, 3]
    it "toPrefs 1" $ do toPrefs "4; 1:[1, 3, 2], 2:[1], 3:[4, 3], 4:[4, 3]" `shouldBe` [[1, 3, 2], [1], [4, 3], [4, 3]]
    it "toPrefs 2" $ do toPrefs "3; 1:[1, 3, 2], 2:[1], 3:[1]" `shouldBe` [[1, 3, 2], [1], [1]]
    it "toPreferenceArray 1" $ do toPreferenceArray "[1, 3, 2], 2" `shouldBe` [1, 3, 2]
    it "toPreferenceArray 2" $ do toPreferenceArray "[1], 3" `shouldBe` [1]
    it "toPreferenceArray 3" $ do toPreferenceArray "[4, 3], 4" `shouldBe` [4, 3]
    it "toPreferenceArray 4" $ do toPreferenceArray "[4, 3]" `shouldBe` [4,3 ]
 
    it "seatYourTeamMembers eg1" $ do seatYourTeamMembers "4;  1:[1, 3, 2], 2:[1], 3:[4, 3], 4:[4, 3]" `shouldBe` "Yes"
    it "seatYourTeamMembers eg2" $ do seatYourTeamMembers "3;  1:[1, 3, 2], 2:[1], 3:[1]" `shouldBe` "No"
                                      
    it "seatYourTeamMembers sc1" $ do   seatYourTeamMembers sc1 `shouldBe` "Yes"
    it "seatYourTeamMembers sc2" $ do   seatYourTeamMembers sc2 `shouldBe` "No"
    it "seatYourTeamMembers sc3" $ do   seatYourTeamMembers sc3 `shouldBe` "No"
    it "seatYourTeamMembers sc4" $ do   seatYourTeamMembers sc4 `shouldBe` "Yes"
    it "seatYourTeamMembers sc5" $ do   seatYourTeamMembers sc5 `shouldBe` "Yes"
    it "seatYourTeamMembers sc6" $ do   seatYourTeamMembers sc6 `shouldBe` "Yes"
    it "seatYourTeamMembers sc7" $ do   seatYourTeamMembers sc7 `shouldBe` "Yes"
    it "seatYourTeamMembers sc8" $ do   seatYourTeamMembers sc8 `shouldBe` "No"
    it "seatYourTeamMembers sc9" $ do   seatYourTeamMembers sc9 `shouldBe` "No"
    it "seatYourTeamMembers sc10" $ do   seatYourTeamMembers sc10 `shouldBe` "Yes"
    it "seatYourTeamMembers sc11" $ do   seatYourTeamMembers sc11 `shouldBe` "Yes"
    it "seatYourTeamMembers sc12" $ do   seatYourTeamMembers sc12 `shouldBe` "No"
    it "seatYourTeamMembers sc13" $ do   seatYourTeamMembers sc13 `shouldBe` "No"
    it "seatYourTeamMembers sc14" $ do   seatYourTeamMembers sc14 `shouldBe` "Yes"
    it "seatYourTeamMembers sc15" $ do   seatYourTeamMembers sc15 `shouldBe` "No"
    it "seatYourTeamMembers sc16" $ do   seatYourTeamMembers sc16 `shouldBe` "Yes"
    it "seatYourTeamMembers sc17" $ do   seatYourTeamMembers sc17 `shouldBe` "Yes"
    it "seatYourTeamMembers sc18" $ do   seatYourTeamMembers sc18 `shouldBe` "Yes"
    it "seatYourTeamMembers sc19" $ do   seatYourTeamMembers sc19 `shouldBe` "Yes"
    it "seatYourTeamMembers sc20" $ do   seatYourTeamMembers sc20 `shouldBe` "Yes"
                                
module CodeEval.EfficientDelivery where

{- https://www.codeeval.com/open_challenges/123/

Efficient Delivery

Challenge Description:

A shipping company is providing oil delivery between two continents using tankers. They’re trying to increase their efficiency by keeping their ships in port to wait for additional oil to prevent setting to sea only partially loaded. 
 As a logistician, the challenge for you will be to determine all variations of efficient delivery based on the available tankers and the total amount of oil in barrels needed to achieve maximum efficiency. 
 A tanker's carrying capacity is expressed in barrels of oil that it can take on board. 
 E.g. the company has only two kind of tankers with the capacity of 2 and 5 barrels and the amount of oil to be transferred is 12 barrels. In this case there are two options of efficient delivery: 
 1. load 6 tankers with the capacity of 2. [6,0] 
 2. load 1 tanker with the capacity of 2 and 2 tankers with the capacity of 5. [1,2] 
 In case the company had three kind of tankers with the capacity of 6, 7, 8 barrels and 10 barrels of oil to be transferred then there would be no option for efficient delivery and the minimum amount of oil needed would be 12 [2,0,0] so the answer in this case is 2. 
 So you see that if there is no option to load the tankers effectively, you need to find out the minimum amount of oil which needs to be added to the given quantity to make the efficient delivery possible. 

Input sample:

Your program should accept as its first argument a path to a filename containing rows with available tankers in brackets in sorted order, and the amount of oil after a comma. E.g. 

(2,5), 12
(6,9,20), 44
(197,8170), 155862
(2,4,8), 8


Output sample:

Print out all possible variations of efficient delivery in sorted order if the efficient delivery exists. In another case print out the amount of oil to be added. E.g. 


[1,2][6,0]
[1,2,1][4,0,1]
[0,0,1][0,2,0][2,1,0][4,0,0]

Constrains: Number of test cases is in range [20, 40] 
 The number of tankers is in range [2, 5] 
 A tanker's capacity is in range of [2, 10000] barrels 
 Oil amount is in range of [1, 200000] barrels 

-}

import Test.Hspec

import Data.List
import Data.List.Split

fitOil::Int->[Int]->[(Int,Int)]->[[(Int,Int)]]
fitOil oil tankers path
  | oil == 0 && tankers /= [] =  fitOil oil newTankers (newPath 0)
  | oil == 0 = [path]
  | length tankers == 0 = []
  | oil < tankerCapacity = fitOil oil newTankers path
  | otherwise = concat $ map fit [0..maxTankersNeeded]
  where
    maxTankersNeeded = div oil tankerCapacity
    newPath n = path++[(tankerCapacity,n)]
    newTankers = tail tankers
    tankerCapacity = head tankers
    fit n = (fitOil (oil-(n*tankerCapacity)) newTankers) (newPath n)

oilNeeded::Int->[Int]->Int
oilNeeded oil tankers
  | length tankers == 0 = 999999
  | oil < tankerCapacity = min (tankerCapacity-oil) (oilNeeded oil newTankers) -- can't fit in this tanker
  | otherwise = minimum $ [(maxTankersNeeded+1)*tankerCapacity - oil] ++ (map fit [0..maxTankersNeeded])
  where
    maxTankersNeeded = div oil tankerCapacity
    newTankers = tail tankers
    tankerCapacity = head tankers
    fit n = oilNeeded (oil- n * tankerCapacity) newTankers

toTankers::String->[Int]
toTankers line = map (\x-> read x::Int) $ splitOn "," $ last $ splitOn "(" $ head $ splitOn ")" $ args!!0
  where args = splitOn " " line

toOil::String->Int
toOil line = read (args!!1)::Int
  where args = splitOn " " line

efficientDelivery::String->String
efficientDelivery line
  | fit == [] = show needed
  | otherwise = concat $ map showFit fit
  where
    oil = toOil line
    tankers = toTankers line
    fit = fitOil oil tankers []
    needed = oilNeeded oil tankers
    showFit xs = "["++(intercalate "," $ map show $ map snd xs ) ++"]"

test = hspec $ do
  describe "Efficient Delivery - " $ do 
    it "(197,8170), 155862" $ do   efficientDelivery "(197,8170), 155862" `shouldBe` "3"
    it "(138,316,531,875,913), 2990" $ do   efficientDelivery "(138,316,531,875,913), 2990" `shouldBe` "2"
    it "(396,428,569,886,971), 4351" $ do   efficientDelivery "(396,428,569,886,971), 4351" `shouldBe` "1"
    it "(173,239,258,300), 1951" $ do   efficientDelivery "(173,239,258,300), 1951" `shouldBe` "2"
    it "(2,5), 12" $ do   efficientDelivery "(2,5), 12" `shouldBe` "[1,2][6,0]"
    it "(218,349,712,896), 5017" $ do   efficientDelivery "(218,349,712,896), 5017" `shouldBe` "1"
    it "(366,380,560,896,913), 5104" $ do   efficientDelivery "(366,380,560,896,913), 5104" `shouldBe` "[0,4,0,4,0][1,0,2,2,2]"
    it "(2,4,8), 8" $ do   efficientDelivery "(2,4,8), 8" `shouldBe` "[0,0,1][0,2,0][2,1,0][4,0,0]"
    it "(93,539,619,643,652), 4635" $ do   efficientDelivery "(93,539,619,643,652), 4635" `shouldBe` "[4,2,2,1,2][16,1,0,0,4][20,4,1,0,0][29,0,0,2,1]"
    it "(35,118,619,955), 1225" $ do   efficientDelivery "(35,118,619,955), 1225" `shouldBe` "[35,0,0,0]"
    it "(84,376,469,632,925), 3316" $ do   efficientDelivery "(84,376,469,632,925), 3316" `shouldBe` "[11,3,0,2,0][23,2,0,1,0][35,1,0,0,0]"
    it "(102,160,188,297,543), 1629" $ do   efficientDelivery "(102,160,188,297,543), 1629" `shouldBe` "[0,0,0,0,3][2,0,6,1,0]"
    it "(34,798,852,903,936), 4606" $ do   efficientDelivery "(34,798,852,903,936), 4606" `shouldBe` "[10,3,0,0,2][40,3,1,0,0][61,2,0,0,1][112,1,0,0,0]"

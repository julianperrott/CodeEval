module CodeEval.BayBridges where

{- https://www.codeeval.com/open_challenges/109/

Bay Bridges

Challenge Description:

A new technological breakthrough has enabled us to build bridges that can withstand a 9.5 magnitude earthquake for a fraction of the cost. Instead of retrofitting existing bridges which would take decades and cost at least 3x the price we're drafting up a proposal rebuild all of the bay area's bridges more efficiently between strategic coordinates outlined below. 

You want to build the bridges as efficiently as possible and connect as many pairs of points as possible with bridges such that no two bridges cross. When connecting points, you can only connect point 1 with another point 1, point 2 with another point 2. 

At example given on the map we should connect all the points except points with number 4. 

Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 

1: ([37.788353, -122.387695], [37.829853, -122.294312])
2: ([37.429615, -122.087631], [37.487391, -122.018967])
3: ([37.474858, -122.131577], [37.529332, -122.056046])
4: ([37.532599,-122.218094], [37.615863,-122.097244])
5: ([37.516262,-122.198181], [37.653383,-122.151489])
6: ([37.504824,-122.181702], [37.633266,-122.121964])

Each input line represents a pair of coordinates for each possible bridge. 

Output sample:

You should output bridges in ascending order. 

1
2
3
5
6

-}

import Test.Hspec

import System.Environment (getArgs)
import Data.List.Split(splitOn)

toCoord::String->[Float]
toCoord line = map (\x->read x::Float) $ splitOn "," $ head $ splitOn "]" line

toBridge::String->[[Float]]
toBridge line = [toCoord (coords!!1), toCoord (coords!!2)]
  where
    args = splitOn ":" line
    coords = splitOn "[" (args!!1)

intersect::[[Float]]->[[Float]]->Bool
intersect [aa,bb] [cc,dd] = (ccw aa cc dd) /= (ccw bb cc dd) && (ccw aa bb cc) /= (ccw aa bb dd)
  where
    ccw::[Float]->[Float]->[Float]->Bool
    ccw a b c = ((c!!1) - (a!!1)) * ((b!!0) - (a!!0)) > ((b!!1) - (a!!1)) * ((c!!0) - (a!!0))

toBridges::[String]->[[[Float]]]
toBridges bridgeLines =  map toBridge bridgeLines 


toOverlaps::[[[Float]]]->[[Int]]
toOverlaps bridges = map overlapsForBridge [0..length bridges -1]
  where
    overlaps = getOverlaps $ zip bridges [0..]
    overlapsForBridge n = overlaps!!n ++ ( map head $ filter (\x-> head x /=n && length (filter (\y -> y==n) x) >0) overlaps)
    getOverlaps::[([[Float]],Int)]->[[Int]]
    getOverlaps [] = []
    getOverlaps (x:xs) = ( (snd x): (filter (\y -> y >= 0) $ map overlapIndex  xs)) : getOverlaps xs
      where
        overlapIndex y
          | intersect (fst x) (fst y) = snd y
          | otherwise = -1


getBridgeWithMostOverlaps::[[Int]]->Int
getBridgeWithMostOverlaps overlaps = fst $ foldl findMostOverlaps (-1,1) overlaps
  where
    findMostOverlaps::(Int,Int)->[Int]->(Int,Int)
    findMostOverlaps (bridgeWithMostOverlaps,mostOverlaps) bridgeOverlaps
      | length bridgeOverlaps > mostOverlaps = (head  bridgeOverlaps,length bridgeOverlaps)
      | otherwise = (bridgeWithMostOverlaps,mostOverlaps)
      

removeBridgeWithMostOverlaps::[[Int]]->Int->[[Int]]
removeBridgeWithMostOverlaps overlaps index = map removeIndex $ (take index overlaps) ++ [[]] ++ (drop (index+1) overlaps)
  where
    removeIndex::[Int]->[Int]
    removeIndex bridgeOverlaps = filter (\x-> x /=index) bridgeOverlaps


bayBridges::[String]->[String]
bayBridges bridgeLines = filterBridges $ toOverlaps $ toBridges bridgeLines
  where
    filterBridges::[[Int]]->[String]
    filterBridges overlaps
      | most == -1 = map (\x-> show $ (head x)+1) $ filter (\x-> length x > 0) overlaps
      | otherwise = filterBridges $ removeBridgeWithMostOverlaps overlaps most
      where
        most = getBridgeWithMostOverlaps overlaps

{-
main = getArgs >>= parse >>= putStr . process
parse [f] = readFile f
process s = unlines $ bayBridges $ lines s
-}

lines1 = ["1: ([37.475491, -122.382018], [37.808843, -122.058424])",
  "2: ([37.598550, -122.283910], [37.497912, -122.274641])",
  "3: ([37.634441, -122.254628], [37.762277, -122.292024])",
  "4: ([37.765089, -122.128227], [37.719315, -122.118835])",
  "5: ([37.517667, -122.261042], [37.650041, -122.246155])",
  "6: ([37.499734, -122.209789], [37.475781, -122.211818])",
  "7: ([37.513664, -122.221101], [37.451033, -122.154752])",
  "8: ([37.432438, -122.235186], [37.555993, -122.049470])",
  "9: ([37.740202, -122.206123], [37.439940, -122.026493])",
  "10: ([37.577342, -122.075553], [37.789367, -122.237747])",
  "11: ([37.686377, -122.083115], [37.563666, -122.062874])",
  "12: ([37.475551, -122.382847], [37.624867, -122.104703])",
  "13: ([37.671698, -122.092111], [37.490343, -122.351093])",
  "14: ([37.560247, -122.281976], [37.816397, -122.263955])",
  "15: ([37.742517, -122.322012], [37.575469, -122.307824])"]

test = hspec $ do
  describe "Package Problem - " $ do 
    it "toCoord" $ do   toCoord "37.742517, -122.322012]" `shouldBe` [37.742517, -122.322012]
    it "toBridge" $ do   toBridge "15: ([37.742517, -122.322012], [37.575469, -122.307824])" `shouldBe` [[37.742517, -122.322012], [37.575469, -122.307824]]
    it "toOverlaps" $ do (toOverlaps $ toBridges lines1) `shouldBe` [[0,1,3,4,8,9,11,13],[1,11,12,13,0],[2,13],[3,0],[4,11,12,0],[5],[6,7],[7,8,6],[8,11,12,0,7],[9,11,12,0],[10],[11,12,0,1,4,8,9],[12,1,4,8,9,11],[13,0,1,2],[14]]
    it "getBridgeWithMostOverlaps" $ do (getBridgeWithMostOverlaps $ toOverlaps $ toBridges lines1) `shouldBe` 0
    it "removeBridgeWithMostOverlaps 0" $ do  (removeBridgeWithMostOverlaps (toOverlaps $ toBridges lines1) 0 ) `shouldBe` [[],[1,11,12,13],[2,13],[3],[4,11,12],[5],[6,7],[7,8,6],[8,11,12,7],[9,11,12],[10],[11,12,1,4,8,9],[12,1,4,8,9,11],[13,1,2],[14]]
    it "removeBridgeWithMostOverlaps 1" $ do  (removeBridgeWithMostOverlaps (toOverlaps $ toBridges lines1) 1 ) `shouldBe` [[0,3,4,8,9,11,13],[],[2,13],[3,0],[4,11,12,0],[5],[6,7],[7,8,6],[8,11,12,0,7],[9,11,12,0],[10],[11,12,0,4,8,9],[12,4,8,9,11],[13,0,2],[14]]
    it "bayBridges" $ do bayBridges lines1 `shouldBe` ["2","3","4","5","6","7","9","10","11","15"]
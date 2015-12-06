module CodeEval.CommutingEngineer where

{- https://www.codeeval.com/open_challenges/90/

Challenge Description:

Commuters in the bay area who commute to and from South Bay spend on average 2-3 hours of valuable time getting to and from work every day. That's why startups like Mashery, Flurry, New Relic and Glassdoor have called the San Francisco Peninsula their home. 

Today, we're visiting some of area's fastest growing startups and would like to find the shortest possible distance to visit each company once starting from the CodeEval offices at 1355 Market Street. 

Solving the following challenge means finding the shortest possible route which visits each coordinate once starting from the point 1. You may read more about the Travelling salesman problem 

On the map you can see the best route for 6 coordinates. But we've added 4 more for the offices of Mashery, Flurry, New Relic and Glassdoor. So you need to find the best route for 10 coordinates. 

Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 

1 | CodeEval 1355 Market St, SF (37.7768016, -122.4169151)
2 | Yelp 706 Mission St, SF (37.7860105, -122.4025377)
3 | Square 110 5th St, SF (37.7821494, -122.4058960)
4 | Airbnb 99 Rhode Island St, SF (37.7689269, -122.4029053)
5 | Dropbox 185 Berry St, SF (37.7768800, -122.3911496)
6 | Zynga 699 8th St, SF (37.7706628, -122.4040139)

The following locations will also be present in the input file: 
 7 | Mashery 717 Market St, SF (37.7870361, -122.4039444) 
 8 | Flurry 3060 3rd St, SF (37.7507903, -122.3877184) 
 9 | New Relic 188 Spear St, SF (37.7914417, -122.3927229) 
 10 | Glassdoor 1 Harbor Drive, Sausalito (37.8672841, -122.5010216)  

Output sample:

It must start from position 1 

1
3
2
5
6
4

(Check points on the map) 

If you're able to solve this challenge and interested in Mashey, Flurry, New Relic or Glassdoor, you'll be able to apply directly after submitting your solution. Let's see if it cuts down your work commute! 

-}

import Test.Hspec

import System.Environment
import Data.List (sortBy)
import Data.List.Split (splitOn)

data Location = Location { locId:: Int, locX :: Float,locY:: Float } deriving (Show, Eq)
data Distance = Distance { distId:: Int, distance:: [Int] } deriving (Show, Eq)

toLocation::String->Location
toLocation line =  Location { locId = loc ,locX = x , locY = y }
  where
    args = splitOn "|" line
    loc = read (args!!0)::Int
    argsXY = splitOn "," $ last $ splitOn "(" $ head $ splitOn ")" (args!!1)
    x = read (argsXY!!0)::Float
    y = read (argsXY!!1)::Float

calcDistances::[Location]->Location->Distance
calcDistances locations l = Distance { distId = locId l , distance = distances}
  where
    calcDistance::Location->Int
    calcDistance l2 = (\x-> floor (x*1000000) ) $ sqrt $ ((locX l - locX l2)^2) + ((locY l - locY l2)^2)
    distances = map calcDistance locations

toLocations::[String]->[Distance]
toLocations input = map calcDistancesTo locations
  where
    locations = map toLocation input
    calcDistancesTo l = calcDistances locations l

bruteForce::[Distance]->(Int,[Int])->[Int]->[(Int,[Int])]
bruteForce locs path remainder
  | remainder == [] = [path]
  | otherwise = concat $ map getPaths [0..length remainder -1]
  where
    lastLoc = locs!!(last (snd path))
    distanceTo n = (distance lastLoc)!!n
    getPaths ix = bruteForce locs (newDistance,newPath) newRemainder
      where
        n = remainder!!ix
        newPath = (snd path)++[n]
        newRemainder = take ix remainder ++ drop (ix+1) remainder
        newDistance = (fst path) + (distanceTo n)

sortByFst a b
  | fst a < fst b = LT
  | fst a > fst b = GT
  | otherwise = EQ


nearestNeighbour::[Distance]->[Int]
nearestNeighbour locs = nn locs [0] [1..length locs -1]
  where
    nn::[Distance]->[Int]->[Int]->[Int]
    nn locs path remainder
      | remainder == [] = path
      | otherwise = nn locs newPath newRemainder
      where
        lastDistance = distance $ locs!!(last path)
        nearest = snd $ head $ sortBy sortByFst $ map (\x-> (lastDistance!!x,x)) remainder
        newPath = path ++ [nearest]
        newRemainder = filter (\x-> x/= nearest ) remainder

score::[Distance]->[Int]->[Int]->Int
score locs path order =  sum $ map getDist [0..2]
  where
    dist p = distance $ locs!!p
    distP1P2 p1 p2 = (dist p1)!!p2
    getDist p = distP1P2 (path!!(order!!p)) (path!!(order!!(p+1)))

tour::[Distance]->[Int]->Int->[Int]
tour locs path position
  | position == length path - 3 = path 
  | currentScore <= newScore = tour locs path (position+1)
  | otherwise = tour locs newPath (position+1)
  where
    scorePath = drop position path 
    currentScore = score locs scorePath [0,1,2,3]
    newScore = score locs scorePath [0,2,1,3]
    newPath = take (position+1) path++[path!!(position+2)] ++[path!!(position+1)] ++ drop (position+3) path

tourImprovement::[Distance]->[Int]->[Int]
tourImprovement locs path
  | path == tourPath = path
  | otherwise = tourImprovement locs tourPath
  where
    tourPath = tour locs path 0

-- Nearest neighbour and tour improvement won't always find the best path
commute::[String]->[String]
commute input = map (\x-> show (x+1)) $ tourImprovement locs nn
  where
    locs = toLocations input
    nn = nearestNeighbour locs

input = ["1  | Random Point 1 (37.716665, -122.381429)",
  "2 | Random Point 2 (37.739252, -122.418691)",
  "3 | Random Point 3 (37.766846, -122.430878)",
  "4 | Random Point 4 (37.743421, -122.406205)",
  "5 | Random Point 5 (37.766175, -122.433245)",
  "6 | Random Point 6 (37.769608, -122.429287)",
  "7 | Random Point 7 (37.679394, -122.493100)",
  "8 | Random Point 8 (37.708375, -122.402101)",
  "9 | Random Point 9 (37.708650, -122.395450)",
  "10 | Random Point 10 (37.725630, -122.520120)"]
test = hspec $ do
  describe "parse - " $ do 
    it "toLocation" $ do toLocation (input!!1) `shouldBe` Location { locId = 2, locX = 37.739252,locY = -122.418691 }
    it "toLocations 1" $ do (toLocations input)!!0 `shouldBe` Distance {distId = 1, distance = [0,43573,70449,36463,71664,71369,117726,22268,16144,138976]}
    it "toLocations 2" $ do (toLocations input)!!1 `shouldBe` Distance {distId = 2, distance = [43573,0,30165,13166,30603,32153,95496,35052,38429,102335]}
  describe "compute - " $ do
       it "nearestNeighbour" $ do nearestNeighbour (toLocations input) `shouldBe` [0,8,7,1,3,2,4,5,9,6]
       it "tour" $ do tour (toLocations input) [0,8,7,1,3,2,4,5,9,6] 0 `shouldBe` [0,8,7,3,1,4,2,5,9,6]
       it "commute" $ do commute input `shouldBe` ["1","9","8","4","2","5","3","6","10","7"]

module CodeEval.LakesNotCakes where

{- https://www.codeeval.com/open_challenges/213/

Lakes, not cakes

Challenge Description:

It was a dark and stormy night when Alice was wandering in the black forest. The rain fell in torrents into deep lakes scattered all over the area… Wait! Lakes… forest…? Really? Well, yeah, it’s not a true horror story, but it is fits our challenge perfectly. So, you have a map of the forest. You are sure there are some lakes in there, but you do not know their number. 
 Write a program that will count how many lakes are in the forest. We count all adjacent o symbols as one lake (by adjacent we mean symbols that are located one cell up, down, left, right, or diagonally from the needed symbol). 

Input sample:

The first argument is a path to a file. Each line includes a test case, which contains a map of the forest of different size. Forest areas are separated by a vertical bar |. 
# - forest 
o - lake 

For example: 

o # o | # # # | o # o
o # o | # o # | o # o

Output sample:

Print the number of lakes for each test case. 

For example: 

4
1

Constraints:
1.A forest may be of different width and height from 3 to 30 symbols.
2.Diagonal symbols are also counted as adjacent.
3.The number of test cases is 40.

-}
import Test.Hspec
import Data.List
import Data.List.Split

toCoord::String->[[Int]]
toCoord lakemap = map (\x-> [fst (snd x),snd (snd x), fst x]) $ zip [0..] $ concat $ map (\row-> cols row) $ zip [0..] $ splitOn "| " lakemap
  where
    cols row = map (\x-> (fst row, fst x) )$ filter (\x ->snd x == "o") $ zip [0..] $ splitOn " " (snd row)

getAdjacentLakeIndexes::[[Int]]->Int->[Int]
getAdjacentLakeIndexes lakes index = adjacentOnCurrentRow++prevRowAdjacent
  where
    row item = item!!0
    col item = item!!1
    ix item =  item!!2
    prevItem = lakes!!(index-1)
    current = lakes!!index
    adjacentOnCurrentRow
      | index == 0 = []
      | row current== row prevItem && (col current)-1 == col prevItem = [index-1]
      | otherwise = []
    isPreviousRowAdjacent item = row item == (row current)-1  && elem (col item) [(col current)-1,col current,(col current)+1]
    prevRowAdjacent = map ix $ filter isPreviousRowAdjacent $ take index lakes

parseLakes::[[Int]]->Int->[Int]->Int
parseLakes lakes index lakeGroups
  | index == length lakes = uniqueLakes -- finished
  | length adjacentLakeGroups == 0 = parseLakes lakes (index+1) (lakeGroups++[length lakeGroups]) -- new group found
  | otherwise = parseLakes lakes (index+1) (replaceLakeGroups++[adjacentLakeGroups!!0])
  where
    adjacentLakeGroups = sort $ map (\i->lakeGroups!!i) $ getAdjacentLakeIndexes lakes index
    replaceLakeGroups =  foldl (\acc x-> map (\y-> if y==x then adjacentLakeGroups!!0 else y ) acc) lakeGroups (drop 1 adjacentLakeGroups)
    uniqueLakes = length $ nub lakeGroups

countLakes::String->Int
countLakes map = parseLakes (toCoord map) 0 []

map2 = [[0,0,0],[0,1,1],[0,2,2], [1,1,3], [2,0,4],[2,2,5]]
map3 = [[0,0,0],[0,2,1],[1,0,2],[1,2,3],[2,0,4],[2,1,5],[2,2,6]]

test = hspec $ do
  describe "toCoord" $ do
    it "t1" $ do toCoord "o # o | # # # | o # o" `shouldBe` [[0,0,0],[0,2,1],[2,0,2],[2,2,3]]
    it "t2" $ do toCoord "o o o | # o # | o # o" `shouldBe` [[0,0,0],[0,1,1],[0,2,2],[1,1,3],[2,0,4],[2,2,5]]
    it "t3" $ do toCoord "o # o | o # o | o o o" `shouldBe` [[0,0,0],[0,2,1],[1,0,2],[1,2,3],[2,0,4],[2,1,5],[2,2,6]]
  describe "adjacent" $ do
    it "a0" $ do getAdjacentLakeIndexes map2 0 `shouldBe` []
    it "a1" $ do getAdjacentLakeIndexes map2 1 `shouldBe` [0]
    it "a2" $ do getAdjacentLakeIndexes map2 2 `shouldBe` [1]
    it "a3" $ do getAdjacentLakeIndexes map2 3 `shouldBe` [0,1,2]
    it "a4" $ do getAdjacentLakeIndexes map2 4 `shouldBe` [3]
    it "a5" $ do getAdjacentLakeIndexes map2 5 `shouldBe` [3]
  describe "countLakes" $ do
    it "3x3 1" $ do countLakes "o # o | # # # | o # o" `shouldBe` 4
    it "3x3 2" $ do countLakes "o # o | # o # | o # o" `shouldBe` 1
    it "3x3 3" $ do countLakes "o # o | o # o | o o o" `shouldBe` 1
    it "3x3 4" $ do countLakes "o # o | o # o | # o #" `shouldBe` 1
    it "3x3 5" $ do countLakes "# o # | o # o | # o #" `shouldBe` 1
    it "4x4 1" $ do countLakes "# o # o | o # # o | # o # # | # o # # |" `shouldBe` 2
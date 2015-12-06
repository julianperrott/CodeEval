module CodeEval.MinimumPathSum where


{-  https://www.codeeval.com/open_challenges/72/
Minimum Path Sum

Challenge Description:

You are given an n*n matrix of integers. You can move only right and down. Calculate the minimal path sum from the top left to the bottom right 

Input sample:

Your program should accept as its first argument a path to a filename. The first line will have the value of n(the size of the square matrix). This will be followed by n rows of the matrix. (Integers in these rows will be comma delimited). After the n rows, the pattern repeats. E.g. 
2
4,6
2,8
3
1,2,3
4,5,6
7,8,9

Output sample:

Print out the minimum path sum for each matrix. E.g. 
14
21

-}
import Test.Hspec
import Data.List.Split

calculate::[[Int]]->[[Int]]->Int
calculate grid a
  | length grid == length a = last $ last a
  | otherwise = calculate grid (a++[newARow])
  where
    gridRow = grid!!(length a);
    aPrevRow = last a
    rowFirstSum = aPrevRow!!0 + gridRow!!0
    calcMin acc col = acc ++ [min v1 v2]
      where
        v1 = (last acc) + gridRow!!col
        v2 = aPrevRow!!col + gridRow!!col
    newARow = foldl calcMin [rowFirstSum] [1..length (a!!0)-1]

minPathSum::[[Int]]->Int
minPathSum grid
  | length grid == 0 = 0
  | otherwise = calculate grid [row0]
  where
    gridRow = head grid
    row0 = foldl (\acc x->acc++[x+(last acc)]) [head gridRow] (tail gridRow)

toGrids::[String]->[[[Int]]]
toGrids lines 
   | length lines == 0 = []
   | otherwise = [glines] ++ toGrids (drop (len+1) lines)
   where
     len = (\x->read x::Int) $ head lines
     toNums s = map (\x-> read x::Int) $ splitOn "," s
     glines = map toNums $ take len $ drop 1 lines

processLines::[String]->[String]
processLines lines = map show $ map minPathSum $ toGrids lines

lines1 =  ["4","84, 368, 211, 443","205, 150, 157, 107","72, 178, 15, 404","278, 136, 284, 301","3","2, 484, 255","238, 56, 478","483, 396, 326"]
lines2 = ["2","4,6","2,8","3","1,2,3","4,5,6","7,8,9"]

test = hspec $ do
  describe "toCoord" $ do
    it "2x2" $ do minPathSum [[4, 6], [2, 8]] `shouldBe` 14
    it "3x3" $ do minPathSum [[1, 2, 3], [4, 5, 6], [7, 8, 9]] `shouldBe` 21

  describe "toGrids" $ do
    it "2 grids" $ do toGrids lines1 `shouldBe` [[[84, 368, 211, 443], [205, 150, 157, 107], [72, 178, 15, 404], [278, 136, 284, 301]], [[2, 484, 255], [238, 56, 478], [483, 396, 326]]]

  describe "minPathSum" $ do
    it "2 grids" $ do processLines lines2 `shouldBe` ["14","21"]
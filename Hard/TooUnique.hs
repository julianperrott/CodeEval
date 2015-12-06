module CodeEval.TooUnique where

{- https://www.codeeval.com/open_challenges/162/

Too unique

Challenge Description:

You are given a matrix of size N×M elements, filled with lowercase ASCII letters from ‘a’ to ‘z’. Find the max size of rectangular contiguous submatrix of unique (i.e. non repeated within a given submatrix) elements. Find all submatrices of unique elements of this size and replace their elements with asterisks ‘*’. 

Input sample:

The first argument is a file that contains the input matrix. E.g. 
rzqicaiiaege
ccwnulljybtu
jxtxupauwuah
oqikzgqrzpdq
vblalwdjbdwn
ahjeencuclbo

Output sample:

Print to stdout the result of the matrix with replaced elements, where all elements of the biggest submatrixes of unique elements are replaced with asterisks ‘*’. E.g. 
rzqicaiiae**
ccwnulljyb**
jxtx***uwu**
oqik****zp**
vbla****bd**
ahje****cl**

Constraints:
1.The size of matrix in the input is 60×20 elements.

-}

import Test.Hspec
import Data.List

data Score = Score { sX :: Int, sY :: Int, sWidth :: Int, wDepth :: Int , sScore :: Int } deriving (Show)

isUnique::[String]->Int->Int->Int->Int->Bool
isUnique grid col row width depth
  | col + width > length (head grid) = False
  | row + depth > length grid = False
  | otherwise = length chars == length (nub chars)
  where
    chars = concat $ map (\x-> take width $ drop col x) $ map fst $ filter (\x-> (snd x) >=row && (snd x)< row+depth ) $ zip grid [0..]

scoreHorizontally::[String]->Int->Int->Int->Int->Int
scoreHorizontally grid x y size maxScore = head $ filter (\score -> isUnique grid x y score size ) $ reverse [size..maxScore]

scoreVertically::[String]->Int->Int->Int->Int->Int
scoreVertically grid x y size maxScore = head $ filter (\score -> isUnique grid x y size score ) $ reverse [size..maxScore]

submitScores::[Score]->[Score]->[Score]
submitScores newScores bestScores
  | length bestScores == 0 = newScores
  | length newScores == 0 = bestScores
  | sScore (bestScores!!0) > sScore (newScores!!0) = bestScores
  | sScore (bestScores!!0) < sScore (newScores!!0) = newScores
  | otherwise = bestScores ++ newScores

score::[String]->Int->Int->Int->Int->Int->[Score]->[Score]
score grid x y size maxWidth maxDepth xyScores
  | not canGrow = xyScores
  | otherwise = score grid x y sizeP1 maxWidth maxDepth (submitScores [verticalScore] $ submitScores [horizontalScore] $ submitScores [sizeScore] xyScores)
  where
    sizeP1 = size+1
    canGrow = isUnique grid x y sizeP1 sizeP1
    newMaxWidth = scoreHorizontally grid x y sizeP1 maxWidth
    newMaxDepth = scoreVertically grid x y sizeP1 maxDepth
    makeScore w d = Score x y w d (w*d)
    sizeScore = makeScore sizeP1 sizeP1
    horizontalScore = makeScore newMaxWidth sizeP1
    verticalScore = makeScore sizeP1 newMaxDepth

search::[String]->[Score]
search grid = foldl searchAtCoordinate [] [0..(gridHeight * gridWidth)-1]
  where
    gridWidth = length (grid!!0)
    gridHeight = length grid
    searchAtCoordinate bestScores pos = submitScores scoreAtXY bestScores
      where
        scoreAtXY = score grid x y 0 (gridWidth-x) (gridHeight-y) []
        dm = divMod pos gridWidth
        x = snd dm
        y = fst dm

markRow::(String,Int)->Score->String
markRow row score
  | rowNum < y = text
  | rowNum >= y + depth = text
  | otherwise = take x text ++ replicate width '*' ++ drop (x+width) text
  where
    width = sWidth score
    depth = wDepth score
    x = sX score
    y = sY score
    rowNum = snd row
    text = fst row

markGrid::[String]->[Score]->[String]
markGrid grid scores = foldl mark grid scores
  where
    mark grd score = map (\row->markRow row score) $ zip grd [0..]

tooUnique::[String]->[String]
tooUnique grid = markGrid grid (search grid)

grid = [
    "rzqicaiiaege",
    "ccwnulljybtu",
    "jxtxupauwuah",
    "oqikzgqrzpdq",
    "vblalwdjbdwn",
    "vhjeencuclbo"];

grid1 = [
  "rzqicaiiaege",
  "ccwnulljybtu",
  "jxtxupauwuah",
  "oqikzgqrzpdq",
  "vblalwdjbdwn",
  "ahjeencuclbo"];

result = tooUnique grid1

test = hspec $ do
  describe "isUnique" $ do
    it "height 1 is unique" $ do  isUnique grid  0  0  6  1 `shouldBe` True
    it "height 1 is not unique" $ do  isUnique grid  0  0  8  1 `shouldBe` False

    it "width 1 is unique" $ do  isUnique grid  0  0  1  5 `shouldBe` True
    it "width 1 is not unique" $ do  isUnique grid  0  0  1  6 `shouldBe` False

    it "2x2 is unique" $ do  isUnique grid  1  0  2  2 `shouldBe` True
    it "2x2 not unique" $ do  isUnique grid  0  0  2  2 `shouldBe` False

  describe "tooUnique" $ do
    it "line 0" $ do  result!!0 `shouldBe` "rzqicaiiae**"
    it "line 1" $ do  result!!1 `shouldBe` "ccwnulljyb**"
    it "line 2" $ do  result!!2 `shouldBe` "jxtx***uwu**"
    it "line 3" $ do  result!!3 `shouldBe` "oqik****zp**"
    it "line 4" $ do  result!!4 `shouldBe` "vbla****bd**"
    it "line 5" $ do  result!!5 `shouldBe` "ahje****cl**"

  describe "score" $ do
    it "scoreHorizontally 0" $ do scoreHorizontally grid 0 0 1 10 `shouldBe` 6
    it "scoreVertically 0" $ do scoreVertically grid 0 0 1 10 `shouldBe` 5

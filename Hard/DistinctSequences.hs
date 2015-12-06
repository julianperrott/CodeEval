module CodeEval.DistinctSequences where
import Test.Hspec
import Data.List.Split

{- https://www.codeeval.com/open_challenges/69/

DISTINCT SUBSEQUENCES
CHALLENGE DESCRIPTION:

A subsequence of a given sequence S consists of S with zero or more elements deleted. Formally, a sequence Z = z1z2..zk is a subsequence of X = x1x2...xm, if there exists a strictly increasing sequence of indicies of X 
such that for all j=1,2,...k we have Xij = Zj. E.g. Z=bcdb is a subsequence of X=abcbdab with corresponding index sequence <2,3,5,7>

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file contains two comma separated strings. The first is the sequence X and the second is the subsequence Z. E.g.

babgbag,bag
rabbbit,rabbit

OUTPUT SAMPLE:

Print out the number of distinct occurrences of Z in X as a subsequence E.g.

5
3
-}


sequenceCount :: String -> String
sequenceCount line = show $ length $ subsequences (params!!0) (params!!1)
    where params = splitOn [','] line

subsequences :: String -> String -> [[Int]]
subsequences sequence sub = seq 0 []
  where
    seq position path = found ++ notFound
      where
        newPath = path++[position]
        charsToFind = length sub - length path
        foundAtPosition
            | charsToFind == 1 = [newPath]
            | otherwise = seq (position+1) newPath
        found
            | sequence!!position == sub!!(length path) = foundAtPosition
            | otherwise = []
        notFound 
            | charsToFind < length sequence - position = seq (position+1) path
            | otherwise = []

test = hspec $ do
  describe "various" $ do
    it "bag" $ do sequenceCount "babgbag,bag" `shouldBe` "5"
    it "rabbit" $ do sequenceCount "rabbbit,rabbit" `shouldBe` "3"

{- https://www.codeeval.com/open_challenges/47/
PALINDROMIC RANGES
CHALLENGE DESCRIPTION:

A positive integer is a palindrome if its decimal representation (without leading zeros) is a palindromic string (a string that reads the same forwards and backwards). For example, the numbers 5, 77, 363, 4884, 11111, 12121 and 349943 are palindromes. 

A range of integers is interesting if it contains an even number of palindromes. The range [L, R], with L <= R, is defined as the sequence of integers from L to R (inclusive): (L, L+1, L+2, ..., R-1, R). L and R are the range's first and last numbers. 

The range [L1,R1] is a subrange of [L,R] if L <= L1 <= R1 <= R. Your job is to determine how many interesting subranges of [L,R] there are.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. Each line in this file is one test case. Each test case will contain two positive integers, L and R (in that order), separated by a space. eg. 
1 2
1 7
87 88
OUTPUT SAMPLE:

For each line of input, print out the number of interesting subranges of [L,R] eg. 
1
12
1
For the curious: In the third example, the subranges are: [87](0 palindromes), [87,88](1 palindrome),[88](1 palindrome). Hence the number of interesting palindromic ranges is 1

(0 ranges == even)
-}
module CodeEval.PalindromeRange where
import Test.Hspec
import Data.List
import Data.List.Split
import Data.Char

isPalindrome::Int->Int
isPalindrome v
  | reverseInt v == v = 1
  | otherwise = 0
  where
    reverseInt :: Int -> Int
    reverseInt n = aux n 0
    aux 0 y = y
    aux x y = let (x',y') = x `quotRem` 10
      in aux x' (10*y+y')

palindromeRange:: String -> Int
palindromeRange line = sum $ map (\i ->sum $ map (\j -> countEvenPals i j ) [i..r]) [l..r]
  where
    args = map (\x -> read x::Int) $ splitOn " " line
    l = args!!0
    r = args!!1
    countPals i j = sum $ map isPalindrome [i..j]
    countEvenPals i j
        | (countPals i j) `mod` 2 == 0 = 1
        | otherwise = 0


test = hspec $ do
  describe "PalindromeRange" $ do
    it "s1" $ do palindromeRange "1 7" `shouldBe` 12
    it "s2" $ do palindromeRange "207 228" `shouldBe` 123
    it "s3" $ do palindromeRange "141 158" `shouldBe` 81
    it "s4" $ do palindromeRange "242 265" `shouldBe` 146
    it "s5" $ do palindromeRange "262 280" `shouldBe` 90
    it "s6" $ do palindromeRange "87 93" `shouldBe` 16
    it "s7" $ do palindromeRange "1 2" `shouldBe` 1
    it "s8" $ do palindromeRange "229 246" `shouldBe` 81
    it "s9" $ do palindromeRange "270 294" `shouldBe` 156
    it "s10" $ do palindromeRange "163 182" `shouldBe` 100
    it "s11" $ do palindromeRange "167 183" `shouldBe` 73
    it "s12" $ do palindromeRange "51 63" `shouldBe` 46
    it "s13" $ do palindromeRange "73 92" `shouldBe` 100
    it "s14" $ do palindromeRange "15 36" `shouldBe` 121
    it "s15" $ do palindromeRange "178 196" `shouldBe` 90
    it "s16" $ do palindromeRange "166 180" `shouldBe` 60
    it "s17" $ do palindromeRange "90 97" `shouldBe` 36
    it "s18" $ do palindromeRange "90 99" `shouldBe` 45
    it "s19" $ do palindromeRange "113 134" `shouldBe` 123
    it "s20" $ do palindromeRange "68 78" `shouldBe` 46
{- https://www.codeeval.com/open_challenges/61/

Decryption

Challenge Description:

For this challenge you are given an encrypted message and a key. You have to determine the encryption and encoding technique and then print out the corresponding plaintext message. You can assume that the plaintext corresponding to this message, and all messages you must handle, will be comprised of only the characters A-Z and spaces; no digits or punctuation. 

Input sample:

There is no input for this program. The encrypted message and key is: 
message: "012222 1114142503 0313012513 03141418192102 0113 2419182119021713 06131715070119",
keyed_alphabet: "BHISOECRTMGWYVALUZDNFJKPQX"

Output sample:

Print out the plaintext message. (in CAPS)

-}
module CodeEval.Decryption where

import Test.Hspec
import Data.List
import Data.List.Split
import Data.Maybe

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
message = "012222 1114142503 0313012513 03141418192102 0113 2419182119021713 06131715070119"
key = "BHISOECRTMGWYVALUZDNFJKPQX"

decrypt :: String
decrypt = intercalate " " $ map process $ splitOn " " message
  where
    process s
      | s == [] = []
      | otherwise = [alphabet!!(fromJust $ elemIndex (alphabet !!(read (take 2 s)::Int)) key)] ++ process (drop 2 s)


test = hspec $ do
  describe "Decryption" $ do
     it "1" $ do decrypt `shouldBe` "ALL PEERS START SEEDING AT MIDNIGHT KTHXBAI"
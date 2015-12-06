{- https://www.codeeval.com/open_challenges/155/

ASCII DECRYPTION
CHALLENGE DESCRIPTION:


You are an analyst at the Central Intelligence Agency, and you have intercepted a top secret encrypted message which contains numbers. Each number is obtained by taking an ASCII code of the original character and adding some unknown constant N.

For example, you can encrypt the word 'test' with the condition that N = 11.

'test' to ASCII -> 116 101 115 116 -> add N to each number-> 127 112 126 127

Based on previous intelligence reports, you know that the original message includes two identical words consisting of X characters and you know the last letter in the word.

Your challenge is to decrypt the message.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename.

Each line of input consists of three parts: length of a word, which is repeated twice, the last letter of this word, and an encrypted message separated with space:

5 | s | 92 112 109 40 118 109 109 108 123 40 119 110 40 124 112 109 40 
117 105 118 129 40 119 125 124 127 109 113 111 112 40 124 112 109 40 118 
109 109 108 123 40 119 110 40 124 112 109 40 110 109 127 54 40 53 40 91 
120 119 107 115
OUTPUT SAMPLE:

For each line of input print out decrypted message:

The needs of the many outweigh the needs of the few. - Spock

-}
module CodeEval.AsciiDecryption where
import Test.Hspec

import Data.List.Split
import Data.Char

asciiDecryption::String->String
asciiDecryption msg = map chr $ map (\x->x+32-(minimum nums)) $ nums
  where
    args = splitOn "|" msg
    nums = map (\x->read x::Int) $ splitOn " " $ tail (args!!2)

a1 = "5 | s | 92 112 109 40 118 109 109 108 123 40 119 110 40 124 112 109 40 117 105 118 129 40 119 125 124 127 109 113 111 112 40 124 112 109 40 118 109 109 108 123 40 119 110 40 124 112 109 40 110 109 127 54 40 53 40 91 120 119 107 115"
a2 = "5 | s | 89 109 106 37 115 106 106 105 120 37 116 107 37 121 109 106 37 114 102 115 126 37 116 122 121 124 106 110 108 109 37 121 109 106 37 115 106 106 105 120 37 116 107 37 121 109 106 37 107 106 124 51 37 50 37 88 117 116 104 112"
a3 = "3 | d | 77 120 36 109 119 36 105 101 119 125 36 120 115 36 119 109 120 36 121 116 36 101 114 104 36 120 101 111 105 36 114 115 120 109 103 105 48 36 91 108 101 120 36 109 119 36 104 109 106 106 109 103 121 112 120 36 109 119 36 107 105 120 120 109 114 107 36 121 116 36 101 114 104 36 120 101 111 109 114 107 36 101 103 120 109 115 114 50 36 49 36 76 115 114 115 118 105 36 104 105 36 70 101 112 126 101 103"

test = hspec $ do
    describe "asciiDecryption" $ do
        it "a1" $ do asciiDecryption a1 `shouldBe` "The needs of the many outweigh the needs of the few. - Spock"
        it "a2" $ do asciiDecryption a2 `shouldBe` "The needs of the many outweigh the needs of the few. - Spock"
        it "a3" $ do asciiDecryption a3 `shouldBe` "It is easy to sit up and take notice, What is difficult is getting up and taking action. - Honore de Balzac"



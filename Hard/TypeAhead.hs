module CodeEval.TypeAhead where

{-  https://www.codeeval.com/open_challenges/155/

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

import Test.Hspec

import System.Environment (getArgs)
import Data.List (intercalate,sortBy,sort,group)
import Data.List.Split (splitOn,splitOneOf)
import Text.Printf (printf)


text = "Mary had a little lamb its fleece was white as snow;And everywhere that Mary went, the lamb was sure to go.It followed her to school one day, which was against the rule;It made the children laugh and play, to see a lamb at school.And so the teacher turned it out, but still it lingered near,And waited patiently about till Mary did appear.\"Why does the lamb love Mary so?\" the eager children cry; \"Why, Mary loves the lamb, you know\" the teacher did reply.\""
wordss = filter (\x-> length x >0) $ splitOneOf "? ;,.\"" text

{-
main = getArgs >>= parse >>= putStr . process
parse [f] = readFile f
process s = unlines $ typeAhead $ lines s
-}

wordsMatch::[String]->[String]->Bool
wordsMatch [] _ = True
wordsMatch _ [] = False
wordsMatch (x:xs) (y:ys)
  | x /= y = False
  | otherwise = wordsMatch xs ys

sortCntThenWord a b
  | snd a > snd b = LT
  | snd a < snd b = GT
  | fst a < fst b = LT
  | otherwise = GT

nGramLastWord::[String]->[String]->[String]
nGramLastWord [] _ = []
nGramLastWord xs userText
  | length xs == length userText = []
  | wordsMatch userText xs = (xs!!(length userText)): (nGramLastWord (tail xs) userText)
  | otherwise = nGramLastWord (tail xs) userText

typeAhead::String->String
typeAhead line = intercalate ";" $ map (\x-> (fst x)++","++(toPrediction(snd x))) groupedNGram
  where
    args = splitOn "," line
    userText = splitOn " " (args!!1)
    nGramLastWords = sort $ nGramLastWord wordss userText
    nGramLength = (fromIntegral (length nGramLastWords))::Float
    groupedNGram =  sortBy sortCntThenWord $ map (\x-> (head x, length x)) $ group $ nGramLastWords
    toPrediction::Int->String
    toPrediction cnt = printf "%.3f" ((fromIntegral cnt) / nGramLength) :: String


test = hspec $ do
  describe "Type Ahead - " $ do 
    it "1" $ do   typeAhead "2,the" `shouldBe` "lamb,0.375;teacher,0.250;children,0.125;eager,0.125;rule,0.125"
    it "2" $ do   typeAhead "4,her to school" `shouldBe` "one,1.000"
    it "3" $ do   typeAhead "2,so" `shouldBe` "the,1.000"
    it "4" $ do   typeAhead "4,its fleece was" `shouldBe` "white,1.000"
    it "5" $ do   typeAhead "2,day" `shouldBe` "which,1.000"
    it "6" $ do   typeAhead "3,the lamb" `shouldBe` "love,0.333;was,0.333;you,0.333"
    it "7" $ do   typeAhead "4,Why Mary loves" `shouldBe` "the,1.000"
    it "8" $ do   typeAhead "4,her to school" `shouldBe` "one,1.000"
    it "9" $ do   typeAhead "2,till" `shouldBe` "Mary,1.000"
    it "10" $ do   typeAhead "3,snow And" `shouldBe` "everywhere,1.000"
    it "11" $ do   typeAhead "3,sure to" `shouldBe` "go,1.000"
    it "12" $ do   typeAhead "2,sure" `shouldBe` "to,1.000"
    it "13" $ do   typeAhead "3,did appear" `shouldBe` "Why,1.000"
    it "14" $ do   typeAhead "2,appear" `shouldBe` "Why,1.000"
    it "15" $ do   typeAhead "4,know the teacher" `shouldBe` "did,1.000"

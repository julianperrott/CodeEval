{- https://www.codeeval.com/open_challenges/110/

Text to Number

Challenge Description:

You have a sting which contains a number represented as English text. Your task is to translate these numbers into their integer representation. The numbers can range from negative 999,999,999 to positive 999,999,999. The following is an exhaustive list of English words that your program must account for: 
negative,
zero, one, two, three, four, five, six, seven, eight, nine,
ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen,
twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety,
hundred,
thousand,
million


Input sample:

Your program should accept as its first argument a path to a filename. Input example is the following 
fifteen
negative six hundred thirty eight
zero
two million one hundred seven

- Negative numbers will be preceded by the word negative. 
- The word "hundred" is not used when "thousand" could be. E.g. 1500 is written "one thousand five hundred", not "fifteen hundred". 

Output sample:

Print results in the following way. 
15
-638
0
2000107

-}

module CodeEval.TextToNumber where
import Test.Hspec

import Data.Maybe
import Data.List
import Data.List.Split

numWords = [("zero",0),("one",1),("two",2),("three",3),("four",4),("five",5),("six",6),("seven",7),("eight",8),("nine",9),("ten",10),("eleven",11),("twelve",12),("thirteen",13),("fourteen",14),("fifteen",15),("sixteen",16),("seventeen",17),("eighteen",18),("nineteen",19),("twenty",20),("thirty",30),("forty",40),("fifty",50),("sixty",60),("seventy",70),("eighty",80),("ninety",90)]
multipliers = [("million",1000000),("thousand",1000),("hundred",100)];


wordsToNums::String -> Int
wordsToNums line
  | head xs == "negative" = negate $ toNumber (tail xs) 0
  | otherwise =  toNumber xs 0
  where xs = words line


toNumber::[String]->Int->Int
toNumber xs m
  | m < length multipliers = multiplierValue
  | otherwise = sum $ map (\word -> sum $ map snd $ filter (\x -> word == fst x) numWords) xs
  where
    multiplier = multipliers!!m
    mIndex =  elemIndex (fst multiplier) xs
    multiplierValue
      | mIndex /= Nothing =  left + right
      | otherwise = toNumber xs (m+1)
    left = (snd multiplier) * (toNumber (take (fromJust mIndex) xs) (m+1))
    right = toNumber (drop ((1+) $ fromJust mIndex) xs) (m+1)

test = hspec $ do
  describe "frequency" $ do
    it "50" $ do wordsToNums "fifty" `shouldBe` 50 
    it "10" $ do wordsToNums "ten" `shouldBe` 10 
    it "5" $ do wordsToNums "five" `shouldBe` 5 
    it "22" $ do wordsToNums "twenty two" `shouldBe` 22 
    it "340" $ do wordsToNums "three hundred forty" `shouldBe` 340 
    it "520000098" $ do wordsToNums "five hundred twenty million ninety eight" `shouldBe` 520000098 
    it "69400" $ do wordsToNums "sixty nine thousand four hundred" `shouldBe` 69400 
    it "600197018" $ do wordsToNums "six hundred million one hundred ninety seven thousand eighteen" `shouldBe` 600197018 
    it "-90" $ do wordsToNums "negative ninety" `shouldBe` -90 
    it "-350001070" $ do wordsToNums "negative three hundred fifty million one thousand seventy" `shouldBe` -350001070 
    it "29" $ do wordsToNums "twenty nine" `shouldBe` 29 
    it "316013040" $ do wordsToNums "three hundred sixteen million thirteen thousand forty" `shouldBe` 316013040 
    it "15517" $ do wordsToNums "fifteen thousand five hundred seventeen" `shouldBe` 15517 
    it "-490833650" $ do wordsToNums "negative four hundred ninety million eight hundred thirty three thousand six hundred fifty" `shouldBe` -490833650 
    it "-610" $ do wordsToNums "negative six hundred ten" `shouldBe` -610 
    it "20" $ do wordsToNums "twenty" `shouldBe` 20 
    it "-25741" $ do wordsToNums "negative twenty five thousand seven hundred forty one" `shouldBe` -25741 
    it "-61015" $ do wordsToNums "negative sixty one thousand fifteen" `shouldBe` -61015 
    it "-60" $ do wordsToNums "negative sixty" `shouldBe` -60 
    it "1000000" $ do wordsToNums "one million" `shouldBe` 1000000 
    it "612" $ do wordsToNums "six hundred twelve" `shouldBe` 612 
    it "-342000563" $ do wordsToNums "negative three hundred forty two million five hundred sixty three" `shouldBe` -342000563 
    it "-110" $ do wordsToNums "negative one hundred ten" `shouldBe` -110 
    it "-1716" $ do wordsToNums "negative one thousand seven hundred sixteen" `shouldBe` -1716 
    it "611000000" $ do wordsToNums "six hundred eleven million" `shouldBe` 611000000 
    it "718" $ do wordsToNums "seven hundred eighteen" `shouldBe` 718 
    it "0" $ do wordsToNums "zero" `shouldBe` 0 
    it "11340" $ do wordsToNums "eleven thousand three hundred forty" `shouldBe` 11340 
    it "200060" $ do wordsToNums "two hundred thousand sixty" `shouldBe` 200060 
    it "400080052" $ do wordsToNums "four hundred million eighty thousand fifty two" `shouldBe` 400080052 
    it "55000040" $ do wordsToNums "fifty five million forty" `shouldBe` 55000040 
    it "60365" $ do wordsToNums "sixty thousand three hundred sixty five" `shouldBe` 60365 
    it "514" $ do wordsToNums "five hundred fourteen" `shouldBe` 514 
    it "614097" $ do wordsToNums "six hundred fourteen thousand ninety seven" `shouldBe` 614097 
    it "13000014" $ do wordsToNums "thirteen million fourteen" `shouldBe` 13000014 
    it "1000101" $ do wordsToNums "one million one hundred one" `shouldBe` 1000101 
    it "600" $ do wordsToNums "six hundred" `shouldBe` 600 
    it "-729" $ do wordsToNums "negative seven hundred twenty nine" `shouldBe` -729 
    it "-375000070" $ do wordsToNums "negative three hundred seventy five million seventy" `shouldBe` -375000070 
    it "-870086060" $ do wordsToNums "negative eight hundred seventy million eighty six thousand sixty" `shouldBe` -870086060 
    it "-340" $ do wordsToNums "negative three hundred forty" `shouldBe` -340 
    it "611297875" $ do wordsToNums "six hundred eleven million two hundred ninety seven thousand eight hundred seventy five" `shouldBe` 611297875 
    it "6" $ do wordsToNums "six" `shouldBe` 6 
    it "-650" $ do wordsToNums "negative six hundred fifty" `shouldBe` -650 
    it "-520000098" $ do wordsToNums "negative five hundred twenty million ninety eight" `shouldBe` -520000098
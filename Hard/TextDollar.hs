{-
Text Dollar

Challenge Description:

Credits: This challenge has been authored by Terence Rudkin

 You are given a positive integer number. This represents the sales made that day in your department store. The payables department however, needs this printed out in english. NOTE: The correct spelling of 40 is Forty. (NOT Fourty)

Input sample:

Your program should accept as its first argument a path to a filename.The input file contains several lines. Each line is one test case. Each line contains a positive integer. E.g.
3
10
21
466
1234

Output sample:

For each set of input produce a single line of output which is the english textual representation of that integer.
The output should be unspaced and in Camelcase.
Always assume plural quantities. You can also assume that the numbers are < 1000000000 (1 billion).
In case of ambiguities e.g. 2200 could be TwoThousandTwoHundredDollars or TwentyTwoHundredDollars, always choose the representation with the larger base i.e. TwoThousandTwoHundredDollars. For the examples shown above, the answer would be:
ThreeDollars
TenDollars
TwentyOneDollars
FourHundredSixtySixDollars
OneThousandTwoHundredThirtyFourDollars

-}

module CodeEval.TextDollar where

import Test.Hspec

lt20 = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
tens = ["Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
multipliers = [("Million",1000000 ), ("Thousand",1000 ), ("Hundred", 100 )]

textDollar::String->String
textDollar line = toWords (read line::Int) 0 ++ "Dollars"

toWords:: Int->Int->String
toWords n multiplierId
  | multiplierId < length multipliers && dv > 0 = toWords dv (multiplierId + 1)  ++ (fst multiplier) ++ toWords (mod n (snd multiplier)) (multiplierId + 1)
  | multiplierId < length multipliers = toWords n (multiplierId + 1)
  | n > 19 =  tens!!(div n 10) ++ toWords (mod n 10) multiplierId
  | otherwise = lt20!!n
  where
    multiplier = multipliers!!multiplierId
    dv = div n (snd multiplier)


test = hspec $ do
  describe "textDollar" $ do
     it "3" $ do textDollar "3" `shouldBe` "ThreeDollars" 
     it "10" $ do textDollar "10" `shouldBe` "TenDollars" 
     it "21" $ do textDollar "21" `shouldBe` "TwentyOneDollars" 
     it "466" $ do textDollar "466" `shouldBe` "FourHundredSixtySixDollars" 
     it "1234" $ do textDollar "1234" `shouldBe` "OneThousandTwoHundredThirtyFourDollars" 
     it "92074" $ do textDollar "92074" `shouldBe` "NinetyTwoThousandSeventyFourDollars" 
     it "325" $ do textDollar "325" `shouldBe` "ThreeHundredTwentyFiveDollars" 
     it "66954" $ do textDollar "66954" `shouldBe` "SixtySixThousandNineHundredFiftyFourDollars" 
     it "297" $ do textDollar "297" `shouldBe` "TwoHundredNinetySevenDollars" 
     it "834" $ do textDollar "834" `shouldBe` "EightHundredThirtyFourDollars" 
     it "123456789" $ do textDollar "123456789" `shouldBe` "OneHundredTwentyThreeMillionFourHundredFiftySixThousandSevenHundredEightyNineDollars" 
     it "356757310" $ do textDollar "356757310" `shouldBe` "ThreeHundredFiftySixMillionSevenHundredFiftySevenThousandThreeHundredTenDollars" 
     it "780193586" $ do textDollar "780193586" `shouldBe` "SevenHundredEightyMillionOneHundredNinetyThreeThousandFiveHundredEightySixDollars" 
     it "322" $ do textDollar "322" `shouldBe` "ThreeHundredTwentyTwoDollars" 
     it "555885378" $ do textDollar "555885378" `shouldBe` "FiveHundredFiftyFiveMillionEightHundredEightyFiveThousandThreeHundredSeventyEightDollars" 
     it "773631825" $ do textDollar "773631825" `shouldBe` "SevenHundredSeventyThreeMillionSixHundredThirtyOneThousandEightHundredTwentyFiveDollars" 
     it "1" $ do textDollar "1" `shouldBe` "OneDollars" 
     it "100000000" $ do textDollar "100000000" `shouldBe` "OneHundredMillionDollars" 
     it "432" $ do textDollar "432" `shouldBe` "FourHundredThirtyTwoDollars" 
     it "80" $ do textDollar "80" `shouldBe` "EightyDollars" 
     it "264" $ do textDollar "264" `shouldBe` "TwoHundredSixtyFourDollars" 
     it "455709954" $ do textDollar "455709954" `shouldBe` "FourHundredFiftyFiveMillionSevenHundredNineThousandNineHundredFiftyFourDollars" 
     it "200135632" $ do textDollar "200135632" `shouldBe` "TwoHundredMillionOneHundredThirtyFiveThousandSixHundredThirtyTwoDollars" 
     it "221" $ do textDollar "221" `shouldBe` "TwoHundredTwentyOneDollars" 
     it "42932" $ do textDollar "42932" `shouldBe` "FortyTwoThousandNineHundredThirtyTwoDollars" 
     it "567" $ do textDollar "567" `shouldBe` "FiveHundredSixtySevenDollars" 
     it "90891" $ do textDollar "90891" `shouldBe` "NinetyThousandEightHundredNinetyOneDollars" 
     it "182241277" $ do textDollar "182241277" `shouldBe` "OneHundredEightyTwoMillionTwoHundredFortyOneThousandTwoHundredSeventySevenDollars" 
     it "24552" $ do textDollar "24552" `shouldBe` "TwentyFourThousandFiveHundredFiftyTwoDollars" 
     it "24" $ do textDollar "24" `shouldBe` "TwentyFourDollars" 
     it "67" $ do textDollar "67" `shouldBe` "SixtySevenDollars" 
     it "978282791" $ do textDollar "978282791" `shouldBe` "NineHundredSeventyEightMillionTwoHundredEightyTwoThousandSevenHundredNinetyOneDollars" 
     it "476793449" $ do textDollar "476793449" `shouldBe` "FourHundredSeventySixMillionSevenHundredNinetyThreeThousandFourHundredFortyNineDollars" 
     it "156980874" $ do textDollar "156980874" `shouldBe` "OneHundredFiftySixMillionNineHundredEightyThousandEightHundredSeventyFourDollars" 
     it "288" $ do textDollar "288" `shouldBe` "TwoHundredEightyEightDollars" 
     it "328" $ do textDollar "328" `shouldBe` "ThreeHundredTwentyEightDollars" 
     it "41" $ do textDollar "41" `shouldBe` "FortyOneDollars" 
     it "377" $ do textDollar "377" `shouldBe` "ThreeHundredSeventySevenDollars" 
     it "112" $ do textDollar "112" `shouldBe` "OneHundredTwelveDollars" 
     it "39493" $ do textDollar "39493" `shouldBe` "ThirtyNineThousandFourHundredNinetyThreeDollars" 
     it "441" $ do textDollar "441" `shouldBe` "FourHundredFortyOneDollars" 
     it "777763658" $ do textDollar "777763658" `shouldBe` "SevenHundredSeventySevenMillionSevenHundredSixtyThreeThousandSixHundredFiftyEightDollars" 
     it "18052" $ do textDollar "18052" `shouldBe` "EighteenThousandFiftyTwoDollars" 
     it "557035606" $ do textDollar "557035606" `shouldBe` "FiveHundredFiftySevenMillionThirtyFiveThousandSixHundredSixDollars" 
     it "125" $ do textDollar "125" `shouldBe` "OneHundredTwentyFiveDollars"
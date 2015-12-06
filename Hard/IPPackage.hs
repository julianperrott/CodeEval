module CodeEval.IPPackage where


{- https://www.codeeval.com/open_challenges/154/
 
 IP PACKAGE
CHALLENGE DESCRIPTION:

А novice hacker decided to play a trick on your friends and changed addresses in the header of an IP packet, you need to fix all the packets and put the correct address to help your friends.

A package consists of a header IPV4 and a body of the package.

(see IP4.png)

You need to replace the IP source and destination IP address to the new addresses and print out the IP header under the condition that the package is valid. This means you should calculate checksum of IP header.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename.

Each line contains new source ip address, new destination ip address and package in hex.


190.168.0.96 190.168.0.96 45 04 05 dc b7 3a 40 00 2e 06 a6 df 36 f1 f0 
fd c0 a8 00 67 01 bb e7 eb 2e 05 72 e4 01 40 93 41 80 10 00 88 9d e5 00 
00 01 01 08 0a 28 d8 76 c4 00 03 65 45 47 cf bc 5c 01 99 c6 52 91 6f 5f 
df 69 24 a0 f9 b5 6c dc a2 f7 18 db 07 b8 18 dc 90 1a c4 bf 66 e1 33 f2 
73 e6 22 ca 3c e9 bc 15 c1 b5 01 41 99 1d 25 eb ee 60 7d df 08 80 a7 98 
25 cc 86 6d 19 83 69 e8 4c 5c c7 9f 4f 5b 93 a5 a2 14 4d 4c 3d 6c 85 fb 
4f ... etc

OUTPUT SAMPLE:

For each line of input print out ip header with new destination and source ip address and valid checksum

45 04 05 dc b7 3a 40 00 2e 06 11 cd be a8 00 60 be a8 00 60

-}

import Test.Hspec
import Data.List.Split
import Numeric
import Data.Char
import Data.List

create16BitValues::[String]->(String,Int)->[String]
create16BitValues acc value
  | (snd value) `mod` 2 == 0 = acc++[fst value]
  | otherwise =  init acc ++ [last acc ++ fst value]

strHexToInt::String->Int
strHexToInt value = fst $ head $ readHex value

addWithCarry::Int->Int->Int
addWithCarry v1 v2 = fst dm + snd dm
  where dm = divMod (v1+v2) 65536

decToBin x = reverse $ decToBin' x
  where
  decToBin' 0 = []
  decToBin' y = let (a,b) = quotRem y 2 in [b] ++ decToBin' a

binToInt::[Int]->Int
binToInt bin = foldl (\acc v -> acc+ 2^(snd v)) 0 $ filter (\x-> fst x >0) $zip bin $ reverse [0..(length bin)-1]

pad::[a]->Int->a->[a]
pad xs size x = (replicate (size-length xs) x) ++ xs

createCheckSum::[String]->String
createCheckSum hexArray = pad hexFlippedSum 4 '0'
  where
    intSum = foldl addWithCarry 0 $ map strHexToInt $ foldl create16BitValues [] $ zip hexArray [0..]
    binFlippedSum = map (\v-> if v==0 then 1 else 0) $ pad (decToBin intSum) 16 0
    hexFlippedSum = showHex (binToInt binFlippedSum) ""

setCheckSum::[String]->String->[String]
setCheckSum xs cs = (take 10 xs) ++ [take 2 cs] ++ [drop 2 cs] ++ (drop 12 xs)

ipToHex::String->[String]
ipToHex ip = map (padHex . toHex . toInt) $ splitOn "." ip
  where 
    toHex v = showHex v ""
    toInt v = read v::Int
    padHex v = pad v 2 '0'


fixPackage::String->String
fixPackage line
  | checksum /= oldCheckSum = error "Invalid package"
  | otherwise = intercalate " " $ setCheckSum newHeaderNoChecksum $ createCheckSum newHeaderNoChecksum
  where
    ar = take 22 $ splitOn " " line
    ip1 = ipToHex $ head ar
    ip2 = ipToHex $ head $ drop 1 ar
    header = drop 2 ar
    checksum = header!!10 ++ header!!11
    headerNoChecksum = setCheckSum header "0000"
    oldCheckSum = createCheckSum headerNoChecksum
    newHeaderNoChecksum = take 12 headerNoChecksum ++ ip1 ++ ip2


s1 = "190.168.0.96 190.168.0.96 45 04 05 dc b7 3a 40 00 2e 06 a6 df 36 f1 f0 fd c0 a8 00 67 01 bb e7 eb 2e 05 72 e4 01 40 93 41 80 10 00 88 9d e5 00 00 01 01 08 0a 28 d8 76 c4 00 03 65 45 47 cf bc 5c 01 99 c6 52 91 6f 5f df 69 24 a0 f9 b5 6c dc a2 f7 18 db 07 b8 18 dc 90 1a c4 bf 66 e1 33 f2 73 e6 22 ca 3c e9 bc 15 c1 b5 01 41 99 1d 25 eb ee 60 7d df 08 80 a7 98 25 cc 86 6d 19 83 69 e8 4c 5c c7 9f 4f 5b 93"
s1Expected = "45 04 05 dc b7 3a 40 00 2e 06 11 cd be a8 00 60 be a8 00 60"
    
test = hspec $ do
    describe "createCheckSum" $ do
        it "test1" $ do createCheckSum (splitOn " " "45 00 00 3c 1c 46 40 00 40 06 00 00 ac 10 0a 63 ac 10 0a 0c") `shouldBe` "b1e6"

    describe "fixPackage" $ do
        it "test1" $ do fixPackage s1 `shouldBe` s1Expected
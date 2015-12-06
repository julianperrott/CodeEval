{- https://www.codeeval.com/open_challenges/53/
REPEATED SUBSTRING

CHALLENGE DESCRIPTION:

You are to find the longest repeated substring in a given text. Repeated substrings may not overlap. 
If more than one substring is repeated with the same length, print the first one you find.(starting from the beginning of the text). 
NOTE: The substrings can't be all spaces.

INPUT SAMPLE:

Your program should accept as its first argument a path to a filename. The input file contains several lines. Each line is one test case. Each line contains a test string. E.g.

banana
am so uniqe
OUTPUT SAMPLE:

For each set of input produce a single line of output which is the longest repeated substring. If there is none, print out the string NONE. E.g.

an
NONE
-}
module CodeEval.RepeatedSubstring where
import Test.Hspec
import Data.List

repeatedSubstring :: String -> String
repeatedSubstring line
    | length longest < 1 = "NONE"
    | otherwise = longest
    where longest = findLongerSubstring line "" 0

findLongerSubstring :: String -> String -> Int -> String
findLongerSubstring line longest position
  | (position+len) - (length line) >= len = longest -- no space for substring
  | hasLongerSubString = findLongerSubstring line longerSubString position -- try to find an even longer substring at current position
  | otherwise = findLongerSubstring line longest (position+1) -- move to the next char
  where len = length longest
        longerSubString = take (1+len) $ drop position line
        remainder = drop (length longerSubString) $ drop position line
        hasLongerSubString
            | longerSubString == replicate (length longerSubString) ' ' = False -- The substring can't be all spaces.
            | otherwise = isInfixOf longerSubString remainder

test = hspec $ do
  describe "various" $ do
    it "benlaollpdrktjyr pw svocqhoijl mojrutxqj" $ do repeatedSubstring "benlaollpdrktjyr pw svocqhoijl mojrutxqj" `shouldBe` "l"
    it "a o  o a" $ do repeatedSubstring "a o  o a" `shouldBe` " o "
    it "ntemayfalzdgxipxtgile nzvohjrdbzeceijq" $ do repeatedSubstring "ntemayfalzdgxipxtgile nzvohjrdbzeceijq" `shouldBe` "n"
    it "A quick bown fx jmps vr the lazy dg" $ do repeatedSubstring "A quick bown fx jmps vr the lazy dg" `shouldBe` "NONE"
    it "hzneoeofcqyvxs  zpzfzqoyzjcvnc fcrfzp" $ do repeatedSubstring "hzneoeofcqyvxs  zpzfzqoyzjcvnc fcrfzp" `shouldBe` "eo"
    it "tzptjykuuypfioyn pfioycftkqkdpnwe" $ do repeatedSubstring "tzptjykuuypfioyn pfioycftkqkdpnwe" `shouldBe` "pfioy"
    it "djnbkt m zcyrfrf nzcyrftfq  gfzcyrfovfiymfmpfq kc" $ do repeatedSubstring "djnbkt m zcyrfrf nzcyrftfq  gfzcyrfovfiymfmpfq kc" `shouldBe` "zcyrf"
    it "ji  hjsxjpvojjsxj ixjsxj rodjfurn" $ do repeatedSubstring "ji  hjsxjpvojjsxj ixjsxj rodjfurn" `shouldBe` "jsxj "
    it "xjpbhyrtxygvlyhg   fri cpubppxy" $ do repeatedSubstring "xjpbhyrtxygvlyhg   fri cpubppxy" `shouldBe` "xy"
    it "m gxha rmuao sgdcvcgrcsgarwsm" $ do repeatedSubstring "m gxha rmuao sgdcvcgrcsgarwsm" `shouldBe` "sg"
    it "j q fwjnrfq fhe tvnrkznqwk qg rvj" $ do repeatedSubstring "j q fwjnrfq fhe tvnrkznqwk qg rvj" `shouldBe` "q f"
    it "m u m ujiiramg" $ do repeatedSubstring "m u m ujiiramg" `shouldBe` "m u"
    it "ntxklquirv wd cypfz s" $ do repeatedSubstring "ntxklquirv wd cypfz s" `shouldBe` "NONE"
    it "fxdmqajnoxkybslhjdw bk" $ do repeatedSubstring "fxdmqajnoxkybslhjdw bk" `shouldBe` "x"
    it "uctfggpqf aka dtcdlulgxpitzqbtvlvdalavr" $ do repeatedSubstring "uctfggpqf aka dtcdlulgxpitzqbtvlvdalavr" `shouldBe` "u"
    it "n pdcmrv kqeiw ash" $ do repeatedSubstring "n pdcmrv kqeiw ash" `shouldBe` "NONE"
    it "awgafhbqskmmaq  j dxdphukp vz  doagyvix" $ do repeatedSubstring "awgafhbqskmmaq  j dxdphukp vz  doagyvix" `shouldBe` " d"
    it "h yiezotdpq unvj cfgrwb" $ do repeatedSubstring "h yiezotdpq unvj cfgrwb" `shouldBe` "NONE"
    it "qgdbtfhnyzmrkucsx   pjl" $ do repeatedSubstring "qgdbtfhnyzmrkucsx   pjl" `shouldBe` "NONE"
    it "mhibtniyggxzec sggxzecczdocqcbd e" $ do repeatedSubstring "mhibtniyggxzec sggxzecczdocqcbd e" `shouldBe` "ggxzec"
    it "wypfjn ekq lx gimc" $ do repeatedSubstring "wypfjn ekq lx gimc" `shouldBe` "NONE"
    it "sbkpqdcvg u htl jfeoyaxm" $ do repeatedSubstring "sbkpqdcvg u htl jfeoyaxm" `shouldBe` "NONE"
    it "vhsuyplporqhjug  mminzxgbkxjxj dtkreinzxgb ccinzxgb rw" $ do repeatedSubstring "vhsuyplporqhjug  mminzxgbkxjxj dtkreinzxgb ccinzxgb rw" `shouldBe` "inzxgb "
    it "lnrvzifysyr sfpnrizs sjumrsdts" $ do repeatedSubstring "lnrvzifysyr sfpnrizs sjumrsdts" `shouldBe` "nr"
    it "yegvjcpmpfwg si lsihsdkbmthspko" $ do repeatedSubstring "yegvjcpmpfwg si lsihsdkbmthspko" `shouldBe` "si"
    it "tasczhizghuvha epeinqepeinqebliw" $ do repeatedSubstring "tasczhizghuvha epeinqepeinqebliw" `shouldBe` "epeinq"
    it "n b qjuyevhxgskiadm" $ do repeatedSubstring "n b qjuyevhxgskiadm" `shouldBe` "NONE"
    it "wx ctuwpolulwpctlgfhgclckccggrwh" $ do repeatedSubstring "wx ctuwpolulwpctlgfhgclckccggrwh" `shouldBe` "ct"
    it "r smwlpugiyxda vfe" $ do repeatedSubstring "r smwlpugiyxda vfe" `shouldBe` "NONE"
    it "A slow yellow fox crawls under the proactive dog" $ do repeatedSubstring "A slow yellow fox crawls under the proactive dog" `shouldBe` "low "
    it "qduxllzjmmnzavprmnzavpkmorkfjk ig  svgeysw tbj" $ do repeatedSubstring "qduxllzjmmnzavprmnzavpkmorkfjk ig  svgeysw tbj" `shouldBe` "mnzavp"
    it "gohadzkjbplhepthsruqhkuqhhmbch iuqhbfm" $ do repeatedSubstring "gohadzkjbplhepthsruqhkuqhhmbch iuqhbfm" `shouldBe` "uqh"
    it "ojhxnvshlphycdrasfln e uhy  ms vtsikkcdrmgcdrq b" $ do repeatedSubstring "ojhxnvshlphycdrasfln e uhy  ms vtsikkcdrmgcdrq b" `shouldBe` "cdr"
    it "mlgxdpmjgtsdhwdsdhwsjjiejlfwsdhwtrurbyfeqdefxajel" $ do repeatedSubstring "mlgxdpmjgtsdhwdsdhwsjjiejlfwsdhwtrurbyfeqdefxajel" `shouldBe` "sdhw"
    it "bpyhywsrusgwuvrusgwuvjhnh fmziygekxgcrusgwu" $ do repeatedSubstring "bpyhywsrusgwuvrusgwuvjhnh fmziygekxgcrusgwu" `shouldBe` "rusgwuv"
    it "bbsmbvqjnlf tytk  bbsmbvqmstwrwl hbbbsmbvnilbjmi" $ do repeatedSubstring "bbsmbvqjnlf tytk  bbsmbvqmstwrwl hbbbsmbvnilbjmi" `shouldBe` "bbsmbvq"
    it "oevbjrxs zwigacpt mk" $ do repeatedSubstring "oevbjrxs zwigacpt mk" `shouldBe` "NONE"
    it "q dugxj chnhcfdyeztvujfreztvuz eztvu boatwjle bhsm" $ do repeatedSubstring "q dugxj chnhcfdyeztvujfreztvuz eztvu boatwjle bhsm" `shouldBe` "eztvu"
    it "ojwawqjoyjvwqjolhwftkwqjodiz wly ow" $ do repeatedSubstring "ojwawqjoyjvwqjolhwftkwqjodiz wly ow" `shouldBe` "wqjo"
    it "v bupchprstvm sa wag" $ do repeatedSubstring "v bupchprstvm sa wag" `shouldBe` "v"

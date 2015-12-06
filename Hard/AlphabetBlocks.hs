{- https://www.codeeval.com/open_challenges/201/
ALPHABET BLOCKS
CHALLENGE DESCRIPTION:

We all remember those childhood times when we learned how to use alphabet blocks to form different words, such as MOM, DAD, TRAIN, and others. We propose you to remind this time for a while and imagine yourself being a child.
So, you have a set of alphabet blocks. There is a letter on each of the six faces of every block. Also, you have a word associated with your childhood that you want to form.
Write a program that will verify if it is possible to form the necessary word out of the set. If yes, then print "True" to stdout; otherwise, print "False".
You can choose only one letter from an alphabet block and place blocks in any order.

INPUT SAMPLE:

The first argument is a path to a file. Each line contains test cases that have three arguments separated by the pipe symbol "|". 
1. The first argument in the line is a number that shows how many blocks are in the set. 
2. The second one is a word that you want to form. 
3. The third one is a list of arrays of letters. One face of the alphabet block includes one letter from array. 
For example: 
There is an array of letters "ABCDEF". It refers to one toy block with the following faces: 
"A", "B", "C", "D", "E", "F".

4 | DOG | UPZRHR INOYLC KXDHNQ BAGMZI
6 | HAPPY | PKMFQP KTXGCV OSDMAJ SDSIMY OEPGLE JZCDHI
5 | PLAIN | BFUBZD XMQBNM IDXVCN JCOIAM OZYAYH
OUTPUT SAMPLE:

Print "True" to stdout if you can form the necessary word, or "False" if you cannot do this.

True
True
False
CONSTRAINTS:

The word length is from 4 to 18 characters.
Number of blocks in the set is always equal to or greater than the word length.
You can take only one block from the set to form one letter in the word.
The letters in the word and letters on the faces of one block may repeat: the word might be "MOM" or there might be a block with "AAAAAA" faces.
The number of test cases is 40.
-}
module CodeEval.AlphabetBlocks where

import Test.Hspec

import Data.List
import Data.List.Split
import Data.Maybe
import Data.Function (on)

blocksForEachLetter::String->[String]->[[Int]]
blocksForEachLetter word blocks = wordBlocks 
  where
    blockZip = zip [0..length blocks-1] blocks
    blockHasLetter letter w = isJust $ elemIndex letter (snd w)
    blocksWithLetter letter = map fst $ filter (blockHasLetter letter) $ blockZip
    wordBlocks = map blocksWithLetter word

alphaBlocks::String->String
alphaBlocks line
    | result == 1 = "True"
    | otherwise = "False"
  where
    args = words line
    word = args!!2
    blocks = drop 4 args
    result = fitBlocksToLetters $ blocksForEachLetter word blocks

countBlockFrequency::[[Int]]->[(Int,Int)]
countBlockFrequency xs = sortBy sortSnd $ doit $ concat xs
  where
    doit xs = [ (c, length g) | g@(c:_) <- group $ sort xs]
    sortSnd (_, a1) (_, a2)
      | a1 < a2  = LT
      | a1 > a2 = GT
      | otherwise = EQ

removeBlock::Int->[[Int]]->[[Int]]
removeBlock blockToRemove blocks = map removeBlock blocks
  where removeBlock xs = filter (\x-> x/=blockToRemove) xs

fitBlocksToLetters::[[Int]]->Int
fitBlocksToLetters blocksForEachLetter
  | length blocksForEachLetter == 0 = 1 -- Success
  | length firstLetter == 0 = 0 -- if first has 0 blocks then we have failed
  | length firstLetter == 1 = fitBlocksToLetters (removeBlock (head firstLetter) (tail sortedBlocks) )-- // does first have one possible block, if so assign it
  | otherwise = foldl fitBlock 0 letterIndicies
  where
    sortedBlocks = sortBy (compare `on` length) blocksForEachLetter
    firstLetter = head sortedBlocks
    firstBlock = fst $ head $ countBlockFrequency blocksForEachLetter
    letterIndicies = filter (>(-1)) $ map (\x -> if isJust(elemIndex firstBlock (sortedBlocks!!x)) then x else -1 ) [0..length sortedBlocks-1]
    fitBlock acc i
      | acc == 1 = acc
      | otherwise = fitBlocksToLetters $ removeBlock firstBlock $  (take i sortedBlocks ++ drop (i+1) sortedBlocks)

test = hspec $ do
  describe "digitStats" $ do
    it "1" $ do alphaBlocks "5 | VLQGF | VKCHBB EOAPTE INJKHE GXXOVT LDOYIE" `shouldBe` "False"
    it "2" $ do alphaBlocks "9 | YBTAWAES | CEJWCF VPLQVQ EWMQKK XFCDCJ VYKANK WYCGFV GEUMGB FULCGL TLMCVV" `shouldBe` "False"
    it "3" $ do alphaBlocks "9 | ECXTLHV | YXXSEP NXNCXL CESABN JXXSVH IYSZHH MVBEOS VJIAYT QBWTTS RFFNHH" `shouldBe` "True"
    it "4" $ do alphaBlocks "18 | EQTOSOEKQ | ZNQKRY DAKTDX EBRUDK IEAMSD NAIIJP RKOFAC MXRJCL JEBUDO IEERUB LDCYRO KHBYPT YZSTFP TUQZXQ HULNTE DIQLZA VIRTBE RRSJQD FEPIIL" `shouldBe` "True"
    it "5" $ do alphaBlocks "18 | WRMH | VTXZEO UMHPOM JIBCQL BMOUKW ASQBNT SSUXAP JQNNAN YFDHRF POUUVF VKXTRW FIBSCK FVEIYH QDMBMP KDHFWT PHYJSP XQUQRR HDZGNV WRHPSE" `shouldBe` "True"
    it "6" $ do alphaBlocks "5 | JXEC | VSREVC YOLOBD PJRBKC VEIUUY SWBMRE" `shouldBe` "False"
    it "7" $ do alphaBlocks "5 | MARY | UPZRHR INOYLC KXDHNQ BADMZI GBZKMN" `shouldBe` "True"
    it "8" $ do alphaBlocks "7 | VIEA | DREIKI JODORU ADWNPB TCOTIP XSTVTA OIQWXU NXMUDA" `shouldBe` "True"
    it "9" $ do alphaBlocks "7 | BQOMWSR | NBHIDK QCKMHW WAQRJP NIALYX IIEKVT LAAOYH CPTOYR" `shouldBe` "False"
    it "10" $ do alphaBlocks "6 | MEGAN | PKMFQP KTXGCV OSDMAJ SDSIMJ OEPGLE JZCDNI" `shouldBe` "True"
    it "11" $ do alphaBlocks "8 | ZRKMYSQ | AQRDAL NIPJBE UZMHUR LNRQNO ORBLVM GGGRWP RTPYLE GQIVWB" `shouldBe` "False"
    it "12" $ do alphaBlocks "13 | TCPRCZOYYYKL | ZWRBAI ZDPXZR JBHEKB AMYUMD RVNQVA VWTHNY XFUHOW ARWTUV IHZTXY GDZVRW EQAVZV GZGIAO EKFHFW" `shouldBe` "False"
    it "13" $ do alphaBlocks "18 | OTXVJZXBTWGLHGJ | YHPJJP XSENMV EQRDQJ HCCPDE YIFJPV YNEXQF GGWJCI MLVBSJ DKVYXA EQAOYN TCUVJS RBRIQI FIBBGH AAEBPQ KMREYC LSQHSA UVWOLR LYJYVH" `shouldBe` "False"
    it "14" $ do alphaBlocks "17 | KTVLYSZSNDVTD | TVPZZT VWFQUA GJKKRV AIMPFL PUQMEC BFAEBD PIYGEI MEGCDV RBZWOS TTCHGJ XJLSIR PTHHGR BWUWPH IRZZLQ SSKCGE TREIFI CLXQLB" `shouldBe` "False"
    it "15" $ do alphaBlocks "18 | XVNHESID | FPJRPO EOBLSR OAQZGE ROXKKH YJPBUM XGVCHU QFZXKR CWEHOK GIADZW AARFXG SHODIY OWLXHR DITSJL TVKHSW SOSXOA RZEBIV AAQAIU ELVIOE" `shouldBe` "False"
    it "16" $ do alphaBlocks "7 | OXQE | YDWORH RNTAXK FOEWNC RSQUJM OXTKTR KNLGLJ YBFUCX" `shouldBe` "True"
    it "17" $ do alphaBlocks "5 | LINDA | BFUBZD XMQBNM IDXVCN JCOIAM OZYAYH" `shouldBe` "False"
    it "18" $ do alphaBlocks "9 | FFTZWTF | IAFAFA XWUQWX BAAHUM PXRLQG PCMURX DMWMNW GQMDBW RAFTEG WSJUNA" `shouldBe` "False"
    it "19" $ do alphaBlocks "12 | RAGRVMDIGI | CVULVB QRHJLX SMQKGB INVLHH QNPODC CUWWFZ GZBNMK DUPUGI ONYSYE FOAUAI QJFRFJ AVNAFK" `shouldBe` "True"
    it "20" $ do alphaBlocks "16 | EPIFKPFUELZGCW | ESJZBC DHGBZA NXEBQO JCCOLX ICMKDQ CURBDX LLBKEL YAGIPM WNOGBY GAKBYX LWXMEG GANVNN QXFEJX JBDTPX XBKCFR JVVQGE" `shouldBe` "True"
    it "21" $ do alphaBlocks "11 | MSDWKLR | HLNLRU SZCKMS CXZDJP MVYVPJ GGBOUR STEVYN TQCGMF FYFYAL JKVEMK OQTWEL SRFANM" `shouldBe` "True"
    it "22" $ do alphaBlocks "14 | USSQAIWS | HCGDUZ VBVZEH VTJGYP RBPPBW TRUOMY HLNNSF MQSMRU IXCQCY MCYRSW ZJNPKA QTPFKP RSTHVK ORRSGK CXPSAU" `shouldBe` "True"
    it "23" $ do alphaBlocks "7 | YQQS | YUBQOW NHQEXK IZLFBJ HFQIFZ MBWKMG KZXBJB FDRNZH" `shouldBe` "False"
    it "24" $ do alphaBlocks "10 | CZMB | TLGNQN FASFIU KXWJNF VFUKLX EWPUEU CFWKIU OGSBQW WXOQAO VRAMZJ FZPJTU" `shouldBe` "True"
    it "25" $ do alphaBlocks "5 | RCCB | PLUGFQ UUMOFX LGKWIW XMGQDN KAWSSF" `shouldBe` "False"
    it "26" $ do alphaBlocks "14 | BEOY | NOMKME NMJHEB SRZOMP UMNEWH FUUXXX MLKSQR ZGMULC KEWKHC HEEJNJ ANJHFO SKMUSH RKLQGF MWIRVK XLLRWB" `shouldBe` "False"
    it "27" $ do alphaBlocks "17 | EKIOOXPYTQ | RWGRGI DYCABD JBPGMK ZJTJPT UGKVLU ISYJFK PRGXCT GFCBOX LZSOXW UIBRFZ YJFQLP YNLAYO ZALQMG DJJJBV MZSZMR ILRVEZ EDXKXH" `shouldBe` "True"
    it "28" $ do alphaBlocks "9 | OOHTPNG | RVMELA ISNMQC GCXLNY XTDYQZ OGBLUX VFUJXH UHDQNG WVEEWU KAIENA" `shouldBe` "False"
    it "29" $ do alphaBlocks "9 | HGNI | OOFSVR QGOWXW HTTKAI VBAMRP LWFVXW GCBEXE ERCDEI VETATI MHXHGT" `shouldBe` "False"
    it "30" $ do alphaBlocks "4 | PHTM | GNSZAR ZDTJOM NZJMQC TBRIDH" `shouldBe` "False"
    it "31" $ do alphaBlocks "5 | NHYX | RPBZCC UVEUMN SWICUI YQCRMX HZXHQR" `shouldBe` "False"
    it "32" $ do alphaBlocks "4 | OIGX | VMPVSP YVNADC UFIPJK WBQJXJ" `shouldBe` "False"
    it "33" $ do alphaBlocks "10 | OGICMIATJW | SKUIDQ FNUEUM LANDHV VWDOIR KWZKAG PXLFOE SMHIGU ZEGJBY ZKAZYP TUTDGC" `shouldBe` "False"
    it "34" $ do alphaBlocks "10 | QGKSDISLO | CBFRPR TBXJKW SCOJGI RTOFAO TCWEQW ARNFXH CICJNV AAUSGX DVBPYL QFSAIZ" `shouldBe` "False"
    it "35" $ do alphaBlocks "15 | NDGTMIZQZBG | JNHFEO UNOTPG FISTCD VXYAKD KKZRNH KOJSBK SFAHRV QOJVQB NJIITA AQTWDG VWDNZA BCDYMN IYMRYJ VZPQSI BEXSZB" `shouldBe` "True"
    it "36" $ do alphaBlocks "4 | TJYL | SDIEQP DNRHZH DIENBJ LKLAQQ" `shouldBe` "False"
    it "37" $ do alphaBlocks "13 | CEHXSRP | SIICFG JUUQIK QAJMXL CQUYYR CERBBP FTNHSV YCPWXT HLEIIU WQQJML EYGHQS QSZACN FFRCQQ GVRUNI" `shouldBe` "True"
    it "38" $ do alphaBlocks "13 | SSLOZWHQBBFSB | WIXUPE ATUZDT ZJJDID TUNKUV URHQJE BBPCBU CBZHFS VYTTSP IWMFYU LBDHOI AFXZBB MSEWVE QYZVFR" `shouldBe` "False"
    it "39" $ do alphaBlocks "12 | ZBME | FZSRAS UPJRQU JBBOGH QHRVDX DFCTXM BMQHMU UHXXSP CRCHEA TCMODK MTRGEE DPFTNF SFUYAQ" `shouldBe` "True"
    it "40" $ do alphaBlocks "11 | EFTIH | IHHWJW BSCNLM NZQXXI SLJJZS TGECFW BDKWSD NLLAJY UYVXLA LSXQHH AWXLHX RKHUTK" `shouldBe` "False"
   
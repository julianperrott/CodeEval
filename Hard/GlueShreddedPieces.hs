{-https://www.codeeval.com/open_challenges/185/

GLUE SHREDDED PIECES
CHALLENGE DESCRIPTION:

Imagine that you are taking part in the investigation of a criminal organization. Having determined its location, you came there and found out that the criminals had recently left that place. But it is not a dead end, because there are lots of shredded documents in the room. On investigating these documents, you came to conclusion that the criminals had not been very careful. Firstly, the papers are shredded horizontally, and you can read some pieces of text. Secondly, there are many copies of the same documents, and the pieces of text overlap each other.

For example, you can put pieces together and get the original text:

evil pl
 vil pla
  il plan
The answer is ‘evil plan’.

Your task is to print out the original text. Due to repetitions in the text, you will sometimes get identical pieces.

INPUT SAMPLE:

Your program should accept a path to a file as its first argument. Each line in the file is one test case with the pieces of shredded text separated by a pipe. Each test case starts and finishes with symbol '|'.

For example:

|deEva|lan t|to ha|evil |ankin|il-ev|o hac| to h|vil p|an to|The 
e|CodeE| evil|plan |hack |Eval |ack C|l ran|king.|l-evi|evil-|-evil|l 
pla|il pl| hack|al ra|vil-e|odeEv|he ev|n to |ck Co|eEval|nking| rank| 
Code|e evi|ranki|k Cod| plan|val r|
OUTPUT SAMPLE:

Print to stdout the original text for each test case.

For example:


The evil-evil plan to hack CodeEval ranking.
CONSTRAINTS:

For the text with the length t shredded into pieces with the length n, there are t - (n - 1) pieces of text in the input file. Each piece of text is shifted by one character. For example, the word ‘secret’ and n = 4:

secr
 ecre
  cret
There is only one correct answer for each test case.
The minimum number of pieces is 125, the maximum number is 975.
The minimum length of a piece of text is 8, the maximum length is 28.
The number of test cases is 20.
-}
module CodeEval.GlueShreddedPieces where

import Test.Hspec

import Data.List
import Data.List.Split
import Data.Maybe

glueShreddedPieces::String->String
glueShreddedPieces line = glue pieces len
  where
    pieces = init $ tail $ splitOn "|" line
    len = length (head pieces)

data MatchPosition = Start | End deriving Eq

matches::[String]->Int->MatchPosition->([String],[Int])
matches pieces len pos = foldl' addOverlaps ([],[]) [1..length pieces-1]
  where
    overlaps::String->String->Bool
    overlaps a b
      | pos == Start && take (len-1) a == drop ( (length b)-(len -1)) b= True
      | pos == End && take (len-1) b == drop ( (length a)-(len -1)) a= True
      | otherwise = False
    addOverlaps::([String],[Int])->Int->([String],[Int])
    addOverlaps (foundPieces,indexes) i
      | isJust (find (==(pieces!!i) ) foundPieces) = (foundPieces,indexes)
      | overlaps (head pieces) (pieces!!i) = ( (pieces!!i):foundPieces, i:indexes )
      | otherwise = (foundPieces,indexes)


removePiece::[String]->Int->[String]
removePiece pieces i = (take i pieces) ++ drop (i+1) pieces


joinPieces::[String]->Int->[String]
joinPieces pieces len
  | length pieces == 1 = [head pieces]
  | length (fst headMatch) == 1 = joinPieces (newPieces headMatch Start) len
  | length (fst tailMatch) == 1 = joinPieces (newPieces tailMatch End) len
  | otherwise = pieces
  where 
    headMatch = matches pieces len Start
    tailMatch = matches pieces len End

    newPieces matches pos = matchNewText : (tail $ removePiece pieces matchIndex)
      where
        matchText = head $ fst matches
        matchIndex = head $ snd matches
        matchNewText
          | pos == Start = matchText ++ drop (len-1) (head pieces)
          | otherwise =  head pieces ++ drop (len-1) matchText


glue::[String]->Int->String
glue pieces len
  | length result == 1 = head result
  | length result == length pieces = intercalate "/" result
  | otherwise = glue (tail result++[head result]) len
  where
    result = joinPieces pieces len

line3 = "|n biotic systems.[1|iophysics (the stud|n Hogeweg and Ben H|he study of physica|ystems) or biochemi|in 1970 to refer to|][3] This definitio|ormatics as a field|nd Ben Hesper coine|1970 to refer to th|eweg and Ben Hesper|ystems.[1][2][3] Th| in biological syst|ormation processes |he study of informa|efinition placed bi| systems.[1][2][3] |laced bioinformatic|ined the term bioin|biophysics (the stu|a field parallel to|rmation processes i|in biotic systems.[|ms.[1][2][3] This d|n biological system|al processes in bio|ien Hogeweg and Ben| chemical processes| coined the term bi|hemistry (the study| biological systems|weg and Ben Hesper |coined the term bio|) or biochemistry (|try (the study of c|processes in biolog|ioinformatics as a |iological systems) | processes in bioti|g and Ben Hesper co|stry (the study of | to biophysics (the|systems.[1][2][3] T|fer to the study of|rallel to biophysic|udy of physical pro|logical systems) or|rm bioinformatics i|tic systems.[1][2][|(the study of chemi|ion placed bioinfor|inition placed bioi|Ben Hesper coined t|lien Hogeweg and Be|formatics as a fiel|tics in 1970 to ref| to refer to the st|s as a field parall|systems) or biochem|s in 1970 to refer |e study of informat|ses in biological s| Hogeweg and Ben He|ogical systems).[1]|processes in biotic| processes in biolo|otic systems.[1][2]| biological systems|0 to refer to the s|in biological syste|ical systems) or bi|s) or biochemistry |biological systems)|formatics in 1970 t|tics as a field par|al systems) or bioc|al processes in bio|.[1][2][3] This def|el to biophysics (t|biological systems)|ogical systems) or | systems) or bioche|o biophysics (the s|70 to refer to the |ed the term bioinfo|Hesper coined the t|m bioinformatics in|ogeweg and Ben Hesp|sses in biological |on processes in bio|d bioinformatics as|s a field parallel |sical processes in |stems.[1][2][3] Thi|he term bioinformat|n placed bioinforma| or biochemistry (t|ry (the study of ch|logical systems).[1| the study of infor|ocesses in biologic| as a field paralle|r coined the term b| in biological syst|f information proce|aced bioinformatics|ses in biotic syste|his definition plac|biochemistry (the s|1][2][3] This defin|ems.[1][2][3] This |he study of chemica| a field parallel t|in biological syste|refer to the study |tudy of information|nition placed bioin|parallel to biophys| field parallel to |e term bioinformati|iochemistry (the st|lel to biophysics (|emistry (the study | and Ben Hesper coi| biochemistry (the |oined the term bioi| physical processes|the term bioinforma|esses in biotic sys|ioinformatics in 19| definition placed | the term bioinform|s (the study of phy|cs (the study of ph|en Hogeweg and Ben |ysical processes in|eld parallel to bio|ems) or biochemistr|er to the study of | biophysics (the st|emical processes in|information process|term bioinformatics|Paulien Hogeweg and|n Hesper coined the|cal systems) or bio|nformatics in 1970 |hemical processes i| refer to the study|cesses in biologica| biotic systems.[1]|aulien Hogeweg and |to biophysics (the |Hogeweg and Ben Hes| information proces| of physical proces| (the study of chem|s definition placed| 1970 to refer to t|y of chemical proce|ld parallel to biop|esses in biological|cesses in biotic sy|sses in biotic syst|es in biological sy|3] This definition |allel to biophysics|cs in 1970 to refer|of chemical process|chemical processes |r biochemistry (the|bioinformatics as a| Ben Hesper coined |geweg and Ben Hespe|biotic systems.[1][|o refer to the stud|udy of chemical pro|es in biotic system|chemistry (the stud|l processes in biol|informatics as a fi|iological systems).|tudy of chemical pr|tems.[1][2][3] This|erm bioinformatics |tion placed bioinfo|per coined the term|hysical processes i|sics (the study of |e study of physical|dy of information p|gical systems) or b|ormatics in 1970 to|matics as a field p|rocesses in biotic |r to the study of i|study of physical p|c systems.[1][2][3]|of information proc|[2][3] This definit|placed bioinformati|ned the term bioinf| placed bioinformat|ical processes in b|970 to refer to the|ition placed bioinf|oinformatics as a f|informatics in 1970|the study of physic|study of informatio|ological systems).[|d parallel to bioph|ysics (the study of|s in biotic systems|as a field parallel| This definition pl|ms) or biochemistry|eg and Ben Hesper c|l processes in biol|udy of information |d the term bioinfor|rmatics as a field |esses in biological|ulien Hogeweg and B|and Ben Hesper coin|tems) or biochemist|ics in 1970 to refe|on placed bioinform|s in biological sys|sper coined the ter| study of informati|l systems) or bioch| (the study of phys|er coined the term |ed bioinformatics a|rmatics in 1970 to |y of information pr|arallel to biophysi|n biological system|stems) or biochemis|l to biophysics (th|finition placed bio|dy of physical proc|ics (the study of p|dy of chemical proc| parallel to biophy| Hesper coined the |efer to the study o|2][3] This definiti| bioinformatics in |ation processes in |sses in biological |s.[1][2][3] This de|f physical processe|hysics (the study o|ological systems) o|esper coined the te|the study of inform|mation processes in|matics in 1970 to r|rocesses in biologi|ochemistry (the stu|[1][2][3] This defi|ical processes in b|n 1970 to refer to |d Ben Hesper coined|oinformatics in 197|][2][3] This defini|is definition place|ield parallel to bi|study of chemical p|formation processes|atics in 1970 to re|tion processes in b|o the study of info| in biotic systems.|cal processes in bi| in 1970 to refer t|to the study of inf|nformation processe|to refer to the stu|llel to biophysics |of physical process|tudy of physical pr| bioinformatics as |bioinformatics in 1|iotic systems.[1][2|physics (the study |cs as a field paral|] This definition p| to the study of in|ics as a field para| term bioinformatic|ophysics (the study|(the study of physi|y (the study of che|ocesses in biologic|ion processes in bi|This definition pla|s in biological sys|field parallel to b| study of physical |or biochemistry (th| of information pro|y of physical proce|atics as a field pa|ic systems.[1][2][3|ses in biological s|mical processes in |[3] This definition|ocesses in biotic s|f chemical processe|istry (the study of|ced bioinformatics |physical processes |rocesses in biologi|e study of chemical|definition placed b|processes in biolog|cesses in biologica|es in biological sy|cal processes in bi|mistry (the study o|nformatics as a fie| of chemical proces|the study of chemic|n processes in biot| processes in biolo|en Hesper coined th| study of chemical |"

test = hspec $ do
  describe "glue" $ do
    it "1" $ do glueShreddedPieces "|deEva|lan t|to ha|evil |ankin|il-ev|o hac| to h|vil p|an to|The e|CodeE| evil|plan |hack |Eval |ack C|l ran|king.|l-evi|evil-|-evil|l pla|il pl| hack|al ra|vil-e|odeEv|he ev|n to |ck Co|eEval|nking| rank| Code|e evi|ranki|k Cod| plan|val r|" `shouldBe` "The evil-evil plan to hack CodeEval ranking."
    it "2" $ do glueShreddedPieces "|ctive m|al cont|rning m| predic|ntexts,|ndustri|ing met|ds may |nalytic|redicti|ine lea| may be|odellin|ods may| indust|ics or |g metho|e model|ne lear|as pred|predict| machin| as pre|analyti|ve anal|arning |strial |ts, mac|thods m|yed in |edictiv|ployed |r predi|dictive|referre| analyt|ive mod|d to as|y be re|in indu|lytics | predic|red to |o as pr|exts, m|ethods |hen emp| be ref|employe|rred to|xts, ma|ay be r|cs or p|en empl|s may b|s or pr|chine l| in ind|l conte| to as | or pre|mployed|ictive |ytics o|predict|e analy|context| referr|ed to a|modelli|texts, |learnin|ning me|be refe|n indus|ve mode|tics or|may be | method|eferred|industr|tive mo|redicti|When em|to as p|edictiv|erred t|ferred |s, mach|methods|or pred|dictive|ictive |e refer|d in in| contex|achine |ive ana| modell| employ|ed in i|tive an|s predi|machine|ng meth|hods ma|hine le|trial c|ustrial|n emplo|ontexts|alytics|ial con|delling|e learn|, machi|loyed i|oyed in|rial co|ctive a|elling.|earning| learni|dustria|" `shouldBe` "When employed in industrial contexts, machine learning methods may be referred to as predictive analytics or predictive modelling."
    it "3" $ do glueShreddedPieces line3 `shouldBe` "Paulien Hogeweg and Ben Hesper coined the term bioinformatics in 1970 to refer to the study of information processes in biotic systems.[1][2][3] This definition placed bioinformatics as a field parallel to biophysics (the study of physical processes in biological systems) or biochemistry (the study of chemical processes in biological systems).[1]"

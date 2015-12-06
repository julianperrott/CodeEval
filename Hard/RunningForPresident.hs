module CodeEval.RunningForPresident where

{- https://www.codeeval.com/open_challenges/145/

Running for president

Challenge Description:
 
You're planning your party's campaign strategy to win the Presidency of the United States. 

To win, your candidate has to navigate many controversial issues, which influence voters, such as healthcare, immigration, education, energy, independence, jobs, taxes, environment, and so on. Each of these is important, but also expensive to address. 

Because the United States presidential election is determined by states casting votes in the Electoral College, you need minimum 270 of the total 538 Electoral College votes to win. 

While not completely accurate, for this challenge we use the following criteria: 
•States may or may not value an issue.
•States value each issue differently.
• Winning 51% of any state gives you all of that state's votes. If you have less than 51 %, you won't receive any votes. 

Your task is to put together a winning strategy by identifying the fewest issues you must address to win 270 votes. 

Input sample:

Your program should accept a file as its first argument. The file content is the following: 


Social issues: 9



Healthcare: 33995797

Immigration: 2089699

Education: 37182280

Energy independence: 1344134

...

Wealth inequality: 99237127

Increase military spending: 44066575



Mississippi

Votes: 6

Creating jobs: 1

Jobs: 0

...

Increase military spending: 0

Education: 1

Energy independence: 0



Oklahoma

Votes: 7

Creating jobs: 1

Jobs: 2

...

Increase military spending: 0

Education: 1

Energy independence: 2



...



Maine

Votes: 4

Creating jobs: 0

Jobs: 0

...

Increase military spending: 0

Education: 1

Energy independence: 3


The first line identifies the total number of potential issues, the second—information about costs for each program, and the third — information about each state, separated by spacing. Each state has a name, number of votes, and a list of issues that you can choose in each state. Each of these issues is valued based on the number of votes it can get in each state. Remember, you must get the majority of votes in each state to win. 

Output sample:

Print out the list of issues you want to cover in you electoral program in alphabetical order. 

For example: 

Energy independence
Healthcare
Immigration
Increase military spending

Remember, that your task is to create a program with the fewest number of issues. If there are several variants of program with the fewest number of issues, then you need to choose the program with minimum costs. 

-}


import Test.Hspec

import System.Environment
import Data.List
import Data.List.Split
import Data.Maybe
import Data.Bits (popCount)

{-
main = getArgs >>= parse >>= putStr . process
parse [f] = readFile f
process s = unlines $ runningForPresident $ filter (\xs-> length xs > 0) $ lines s
-}

data State = State { name:: String, votesToWin :: Int,votesTotal::Int, votes :: [Int] } deriving (Show, Eq)

parseField::String->(String,Int)
parseField xs = (head args, read (last args)::Int)
  where args = splitOn ":" xs

parseIssues::[String]->[(String,Int)]
parseIssues = map parseField

votesRequired::Int->Int->Int
votesRequired totalVotes percentage
  | snd dm > 1 = (fst dm)+1
  | otherwise = fst dm
  where
    dm = divMod (totalVotes*percentage) 100

parseState::[String]->[String]->State
parseState stateInfo issueNames = State { name = name,votesToWin=votes51, votesTotal = votesTotal , votes = votes}
  where
    name = head stateInfo
    votesTotal = snd $ parseField (stateInfo!!1)
    votes51 = votesRequired votesTotal 51
    issueVotes = parseIssues $ drop 2 stateInfo
    votes = map (\i-> getVoteForIssue (issueNames!!i)) [0..length issueNames-1]
    stateIssuesNames = map fst issueVotes
    getVoteForIssue::String->Int
    getVoteForIssue issueName
      | isJust index = snd $ issueVotes!!(fromJust index)
      | otherwise = 99
      where
        index = elemIndex issueName stateIssuesNames

votesWonForState::State->[Int]->Int
votesWonForState state issuesAddressed
  | voteSum < votesToWin state = 0
  | otherwise = votesTotal state
  where
    votesFs = votes state
    voteSum = sum $ map (\x->votesFs!!x) $issuesAddressed


toIssueIndexes::Int->Int->[Int]
toIssueIndexes value bit
  | bit == -1 = []
  | value >= (2^bit) = [bit] ++ toIssueIndexes (value-(2^bit)) (bit-1)
  | otherwise = toIssueIndexes value (bit-1)

votesWonForStrategy::[State]->[Int]->Int
votesWonForStrategy states issuesAddressed = sum $ map (\state-> votesWonForState state issuesAddressed) states

findWinningStrategy::[State]->[(Int,Int)]->[[Int]]
findWinningStrategy states strategies = findWin 1
  where
    issuesLength = length $ votes (states!!0)
    findWin::Int->[[Int]]
    findWin issueCount
      | winningStrategies /= [] = winningStrategies
      | strats == [] = []
      | otherwise = findWin (issueCount+1)
      where
        strats = map (\x-> toIssueIndexes (snd x) issuesLength) $ filter (\x-> fst x == issueCount ) strategies
        winningStrategies = map fst $ filter (\x-> snd x >=270 ) $ map (\strategy-> (strategy,votesWonForStrategy states strategy)) strats


costOfWin::[(String,Int)]->[Int]->Int
costOfWin issues strategy = sum $ map (\x-> snd $ issues!!x) strategy

sortBySnd (_,a) (_,b)
  | a < b = LT
  | a > b = GT
  | otherwise = EQ

costStrategy::[(String,Int)]->[[Int]]->[([Int],Int)]
costStrategy issues strategys = sortBy sortBySnd $ map (\strategy->(strategy,costOfWin issues strategy)) strategys


chunkIt::Int->[String]->[[String]]
chunkIt size input
  | length input <= size = [input]
  | otherwise = [take size input] ++ chunkIt size (drop size input)

runningForPresident::[String]->[String]
runningForPresident input = sort $ map (\s->fst $ issues!!s ) $ fst $ head $ costStrategy issues $ findWinningStrategy states strategies
  where
    issueCnt = (\x-> read x::Int) $ last $ splitOn ":" (input!!0)
    issues = parseIssues $ take issueCnt $ drop 1 input
    issueNames = map fst issues
    states = map (\x->parseState x issueNames) $ chunkIt (issueCnt+2) $  drop (issueCnt+1) input
    strategies = map (\x -> (popCount x,x)) [1..((2^(issueCnt))-1)]

issueStrings = ["Healthcare: 85780873","Immigration: 91923422","Education: 86385627","Energy independence: 23211128","Jobs: 94441904","Taxes: 75069135","The environment: 34686799","Creating jobs: 67636333","Wealth inequality: 99683878","Increase military spending: 77950561"]
stateInfo = ["Mississippi","Votes: 6 ","Creating jobs: 1","Jobs: 1","Wealth inequality: 0","Immigration: 1","Taxes: 0","The environment: 0","Healthcare: 0","Increase military spending: 1","Education: 0","Energy independence: 2"]
mississippi = State {name = "Mississippi", votesToWin = 4, votesTotal = 6, votes = [0,1,0,2,1,0,0,1,0,1]}

test = hspec $ do
  describe "parse - " $ do 
    it "parseIssues" $ do parseIssues issueStrings `shouldBe` [("Healthcare",85780873),("Immigration",91923422),("Education",86385627),("Energy independence",23211128),("Jobs",94441904),("Taxes",75069135),("The environment",34686799),("Creating jobs",67636333),("Wealth inequality",99683878),("Increase military spending",77950561)]
    it "votes require 6" $ do votesRequired 6 51 `shouldBe` 4
    it "votes require 100" $ do votesRequired 100 51 `shouldBe` 51
    it "votes require 101" $ do votesRequired 101 51 `shouldBe` 52
    it "parseState" $ do parseState stateInfo (map fst $ parseIssues issueStrings) `shouldBe` State {name = "Mississippi", votesToWin = 4, votesTotal = 6, votes = [0,1,0,2,1,0,0,1,0,1]}
    it "votesWonForState won [7,3]" $ do votesWonForState mississippi [7,3] `shouldBe` 0
    it "votesWonForState won [7,3,2,1]" $ do votesWonForState mississippi [7,3,2,1] `shouldBe` 6

-- Needs more tests !

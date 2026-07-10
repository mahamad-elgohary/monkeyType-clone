import { generate } from "https://esm.sh/random-words";
const typingArea = document.querySelector('#typingInput');
const targetTextArea = document.querySelector('.text-container').querySelector('#paragraph');
const settingsCont = document.querySelector('.settings');
const timeCard = document.querySelector('#time');
const wpmCard = document.querySelector('#wpm')
const cpmCard = document.querySelector('#cpm');
const accuracyCard = document.querySelector('#accuracy');
const errorsCard = document.querySelector('#errors');
const progressBar = document.querySelector('#progressBar');
const restartBtn = document.querySelector('#restartBtn');
const newTextBtn = document.querySelector('#newTextBtn');
const BestWpmCard = document.querySelector('#bestWpm');
const testCompletedCard = document.querySelector('#testsCompleted');
//words and chars vars
let wordsNumber = 15;
let targetText = '';
let currChar = 0;
let currWord = 0;
//timevars
let timeVal = 0;
let currentTimeSpan;
let timeout;
let activeBtn = settingsCont.querySelector('[data-time="30"]');
//errorsvars
// let oldWordFinshedFlag = false;
let finished = false;
let currentWordNoErrors = true;
let errorsStack = [];//{currChar}
let currCharInCurrWord = 0;
//random text gen
targetText = generate({exactly: wordsNumber, join: ' '}).trim();
let targetTextWords = targetText.trim().split(' ');
let checkedWordsArr = new Array(targetTextWords.length).fill(false);
targetTextArea.textContent = targetText;
// console.log(targetTextWords);
//initialize the time to 30 seconds by default
timeCard.textContent = 30;//to store the active one in the local storage and get the value from it later
//event listners
const startingEvent = typingArea.addEventListener('keydown', startTypingAction)
const typingEvent   = typingArea.addEventListener('keydown', typingAction);
const restartEvent  = restartBtn.addEventListener('click', restartTypingTest);  

settingsCont.addEventListener('click', (e) => {
    let closestBtn = e.target.closest('.time-btn');
    let btn30 = settingsCont.querySelector('[data-time="30"]');
    let btn60 = settingsCont.querySelector('[data-time="60"]');
    let btn120 = settingsCont.querySelector('[data-time="120"]');
    if(!closestBtn)return;
    if(e.target.dataset.time  == '30')
    {
        timeCard.textContent = 30;
        if(btn60.classList.contains('active'))
            btn60.classList.remove('active');

        if(btn120.classList.contains('active'))
            btn120.classList.remove('active');
        btn30.classList.add('active');
        activeBtn = btn30;
    }
    else if(e.target.dataset.time  == '60')
    {
        timeCard.textContent = 60; 
        if(btn30.classList.contains('active'))
            btn30.classList.remove('active');

        if(btn120.classList.contains('active'))
            btn120.classList.remove('active');
        btn60.classList.add('active');  
        activeBtn = btn60;
    }
    else if(e.target.dataset.time  == '120')
    {
        timeCard.textContent = 120;
        if(btn30.classList.contains('active'))
            btn30.classList.remove('active');

        if(btn60.classList.contains('active'))
            btn60.classList.remove('active');
        btn120.classList.add('active');
        activeBtn = btn120;
    }
})

//different actions
function restartTypingTest()
{
    let timeInitialStamp = Number(activeBtn.dataset.time);
    timeCard.textContent =   timeInitialStamp;
    wpmCard.textContent = 0;
    cpmCard.textContent = 0;
    errorsCard.textContent = 0;
    typingArea.disabled = false;
}

function typingAction(e) {
    if(e.key != "Backspace")
    {
        if(targetText[currChar] == e.key)
        {
            let cpmVal = Number(cpmCard.textContent);
            cpmVal++;
            cpmCard.textContent = cpmVal;
            currCharInCurrWord++;
        }
        else{
            currentWordNoErrors = false;
            let errorsVal = Number(errorsCard.textContent);
            errorsVal++;
            errorsCard.textContent = errorsVal;
            errorsStack.push(currChar);
            currCharInCurrWord++;
        }

        if(targetText[currChar] == ' ' && e.key == ' ' && !checkedWordsArr[currWord] && currentWordNoErrors)
        {
            checkedWordsArr[currWord] = true;
            currWord++;
            let wpmVal = Number(wpmCard.textContent);
            wpmVal++;
            wpmCard.textContent = wpmVal;
            currentWordNoErrors = true;
            // oldWordFinshedFlag = true;
            currCharInCurrWord = 0;
            console.log(`Word ${currWord} finished with no errors`);
        }
        currChar++;
    }
    else
    {
     //check what was written in the typing area then erase the word error flag if the backspace erased this wrong letter to give the chance to write the word right and add it to the wpm if completed right
    let typingAreaTextCurrChar = typingArea.value.at(currChar);
    let checkIsRightNow = false;
    if(typingAreaTextCurrChar != targetText[currChar]  && errorsStack.length > 0 && errorsStack.at(-1) == currChar)
    {   
        checkIsRightNow = true;
        errorsStack.pop();
        let currWord = targetTextWords[currWord];
        let currCharCpy = currChar - 1;
        
        for(let i = currCharInCurrWord;i >= 0;i--,currCharCpy--)
        {
            typingAreaTextCurrChar = typingArea.value.at(currCharCpy);
            if(typingAreaTextCurrChar != currWord.at(i))
                checkIsRightNow = false;
            console.log(`Typing Area Char: ${typingAreaTextCurrChar} | Target Text Char: ${currWord.at(i)}`);
        }

        if(checkIsRightNow)
        {
            currentWordNoErrors = true;
        }
    }
    currCharInCurrWord--;
    currChar--;
    }

    if(currWord == targetTextWords.length && timeVal > 0)
    {
        finished = true;
        let wpmVal = Number(wpmCard.textContent);
        let bestWpmVal = Number(BestWpmCard.textContent);
        let testsCompleted = Number(testCompletedCard.textContent);
        if(wpmVal > bestWpmVal)
        {
            BestwpmCard.textContent = bestWpmVal;
        }
        testsCompleted++;
        typingArea.disabled = true;
        testCompletedCard.textContent = testsCompleted;
        clearInterval(timeout);
        typingArea.removeEventListener('keydown', typingAction);
    }
}

function startTimer(){
     timeout = setInterval(() => {
        timeVal = Number(timeCard.textContent);
        timeVal--;
        timeCard.textContent = timeVal;
        if(timeVal < 1){
        //add the stats  
            if(!finished)
            {
            let wpmVal = Number(wpmCard.textContent);
            let bestWpmVal = Number(BestWpmCard.textContent);
            let testsCompleted = Number(testCompletedCard.textContent);
            if(wpmVal > bestWpmVal)
            {
                BestWpmCard.textContent = wpmVal;
            }
            testsCompleted++;
            testCompletedCard.textContent = testsCompleted;
            typingArea.disabled = true;
            typingArea.removeEventListener('keydown', typingAction); 
            }
     clearInterval(timeout);
    }
}, 1000);
}

function startTypingAction()
{
   startTimer();
    typingArea.removeEventListener('keydown', startTypingAction);
}

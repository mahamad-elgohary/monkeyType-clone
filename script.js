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
let btn30 = settingsCont.querySelector('[data-time="30"]');
let btn60 = settingsCont.querySelector('[data-time="60"]');
let btn120 = settingsCont.querySelector('[data-time="120"]');
let wordsNumber = 5;
let statsObj = JSON.parse(localStorage.getItem('data')) || { BestWpmCard:0, testCompletedCard:0
    , activeTime: 30
};
BestWpmCard.textContent = statsObj.BestWpmCard || 0;
testCompletedCard.textContent = statsObj.testCompletedCard || 0;
let activeBtn;
if(statsObj.activeTime == 30)
{
    timeCard.textContent = 30;
        if(btn60.classList.contains('active'))
            btn60.classList.remove('active');

        if(btn120.classList.contains('active'))
            btn120.classList.remove('active');
        btn30.classList.add('active');
        activeBtn = btn30;
}
else if(statsObj.activeTime == 60)
{
    timeCard.textContent = 60; 
        if(btn30.classList.contains('active'))
            btn30.classList.remove('active');

        if(btn120.classList.contains('active'))
            btn120.classList.remove('active');
        btn60.classList.add('active');  
        activeBtn = btn60;
}
else if(statsObj.activeTime == 120)
{
    timeCard.textContent = 120;
        if(btn30.classList.contains('active'))
            btn30.classList.remove('active');

        if(btn60.classList.contains('active'))
            btn60.classList.remove('active');
        btn120.classList.add('active');
        activeBtn = btn120;
}
//regarded keys only
const englishRegex = /^[A-Za-z0-9\s.,!?'"()_+\-=\[\]{};:@#\$%^&\*`~<>\\\/|]$/
//random text gen
let targetText = generate({exactly: wordsNumber, join: ' '}).trim();
let targetTextWords = targetText.trim().split(' ');
let checkedWordsArr = new Array(targetTextWords.length).fill(false);
//words and chars vars
let currChar = 0;
let currWord = 0;
let lastWordright = false;
let isOvertyping = false;
let thisWordWritten = [];
let typedWords = [];
//timevars
let timeVal = 0;
let currentTimeSpan;
let timeout;
//errorsvars
// let oldWordFinshedFlag = false;
let finished = false;
let currentWordNoErrors = true;
let errorsStack = [];//{currChar}
let currCharInCurrWord = 0;
let chckedWordsArr = new Array(targetTextWords.length).fill(false);
//disregarded keys
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const modifierKeys = ['Control', 'Shift', 'Alt', 'Enter', 'CapsLock', 'Tab', 'Escape'];

targetTextArea.textContent = targetText;
// console.log(targetTextWords);
//initialize the time to 30 seconds by default

//to store the active one in the local storage and get the value from it later
//event listners
let startingEvent = typingArea.addEventListener('keydown', startTypingAction);
let typingEvent;
const restartEvent  = restartBtn.addEventListener('click', restartTypingTest);  
const settingsUpdateEvent = settingsCont.addEventListener('click', settingsUpdateAction);
const newTextEvent = newTextBtn.addEventListener('click', newTextAction);
//different actions
function saveStats(){
    statsObj = { BestWpmCard:Number(BestWpmCard.textContent), testCompletedCard:Number(testCompletedCard.textContent)
        ,activeTime:activeBtn.dataset.time
    };
    console.log(statsObj);
    localStorage.setItem('data', JSON.stringify(statsObj));
    statsObj = JSON.parse(localStorage.getItem('data'))
}
function newTextAction(e){
    targetText = generate({exactly: wordsNumber, join: ' '}).trim();
    targetTextWords = targetText.trim().split(' ');
    targetTextArea.textContent = targetText;
    restartTypingTest();    
}
function settingsUpdateAction(e){
    let closestBtn = e.target.closest('.time-btn');
   
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
    restartTypingTest();
}
function restartTypingTest()
{
    clearInterval(timeout);
    typingArea.removeEventListener('keydown', typingAction);
    let timeInitialStamp = Number(activeBtn.dataset.time);
    timeCard.textContent = timeInitialStamp;
    wpmCard.textContent = 0;
    cpmCard.textContent = 0;
    errorsCard.textContent = 0;
    // currChar = 0;
    currWord = 0;
    finished = false;
    currCharInCurrWord = 0;
    lastWordright = false;
    typingArea.value = "";
    isOvertyping = false;
    thisWordWritten = [];
    typingArea.disabled = false;
    currentWordNoErrors = true;
    saveStats();
    errorsStack.splice(0, errorsStack.length);
    checkedWordsArr = new Array(targetTextWords.length).fill(false);
    startingEvent = typingArea.addEventListener('keydown', startTypingAction);
    // typingEvent   = typingArea.addEventListener('keydown', typingAction);
}

function checkIfFinished(){
    if(currWord == targetTextWords.length && timeVal > 0)
    {
        finished = true;
        let wpmVal = Number(wpmCard.textContent);
        let bestWpmVal = statsObj.BestWpmCard;
        let testsCompleted = statsObj.testCompletedCard;
        if(wpmVal > bestWpmVal)
        {
            BestWpmCard.textContent = wpmVal;
        }
        accuracyCard.textContent = wpmCard.textContent / (wpmCard.textContent + errorsCard.textContent) * 100;
        testsCompleted++;
        typingArea.disabled = true;
        testCompletedCard.textContent = testsCompleted;
        clearInterval(timeout);
        typingArea.removeEventListener('keydown', typingAction);
        console.log("words finished");
        saveStats();
        return;
    }
    }
function typingAction(e) {
if(arrowKeys.includes(e.key) || modifierKeys.includes(e.key))return;
    
if(e.key != "Backspace")
{
    if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key == ' ' && currentWordNoErrors)
    {
        //checkedWordsArr[currWord] = true;
        let wpmVal = Number(wpmCard.textContent);
        wpmVal++;
        wpmCard.textContent = wpmVal;
        lastWordright = true;
        currCharInCurrWord = 0;
        typedWords.push(thisWordWritten.join(''));
        thisWordWritten = [];
        checkedWordsArr[currWord] = true;
        currentWordNoErrors = true;
        console.log("case 1");
        console.log(`Word ${currWord} ${targetTextWords[currWord]} finished with no errors`);
        currWord++;
        checkIfFinished()
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key == ' ' && !currentWordNoErrors)
    {
        //checkedWordsArr[currWord] = true;
        //currentWordNoErrors = true;
        currCharInCurrWord = 0;
        console.log("case 2");
        console.log(`Word ${currWord} ${targetTextWords[currWord ]} finished with errors`);
        currWord++;
        typedWords.push(thisWordWritten.join(''));
        thisWordWritten = [];
        lastWordright = false;
        currentWordNoErrors = true;
        checkedWordsArr[currWord] = false;
        checkIfFinished()
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key != ' ')
    {
        let errorsVal = Number(errorsCard.textContent);
        errorsVal++;
        errorsStack.push({currWord:currWord,
                            currChar:currCharInCurrWord});
        thisWordWritten.push(e.key);
        errorsCard.textContent = errorsVal;
        isOvertyping = true;
        console.log("case 3");
        currentWordNoErrors = false;
        console.log(`Word ${currWord} ${targetTextWords[currWord ]}  is being overtyped`);
        return;
    }
    else if(currCharInCurrWord < targetTextWords[currWord].length && e.key == ' ')
    {
        currentWordNoErrors = true;
        currCharInCurrWord = 0;
        checkedWordsArr[currWord] = false;
        lastWordright = false;
        console.log("case 9");
        console.log(`Word ${currWord} ${targetTextWords[currWord]} unfinshed and space pressed`);
        currWord++;
        checkIfFinished()
        return;
    }
    
    if(targetTextWords[currWord][currCharInCurrWord] == e.key)
    {
        let cpmVal = Number(cpmCard.textContent);
        cpmVal++;
        cpmCard.textContent = cpmVal;
        thisWordWritten.push(e.key);
        console.log("case 4");
        console.log(`Word ${currWord} char ${currCharInCurrWord} is correct | Target Text Char: ${targetTextWords[currWord][currCharInCurrWord]} | Typed Char: ${e.key}`);
    }
    else{
        currentWordNoErrors = false;
        let errorsVal = Number(errorsCard.textContent);
        errorsVal++;
        errorsStack.push({currWord:currWord,
                            currChar:currCharInCurrWord});
        errorsCard.textContent = errorsVal;
        thisWordWritten.push(e.key);
        errorsStack.push({currWord:currWord,
                            currChar:currCharInCurrWord});
        console.log("case 5");
        console.log(`Word ${currWord} char ${currCharInCurrWord} is wrong | Target Text Char: ${targetTextWords[currWord][currCharInCurrWord]} | Typed Char: ${e.key}`);
    }
    currCharInCurrWord++;
}
else
{
    if(currWord > 0 && checkedWordsArr[currWord - 1] && currCharInCurrWord == 0)
        lastWordright = true;
    //check what was written in the typing area then erase the word error flag if the backspace erased this wrong letter to give the chance to write the word right and add it to the wpm if completed right
    //if the last word is all right stop the backspace from going to the previous word 
    if(currCharInCurrWord == 0 && currWord > 0)
    {
        if(lastWordright)
        {
            console.log("case 6");
            e.preventDefault();
            return;
        }
        currWord--;
        currCharInCurrWord = targetTextWords[currWord].length;
        console.log("case 10");
        console.log(`${targetTextWords[currWord]} is the current word`);
        currCharInCurrWord = targetTextWords[currWord].length;
        return;
    }

    let typingAreaTextCurrChar = typingArea.value.at(-1);
    let checkIsRightNow = false;
    let currentWord = Array.from(targetTextWords[currWord]);
    if(currCharInCurrWord <= targetTextWords[currWord].length)
    {
    if(typingAreaTextCurrChar != targetTextWords[currWord][currCharInCurrWord] && errorsStack.length > 0 && errorsStack.at(-1) == {currWord:currWord,                                                                                                                              currChar:currCharInCurrWord})
    {   
        checkIsRightNow = true;
        errorsStack.pop();
        let currCharCpy = currCharInCurrWord;
        let i = currCharCpy
        for(;i >= 0;i--,currCharCpy--)
        {
            typingAreaTextCurrChar = typingArea.value.at(currCharCpy);
            if(typingAreaTextCurrChar != currentWord.at(i)){
                checkIsRightNow = false;
                console.log(`case 11 the currentwordnoerrors is still false`);
            }
            console.log(`Typing Area Char: ${typingAreaTextCurrChar} | Target Text Char: ${currentWord.at(i)}`);
        }
        if(checkIsRightNow)
        {
            currentWordNoErrors = true;
            console.log(`case 12 the currentwordnoerrors is now true`);

        }
        console.log("case 7");
        console.log(`backing to the last char ${currCharInCurrWord} in word ${currWord} to erase the wrong`);
    }
    else 
        console.log(`typing area char: ${typingAreaTextCurrChar} | target text char: ${targetTextWords[currWord][currCharInCurrWord]} | errors stack length: ${errorsStack.length} | last error in stack: ${errorsStack.at(-1)}`);
    currCharInCurrWord--;
    if(currCharInCurrWord < 0){currCharInCurrWord = 0;
    }
    }
    else
    {
    
    if(thisWordWritten.length > targetTextWords[currWord].length && errorsStack.length > 0 && errorsStack.at(-1) == {currWord:currWord, currChar:currCharInCurrWord})
    {
        errorsStack.pop();
    }
    console.log("case 8");
    }
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
            let bestWpmVal = statsObj.BestWpmCard;
            let testsCompleted = statsObj.testCompletedCard;
            if(wpmVal > bestWpmVal)
            {
                BestWpmCard.textContent = wpmVal;
            }
            testsCompleted++;
            accuracyCard.textContent = wpmCard.textContent / (wpmCard.textContent + errorsCard.textContent) * 100;
            testCompletedCard.textContent = testsCompleted;
            typingArea.disabled = true;
            typingArea.removeEventListener('keydown', typingAction); 
            console.log("time finished");
            saveStats();
            }
     clearInterval(timeout);
    }
}, 1000);
}
function startTypingAction(e)
{
    if(e.key != 'Backspace' && e.key != ' ' &&
         !arrowKeys.includes(e.key) && !modifierKeys.includes(e.key))
    {
        startTimer();
        typingEvent = typingArea.addEventListener('keydown', typingAction);
        typingArea.removeEventListener('keydown', startTypingAction);
        typingArea.dispatchEvent(new KeyboardEvent('keydown', {'key': e.key}));
    }
    else 
    {
    e.preventDefault();
    }
}
window.addEventListener('DOMContentLoaded', () => {
  const entries = performance.getEntriesByType('navigation');
  
  if (entries.length > 0) {
    const navigationType = entries[0].type;
    
    if (navigationType === 'reload') {
      //console.log('This page was reloaded!');
      executeReloadAction();
    } else {
      console.log(`This page was loaded via: ${navigationType}`);
    }
  }
});
function executeReloadAction() {
    clearInterval(timeout);
    saveStats();
}

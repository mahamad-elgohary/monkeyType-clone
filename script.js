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
let activeBtn;
let statsFactor;
let statsObj = JSON.parse(localStorage.getItem('data')) || { BestWpmCard:0, testCompletedCard:0
    , activeTime: 30
};
BestWpmCard.textContent = statsObj.BestWpmCard || 0;
testCompletedCard.textContent = statsObj.testCompletedCard || 0;
setActiveBtn();
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
let overtypedChars = 0;
let thisWordWritten = [];
let typedWords = [];
//timevars
let timeVal = 0;
// let currentTimeSpan;
let timeout;
//errorsvars
let finished = false;
let starting = false;
let extraOvertypedChars = 0;
let currentWordNoErrors = true;
let errorsStack = [];//{currChar}
let currCharInCurrWord = 0;
let chckedWordsArr = new Array(targetTextWords.length).fill(false);
//disregarded keys
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const modifierKeys = ['Control', 'Shift', 'Alt', 'Enter', 'CapsLock', 'Tab', 'Escape'];

targetTextArea.innerHTML = targetText.split('').map(char => `<span data-typed="">${char}</span>`).join('');
targetTextArea.querySelectorAll('span')[currChar].classList.add('current');
//event listners
let startingEvent = typingArea.addEventListener('keydown', startTypingAction);
let typingEvent;
const restartEvent  = restartBtn.addEventListener('click', restartTypingTest);  
const settingsUpdateEvent = settingsCont.addEventListener('click', settingsUpdateAction);
const newTextEvent = newTextBtn.addEventListener('click', newTextAction);
if(starting)
    {
    targetTextArea.querySelectorAll('span')[currChar].classList.remove('current');
    starting = false;
    }
//different actions
function renderNewText()
{
    targetText = generate({exactly: wordsNumber, join: ' '}).trim();
    targetTextWords = targetText.trim().split(' ');
    targetTextArea.innerHTML = targetText.split('').map(char => `<span data-typed="">${char}</span>`).join('');
}
function renderText()
{
    targetTextArea.innerHTML = targetText.trim().split('').map(char => `<span data-typed="">${char}</span>`).join('');
}
function saveStats(){
    statsObj = { BestWpmCard:Number(BestWpmCard.textContent), testCompletedCard:Number(testCompletedCard.textContent)
        ,activeTime:activeBtn.dataset.time
    };
    localStorage.setItem('data', JSON.stringify(statsObj));
    statsObj = JSON.parse(localStorage.getItem('data'))
}
function newTextAction(e){
    renderNewText();
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
    currChar = 0;
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
    renderText();
    errorsStack.splice(0, errorsStack.length);
    checkedWordsArr = new Array(targetTextWords.length).fill(false);
    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar.classList.add('current');
    startingEvent = typingArea.addEventListener('keydown', startTypingAction);
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
        accuracyCard.textContent = Math.floor((1.0 * wpmCard.textContent / (wpmCard.textContent + errorsCard.textContent)) * 100);
        testsCompleted++;
        typingArea.disabled = true;
        testCompletedCard.textContent = testsCompleted;
        clearInterval(timeout);
        typingArea.removeEventListener('keydown', typingAction);
        saveStats();
        return;
    }
    }
let currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
function typingAction(e) {
if(arrowKeys.includes(e.key) || modifierKeys.includes(e.key))return;
if(starting)
{
targetTextArea.querySelectorAll('span')[currChar].classList.remove('current');
starting = false;
}
if(e.key != "Backspace")
{
    if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key == ' ' && currentWordNoErrors)
    {
        let wpmVal = Number(wpmCard.textContent);
        wpmVal += 1 * statsFactor;
        wpmCard.textContent = Math.floor(wpmVal);
        lastWordright = true;
        currCharInCurrWord = 0;
        checkedWordsArr[currWord] = true;
        currentWordNoErrors = true;
        currentStateChangingChar?.classList.remove('current')
        currWord++;
        currChar++;
        typedWords.push(thisWordWritten.join(''));
        thisWordWritten = [];
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current')
        checkIfFinished()
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key == ' ' && !currentWordNoErrors)
    {
        currCharInCurrWord = 0;
        checkedWordsArr[currWord] = false;
        currWord++;
        typedWords.push(thisWordWritten.join(''));
        thisWordWritten = [];
        lastWordright = false;
        currentWordNoErrors = true;
        currentStateChangingChar?.classList.remove('current')
        currChar++;
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current')
        checkIfFinished();
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key != ' ')
    {
        let errorsVal = Number(errorsCard.textContent);
        errorsVal++;
        errorsStack.push({currWord:currWord,
                            currChar:thisWordWritten.length});
        errorsCard.textContent = errorsVal;
        isOvertyping = true;
        overtypedChars++;
        currentWordNoErrors = false;
        thisWordWritten.push(e.key);
        const newSpan = document.createElement('span');
        newSpan.dataset.typed = e.key;
        newSpan.classList.add('wrong');
        newSpan.textContent = e.key;
        // newSpan.classList.add('wrong');
        currentStateChangingChar?.before(newSpan);
        console.log(`Word ${currWord} ${targetTextWords[currWord ]}  is being overtyped`);
        currChar++;
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        return;
    }
    else if(currCharInCurrWord < targetTextWords[currWord].length && e.key == ' ')
    {
        currentWordNoErrors = true;
        checkedWordsArr[currWord] = false;
        lastWordright = false;
        // console.log("case 9");
        typedWords.push(thisWordWritten.join(''));
        thisWordWritten = [];
        currentStateChangingChar?.classList.remove('current')
        currChar += targetTextWords[currWord].length - currCharInCurrWord + 1;
        currCharInCurrWord = 0;
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current')
        currWord++;           
        checkIfFinished();
        return;
    }
    
    if(targetTextWords[currWord][currCharInCurrWord] == e.key)
    {
        let cpmVal = Number(cpmCard.textContent);
        cpmVal+= 1 * statsFactor;
        cpmCard.textContent = Math.floor(cpmVal);
        currentStateChangingChar?.classList.remove('current');
        currentStateChangingChar?.classList.remove('wrong');
        currentStateChangingChar?.classList.add('correct');
        currentStateChangingChar.dataset.typed = e.key;
        currChar++;
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current')
        thisWordWritten.push(e.key);
    }
    else{
        currentWordNoErrors = false;
        let errorsVal = Number(errorsCard.textContent);
        errorsVal++;
        errorsStack.push({currWord:currWord,
                            currChar:currCharInCurrWord});
        currentStateChangingChar?.classList.add('wrong');
         currentStateChangingChar?.classList.remove('correct');
        currentStateChangingChar?.classList.remove('current')
        errorsCard.textContent = errorsVal;
        currentStateChangingChar.dataset.typed = e.key;
        // thisWordWritten.push(e.key);
        currChar++;
        thisWordWritten.push(e.key);
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current')
    }
    currCharInCurrWord++;
}
else
{
    if(currWord > 0 && checkedWordsArr[currWord - 1] && currCharInCurrWord == 0)
        lastWordright = true;
    let returnOnSpaceFlag = currWord > 0 && !checkedWordsArr[currWord - 1] && targetTextArea.querySelectorAll('span')[currChar - 1]?.textContent == ' ';
    if(returnOnSpaceFlag)
        {
        thisWordWritten = typedWords.pop().split('');
        currCharInCurrWord = thisWordWritten.length;
        currWord--;
        let errorFlag = errorsStack.length > 0;

        let diff = (targetTextWords[currWord].length - thisWordWritten.length);
        if(diff > 0)
             currChar = currChar - diff - 1;
        else 
            currChar = currChar - 1;
        checkedWordsArr[currWord] = false;
        currentStateChangingChar?.classList.remove('current');
        currentStateChangingChar?.classList.remove('wrong');
        currentStateChangingChar?.classList.remove('correct');
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.add('current');
        currentStateChangingChar?.classList.remove('wrong');
        currentStateChangingChar?.classList.remove('correct');
        return;
    }
    if(currCharInCurrWord == 0 && currWord == 0)
    {
        e.preventDefault();
        return;
    }
  
    let typingAreaTextCurrChar = targetTextArea.querySelectorAll('span')[currChar - 1].dataset.typed;
    let checkIsRightNow = false;
    let currentWord = Array.from(targetTextWords[currWord]);
    let errorFlag = errorsStack.length > 0 && (errorsStack.at(-1).currWord == currWord && errorsStack.at(-1).currChar == currCharInCurrWord - 1);
    let currentCharFlag = currChar > 0 && (typingAreaTextCurrChar != targetTextArea.querySelectorAll('span')[currChar - 1]?.textContent );
    if(thisWordWritten.length <= targetTextWords[currWord].length)
    {
          if(currCharInCurrWord == 0 && currWord > 0)
    {
        if(lastWordright)
        {
            console.log("case 7");
            e.preventDefault();
            return;
        }
        currWord--;
        thisWordWritten = typedWords.pop().split('');
        currCharInCurrWord = thisWordWritten.length - 1;
        checkedWordsArr[currWord] = false;
        currentStateChangingChar?.classList.remove('current')
        currentStateChangingChar?.classList.remove('wrong')
        currentStateChangingChar?.classList.remove('correct')
        currChar--; 
        currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
        currentStateChangingChar?.classList.remove('correct');
        currentStateChangingChar?.classList.remove('wrong');
        currentStateChangingChar?.classList.add('current')
        // currCharInCurrWord = targetTextWords[currWord].length - 1;
        return;
    }
    if(currentCharFlag && errorsStack.length > 0 && errorFlag)
    {   
        checkIsRightNow = true;
        errorsStack.pop();
        let i = currChar;
        errorsStack.forEach((error) => {
            if(error.currWord == currWord && error.currChar < currCharInCurrWord)
            {
                checkIsRightNow = false;
            }
         });

        if(checkIsRightNow)
        {
            currentWordNoErrors = true;
        }

    }
    currentStateChangingChar.dataset.typed = "";
    if(currCharInCurrWord > 0)
    currCharInCurrWord--;
    }
    else
    {
     checkIsRightNow = true;
    if(errorsStack.length > 0)
    {
        
        for(let i = errorsStack.length - 1; i >= 0; i--)
        {
            let error = errorsStack[i];
            if(error.currWord == currWord)
                {
                 errorsStack.pop();
                break;
                }
        } 
        if(errorsStack.length > 0){

            errorsStack.forEach((error) => {
                if(error.currWord == currWord )
                {
                    checkIsRightNow = false;
                }
            });
        }
        else
            checkIsRightNow = true;
        if(checkIsRightNow)currentWordNoErrors = true;
    }
    thisWordWritten.pop();

    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar - 1];

    currentStateChangingChar?.classList.remove('current')
    currentStateChangingChar?.classList.remove('wrong')
    currentStateChangingChar?.classList.remove('correct')
    currentStateChangingChar.remove();
    if(currCharInCurrWord > 0)
    currCharInCurrWord--;
    if(currChar > 0)
        currChar--;

    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar?.classList.add('current');
    return;
    }
    thisWordWritten.pop();
    currentStateChangingChar?.classList.remove('current')
    currentStateChangingChar?.classList.remove('wrong')
    currentStateChangingChar?.classList.remove('correct')
    if(currChar > 0)
    currChar--;   
    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar?.classList.add('current')
    currentStateChangingChar?.classList.remove('wrong')
    currentStateChangingChar?.classList.remove('correct')
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
            accuracyCard.textContent = Math.floor((1.0 * wpmCard.textContent / (wpmCard.textContent + errorsCard.textContent)) * 100);
            testCompletedCard.textContent = testsCompleted;
            typingArea.disabled = true;
            typingArea.removeEventListener('keydown', typingAction); 
            // renderText();
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
        starting = true;
        typingArea.removeEventListener('keydown', startTypingAction);
        typingArea.dispatchEvent(new KeyboardEvent('keydown', {'key': e.key}));
    }
    else 
    {
    e.preventDefault();
    }
}

function setActiveBtn(){
    if(statsObj.activeTime == 30)
{
    timeCard.textContent = 30;
        if(btn60.classList.contains('active'))
            btn60.classList.remove('active');

        if(btn120.classList.contains('active'))
            btn120.classList.remove('active');
        btn30.classList.add('active');
        activeBtn = btn30;
        statsFactor = 2;
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
        statsFactor = 1;
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
        statsFactor = .5;
}}

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
    if(starting)
    {
    targetTextArea.querySelectorAll('span')[currChar].classList.remove('current');
    starting = false;
    }
    saveStats();
}

import { generate } from "https://esm.sh/random-words";
const typingArea = document.querySelector('#typingInput');
const targetTextArea = document.querySelector('.text-container').querySelector('#paragraph');
const settingsCont = document.querySelector('.settings');
const typingOptionsCont = document.querySelector('.typing-options');
const timeCard = document.querySelector('#time');
const wpmCard = document.querySelector('#wpm')
const cpmCard = document.querySelector('#cpm');
const accuracyCard = document.querySelector('#accuracy');
const errorsCard = document.querySelector('#errors');
const restartBtn = document.querySelector('#restartBtn');
const newTextBtn = document.querySelector('#newTextBtn');
const BestWpmCard = document.querySelector('#bestWpm');
const testCompletedCard = document.querySelector('#testsCompleted');
const symbolsBtn = typingOptionsCont.querySelector('[data-option="symbols"]');
const numbersBtn = typingOptionsCont.querySelector('[data-option="numbers"]');
let btn30 = settingsCont.querySelector('[data-time="30"]');
let btn60 = settingsCont.querySelector('[data-time="60"]');
let btn120 = settingsCont.querySelector('[data-time="120"]');
let wordsNumber; 
let activeBtn;
let statsFactor;
let symbolsFlag;
let numbersFlag;
let symbolsActive;
let numbersActive;
let timeSpan;
let statsObj = JSON.parse(localStorage.getItem('data')) || { BestWpmCard:0, testCompletedCard:0
    , activeTime: 30, symbolsActive: false, numbersActive: false
};
symbolsActive = statsObj.symbolsActive;
numbersActive = statsObj.numbersActive;
BestWpmCard.textContent = statsObj.BestWpmCard || 0;
testCompletedCard.textContent = statsObj.testCompletedCard || 0;
setActiveBtn();
//regarded keys only
const englishRegex = /^[A-Za-z0-9\s.,!?'"()_+\-=\[\]{};:@#\$%^&\*`~<>\\\/|]$/
const punctuation = [".", ",", "!", "?", ";", ":", "&", "(", ")", "[", "]", "{", "}", "+", "=", "|"];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//random text gen
let targetText = generate({exactly: wordsNumber, join: ' '}).trim();
let targetTextWords = targetText.trim().split(' ');
let checkedWordsArr = new Array(targetTextWords.length).fill(false);
//words and chars vars
let currChar = 0;
let currWord = 0;
let cpmTemp = 0;
let errorsTemp = 0;
let wpmTemp = 0;
let lastWordright = false;
let thisWordWritten = [];
let typedWords = [];
//timevars
let timeVal = 0;
// let currentTimeSpan;
let timeout;
//errorsvars
let finished = false;
let starting = false;
let currentWordNoErrors = true;
let errorsStack = [];//{currChar}
let currCharInCurrWord = 0;
let chckedWordsArr = new Array(targetTextWords.length).fill(false);
//disregarded keys
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const modifierKeys = ['Control', 'Shift', 'Alt', 'Enter', 'CapsLock', 'Tab', 'Escape'];
renderText();
targetTextArea.querySelectorAll('span')[currChar].classList.add('current');
//event listners
let startingEvent = typingArea.addEventListener('keydown', startTypingAction);
let typingEvent;
const restartEvent  = restartBtn.addEventListener('click', restartTypingTest);  
const settingsUpdateEvent = settingsCont.addEventListener('click', settingsUpdateAction);
const typingOptionsUpdateEvent = typingOptionsCont.addEventListener('click', typingOptionsUpdateAction);
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
    targetTextArea.innerHTML = targetText.split(' ').map((word,idx) => {
     if(symbolsActive && numbersActive)
        {
            if(Math.random() < 0.5) {
            if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = word + punctuation[rnd];
                return word + punctuation[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = punctuation[rnd] + word ;
                return punctuation[rnd] + word;
            }
            }
            else
            {
            if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = word + numbers[rnd];
                return word + numbers[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = numbers[rnd] + word ;
                return numbers[rnd] + word;
            }
            }    
        }
        else if(symbolsActive && !numbersActive)
        {
             if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = word + punctuation[rnd];
                return word + punctuation[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = punctuation[rnd] + word ;
                return punctuation[rnd] + word;
            }
        }
        else if(!symbolsActive && numbersActive)
        {
             if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = word + numbers[rnd];
                return word + numbers[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = numbers[rnd] + word ;
                return numbers[rnd] + word;
            }
        }
    return word;
}).join(' ').split('').map(char => `<span data-typed="">${char}</span>`).join('');
    targetTextArea.innerHTML += `<span data-typed=""> </span>`;
}
function renderText()
{
    targetTextArea.innerHTML = targetText.split(' ').map((word,idx) => {
        if(symbolsActive && numbersActive)
        {
            if(Math.random() < 0.5) {
            if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = word + punctuation[rnd];
                return word + punctuation[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = punctuation[rnd] + word ;
                return punctuation[rnd] + word;
            }
            }
            else
            {
            if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = word + numbers[rnd];
                return word + numbers[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = numbers[rnd] + word ;
                return numbers[rnd] + word;
            }
            }    
        }
        else if(symbolsActive && !numbersActive)
        {
             if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = word + punctuation[rnd];
                return word + punctuation[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * punctuation.length);
                targetTextWords[idx] = punctuation[rnd] + word ;
                return punctuation[rnd] + word;
            }
        }
        else if(!symbolsActive && numbersActive)
        {
             if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = word + numbers[rnd];
                return word + numbers[rnd];
            }
            else if (Math.random() < 0.1) {
                let rnd = Math.floor(Math.random() * numbers.length);
                targetTextWords[idx] = numbers[rnd] + word ;
                return numbers[rnd] + word;
            }
        }
    return word;
}).join(' ').split('').map(char => `<span data-typed="">${char}</span>`).join('');
    targetTextArea.innerHTML += `<span data-typed=""> </span>`;
}
function saveStats(){
    
    statsObj = { BestWpmCard:Number(BestWpmCard.textContent), testCompletedCard:Number(testCompletedCard.textContent)
        ,activeTime:activeBtn.dataset.time, symbolsActive:symbolsBtn.classList.contains('active'), numbersActive:numbersBtn.classList.contains('active')
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
        timeSpan = 30;
        statsFactor = 2;
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
        timeSpan = 60;
        statsFactor = 1;
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
        timeSpan = 120;
        statsFactor = .5;
    }
    wordsNumber = activeBtn.dataset.time == 30 ? 80 : activeBtn.dataset.time == 60 ? 160 : 280;
    restartTypingTest();
}
function typingOptionsUpdateAction(e){
    if(e.target.dataset.option == 'symbols')
    {
        if(symbolsBtn.classList.contains('active'))
        {
            symbolsBtn.classList.remove('active');
            symbolsActive = false;
        }
        else
        {
            symbolsBtn.classList.add('active');
            symbolsActive = true;
        }
    }
    else if(e.target.dataset.option == 'numbers')
    {
        if(numbersBtn.classList.contains('active'))
        {
            numbersBtn.classList.remove('active');
            numbersActive = false;
        }
        else
        {
            numbersBtn.classList.add('active');
            numbersActive = true;
        }
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
     accuracyCard.textContent = "100%";
    cpmTemp = 0;
    wpmTemp = 0;
    errorsTemp = 0;
    currChar = 0;
    currWord = 0;
    finished = false;
    currCharInCurrWord = 0;
    lastWordright = false;
    typingArea.value = "";
    thisWordWritten = [];
    typedWords = [];
    typingArea.disabled = false;
    currentWordNoErrors = true;
    saveStats();
    renderNewText();
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
        let cpmVal = Number(cpmCard.textContent);
        let errorsVal = Number(errorsCard.textContent);
        let bestWpmVal = statsObj.BestWpmCard;
        let testsCompleted = statsObj.testCompletedCard;
        if(wpmVal > bestWpmVal)
        {
            BestWpmCard.textContent = wpmVal;
        }
        let netWpm = wpmVal - errorsVal;
        let acc;
        if(wpmVal > 0)
            acc = Math.ceil(((netWpm/wpmVal)) * 100);
        else 
            acc = 0; 
        accuracyCard.textContent = (acc?acc: 0) + "%";
        testsCompleted++;
        typingArea.disabled = true;
        testCompletedCard.textContent = testsCompleted;
        currentStateChangingChar?.classList.remove('current')
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
        let cpmVal = Number(cpmCard.textContent);
        let timeVal = Number(timeCard.textContent);
        incWordVars(e, true, 1, currWord + 1, 0, true, true);
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key == ' ' && !currentWordNoErrors)
    {
        incWordVars(e, false, 1, currWord + 1, 0, false, true);
        return;
    }
    else if(currCharInCurrWord ==  targetTextWords[currWord].length && e.key != ' ')
    {
        let errorsVal = Number(errorsCard.textContent);
        errorsTemp += 1;
        errorsVal = errorsTemp;
        errorsCard.textContent = Math.floor(errorsVal);
        errorsStack.push({currWord:currWord,
                            currChar:thisWordWritten.length});
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
    else if(currCharInCurrWord < targetTextWords[currWord].length && currCharInCurrWord > 0 && e.key == ' ')
    {
        incWordVars(e, false, targetTextWords[currWord].length - currCharInCurrWord + 1, currWord + 1, 0, false, true);
        return;
    }
    else if(currCharInCurrWord < targetTextWords[currWord].length && currCharInCurrWord == 0 && e.key == ' ')
    {
        e.preventDefault();
        return;
    }
    if(targetTextWords[currWord][currCharInCurrWord] == e.key)
    {
        let cpmVal = Number(cpmCard.textContent);
        let wpmVal = Number(wpmCard.textContent);
        let timeVal = Number(timeCard.textContent);
        cpmTemp += 1;
        cpmVal = cpmTemp;
        cpmCard.textContent = Math.floor(cpmVal);
        charState(true,e);

    }
    else{
        let errorsVal = Number(errorsCard.textContent);
        errorsTemp += 1;
        errorsVal = errorsTemp;
        let wpmVal = Number(wpmCard.textContent);
        errorsCard.textContent = Math.floor(errorsVal);
        errorsStack.push({currWord:currWord,
            currChar:currCharInCurrWord});
        currentWordNoErrors = false;
        charState(false,e);
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
        currWord--;
        if(thisWordWritten.length > targetTextWords[currWord].length)
        currCharInCurrWord = targetTextWords[currWord].length;
        else
        currCharInCurrWord = thisWordWritten.length;
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
        let errorsVal = Number(errorsCard.textContent);
        errorsTemp -= 1 ;
        if(errorsTemp < 0)errorsTemp = 0;
        errorsVal = errorsTemp;
        errorsCard.textContent = Math.floor(errorsVal);
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
    // if(currCharInCurrWord > 0)
    // currCharInCurrWord--;
     if(currChar > 0)
        currChar--;

    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar?.classList.add('current');
    let errorsVal = Number(errorsCard.textContent);
    if(errorsTemp < 0)errorsTemp = 0;
    errorsTemp -= 1;
    errorsVal = errorsTemp;
    errorsCard.textContent = Math.floor(errorsVal);
 
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
function incWordVars(e, checkedWordsCurrent,currCharTemp, currWordTemp, currCharInCurrWordTemp, lastWordRightTemp, currentWordNoErrorsTemp){
    checkedWordsArr[currWord] = checkedWordsCurrent;
    lastWordright = lastWordRightTemp;
    currentWordNoErrors = currentWordNoErrorsTemp;
    currChar += currCharTemp;
    currWord = currWordTemp;
    currCharInCurrWord = currCharInCurrWordTemp;
    typedWords.push(thisWordWritten.join(''));
    thisWordWritten = [];
    currentStateChangingChar?.classList.remove('current')
    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar?.classList.add('current')
    checkIfFinished();
}

function charState(isRight,e)
{
    if(isRight)
    { 
    currentStateChangingChar?.classList.remove('wrong');
    currentStateChangingChar?.classList.add('correct');
    }
    else
    {
    currentStateChangingChar?.classList.remove('correct');
    currentStateChangingChar?.classList.add('wrong');
    }
    currentStateChangingChar?.classList.remove('current');
    currentStateChangingChar.dataset.typed = e.key;
    currChar++;
    currentStateChangingChar = targetTextArea.querySelectorAll('span')[currChar];
    currentStateChangingChar?.classList.add('current')
    thisWordWritten.push(e.key);
}

function changeCurrentCharBack()
{
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
    let errorsVal = Number(errorsCard.textContent);
    errorsTemp -= 1 * statsFactor;
    errorVal = errorsTemp;
    errorsCard.textContent = Math.floor(errorVal);
}
function changeCurrentWordBack()
{
    thisWordWritten = typedWords.pop().split('');
    currWord--;
    if(thisWordWritten.length > targetTextWords[currWord].length)
    currCharInCurrWord = targetTextWords[currWord].length;
    else
    currCharInCurrWord = thisWordWritten.length;

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
}

function startTimer(){
     timeout = setInterval(() => {
        let wpmVal = Number(wpmCard.textContent);
        let cpmVal = Number(cpmCard.textContent);
        let errorsVal = Number(errorsCard.textContent);
        timeVal = Number(timeCard.textContent);
        timeVal--;
        timeCard.textContent = timeVal;
        if(timeVal < timeSpan)
        wpmTemp =  Math.ceil((cpmVal / 5) / ((timeSpan - timeVal)/60));
        else
            wpmTemp = 0;
        wpmCard.textContent = wpmTemp;
        if(timeVal < 1){
        //add the stats  
            if(!finished)
            {
            wpmVal = Number(wpmCard.textContent);
            cpmVal = Number(cpmCard.textContent);
            errorsVal = Number(errorsCard.textContent);
            let bestWpmVal = statsObj.BestWpmCard;
            let testsCompleted = statsObj.testCompletedCard;
            if(wpmVal > bestWpmVal)
            {
                BestWpmCard.textContent = wpmVal;
            }
            testsCompleted++;
            let netWpm = wpmVal - errorsVal;
            let acc;
            if(wpmVal > 0)
                acc = Math.ceil((((1.0 * netWpm)/wpmVal)) * 100) ;    
            else 
                acc = 0;
            accuracyCard.textContent = (acc?acc:0) + "%";
            testCompletedCard.textContent = testsCompleted;
            typingArea.disabled = true;
            currentStateChangingChar?.classList.remove('current')
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
        timeSpan = 30;
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
        timeSpan = 60;
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
        timeSpan = 120;
}
        wordsNumber = activeBtn? activeBtn.dataset.time == 30 ? 80 : activeBtn.dataset.time == 60 ? 160 : 280: statsObj.activeTime == 30 ? 80 : statsObj.activeTime == 60 ? 160 : 280;

if(statsObj.symbolsActive)
{
    symbolsBtn.classList.add('active');
    symbolsActive = true;
}
if(numbersActive)
{
    numbersBtn.classList.add('active');
    numbersActive = true;
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
    if(starting)
    {
    targetTextArea.querySelectorAll('span')[currChar].classList.remove('current');
    starting = false;
    }
    setActiveBtn();
    saveStats();
}

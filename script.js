import { generate } from "https://esm.sh/random-words";
const typingArea = document.querySelector('#typingInput');
const targetTextArea = document.querySelector('.text-container').querySelector('#paragraph');
const settingCont = document.querySelector('.settings');
const timeCard = document.querySelector('#time')
const wpmCard = document.querySelector('#wpm')
const cpmCard = document.querySelector('#cpm');
const accuracyCard = document.querySelector('#accuracy');
const errorsCard = document.querySelector('#errors');
const progressBar = document.querySelector('#progressBar');
const restartBtn = document.querySelector('#restartBtn');
const newTextBtn = document.querySelector('#newTextBtn');
const BestwpmCard = document.querySelector('#bestWpm');
const testCompletedCard = document.querySelector('#testCompleted');

let targetText = '';
targetText = generate({exactly: 30, join: ' '});
targetTextArea.textContent = targetText;
let now = Date.now();
console.log(now - Date.now());
typingArea.addEventListener('keydown', startTypingAction)

function startTypingAction()
{
    
    
    
    
}

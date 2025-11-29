// Score+status
let playerScore = 0;
let computerScore = 0;
let gameOver = false;

// elements
const choiceButton = document.querySelectorAll(".choice-btn");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const roundResultEl = document.getElementById("round-result");
const finalResultEl = document.getElementById("final-result");

function getComputerChoice(){
    const choices = ['rock', 'paper', 'scissors']
    return choices[Math.floor(Math.random() * 3)];
}

// rules
function getRoundResult(computer, player) {
    if(player === computer) return 'draw';  
    
    if (player == 'rock') {
    return (computer === 'scissors') ? 'player' : 'computer';
    } 
    if (player == 'paper') {
        return (computer === 'rock') ? 'player' : 'computer';
    }
    if (player == 'scissors') {
        return (computer === 'paper') ? 'player' : 'computer';
    }
    return 'invalid'
}
    
function resetGame(message = "click to start the match") {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;

    if(playerScoreEl) playerScoreEl.textContent ='0';
    if(computerScoreEl) computerScoreEl.textContent ='0';
    if(roundResultEl) roundResultEl.textContent = message;
    if(finalResultEl) finalResultEl.textContent = '';
}

function setChoiceClickEvent(handler) {
    choiceButton.forEach((btn) => {
        btn.addEventListener("click", () => {
            const choice = btn.dataset.choice;
            handler = choice;
        });
    });
}
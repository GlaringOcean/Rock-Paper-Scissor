resetGame("click to start the match");

function playDefaultGame(playerChoice) {
    if(gameOver) resetGame("New match started. Click to play");

    // input validation
    if(!['rock', 'paper', 'scissors'].includes(playerChoice)) {
        return roundResultEl.textContent = "Invalid choice. Please click Rock, Paper, or Scissors";
    }
    const computerChoice = getComputerChoice();
    const result = getRoundResult(computerChoice, playerChoice);

    if(result === 'invalid') {
        return roundResultEl.textContent = "Something when wrong with the choices";
    }
    // score update
    if(result === 'player') {
        playerScore++;
        roundResultEl.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. You win this round!`;
    }
    else if (result === 'computer') {
        computerScore++;
        roundResultEl.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. Computer Win this round!`;
    }
    else {
        roundResultEl.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. It's a draw!`;
    }
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;

    if(playerScore === 2 || computerScore === 2) {
        gameOver = true;

        if(playerScore > computerScore){
            finalResultEl.textContent = "You win the match! Click to play again."
        }
        else {
            finalResultEl.textContent = "You lose the match! Click to try again."
        }
    }
    else {
        finalResultEl.textContent = "";
    }
}

setChoiceClickEvent(playDefaultGame);
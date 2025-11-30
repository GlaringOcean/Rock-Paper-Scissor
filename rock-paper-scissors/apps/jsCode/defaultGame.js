const ROUND_DURATION = 5;

let isRoundActive = false;
let currentRound = 1;

let roundInterval = null;
let roundTimeoutId = null;

const timerEl = document.getElementById("timer");
const btnPlayAgain = document.getElementById("btn-playagain");
const btnChangeMode = document.getElementById("btn-changemode");

function setTimerText(text) {
    if (timerEl) timerEl.textContent = text;
}

function startRound() {
    if (gameOver) return;

    isRoundActive = true;
    clearMainCards();

    let timeLeft = ROUND_DURATION;
    setTimerText(`Time left: ${timeLeft}s`);
    showRoundMessage(`Round ${currentRound} – choose your move.`);

    roundInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
        setTimerText(`Time left: ${timeLeft}s`);
        } else {
        clearInterval(roundInterval);
        }
    }, 1000);

    roundTimeoutId = setTimeout(() => {
        if (!isRoundActive) return;
        isRoundActive = false;

        clearInterval(roundInterval);
        setTimerText("Time's up");

        // RANDOM PLAYER CHOICE
        const randomPlayer = getComputerChoice();
        handleRoundEnd(randomPlayer, true, afterRound);
    }, ROUND_DURATION * 1000);
}

// DELAY
function handleRoundEnd(playerChoice, didTimeout, callbackNext) {
    if (gameOver) return;
    const computerChoice = getComputerChoice();
    const result = getRoundResult(computerChoice, playerChoice);
    
    let detailText;
    if (result === "draw") {
        detailText = `${cap(playerChoice)} and ${cap(computerChoice)} are the same. It's a draw.`;
    } 
    else {
        const winnerChoice = (result === "player") ? playerChoice : computerChoice;
        const loserChoice  = (result === "player") ? computerChoice : playerChoice;

        detailText = `${cap(winnerChoice)} defeats ${cap(loserChoice)}.`;
}

    // SCORING+POPUP
    function finishWithPopup() {
        if (result === "draw") {
        showRoundMessage(detailText);

        openRoundPopup({
            header: "Draw",
            detail: detailText,
            main: "IT'S A DRAW!",
            score: `Score: ${playerScore} – ${computerScore}`,
            hint: "Click anywhere to replay this round.",
            playerImg: choiceToImg[playerChoice],
            playerAlt: cap(playerChoice),
            computerImg: choiceToImg[computerChoice],
            computerAlt: cap(computerChoice),
            onClose() {
            clearMainCards();
            if (callbackNext) callbackNext("draw");
            },
        });
        return;
        }

        if (result === "player") playerScore++;
        else computerScore++;

        if (playerScoreEl) playerScoreEl.textContent = playerScore;
        if (computerScoreEl) computerScoreEl.textContent = computerScore;

        const roundMainText =
        result === "player" ? "YOU WIN THIS ROUND!" : "COMPUTER WINS THIS ROUND!";

        showRoundMessage(`${detailText} ${roundMainText}`);

        if (playerScore === 2 || computerScore === 2) {
            gameOver = true;

            openMatchPopup({
                header: "Match Result",
                detail: detailText,
                main:
                (playerScore > computerScore) ? "YOU WIN THE MATCH!" : "YOU LOSE THE MATCH!",
                score: `Final Score: ${playerScore} – ${computerScore}`,
                playerImg: choiceToImg[playerChoice],
                playerAlt: cap(playerChoice),
                computerImg: choiceToImg[computerChoice],
                computerAlt: cap(computerChoice),
            });
            return;
        }

        openRoundPopup({
            header: "Round Result",
            detail: detailText,
            main: roundMainText,
            score: `Score: ${playerScore} – ${computerScore}`,
            hint: "Click anywhere to start the next round.",
            playerImg: choiceToImg[playerChoice],
            playerAlt: cap(playerChoice),
            computerImg: choiceToImg[computerChoice],
            computerAlt: cap(computerChoice),

            onClose() {
                clearMainCards();
                if (callbackNext) callbackNext("next");
            },
        });
  }


    if (didTimeout) {
        // DISPLAY ALL CARD
        updateMainCards(playerChoice, computerChoice);
        setTimeout(finishWithPopup, DELAY_AFTER_COMPUTER_REVEAL);
    } 
    else {
        updateMainCards(playerChoice, null);
        setTimeout(() => {
            updateMainCards(playerChoice, computerChoice);
            setTimeout(finishWithPopup, DELAY_AFTER_COMPUTER_REVEAL);
        }, DELAY_BEFORE_COMPUTER);
    }
}

function afterRound(type) {
    if (gameOver) {
        setTimerText("Match finished");
        return;
    }

    if (type === "draw") {
        currentRound++;
        startRound();
    } 
    else {
        currentRound++;
        startRound();
    }
}

setChoiceClickEvent((choice) => {
    if (!isRoundActive || gameOver) return;

    isRoundActive = false;

    clearTimeout(roundTimeoutId);
    clearInterval(roundInterval);

    setTimerText("Waiting for result…");

    handleRoundEnd(choice, false, afterRound);
});

window.addEventListener("load", () => {
    resetScores();
    gameOver = false;
    currentRound = 1;
    clearMainCards();

    showRoundMessage("Get ready…");
    setTimerText("Match starts in 10s");

        startRulesPopup(10, () => {
        startRound();
    });
});

if (btnPlayAgain) {
    btnPlayAgain.addEventListener("click", () => {
        if (matchPopup) matchPopup.classList.remove("visible");

        resetScores();
        gameOver = false;
        currentRound = 1;
        clearMainCards();
        startRound();
        startRulesPopup(10, () => {
            startRound();
        });
    });
}

if (btnChangeMode) {
    btnChangeMode.addEventListener("click", () => {
        window.location.href = "/html/endlessGame.html";
    });
}
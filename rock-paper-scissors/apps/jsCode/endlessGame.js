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
    showRoundMessage(`Round ${currentRound} – stay alive and choose your move.`);

    roundInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
            setTimerText(`Time left: ${timeLeft}s`);
        } 
        else {
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
        handleEndlessRoundEnd(randomPlayer, true);
    }, ROUND_DURATION * 1000);
}

function handleEndlessRoundEnd(playerChoice, didTimeout) {
    if (gameOver) return;

    const computerChoice = getComputerChoice();
    const result = getRoundResult(computerChoice, playerChoice);

    let detailText;
    if (result === "draw") {
        detailText = `${cap(playerChoice)} and ${cap(
            computerChoice
        )} are the same. It's a draw.`;
    } 
    else {
        const winnerChoice = result === "player" ? playerChoice : computerChoice;
        const loserChoice = result === "player" ? computerChoice : playerChoice;
        detailText = `${cap(winnerChoice)} defeats ${cap(loserChoice)}.`;
    }

    function finishWithPopup() {
        if (result === "draw") {
            showRoundMessage(detailText);

            openRoundPopup({
                header: "Draw",
                detail: detailText,
                main: "IT'S A DRAW!",
                score: `Win Streak: ${playerScore}`,
                hint: "Click anywhere to replay this round.",
                playerImg: choiceToImg[playerChoice],
                playerAlt: cap(playerChoice),
                computerImg: choiceToImg[computerChoice],
                computerAlt: cap(computerChoice),
                onClose() {
                    clearMainCards();
                    currentRound++;
                    startRound();
                },
            });
            return;
        }

        if (result === "player") {
            playerScore++;
            if (playerScoreEl) playerScoreEl.textContent = playerScore;

            const roundMainText = "YOU WIN THIS ROUND!";
            showRoundMessage(`${detailText} ${roundMainText}`);

            openRoundPopup({
                header: "Round Result",
                detail: detailText,
                main: roundMainText,
                score: `Win Streak: ${playerScore}`,
                hint: "Click anywhere to continue your streak.",
                playerImg: choiceToImg[playerChoice],
                playerAlt: cap(playerChoice),
                computerImg: choiceToImg[computerChoice],
                computerAlt: cap(computerChoice),
                onClose() {
                    clearMainCards();
                    currentRound++;
                    startRound();
                },
            });
            return;
        }

        computerScore++;
        if (computerScoreEl) computerScoreEl.textContent = computerScore;

        gameOver = true;

        showRoundMessage(`${detailText} Your streak is over.`);
        openMatchPopup({
            header: "Endless Run Over",
            detail: detailText,
            main: "YOU LOST A ROUND!",
            score: `Win Streak: ${playerScore}`,
            playerImg: choiceToImg[playerChoice],
            playerAlt: cap(playerChoice),
            computerImg: choiceToImg[computerChoice],
            computerAlt: cap(computerChoice),
        });
    }

    if (didTimeout) {
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

setChoiceClickEvent((choice) => {
    if (!isRoundActive || gameOver) return;

    isRoundActive = false;

    clearTimeout(roundTimeoutId);
    clearInterval(roundInterval);

    setTimerText("Waiting for result…");

    handleEndlessRoundEnd(choice, false);
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
        window.location.href = "/html/defaultGame.html";
    });
}

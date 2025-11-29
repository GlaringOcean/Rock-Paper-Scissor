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


function afterRound(type) {
    if (gameOver) {
        setTimerText("Match finished");
        return;
    }

    if (type === "draw") {
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
    });
}

if (btnChangeMode) {
    btnChangeMode.addEventListener("click", () => {
        window.location.href = "endlessGame.html";
    });
}
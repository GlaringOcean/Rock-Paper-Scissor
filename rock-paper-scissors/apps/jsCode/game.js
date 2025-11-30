let playerScore = 0;
let computerScore = 0;
let gameOver = false;

// DOM SCOREBOARD
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const roundResultEl = document.getElementById("round-result");

// POPUP ROUND
const roundPopup = document.getElementById("round-popup");
const roundPopupHeader = document.getElementById("round-popup-header");
const roundPlayerImg = document.getElementById("round-player-img");
const roundComputerImg = document.getElementById("round-computer-img");
const roundPopupDetail = document.getElementById("round-popup-detail");
const roundPopupMain = document.getElementById("round-popup-main");
const roundPopupScore = document.getElementById("round-popup-score");
const roundPopupHint = document.getElementById("round-popup-hint");

// POPUP MATCH
const matchPopup = document.getElementById("match-popup");
const matchPopupHeader = document.getElementById("match-popup-header");
const matchPlayerImg = document.getElementById("match-player-img");
const matchComputerImg = document.getElementById("match-computer-img");
const matchPopupDetail = document.getElementById("match-popup-detail");
const matchPopupMain = document.getElementById("match-popup-main");
const matchPopupScore = document.getElementById("match-popup-score");

// CARD IN BOARD (Your Card / Computer Card)
const mainPlayerCard = document.getElementById("player-card-img");
const mainComputerCard = document.getElementById("computer-card-img");

const rulesOverlay = document.getElementById("rules-overlay");
const prematchTimerEl = document.getElementById("prematch-timer");

const DELAY_BEFORE_COMPUTER = 2000;
const DELAY_AFTER_COMPUTER_REVEAL = 3000

// IMAGE PATH
const choiceToImg = {
    rock: "/assets/Rock.png",
    paper: "/assets/Paper.png",
    scissors: "/assets/Scissors.png",
};

function startRulesPopup(duration, onFinish) {
    if (!rulesOverlay || !prematchTimerEl) return;
    rulesOverlay.classList.add("visible");

    let timeLeft = duration;
    prematchTimerEl.textContent = timeLeft;
    setTimerText(`Match starts in ${timeLeft}s`);

    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
            prematchTimerEl.textContent = timeLeft;
            setTimerText(`Match starts in ${timeLeft}s`);
        }
    }, 1000);

    const timeout = setTimeout(() => {
        clearInterval(interval);
        rulesOverlay.classList.remove("visible");
        if (onFinish) onFinish();
    }, duration * 1000);

    rulesOverlay.addEventListener("click",() => {
        rulesOverlay.classList.remove("visible");
    }, { once: true }
    );
}

function resetScores() {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;

    if (playerScoreEl) playerScoreEl.textContent = playerScore;
    if (computerScoreEl) computerScoreEl.textContent = computerScore;
}

function showRoundMessage(text) {
    if (roundResultEl) roundResultEl.textContent = text;
}

function getComputerChoice() {
    const arr = ["rock", "paper", "scissors"];
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRoundResult(computer, player) {
    if (computer === player) return "draw";

    const winMap = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };
    return winMap[player] === computer ? "player" : "computer";
}

function cap(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
}

function updateMainCards(playerChoice, computerChoice) {
    if (mainPlayerCard) {
        if (playerChoice) {
            mainPlayerCard.src = choiceToImg[playerChoice];
            mainPlayerCard.alt = cap(playerChoice);
            mainPlayerCard.classList.add("visible");
        } 
        else {
            mainPlayerCard.classList.remove("visible");
        }
    }
    if (mainComputerCard) {
        if (computerChoice) {
            mainComputerCard.src = choiceToImg[computerChoice];
            mainComputerCard.alt = cap(computerChoice);
            mainComputerCard.classList.add("visible");
        } 
        else {
            mainComputerCard.classList.remove("visible");
        }
    }
}

// USE AFTER MATCH/ROUND FINISH
function clearMainCards() {
    updateMainCards(null, null);
}


// POP UP
function openRoundPopup(config) {
    if (!roundPopup) return;

    roundPopupHeader.textContent = config.header;
    roundPopupDetail.textContent = config.detail;
    roundPopupMain.textContent = config.main;
    roundPopupScore.textContent = config.score;
    roundPopupHint.textContent = config.hint;

    roundPlayerImg.src = config.playerImg;
    roundPlayerImg.alt = config.playerAlt || "Your card";

    roundComputerImg.src = config.computerImg;
    roundComputerImg.alt = config.computerAlt || "Computer card";

    roundPopup.classList.add("visible");

    const close = () => {
        roundPopup.classList.remove("visible");
        roundPopup.removeEventListener("click", close);
        if (config.onClose) config.onClose();
    };
    roundPopup.addEventListener("click", close);
}

function openMatchPopup(config) {
    if (!matchPopup) return;

    matchPopupHeader.textContent = config.header;
    matchPopupDetail.textContent = config.detail;
    matchPopupMain.textContent = config.main;
    matchPopupScore.textContent = config.score;

    matchPlayerImg.src = config.playerImg;
    matchPlayerImg.alt = config.playerAlt || "Your card";

    matchComputerImg.src = config.computerImg;
    matchComputerImg.alt = config.computerAlt || "Computer card";

    matchPopup.classList.add("visible");
}

function setChoiceClickEvent(handler) {
    document.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
        const choice = btn.dataset.choice;
        
        if (!choice) return;
        handler(choice);
        });
    });
}

const btnQuit = document.getElementById("btn-quit");

if (btnQuit) {
    btnQuit.addEventListener("click", () => {
        window.location.href = "/html/home.html";
    });
}
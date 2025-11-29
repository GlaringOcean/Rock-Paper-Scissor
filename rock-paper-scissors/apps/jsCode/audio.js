const audio = document.getElementById("backsound-music");

    setInterval(() => {
        localStorage.setItem("music-time", audio.currentTime);
    }, 500);

const lastTime = localStorage.getItem("music-time");
if (lastTime) audio.currentTime = lastTime;
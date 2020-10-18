function saveGame() {
    localStorage.setItem("savedGame", JSON.stringify(gameData));
};

function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("savedGame"));
    gameData = {...gameData, ...savedGame};
};

function resetGame() {
    if (confirm("Are you sure that you would like to reset your save?")) {
        var newGame = {};
        localStorage.setItem("savedGame", JSON.stringify(newGame));
        location.reload();
    };
};
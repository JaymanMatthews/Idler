function saveGame() {
    localStorage.setItem("savedGame", JSON.stringify(game));
};

function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("savedGame"));
    game = {...game, ...savedGame};
};

function resetGame() {
    if (confirm("Are you sure that you would like to reset your save?")) {
        var newGame = {};
        localStorage.setItem("savedGame", JSON.stringify(newGame));
        location.reload();
    };
};
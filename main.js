var game = { coins: 0, coinsPerSec: 1, coinUpgUnlocked: [false, false, false, false], coinUpgEffect: [1, 2, 1.25, 1] };
var constants = { updateInterval: 33, saveInterval: 15000, coinUpgCost: [10, 50, 150, 500], base: [new Decimal(game.coinsPerSec), new Decimal(game.coinUpgEffect[0])], value: [] };
var cu = {
    cost: function(i) {
        return constants.coinUpgCost[i];
    },
    effect: function(i) {
        return game.coinUpgEffect[i];
    }
};

var cuDisplay = [
    costTextHide = function(i) {
        return (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[2][i]) : null;
    },
    costHide = function(i) {
        return (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[3][i]) : null;
    },
    effectTextShow = function(i) {
        return (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[9][i]) : null;
    },
    effectShow = function(i) {
        return (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[10][i]) : null;
    },
    nextShow = function(i) {
        return (game.coinUpgUnlocked[i]) ? (i < 3) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[5][i + 1]) : null : null;
    },
    boughtTextColor = function(i) {
        return (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.color = '#FFFFFF' : constants.value[5][i].style.color = '#000000';
    },
    boughtColor = function(i) {
        return (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.backgroundColor = '#000000' : constants.value[5][i].style.backgroundColor = '#FFFFFF';
    }
];

window.onload = function() {
    loadGame();
    initUI();
};

setInterval(tick(), constants.updateInterval);
setInterval(saveGame(), constants.saveInterval);

function tick() {
    return function() {
        updateGame();
        updateDisplay();
}};


function updateGame() {
    /*(game.coinUpgUnlocked[3]) ? (game.coinUpgEffects[2] = constants.baseValues[1].times(game.coinUpgEffects[3])) && (game.coinUpgEffects[3] = game.coinUpgEffects[0].div(2).add(10).log10()) : game.coinUpgEffects[2] && game.coinUpgEffects[3];*/
    if (game.coinUpgUnlocked[0]) {
        game.coinUpgEffect[0] = (game.coinUpgUnlocked[2]) ? constants.base[1].times(game.coins.add(2).log2()).pow(cu.effect(2)) : constants.base[1].times(game.coins.add(2).log2());
        game.coinsPerSec = (game.coinUpgUnlocked[1]) ? constants.base[0].times(cu.effect(0).times(cu.effect(1))) : constants.base[0].times(cu.effect(0));
    };
    game.coins = game.coins.add(game.coinsPerSec * (constants.updateInterval / 1000));
};

function updateDisplay() {
    constants.value[4][1].innerText = scientificNotation(game.coins);
    constants.value[4][3].innerText = scientificNotation(game.coinsPerSec);
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = (i == 2) ? "^" + scientificNotation(cu.effect(i)) : "x" + scientificNotation(cu.effect(i)); };
    for (i = 0; i < 4; i++) { for (j = 0; j < cuDisplay.length; j++) { cuDisplay[j](i); }};
};

function initUI() {
    for (i = 0; i < 4; i++) { game.coinUpgEffect[i] = new Decimal(game.coinUpgEffect[i]); };
    const cuTitles = new Array('Multiply coin gain per second based on current coins.', 'Multiply coin gain per second by 2.', 'Upgrade 3', 'Upgrade 4');
    const coinInfo = new Array('Coins:', scientificNotation(game.coins = new Decimal(game.coins)), 'Coins/s:', scientificNotation(game.coinsPerSec = new Decimal(game.coinsPerSec)));
    const tabTitles = new Array('Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog');
    const settingsTitles = new Array('Save Game', 'Reset Game');
    const settingsMethods = new Array(saveGame(), resetGame());

    constants.value[0] = 'Idle Game';
    document.title = constants.value[0];

    constants.value[1] = document.getElementsByClassName('cutitles');
    for (i = 0; i < 4; i++) { constants.value[1][i].innerText = cuTitles[i]; };

    constants.value[2] = document.getElementsByClassName('costtext');
    for (i = 0; i < 4; i++) { constants.value[2][i].innerText = 'Cost:'; };

    constants.value[3] = document.getElementsByClassName('cucosts');
    for (i = 0; i < 4; i++) { constants.value[3][i].innerText = scientificNotation(cu.cost(i)); };

    constants.value[4] = document.getElementsByClassName('coininfo');
    for (i = 0; i < 4; i++) { constants.value[4][i].innerText = coinInfo[i]; };

    constants.value[5] = document.getElementsByClassName('cubuttons');
    for (i = 0; i < 4; i++) { constants.value[5][i].onclick = coinUpgrade(i); };

    constants.value[6] = document.getElementsByClassName('tab');
    for (i = 0; i < 4; i++) { constants.value[6][i].innerText = tabTitles[i]; };

    constants.value[7] = document.getElementsByClassName('settingstext');
    for (i = 0; i < 2; i++) { constants.value[7][i].innerText = settingsTitles[i]; };

    constants.value[8] = document.getElementsByClassName('settingsbuttons');
    for (i = 0; i < 2; i++) { constants.value[8][i].onclick = settingsMethods[i]; };

    constants.value[9] = document.getElementsByClassName('effecttext');
    for (i = 0; i < 4; i++) { constants.value[9][i].innerText = 'Effect:'; };

    constants.value[10] = document.getElementsByClassName('cueffect');
};

function coinUpgrade(i) {
    return function() {
        if (game.coins >= constants.coinUpgCost[i] && game.coinUpgUnlocked[i] == false) {
            game.coinUpgUnlocked[i] = true;
            game.coins = game.coins.sub(constants.coinUpgCost[i]);
}}};

function scientificNotation(variable) {
    var string;
    if (variable >= 1000) {
        var exponent = (Math.floor(Math.log10(Math.abs(variable))));
        var mantissa = (variable / Math.pow(10, exponent));
        string = mantissa.toFixed(2) + "e" + exponent;
    }
    else {
        string = variable.toFixed(2);
    };
    return string;
};

function makeVisible(switchVar, var1, var2, id) {
    switch (switchVar) {
        case 1:
            if (var1 < var2) {
                id.style.display = "none";
            }
            else {
                id.style.display = "inline-block";
            };
            break;
        case 2:
            if (var1 >= var2) {
                id.style.display = "inline-block";
            }
            else {
                id.style.display = "none";
            };
            break;
        case 3:
            if (var1 == var2) {
                id.style.display = "inline-block";
            }
            else {
                id.style.display = "none";
            };
            break;
        case 4:
            if (var1 != var2) {
                id.style.display = "inline-block";
            }
            else {
                id.style.display = "none";
            };
            break;
    };
    return id.style.display;
};

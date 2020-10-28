var game = { coins: 0, coinsPerSec: 1, coinUpgUnlocked: [false, false, false, false], coinUpgEffect: [1, 2, 1.25, 1] };
var constants = { updateInterval: 33, saveInterval: 15000, coinUpgCost: [new Decimal(10), new Decimal(50), new Decimal(150), new Decimal(500)], base: [new Decimal(game.coinsPerSec), new Decimal(game.coinUpgEffect[0])], value: [] };

window.onload = function() {
    loadGame();
    initUI();
};

setInterval(function(){ tick(); }, constants.updateInterval);
setInterval(function(){ saveGame(); }, constants.saveInterval);

function tick() {
    updateGame();
    updateDisplay();
};

function updateGame() {
    /*game.coinUpgEffects[0] = (game.coinUpgUnlocked[2]) ? game.coinUpgEffects[0].pow(game.coinUpgEffects[2]) : game.coinUpgEffects[0];
    (game.coinUpgUnlocked[3]) ? (game.coinUpgEffects[2] = constants.baseValues[1].times(game.coinUpgEffects[3])) && (game.coinUpgEffects[3] = game.coinUpgEffects[0].div(2).add(10).log10()) : game.coinUpgEffects[2] && game.coinUpgEffects[3];*/
    if (game.coinUpgUnlocked[0]) {
        game.coinUpgEffect[0] = constants.base[1].times(game.coins.add(2).log2());
        game.coinsPerSec = (game.coinUpgUnlocked[1]) ? constants.base[0].times(game.coinUpgEffect[0].times(game.coinUpgEffect[1])) : constants.base[0].times(game.coinUpgEffect[0]);
    };
    game.coins = game.coins.add(game.coinsPerSec * (constants.updateInterval / 1000));
};

function updateDisplay() {
    constants.value[4][1].innerText = scientificNotation(game.coins);
    constants.value[4][3].innerText = scientificNotation(game.coinsPerSec);
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = (i == 3) ? "^" + scientificNotation(game.coinUpgEffect[i]) : "x" + scientificNotation(game.coinUpgEffect[i]); };
};

function initUI() {
    for (i = 0; i < 4; i++) { game.coinUpgEffect[i] = new Decimal(game.coinUpgEffect[i]); };
    const cuTitles = new Array('Multiply coin gain per second based on current coins.', 'Multiply coin gain per second by 2.', 'Upgrade 3', 'Upgrade 4');
    const coinInfo = new Array('Coins:', game.coins = new Decimal(game.coins), 'Coins/s:', game.coinsPerSec = new Decimal(game.coinsPerSec));
    const tabTitles = new Array('Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog');
    const settingsTitles = new Array('Save Game', 'Reset Game');

    constants.value[0] = 'Idle Game';
    document.title = constants.value[0];

    constants.value[1] = document.getElementsByClassName('cutitles');
    for (i = 0; i < 4; i++) { constants.value[1][i].innerText = cuTitles[i]; };

    constants.value[2] = document.getElementsByClassName('costtext');
    for (i = 0; i < 4; i++) { constants.value[2][i].innerText = 'Cost:'; };

    constants.value[3] = document.getElementsByClassName('cucosts');
    for (i = 0; i < 4; i++) { constants.value[3][i].innerText = scientificNotation(constants.coinUpgCost[i]); };

    constants.value[4] = document.getElementsByClassName('coininfo');
    for (i = 0; i < 4; i++) { constants.value[4][i].innerText = coinInfo[i]; };

    constants.value[5] = document.getElementsByClassName('cubuttons');
    for (i = 0; i < 4; i++) { constants.value[5][i].onclick = coinUpgrade(i); };

    constants.value[6] = document.getElementsByClassName('tab');
    for (i = 0; i < 4; i++) { constants.value[6][i].innerText = tabTitles[i]; };

    constants.value[7] = document.getElementsByClassName('settingstext');
    for (i = 0; i < 2; i++) { constants.value[7][i].innerText = settingsTitles[i]; };

    constants.value[8] = document.getElementsByClassName('settingsbuttons');
    constants.value[8][0].onclick = function() { saveGame(); };
    constants.value[8][1].onclick = function() { resetGame(); };

    constants.value[9] = document.getElementsByClassName('effecttext');
    for (i = 0; i < 4; i++) { constants.value[9][i].innerText = 'Effect:'; };

    constants.value[10] = document.getElementsByClassName('cueffect');
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = game.coinUpgEffect[i]; };

    for (i = 0; i < 4; i++) {
        (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[2][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[3][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[9][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[10][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[5][i + 1]) : null;
        (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.backgroundColor = '#000000' : constants.value[5][i].style.backgroundColor = '#FFFFFF';
        (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.color = '#FFFFFF' : constants.value[5][i].style.color = '#000000';
    };
};

function coinUpgrade(i) {
    return function() {
        if (game.coins >= constants.coinUpgCost[i] && game.coinUpgUnlocked[i] == false) {
            game.coinUpgUnlocked[i] = true;
            game.coins = game.coins.sub(constants.coinUpgCost[i]);
            makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[2][i]);
            makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[3][i]);
            makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[9][i]);
            makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[10][i]);
            makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[5][i + 1]);
            constants.value[5][i].style.backgroundColor = '#000000';
            constants.value[5][i].style.color = '#FFFFFF';
}}};

function scientificNotation(variable) {
    if (variable < 100) {
        var string = variable.toStringWithDecimalPlaces(2);
    }
    else if (variable >= 100 && variable < 1000) {
        var string = variable.toStringWithDecimalPlaces(0);
    }
    else if (variable >= 1000) {
        var exponent = (Math.floor(Math.log10(variable.abs())));
        var mantissa = (variable.div(Math.pow(10, exponent)));
        var string = mantissa.toFixed(2) + "e" + exponent;
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

var game = { coins: 900, machineParts: 0, coinsPerSec: 1, machinePartsPerSec: 0, coinUpgUnlocked: [false, false, false, false], muUnlocked: false, coinUpgEffect: [1, 2, 1.25, 1] };

var cu = {
    cost: function(i) {
        return constants.coinUpgCost[i];
    },
    effect: function(i) {
        return game.coinUpgEffect[i];
    },
    canBuy: function(i) {
        return game.coins >= constants.coinUpgCost[i];
    },
    display: [
        costTextHide = function(i) {
            return makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[2][i]);
        },
        costHide = function(i) {
            return makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[3][i]);
        },
        effectTextShow = function(i) {
            return makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[9][i]);
        },
        effectShow = function(i) {
            return makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[10][i]);
        },
        nextShow = function(i) {
            return (i < 3) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[5][i + 1]) : null;
        },
        textColor = function(i) {
            return (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.color = '#FFFFFF' : constants.value[5][i].style.color = '#000000';
        },
        borderColor = function(i) {
            return (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.borderColor = '#FFFFFF' : constants.value[5][i].style.borderColor = '000000';
        },
        color = function(i) {
            return (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.backgroundColor = '#000000' : (cu.canBuy(i)) ? constants.value[5][i].style.backgroundColor = '#c4c4c4' : constants.value[5][i].style.backgroundColor = '#FFFFFF';
        }
    ]
};

var mu = {
    isUnlocked: function() {
        return game.coins >= 1000 || game.muUnlocked;
    },
    isDisplayed: function() {
        if (game.coins >= 1000) { game.muUnlocked = true; };
    },
    display: [
        containerShow = function() {
            return makeVisible(5, mu.isUnlocked(), null, constants.value[11][0]);
        },
        partTextShow = function() {
            return makeVisible(5, mu.isUnlocked(), null, constants.value[12][0]);
        },
        partsShow = function() {
            return makeVisible(5, mu.isUnlocked(), null, constants.value[12][1]);
        },
        perSecTextShow = function() {
            return makeVisible(5, mu.isUnlocked(), null, constants.value[12][2]);
        },
        perSecShow = function() {
            return makeVisible(5, mu.isUnlocked(), null, constants.value[12][3]);

        }
    ]
};

var constants = { updateInterval: 33, saveInterval: 15000, coinUpgCost: [10, 50, 150, 500], base: [new Decimal(game.coinsPerSec), new Decimal(cu.effect(0)), new Decimal(cu.effect(2))], value: [] };

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
    game.coinUpgEffect[3] = (game.coinUpgUnlocked[3]) ? cu.effect(0).add(10).log10() : cu.effect(3);
    game.coinUpgEffect[2] = (game.coinUpgUnlocked[2]) ? constants.base[2].times(cu.effect(3)) : cu.effect(2);
    game.coinUpgEffect[0] = (game.coinUpgUnlocked[2]) ? constants.base[1].times(game.coins.add(10).log10()).pow(cu.effect(2)) : game.coins.add(10).log10();
    game.coinsPerSec = (game.coinUpgUnlocked[1]) ? cu.effect(0).times(cu.effect(1)) : (game.coinUpgUnlocked[0]) ? constants.base[0].times(cu.effect(0)) : game.coinsPerSec;
    game.coins = game.coins.add(game.coinsPerSec * (constants.updateInterval / 1000));
};

function updateDisplay() {
    constants.value[4][1].innerText = scientificNotation(game.coins);
    constants.value[4][3].innerText = scientificNotation(game.coinsPerSec);
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = (i == 2) ? "^" + scientificNotation(cu.effect(i)) : "x" + scientificNotation(cu.effect(i)); };
    (game.coinUpgUnlocked[3]) ? constants.value[1][2].innerText = "UP 3: Raise UP 1's effect to the power of " + scientificNotation(cu.effect(2)) + '.' : null;
    for (i = 0; i < 4; i++) { for (j = 0; j < cu.display.length; j++) { cu.display[j](i); }};
    mu.isDisplayed();
    for (i = 0; i < 5; i++) { mu.display[i](); };
};

function initUI() {
    for (i = 0; i < 4; i++) { game.coinUpgEffect[i] = new Decimal(cu.effect(i)); };
    const cuTitles = new Array('UP 1: Multiply coin gain per second based on current coins.', 'UP 2: Multiply coin gain per second by 2.', "UP 3: Raise UP 1's effect to the power of " + cu.effect(2) + '.', "UP 4: Multiply UP 3's effect based on UP 1's effect.");
    const machineInfo = new Array('Machine Parts:', scientificNotation(game.machineParts = new Decimal(game.machineParts)), '/s:', scientificNotation(game.machinePartsPerSec = new Decimal(game.machinePartsPerSec)));
    const coinInfo = new Array('Coins:', scientificNotation(game.coins = new Decimal(game.coins)), '/s:', scientificNotation(game.coinsPerSec = new Decimal(game.coinsPerSec)));
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

    constants.value[11] = document.getElementsByClassName('machinecontainer');

    constants.value[12] = document.getElementsByClassName('machineinfo');
    for (i = 0; i < 4; i++) { constants.value[12][i].innerText = machineInfo[i]; };
};

function coinUpgrade(i) {
    return function() {
        if (cu.canBuy(i) && game.coinUpgUnlocked[i] == false) {
            game.coinUpgUnlocked[i] = true;
            game.coins = game.coins.sub(constants.coinUpgCost[i]);
}}};

function scientificNotation(variable) {
    if (variable >= 1000) {
        var exponent = (Math.floor(Math.log10(Math.abs(variable))));
        var mantissa = (variable / Math.pow(10, exponent));
        var string = mantissa.toFixed(2) + "e" + exponent;
    }
    else {
        var string = variable.toFixed(2);
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
        case 5:
            if (var1) {
                id.style.display = "inline-block";
            }
            else {
                id.style.display = "none";
            };
            break;
    };
    return id.style.display;
};

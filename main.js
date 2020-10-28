var game = { coins: 0, coinsPerSec: 1, coinUpgUnlocked: [false, false, false, false], coinUpgEffect: [new Decimal(1), new Decimal(2), new Decimal(1.25), new Decimal(1)] };
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
    constants.value[4][1].innerText = numberFormatting(game.coins); 
    constants.value[4][3].innerText = numberFormatting(game.coinsPerSec);
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = (i == 3) ? "^" + game.coinUpgEffect[i] : "x" + game.coinUpgEffect[i]; };
};

function initUI() {
    const cuTitles = new Array('Multiply coin gain per second based on current coins.', 'Multiply coin gain per second by 2.', 'Upgrade 3', 'Upgrade 4');
    const coinInfo = new Array('Coins:', numberFormatting(game.coins = new Decimal(game.coins)), 'Coins/s:', numberFormatting(game.coinsPerSec = new Decimal(game.coinsPerSec)));
    const tabTitles = new Array('Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog');
    const settingsTitles = new Array('Save Game', 'Reset Game');

    constants.value[0] = 'Idle Game';
    document.title = constants.value[0];

    constants.value[1] = document.getElementsByClassName('cutitles');
    for (i = 0; i < 4; i++) { constants.value[1][i].innerText = cuTitles[i]; };

    constants.value[2] = document.getElementsByClassName('costtext');
    for (i = 0; i < 4; i++) { constants.value[2][i].innerText = 'Cost: '; };

    constants.value[3] = document.getElementsByClassName('cucosts');
    for (i = 0; i < 4; i++) { constants.value[3][i].innerText = constants.coinUpgCost[i]; };

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
    for (i = 0; i < 4; i++) { constants.value[9][i].innerText = 'Effect: '; };

    constants.value[10] = document.getElementsByClassName('cueffect');
    for (i = 0; i < 4; i++) { constants.value[10][i].innerText = game.coinUpgEffect[i].round(2); };

    for (i = 0; i < 4; i++) {
        (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[2][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[3][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[9][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[10][i]) : null;
        (game.coinUpgUnlocked[i]) ? makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[5][i + 1]) : null;
        (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.backgroundColor = '#000000' : constants.value[5][i].style.backgroundColor = '#FFFFFF';
        (game.coinUpgUnlocked[i]) ? constants.value[5][i].style.color = '#FFFFFF' : constants.value[5][i].style.color = '#000000';
    };

    //for () {  };
    /*globalInfo[0] = new Array('costtext', 'effecttext');
    globalInfo[1] = new Array('Cost: ', 'Effect: ');
    coinInfo[0] = new Array('cointext', 'coinspersectext');
    coinInfo[1] = new Array('Coins: ', 'Coins/s: ');
    coinInfo[2] = new Array('coins', 'coinspersec');
    coinInfo[3] = new Array(game.coins = new Decimal(game.coins), game.coinsPerSec = new Decimal(game.coinsPerSec));
    tabInfo[0] = new Array('coinswitch', 'machineswitch', 'settingsswitch', 'changelogswitch');
    tabInfo[1] = new Array('Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog');
    cuInfo[0] = new Array('cubuttons');
    cuInfo[1] = new Array('cu1title', 'cu2title', 'cu3title', 'cu4title');
    cuInfo[2] = new Array('Multiply coin gain per second based on current coins.', 'Multiply total coin gain per second by 2.', 'Upgrade 3', 'Upgrade 4');
    cuInfo[3] = new Array('cu1cost', 'cu2cost', 'cu3cost', 'cu4cost');
    cuInfo[4] = new Array(numberFormatting(constants.coinUpgCost[0]), numberFormatting(constants.coinUpgCost[1]), numberFormatting(constants.coinUpgCost[2]), numberFormatting(constants.coinUpgCost[3]));
    cuInfo[5] = new Array('cu1effect', 'cu2effect', 'cu3effect', 'cu4effect');
    cuInfo[6] = new Array(game.coinUpgEffect[0], game.coinUpgEffect[1], game.coinUpgEffect[2], game.coinUpgEffect[3]);
    settingsInfo[0] = new Array('savebutton', 'resetbutton');
    settingsInfo[1] = new Array('savegametext', 'resetgametext');*/

    /*for (i = 0; i < 2; i++) { constants.value[i] = document.getElementsByClassName(globalInfo[0][i]); };
    for (i = 0; i < constants.value[0].length; i++) { constants.value[0][i].innerText = globalInfo[1][0] };
    for (i = 0; i < constants.value[1].length; i++) { constants.value[1][i].innerText = globalInfo[1][1] };
    for (i = 6, j = 0; i < 7; i++, j++) { constants.value[i] = document.getElementsByClassName(cuInfo[0][j]); };
    for (i = 0; i < 4; i++) { constants.value[6][i].onclick = coinUpgrade(i) };
    for (i = 2, j = 0; i < 4; i++, j++) { constants.value[i] = document.getElementById(coinInfo[0][j]); constants.value[i].innerText = coinInfo[1][j]; }; 
    for (i = 4, j = 0; i < 6; i++, j++) { constants.value[i] = document.getElementById(coinInfo[2][j]); constants.value[i].innerText = coinInfo[3][j]; };
    for (i = 7, j = 0; i < 11; i++, j++) { constants.value[i] = document.getElementById(tabInfo[0][j]); constants.value[i].innerText = tabInfo[1][j]; };
    for (i = 11, j = 0; i < 15; i++, j++) { constants.value[i] = document.getElementById(cuInfo[1][j]); constants.value[i].innerText = cuInfo[2][j]; };
    for (i = 15, j = 0; i < 19; i++, j++) { constants.value[i] = document.getElementById(cuInfo[3][j]); constants.value[i].innerText = cuInfo[4][j]; };
    for (i = 19, j = 0; i < 23; i++, j++) { constants.value[i] = document.getElementById(cuInfo[5][j]); constants.value[i].innerText = cuInfo[6][j]; };
    for (i = 0; i < game.coinUpgUnlocked.length; i++) {
        makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[0][i]);
        makeVisible(4, game.coinUpgUnlocked[i], true, constants.value[i + 15]);
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[1][i]);
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[i + 19]);
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.value[6][i + 1]);
        (game.coinUpgUnlocked[i]) ? constants.value[6][i].style.backgroundColor = '#000000' : constants.values[6][i].style.backgroundColor = '#DCDCDC';
        (game.coinUpgUnlocked[i]) ? constants.value[6][i].style.color = '#FFFFFF' : constants.value[6][i].style.color = '#000000';
    };*/
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

/*var game = {
    muUnlockBool: false,
    coinUpgEffects: [1, 2, 1.25, 1]
};

var constants = {
    updateInterval: 33,
    saveInterval: 1.5e4,
    version: 0.001,
    gameTitle: 'Idle Game ~ v',
    currencyRequired: [1e3],
    baseValues: [game.coinsPerSec, game.coinUpgEffects[2]],
    idVariableNames: [
        coinText = undefined,
        currentCoins = undefined,
        coinsPerSecText = undefined,
        coinsPerSecValue = undefined,
        machineText = undefined,
        currentMachineParts = undefined,
        machinesPerSecText = undefined,
        machinesPerSecValue = undefined,
        machinePrestigeText = undefined,
        nextMachineText = undefined,
        saveText = undefined,
        resetText = undefined,
        coinUpgradeEffectValues = [],
        basicUpgradeCostValues = [],
    ],
    idVariableText: [
        'Coins: ',
        game.coins,
        '/s: ',
        game.coinsPerSec,
        'Machine Parts: ',
        game.coins,
        '/s: ',
        game.coinsPerSec,
        'Prestige for --- machines.',
        '1e3 coins are required for your next machine.',
        'Save Game',
        'Reset Game'
    ],
    variableIds: [
        'cointext',
        'coins',
        'coinspersectext',
        'coinspersec',
        'machineparttext',
        'machineparts',
        'machinepartspersectext',
        'machinepartspersec',
        'muprestigetitle',
        'nextmachinetext',
        'savegametext',
        'resetgametext'
    ],
    classVariableNames: [
        machineContent = undefined,
        basicUpgrades = undefined,
        settings = undefined,
        titleBasicUpgradeText = undefined,
        basicUpgradeEffectText = undefined,
        costText = undefined,
        levelText = undefined
    ],
    variableClasses: [
        'machinecontents',
        'bubuttons',
        'settingsbuttons',
        'butitles',
        'upgradeeffecttext',
        'costtext',
        'leveltext'
    ],
    basicUpgradeTitles: ['Coin amount increases coin gain per second.', 'Multiply coin gain per second by 2.', "Raise upgrade 1's effect to the power of 1.25.", "Multiply upgrade 3's effect based on upgrade 1's effect."],
    settingsMethods: [saveGame, resetGame],
    tabText: new Array(4),
    tabIds: ['coinswitch', 'machineswitch', 'settingsswitch', 'changelogswitch'],
    tabNames: ['Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog']
};

function updateDisplay() {
    constants.idVariableNames[1].innerText = numberFormatting(game.coins);
    constants.idVariableNames[3].innerText = numberFormatting(game.coinsPerSec);

    for (let i = 0; i < constants.classVariableNames[1].length; i++) {
        if (game.coins >= game.buCosts[i] && game.coinUpgUnlocked[i] == false) {
            constants.classVariableNames[1][i].style.backgroundColor = '#A9A9A9';   
        }
        else if (game.coinUpgUnlocked[i] == false) {
            constants.classVariableNames[1][i].style.backgroundColor = '#DCDCDC';
        };
    };
    for (let i = 0; i < constants.idVariableNames[13].length; i++) {
        if (i == 2) {
            constants.idVariableNames[13][i].innerText = '^' + numberFormatting(game.coinUpgEffects[i]);
        }
        else {
            constants.idVariableNames[13][i].innerText = 'x' + numberFormatting(game.coinUpgEffects[i]);
        };
    };
    for (let i = 0; i < constants.classVariableNames[0].length; i++) {
        if (makeVisible(2, game.coins, constants.currencyRequired[0], constants.classVariableNames[0][i]) == 'inline-block') {
            game.muUnlockBool = true;
        };
        if (game.muUnlockBool == true) {
            makeVisible(3, game.coins, game.coins, constants.classVariableNames[0][i]);
        };
    };
    if (game.coinUpgUnlocked[3] == true) {
        constants.classVariableNames[3][2].innerText = "Raise upgrade 1's effect to the power of " + numberFormatting(game.coinUpgEffects[2]) + '.';
    };
};

function initUI() {
    game.coins = new Decimal(game.coins);
    for (let i = 0; i < game.coinUpgEffects.length; i++) {
        game.coinUpgEffects[i] = new Decimal(game.coinUpgEffects[i]);
    };
    for (let i = 0; i < constants.baseValues.length; i++) {
        constants.baseValues[i] = new Decimal(constants.baseValues[i]);
    };
    document.title = constants.gameTitle + constants.version;
    for (let i = 0; i < constants.idVariableNames.length; i++) {
        constants.idVariableNames[i] = document.getElementById(constants.variableIds[i]);
    };
    for (let i = 0; i < constants.idVariableText.length; i++) {
        constants.idVariableNames[i].innerText = constants.idVariableText[i];
    };
    for (let i = 0; i < constants.classVariableNames.length; i++) {
        constants.classVariableNames[i] = document.getElementsByClassName(constants.variableClasses[i]);
    };
    for (let i = 0; i < game.buCosts.length; i++) {
        constants.basicUpgradeCostValues.push(document.getElementById(`bu${i + 1}cost`));
    };
    for (let i = 0; i < game.buCosts.length; i++) {
        constants.basicUpgradeCostValues[i].innerText = numberFormatting(game.buCosts[i]);
    };
    for (let i = 0; i < game.coinUpgEffects.length; i++) {
        constants.idVariableNames[13].push(document.getElementById(`bu${i + 1}effect`));
    };
    for (let i = 0; i < constants.classVariableNames[1].length; i++) {
        constants.classVariableNames[1][i].onclick = function() { coinUpgrade(i) };
    };
    for (let i = 0; i < constants.classVariableNames[2].length; i++) {
        constants.classVariableNames[2][i].onclick = function() { constants.settingsMethods[i]() };
    };
    for (let i = 0; i < constants.classVariableNames[3].length; i++) {
        constants.classVariableNames[3][i].innerText = constants.basicUpgradeTitles[i];
    };
    for (let i = 0; i < constants.classVariableNames[5].length; i++) {
        constants.classVariableNames[5][i].innerText = 'Cost: ';
    };
    for (let i = 0; i < constants.classVariableNames[4].length; i++) {
        constants.classVariableNames[4][i].innerText = 'Effect: ';
    };
    for (let i = 0; i < game.coinUpgUnlocked.length; i++) {
        makeVisible(4, game.coinUpgUnlocked[i], true, constants.classVariableNames[5][i]);
        makeVisible(4, game.coinUpgUnlocked[i], true, constants.basicUpgradeCostValues[i]);
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.classVariableNames[4][i]);
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.idVariableNames[13][i]);
    };
    for (let i = 0; i < constants.classVariableNames[1].length; i++) {
        if (game.coins >= game.buCosts[i] && game.coinUpgUnlocked[i] == false) {
            constants.classVariableNames[1][i].style.backgroundColor = '#A9A9A9';   
        }
        else if (game.coinUpgUnlocked[i] == true) {
            constants.classVariableNames[1][i].style.backgroundColor = '#000000';
            constants.classVariableNames[1][i].style.color = '#FFFFFF';
        }
        else {
            constants.classVariableNames[1][i].style.backgroundColor = '#DCDCDC';
        };
    };
    for (let i = 0; i < constants.idVariableNames[13].length; i++) {
        if (i == 2) {
            constants.idVariableNames[13][i].innerText = '^' + numberFormatting(game.coinUpgEffects[i]);
        }
        else {
            constants.idVariableNames[13][i].innerText = 'x' + numberFormatting(game.coinUpgEffects[i]);
        };
    };
    for (let i = 0; i < constants.tabText.length; i++) {
        constants.tabText[i] = document.getElementById(constants.tabIds[i]);
        constants.tabText[i].innerText = constants.tabNames[i];
    };
    for (let i = 0; i < constants.classVariableNames[1].length - 1; i++) {
        makeVisible(3, game.coinUpgUnlocked[i], true, constants.classVariableNames[1][i + 1]);
    };
};*/

function numberFormatting(variable) {
    if (variable < 100) {
        var string = variable.toFixed(2);
    }
    else if (variable >= 100 && variable < 1000) {
        var string = variable.toFixed(0);
    }
    else if (variable >= 1000) {
        var exponent = (Math.floor(Math.log10(Math.abs(variable))));
        var mantissa = (variable / Math.pow(10, exponent));
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



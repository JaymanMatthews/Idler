var gameData = {
    coins: 0,
    coinsPerSec: 1,
    buCosts: [10, 50, 150, 500],
    buBool: [false, false, false, false],
    muUnlockBool: false,
    buProdMultis: [1, 1, 1, 1],
    currencyRequired: [1e3]
};

var gameConstants = {
    updateInterval: 33,
    saveInterval: 1.5e4,
    version: 0.001,
    gameTitle: 'Idle Game ~ v',
    basePower: [],
    currentCoins: undefined,
    coinText: undefined,
    coinsPerSecValue: undefined,
    coinsPerSecText: undefined,
    currentMachineParts: undefined,
    machineText: undefined,
    machinesPerSecValue: undefined,
    machinesPerSecText: undefined,
    machineContent: undefined,
    basicUpgradeEffectText: undefined,
    basicUpgradeEffectValues: [],
    basicUpgrades: [],
    basicUpgradeCostValues: [],
    titleBasicUpgradeText: undefined,
    costText: undefined,
    levelText: undefined,
    basicUpgradeTitles: ['Coin amount increases coin gain per second.', 'Multiply coin gain per second by 2.', "Raise upgrade 1's effect to the power of 1.25.", "Multiply upgrade 3's effect based on upgrade 1's effect."],
    basicUpgradeMethods: [coinsIncreaseCoinsPerSec, multiplyCoinsPerSec1, raiseUp1Power, multiplyUp3ByUp1],
    tabText: new Array(4),
    tabIds: ['coinswitch', 'machineswitch', 'settingsswitch', 'changelogswitch'],
    tabNames: ['Coin Upgrades', 'Machine Upgrades', 'Settings', 'Changelog']
};

var gameVariableLists = {
    variableNames: [gameConstants.coinText, gameConstants.currentCoins, gameConstants.coinsPerSecText, gameConstants.coinsPerSecValue, gameConstants.machineText, gameConstants.currentMachineParts, gameConstants.machinesPerSecText, gameConstants.machinesPerSecValue, gameConstants.machinePrestigeText, gameConstants.nextMachineText],
    variableIds: ['cointext', 'coins', 'coinspersectext', 'coinspersec', 'machineparttext', 'machineparts', 'machinepartspersectext', 'machinepartspersec', 'muprestigetitle', 'nextmachinetext']
};

window.onload = function() {
    initUI();
};

setInterval(function(){
    tick();
}, gameConstants.updateInterval);

setInterval(function(){
    saveGame();
}, gameConstants.saveInterval);

function tick() {
    updateGame();
    updateDisplay();
};

function updateGame() {
    if (gameData.buBool[0] == true) {
        gameData.buProdMultis[0] = 150 * Math.sqrt(gameData.coins / 1e6) + 1;
    }
    else {
        gameData.buProdMultis[0] = gameData.buProdMultis[0];
    };
    if (gameData.buBool[3] == true) {
        gameData.buProdMultis[3] = 150 * Math.sqrt(gameData.buProdMultis[0] / 1e7) + 1;
        gameData.buProdMultis[2] = gameConstants.basePower[0] * gameData.buProdMultis[3];
    };
    gameData.buProdMultis[0] = Math.pow(gameData.buProdMultis[0], gameData.buProdMultis[2]);
    gameData.coinsPerSec = gameData.buProdMultis[0] * gameData.buProdMultis[1];
    gameData.coins += gameData.coinsPerSec * (gameConstants.updateInterval / 1e3);
};

function updateDisplay() {
    gameVariableLists.variableNames[1].innerText = numberFormatting(gameData.coins);
    gameVariableLists.variableNames[3].innerText = numberFormatting(gameData.coinsPerSec);

    for (let i = 0; i < gameConstants.basicUpgrades.length; i++) {
        if (gameData.coins >= gameData.buCosts[i] && gameData.buBool[i] == false) {
            gameConstants.basicUpgrades[i].style.backgroundColor = '#A9A9A9';   
        }
        else if (gameData.buBool[i] == false) {
            gameConstants.basicUpgrades[i].style.backgroundColor = '#DCDCDC';
        };
    };
    for (let i = 0; i < gameConstants.basicUpgradeCostValues.length; i++) {
        gameConstants.basicUpgradeCostValues[i].innerText = numberFormatting(gameData.buCosts[i]);
    };
    for (let i = 0; i < gameConstants.basicUpgradeEffectValues.length; i++) {
        if (i == 2) {
            gameConstants.basicUpgradeEffectValues[i].innerText = '^' + numberFormatting(gameData.buProdMultis[i]);
        }
        else {
            gameConstants.basicUpgradeEffectValues[i].innerText = 'x' + numberFormatting(gameData.buProdMultis[i]);
        };
    };
    for (let i = 0; i < gameConstants.machineContent.length; i++) {
        if (makeVisible(2, gameData.coins, gameData.currencyRequired[0], gameConstants.machineContent[i]) == 'inline-block') {
            gameData.muUnlockBool = true;
        };
        if (gameData.muUnlockBool == true) {
            makeVisible(3, gameData.coins, gameData.coins, gameConstants.machineContent[i]);
        };
    };
    if (gameData.buBool[3] == true) {
        gameConstants.titleBasicUpgradeText[2].innerText = "Raise upgrade 1's effect to the power of " + numberFormatting(gameData.buProdMultis[2]) + '.';
    };
};

function initUI() {
    document.title = gameConstants.gameTitle + gameConstants.version;
    /*gameConstants.coinText = document.getElementById('cointext');
    gameConstants.currentCoins = document.getElementById('coins');
    gameConstants.coinsPerSecText = document.getElementById('coinspersectext');
    gameConstants.coinsPerSecValue = document.getElementById('coinspersec');
    gameConstants.machineText = document.getElementById('machineparttext');
    gameConstants.currentMachineParts = document.getElementById('machineparts');
    gameConstants.machinesPerSecText = document.getElementById('machinepartspersectext');
    gameConstants.machinesPerSecValue = document.getElementById('machinepartspersec');
    gameConstants.machinePrestigeText = document.getElementById('muprestigetitle');
    gameConstants.nextMachineText = document.getElementById('nextmachinetext')*/
    for (let i = 0; i < gameVariableLists.variableNames.length; i++) {
        gameVariableLists.variableNames[i] = document.getElementById(gameVariableLists.variableIds[i]);
    };
    gameVariableLists.variableNames[0].innerText = 'Coins: ';
    gameVariableLists.variableNames[1].innerText = gameData.coins;
    gameVariableLists.variableNames[2].innerText = '/s: ';
    gameVariableLists.variableNames[3].innerText = gameData.coinsPerSec;
    gameVariableLists.variableNames[4].innerText = 'Machine Parts: ';
    gameVariableLists.variableNames[5].innerText = gameData.coins;
    gameVariableLists.variableNames[6].innerText = '/s: ';
    gameVariableLists.variableNames[7].innerText = gameData.coinsPerSec;
    gameVariableLists.variableNames[8].innerText = 'Prestige for --- machines.';
    gameVariableLists.variableNames[9].innerText = '1e3 coins are required for your next machine.';
    gameConstants.machineContent = document.getElementsByClassName('machinecontents');
    gameConstants.basicUpgrades = document.getElementsByClassName('bubuttons');
    gameConstants.titleBasicUpgradeText = document.getElementsByClassName('butitles');
    gameConstants.basicUpgradeEffectText = document.getElementsByClassName('upgradeeffecttext');
    gameConstants.costText = document.getElementsByClassName('costtext');
    gameConstants.levelText = document.getElementsByClassName('leveltext');

    for (let i = 0; i < gameData.buCosts.length; i++) {
        gameConstants.basicUpgradeCostValues.push(document.getElementById(`bu${i + 1}cost`));
    };
    for (let i = 0; i < gameData.buProdMultis.length; i++) {
        gameConstants.basicUpgradeEffectValues.push(document.getElementById(`bu${i + 1}effect`));
    };
    for (let i = 0; i < gameConstants.basicUpgrades.length; i++) {
        gameConstants.basicUpgrades[i].onclick = function() { gameConstants.basicUpgradeMethods[i]() };
    };
    for (let i = 0; i < gameConstants.titleBasicUpgradeText.length; i++) {
        gameConstants.titleBasicUpgradeText[i].innerText = gameConstants.basicUpgradeTitles[i];
    };
    for (let i = 0; i < gameConstants.costText.length; i++) {
        gameConstants.costText[i].innerText = 'Cost: ';
    };
    for (let i = 0; i < gameConstants.basicUpgradeEffectText.length; i++) {
        gameConstants.basicUpgradeEffectText[i].innerText = 'Effect: ';
    };
    for (let i = 0; i < gameData.buBool.length; i++) {
        makeVisible(4, gameData.buBool[i], true, gameConstants.costText[i]);
        makeVisible(4, gameData.buBool[i], true, gameConstants.basicUpgradeCostValues[i]);
        makeVisible(3, gameData.buBool[i], true, gameConstants.basicUpgradeEffectText[i]);
        makeVisible(3, gameData.buBool[i], true, gameConstants.basicUpgradeEffectValues[i]);
    };
    for (let i = 0; i < gameConstants.basicUpgrades.length; i++) {
        if (gameData.coins >= gameData.buCosts[i] && gameData.buBool[i] == false) {
            gameConstants.basicUpgrades[i].style.backgroundColor = '#A9A9A9';   
        }
        else if (gameData.buBool[i] == true) {
            gameConstants.basicUpgrades[1].style.backgroundColor = '#000000';
            gameConstants.basicUpgrades[1].style.color = '#FFFFFF';
        }
        else {
            gameConstants.basicUpgrades[i].style.backgroundColor = '#DCDCDC';
        };
    };
    for (let i = 0; i < gameConstants.basicUpgradeEffectValues.length; i++) {
        if (i == 2) {
            gameConstants.basicUpgradeEffectValues[i].innerText = '^' + numberFormatting(gameData.buProdMultis[i]);
        }
        else {
            gameConstants.basicUpgradeEffectValues[i].innerText = 'x' + numberFormatting(gameData.buProdMultis[i]);
        };
    };
    for (let i = 0; i < gameConstants.tabText.length; i++) {
        gameConstants.tabText[i] = document.getElementById(gameConstants.tabIds[i]);
        gameConstants.tabText[i].innerText = gameConstants.tabNames[i];
    };
    for (let i = 0; i < gameConstants.basicUpgrades.length - 1; i++) {
        makeVisible(3, gameData.buBool[i], true, gameConstants.basicUpgrades[i + 1]);
    };
};

function coinsIncreaseCoinsPerSec() {
    if (gameData.coins >= gameData.buCosts[0] && gameData.buBool[0] == false) {
        gameData.buBool[0] = true;
        gameData.coins -= gameData.buCosts[0];
        makeVisible(4, gameData.buBool[0], true, gameConstants.costText[0]);
        makeVisible(4, gameData.buBool[0], true, gameConstants.basicUpgradeCostValues[0]);
        makeVisible(3, gameData.buBool[0], true, gameConstants.basicUpgradeEffectText[0]);
        makeVisible(3, gameData.buBool[0], true, gameConstants.basicUpgradeEffectValues[0]);
        makeVisible(3, gameData.buBool[0], true, gameConstants.basicUpgrades[1]);
        gameConstants.basicUpgrades[0].style.backgroundColor = '#000000';
        gameConstants.basicUpgrades[0].style.color = '#FFFFFF';
    };
};

function multiplyCoinsPerSec1() {
    if (gameData.coins >= gameData.buCosts[1] && gameData.buBool[1] == false) {
        gameData.buBool[1] = true;
        gameData.coins -= gameData.buCosts[1];
        gameData.buProdMultis[1] = 2;
        makeVisible(4, gameData.buBool[1], true, gameConstants.costText[1]);
        makeVisible(4, gameData.buBool[1], true, gameConstants.basicUpgradeCostValues[1]);
        makeVisible(3, gameData.buBool[1], true, gameConstants.basicUpgradeEffectText[1]);
        makeVisible(3, gameData.buBool[1], true, gameConstants.basicUpgradeEffectValues[1]);
        makeVisible(3, gameData.buBool[1], true, gameConstants.basicUpgrades[2]);
        gameConstants.basicUpgrades[1].style.backgroundColor = '#000000';
        gameConstants.basicUpgrades[1].style.color = '#FFFFFF';
    };
};

function raiseUp1Power() {
    if (gameData.coins >= gameData.buCosts[2] && gameData.buBool[2] == false) {
        gameData.buBool[2] = true;
        gameData.coins -= gameData.buCosts[2];
        gameData.buProdMultis[2] = 1.25;
        makeVisible(4, gameData.buBool[2], true, gameConstants.costText[2]);
        makeVisible(4, gameData.buBool[2], true, gameConstants.basicUpgradeCostValues[2]);
        makeVisible(3, gameData.buBool[2], true, gameConstants.basicUpgradeEffectText[2]);
        makeVisible(3, gameData.buBool[2], true, gameConstants.basicUpgradeEffectValues[2]);
        makeVisible(3, gameData.buBool[2], true, gameConstants.basicUpgrades[3]);
        gameConstants.basicUpgrades[2].style.backgroundColor = '#000000';
        gameConstants.basicUpgrades[2].style.color = '#FFFFFF';
    };
};

function multiplyUp3ByUp1() {
    if (gameData.coins >= gameData.buCosts[3] && gameData.buBool[3] == false) {
        gameData.buBool[3] = true;
        gameData.coins -= gameData.buCosts[3];
        gameConstants.basePower[0] = 1.25;
        makeVisible(4, gameData.buBool[3], true, gameConstants.costText[3]);
        makeVisible(4, gameData.buBool[3], true, gameConstants.basicUpgradeCostValues[3]);
        makeVisible(3, gameData.buBool[3], true, gameConstants.basicUpgradeEffectText[3]);
        makeVisible(3, gameData.buBool[3], true, gameConstants.basicUpgradeEffectValues[3]);
        gameConstants.basicUpgrades[3].style.backgroundColor = '#000000';
        gameConstants.basicUpgrades[3].style.color = '#FFFFFF';
    };
};

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



const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day02.txt", "utf-8");
const rl = readLine.createInterface(stream);

let indexSum = 0;
let powerSum = 0;

rl.on("line", (line) => {

    const game = getGame(line);

    if (isGameValid(game, 14, 13, 12)) {
        indexSum += game.id;
    }

    const miniumSet = getMinimumSet(game);
    powerSum += getSetPower(miniumSet);
})

rl.on("close", () => {
    //console.log(indexSum);
    console.log(powerSum);
});


function getGame(line) {

    const splitted = line.split(':');
    const id = getGameId(splitted[0]);
    const gameSets = getGameSets(splitted[1]);

    const game = { id: id, gameSets: gameSets }
    return game;
}

function getGameId(gameString) {
    const idString = gameString.replace("Game ", '')
    return parseInt(idString);
}

function getGameSets(gameSetsString) {
    const gameSets = [];
    const gameStrings = gameSetsString.split(';');

    gameStrings.forEach(gameString => {
        gameSets.push(getGameSet(gameString));
    });

    return gameSets;
}

function getGameSet(gameSetString) {
    let blueCount = 0;
    let greenCount = 0;
    let redCount = 0;

    const colorStrings = gameSetString.split(',');

    colorStrings.forEach(colorString => {
        const colorCountSplit = colorString.trim().split(' ');
        const colorCount = parseInt(colorCountSplit[0]);

        switch (colorCountSplit[1]) {
            case "blue":
                blueCount = colorCount;
                break;
            case "green":
                greenCount = colorCount;
                break;
            case "red":
                redCount = colorCount;
                break;
            default:
                break;
        }

    });

    return { blueCount: blueCount, greenCount: greenCount, redCount: redCount }
}

function isGameValid(game, maxBlueCount, maxGreenCount, maxRedCount) {

    for (let index = 0; index < game.gameSets.length; index++) {
        const gameSet = game.gameSets[index];

        if (gameSet.blueCount > maxBlueCount
            || gameSet.greenCount > maxGreenCount
            || gameSet.redCount > maxRedCount) {
            return false;
        }
    }

    return true;
}

function getMinimumSet(game) {
    let minimumBlueCount = 0;
    let minimumGreenCount = 0;
    let minimumRedCount = 0;

    game.gameSets.forEach(gameSet => {

        minimumBlueCount = Math.max(minimumBlueCount, gameSet.blueCount);
        minimumGreenCount = Math.max(minimumGreenCount, gameSet.greenCount);
        minimumRedCount = Math.max(minimumRedCount, gameSet.redCount);
    });

    return { blueCount: minimumBlueCount, greenCount: minimumGreenCount, redCount: minimumRedCount };
}

function getSetPower(gameSet) {
    return gameSet.blueCount * gameSet.greenCount * gameSet.redCount;
}
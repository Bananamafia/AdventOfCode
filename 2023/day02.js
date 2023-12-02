const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day02.txt", "utf-8");
const rl = readLine.createInterface(stream);

let indexSum = 0;

rl.on("line", (line) => {

    const game = getGame(line);

    if (isGameValid(game, 14, 13, 12)){
        indexSum += game.id;
    }
})

rl.on("close", () => {
    console.log(indexSum);
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
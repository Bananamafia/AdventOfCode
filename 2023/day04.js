const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day04.txt", "utf-8");
const rl = readLine.createInterface(stream);

let sum = 0;
let additionalCards = [];

rl.on("line", (line) => {

    const gameSplit = line.split(':');
    const winningSplit = gameSplit[1].split('|');

    const numberSplit = winningSplit[1].trim().split(' ');

    const wonMatches = getMatchCount(winningSplit[0].trim(), numberSplit);
    const currentMatchCardCount = 1 + (additionalCards.shift() || 0);
    sum += currentMatchCardCount;

    for (let i = 0; i < wonMatches; i++) {
        const newValue = (parseInt(additionalCards[i]) || 0) + currentMatchCardCount;
        additionalCards[i] = newValue;
    }
})

rl.on("close", () => {
    console.log(sum);
});


function getMatchCount(winningNumberString, numbers) {
    let winningCount = 0;


    for (let i = 0; i < numbers.length; i++) {
        const numberString = numbers[i];
        if (numberString == '') {
            continue;
        }

        const number = parseInt(numberString);
        const regex = new RegExp("(?<![\\w\\d])" + number + "(?![\\w\\d])");

        if (winningNumberString.match(regex)) {
            winningCount++;
        }

    }

    return winningCount;
}

function getPoints(wonMatchCount) {

    if (wonMatchCount < 2) {
        return wonMatchCount;
    }

    return Math.pow(2, wonMatchCount - 1);
}
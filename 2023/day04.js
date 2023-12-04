const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day04.txt", "utf-8");
const rl = readLine.createInterface(stream);

let sum = 0;

rl.on("line", (line) => {

    const gameSplit = line.split(':');
    const winningSplit = gameSplit[1].split('|');

    const numberSplit = winningSplit[1].trim().split(' ');

    const wonMatches = getMatchCount(winningSplit[0].trim(), numberSplit);
    sum += getPoints(wonMatches);
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
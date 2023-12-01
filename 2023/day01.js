const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day01.txt", "utf-8");
const rl = readLine.createInterface(stream);

let sum = 0;

rl.on("line", (line) => {
    sum += getCalibrationValue(line);
})

rl.on("close", () => {
    console.log(sum);
});

function getFirstNumber(inputString) {
    for (let index = 0; index < inputString.length; index++) {
        let parsedInt = parseInt(inputString[index]);

        if (!isNaN(parsedInt)) {
            return parsedInt;
        }
    }
}

function getCalibrationValue(line) {
    const firstDigit = getFirstNumber(line);

    const reversedLine = line.split('').reverse().join('');

    const secondDigit = getFirstNumber(reversedLine);

    return (firstDigit * 10 + secondDigit);
}
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

function replaceNumberStrings(inputString) {

    let outputString;

    while (inputString.length > 0) {

        if (inputString.startsWith("one")) {
            outputString += "1";
        }
        else if (inputString.startsWith("two")) {
            outputString += "2";
        }
        else if (inputString.startsWith("three")) {
            outputString += "3";
        }
        else if (inputString.startsWith("four")) {
            outputString += "4";
        }
        else if (inputString.startsWith("five")) {
            outputString += "5";
        }
        else if (inputString.startsWith("six")) {
            outputString += "6";
        }
        else if (inputString.startsWith("seven")) {
            outputString += "7";
        }
        else if (inputString.startsWith("eight")) {
            outputString += "8";
        }
        else if (inputString.startsWith("nine")) {
            outputString += "9";
        }
        else {
            outputString += inputString[0];
        }

        if (inputString.length > 1) {
            inputString = inputString.substring(1);
        }
        else {
            inputString = "";
        }

    };

    // inputstring = inputstring.replace("one", "1");
    // inputstring = inputstring.replace("two", "2");
    // inputstring = inputstring.replace("three", "3");
    // inputstring = inputstring.replace("four", "4");
    // inputstring = inputstring.replace("five", "5");
    // inputstring = inputstring.replace("six", "6");
    // inputstring = inputstring.replace("seven", "7");
    // inputstring = inputstring.replace("eight", "8");
    // inputstring = inputstring.replace("nine", "9");

    return outputString;
}

function getCalibrationValue(line) {

    const sanitizedLine = replaceNumberStrings(line);

    const firstDigit = getFirstNumber(sanitizedLine);
    const reversedLine = sanitizedLine.split('').reverse().join('');
    const secondDigit = getFirstNumber(reversedLine);
    const output = (firstDigit * 10 + secondDigit);
    return output;
}
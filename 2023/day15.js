const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day15.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine);
rl.on("close", main);

const instructionValues = [];
let sumOfHashes = 0;

function processLine(line) {
    instructionValues.push(line.split(','));
}

function main() {
    const values = instructionValues.flat();

    for (let i = 0; i < values.length; i++) {
        const instruction = values[i];
        sumOfHashes += calculateHashOfInstruction(instruction);
    }

    console.log(sumOfHashes);
}

function calculateHashOfInstruction(instruction) {
    let hashValue = 0;

    for (let i = 0; i < instruction.length; i++) {
        const character = instruction[i];
        hashValue = calculateHashValue(character, hashValue);
    }

    return hashValue;
}

function calculateHashValue(character, currentValue) {
    currentValue += character.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;

    return currentValue;
}
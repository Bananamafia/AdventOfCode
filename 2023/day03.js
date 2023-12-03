const readLine = require("node:readline");
const fs = require('node:fs');
const stream = fs.createReadStream("data/day03.txt", "utf-8");
const rl = readLine.createInterface(stream);

function isCharacterNumber(character) {
    switch (character) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return true;
        default:
            return false;
    }
}

function isCharacterSymbol(character) {
    if (character == "." || isCharacterNumber(character))
        return false;
    else
        return true;
}

let lastLine;
let sum = 0;

rl.on("line", (line) => {
    const currentLine = new processedLine(line);

    if (lastLine) {
        const additionalPartNumbersOfPreviousRow = lastLine.getPartNumbersWithSymbolsOfOtherRow(currentLine.symbolIndexes);

        for (let i = 0; i < additionalPartNumbersOfPreviousRow.length; i++) {
            sum += additionalPartNumbersOfPreviousRow[i];
        }

        const partNumbersFromSymbolsOfPreviousRow = currentLine.getPartNumbersWithSymbolsOfOtherRow(lastLine.symbolIndexes);
        for (let i = 0; i < partNumbersFromSymbolsOfPreviousRow.length; i++) {
            sum += partNumbersFromSymbolsOfPreviousRow[i];
        }
    }

    const currentLinePartNumbers = currentLine.getPartNumbersWithSymbolsOfCurrentRow();
    for (let i = 0; i < currentLinePartNumbers.length; i++) {
        sum += currentLinePartNumbers[i];
    }

    lastLine = currentLine;
});

rl.on("close", () => {
    console.log(sum);
});


class processedLine {
    symbolIndexes;
    potentialPartNumbers = [];

    constructor(line) {
        this.symbolIndexes = [];
        this.potentialPartNumbers = [];

        let lastPotentialNumber = new potentialPartNumber();

        for (let index = 0; index < line.length; index++) {
            const character = line[index];

            if (isCharacterNumber(character)) {
                if (lastPotentialNumber.belongsToNumberWith(index)) {
                    lastPotentialNumber.numberString += character;
                }
                else {
                    this.potentialPartNumbers.push(lastPotentialNumber);
                    lastPotentialNumber = new potentialPartNumber();
                    lastPotentialNumber.startIndex = index;
                    lastPotentialNumber.numberString = character;
                }
            }
            else if (isCharacterSymbol(character)) {
                this.symbolIndexes.push(index);
            }

        }

        if (lastPotentialNumber.index != -1) {
            this.potentialPartNumbers.push(lastPotentialNumber);
        }
    }

    getPartNumbersWithSymbolsOfCurrentRow() {
        return this.getPartNumbersWithSymbolsOfOtherRow(this.symbolIndexes);
    }

    getPartNumbersWithSymbolsOfOtherRow(symbolIndexes) {
        const partNumbers = [];

        for (let i = 0; i < symbolIndexes.length; i++) {
            const index = symbolIndexes[i];

            for (let j = 0; j < this.potentialPartNumbers.length; j++) {
                const potentialPartNumber = this.potentialPartNumbers[j];

                if (potentialPartNumber.isConnectedTo(index)) {
                    partNumbers.push(potentialPartNumber.getNumber());
                    this.potentialPartNumbers.splice(j, 1);
                    j--;
                }
            }
        }

        return partNumbers;
    }
}

class potentialPartNumber {
    startIndex = -1;
    numberString = "";

    getNumber() {
        return parseInt(this.numberString);
    }

    getNumberLength() {
        return this.numberString.length;
    }

    belongsToNumberWith(index) {
        return index == this.startIndex + this.getNumberLength();
    }

    isConnectedTo(index) {
        const lowerEnd = this.startIndex - 1;
        const upperEnd = this.startIndex + this.getNumberLength();
        return lowerEnd <= index && index <= upperEnd;
    }
}
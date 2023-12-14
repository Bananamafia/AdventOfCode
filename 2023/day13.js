const readLine = require("node:readline");
const fs = require('node:fs');
const { Console } = require("node:console");

const stream = fs.createReadStream("data/day13.txt", "utf-8");
const rl = readLine.createInterface(stream);

const terrainPatterns = [];
let currentTerrainPattern = [];

rl.on("line", processLine);
rl.on("close", main);

function processLine(line) {
    if (line == '') {
        terrainPatterns.push(currentTerrainPattern);
        currentTerrainPattern = [];
        return;
    }

    currentTerrainPattern.push(line);
}

function calculateCountOnOtherSide(totalSize, shift) {
    return totalSize / 2 + shift / 2;
}

function calculateElementCountLeftFromMirror(terrainWidth, shiftToRight) {
    return calculateCountOnOtherSide(terrainWidth, shiftToRight);
}

function getReversed(input) {
    return input.split('').reverse().join('');
}

function getDifferenceCount(inputA, inputB, isSmudge) {
    let differenceCount = 0;

    for (let i = 0; i < inputA.length; i++) {
        const charInputA = inputA[i];
        const charInputB = inputB[i];

        if (charInputA != charInputB) {
            differenceCount++;
        }
    }

    if(isSmudge){
        return differenceCount / 2;
    }

    return differenceCount
}

function findVerticalMirrorIndexesOfRow(terrainPatternRow) {
    const mirrorIndexes = new Set();

    for (let i = 0; i < terrainPatternRow.length; i++) {
        if (isShiftIndexValid(i, terrainPatternRow)) {
            mirrorIndexes.add(i);
        }

        if (isShiftIndexValid(-i, terrainPatternRow)) {
            mirrorIndexes.add(-i);
        }
    }

    return mirrorIndexes;
}

function isShiftIndexValid(index, pattern) {
    const reversedPattern = getReversed(pattern);

    if (index == 0 || index == pattern.length - 1) {
        return false;
    }

    if (Math.abs(index % 2) != pattern.length % 2) {
        return false;
    }

    if (index < 0) {
        const leftShiftPatternSubstring = pattern.substring(0, pattern.length + index);
        const leftShiftMirrordPatternSubstring = reversedPattern.substring(index * -1);
        return leftShiftPatternSubstring.startsWith(leftShiftMirrordPatternSubstring);
    }
    else {
        const rightShiftPatternSubstring = pattern.substring(index);
        const rightShiftMirrordPatternSubstring = reversedPattern.substring(0, reversedPattern.length - index);
        return rightShiftMirrordPatternSubstring.startsWith(rightShiftPatternSubstring);
    }

}

function getShiftIndexDifferenceCount(index, pattern) {
    const reversedPattern = getReversed(pattern);

    if (index == 0 || index == pattern.length - 1) {
        return null;
    }

    if (Math.abs(index % 2) != pattern.length % 2) {
        return null;
    }

    if (index < 0) {
        const leftShiftPatternSubstring = pattern.substring(0, pattern.length + index);
        const leftShiftMirrordPatternSubstring = reversedPattern.substring(index * -1);
        return getDifferenceCount(leftShiftPatternSubstring, leftShiftMirrordPatternSubstring, true);
    }
    else {
        const rightShiftPatternSubstring = pattern.substring(index);
        const rightShiftMirrordPatternSubstring = reversedPattern.substring(0, reversedPattern.length - index);
        return getDifferenceCount(rightShiftPatternSubstring, rightShiftMirrordPatternSubstring, true);
    }

}

function findVerticalMirrorIndexOfPattern(terrainPattern) {

    const potentialShiftIndexes = findVerticalMirrorIndexesOfRow(terrainPattern[0]);

    for (let i = 0; i < terrainPattern.length; i++) {
        const pattern = terrainPattern[i];
        const iteratableIndexes = Array.from(potentialShiftIndexes);
        for (let j = 0; j < iteratableIndexes.length; j++) {
            const index = iteratableIndexes[j];

            if (isShiftIndexValid(index, pattern)) {
                continue;
            }
            else {
                potentialShiftIndexes.delete(index);
            }
        }
    }

    const iteratableIndexes = Array.from(potentialShiftIndexes);
    const indexes = [];

    for (let i = 0; i < iteratableIndexes.length; i++) {
        const index = iteratableIndexes[i];
        indexes.push(calculateElementCountLeftFromMirror(terrainPattern[0].length, index));
    }

    return indexes;
}

function findVerticalMirrorIndexOfPatternWithSmudge(terrainPattern) {
    
    const indexDifferenceMap = new Map();
    
    for (let i = 0; i < terrainPattern.length; i++) {
        const pattern = terrainPattern[i];        

        for (let j = 0; j < pattern.length; j++) {

            if (indexDifferenceMap.has(j) == false) {
                indexDifferenceMap.set(j, 0);
                indexDifferenceMap.set(-j, 0);
            }
    
            const currentDifferencesPos = indexDifferenceMap.get(j);
            const currentDifferencesNeg = indexDifferenceMap.get(-j);
            indexDifferenceMap.set(j, currentDifferencesPos + getShiftIndexDifferenceCount(j, pattern));
            indexDifferenceMap.set(-j, currentDifferencesNeg + getShiftIndexDifferenceCount(-j, pattern));
        }

    }

    const indexes = [];

    for (const [key, value] of indexDifferenceMap) {

        if (value == 1) {
            indexes.push(calculateElementCountLeftFromMirror(terrainPattern[0].length, key));
        }

    }

    return indexes;
}

function findHorizontalIndexOfPattern(terrainPattern) {
    let lastRow = "";

    for (let i = 0; i < terrainPattern.length; i++) {
        const row = terrainPattern[i];

        if (row == lastRow) {
            let isMatch = true;

            for (let j = 0; j < terrainPattern.length - i; j++) {
                const validationRowUpper = terrainPattern[i + j];
                const compareIndex = i - (j + 1);

                if (compareIndex < 0) {
                    break;
                }

                const validationRowLower = terrainPattern[compareIndex];

                if (validationRowLower != validationRowUpper) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return i;
            }
        }

        lastRow = row;
    }

    return null;
}

function findHorizontalIndexOfPatternWithSmudge(terrainPattern) {
    let lastRow = "";

    for (let i = 0; i < terrainPattern.length; i++) {
        const row = terrainPattern[i];
        let differenceCount = getDifferenceCount(row, lastRow);

        if (differenceCount < 2) {
            differenceCount = 0;
            let isMatch = true;

            for (let j = 0; j < terrainPattern.length - i; j++) {
                const validationRowUpper = terrainPattern[i + j];
                const compareIndex = i - (j + 1);

                if (compareIndex < 0) {
                    break;
                }

                const validationRowLower = terrainPattern[compareIndex];

                differenceCount += getDifferenceCount(validationRowLower, validationRowUpper);
                if (differenceCount > 1) {
                    isMatch = false;
                    break;
                }
            }

            isMatch = differenceCount == 1;
            if (isMatch) {
                return i;
            }
        }

        lastRow = row;
    }

    return null;
}

function main() {
    terrainPatterns.push(currentTerrainPattern);

    let sum = 0;

    for (let i = 0; i < terrainPatterns.length; i++) {
        const pattern = terrainPatterns[i];

        let verticalMirrorIndexes = findVerticalMirrorIndexOfPatternWithSmudge(pattern);

        let horizontalMirrorIndex = findHorizontalIndexOfPatternWithSmudge(pattern);


        // if ((!verticalMirrorIndexes || verticalMirrorIndexes.length == 0) && !horizontalMirrorIndex) {
        //     verticalMirrorIndexes = findVerticalMirrorIndexOfPattern(pattern);
        //     horizontalMirrorIndex = findHorizontalIndexOfPattern(pattern);
        // }

        if (verticalMirrorIndexes.length > 0) {
            sum += verticalMirrorIndexes[0];
        }

        if (horizontalMirrorIndex) {
            sum += 100 * horizontalMirrorIndex;
        }

        console.log(verticalMirrorIndexes + " | " + horizontalMirrorIndex)
    }

    console.log(sum);
}
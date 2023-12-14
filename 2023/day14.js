const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day14.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine);
rl.on("close", main);

const CUBE_ROCK = '#';
const ROUND_ROCK = 'O';
const platform = [];
const cubeShapeRocks = new Map();

let lineIndex = 0;
function processLine(line) {
    const splittedLine = line.split('');
    platform.push(splittedLine);

    const cubeShapeRockIndexes = getIndexesOf(splittedLine, CUBE_ROCK)
    processCubeRocks(lineIndex, cubeShapeRockIndexes);

    lineIndex++;
}

function main() {
    const roundedRocks = tiltPlatformNorth();

    const totalLoad = calculateTotalLoad(lineIndex, roundedRocks);
    console.log(totalLoad);
}


function getIndexesOf(array, input) {
    const tempArray = [...array];
    const indexes = [];

    let indexOf = tempArray.indexOf(input);

    while (indexOf != -1) {
        indexes.push(indexOf + indexes.length);
        tempArray.splice(indexOf, 1);
        indexOf = tempArray.indexOf(input);
    }

    return indexes;
}

function processCubeRocks(lineIndex, cubeRocks) {
    for (let i = 0; i < cubeRocks.length; i++) {
        const cubeRockIndex = cubeRocks[i];

        if (cubeShapeRocks.has(cubeRockIndex) == false) {
            cubeShapeRocks.set(cubeRockIndex, new Set());
        }

        cubeShapeRocks.get(cubeRockIndex).add(lineIndex);
    }
}

function tiltPlatformNorth() {

    const roundRockMap = new Map();

    for (let i = 0; i < platform.length; i++) {
        const line = platform[i];

        for (let j = 0; j < line.length; j++) {
            const column = line[j];

            if (column != ROUND_ROCK) {
                continue;
            }

            if (roundRockMap.has(j) == false) {
                const initialArray = [];
                initialArray.push(-1);
                roundRockMap.set(j, initialArray);
            }

            let nextObstacle = roundRockMap.get(j).at(-1);
            if (cubeShapeRocks.has(j)) {
                const cubeShapeRocksInColumn = cubeShapeRocks.get(j);

                const potentialRocks = Array.from(cubeShapeRocksInColumn)
                    .filter(index => index < i && index > nextObstacle)
                    .sort((a, b) => a - b);

                if (potentialRocks.length > 0) {
                    nextObstacle = potentialRocks.at(-1);
                }
            }

            roundRockMap.get(j).push(nextObstacle + 1);
        }
    }

    for (const [key, value] of roundRockMap) {
        value.splice(0, 1);
    }

    return roundRockMap;
}

function calculateTotalLoad(plattformHeight, roundedRockMap) {
    let load = 0;

    for (const [key, rockIndexes] of roundedRockMap) {
        for (let i = 0; i < rockIndexes.length; i++) {
            const rockIndex = rockIndexes[i];

            load += plattformHeight - rockIndex;
        }
    }

    return load;
}
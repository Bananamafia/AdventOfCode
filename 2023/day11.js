const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day11.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", setGalaxyCoordinates)

rl.on("close", main);

const galaxyCoordinates = [];
const rowsWithGalaxy = new Set();
const columnsWithGalaxy = new Set();
let lineIndex = 0;
let columnCount;

function setGalaxyCoordinates(line) {
    const splittedLine = line.split('');

    if (!columnCount) {
        columnCount = splittedLine.length;
    }

    let hasGalaxyInRow = false;

    for (let i = 0; i < splittedLine.length; i++) {
        const character = splittedLine[i];

        if (character == '#') {
            galaxyCoordinates.push(new GalaxyCoordinate(i, lineIndex));
            columnsWithGalaxy.add(i);
            hasGalaxyInRow = true;
        }
    }

    if (hasGalaxyInRow) {
        rowsWithGalaxy.add(lineIndex);
    }

    lineIndex++;
}

function main() {
    updateGalaxyCoordinatesByExpand(galaxyCoordinates, rowsWithGalaxy, columnsWithGalaxy)
    const minimumDistance = calculateMinimumDistanceBetweenGalaxies(galaxyCoordinates);
    console.log(minimumDistance);
}

function updateGalaxyCoordinatesByExpand(galaxyCoordinates, rowsWithGalaxy, columnsWithGalaxy) {
    for (let i = columnCount - 1; i >= 0; i--) {
        if (columnsWithGalaxy.has(i)) {
            continue;
        }

        const affectedGalaxies = galaxyCoordinates.filter(galaxy => galaxy.x > i);
        for (let j = 0; j < affectedGalaxies.length; j++) {
            const galaxy = affectedGalaxies[j];
            galaxy.x = galaxy.x + 1;            
        }
    }

    for (let i = lineIndex; i >= 0; i--) {
        if (rowsWithGalaxy.has(i)) {
            continue;
        }

        const affectedGalaxies = galaxyCoordinates.filter(galaxy => galaxy.y > i);
        for (let j = 0; j < affectedGalaxies.length; j++) {
            const galaxy = affectedGalaxies[j];
            galaxy.y = galaxy.y + 1            
        }
    }
}

function calculateMinimumDistanceBetweenGalaxies(galaxyCoordinates) {
    let distanceSum = 0;

    for (let i = 0; i < galaxyCoordinates.length - 1; i++) {
        const galaxy = galaxyCoordinates[i];

        for (let j = i + 1; j < galaxyCoordinates.length; j++) {
            const referenceGalaxy = galaxyCoordinates[j];
            distanceSum += galaxy.calculateDistance(referenceGalaxy);
        }
    }

    return distanceSum;
}



class GalaxyCoordinate {
    x;
    y;

    constructor(x, y) {
        this.update(x, y);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    calculateDistance(coordinate) {
        return Math.abs(this.x - coordinate.x) + Math.abs(this.y - coordinate.y);
    }
}
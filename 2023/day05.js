let seedStrings = [];
const mappings = new Map();
let currentMappingKey;
let currentRanges = [];
const SOURCE = "source";
const DESTINATION = "destination";
const RANGES = "ranges";
const MAP = "map:";
const SEEDS = "seeds:"

const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day05.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", (line) => {

    if (line.startsWith(SEEDS)) {
        ProcessSeedLine(line);
    }
    else if (line.endsWith(MAP)) {
        ProcessNewMapping(line);
    }
    else if (line != "") {
        ProcessingMappingValues(line);
    }
    else {
        SetRangesToCurrentMapping();
    }
})

rl.on("close", () => {

    SetRangesToCurrentMapping();
    const locations = getLocationsForSeeds(seedStrings);

    locations.sort(compareNumbers);
    console.log(locations[0]);


    // Caution: kinda bruteforce
    let lowest = Infinity;
    for (let i = 0; i < seedStrings.length; i += 2) {
        const seedStartingIndex = parseInt(seedStrings[i]);
        const seedRange = parseInt(seedStrings[i + 1]);

        for (let j = 0; j < seedRange; j++) {
            let tempLowest = getLocationForSeed(seedStartingIndex + j);

            if (tempLowest < lowest) {
                lowest = tempLowest;
            }
        }
    }

    console.log(lowest);

});

function ProcessSeedLine(line) {
    const seedValueString = line.replace(SEEDS, "").trim();
    seedStrings = seedValueString.split(' ');
}

function ProcessNewMapping(line) {
    currentRanges = [];
    const currentMapping = new Map();

    const mapString = line.replace(MAP, "").trim();
    const mapParts = mapString.split('-');
    const source = mapParts[0];
    const destination = mapParts[2];
    currentMapping.set(SOURCE, source);
    currentMapping.set(DESTINATION, destination);

    currentMappingKey = source;
    mappings.set(currentMappingKey, currentMapping);
}

function ProcessingMappingValues(line) {
    const lineParts = line.split(' ');

    if (lineParts.length != 3) {
        return;
    }

    const destinationRangeStart = parseInt(lineParts[0]);
    const sourceRangeStart = parseInt(lineParts[1]);
    const rangeLength = parseInt(lineParts[2]);
    const offSet = destinationRangeStart - sourceRangeStart;
    const sourceRangeEnd = sourceRangeStart + (rangeLength - 1);

    currentRanges.push(new MapRange(sourceRangeStart, sourceRangeEnd, offSet));
}

function SetRangesToCurrentMapping() {
    if (currentMappingKey) {
        mappings.get(currentMappingKey).set(RANGES, currentRanges);
    }
}

function getLocationForSeed(seed) {
    let currentMapInput = new MapInput(seed, "seed");

    while (currentMapInput.sourceName) {
        currentMapInput = getNextValueAndDestination(currentMapInput);
    }

    return currentMapInput.input;
}

function getLocationsForSeeds(seedStrings) {

    const locations = [];

    for (let i = 0; i < seedStrings.length; i++) {
        const seedString = seedStrings[i];
        const seed = parseInt(seedString);
        locations.push(getLocationForSeed(seed));
    }

    return locations;
}

function getNextValueAndDestination(mapInput) {
    const currentMapping = mappings.get(mapInput.sourceName);

    if (!currentMapping) {
        return new MapInput(mapInput.input, null);
    }

    const ranges = currentMapping.get(RANGES);
    const destination = currentMapping.get(DESTINATION);

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];

        if (range.lowerBound <= mapInput.input && mapInput.input <= range.upperBound) {
            return new MapInput((mapInput.input + range.offSet), destination);
        }
    }

    return new MapInput(mapInput.input, destination);
}

function compareNumbers(a, b) {
    return a - b;
}

class MapInput {
    input;
    sourceName;

    constructor(input, sourceName) {
        this.input = input;
        this.sourceName = sourceName;
    }
}

class MapRange {
    lowerBound;
    upperBound;
    offSet;

    constructor(lowerBound, upperBound, offSet) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.offSet = offSet;
    }
}
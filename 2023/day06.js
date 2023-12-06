const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day06.txt", "utf-8");
const rl = readLine.createInterface(stream);


class Race {
    time;
    distance;
}

function calculateDistance(raceDuration, pressDuration) {
    return (raceDuration - pressDuration) * pressDuration;
}

function getTimesToBeatRecord(raceDuration, currentRecord) {

    const a = -1;
    const b = raceDuration;
    const c = -1 * currentRecord;

    // Mitternachtsformel
    const rootFrom = (b * b) - (4 * a * c);
    const minDuration = Math.ceil((-1 * b + Math.sqrt(rootFrom)) / (2 * a));
    const maxDuration = Math.floor((-1 * b - Math.sqrt(rootFrom)) / (2 * a));

    return { minDuration: minDuration, maxDuration: maxDuration };
}

function getPossibleWinCounts(minDurationToPress, maxDurationToPress) {
    return maxDurationToPress - minDurationToPress + 1;
}

const races = [];
let mainRace = new Race();
mainRace.time = "";
mainRace.distance = "";

rl.on("line", (line) => {

    const titleValueSplit = line.split(':');
    const values = titleValueSplit[1].replace(/\s+/g, ' ').trim().split(' ');

    if (titleValueSplit[0] == "Time") {
        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            if (!races[i]) {
                races[i] = new Race();
            }

            races[i].time = parseInt(value);

            mainRace.time += value;
        }
    }
    else if (titleValueSplit[0] == "Distance") {
        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            if (!races[i]) {
                races[i] = new Race();
            }

            races[i].distance = parseInt(value);
            mainRace.distance += value;
        }
    }

})

rl.on("close", () => {

    let solution = 1;

    for (let i = 0; i < races.length; i++) {
        const race = races[i];
        const timesToWin = getTimesToBeatRecord(race.time, race.distance);
        solution *= getPossibleWinCounts(timesToWin.minDuration, timesToWin.maxDuration);
    }

    console.log(solution);

    const mainRaceDistance = parseInt(mainRace.distance);
    const mainRaceDuration = parseInt(mainRace.time);
    const timesToBeatMainRace = getTimesToBeatRecord(mainRaceDuration, mainRaceDistance);
    const solution2 = getPossibleWinCounts(timesToBeatMainRace.minDuration, timesToBeatMainRace.maxDuration);
    console.log(solution2);

});
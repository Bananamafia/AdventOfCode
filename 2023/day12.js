
const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day12.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine);
rl.on("close", main);


const OPERATIONAL = '.';
const DAMAGED = '#';
const UNKNOWN = '?';
const conditionRecords = [];

function processLine(line) {
    conditionRecords.push(new ConditionRecord(line));
}

function main() {
    let possibilityCount = 0;

    for (let i = 0; i < conditionRecords.length; i++) {
        const record = conditionRecords[i];
        record.Unfold(5);
        possibilityCount += record.CalculatePossibilities();
    }

    console.log(possibilityCount);
}

function getCopyOfArray(array) {
    return [...array];
}

class ConditionRecord {
    springDescription;
    damagedGroups;

    constructor(line) {
        const splittedLine = line.split(' ');
        this.springDescription = splittedLine[0];
        this.damagedGroups = splittedLine[1].split(',');
    }

    Unfold(factor) {
        this.springDescription += "?";
        this.springDescription = this.springDescription.repeat(factor);
        this.springDescription = this.springDescription.substring(0, this.springDescription.length - 1);

        this.damagedGroups = Array(factor).fill(this.damagedGroups).flat();
    }

    #cache = new Map();

    #GetCacheKey(springDescription, damagedGroups) {
        return JSON.stringify({ description: springDescription, groups: damagedGroups });
    }

    #CalculatePossibilities(springDescriptionExtract, damagedGroups) {
        const key = this.#GetCacheKey(springDescriptionExtract, damagedGroups);

        if (this.#cache.has(key)) {
            return this.#cache.get(key);
        }

        let possibilities = 0;

        if (springDescriptionExtract.includes(DAMAGED) && damagedGroups.length == 0) {
            this.#cache.set(key, 0);
            return 0;
        }

        if (!springDescriptionExtract.includes(DAMAGED) && damagedGroups.length == 0) {
            this.#cache.set(key, 1);
            return 1;
        }

        if (springDescriptionExtract.startsWith(OPERATIONAL) || springDescriptionExtract.startsWith(UNKNOWN)) {
            const springDescriptionShift = springDescriptionExtract.substring(1);
            possibilities += this.#CalculatePossibilities(springDescriptionShift, getCopyOfArray(damagedGroups));
        }

        if ((springDescriptionExtract.startsWith(DAMAGED) || springDescriptionExtract.startsWith(UNKNOWN)) && damagedGroups.length > 0) {
            if (springDescriptionExtract.length < damagedGroups[0]) {
                this.#cache.set(key, possibilities);
                return possibilities;
            }

            const copiedDamageGroups = getCopyOfArray(damagedGroups);
            const firstDamagedGroup = copiedDamageGroups.shift();
            const potentialDamagedGroup = springDescriptionExtract.substring(0, firstDamagedGroup)
            const springDescriptionShift = springDescriptionExtract.substring(firstDamagedGroup);

            if (!potentialDamagedGroup.includes(OPERATIONAL)) {
                if (springDescriptionShift.length == 0 && copiedDamageGroups.length == 0) {
                    possibilities += 1;
                }
                else if (!springDescriptionShift.startsWith(DAMAGED)) {
                    possibilities += this.#CalculatePossibilities(springDescriptionShift.substring(1), getCopyOfArray(copiedDamageGroups));
                }
            }
        }

        this.#cache.set(key, possibilities);
        return possibilities;
    }


    CalculatePossibilities() {
        return this.#CalculatePossibilities(this.springDescription, this.damagedGroups);
    }
}
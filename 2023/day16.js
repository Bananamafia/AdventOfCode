const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day16.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine);
rl.on("close", main);


const TOP = "top";
const BOTTOM = "bottom";
const LEFT = "left";
const RIGHT = "right";

const EMPTY_SPACE = ".";
const MIRROR_TOPLEFT_BOTTOMRIGHT = "\\";
const MIRROR_TOPRIGHT_BOTTOMLEFT = "/";
const SPLITTER_HORIZONTAL = "-";
const SPLITTER_VERTICAL = "|";

const facilityMap = [];
const cache = new Set();
const queue = [];
const energizedFields = new Set();

function processLine(line) {
    facilityMap.push(line.split(''));
}

function main() {
    let previouseCoordinate = new FacilityCoordinate(-1, 0);
    let currentCoordinate = new FacilityCoordinate(0, 0);

    processLaser(previouseCoordinate, currentCoordinate);
    processLaserQueue();

    console.log(energizedFields.size);
}

function processLaserQueue() {
    while (queue.length > 0) {
        const queueElement = queue.shift();

        if (cache.has(JSON.stringify({ previous: queueElement.previous, current: queueElement.current }))) {
            continue;
        }

        cache.add(JSON.stringify({ previous: queueElement.previous, current: queueElement.current }));

        if (queueElement.current.x >= facilityMap[0].length || queueElement.current.x < 0) {
            continue;
        }

        if (queueElement.current.y >= facilityMap.length || queueElement.current.y < 0) {
            continue;
        }

        processLaser(queueElement.previous, queueElement.current);
    }
}

function processLaser(previouseCoordinate, currentCoordinate) {
    energizedFields.add(currentCoordinate.GetIdentifier());
    let currentCharacter = facilityMap[currentCoordinate.y][currentCoordinate.x];
    const nextCoordinates = currentCoordinate.CalculateNextCoordinates(previouseCoordinate, currentCharacter);

    for (let i = 0; i < nextCoordinates.length; i++) {
        const nextCoordinate = nextCoordinates[i];
        queue.push({ previous: currentCoordinate, current: nextCoordinate });
    }
}

class FacilityCoordinate {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    GetIdentifier() {
        return JSON.stringify(this);
    }

    #getDirectionComingFrom(previousCoordinate) {
        if (previousCoordinate.x < this.x) {
            return LEFT;
        }
        else if (previousCoordinate.x > this.x) {
            return RIGHT;
        }

        if (previousCoordinate.y < this.y) {
            return TOP;
        }
        else if (previousCoordinate.y > this.y) {
            return BOTTOM;
        }
    }

    CalculateNextCoordinates(previousCoordinate, tile) {
        const nextCoordinates = [];
        const directionComingFrom = this.#getDirectionComingFrom(previousCoordinate);

        switch (tile) {
            case EMPTY_SPACE:
                switch (directionComingFrom) {
                    case TOP:
                        nextCoordinates.push(new FacilityCoordinate(this.x, this.y + 1));
                        break;
                    case BOTTOM:
                        nextCoordinates.push(new FacilityCoordinate(this.x, this.y - 1));
                        break;
                    case LEFT:
                        nextCoordinates.push(new FacilityCoordinate(this.x + 1, this.y));
                        break;
                    case RIGHT:
                        nextCoordinates.push(new FacilityCoordinate(this.x - 1, this.y));
                        break;
                }
                break;

            case SPLITTER_HORIZONTAL:
                if (directionComingFrom != LEFT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x + -1, this.y));
                }

                if (directionComingFrom != RIGHT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x + 1, this.y));
                }

                break;

            case SPLITTER_VERTICAL:
                if (directionComingFrom != TOP) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y - 1));
                }

                if (directionComingFrom != BOTTOM) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y + 1));
                }

                break;

            case MIRROR_TOPLEFT_BOTTOMRIGHT:
                if (directionComingFrom == LEFT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y + 1));
                }
                else if (directionComingFrom == TOP) {
                    nextCoordinates.push(new FacilityCoordinate(this.x + 1, this.y));
                }
                else if (directionComingFrom == RIGHT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y - 1));
                }
                else {
                    nextCoordinates.push(new FacilityCoordinate(this.x - 1, this.y));
                }

                break;

            case MIRROR_TOPRIGHT_BOTTOMLEFT:
                if (directionComingFrom == LEFT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y - 1));
                }
                else if (directionComingFrom == TOP) {
                    nextCoordinates.push(new FacilityCoordinate(this.x - 1, this.y));
                }
                else if (directionComingFrom == RIGHT) {
                    nextCoordinates.push(new FacilityCoordinate(this.x, this.y + 1));
                }
                else {
                    nextCoordinates.push(new FacilityCoordinate(this.x + 1, this.y));
                }

                break;

            default:
                break;
        }

        return nextCoordinates;
    }
}

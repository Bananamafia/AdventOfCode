const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day10.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine)

rl.on("close", main);

const START_LOCATION = 'S';
const NORTH_SOUTH = "|";
const EAST_WEST = "-";
const NORTH_EAST = "L";
const NORTH_WEST = "J";
const SOUTH_WEST = "7";
const SOUTH_EAST = "F";
const GROUND = ".";
const LEFT = "left";
const RIGHT = "right";
const TOP = "top";
const BOTTOM = "bottom";

let pipeDiagram = [];
let startCoordinate;
const pipeCoordinates = new Set();
let pipeCount = 0;
let outerSide = "";
let groundLeftFromPipe = new Set();
let groundRightFromPipe = new Set();


function main() {
    transposePipeDiagram();
    traversePipe();
    traversePipeWithGroundsets();

    console.log(getMaxDistance(pipeCount));

    if (outerSide == RIGHT) {
        console.log(groundLeftFromPipe.size);
    }
    else if (outerSide == LEFT) {
        console.log(groundRightFromPipe.size);
    }
}

function processLine(line) {
    addLineToPipeDiagram(line);

    if (line.includes(START_LOCATION)) {
        setStartingPosition(line);
    }
}

function addLineToPipeDiagram(line) {
    const pipes = line.split('')
    pipeDiagram.push(pipes);
}

function setStartingPosition(line) {
    const startX = line.indexOf(START_LOCATION);
    const startY = pipeDiagram.length - 1;
    startCoordinate = new PipeCoordinate(startX, startY);
}

function transposePipeDiagram() {
    pipeDiagram[0].map((_, colIndex) => pipeDiagram.map(row => row[colIndex]));
}

function traversePipe() {

    let previousCoordinate = startCoordinate;
    let currentCoordinate = new PipeCoordinate(startCoordinate.x, startCoordinate.y + 1);

    let currentPipeType;
    do {
        currentPipeType = pipeDiagram[currentCoordinate.y][currentCoordinate.x];
        const tempCurrentPipe = new PipeCoordinate(currentCoordinate.x, currentCoordinate.y);
        currentCoordinate.SetToNext(previousCoordinate, currentPipeType);
        previousCoordinate = tempCurrentPipe;

        pipeCoordinates.add(PipeCoordinate.GetPipeId(currentCoordinate.x, currentCoordinate.y));
        pipeCount++;
    } while (currentPipeType != START_LOCATION);
}

function traversePipeWithGroundsets() {

    let previousCoordinate = startCoordinate;
    let currentCoordinate = new PipeCoordinate(startCoordinate.x, startCoordinate.y + 1);

    let currentPipeType;
    do {
        currentPipeType = pipeDiagram[currentCoordinate.y][currentCoordinate.x];

        fillGroundSets(previousCoordinate, currentCoordinate, currentPipeType);

        const tempCurrentPipe = new PipeCoordinate(currentCoordinate.x, currentCoordinate.y);
        currentCoordinate.SetToNext(previousCoordinate, currentPipeType);
        previousCoordinate = tempCurrentPipe;
    } while (currentPipeType != START_LOCATION);
}

function fillGroundSets(previousCoordninate, currentCoordinate, currentPipeType) {
    const directionComingFrom = PipeCoordinate.GetDirectionComingFrom(previousCoordninate, currentCoordinate);

    const leftIds = getGroundLeftFromPipe(currentCoordinate);
    const rightIds = getGroundRightFromPipe(currentCoordinate);
    const topIds = getGroundAbovePipe(currentCoordinate);
    const bottomIds = getGroundBelowPipe(currentCoordinate);

    switch (currentPipeType) {
        case GROUND:
            throw Error("Can't find direction from ground.");
        case NORTH_SOUTH:
            if (directionComingFrom == TOP) {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...leftIds.ids])
                if (leftIds.wasOuterSide) {
                    outerSide = RIGHT;
                }

                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...rightIds.ids]);
                if (rightIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            else {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...rightIds.ids])
                if (rightIds.wasOuterSide) {
                    outerSide = RIGHT;
                }

                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...leftIds.ids]);
                if (leftIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            break;
        case EAST_WEST:
            if (directionComingFrom == LEFT) {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...topIds.ids])
                if (topIds.wasOuterSide) {
                    outerSide = LEFT;
                }

                groundRightFromPipe = new Set([...groundRightFromPipe, ...bottomIds.ids]);
                if (bottomIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            else {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...bottomIds.ids])
                if (bottomIds.wasOuterSide) {
                    outerSide = LEFT;
                }

                groundRightFromPipe = new Set([...groundRightFromPipe, ...topIds.ids]);
                if (topIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            break;
        case NORTH_EAST:
            if (directionComingFrom == TOP) {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...leftIds.ids, ...bottomIds.ids]);
                if (leftIds.wasOuterSide || bottomIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            else {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...leftIds.ids, ...bottomIds.ids]);
                if (leftIds.wasOuterSide || bottomIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            break;
        case NORTH_WEST:
            if (directionComingFrom == TOP) {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...rightIds.ids, ...bottomIds.ids]);
                if (rightIds.wasOuterSide || bottomIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            else {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...rightIds.ids, ...bottomIds.ids]);
                if (rightIds.wasOuterSide || bottomIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            break;
        case SOUTH_WEST:
            if (directionComingFrom == BOTTOM) {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...rightIds.ids, ...topIds.ids]);
                if (rightIds.wasOuterSide || topIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            else {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...rightIds.ids, ...topIds.ids]);
                if (rightIds.wasOuterSide || topIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            break;
        case SOUTH_EAST:
            if (directionComingFrom == BOTTOM) {
                groundLeftFromPipe = new Set([...groundLeftFromPipe, ...leftIds.ids, ...topIds.ids]);
                if (leftIds.wasOuterSide || topIds.wasOuterSide) {
                    outerSide == LEFT;
                }
            }
            else {
                groundRightFromPipe = new Set([...groundRightFromPipe, ...leftIds.ids, ...topIds.ids]);
                if (leftIds.wasOuterSide || topIds.wasOuterSide) {
                    outerSide == RIGHT;
                }
            }
            break;
    }
}

function getGroundAbovePipe(currentCoordinate) {
    const groundIds = new Set();

    let currentAboveIndex = currentCoordinate.y - 1;
    while (currentAboveIndex >= -1) {
        try {
            currentPipeType = pipeDiagram[currentAboveIndex][currentCoordinate.x];
            
            const isNotPartOfPipe = !pipeCoordinates.has(PipeCoordinate.GetPipeId(currentCoordinate.x, currentAboveIndex));

            if (currentPipeType && isNotPartOfPipe) {
                groundIds.add(PipeCoordinate.GetPipeId(currentCoordinate.x, currentAboveIndex));
                currentAboveIndex--;
            }
            else if (!currentPipeType) {
                return { ids: groundIds, wasOuterSide: true };
            }
            else {
                break;
            }
        } catch {
            return { ids: groundIds, wasOuterSide: true };
        }
    }

    return { ids: groundIds, wasOuterSide: false };
}

function getGroundBelowPipe(currentCoordinate) {
    const groundIds = new Set();

    let currentBelowIndex = currentCoordinate.y + 1;
    while (currentBelowIndex <= pipeDiagram.length) {
        try {
            currentPipeType = pipeDiagram[currentBelowIndex][currentCoordinate.x];

            const isNotPartOfPipe = !pipeCoordinates.has(PipeCoordinate.GetPipeId(currentCoordinate.x, currentBelowIndex));

            if (currentPipeType && isNotPartOfPipe) {
                groundIds.add(PipeCoordinate.GetPipeId(currentCoordinate.x, currentBelowIndex));
                currentBelowIndex++;
            }
            else if (!currentPipeType) {
                return { ids: groundIds, wasOuterSide: true };
            }
            else {
                break;
            }
        } catch {
            return { ids: groundIds, wasOuterSide: true };
        }
    }

    return { ids: groundIds, wasOuterSide: false };
}

function getGroundLeftFromPipe(currentCoordinate) {
    const groundIds = new Set();

    let currentLeftFromIndex = currentCoordinate.x - 1;
    while (currentLeftFromIndex >= -1) {
        try {
            currentPipeType = pipeDiagram[currentCoordinate.y][currentLeftFromIndex];

            const isNotPartOfPipe = !pipeCoordinates.has(PipeCoordinate.GetPipeId(currentLeftFromIndex, currentCoordinate.y));


            if (currentPipeType && isNotPartOfPipe) {
                groundIds.add(PipeCoordinate.GetPipeId(currentLeftFromIndex, currentCoordinate.y));
                currentLeftFromIndex--;
            }
            else if (!currentPipeType) {
                return { ids: groundIds, wasOuterSide: true };
            }
            else {
                break;
            }
        } catch {
            return { ids: groundIds, wasOuterSide: true };
        }
    }

    return { ids: groundIds, wasOuterSide: false };
}

function getGroundRightFromPipe(currentCoordinate) {
    const groundIds = new Set();

    let currentRightFromIndex = currentCoordinate.x + 1;
    while (currentRightFromIndex <= pipeDiagram[currentCoordinate.y].length) {
        try {
            currentPipeType = pipeDiagram[currentCoordinate.y][currentRightFromIndex];

            const isNotPartOfPipe = !pipeCoordinates.has(PipeCoordinate.GetPipeId(currentRightFromIndex, currentCoordinate.y));

            if (currentPipeType && isNotPartOfPipe) {
                groundIds.add(PipeCoordinate.GetPipeId(currentRightFromIndex, currentCoordinate.y));
                currentRightFromIndex++;
            }
            else if (!currentPipeType) {
                return { ids: groundIds, wasOuterSide: true };
            }
            else {
                break;
            }
        } catch {
            return { ids: groundIds, wasOuterSide: true };
        }
    }

    return { ids: groundIds, wasOuterSide: false };
}

function getMaxDistance(pipeCount) {
    return Math.ceil(pipeCount / 2);
}

class PipeCoordinate {
    x;
    y;

    constructor(x, y) {
        this.Update(x, y);
    }

    Update(x, y) {
        this.x = x;
        this.y = y;
    }

    static GetPipeId(x, y) {
        const coordinate = new PipeCoordinate(x, y);
        return JSON.stringify(coordinate);
    }

    static GetDirectionComingFrom(previous, current) {
        if (previous.x < current.x) {
            return LEFT;
        }
        else if (previous.x > current.x) {
            return RIGHT;
        }
        else if (previous.y < current.y) {
            return TOP;
        }
        else if (previous.y > current.y) {
            return BOTTOM;
        }
        else {
            return "UNKNWON";
        }
    }

    SetToNext(previous, pipeType) {
        switch (pipeType) {
            case GROUND:
                throw Error("Can't find direction from ground.");
            case NORTH_SOUTH:
                if (previous.y < this.y) {
                    this.y++;
                }
                else {
                    this.y--;
                }
                break;
            case EAST_WEST:
                if (previous.x < this.x) {
                    this.x++;
                }
                else {
                    this.x--;
                }
                break;
            case NORTH_EAST:
                if (previous.y < this.y) {
                    this.x++;
                }
                else {
                    this.y--;
                }
                break;
            case NORTH_WEST:
                if (previous.y < this.y) {
                    this.x--;
                }
                else {
                    this.y--;
                }
                break;
            case SOUTH_WEST:
                if (previous.y > this.y) {
                    this.x--;
                }
                else {
                    this.y++;
                }
                break;
            case SOUTH_EAST:
                if (previous.y > this.y) {
                    this.x++;
                }
                else {
                    this.y++;
                }
                break;

            default:
                break;
        }
    }
}


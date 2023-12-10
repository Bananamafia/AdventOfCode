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

let pipeDiagram = [];
let startCoordinate;
let pipeCount = 0;


function main() {
    transposePipeDiagram();
    traversePipe();

    console.log(getMaxDistance(pipeCount));
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
        pipeCount++;
    } while (currentPipeType != START_LOCATION);
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


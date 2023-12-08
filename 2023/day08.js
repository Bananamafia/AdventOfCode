const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day08.txt", "utf-8");
const rl = readLine.createInterface(stream);

let directionInstructions;
const networkNodes = new Map();

let stepCount = 0;
let currentNodeId = "AAA";
const DESTINATION = "ZZZ";

rl.on("line", (line) => {

    if (!directionInstructions) {
        directionInstructions = line;
        return;
    }

    if (line == '') {
        return;
    }

    const node = new NetworkNode(line);
    networkNodes.set(node.id, node);
})

rl.on("close", () => {

    const startingNodes = getStartingNodes();
    const moveCountsToReachDestination = [];

    for (let i = 0; i < startingNodes.length; i++) {
        const startingNode = startingNodes[i];
        moveCountsToReachDestination.push(getMoveCountForPossibleFinalDestination(startingNode));
    }

    console.log(calculateLCD(moveCountsToReachDestination));
});

function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

function lcd(a, b) {
    return (a * b) / gcd(a, b);
}

function calculateLCD(numbers) {
    if (numbers.length < 2) {
        return NaN;
    }

    let result = lcd(numbers[0], numbers[1]);

    for (let i = 0; i < numbers.length; i++) {
        result = lcd(result, numbers[i]);
    }

    return result;
}

function getStartingNodes() {
    const allNodes = Array.from(networkNodes.keys());
    return allNodes.filter(node => node.endsWith('A'));
}

function getMoveCountForPossibleFinalDestination(networkNodeId) {

    let tempNodeId = networkNodeId;
    let moveCount = 0;

    do {
        for (let i = 0; i < directionInstructions.length; i++) {
            const direction = directionInstructions[i];
            const currentNode = networkNodes.get(tempNodeId);

            tempNodeId = direction == "L" ? currentNode.left : currentNode.right;
            moveCount++;

            if (tempNodeId.endsWith('Z')) {
                break;
            }
        }

    } while (!tempNodeId.endsWith("Z"));

    return moveCount;
}

function travel() {
    while (currentNodeId != DESTINATION) {
        for (let i = 0; i < directionInstructions.length; i++) {
            const direction = directionInstructions[i];
            moveStep(direction);

            if (currentNodeId == DESTINATION) {
                break;
            }
        }
    }
}

function moveStep(direction) {
    const currentNode = networkNodes.get(currentNodeId);

    if (direction == 'L') {
        currentNodeId = currentNode.left;
    }
    else if (direction == 'R') {
        currentNodeId = currentNode.right;
    }

    stepCount++;
}



class NetworkNode {
    id;
    left;
    right;

    constructor(line) {
        const idDirectionSplit = line.split('=');

        this.id = idDirectionSplit[0].trim();
        let directions = idDirectionSplit[1].replace('(', '');
        directions = directions.replace(')', '');

        const leftRightSplit = directions.split(',');
        this.left = leftRightSplit[0].trim();
        this.right = leftRightSplit[1].trim();
    }

}
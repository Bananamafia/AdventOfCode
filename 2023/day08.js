const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day08.txt", "utf-8");
const rl = readLine.createInterface(stream);

let directionInstructions;
const networkNodes = new Map();

let stepCount = 0;
let currentNodeId = "AAA";
const DESTINATION = "ZZZ";

let value2 = 0;

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
    travel();
    console.log(stepCount);
});

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
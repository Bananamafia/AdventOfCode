const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day09.txt", "utf-8");
const rl = readLine.createInterface(stream);

const measureHistories = [];
let sum = 0;

rl.on("line", (line) => {
    const historyValuesNext = line.split(' ').reverse().map(value => parseInt(value));
    const historyValuesPrevious = line.split(' ').map(value => parseInt(value));
    measureHistories.push(historyValuesPrevious);
})

rl.on("close", () => {
    for (let i = 0; i < measureHistories.length; i++) {
        const history = measureHistories[i];

        const latestValue = history[0];
        const historyTree = calculateDifferenceTree(history);
        const nextValue = calculateNextValue(latestValue, historyTree);

        sum += nextValue;
    }

    console.log(sum);
});

function calculateDifferenceTree(history) {
    const tempHistory = [];
    const trees = [];

    for (let i = 0; i < history.length; i++) {
        const currentDifference = getDifferenceOfConsecutives(history, i);

        if (isNaN(currentDifference)) {
            return null;
        }
        else {
            tempHistory.push(currentDifference);
        }

        if (tempHistory.length == history.length - 1) {
            const recursiveTree = calculateDifferenceTree(tempHistory);

            if (recursiveTree) {
                trees.push(tempHistory);
                trees.push(recursiveTree);
                return trees;
            }
            else {
                return tempHistory;
            }
        }
    }
}

function calculateDifferenceTreeTillFirstTimeAllValuesZero(history) {
    const tempHistory = [];
    const trees = [];

    for (let i = 0; i < history.length; i++) {
        const currentDifference = getDifferenceOfConsecutives(history, i);

        if (isNaN(currentDifference)) {
            return null;
        }
        else {
            tempHistory.push(currentDifference);
        }

        if (tempHistory.find(temp => temp != 0)) {
            const recursiveTree = calculateDifferenceTreeTillFirstTimeAllValuesZero(tempHistory);

            if (recursiveTree) {
                trees.push(tempHistory);
                trees.push(recursiveTree);
                return trees;
            }
        }
        else {
            return tempHistory;
        }
    }
}

function calculateNextValue(latestValue, historyTree) {
    let currentHistoryBranch = historyTree;

    while (currentHistoryBranch.length > 1) {

        const output = latestValue + calculateNextValue(currentHistoryBranch[0][0], currentHistoryBranch[1]);
        return output;
    }

    return latestValue + currentHistoryBranch[0];
}


function getDifferenceOfConsecutives(history, indexOfFirst) {
    if (history.length < indexOfFirst + 1) {
        return NaN;
    }

    return history[indexOfFirst] - history[indexOfFirst + 1];
}
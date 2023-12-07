const secondaryScoreMap = new Map([
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["T", 10],
    ["J", 11],
    ["Q", 12],
    ["K", 13],
    ["A", 14]
]);

const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/day07.txt", "utf-8");
const rl = readLine.createInterface(stream);

const camelCardSets = [];
let bidValue = 0;

rl.on("line", (line) => {
    const splittedLine = line.split(' ');
    const camelCardSet = new CamelCardSet(splittedLine[0], splittedLine[1]);
    camelCardSets.push(camelCardSet);
})

rl.on("close", () => {

    const orderdSets = camelCardSets.sort(compareCards);

    for (let i = 0; i < orderdSets.length; i++) {
        const set = orderdSets[i];

        bidValue += set.calculateWinning(i);
    }

    console.log(bidValue);
});



function compareCards(a, b) {
    const primaryScoreA = a.getPrimaryScore();
    const primaryScoreB = b.getPrimaryScore();

    if (primaryScoreA != primaryScoreB) {
        return primaryScoreA - primaryScoreB;
    }

    for (let i = 0; i < a.cards.length; i++) {
        const cardAScore = getSecondaryScoreBySingleCard(a.cards[i]);
        const cardBScore = getSecondaryScoreBySingleCard(b.cards[i]);

        if (cardAScore != cardBScore) {
            return cardAScore - cardBScore;
        }
    }

    return 0;
}

function getSecondaryScoreBySingleCard(card) {
    return secondaryScoreMap.get(card);
}



class CamelCardSet {
    cards;
    bid;
    #cardCounts;

    constructor(cards, bid) {
        this.cards = cards;
        this.bid = bid;

        this.#readCards(cards)
    }

    #readCards(cards) {
        const cardMap = new Map();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            const foundCardCount = cardMap.get(card)
            if (foundCardCount) {
                cardMap.set(card, foundCardCount + 1);
            }
            else {
                cardMap.set(card, 1);
            }
        }

        this.#cardCounts = Array.from(cardMap.values());
    }

    calculateWinning(index) {
        return this.bid * (index + 1);
    }

    getPrimaryScore() {
        if (this.#fiveOfAKind()) {
            return 7;
        }
        else if (this.#fourOfAKind()) {
            return 6;
        }
        else if (this.#fullHouse()) {
            return 5;
        }
        else if (this.#threeOfAKind()) {
            return 4;
        }
        else if (this.#twoPair()) {
            return 3;
        }
        else if (this.#onePair()) {
            return 2;
        }
        else {
            return 1;
        }
    }

    #fiveOfAKind() {
        if (this.#cardCounts.includes(5)) {
            return true;
        }
        return false;
    }

    #fourOfAKind() {
        if (this.#cardCounts.includes(4)) {
            return true;
        }
        return false;
    }

    #fullHouse() {
        if (this.#cardCounts.includes(3) && this.#cardCounts.includes(2)) {
            return true;
        }
        return false;
    }

    #threeOfAKind() {
        if (this.#cardCounts.includes(3)) {
            return true;
        }
        return false;
    }

    #twoPair() {
        let pairCounter = 0;

        for (let i = 0; i < this.#cardCounts.length; i++) {
            const counter = this.#cardCounts[i];
            if (counter == 2) {
                pairCounter++;
            }
        }

        return pairCounter == 2;
    }

    #onePair() {
        if (this.#cardCounts.includes(2)) {
            return true;
        }
    }
}
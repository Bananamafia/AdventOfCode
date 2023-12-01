const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/data.txt", "utf-8");
const rl = readLine.createInterface(stream);

let value1 = 0;
let value2 = 0;

rl.on("line", (line) => {

    if (line == '') {

    }
    else {
        
    }
})

rl.on("close", () => {
    console.log();
});
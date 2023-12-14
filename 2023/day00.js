const readLine = require("node:readline");
const fs = require('node:fs');

const stream = fs.createReadStream("data/data.txt", "utf-8");
const rl = readLine.createInterface(stream);

rl.on("line", processLine);
rl.on("close", main);

function processLine(line){

}

function main(){
    
}
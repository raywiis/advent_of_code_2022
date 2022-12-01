const fs = require('fs');

const input = fs.readFileSync('./groups');

const groups = input.toString().split('\n\n').map(s => s.split('\n').map(n => parseInt(n, 10)));

const gsum = (g) => g.reduce((acc, s) => acc + s, 0);
const sums = groups.map(g => gsum(g))

const top1 = Math.max(...sums)
console.log(top1)

const top1Idx = sums.indexOf(top1);
sums.splice(top1Idx, 1);
const top2 =  Math.max(...sums)
const top2Idx = sums.indexOf(top2);
sums.splice(top2Idx, 1);
const top3 =  Math.max(...sums)

console.log(top1 + top2 + top3);

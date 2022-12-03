const assert = require('assert');
const fs = require('fs');

const getPriority = (letter) => {
  assert(letter.length === 1);
  const cost = letter.charCodeAt(0);
  if (letter.toUpperCase() === letter) {
    return 27 + cost - 'A'.charCodeAt(0);
  } else {
    return cost - 'a'.charCodeAt(0) + 1;
  }
}

// const input = `vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw`
const input = fs.readFileSync('./input').toString();

const sacks = input.split('\n');
const r = sacks.map((s) => {
  assert(s.length % 2 === 0)
  const left = s.slice(0, s.length / 2);
  const right = s.slice(s.length / 2);
  assert(left.length === right.length);
  return [Array.from(left), Array.from(right)]
}).map(([l, r]) => {
  const s = new Set(l);
  return new Set(r.filter(i => s.has(i)))
}).map(s => {
  if (s.size === 0) {
    return 0;
  }
  const l = s.values().next().value;
  return getPriority(l);
})

console.log(r.reduce((a, b) => a + b))

const ans = []
for (let i = 0; i < sacks.length; i += 3) {
  const sk0 = sacks[i + 0]
  const sk1 = sacks[i + 1]
  const sk2 = sacks[i + 2]
  const s0 = new Set(sacks[i + 1])
  const s1 = new Set(sacks[i + 1])
  const s2 = new Set(sacks[i + 2])

  for (const l of sk0.concat(sk1, sk2)) {
    if (
      s0.has(l) &&
      s1.has(l) &&
      s2.has(l)
    ) {
      ans.push(l);
      break
    }
  }
}

console.log(ans.map(a => getPriority(a)).reduce((a, b) => a + b));

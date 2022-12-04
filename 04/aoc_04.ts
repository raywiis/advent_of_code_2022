import { input, RRange } from './input.ts';

const data = input;

const fullyContains = (r1: RRange, r2: RRange) => {
  return r1[0] <= r2[0] && r1[1] >= r2[1];
}

const withinRange = (num: number, r: RRange) => {
  return num >= r[0] && num <= r[1];
}

const overlapsAny = (r1: RRange, r2: RRange) => {
  return withinRange(r1[0], r2) || withinRange(r1[1], r2)
    || withinRange(r2[0], r1) || withinRange(r2[1], r1)
}

const res1 = data.filter((ranges) => fullyContains(ranges[0], ranges[1]) || fullyContains(ranges[1], ranges[0]));
console.log(res1.length)

const res2 = data.filter(ranges => overlapsAny(...ranges))
console.log(res2.length);

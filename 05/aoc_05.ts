import {sampleStack, sampleOps, inputStack, inputOps} from './inputs.ts'

const stacks = inputStack;
const ops = inputOps

// const stacks = sampleStack;
// const ops = sampleOps;

/** PART 1 */
// for (const op of ops) {
//   const [_0, repeat, _1, from, _2, to] = op.split(' ');

//   for (let i = 0; i < parseInt(repeat, 10); i++) {
//     const crate = stacks[parseInt(from) - 1].shift();
//     stacks[parseInt(to) - 1].unshift(crate);
//   }
// }

/** PART 2 */
for (const op of ops) {
  const [_0, count, _1, from, _2, to] = op.split(' ');
  const move: number[] = [];

  for (let i = 0; i < parseInt(count, 10); i++) {
    move.push(stacks[parseInt(from, 10)-1].shift());
  }
  for (let i = 0; i < parseInt(count, 10); i++) {
    stacks[parseInt(to, 10)-1].unshift(move.pop())
  }
}

console.log(stacks.map(s => s[0]).join(''));

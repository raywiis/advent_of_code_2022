import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// const input = Deno.readTextFileSync('./sample');
const input = Deno.readTextFileSync('./input');

const rockRotation = [
  ['@@@@'],
  ['.@.', '@@@', '.@.'],
  ['..@', '..@', '@@@'],
  ['@', '@', '@', '@'],
  ['@@', '@@'],
]

// const v = (k: string) => k.split(',').map(a => parseInt(a, 10));
// const k = (...args: number[]) => args.join(',');

const logStack = (lines: string[]) => console.log(lines.join('\n'));
const interferes = (stack: string[], rock: string[], x: number, y: number) => {
  if (y < 0 || y + rock[0].length > 7) {
    return true;
  }
  if (x + rock.length > stack.length) {
    return true;
  }
  for (let i = 0; i < rock.length; i++) {
    for (let j = 0; j < rock[0].length; j++) {
      const stackCell = stack[x + i][y + j];
      const rockCell = rock[i][j];
      if (stackCell === '#' && rockCell === '@') {
        return true;
      }
    }
  }
  return false
}

const stampRock = (stack: string[], rock: string[], x: number, y: number) => {
  // console.log({
  //   stack, rock, x, y
  // })
  for (let l = x; l < x + rock.length; l++) {
    stack[l] = [...stack[l]].map((s, i) => {
      const rockPosition = i - y;
      if (rockPosition < 0) {
        return s;
      }
      const rockCell = rock[l - x][rockPosition];
      return rockCell === '@' ? '#' : s;
    }).join('')
  }
  return stack;
}

function countEmptyLines(state: string[]) {
  let emptyLines = 0;
  while (state[emptyLines] === '.......') {
    emptyLines++;
  }
  return emptyLines;
}

function dropRock(state: string[], rock: string[], windIndex: number) {
  let x = 0;
  let y = 2;
  let wind = windIndex;

  const additionalLines = 3 + rock.length - countEmptyLines(state);
  if (additionalLines < 0) {
    x += -additionalLines;
  }
  for (let i = 0; i < additionalLines; i++) {
    state.unshift('.......');
  }

  while (true) {
    const dw = input[wind % input.length] === '>' ? 1 : -1;
    if (!interferes(state, rock, x, y + dw)) {
      y += dw;
    }
    wind += 1;
    if (!interferes(state, rock, x + 1, y)) {
      x += 1
    } else {
      break;
    }
  }

  const newState = stampRock(state, rock, x, y);

  return { newState, x, y, wind };
}

let state = Array.from<string>({ length: 3 }).fill('.......');
let windIndex = 0;

function endsWith(a: string[], b: string[]) {
  if (a.length < b.length) {
    return false;
  }

  for (let i = 1; i <= b.length; i++) {
    // console.log({ a: a.at(-i), b: b.at(-i) });
    if (b.at(-i) !== a.at(-i)) {
      return false;
    }
  }
  return true;
}


const heightGain = [0];
const heights = [0];
// const rocksToDrop = 2022;
const rocksToDrop = 1000000000000;
for (let i = 0; i < rocksToDrop; i++) {
  if (i === 10000) {
    Deno.writeTextFileSync('stack.json', JSON.stringify(state, null, 4));
    Deno.writeTextFileSync('height.json', JSON.stringify(heights.slice(1), null, 4));
    Deno.writeTextFileSync('heightGain.json', JSON.stringify(heightGain.slice(1), null, 4));
    break;
  }
  const rock = rockRotation[i % rockRotation.length];
  const drop = dropRock([...state], rock, windIndex);

  state = [...drop.newState];
  const el = countEmptyLines(state);
  const height = state.length - el;
  heights.push(height)
  heightGain.push(height - heights.at(-2))
  // logStack(state)

  windIndex = drop.wind % input.length;
  // const repeat = fullRepeatSearch(state);
  // if (repeat !== null) {
  //   console.log({ repeat });
  //   Deno.writeTextFileSync('test', JSON.stringify(state));
  //   break;
  // }

  // const emptyLines = countEmptyLines(state);
  // logStack(state)
}

// logStack(state)

console.log(state.length - countEmptyLines(state));

/**
 * 17 ~ 26
 * 51 ~ 78
 * 86 ~ 131 => 53 / 35
 * 
 * 1000000000000 - 17 => 999 999 999 983
 * 28 571 428 570 iterations
 * 33 remainder => last add still 53
 * 
 * 26 + 28 571 428 570 * 53 + 53 => 1 514 285 714 289 - 1 too much for sample
 */

/**
 * 710 ~ 1120
 * 711 ~ 1120
 * 2456 ~ 3898
 * 
 * 2 778 / 1 745
 * 
 * 999 999 999 290
 * 573 065 902 reps
 * 300th left
 * 
 * 1011 ~ 1596
 * 
 * 1 591 977 075 756 rep gains
 * 476 - last rep
 * 1120 - first
 * 
 * 1 591 977 077 352 - right!
 * 
 */

import { assertEquals, assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Message = number | Message[];
// const input: [Message, Message][] = (await Deno.readTextFile('./sample')).split('\n\n').map(raw => raw.split('\n')).map(([a1, a2]) => [JSON.parse(a1), JSON.parse(a2)]);
const input: [Message, Message][] = (await Deno.readTextFile('./input')).split('\n\n').map(raw => raw.split('\n')).map(([a1, a2]) => [JSON.parse(a1), JSON.parse(a2)]);


const comp = (pair: [Message, Message]): -1 | 0 | 1 => {
  const [a, b] = pair;

  if (typeof a === 'number' && typeof b === 'number') {
    if (a < b) {
      return 1;
    } else if (a === b) {
      return 0;
    } else {
      return -1;
    }
  }
  if (typeof a === 'number' && typeof b !== 'number') {
    return comp([[a], b])
  } else if (typeof b === 'number' && typeof a !== 'number') {
    return comp([a, [b]])
  }
  for (let i = 0; i < a.length; i++) {
    assert(a[i] !== undefined, 'what is ' + a[i])
    if (b[i] === undefined) {
      return -1;
    }
    const ord = comp([a[i], b[i]])
    if (ord !== 0) {
      return ord;
    }
  }

  if (a.length === b.length) {
    return 0
  } else {
    return 1;
  }
}

const inOrder = (pair: [Message, Message]): -1 | 1 => {
  const ord = comp(pair);
  if (ord === 0) {
    return 1
  }
  return ord;
}

const inOrdBool = (pair: [Message, Message]): boolean => {
  return inOrder(pair) === 1
}

// 5754 -- too high
// 3355 -- too low
// 4000 -- too low

// console.log(input.map((i, id) => inOrdBool(i) ? id + 1 : 0).reduce((acc, i) => acc + i))

const d1 = [[2]];
const d2 = [[6]];

const linInput = [...input.flat(1), d1, d2];
linInput.sort((a, b) => inOrder([b, a]));
const idx1 = linInput.findIndex((a) => a === d1) + 1;
const idx2 = linInput.findIndex((a) => a === d2) + 1;

console.log(idx1 * idx2)

// Deno.test("0", () => { assertEquals(inOrdBool(input[0]), true) });
// Deno.test("1", () => { assertEquals(inOrdBool(input[1]), true) });
// Deno.test("2", () => { assertEquals(inOrdBool(input[2]), false) });
// Deno.test("3", () => { assertEquals(inOrdBool(input[3]), true) });
// Deno.test("4", () => { assertEquals(inOrdBool(input[4]), false) });
// Deno.test("5", () => { assertEquals(inOrdBool(input[5]), true) });
Deno.test("6", () => { assertEquals(inOrdBool(input[6]), false) });
// Deno.test("7", () => { assertEquals(inOrdBool(input[7]), false) });

import { assertEquals, assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Message = number | Message[];
// const input: [Message, Message][] = (await Deno.readTextFile('./sample')).split('\n\n').map(raw => raw.split('\n')).map(([a1, a2]) => [JSON.parse(a1), JSON.parse(a2)]);
const input: [Message, Message][] = (await Deno.readTextFile('./input')).split('\n\n').map(raw => raw.split('\n')).map(([a1, a2]) => [JSON.parse(a1), JSON.parse(a2)]);


const comp = (pair: [Message, Message]): boolean | 'eq' => {
  const [a, b] = pair;

  console.log({pair})
  if (typeof a === 'number' && typeof b === 'number') {
    if (a < b) {
      return true;
    } else if (a === b) {
      return 'eq';
    } else {
      return false;
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
      return false;
    }
    const ord = comp([a[i], b[i]])
    if (ord !== 'eq') {
      return ord;
    }
  }

  if (a.length === b.length) {
    return 'eq'
  } else {
    return true;
  }
}

const inOrder = (pair: [Message, Message]): boolean => {
  const ord = comp(pair);
  if (ord === 'eq') {
    return true
  }
  return ord;
}

// 5754 -- too high
// 3355 -- too low
// 4000 -- too low

// console.log(input.at(1)[0])
// console.log(input.at(1)[1])
console.log(input.map((i, id) => inOrder(i) ? id + 1 : 0).reduce((acc, i) => acc + i))

// Deno.test("0", () => { assertEquals(inOrder(input[0]), true) });
// Deno.test("1", () => { assertEquals(inOrder(input[1]), true) });
// Deno.test("2", () => { assertEquals(inOrder(input[2]), false) });
// Deno.test("3", () => { assertEquals(inOrder(input[3]), true) });
// Deno.test("4", () => { assertEquals(inOrder(input[4]), false) });
// Deno.test("5", () => { assertEquals(inOrder(input[5]), true) });
Deno.test("6", () => { assertEquals(inOrder(input[6]), false) });
// Deno.test("7", () => { assertEquals(inOrder(input[7]), false) });

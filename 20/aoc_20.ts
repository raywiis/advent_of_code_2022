import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const raw = Deno.readTextFileSync('./sample').split('\n').map(a => parseInt(a));
const raw = Deno.readTextFileSync('./input').split('\n').map(a => parseInt(a));

const dKey = 811589153

const mx = Math.max(...raw);
console.log(mx * dKey, Number.MAX_SAFE_INTEGER)

const input = raw.map(a => a * 811589153)


const next = new Map<string, [number, number]>();
const prev = new Map<string, [number, number]>();

const k = (...args: number[]) => args.join(':')

next.set(k(input[0], 0), [input[1], 1]);
prev.set(k(input[0], 0), [input.at(-1)!, input.length - 1]);
for (let i = 1; i < input.length; i++) {
  const v = input[i];
  const p = input[i - 1];
  const n = input[(i + 1) % input.length];

  next.set(k(v, i), [n, (i + 1) % input.length]);
  prev.set(k(v, i), [p, i - 1]);
}

// assert((new Set(input)).size === input.length)

function rotate(val: [number, number]) {
  if (val[0] === 0) {
    return;
  }
  const direction = Math.sign(val[0]);

  const moves = Math.abs(val[0] % (input.length - 1))
  if (moves === 0) {
    return;
  }
  let f = val
  for (let i = 0; i < moves; i++) {
    const map = direction === 1 ? next : prev;
    const m = map.get(k(...f))
    // console.log({f})
    assert(m !== undefined, k(...f) + val);
    f = m;
    while (f === val) {
      const m2 = map.get(k(...f));
      assert(m2!== undefined);
      f = m2;
    }

  }
  // if (f === val) {
  //   return;
  // }

  assert(f !== val, f+":"+val);
  prev.set(k(...next.get(k(...val))!), prev.get(k(...val))!)
  next.set(k(...prev.get(k(...val))!), next.get(k(...val))!)

  if (direction === 1) {
    const n = next.get(k(...f));

    assert(n !== undefined,);
    prev.set(k(...val), f);
    next.set(k(...val), n);
    next.set(k(...f), val);
    prev.set(k(...n), val);
  } else {
    const p = prev.get(k(...f));

    assert(p !== undefined);
    prev.set(k(...val), p);
    next.set(k(...val), f);
    prev.set(k(...f), val);
    next.set(k(...p), val);
  }
}

[4, 2, 1]
// 1: [2, 4, 1]
// 2: [2, 1, 4]
// 3: [4, 2, 1]
// 4: [2, 4, 1]

for (let j = 0; j < 10; j++) {
  input.forEach((a, i) => {
    if (i % 1000 === 0) {
      console.log({ j, i })
    }
    rotate([a, i])
  });
}
// console.log({next, prev})
// console.log(rotate(input[0]))
// console.log({next, prev})

function getIth(start: [number, number], cap: number) {
  let val = start;
  for (let i = 0; i < cap; i++) {
    const tt = next.get(k(...val));
    assert(tt !== undefined, val + ":" +tt);
    val = tt;
  }
  return val[0];
}

const zeroIdx = input.findIndex(a => a === 0);
assert(zeroIdx)
const zero = [0, zeroIdx] as [number, number]

// 9264 - too low;
// 9687 - weee
// 11621 - not the one
// 17234 - too high
console.log(getIth(zero, 1000) + getIth(zero, 2000) + getIth(zero, 3000));

// part 2

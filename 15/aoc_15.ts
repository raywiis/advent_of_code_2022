import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = (await Deno.readTextFile('./sample')).split('\n');
const input = (await Deno.readTextFile('./input')).split('\n');

const k = (...args) => args.join(',');
const dist = (ax, ay, bx, by) => Math.abs(bx - ax) + Math.abs(by - ay);

const map = new Map<string, [number, number]>();
const coords = new Map<string, [number, number]>();
const ranges = new Map<string, number>();
const beacons = new Map<string, SRange>()

for (const row of input) {
  const params = row.split(' ');
  const sx = parseInt(params[2].slice(2), 10)
  const sy = parseInt(params[3].slice(2), 10)

  const bx = parseInt(params[8].slice(2), 10)
  const by = parseInt(params[9].slice(2), 10)

  const key = k(sx, sy);
  map.set(key, [bx, by])
  coords.set(key, [sx, sy])
  ranges.set(key, dist(sx, sy, bx, by));
  beacons.set(k(bx, by), [bx, by]);
}

function* overlaps(row: number, x: number, y: number) {
  const perpDist = Math.abs(y - row);
  const range = ranges.get(k(x, y));
  // console.log({ x, y, range })
  if (!range) {
    throw new Error('wow');
  }
  const radius = range - perpDist;
  if (radius < 0) {
    return;
  }
  const start = x - radius;
  const end = x + radius;
  // console.log('overlaps', {start, end})
  for (let i = start; i <= end; i++) {
    if (beacons.has(k(i, row)) || map.has(k(i, row))) {
      continue;
    }
    // console.log('emit', [i, row])
    yield [i, row];
  }
}

const getRangesAtRow = (row: number) => {
  const rs: SRange[] = [];

  for (const [x, y] of coords.values()) {
    const perpDist = Math.abs(y - row);
    const range = ranges.get(k(x, y));
    if (!range) {
      throw new Error('wow');
    }
    const radius = range - perpDist;
    if (radius < 0) {
      continue;
    }
    const start = Math.max(x - radius, 0);
    const end = Math.min(x + radius, 4_000_000);
    if (end < start) {
      continue;
    }
    rs.push([start, end]);
  }
  return rs;
}

function checkRow(row: number) {
  const checkedPoints = new Set();
  for (const [sx, sy] of coords.values()) {
    for (const point of overlaps(row, sx, sy)) {
      checkedPoints.add(k(...point));
    }
  }
  return checkedPoints
}

// console.log('check', checkRow(10).size)

// console.log(checkRow(10).size)
// console.log(checkRow(2000000).size);
// console.log(map, ranges);

// [1, 2], [2, 3]
// [1, 2] + [1, 2] - [2, 2]
// 2 + 2 - 1

// [1, 3]
// 3

function getIntersection(a: SRange, b: SRange): SRange | undefined {
  const s = Math.max(a[0], b[0]);
  const e = Math.min(a[1], b[1]);

  if (s > e) {
    return [s, s]
  } else {
    return [s, e]
  }
}
assertEquals(getIntersection([1, 2], [2, 3]), [2, 2])
assertEquals(getIntersection([4, 5], [0, 4]), [4, 4])

type SRange = [number, number];
function getSubRangesToReduce(rs: SRange[]) {
  if (rs.length === 1) {
    return [rs];
  }
  const localSubRanges = getSubRangesToReduce(rs.slice(1));
  const [first] = rs;
  let res: SRange[][] = [
    [first, ...localSubRanges[0]],
  ];

  for (let i = 0; i < localSubRanges.length - 1; i++) {
    let group = localSubRanges[i]
      .map(a => getIntersection(first, a))
      .filter((a): a is SRange => !!a)
    group = group.concat(localSubRanges[i + 1]);
    res.push(group);
  }

  const lastOne = localSubRanges.at(-1)[0];
  if (lastOne) {
    const lastInt =getIntersection(lastOne, first);
    if (lastInt) {
      res.push([lastInt])
    }
  }

  return res;
}

// A,
// B,
// C

// C

// B + C
// -CB

// A + B + C
// -AB -AC -CB
// +ABC

// A

// A + B
// -AB

// A + B + C
// -AB -AC -BC
// +ABC

function sumIntersections(rs: SRange[]) {
  const arrs = getSubRangesToReduce(rs);

  // console.log(arrs)
  let sign = 1;
  let sum = 0;
  for (const g of arrs) {
    // console.log({g})
    for (const item of g) {
      const len = 1 + item[1] - item[0]
      sum += len * sign;
      // console.log({item, len, sum})
    }
    sign *= -1;
  }
  return sum;
}

// assertEquals(sumIntersections([[1, 2], [2, 3]]), 3)
// assertEquals(sumIntersections([[1, 1], [2, 2], [3, 3]]), 3)
assertEquals(sumIntersections([[0, 2], [2, 4], [4, 5]]), 6)

// console.log(sumIntersections([[0, 5], [3, 5], [5, 8], [10, 11], [20, 30], [25, 36]]))

// console.log('is', getIntersection([1, 2], [2, 3]))
// console.log('tt', sumIntersections([[1, 2]]))


function countObjectAtRow(row: number) {
  let count = 0;
  for (const [x, y] of coords.values()) {
    if (y === row) {
      count += 1;
    }
  }
  for (const [x, y] of beacons.values()) {
    if (y === row) {
      count += 1;
    }
  }
  return count;
}

function getAnswer(row: number) {
  const ranges = getRangesAtRow(row);
  // console.log({ ranges })
  const totalLength = sumIntersections(ranges)
  const interference = countObjectAtRow(row)
  // console.log({ totalLength, interference })
  return totalLength - interference;
}

// console.log(getAnswer(10))
console.log(getAnswer(2000000))

function isCovered(x, y) {
  for (const coord of coords.values()) {
    const range = ranges.get(k(...coord))
    assert(range, 'wow')
    const d = dist(x, y, coord[0], coord[1]);
    if (d <= range) {
      return true;
    }
  }
  return false;
}

const p2Y = 3364986
const p2X = 3138881;

console.log(p2X * 4_000_000 + p2Y)


// for (let i = 0; i < 4_000_000; i++) {
//   if (!isCovered(i, p2Y)) {
//     console.log({x: i})
//   }
//   if (i % 100_000 === 0) {
//     console.log({ i })
//   }
// }


// const res = []
// for (let i = 0; i < 4_000_000; i++) {
//   const cover = getAnswer(i);
//   if (cover < 4_000_000) {
//     console.log('found', { i })
//     res.push(i);
//   }
//   if (i % 100_000 === 0) {
//     console.log({i})
//   }
// }

// A => +B
// A + B(1 - A) => +C
// A + B - AB + C(1 - A - B + AB)
// A + B + C - AC - BC - AB + ABC

// A + B + C + D - AD - BD - CD


// A + B - AB

// A + B + C

// A + B + C
// - (AB + AC + BC)
// + ABC


// A + B + C + D
// - AB - AC - AD - BC - BD - CD
// + ABC + ABD + ACD + BCD
// - ABCD

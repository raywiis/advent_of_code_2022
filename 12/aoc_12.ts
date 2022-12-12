// const input = (await Deno.readTextFile('./sample')).split('\n').map(row => [...row])//.map(row => [...row].map(i => parseInt(i, 10)));
const input = (await Deno.readTextFile('./input')).split('\n').map(row => [...row])//.map(row => [...row].map(i => parseInt(i, 10)));

const k = (...args) => args.join(',');
const v = (k) => k.split(',').map(a => parseInt(a, 10));

let p1start = null;
let end = [];
for (const y in input) {
  for (const x in input[y]) {
    if (input[y][x] === 'S') {
      p1start = [parseInt(x, 10), parseInt(y, 10)];
    } else if (input[y][x] === 'E') {
      end = [parseInt(x, 10), parseInt(y, 10)];
    }
  }
}

function findPath(start) {
  const directions = [
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
  ];
  const fromMap = new Map<string, [number, number] | undefined>()
  fromMap.set(k(...start), undefined);
  const queue = [start];

  input[start[1]][start[0]] = 'a';
  const endChar = 'z'
  input[end[1]][end[0]] = endChar;
  let found = false;
  while (queue.length > 0) {
    const inspect = queue.shift();
    if (!inspect) {
      throw new Error('invariant');
    }
    if (inspect[1] === end[1] && inspect[0] === end[0]) {
      found = true
      break;
    }
    for (const direction of directions) {
      const x = inspect[0] + direction[0];
      const y = inspect[1] + direction[1];
      if (!input[y] || !input[y][x]) {
        continue;
      }
      const iLetter = input[inspect[1]][inspect[0]];
      const inspectVal = iLetter.charCodeAt(0);
      const targetVal = input[y][x].charCodeAt(0);
      if (targetVal - inspectVal > 1) {
        continue;
      }

      if (fromMap.has(k(x, y))) {
        continue;
      }
      fromMap.set(k(x, y), [...inspect]);
      queue.push([x, y]);
    }
  }
  let head = end;
  let visited = 0;
  let seen = new Set();
  if (!found) {
    return Infinity;
  }
  while (head !== undefined) {
    if (seen.has(k(...head))) {
      throw new Error('invar')
    }
    seen.add(k(...head))
    head = fromMap.get(k(...head));
    visited += 1;
  }
  return visited - 1
}

// 352 - too high
// 351 - too high
// 300 - too low
console.log({ visited: findPath(p1start) });

let absMin = Infinity;
for (let a in input) {
  for (let b in input) {
    const y = parseInt(a, 10);
    const x = parseInt(b, 10);
    if (input[y][x] !== 'a') {
      continue;
    }
    absMin = Math.min(findPath([x, y]), absMin)
  }
}
console.log({ absMin });

import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = Deno.readTextFileSync('./sample').split('\n');
const input = Deno.readTextFileSync('./input').split('\n');

const grid = input.map(a => [...a]);

type Direction = 'N' | 'S' | 'E' | 'W';
type Tuple = [number, number]

const k = (t: Tuple) => t.join(':');
const v = (key: string): Tuple => {
  const [a, b] = key.split(':');
  return [parseInt(a), parseInt(b)];
}
let currentPositions = new Map<string, Tuple>()

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === '#') {
      // console.log([x, y])
      currentPositions.set(k([x, y]), [x, y])
    }
  }
}


const directionChecks: Record<Direction, Tuple[]> = {
  N: [
    [1, -1],
    [0, -1],
    [-1, -1],
  ],
  E: [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
  S: [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
  W: [
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ]
}

const directionMoves: Record<Direction, Tuple> = {
  N: [0, -1],
  S: [0, 1],
  W: [-1, 0],
  E: [1, 0],
}

const proposalQueue: Direction[] = ['N', 'S', 'W', 'E'];

function doRound() {
  const proposalSet = new Set<string>();
  const voidProposals = new Set<string>();
  const proposalMap = new Map<string, Tuple>();
  const stationaryElves = new Set<string>()


// Each elf
  // If noone around - stand
  // Otherwise check: N, S, W, E in this order
  for (const elf of currentPositions.values()) {
    // console.log({elf})
    const proposalChecks = proposalQueue.map(p =>
      directionChecks[p].map(([dx, dy]) => 
        !currentPositions.get(k([elf[0] + dx, elf[1] + dy]))
      ).every(a => !!a)
    )
    if (proposalChecks.every(a => a)) {
      stationaryElves.add(k(elf));
      continue;
    }
    const firstProposed = proposalChecks.findIndex(a => a);
    if (firstProposed === -1) {
      stationaryElves.add(k(elf));
      // Nowhere to move?
      continue;
    }
    const proposedDirection = proposalQueue[firstProposed];
    const [dx, dy] = directionMoves[proposedDirection];
    const next: Tuple = [elf[0] + dx, elf[1] + dy];

    proposalMap.set(k(elf), next);
    if (proposalSet.has(k(next))) {
      stationaryElves.add(k(elf));
      voidProposals.add(k(next))
    }
    proposalSet.add(k(next));
  }

  if (proposalMap.size === 0) {
    return true
  }

  // console.log(proposalMap)
  // Each elf
    // Move into proposed location if other elves don't move into it
  const nextPositions = new Map()
  for (const [elf, pos] of currentPositions.entries()) {
    if (stationaryElves.has(elf)) {
      nextPositions.set(elf, pos);
      continue;
    }

    const nextPosition = proposalMap.get(elf);
    assert(nextPosition);
    if (voidProposals.has(k(nextPosition))) {
      nextPositions.set(elf, pos);
      continue;
    }
    nextPositions.set(k(nextPosition), nextPosition);
    // currentPositions.delete(elf)
    // currentPositions.set(k(nextPosition), nextPosition)
  }
  currentPositions = nextPositions;

  const l = proposalQueue.shift()
  assert(l)
  proposalQueue.push(l);
  // Push back proposal queue
  return false
}

// logGrid()
for (let i = 0; i < 100000000000; i++) {
  const calm = doRound();
  if (i % 1000 === 0) {
    console.log({ i })
  }
  if (calm) {
    console.log('done', {i: i + 1})
    break
  }
}
// logGrid()

console.log(countSpaces())

function countSpaces(){
  let maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity;
  for (const a of currentPositions.values()) {
    maxX = Math.max(a[0], maxX)
    maxY = Math.max(a[1], maxY)
    minX = Math.min(a[0], minX)
    minY = Math.min(a[1], minY)
  }

  let free = 0
  for (let y = minY; y < maxY + 1; y++) {
    for (let x = minX; x < maxX + 1; x++) {
      const t = currentPositions.get(k([x, y]));
      if (!t) {
        free += 1;
      }
    }
  }
  return free
}

function logGrid() {
  let maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity;
  for (const a of currentPositions.values()) {
    maxX = Math.max(a[0], maxX)
    maxY = Math.max(a[1], maxY)
    minX = Math.min(a[0], minX)
    minY = Math.min(a[1], minY)
  }

  for (let y = minY; y < maxY + 1; y++) {
    const row = [];
    for (let x = minX; x < maxX + 1; x++) {
      const t = currentPositions.get(k([x, y]));
      row.push(t ? '#' : '.')
    }
    console.log(row.join(''))
  }
}

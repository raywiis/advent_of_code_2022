import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = Deno.readTextFileSync('./sample');
const input = Deno.readTextFileSync('./input');

const k = (...args: number[]) => args.join(',');
const rocks = new Map<string, [number, number, number]>();

for (const row of input.split('\n')) {
  const coords = row.split(',').map(a => parseInt(a, 10));
  assert(coords.length === 3);
  rocks.set(k(...coords), coords as [number, number, number]);
}

const sides = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0,1],
  [0, 0, -1],
] as const ;

let exposedSides = 0;
for (const [rx, ry, rz] of rocks.values()) {
  let localExposure = 0;
  for (const [dx, dy, dz] of sides) {
    const n = [rx + dx, ry + dy, rz + dz];
    if (rocks.has(k(...n))) {
      continue;
    }
    localExposure += 1;
  }
  exposedSides += localExposure;
}

console.log({ exposedSides })


let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

for (const [x, y, z] of rocks.values()) {
  minX = Math.min(x, minX);
  minY = Math.min(y, minY);
  minZ = Math.min(z, minZ);
  maxX = Math.max(x, maxX);
  maxY = Math.max(y, maxY);
  maxZ = Math.max(z, maxZ);
}

minX -= 1;
minY -= 1;
minZ -= 1;
maxX += 1;
maxY += 1;
maxZ += 1;

const q = [
  [minX, minY, minZ],
]

let outsideSides = 0;
const outsideVisited = new Set();
console.log({
  minX,
  minY,
  minZ,
  maxX,
  maxY,
  maxZ,
});


while (q.length > 0) {
  const next = q.shift();
  assert(next);
  const [x, y, z] = next;

  if (outsideVisited.has(k(...next))) {
    continue;
  }
  outsideVisited.add(k(...next));

  for (const [dx, dy, dz] of sides) {
    const c = [x + dx, y + dy, z + dz];
    const key = k(...c);
    const inBound = minX <= c[0] && c[0] <= maxX
      && minY <= c[1] && c[1] <= maxY
      && minZ <= c[2] && c[2] <= maxZ;
    if (!inBound) {
      continue
    }
    if (rocks.has(key)) {
      outsideSides += 1;
    } else {
      q.push(c);
    }
  }
}

console.log({ outsideSides })

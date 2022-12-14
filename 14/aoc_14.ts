// const input = (await Deno.readTextFile('./sample')).split('\n');
const input = (await Deno.readTextFile('./input')).split('\n');

const moves = [
  [0, 1],
  [-1, 1],
  [1, 1]
] as const;

const sandPoint: [number, number] = [500, 0];

const k = (...args) => args.join(',');
const v = (key) => key.split(',').map(a => parseInt(a, 10));

function mapRocks(paths: string[]){
  const map = new Map<string, '#' | 'O'>();

  for (const path of paths) {
    const legs = path.split(' -> ');
    for (let i = 1; i < legs.length; i++) {
      const start = legs[i - 1];
      const end = legs[i];

      const sleg = start.split(',')
      const eleg = end.split(',')
      let sx = parseInt(sleg[0], 10)
      let sy = parseInt(sleg[1], 10)

      const ex = parseInt(eleg[0], 10)
      const ey = parseInt(eleg[1], 10)

      map.set(k(sx, sy), '#');
      while (sx !== ex || sy !== ey) {
        // console.log({ sx, sy, ex, ey })
        if (sx === ex) {
          sy += Math.sign(ey - sy);
        } else {
          sx += Math.sign(ex - sx);
        }
        map.set(k(sx, sy), '#');
      }
    }
  }
  return map;
}
function getDL(cave: Map<string, "#" | "O">) {
  let maxY = -Infinity;
  for(const key of cave.keys()) {
    const [x, y] = v(key);
    maxY = Math.max(y, maxY)
  }
  return maxY;
}

const getMove = (from: [number, number], map: Map<string, "#" | "O">) => {
  const [x, y] = from;
  for (const [dx, dy] of moves) {
    const key = k(x + dx, y + dy);
    if (map.get(key) === undefined) {
      return [x+dx, y+dy];
    }
  }
}

function dropSand(where: [number, number], map: Map<string, "#" | "O">, depthLim: number) {
  let [x, y] = where;
  while (y <= depthLim) {
    const nextC = getMove([x, y], map);
    // console.log(nextC)
    if (!nextC) {
      return [x, y] as const;
    }
    [x, y] = nextC;
  }
  // return null;
  return [x, y]
}

const cave = mapRocks(input);
// part 1
const depthLimit = getDL(cave);

let count = 0;
while (true) {
  const newSand = dropSand(sandPoint, cave, depthLimit);
  // if (!newSand) {
  //   break;
  // }
  cave.set(k(...newSand), 'O');
  count += 1;
  if (newSand[0] === sandPoint[0] && newSand[1] === sandPoint[1]) {
    break;
  }
}

console.log(count);
// drawCave(cave)

function drawCave(map) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const k of map.keys()) {
    const [x, y] = v(k);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
  }

  console.log({minX, maxX,minY, maxY})

  for(let y = minY; y < maxY + 1; y++) {
    const row = []
    for (let x = minX; x < maxX + 1; x++) {
      row.push(map.get(k(x, y)) ?? '.')
    }
    console.log(row.join(''))
  }
}

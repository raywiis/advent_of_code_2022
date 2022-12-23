import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = Deno.readTextFileSync('./sample').split('\n\n');
const input = Deno.readTextFileSync('./input').split('\n\n');

type Facing = 'U' | 'D' | 'R' | 'L';
type Coord = [number, number];
type Pos = [...Coord, Facing]

const deltas:Record<Facing, Coord> = {
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
}

// function p2RemapStep([x, y, f]: Pos): Pos {
//   const fsize = 4;
//   if (y === 0 && f === 'D') {
//     return [x, y + 1, 'D']
//   }
//   if (x === 11 && (4 < y && y < 12) && f === 'R') {
//     console.log( [15 - (y - fsize), 8, 'D'])
//     return ( [15 - (y - fsize), 8, 'D'])
//   }
//   showMap()
//   assert(false, JSON.stringify({ x, y, f }))
// }

// 135061 - too high
// 133080 - too high
// 118353 - No
// 110342
// 100080 - too low
// 133060 - no
// 16429 - too low
// 10363 - no

const isIn = (from, to, val) => from <= val && val < to;

function p2RemapStep([x, y, f]: Pos): Pos {
  const fsize = 50;
  const lx = x % fsize;
  const ly = y % fsize;
  if (50 <= x && x < 100 && y === 0) {
    if (f === 'U') return [0, 150 + lx, 'R'];
  }
  if (x === 0 && 150 <= y && y < 200) {
    if (f === 'L') return [50 + ly, 0, 'D'];
  }
  if (x === 0 && 100 <= y && y < 150) {
    if (f === 'L') return [50, 49 - ly, 'R'];
  }
  if (x === 49 && 150 <= y && y < 200) {
    if (f === 'R') return [50 + ly, 149, 'U'];
  }
  if (0 <= x && x < 50 && y === 199) {
    if (f === 'D') return [100 + lx, 0, 'D'];
  }
  if (x === 149 && 0 <= y && y < 50) {
    if (f === 'R') return [99, 149 - ly, 'L'];
  }
  if (100 <= x && x < 149 && y === 49) {
    if (f === 'D') return [99, 50 + lx, 'L'];
  }
  if (x === 99 && 50 <= y && y < 100) {
    if (f === 'R') return [100 + ly, 49, 'U'];
  }
  if (50 <= x && x < 100 && y === 149) {
    if (f === 'D') return [49, 150 + lx, 'L'];
  }
  if (x === 99 && 100 <= y && y < 150) {
    if (f === 'R') return [149, 49 - ly, 'L'];
  }
  if (100 <= x && x < 150 && y === 0) {
    if (f === 'U') return [lx, 199, 'U'];
  }
  if (x === 50 && 0 <= y && y < 50) {
    if (f === 'L') return [0, 149 - ly, 'R'];
  }
  if (x === 50 && 50 <= y && y < 100) {
    if (f === 'L') return [ly, 100, 'D'];
  }
  if (0 <= x && x < 50 && y === 100) {
    if (f === 'U') return [50, 50 + lx, 'R'];
  }
  showMap()
  assert(false, "No Remap from " + JSON.stringify({ x, y, f }))
}


let map = input[0].split('\n');
const seq = input[1];

const width = Math.max(...map.map(r => r.length));
map = map.map(row => row.padEnd(width, ' '))
const height = map.length;

const stepTile = ([x, y, facing]: Pos, cube = false): Pos => {
  if (cube) {
    assert(map[y][x] === '.')
  }
  const [dx, dy] = deltas[facing];

  if (!cube) {
    let cx = (x + width + dx) % width;
    let cy = (y + height + dy) % height;
    while (map[cy][cx] === ' ') {
      cx = (cx + width + dx) % width;
      cy = (cy + height + dy) % height;
    }
    if (map[cy][cx] === '#') {
      return [x, y, facing];
    } else {
      return [cx, cy, facing]
    }
  } else {
    try {
      assert(map[y][x] === '.', JSON.stringify({x, y}));
    } catch(e) {
      showMap()
      throw e;
    }
    const cx = (x + dx);
    const cy = (y + dy);
    let rms: Pos = [cx, cy, facing];
    if (cx >= width || cy >= height) {
      rms = p2RemapStep([x, y, facing]);
    }
    if (cx < 0 || cy < 0) {
      rms = p2RemapStep([x, y, facing])
    }
    if (!map[rms[1]] || map[rms[1]][rms[0]] === ' ') {
      rms = p2RemapStep([x, y, facing])
    }
    assert(map[rms[1]][rms[0]] !== ' ')
    if (map[rms[1]][rms[0]] === '#') {
      return [x, y, facing]
    }
    return rms;
  }
}

console.log(map)

const startPosition = stepTile([0, 0, 'R'])
let rollingNumber = ''
const moves = [];
for (const char of seq) {
  if (char === 'L' || char === 'R') {
    const n = parseInt(rollingNumber);
    moves.push(n);
    moves.push(char);
    rollingNumber = ''
  } else {
    rollingNumber += char;
  }
}

moves.push(parseInt(rollingNumber))
console.log({ startPosition, moves })


const facingToTurnMap: Record<Facing, { 'L': Facing, 'R': Facing }> = {
  D: {
    L: "R",
    R: 'L'
  },
  L: {
    "L": "D",
    R: "U",
  },
  R: {
    "L": "U",
    R: "D"
  },
  U: {
    "L": "L",
    "R": "R",
  },
}

const hist = new Map<string, Facing>();
const position = startPosition;
for (const move of moves) {
  const [x, y, f] = position;
    console.log('move', move)
  if (typeof move === 'string') {
    assert(move === 'L' || move === 'R');
    position[2] = facingToTurnMap[f][move];
    hist.set(`${x}:${y}`, position[2]);
  } else {
    for (let i = 0; i < move; i++) {
      const [nx, ny, nf] = stepTile(position, true);
      console.log({position, nx, ny, move, i})
      hist.set(`${nx}:${ny}`, nf);
      if (nx === position[0] && ny === position[1]) {
        break;
      }
      position[0] = nx;
      position[1] = ny;
      position[2] = nf;
    }
  }
  // showMap()
  // Deno.stdin.readSync(new Uint8Array(2));
}

function showMap() {
const fsymbols: Record<Facing, string> = {
  D: 'v',
  L: '<',
  R: '>',
  U: '^',
}

  const smap = map.map((row, y) => {
    return [...row].map((a, x) => {
      const kf = hist.get(`${x}:${y}`)
      if (!kf) {
        return a;
      }else {
        return fsymbols[kf];
      }
    }).join('')
  })

  console.log(smap.join('\n'))
}

console.log({position})

function finalScore(position: Pos) {
  const facingS: Record<Facing, number> = {
    R: 0,
    D: 1,
    L: 2,
    U: 3,
  }
  return (position[1] + 1) * 1000 + 4 * (position[0] + 1) + facingS[position[2]];
}
console.log(finalScore(position));

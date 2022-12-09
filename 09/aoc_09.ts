// const turns = (await Deno.readTextFile('./sample')).split('\n').map(r => r.split(' ')).map(a => [a[0], parseInt(a[1], 10)]);
// const turns = (await Deno.readTextFile('./sample2')).split('\n').map(r => r.split(' ')).map(a => [a[0], parseInt(a[1], 10)]);
const turns = (await Deno.readTextFile('./input')).split('\n').map(r => r.split(' ')).map(a => [a[0], parseInt(a[1], 10)]);
// const turns =[['R', 9], ['U', 9]]

const dirs = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
}
const k = (...a) => a.join(',')

function runMoves(rope: [number, number][]) {
  let visited = new Set()


  visited.add(k(...rope.at(-1)));

  const tooFar = (ax: number, ay: number, bx: number, by: number) => (Math.abs((bx - ax)) > 1) || (Math.abs(by - ay) > 1)


  for (const move of turns) {
    const [dir, count] = move
    const [dx, dy] = dirs[dir];
    for (let i = 0; i < count; i++) {
      const lastPos = {}
      rope.forEach((pos, r) => {
        lastPos[r] = [...pos];
      })
      rope[0][0] += dx;
      rope[0][1] += dy;

      for (let k = 1; k < rope.length; k++) {
        const [hx, hy] = rope[k - 1];
        const [tx, ty] = rope[k];
        if (!tooFar(hx, hy, tx, ty)) {
          continue;
        }
        if (hx !== tx && hy !== ty) {
          const cx = -Math.sign(tx - hx);
          const cy = -Math.sign(ty - hy);
          rope[k][0] += cx;
          rope[k][1] += cy;
          continue;
        } else if (hx === tx) {
          const cy = -Math.sign(ty - hy);
          rope[k][1] += cy;
          continue;
        } else if (hy === ty) {
          const cx = -Math.sign(tx - hx);
          rope[k][0] += cx;
          continue;
        }
      }

      visited.add(k(...rope.at(-1)));
    }
    // console.log(rope)
    // if (dir === 'U') {
    //   break;
    // }
  }
  return visited;
}

// console.log(runMoves([
//   [0, 0],
//   [0, 0],
// ]).size)


//4867 - too high
console.log(runMoves([
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]).size)


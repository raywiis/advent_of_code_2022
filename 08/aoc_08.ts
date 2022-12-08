// const input: string = await Deno.readTextFile('./sample')
const input: string = await Deno.readTextFile('./input')
const grid = input.split('\n')

const k = (...args) => args.join(',');

const seen = new Set();

for (let x = 0; x < grid[0].length; x++) {
  let lastTree = -Infinity;
  for (let y = 0; y < grid.length; y++) {
    const n = parseInt(grid[y][x], 10);
    if (n > lastTree) {
      lastTree = n;
      seen.add(k(x, y))
    }
  }
  lastTree = -Infinity;
  for (let i = 0; i < grid.length; i++) {
    const y = grid.length - 1 - i;
    const n = parseInt(grid[y][x], 10);
    if (n > lastTree) {
      lastTree = n;
      seen.add(k(x, y))
    }
  }
}

for (let y = 0; y < grid.length; y++) {
  let lastTree = -Infinity;
  for (let x = 0; x < grid[0].length; x++) {
    const n = parseInt(grid[y][x], 10);
    if (n > lastTree) {
      lastTree = n;
      seen.add(k(x, y))
    }
  }
  lastTree = -Infinity;
  for (let i = 0; i < grid[0].length; i++) {
    const x = grid.length - i - 1;
    const n = parseInt(grid[y][x], 10);
    if (n > lastTree) {
      lastTree = n;
      seen.add(k(x, y))
    }
  }
}

console.log(seen.size)

const getScore = (xs: number, ys: number) => {
  const cap = parseInt(grid[ys][xs], 10);

  // console.log({cap, g: grid[ys]})
  let a = 0, b = 0, c = 0, d = 0;
  for (let y = ys + 1; y < grid[0].length; y++) {
    const n = parseInt(grid[y][xs], 10);
    a++;
    if (n >= cap) {
      break;
    }
  }

  for (let y = ys - 1; y >= 0; y--) {
    const n = parseInt(grid[y][xs], 10);
    b++;
    if (n >= cap) {
      break;
    }
  }

  for (let x = xs + 1; x < grid[0].length; x++) {
    const n = parseInt(grid[ys][x], 10);
    c++;
    if (n >= cap) {
      break;
    }
  }

  for (let x = xs - 1; x >= 0; x--) {
    const n = parseInt(grid[ys][x], 10);
    d++;
    if (n >= cap) {
      break;
    }
  }
  // console.log(a , b , c , d);
  return a * b * c * d;
}

const scores: number[] = [];
for (let x = 0; x < grid[0].length; x++) {
  for (let y = 0; y < grid.length; y++) {
    scores.push(getScore(x, y))
  }
}

console.log(Math.max(...scores));

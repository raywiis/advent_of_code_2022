// const input: string = await Deno.readTextFile('./sample');
const input: string = await Deno.readTextFile('./input');

const lines = input.split('\n')

const cPath: string[] = []
const files: [string, number][] = []
const dirs: string[] = [];
for (const line of lines) {
  if (line[0] === '$') {
    if (!line.startsWith('$ cd')) {
      continue;
    }
    if (line.endsWith('..')) {
      cPath.pop();
      continue;
    } else {
      cPath.push(line.split(' ')[2] + "/");
      dirs.push(cPath.join(''))
      continue;
    }
  } else {
    if (line.startsWith('dir')) {
      continue;
    }
    const [size, name] = line.split(' ');
    files.push([cPath.join('') + '/' + name, parseInt(size, 10)])
  }
}

console.log(files, dirs)

const sums = dirs.map((dir) => {
  const fs = files.map(([path, size]) => {
    return path.startsWith(dir) ? size : 0;
  }).reduce((a, b) => a + b);
  return [dir, fs] as [string, number];
})

const p1 = sums.filter(([a, b]) => {
  return b < 100_000;
}).reduce((a, [_, b]) => a+ b, 0)

console.log(p1)

const totalSpace = 70000000;
const requiredSpace = 30000000;
const usedSpace = sums.find(k => k[0] === '//')!

console.log(usedSpace);

const unusedSpace = totalSpace - usedSpace[1];
const requiredDelete = requiredSpace - unusedSpace;

console.log(requiredDelete)

const dcands = sums.filter((d) => {
  return d[1] >= requiredDelete;
})
console.log(dcands);

const p2 = Math.min(...dcands.map(d => d[1]));
console.log(p2)
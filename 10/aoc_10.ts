// const input = (await Deno.readTextFile('./sample')).split('\n');
const input = (await Deno.readTextFile('./input')).split('\n');

function runVM(instructions: string[]) {
  const signalStr: number[] = []
  const crt: string[][] = Array.from({length: 8}).map(() => ([]))
  let cycle = 0;
  let x = 1;

  const moveCycle =(count: number) =>{
    const start = cycle;
    while (cycle < start + count) {
      cycle += 1;
      if ((cycle - 20) % 40 === 0) {
        signalStr.push(x * cycle);
      }
      const row = Math.floor((cycle - 1) / 40) 
      const pixel = (cycle - 1) % 40;
      const inSignal = pixel <= x + 1 && pixel >= x- 1;
      crt[row][pixel] = inSignal ? '#' : '.';
    }
  }

  for (const instruction of instructions) {
    if (instruction === 'noop') {
      moveCycle(1);
    } else if (instruction.startsWith('addx')){
      const n = parseInt(instruction.split(' ')[1], 10)
      moveCycle(2);
      x += n;
    } else {
      throw new Error('unknown instruction'+ instruction)
    }
  }
  return [signalStr, crt] as const
}

const [out,crt] = runVM(input)
console.log(out.reduce((a, b) => a + b))
console.log(crt.map(r => r.join('')).join('\n'))

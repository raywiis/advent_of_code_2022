type Monkey = {
  items: number[];
  operation: (item: number) => number;
  trueDest: number;
  falseDest: number;
  divTest: number
}

const parseMonkeys = (inputs: string[]): Monkey[] => {
  return inputs.map(raw => {
    const lines = raw.split('\n')
    const items = lines[1].split(': ')[1].split(',').map(i => parseInt(i, 10))

    const [opLeft, opSym, opRight] = lines[2].split(' = ')[1].split(' ');
    const opOldBuild = (op, right) => {
      if (op === '*') {
        return (item) => item * item
      } else if (op === '+') {
        return (item) => item + item
      } else {
        throw new Error('ooft')
      }
    }
    const opConstBulid = (op, right) => {
      if (op === '*') {
        return (item) => item * parseInt(right, 10)
      } else if (op === '+') {
        return (item) => item + parseInt(right, 10)
      } else {
        throw new Error('ooft2')
      }
    }
    const operation = opRight === 'old' ?  opOldBuild(opSym, opRight) : opConstBulid(opSym, opRight);
    const divTest = parseInt(lines[3].split(' by ')[1], 10);
    const trueDest = parseInt(lines[4].split('to monkey')[1], 10)
    const falseDest = parseInt(lines[5].split('to monkey')[1], 10)

    return {
      items,
      operation,
      divTest,
      trueDest,
      falseDest,
    }
  })
}

// const input = (await Deno.readTextFile('./sample')).split('\n\n');
const input = (await Deno.readTextFile('./input')).split('\n\n');

const monkeys = parseMonkeys(input);
// console.log({ m: monkeys.map(m => m.operation.toString()) })

const rounds = 10000;
// const rounds = 20;

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

const limDiv = lcm(...monkeys.map(m => m.divTest));

console.log({limDiv})

const monkeyCounts = [];
for (const m in monkeys) {
  monkeyCounts.push(0);
}

for (let i = 0; i < rounds; i++) {
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    while (monkey.items.length > 0) {
      // console.log(monkey.items.length, monkey.items)
      const itemInit = monkey.items.shift();
      monkeyCounts[m] += 1;
      if (typeof itemInit === 'undefined') {
        throw new Error('invariant')
      }
      const itemInspect = monkey.operation(itemInit);

      let itemDone = itemInspect % limDiv;

      if (itemDone % monkey.divTest === 0) {
        monkeys[monkey.trueDest].items.push(itemDone);
      } else {
        monkeys[monkey.falseDest].items.push(itemDone);
      }
    }
  }
}

console.log(monkeys.map(m => m.items))
console.log(monkeyCounts);
monkeyCounts.sort((a, b) => b - a)
// 31943340525 - too high for p2
console.log(monkeyCounts[0] * monkeyCounts[1])

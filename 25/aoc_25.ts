// const input = Deno.readTextFileSync('./sample').split('\n')
const input = Deno.readTextFileSync('./input').split('\n')

const comps: Record<string, number> = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
}

function getDecimal(snafu: string) {
  let decimal = 0;
  const elements = [...snafu].reverse()

  elements.forEach((e, i) => {
    const m1 = comps[e];
    const m2 = Math.pow(5, i);

    decimal += m1 * m2;
  })
  return decimal
}

const ans = input.map(a => getDecimal(a)).reduce((a, b) => a + b)
console.log(ans)

const prioq = ['2', '1', '0', '-', '='];
function reverseSnafu(n: number) {
  let snafu: (typeof prioq)[number][] = [];

  while (getDecimal(snafu.join('')) < n) {
    snafu.push('2')
  }

  let idx = 0;
  while (idx < snafu.length) {
    const test = [...snafu];
    const c = test[idx];
    if (c === '=') {
      idx++;
      continue;
    }

    const nci = prioq.findIndex(a => a === c) + 1;
    const nc = prioq[nci];
    test[idx] = nc;
    if (getDecimal(test.join('')) >= n) {
      snafu = test;
    } else {
      idx++;
    }
  }

  return snafu.join('');
}

console.log(reverseSnafu(ans))


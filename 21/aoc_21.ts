import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { make,add,sub,mul, div, string, sqrt, IBigFloat } from "https://deno.land/x/bigfloat/mod.ts";

// const input = Deno.readTextFileSync('./sample').split('\n');
const input = Deno.readTextFileSync('./input').split('\n');

const monkeys = new Map<string, string[]>(input.map(m => {
  const [p1, r] = m.split(': ');
  return [p1, r.split(' ')]
}))

function resolve(monkey: string): IBigFloat {
  // assert(monkey !== 'humn')
  const things = monkeys.get(monkey);
  assert(things);

  if (things.length === 1) {
    // if (Number.isNaN(parseInt(things[0]))) {
    //   throw new Error('oof')
    // }
    return make(things[0])
  } else {
    const m1 = resolve(things[0])
    const m2 = resolve(things[2])
    const op = things[1];

    const a = op === '+'
      ? add(m1, m2)
      : op === '-'
      ? sub(m1, m2)
      : op === '*'
      ? mul(m1, m2)
      : op === '/'
      ? div(m1, m2)
      : NaN
    assert(typeof a !== 'number') 
    return a;
  }
}

// console.log(resolve('root'))

monkeys.set('humn', ['x'])
const root = monkeys.get('root')
assert(root)

console.log({root})
// const orig = {
//   l: resolve(root[0]),
//   r: resolve(root[2]),
// }
// console.log('orig', orig)

function figureOut(monkey: string, target: IBigFloat): IBigFloat {
  if (monkey === 'humn') {
    return target;
  }
  const t = monkeys.get(monkey);
  assert(t)
  assert(t.length === 3, t.join(':'));
  let l, r;
  try {
    l = resolve(t[0]);
  } catch (e) {
    l = NaN
  }
  try {
    r = resolve(t[2]);
  } catch (e) {
    r = NaN
  }

  const nextMonkey = Number.isNaN(l) ? t[0] : t[2];
  const oppNumber = Number.isNaN(l) ? r : l;

  assert(typeof oppNumber !== "number")
  const op = t[1];


  // TODO: THIS DOESN'T CONSIDER DIVISOR NUMERAL RELATIONSHIP
  const nextTarget = op === '+'
    ? sub(target,oppNumber)
    : op === '-'
    ? add(target, oppNumber)
    : op === '*'
    ? div(target , oppNumber)
    : op === '/'
    ? mul(target , oppNumber)
    : null;

  assert(nextTarget !== null);
  // console.log({ l, op, r, target, nextTarget})
  // Deno.stdin.readSync(new Uint8Array(2))


  return figureOut(nextMonkey, nextTarget)
}

//  9476569668479 too high
const figured =  figureOut(root[0], resolve(root[2]))
console.log('rr', { s: string(figured) })
// monkeys.set('humn', [''+figured]);
// console.log('rrr', resolve(root[0]))

function solveString(m: string): string {
  console.log({ m})
  const comp = monkeys.get(m);
  assert(comp);
  console.log({comp})

  if (comp.length === 1) {
    // assert(m === 'humn', comp[0])
    return comp[0];
  }

  const l = resolve(comp[0]);
  const r = resolve(comp[2]);

  if (Number.isNaN(l)) {
    const s = solveString(comp[0])
    return '(' + s + ')' + comp[1] + r.toString();
  } else {
    const s = solveString(comp[2])
    return l.toString() + comp[1] + '(' + s + ')';
  }
}

// 3353687996514 - yes?!?


console.log(solveString(root[0]) + '==' + orig.r)


// 6*((((214128563326971-((295+((609+((5*((((((2*((((((5*(69+((858+(((8*(((((324+((((((671+(((2*((9*((((((((((2*(((((((637+(((((15*(713+(x)))-477)/2)-222)/3))*2)+259)/3)-256)*3)-703))+921)/7)-653)*23)+923)/3)-709)/6)+783))-594))+544)/4))/7)-77)*24)-780)*2))/6)-982)/2)+86))-829)+284))/5)))-640)/3)+166)*2)+559))-497)/5)-443)/6)+289))-49))/2))*8))+384)/5)+741)==122624242469304
// (((214128563326971-((295+((609+((5*((((((2*((((((5*(69+((858+(((8*(((((324+((((((671+(((2*((9*((((((((((2*(((((((637+(((((15*(713+(x)))-477)/2)-222)/3))*2)+259)/3)-256)*3)-703))+921)/7)-653)*23)+923)/3)-709)/6)+783))-594))+544)/4))/7)-77)*24)-780)*2))/6)-982)/2)+86))-829)+284))/5)))-640)/3)+166)*2)+559))-497)/5)-443)/6)+289))-49))/2))*8))+384)/5)+741 = 20437373744884
//20437373744143

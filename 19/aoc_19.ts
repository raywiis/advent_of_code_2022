import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = Deno.readTextFileSync('./sample').split('\n');
const input = Deno.readTextFileSync('./input').split('\n');

function getRecipe(line: string) {
  const ps = line.split(' ');
  return [
    { type: 'mineOnly', ore: 0, clay: 0, obsidian: 0 },
    { type: 'oreBot', ore: parseInt(ps[6]), clay: 0, obsidian: 0 },
    { type: 'clayBot', ore: parseInt(ps[12]), clay: 0, obsidian: 0 },
    { type: 'obsidianBot', ore: parseInt(ps[18]), clay: parseInt(ps[21]), obsidian: 0 },
    { type: 'geodeBot', ore: parseInt(ps[27]), clay: 0, obsidian: parseInt(ps[30]) },
  ] as const
}

const initialState = { time: 0, ore: 0, oreBot: 1, clay: 0, clayBot: 0, obsidian: 0, obsidianBot: 0, geode: 0, geodeBot: 0 }

const potSum = (n: number) => (n * 1 + n * n) / 2;

function runDiode(state: typeof initialState, direction: ReturnType<typeof getRecipe>[number]): [boolean, typeof initialState] {
  if (state.clay < direction.clay || state.ore < direction.ore || state.obsidian < direction.obsidian) {
    return [false, state];
  }
  return [true, {
    time: state.time + 1,
    clay: state.clay + state.clayBot - direction.clay,
    clayBot: direction.type === 'clayBot' ? state.clayBot + 1 : state.clayBot,
    ore: state.ore + state.oreBot - direction.ore,
    oreBot: direction.type === 'oreBot' ? state.oreBot + 1 : state.oreBot,
    obsidian: state.obsidian + state.obsidianBot - direction.obsidian,
    obsidianBot: direction.type === 'obsidianBot' ? state.obsidianBot + 1 : state.obsidianBot,
    geode: state.geode + state.geodeBot,
    geodeBot: direction.type === 'geodeBot' ? state.geodeBot + 1 : state.geodeBot,
  }]
}

function getMaxGeodes(recipe: ReturnType<typeof getRecipe>, maxTime: number): number {
  const q = [
    initialState,
  ]

  const caps = {
    oreBot: Math.max(...recipe.map(r => r.ore)),
    clayBot: Math.max(...recipe.map(r => r.clay)),
    obsidianBot: Math.max(...recipe.map(r => r.obsidian))
  }

  let maxGeode = 0;
  const seen = new Set();
  while (q.length > 0) {
    const n = q.shift();
    assert(n);
    maxGeode = Math.max(maxGeode, n.geode);
    if (n.time === maxTime) {
      continue;
    }
    const rt = maxTime - n.time;
    const hoardCaps = {
      ore: caps.oreBot * rt - Math.min(n.oreBot, caps.oreBot) * (rt - 1),
      clay: caps.clayBot * rt - Math.min(n.clayBot, caps.clayBot) * (rt - 1),
      obsidian: caps.obsidianBot * rt - Math.min(n.obsidianBot, caps.obsidianBot) * (rt - 1),
    }

    const nC = {
      ...n,
      ore: Math.min(n.ore, hoardCaps.ore),
      clay: Math.min(n.clay, hoardCaps.clay),
      obsidian: Math.min(n.obsidian, hoardCaps.obsidian),

      oreBot: Math.min(n.oreBot, caps.oreBot),
      clayBot: Math.min(n.clayBot, caps.clayBot),
      obsidianBot: Math.min(n.obsidianBot, caps.obsidianBot)
    }

    const k = JSON.stringify(nC);
    if (seen.has(k)) {
      continue;
    }
    seen.add(k);
    if (seen.size % 100000 === 0) {
      console.log({s: seen.size, m: maxGeode, l: q.length})
    }
    for (const d of recipe) {
      const [can, ns] = runDiode(nC, d);
      if (!can) {
        continue;
      }
      q.unshift(ns);
      // console.log({ns})
      // Deno.stdin.readSync(new Uint8Array(2))
    }
  }
  return maxGeode;
}

const recipes = input.map(getRecipe)

// const what = recipes.map((recipe, i) => getMaxGeodes(recipe, 24) * (i + 1))
// console.log({ s: what.reduce((a, b) => a + b) })
// console.log(getMaxGeodes(recipes[0], 32))
const what = recipes.slice(0, 3).map((recipe) => getMaxGeodes(recipe, 32))
//128
console.log({ s: what.reduce((a, b) => a * b) })

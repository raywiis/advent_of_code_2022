import { assert, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

// const input = (await Deno.readTextFile('./sample')).split('\n')
const input = (await Deno.readTextFile('./input')).split('\n')

const flows = new Map<string, number>();
const leadMap = new Map<string, string[]>();

for (const row of input) {
  const parts = row.split(' ');
  const leads = parts.slice(9);
  flows.set(parts[1], parseInt(parts[4].slice(5)))
  leadMap.set(parts[1], leads.map(l => l.replaceAll(',','')));
}

function reduce<T>(iter: IterableIterator<number>, func: (a: any, b: any) => T, initial: T): T {
  let r = initial;
  for (const a of iter) {
    r = func(r, a);
  }
  return r;
}

type TakenPath = {
  timeSpent:number;
  pressure: number;
  openedTaps: Set<string>;
  currentTap: string;
}

const distancesCache = new Map<string, [string[], Map<string, number>]>();

function getDistances(from: string) {
  const knownResult = distancesCache.get(from);

  if (knownResult) {
    return knownResult;
  }

  const q: string[] = [from];
  const visited = new Map<string, number>([
    [from, 0],
  ]);
  const prioQ: string[] = [];
  while (q.length > 0) {
    const c = q.shift();
    assert(c);
    const d = visited.get(c);
    assert(d!== undefined);
    const neighbors = leadMap.get(c);
    assert(neighbors)
    for (const n of neighbors) {
      if (visited.has(n)) {
        continue;
      }
      prioQ.push(n);
      visited.set(n, d + 1);
      q.push(n);
    }
  }
  distancesCache.set(from, [prioQ, visited]);
  return [prioQ, visited] as const;
}

function getPrioritizedTaps(tp: TakenPath, remainingTime: number): {
  tap: string;
  distance: number;
  ep: number;
}[] {
  const { currentTap, openedTaps } = tp;

  const [pq, dists] = getDistances(currentTap);
  const res = pq
    .filter(a => !openedTaps.has(a))
    .map(a => {
      const distance = dists.get(a)
      const flow =flows.get(a);
      assert(distance !== undefined)
      assert(flow !== undefined)
      const time = distance + 1;
      const ep = (remainingTime - time) * flow;
      return { tap: a, distance: time, ep };
    })
    .filter(a => a.ep > 0)
  res.sort((a,b) => b.ep - a.ep)

  return res;
}

function getMaxRemainingPressure(visitedSet: Set<string> , remainingTime: number) {
  let p = 0;
  for (const [k, v] of flows.entries()) {
    if (visitedSet.has(k)) {
      continue;
    }
    p += remainingTime * v;
  }
  return p;
}

function optimizePressure(initialPosition: string, maxTime: number) {
  const q: TakenPath[] = [
    {
      currentTap: initialPosition,
      openedTaps: new Set(),
      pressure: 0,
      timeSpent: 0
    }
  ]

  let maxPressure = 0;

  while (q.length > 0) {
    const nextCheck = q.shift();
    assert(nextCheck);
    const remainingTime = maxTime - nextCheck.timeSpent;
    for (const n of getPrioritizedTaps(nextCheck, remainingTime)) {
      const nextPath: TakenPath = {
        currentTap: n.tap,
        openedTaps: new Set([...nextCheck.openedTaps, n.tap]),
        pressure: n.ep + nextCheck.pressure,
        timeSpent: nextCheck.timeSpent + n.distance,
      }
      const pathCap = getMaxRemainingPressure(nextPath.openedTaps, maxTime - nextPath.timeSpent)
      if (pathCap+ nextPath.pressure < maxPressure) {
        continue
      }
      maxPressure = Math.max(maxPressure, nextPath.pressure)
      q.push(nextPath)
    }
  }
  return maxPressure;
}

type DoublePathsTaken = { me: { position: string; walkTime: number; }; elephant: { position: string; walkTime: number; }; openedTaps: Set<string>; pressure: number; timeSpent: number; potential: number;}

function getNextDests(position: DoublePathsTaken) {
  const visitedSet = position.openedTaps;
  const singularVisits = [];
  if (position.me.walkTime === 0) {
    for (const n of getPrioritizedTaps({
      currentTap: position.me.position,
      openedTaps: visitedSet,
      pressure: position.pressure,
      timeSpent: position.timeSpent,
    }, 26 - position.timeSpent)) {
      singularVisits.push({
        me: { position: n.tap, walkTime: n.distance },
        elephant: position.elephant,
      })
    }
  } else {
    singularVisits.push({
      me: position.me,
      elephant: position.elephant,
    })
  }

  if (position.elephant.walkTime !== 0) {
    return singularVisits;
  }
  const dualVisits = []

  for (const friendVisit of singularVisits) {
    const fvs = new Set([...visitedSet, friendVisit.me.position]);
    for (const n of getPrioritizedTaps({ currentTap: position.elephant.position, openedTaps: fvs, pressure: position.pressure, timeSpent: position.timeSpent }, 26 - position.timeSpent)) {
      dualVisits.push({
        me: friendVisit.me,
        elephant: { position: n.tap, walkTime: n.distance }
      })
    }
  }
  return dualVisits;
}

// console.log(getNextDests(
// {
//     me: { position: "JJ", walkTime: 1 },
//     elephant: { position: "DD", walkTime: 0 },
//     openedTaps: new Set([ "JJ", "DD" ]),
//     pressure: 480,
//     timeSpent: 2
//   }
// ));

function optimizePressureWithElephant() {
  const maxTime = 26;
  const q = [
    {
      me: { position: 'AA', walkTime: 0 },
      elephant: { position: 'AA', walkTime: 0 },
      openedTaps: new Set<string>(),
      pressure: 0,
      timeSpent: 0,
      potential: Infinity
    }
  ];

  let maxPressure = 0;
  let it = 0;

  while (q.length > 0) {
    it += 1;
    const next = q.shift();
    assert(next);
    if (q.length % 100_000 === 0) {
      console.log({remaining: q.length})
    }
    if (next.pressure > maxPressure) {
      maxPressure = next.pressure;
      console.log({maxPressure, remaining: q.length})
    }
    if (next.potential < maxPressure) {
      continue;
    }
    const nextPositions = getNextDests(next);

    // console.log({ next, nextPositions })
    for (const n of nextPositions) {
      const walkedTime = Math.min(n.me.walkTime, n.elephant.walkTime);
      assert(walkedTime > 0)
      const endTime = next.timeSpent + walkedTime;
      const remainingTime = maxTime - endTime;
      assert(remainingTime > 0)
      let pressure = next.pressure;

      const newMe = {
        position: n.me.position,
        walkTime: n.me.walkTime - walkedTime,
      }
      const newElephant = {
        position: n.elephant.position,
        walkTime: n.elephant.walkTime - walkedTime,
      }

      const openedToTimeTaps = new Set([...next.openedTaps]);
      if (newMe.walkTime === 0) {
        const flow = flows.get(n.me.position)
        assert(flow);
        openedToTimeTaps.add(n.me.position)
        pressure += flow * remainingTime;
      }
      if (newElephant.walkTime === 0) {
        const flow = flows.get(n.elephant.position)
        assert(flow);
        openedToTimeTaps.add(n.elephant.position)
        pressure += flow * remainingTime;
      }

      const openedTaps = new Set([...next.openedTaps, newMe.position, newElephant.position])

      const maxCap = getMaxRemainingPressure(openedToTimeTaps, remainingTime);
      const potential = pressure + maxCap;
      if (potential <= maxPressure) {
        continue;
      }

      q.unshift({
        me: newMe,
        elephant: newElephant,
        openedTaps,
        pressure,
        timeSpent: endTime,
        potential,
      })
    }

    if (next.me.walkTime > 0 || next.elephant.walkTime > 0) {
      let pressure = next.pressure;
      const walkedTime = Math.max(next.me.walkTime, next.elephant.walkTime);
      const endTime = next.timeSpent + walkedTime;
      const remainingTime = maxTime - endTime;
      if (next.me.walkTime > 0) {
        const flow = flows.get(next.me.position);
        assert(flow);
        pressure += flow * remainingTime;
      }
      if (next.elephant.walkTime > 0) {
        const flow = flows.get(next.elephant.position);
        assert(flow);
        pressure += flow * remainingTime;
      }

      const potential = pressure;
      if (potential <= maxPressure) {
        continue;
      }

      q.unshift({
        me: { position: next.me.position, walkTime: 0},
        elephant: {position: next.elephant.position, walkTime: 0},
        openedTaps: next.openedTaps,
        pressure,
        timeSpent: endTime,
        potential,
      })
    }

    // if (it > 1) {
    //   break
    // }
  }
  return maxPressure;
}

// console.log({ max: optimizePressure('AA', 30) })
// 2132 - too low
console.log({ max: optimizePressureWithElephant() })

// console.log(getPrioritizedTaps({
//   currentTap: 'CC',
//   openedTaps: new Set(['CC']),
//   pressure: 0,
//   timeSpent: 0
// }, 30))


const fs = require('fs');

const input = fs.readFileSync('./input').toString().split('\n').map(row => row.split(' '));
// const input = [
//   ['A', 'Y'],
//   ['B', 'X'],
//   ['C', 'Z'],
// ]

const signPoints = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

const symbols = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors'
}

const outcomePoints = {
  LOSE: 0,
  DRAW: 3,
  WIN: 6,
}

const getOutcome = (opponent, me) => {
  const oppSym = symbols[opponent];
  const meSym = symbols[me]

  if (oppSym === meSym) {
    return outcomePoints.DRAW
  }
  if (meSym === 'rock') {
    return oppSym === 'paper' ? outcomePoints.LOSE : outcomePoints.WIN;
  }
  if (meSym === 'paper') {
    return oppSym === 'scissors' ? outcomePoints.LOSE : outcomePoints.WIN;
  }
  if (meSym === 'scissors') {
    return oppSym === 'rock' ? outcomePoints.LOSE : outcomePoints.WIN;
  }
  throw new Error("Invariant");
}

const outcomes = {
  X: 'LOSE',
  Y: 'DRAW',
  Z: 'WIN',
}

const winChoices = {
  A: 'paper',
  B: 'scissors',
  C: 'rock',
}

const loseChoices = {
  A: 'scissors',
  B: 'rock',
  C: 'paper',
}


const getChoice = (opponent, outcome) => {
  if (outcome === 'DRAW') {
    return signPoints[symbols[opponent]];
  }
  if (outcome === 'WIN') {
    return signPoints[winChoices[opponent]];
  } else {
    return signPoints[loseChoices[opponent]];
  }
}

const p1Points = input.map(([opponent, me]) => {
  const choicePts = signPoints[symbols[me]];
  const roundPoints = getOutcome(opponent, me);
  return roundPoints + choicePts;
});

console.log(p1Points.reduce((acc, s) => acc + s, 0))

const p2Points = input.map(([opponent, me]) => {
  const choicePts = getChoice(opponent, outcomes[me]);
  const roundPoints = outcomePoints[outcomes[me]];
  return roundPoints + choicePts;
});

console.log(p2Points.reduce((acc, s) => acc + s, 0))

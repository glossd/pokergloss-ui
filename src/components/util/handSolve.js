import {Hand} from 'pokersolver/pokersolver.js'
import {areUnique} from "../Table/util";

const mockSolve = {
  descr: '',
  name: '',
  cards: []
}

export function handSolve(cards) {

  if (!cards) {
    console.warn("Cards: " + cards)
    return mockSolve
  }

  if (cards.length < 3 || cards.length > 7) {
    console.warn("Cards length should be between 3 and 7, cards length: " + cards.length)
    return mockSolve
  }

  if (!areUnique(cards)) {
    console.warn("Cards are not unique, cards: " + cards)
    return mockSolve
  }

  try {
    return Hand.solve(cards)
  }
  catch (error) {
    console.error('handSolve: ', error)
    return mockSolve
  }
}
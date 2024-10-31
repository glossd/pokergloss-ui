export const SET_TUTORIAL_ACTION = 'SET_TUTORIAL_ACTION'
export const SET_TUTORIAL_GIRL = 'SET_TUTORIAL_GIRL'
export const SET_TUTORIAL_POKER_COMBINATIONS = 'SET_TUTORIAL_POKER_COMBINATIONS'

export const emptyGirl = {message: "", next: () => {}}
export const emptyPokerCombinations = {next: null}

export const setTutorialAction = (type, chips) => ({
  type: SET_TUTORIAL_ACTION,
  action: {type, chips}
})

export const setGirl = (girl) => ({
  type: SET_TUTORIAL_GIRL, girl
})

export const setPokerCombinations = (pokerCombinations) => ({
  type: SET_TUTORIAL_POKER_COMBINATIONS, pokerCombinations
})

export const clearGirl = () => ({
  type: SET_TUTORIAL_GIRL, girl: emptyGirl
})

export const clearPokerCombinations = () => ({
  type: SET_TUTORIAL_POKER_COMBINATIONS, pokerCombinations: emptyPokerCombinations
})
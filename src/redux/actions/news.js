export const SET_BALANCE = 'SET_BALANCE'
export const SET_EXP = 'SET_EXP'
export const REMOVE_TOURNAMENT_TABLE_ID = 'REMOVE_TOURNAMENT_TABLE_ID'
export const GOT_NEW_LEVEL_PRIZE = 'GOT_NEW_LEVEL_PRIZE'
export const GOT_ACHIEVEMENT_PRIZE = 'GOT_ACHIEVEMENT_PRIZE'

export const SET_DAILY_ASSIGNMENTS = 'SET_DAILY_ASSIGNMENTS'
export const SET_OPEN_DAILY_ASSIGNMENTS = 'SET_OPEN_DAILY_ASSIGNMENTS'
export const DELETE_CHANGED_ASSIGNMENT = 'DELETE_CHANGED_ASSIGNMENT'

export const NEWS_DELETE_NEW_MESSAGE = 'NEWS_DELETE_NEW_MESSAGE'

export const CLOSE_SURVIVAL_WHEEL = 'CLOSE_SURVIVAL_WHEEL'
export const SET_SURVIVAL_WHEEL_ACTION = 'SET_SURVIVAL_WHEEL_ACTION'

export const setBalance = (balance) => ({
  type: SET_BALANCE,
  balance
})

export const setExp = (exp) => ({
  type: SET_EXP,
  exp
})

export const setDailyAssignments = (assignments) => ({
  type: SET_DAILY_ASSIGNMENTS,
  assignments
})

export const deleteChangedAssignment = () => ({
  type: DELETE_CHANGED_ASSIGNMENT,
})

export const setOpenDailyAssignments = (isOpen) => ({
  type: SET_OPEN_DAILY_ASSIGNMENTS,
  isOpen
})

export const gotAchievementPrize = () => ({
  type: GOT_ACHIEVEMENT_PRIZE
})

export const gotNewLevelPrize = () => ({
  type: GOT_NEW_LEVEL_PRIZE
})

export const deleteTournamentTableId = () => ({
  type: REMOVE_TOURNAMENT_TABLE_ID
})

export const deleteNewMessage = () => ({type: NEWS_DELETE_NEW_MESSAGE})

export const closeSurvivalWheel = () => ({
  type: CLOSE_SURVIVAL_WHEEL
})

export const survivalWheelActions = Object.freeze({
  WAITING: "WAITING",
  ROTATING: "ROTATING",
  STOPPING: "STOPPING"
});

export const setSurvivalWheelAction = (action) => ({
  type: SET_SURVIVAL_WHEEL_ACTION,
  action
})
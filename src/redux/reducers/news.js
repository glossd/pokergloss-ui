import {
  CLOSE_SURVIVAL_WHEEL,
  DELETE_CHANGED_ASSIGNMENT,
  GOT_ACHIEVEMENT_PRIZE,
  GOT_NEW_LEVEL_PRIZE,
  NEWS_DELETE_NEW_MESSAGE,
  REMOVE_TOURNAMENT_TABLE_ID,
  SET_BALANCE,
  SET_DAILY_ASSIGNMENTS,
  SET_EXP,
  SET_OPEN_DAILY_ASSIGNMENTS, SET_SURVIVAL_WHEEL_ACTION, survivalWheelActions,
} from "../actions/news";
import {LOG_OUT} from "../actions/auth";
import {WsAchieveEventTypeEnum} from "@pokergloss/achievement-client-typescript";
import {WsAssignmentEventTypeEnum} from "@pokergloss/assignment-client-typescript/dist/api";

const initialState = {
  balance: null,
  exp: null,
  dailyAssignments: [],
  isAssignmentsOpen: false,
  changedAssignment: null,
  newLevelPrize: 0,
  newAchievementPrize: {},
  multiTableId: null,
  sitngoTableId: null,
  newMessage: null,
  isSurvivalWheelOpen: false,
  survivalWheel: null,
  survivalWheelAction: ''
}

export default function news(state = initialState, action) {
  switch (action.type) {
    case "balanceUpdate":
      return {
        ...state, balance: action.payload
      }
    case "multiGameStart": {
      return {
        ...state, multiTableId: action.payload.tableId
      }
    }
    case "sitngoGameStart": {
      return {
        ...state, sitngoTableId: action.payload.tableId
      }
    }

    case "newsMessengerNewMessage": return {...state, newMessage: action.payload}
    case NEWS_DELETE_NEW_MESSAGE: return {...state, newMessage: null}

    case WsAchieveEventTypeEnum.ExpUpdate: {
      return {
        ...state, exp: action.payload, newLevelPrize: action.payload.prize
      }
    }
    case WsAchieveEventTypeEnum.Hand: {
      return {
        ...state, newAchievementPrize: action.payload.prize
      }
    }
    case WsAchieveEventTypeEnum.NewAchievement: {
      return {
        ...state, newAchievementPrize: action.payload.prize
      }
    }
    case WsAssignmentEventTypeEnum.ChangedAssignment: {
      const newDailyAssignments = state.dailyAssignments.map(a => {
        if (a.type === action.payload.assignment.type) {
          return action.payload.assignment
        }
        return a
      })
      return {
        ...state, dailyAssignments:newDailyAssignments, changedAssignment: action.payload.assignment
      }
    }
    case SET_EXP:
      return {
        ...state, exp: action.exp
      }
    case GOT_ACHIEVEMENT_PRIZE:
      return {
        ...state, newAchievementPrize: {}
      }
    case GOT_NEW_LEVEL_PRIZE:
      return {
        ...state, newLevelPrize: 0
      }
    case REMOVE_TOURNAMENT_TABLE_ID: {
      return {
        ...state, multiTableId: null, sitngoTableId: null,
      }
    }
    case SET_BALANCE:
      return {
        ...state, balance: action.balance
      }
    case SET_DAILY_ASSIGNMENTS:
      return {
        ...state, dailyAssignments: action.assignments
      }
    case SET_OPEN_DAILY_ASSIGNMENTS:
      return {
        ...state, isAssignmentsOpen: action.isOpen
      }
    case DELETE_CHANGED_ASSIGNMENT:
      return {
        ...state, changedAssignment: null
      }
    case LOG_OUT:
      return initialState
    case "survivalWheel": {
      return {
        ...state, isSurvivalWheelOpen: true, survivalWheel: action.payload.wheel, survivalWheelAction: survivalWheelActions.WAITING
      }
    }
    case CLOSE_SURVIVAL_WHEEL: {
      return {
        ...state, isSurvivalWheelOpen: false, survivalWheel: null, survivalWheelAction: ''
      }
    }
    case SET_SURVIVAL_WHEEL_ACTION: {
      return {
        ...state, survivalWheelAction: action.action
      }
    }
    default:
      return state
  }
}
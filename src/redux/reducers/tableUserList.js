import {ModelWsEventTypeEnum} from "@pokergloss/table-stream-client-typescript";
import {SET_TABLE_USER_LIST_CONTENT} from "../actions/tableUserList";

const initialState = {
  anonymousCount: 0,
  users: new Map()
};

export default function tableUserList(state = initialState, action) {
  switch (action.type) {
    case SET_TABLE_USER_LIST_CONTENT: {
      const aMap = new Map()
      for (let user of action.content.users) {
        aMap.set(user.userId, user)
      }
      return {
        ...state, users: aMap, anonymousCount: action.content.anonymousCount
      }
    }
    case ModelWsEventTypeEnum.NewTableIdentity: {
      state.users.set(action.payload.user.userId, action.payload.user)
      return {
        ...state, users: state.users
      }
    }
    case ModelWsEventTypeEnum.NewTableAnonymous: {
      return {
        ...state, anonymousCount: state.anonymousCount + 1
      }
    }
    case ModelWsEventTypeEnum.LeftTableIdentity: {
      state.users.delete(action.payload.user.userId)
      return {
        ...state, users: state.users
      }
    }
    case ModelWsEventTypeEnum.LeftTableAnonymous: {
      return {
        ...state, anonymousCount: state.anonymousCount - 1
      }
    }
    default:
      return state
  }
}
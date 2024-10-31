import {
  MESSENGER_ADD_CHAT, MESSENGER_ADD_MESSAGE, MESSENGER_ADD_MESSAGES,
  MESSENGER_CHOOSE_CHAT,
  MESSENGER_CHOOSE_USER, MESSENGER_MESSAGES_TO_READ, MESSENGER_NULLIFY_CHOSEN_ONE, MESSENGER_REMOVE_CHAT,
  MESSENGER_SET_CHATS, MESSENGER_SET_MESSAGES, MESSENGER_SET_TEXT, MESSENGER_SET_UNREAD_COUNT
} from "../actions/messenger";
import {ModelMessageStatusEnum, WsstoreMessengerEventTypeEnum} from "@pokergloss/messenger-client-typescript";

const initialState = {
  chosenUser: null,
  chosenChat: null,
  chats: [],
  messages: [],
  isLastMessages: false,
  unreadCount: null,
  text: "",
  typing: null
}

export default function messenger(state = initialState, action) {
  switch (action.type) {
    case MESSENGER_SET_UNREAD_COUNT: return {...state, unreadCount: action.count}
    case MESSENGER_SET_TEXT: return {...state, text: action.text}
    case "newsMessengerNewMessage": return {...state, unreadCount: state.unreadCount ? state.unreadCount+1: 1}
    case "messengerTyping": {
      return {...state, typing: Object.assign(action.payload, {timeAt: Date.now()})}
    }

    case MESSENGER_CHOOSE_USER: return {...state, chosenChat: null, chosenUser: action.user, messages: [], isLastMessages: false}
    case MESSENGER_CHOOSE_CHAT: return {...state, chosenChat: action.chat, chosenUser: null, messages: [], isLastMessages: false}
    case MESSENGER_NULLIFY_CHOSEN_ONE: return {...state, chosenChat: null, chosenUser: null, messages: [], isLastMessages: false}

    case MESSENGER_SET_CHATS: return {...state, chats: action.chats}
    case MESSENGER_ADD_CHAT: return {...state, chats: [action.chat, ...state.chats]}
    case MESSENGER_REMOVE_CHAT: {
      const newChats = state.chats.filter(c => c.id !== action.chatId)
      return {...state, chats: newChats}
    }

    case MESSENGER_SET_MESSAGES: {
      return {...state, messages: action.messages, isLastMessages: action.messages.length !== 20}
    }
    case MESSENGER_ADD_MESSAGES: {
      if (state.isLastMessages) {
        return state
      }
      return {...state, messages: state.messages.concat(action.messages), isLastMessages: action.messages.length !== 20}
    }
    case MESSENGER_ADD_MESSAGE:
      const msg = action.message
      let chat = {}
      const newChats = state.chats.filter(c => {
        if (c.id === msg.chatId) {
          chat = c
          return false
        }
        return true
      })
      chat.lastMessage = msg
      newChats.unshift(chat)

      return {...state, chats: newChats, messages: [action.message, ...state.messages]}

    case WsstoreMessengerEventTypeEnum.MessengerNewChat: return {...state, chats: [action.payload.chat, ...state.chats]}
    case WsstoreMessengerEventTypeEnum.MessengerMessageStatus: {
      const actionMessage = action.payload.message;

      const newChats = state.chats.map(c => {
        if (actionMessage.chatId === c.id) {
          if (c.lastMessage && c.lastMessage === actionMessage.id) {
            const lastMessage = Object.assign(c.lastMessage, actionMessage)
            return Object.assign(c, {lastMessage})
          }
        }
        return c
      })
      if (state.chosenChat && state.chosenChat.id === actionMessage.chatId) {
        const newMessages = state.messages.map(m => {
          if (m.id === actionMessage.id) {
            return Object.assign(m, actionMessage)
          }
          return m
        })
        return {...state, chats: newChats, messages: newMessages}
      }

      return {...state, chats: newChats}
    }
    case MESSENGER_MESSAGES_TO_READ: {
      const newMessages = state.messages.map(m => {
        if (action.ids.includes(m.id)) {
          return Object.assign(m, {status: ModelMessageStatusEnum.Read})
        }
        return m
      })
      const newChats = state.chats.map(c => {
        if (c.lastMessage && action.ids.includes(c.lastMessage.id)) {
          return Object.assign(c, {lastMessage:Object.assign(c.lastMessage, {status: ModelMessageStatusEnum.Read})})
        }
        return c
      })

      return {...state, chats: newChats, messages: newMessages}
    }
    case WsstoreMessengerEventTypeEnum.MessengerNewMessage: {
      const actionMessage = action.payload.message;

      let foundChat = {}
      const newChats = state.chats.filter(c => {
        if (c.id === actionMessage.chatId) {
          foundChat = c
          return false
        }
        return true
      })
      foundChat = Object.assign(foundChat, {lastMessage: actionMessage})
      newChats.unshift(foundChat)

      if (state.chosenChat && state.chosenChat.id === actionMessage.chatId) {
        return {...state, chats: newChats, messages: [actionMessage, ...state.messages]}
      }
      return {...state, chats: newChats}
    }

    default:
      return state
  }
}
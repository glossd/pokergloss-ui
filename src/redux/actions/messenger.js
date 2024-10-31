export const MESSENGER_CHOOSE_USER = 'MESSENGER_CHOOSE_USER'
export const MESSENGER_CHOOSE_CHAT = 'MESSENGER_CHOOSE_CHAT'
export const MESSENGER_NULLIFY_CHOSEN_ONE = 'MESSENGER_NULLIFY_CHOSEN_ONE'

export const MESSENGER_SET_CHATS = 'MESSENGER_SET_CHATS'
export const MESSENGER_ADD_CHAT = 'MESSENGER_ADD_CHAT'
export const MESSENGER_REMOVE_CHAT = 'MESSENGER_REMOVE_CHAT'

export const MESSENGER_SET_MESSAGES = 'MESSENGER_SET_MESSAGES'
export const MESSENGER_ADD_MESSAGES = 'MESSENGER_ADD_MESSAGES'
export const MESSENGER_ADD_MESSAGE = 'MESSENGER_ADD_MESSAGE'
export const MESSENGER_MESSAGES_TO_READ = 'MESSENGER_MESSAGES_TO_READ'

export const MESSENGER_SET_UNREAD_COUNT = 'MESSENGER_SET_UNREAD_COUNT'

export const MESSENGER_SET_TEXT = 'MESSENGER_SET_TEXT'

export const chooseUser = (user) => ({type: MESSENGER_CHOOSE_USER, user})
export const chooseChat = (chat) => ({type: MESSENGER_CHOOSE_CHAT, chat})
export const nullifyChosenOne = () => ({type: MESSENGER_NULLIFY_CHOSEN_ONE})

export const setChats = (chats) => ({type: MESSENGER_SET_CHATS, chats})
export const addChat = (chat) => ({type: MESSENGER_ADD_CHAT, chat})
export const removeChat = (chatId) => ({type: MESSENGER_REMOVE_CHAT, chatId})

export const setMessages = (messages) => ({type: MESSENGER_SET_MESSAGES, messages})
export const addMessages = (messages) => ({type: MESSENGER_ADD_MESSAGES, messages})
export const addMessage = (message) => ({type: MESSENGER_ADD_MESSAGE, message})

export const setUnreadCount = (count) => ({type: MESSENGER_SET_UNREAD_COUNT, count})

export const setMessagesToRead = (ids) => ({type: MESSENGER_MESSAGES_TO_READ, ids})

export const setText = (text) => ({type: MESSENGER_SET_TEXT, text})
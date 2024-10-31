import {DefaultApi} from "@pokergloss/messenger-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("messenger"));

export async function postU2UChat(userId) {
  const res = await api.postChat({userId})
  return res.data
}

export async function sendChatMessage(chatId, text) {
  const res = await api.sendChatMessage(chatId, {text})
  return res.data
}

export async function getUnreadChatsCount() {
  const res = await api.getUnreadChatsCount()
  return res.data
}

export async function getAllChats() {
  const res = await api.getAllChats()
  return res.data
}

export async function getChatMessages(chatId, limit, lastId) {
  const res = await api.getChatMessages(chatId, lastId, limit)
  return res.data
}

export async function readChatMessages(chatId, messageIds) {
  const res = await api.readChatMessages(chatId, {messageIds})
  return res.data
}

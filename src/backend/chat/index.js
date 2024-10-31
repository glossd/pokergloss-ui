import {DefaultApi} from "@pokergloss/table-chat-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("table-chat"));

export async function postMessage(tableId, text) {
  const r = api.postMessage(tableId, {text})
  return r.data
}

export async function postEmoji(tableId, emoji) {
  const r = api.postEmoji(tableId, {emoji})
  return r.data
}
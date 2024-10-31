import {DefaultApi} from "@pokergloss/table-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("table"));

export async function getTables(skip, limit, skipEmpty, skipFull) {
  const r = await api.getTables(skip, limit, skipEmpty, skipFull)
  return r.data
}

export async function listSitNGoRooms(skip, limit, skipEmpty, skipFull) {
  const r = await api.listSitAndGoLobbies(skip, limit, skipEmpty, skipFull)
  return r.data
}

export async function postSitNGoRoom(room) {
  const r = await api.postSitAndGoLobby(room)
  return r.data
}

export async function listMultiRooms(skip, limit) {
  const r = await api.listMultiLobbies(skip, limit)
  return r.data
}

export async function postTable(table) {
  const r = await api.postTable(table)
  return r.data
}

export async function reserveSeat(tableId, position) {
  const r = await api.reserveSeatV2(tableId, position)
  return r.data
}

export async function registerForSitngo(tableId, position) {
  const r = await api.registerForSitAndGo(tableId, {position})
  return r.data
}

export async function unregisterSitngo(tableId, position) {
  const r = await api.unregisterFromSitAndGo(tableId, {position})
  return r.data
}

export async function registerMulti(id) {
  const r = await api.registerMulti(id)
  return r.data
}

export async function unregisterMulti(id) {
  const r = await api.unregisterMulti(id)
  return r.data
}

export async function buyIn(tableId, position, stack) {
  const r = await api.buyInV2(tableId, position, {stack})
  return r.data
}

export async function stand(tableId, position) {
  const r = await api.stand(tableId, position);
  return r.data
}

export async function makeAction(tableId, position, action, chips) {
  const r = await api.makeActionV2(tableId, position, action, {chips})
  return r.data
}

export async function cancelReservation(tableId, position) {
  const r = await api.cancelReservation(tableId, position)
  return r.data
}

export async function backToGame(tableId, position) {
  const r = await api.backToGame(tableId, position)
  return r.data
}

export async function addChips(tableId, position, chips) {
  const r = await api.addChips(tableId, position, {chips})
  return r.data
}

export async function setIntent(tableId, position, intent, chips) {
  const r = await api.setIntent(tableId, position,{intent: {type: intent, chips: chips}})
  return r.data
}

export async function deleteIntent(tableId, position) {
  const r = await api.deleteIntent(tableId, position)
  return r.data
}

export async function putAutoMuck(tableId, position, autoMuck) {
  const r = await api.setAutoMuck(tableId, position, {autoMuck})
  return r.data
}

export async function putAutoTopUp(tableId, position, autoTopUp) {
  const r = await api.setAutoTopUp(tableId, position, {autoTopUp})
  return r.data
}

export async function putAutoRebuy(tableId, position, autoRebuy) {
  const r = await api.setAutoRebuy(tableId, position, {autoRebuy})
  return r.data
}

export async function makeShowDownAction(tableId, position, action) {
  const r = await api.makeShowDownAction(tableId, position, action)
  return r.data
}

export async function getPlayerConfig(tableId, position) {
  const r = await api.getPlayerConfig(tableId, position)
  return r.data
}

export async function getTable(id) {
  const r = await api.getFullTable(id)
  return r.data
}

export async function getSitngoRoom(id) {
  const r = await api.getFullSitngoLobby(id)
  return r.data
}

export async function getMultiRoom(id) {
  const r = await api.getFullMultiLobby(id)
  return r.data
}

export async function getUserAutoConfig() {
  const r = await api.getPlayerAutoConfig()
  return r.data
}

export async function setUserAutoConfig(autoMuck, autoTopUp, autoRebuy) {
  const r = api.setPlayerAutoConfig({autoMuck, autoTopUp, autoRebuy})
  return r.data
}

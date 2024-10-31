import {DefaultApi} from "@pokergloss/survival-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("survival"));

export async function startSurvival() {
  const res = await api.startSurvival()
  return res.data
}

export async function startAnonymousSurvival() {
  const res = await api.startAnonymousSurvival()
  return res.data
}

export async function startSurvivalIdle() {
  const res = await api.startSurvivalIdle()
  return res.data
}

export async function getMyTickets() {
  const res = await api.getMyTickets()
  return res.data
}

export async function releaseSurvival() {
  const res = await api.releaseSurvival()
  return res.data
}

export async function getSurvivalScore(userId) {
  const res = await api.getUserScore(userId)
  return res.data
}
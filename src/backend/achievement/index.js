import {DefaultApi} from "@pokergloss/achievement-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("achievement"));

export async function getMyExp() {
  const r = await api.getMyPoints()
  return r.data
}

export async function getMyAchievements() {
  const r = await api.getMyAchievements()
  return r.data
}

export async function getUserAchievements(userId) {
  const r = await api.getUserAchievements(userId)
  return r.data
}

export async function getUserPoints(userId) {
  const r = await api.getUserPoints(userId)
  return r.data
}

export async function getUserStatistics(userId) {
  const r = await api.getUserStatistics(userId)
  return r.data
}

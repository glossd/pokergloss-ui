import {DefaultApi} from "@pokergloss/bank-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("bank"));

export async function getBalance() {
  const r = await api.getBalance()
  return r.data
}

export async function getOperations(skip, limit) {
  const r = await api.getOperations(skip, limit)
  return r.data
}

export async function getUserBalanceWithRank(userId) {
  const r = await api.getUserBalanceWithRank(userId)
  return r.data
}

export async function getRatingPage(pageSize, pageNumber) {
  const r = await api.getRatingPage(pageSize, pageNumber)
  return r.data
}
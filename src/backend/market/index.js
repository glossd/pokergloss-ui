import {DefaultApi} from "@pokergloss/market-client-typescript"
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("market"));

export async function buyItem(itemId, timeFrame, units) {
  const res = await api.buyItem({itemId, timeFrame, units})
  return res.data
}

export async function listUserItems(userId) {
  const res = await api.listUserItems(userId)
  return res.data
}

export async function listItems() {
  const res = await api.listItems()
  return res.data
}

export async function listMyItems() {
  const res = await api.listMyItems()
  return res.data
}

export async function selectItem(itemId) {
  const res = await api.selectItem(itemId)
  return res.data
}

export async function listMyPurchases() {
  const res = await api.listMyPurchases()
  return res.data
}

export async function listProducts() {
  const res = await api.listProducts()
  return res.data
}

export async function buyProduct(id) {
  const res = await api.buyProduct({id})
  return res.data
}
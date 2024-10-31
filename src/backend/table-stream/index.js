import {DefaultApi} from "@pokergloss/table-stream-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("table-stream"));

export async function tableUsers(id) {
  const res = await api.tableUsers(id)
  return res.data
}

import {DefaultApi} from "@pokergloss/assignment-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("assignment"));

export async function getMyDailyAssignments() {
  const r = await api.getMyDailyAssignments()
  return r.data
}

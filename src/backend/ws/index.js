import {DefaultApi} from "@pokergloss/ws-client-typescript";
import {RestCheckOrUpdateNotificationTokenInputPlatformEnum} from "@pokergloss/ws-client-typescript/dist/api";

const api = new DefaultApi();

export async function updateFcmToken(token) {
  const r = await api.checkOrUpdateNotificationToken({
    token,
    platform: RestCheckOrUpdateNotificationTokenInputPlatformEnum.Web
  })
  return r.data
}

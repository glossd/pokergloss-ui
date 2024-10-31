import React from "react";
import moment from "moment";
import {useTranslation} from "next-i18next";

const HOUR = 60*60*1000
const DAY = 24*HOUR

const ItemExpiration = ({expiresAt}) => {
  const {t} = useTranslation();
  let mDur = moment.duration(expiresAt - Date.now())
  const duration = Math.max(expiresAt - Date.now(), 0)

  if (duration === 0) {
    return <span>Expired</span>
  }
  if (duration < HOUR) {
    return <span>{Math.floor(mDur.asMinutes())} {t("InventoryPage.ItemExpiration.minLeft")}</span>
  }
  if (duration < DAY) {
    return <span>{Math.floor(mDur.asHours())} {t("InventoryPage.ItemExpiration.hoursLeft")}</span>
  }
  if (duration < 3*DAY) {
    return <span>{Math.floor(mDur.asDays())} {t("InventoryPage.ItemExpiration.days")}, {Math.floor(mDur.asHours() - Math.floor(mDur.asDays())*24)} {t("InventoryPage.ItemExpiration.hoursLeft")}</span>
  }
  return  <span>{Math.floor(mDur.asDays())} {t("InventoryPage.ItemExpiration.daysLeft")}</span>
}

export default ItemExpiration
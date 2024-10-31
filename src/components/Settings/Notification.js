import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import firebase from "../../auth/Firebase";
import {updateFcmToken} from "../../backend/ws";
import DefaultButton from "../UI/Button/DefaultButton/DefaultButton";
import {useTranslation} from "next-i18next";
import {backendError} from "../../backend/error";
import {errorMessage} from "../../backend";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    color: "white",
  }
}));

const vapidKey = "BGHRlsgHZrTh19QQNPLAG97CgR9ogkSsFysrHjd7Bd9lepK1iXiRlj54jJ1CiylSaRLc15YGQMVujGOh32QJqhU"

const Notification = () => {
  const classes = useStyles()
  const { t } = useTranslation();

  const [notificationNotPermitted, setNotificationNotPermitted] = useState(false)
  const [successUpdate, setSuccessUpdate] = useState("")
  const [updateError, setUpdateError] = useState("")

  const isNotificationSupported = () => 'Notification' in window

  const onNotifyMe = () => {
    if (!isNotificationSupported()) {
      return
    }

    const messaging = firebase.messaging();
    messaging.getToken({vapidKey})
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          updateFcmToken(currentToken)
            .then(r => {
              switch (r.status) {
                case "added":
                  setSuccessUpdate(t("SettingsPage.Notification.SuccessfullyAdded"))
                  break
                case "replaced":
                  setSuccessUpdate(t("SettingsPage.Notification.SuccessfullyReplaced"))
                  break
                case "same":
                  setSuccessUpdate(t("SettingsPage.Notification.AlreadyAdded"))
                  break
              }
              setUpdateError("")
            })
            .catch(e => {
              backendError(e)
              setUpdateError(errorMessage(e))
            })
        } else {
          // Show permission request UI
          console.info('No registration token available. Request permission to generate one.');
          Notification.requestPermission()
            .then((permission) => {
              if (permission === "granted") {
                onNotifyMe()
              } else {
               setNotificationNotPermitted(true)
              }
            });
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
        setUpdateError(errorMessage(err))
      })
  }

  if (!isNotificationSupported()) {
    return <div>Notification is not supported in your browser</div>
  }


  return (
    <div className={classes.root}>
      {
        successUpdate
          ? <div className={"success"}>{successUpdate}</div>
          : (
            <div>
              <DefaultButton onClick={onNotifyMe}>{t("SettingsPage.Notification.Notify")}</DefaultButton>
              <div>{t("SettingsPage.Notification.Notify me")}</div>
              {notificationNotPermitted && <div>{t("SettingsPage.Notification.PermissionNotGranted")}</div>}
            </div>
            )
      }
      {updateError && <div className={"error"}>{updateError}</div>}
      <div>*{t("SettingsPage.Notification.Notify me note")}</div>
    </div>
  )
}

export default Notification

import React, {useState} from "react";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import {getCurrentUser} from "../../../auth/Firebase";

import firebase from 'firebase/app';
import 'firebase/auth';
import {useTranslation} from "next-i18next";

export default function ChangePassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  function onChangePassword(inputPassword) {
    setPassword(inputPassword)
  }

  function onChangeNewPassword(inputNewPassword) {
    setNewPassword(inputNewPassword)
    if (inputNewPassword.length < 6) {
      setPasswordMessage('Password should be at least 6 characters')
    } else {
      setPasswordMessage('')
    }
  }

  function changePassword() {

    getCurrentUser().then(user => {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );

      user.reauthenticateWithCredential(credential).then(() => {
        user.updatePassword(newPassword).then(() => {
          setPasswordMessage('Update successful')
        }).catch((error) => {
          console.error(error.message)
          setPasswordMessage(error.message)
        })
      }).catch((error) => {
        console.error(error.message)
        setPasswordMessage(error.message)
      });
    })
  }

  return (
    <div >
      <div className='change-password-container'>
        <label className='label-change-username'>{t("SettingsPage.ChangePassword.EnterYourPassword")}</label>
        <input
          name='password'
          type="text"
          value={password}
          onChange={e => onChangePassword(e.target.value)}
        />
        <label className='label-change-username'>{t("SettingsPage.ChangePassword.EnterNewPassword")}</label>
        <input
          name='new-password'
          type="text"
          value={newPassword}
          onChange={e => onChangeNewPassword(e.target.value)}
        />
      </div>
      <div>
        <p className='msg'>{passwordMessage}</p>
      </div>
      <DefaultButton
        onClick={changePassword}
        disabled={passwordMessage !== ''}
      >
        {t("SettingsPage.ChangePassword.Change")}
      </DefaultButton>

    </div>
  )
}
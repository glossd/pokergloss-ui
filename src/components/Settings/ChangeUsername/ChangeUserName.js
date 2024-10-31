import React, {useState} from "react";
import {changeUserUsername, checkUsername} from "../../../backend/profile";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";

import {onUpdateUserInfo} from "../../../auth/Firebase";
import {validateUsername} from "../../util/validateUsername";
import {errorMessage} from "../../../backend";
import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";

export default function ChangeUserName() {
  const { t } = useTranslation();

  const [username, setUsername] = useState('')
  const [userNameErrorDataMessage, setUserNameErrorDataMessage] = useState('')
  const [userNameSuccessDataMessage, setUserNameSuccessDataMessage] = useState('')
  const [checkUsernameMessage, setCheckUsernameMessage] = useState('');

  function onChangeUsername(inputUsername) {
    setUsername(inputUsername)
    checkUsername(inputUsername)
      .then(data => {
        setCheckUsernameMessage(data.message)
      })
      .catch(backendError)
  }

  function isUsernameAlreadyExists() {
    return checkUsernameMessage === 'username already exists'
  }

  function disabledChangeUserName() {
    return username === '' || validateUsername(username) !== '' || isUsernameAlreadyExists()
  }

  function changeUserName() {
    changeUserUsername(username)
      .then(() => {
        onUpdateUserInfo().then(() => {
          setUserNameSuccessDataMessage(t("SettingsPage.ChangeUsername.UpdateSuccessful"))
        })
      })
      .catch(error => {
        backendError(error)
        setUserNameErrorDataMessage(errorMessage(error))
      })
  }

  return (
    <div>
      <div className='change-username-container'>
        <label className='label-change-username'>{t("SettingsPage.ChangeUsername.EnterNewUsername")}:</label>
        <input
          name='username'
          type="text"
          value={username}
          onChange={e => onChangeUsername(e.target.value)}
        />
      </div>
      <div>
        <p className='error-change-user-name-message'>{username !== '' && validateUsername(username)}</p>
        {isUsernameAlreadyExists() && <p className='error-change-user-name-message'>{checkUsernameMessage}</p>}
        <p className='error-change-user-name-message'>{userNameErrorDataMessage}</p>
        <p className='success-change-user-name-message'>{userNameSuccessDataMessage}</p>
      </div>
      <DefaultButton
        onClick={changeUserName}
        disabled={disabledChangeUserName()}
      >
        {t("SettingsPage.ChangeUsername.Change")}
      </DefaultButton>
    </div>
  )
}
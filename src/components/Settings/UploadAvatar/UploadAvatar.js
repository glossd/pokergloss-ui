import React, {useState} from "react";
import dynamic from 'next/dynamic';
import {uploadAvatar} from "../../../backend/profile";

import {onUpdateUserInfo} from "../../../auth/Firebase";
import {currentUserAvatarUrl} from "../../../auth";
import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";

const Avatar = dynamic(import ("react-avatar-edit"),{ssr:false});

export default function UploadAvatar() {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [disabledUpload, setDisabledUpload] = React.useState(true);
  const [avatarUpdate, setAvatarUpdate] = React.useState(0);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDisabledUpload(true);
  };

  const onBeforeFileLoad = (elem) => {
    if(elem.target.files[0].size > (1 << 18)){
      alert("File is TOO BIG! MAX size 256Kb");
      elem.target.value = "";
    }
  }

  const upload = () => {
    uploadAvatar(dataURLtoFile(preview))
      .then((data) => {
        console.info("Avatar available at ", data.photoURL)
        handleClose()
        // I put here setTimeout to give it some time to reload avatar
        onUpdateUserInfo().then(() => setTimeout(() => setAvatarUpdate(avatarUpdate+1), 500))
      })
      .catch(backendError)
  }

  return (
    <div>
      <div key={avatarUpdate} className='upload-avatar-container'>
        <div>
          <img
            className='default-avatar'
            src={currentUserAvatarUrl()}
            height={"200"}
            width={"200"}
            alt='face'
          />
        </div>

        <div className='upload-avatar-info'>
          <h5>{t("SettingsPage.UploadAvatar.UploadNewAvatar")}</h5>
          <DefaultButton onClick={handleClickOpen}>
            {t("SettingsPage.UploadAvatar.ChooseFile")}
          </DefaultButton>
          <h5>{t("SettingsPage.UploadAvatar.MaximumFileSize")}</h5>
        </div>

        <DefaultDialog
          open={open}
          onClose={handleClose}
          title={'Position and size your new avatar'}
          action={{text: 'Set new picture', onClick: upload, disabled: disabledUpload}}
          cancel={{text: 'Cancel', onClick: handleClose}}
        >

          <div className='avatar'>
            <Avatar
              width={250}
              height={200}
              imageWidth={200}
              lineWidth={10}
              label={'Click here to choose file...'}
              labelStyle={{
                color: 'white',
                cursor: 'pointer',
              }}
              backgroundColor={'#070f14'}
              onCrop={(p) => {
                setPreview(p)
                setDisabledUpload(false)
              }}
              onClose={() => setPreview(null)}
              onBeforeFileLoad={onBeforeFileLoad}
              src={null}
            />
            {
              preview &&
              <div className='avatar-preview'>
                <img className='avatar-img-preview' src={preview} alt="Preview"/>
              </div>
            }
          </div>
        </DefaultDialog>
      </div>
    </div>
  )
}

// https://stackoverflow.com/a/38935990/10160865
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
}

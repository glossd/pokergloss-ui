import {avatarUrlOrDefault} from "../../auth";
import React from "react";

export function nameWithPicture(username, picture, className) {
  return (
    <>
      <img className={className} src={avatarUrlOrDefault(picture)} alt="avatar"/>
      &nbsp; &nbsp; &nbsp;
      {username}
    </>
  )
}
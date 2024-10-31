import {DefaultApi} from "@pokergloss/profile-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("profile"));

export async function signUpUser(username, email, password, ip = "", lang="",  os="", browser = "") {
  const res = await api.signup(browser, email, ip, lang, os, password, username)
  return res.data
}

export async function uploadAvatar(file) {
  const r =  await api.uploadAvatar(file)
  return r.data
}

export async function changeUserUsername(username) {
  const r = await api.changeUserUsername({username})
  return r.data
}

export async function checkUsername(username) {
  const r = await api.checkUsernameV2(username)
  return r.data
}

export async function getProfile(username) {
  const r = await api.getProfile(username)
  return r.data
}

export async function searchProfiles(username) {
  const r = await api.searchProfiles(username)
  return r.data
}

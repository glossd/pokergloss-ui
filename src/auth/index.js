import {getCurrentUser} from "./Firebase";
import firebase from "./Firebase";


// Redirects to SigninPage with user is not authenticated
export function checkUserAuthenticated(history) {
  getCurrentUser().then(user => {
    if (user == null) {
      router.push("/signin")
    }
  })
}

export const defaultAvatarUrl = "https://storage.googleapis.com/pokerblow/lobby/default-logo-avatar.png"

export function currentUserAvatarUrl() {
  let currentUser = firebase.auth().currentUser;
  if (currentUser) {
    if (currentUser.photoURL) {
      return currentUser.photoURL
    } else {
      return defaultAvatarUrl
    }

  }
  return defaultAvatarUrl
}

export function avatarUrlOrDefault(pictureUrl) {
  if (pictureUrl) {
    return pictureUrl
  }
  return defaultAvatarUrl
}
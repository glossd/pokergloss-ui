import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyD8vmB6kGZOLHZBNYwd3JLDKd388-DpN9Q',
  authDomain: 'pokerblow.firebaseapp.com',
  projectId: "pokerblow",
  databaseURL: "https://pokerblow.firebaseio.com",
  storageBucket: "pokerblow.appspot.com",
  messagingSenderId: "382776642412",
  appId: "1:382776642412:web:18ad5dc1371399f9140149"
};

// https://stackoverflow.com/a/48686803/10160865
if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}


export default firebase

export function getIdToken(user) {
  return user.getIdToken()
}

// https://github.com/firebase/firebase-js-sdk/issues/462#issuecomment-425479634
let userLoaded = false;
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    if (userLoaded) {
      resolve(firebase.auth().currentUser);
    }
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      userLoaded = true;
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

export async function getCurrentUserToken() {
  const user = await getCurrentUser()
  if (user) {
    const token = await user.getIdToken()
    return token
  }
  return ""
}

export function onUpdateUserInfo() {
  forceRefreshIdToken()
  return reloadUser()
}

export function reloadUser() {
  return getCurrentUser().then(user => {
    if (user) {
      user.reload()
    }
  })
}

export async function forceRefreshIdToken() {
  const user = await getCurrentUser()
  if (user) {
    try {
      await user.getIdToken(true)
    } catch(e) {
      console.error(e)
    }
  }
}

// WARNING!!! DO NOT USE IT!!! User is not always returned
export function currentUser() {
  const user = firebase.auth().currentUser
  if (!user) {
    return {}
  }
  return user
}

// https://firebase.google.com/docs/auth/admin/create-custom-tokens#sign_in_using_custom_tokens_on_clients
export function signInWithCustomToken(customToken) {
  return firebase.auth().signInWithCustomToken(customToken)
}

export function logout() {
  return firebase.auth().signOut().then(function () {
    console.info('Sign-out successful')
  }, function (error) {
    console.error(error)
  })
}

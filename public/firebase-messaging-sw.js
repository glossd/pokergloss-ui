importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD8vmB6kGZOLHZBNYwd3JLDKd388-DpN9Q",
  authDomain: "pokerblow.firebaseapp.com",
  databaseURL: "https://pokerblow.firebaseio.com",
  projectId: "pokerblow",
  storageBucket: "pokerblow.appspot.com",
  messagingSenderId: "382776642412",
  appId: "1:382776642412:web:18ad5dc1371399f9140149"
});

const messaging = firebase.messaging();
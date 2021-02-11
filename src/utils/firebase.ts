import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDwaD_yUWvMXFZWT_KToMliXoia1RB5ypY",
  authDomain: "silence-91f88.firebaseapp.com",
  projectId: "silence-91f88",
  storageBucket: "silence-91f88.appspot.com",
  messagingSenderId: "689975750751",
  appId: "1:689975750751:web:df9c524255df46f2172bea",
  databaseURL:
    "https://silence-91f88-default-rtdb.europe-west1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const db = firebase.database();

export const auth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

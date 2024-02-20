import firebase from "firebase/app";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMftdpsJMFqTnwalWnT2PdWeUZcfTDi6A",
  authDomain: "tetiana-914c4.firebaseapp.com",
  projectId: "tetiana-914c4",
  storageBucket: "tetiana-914c4.appspot.com",
  messagingSenderId: "527587577962",
  appId: "1:527587577962:web:014c85df6dc697a588ba13",
  measurementId: "G-93Z2RYYRS3",
};

export let APP = null;

export function appConfig() {
  APP = !firebase.apps.length ? initializeApp(firebaseConfig) : firebase.app();
}

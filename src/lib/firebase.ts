
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "karanchavdaportfolio",
  appId: "1:334969417944:web:69c2a044a618443debe7ad",
  storageBucket: "karanchavdaportfolio.firebasestorage.app",
  apiKey: "AIzaSyD4zxvgucvjiTqoK5DwhRwo47tSX_0edo0",
  authDomain: "karanchavdaportfolio.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "334969417944"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

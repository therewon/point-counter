// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN0_MbsVSQDXLUnqwb7-mmt8zJGCfhB3o",
  authDomain: "point-counter-4d4d7.firebaseapp.com",
  projectId: "point-counter-4d4d7",
  storageBucket: "point-counter-4d4d7.firebasestorage.app",
  messagingSenderId: "204807044055",
  appId: "1:204807044055:web:04c32d47a75b06badea992",
  measurementId: "G-2PGLR2KGLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

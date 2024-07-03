// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC0yXi3so7XJwM9Obyw0lw39u2NpxQ6ytw",
  authDomain: "infoflow-8a919.firebaseapp.com",
  projectId: "infoflow-8a919",
  storageBucket: "infoflow-8a919.appspot.com",
  messagingSenderId: "342877536498",
  appId: "1:342877536498:web:6f4e0c64dc054e1cc1506b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

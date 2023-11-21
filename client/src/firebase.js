// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-b9941.firebaseapp.com",
  projectId: "mern-auth-b9941",
  storageBucket: "mern-auth-b9941.appspot.com",
  messagingSenderId: "185062656042",
  appId: "1:185062656042:web:350ae5b13da59b00979b53"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
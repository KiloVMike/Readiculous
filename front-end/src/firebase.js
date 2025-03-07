// Import the functions you need from the SDKs you need // Import firebase app to initialize

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";



const firebaseConfig = {
  apiKey:"AIzaSyC-Q-4waBBAC76vEbNoYDxwDHCiiC_GMZc",
  authDomain: "mern-homesage.firebaseapp.com",
  projectId: "mern-homesage",
  storageBucket: "mern-homesage.appspot.com",
  messagingSenderId: "492325563218",
  appId: "1:492325563218:web:ec533638f6f54d0627a88b"
};


export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
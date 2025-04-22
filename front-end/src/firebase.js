// firebase.js

// Import the Firebase SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-Q-4waBBAC76vEbNoYDxwDHCiiC_GMZc",
  authDomain: "mern-homesage.firebaseapp.com",
  projectId: "mern-homesage",
  storageBucket: "mern-homesage.appspot.com",
  messagingSenderId: "492325563218",
  appId: "1:492325563218:web:ec533638f6f54d0627a88b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for use in components
export { app, auth, provider, signInWithPopup };

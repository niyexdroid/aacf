// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrUUEGvN_RShjJvv75kseENYf82F19mH0",
  authDomain: "aacf-1434c.firebaseapp.com",
  projectId: "aacf-1434c",
  storageBucket: "aacf-1434c.firebasestorage.app",
  messagingSenderId: "854288563982",
  appId: "1:854288563982:web:be0d70fd8fb22f94d8615f",
  measurementId: "G-HWBV1VM9TZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

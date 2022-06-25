// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbZAkoGqDxIEB4TPkfTB7yh8_nFHGbhvM",
  authDomain: "sldemands.firebaseapp.com",
  projectId: "sldemands",
  storageBucket: "sldemands.appspot.com",
  messagingSenderId: "789008593458",
  appId: "1:789008593458:web:78099118d1cb7d21edc22b",
  measurementId: "G-QXWQDZBSCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
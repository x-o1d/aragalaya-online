// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";


// SECURITY:
// these apiKey is now available in the public domain.
// the firebase apiKey does not need to be considered a secret
// https://firebase.google.com/docs/projects/api-keys#apply-restrictions
// TODO:
// apply restrictions on the apiKey usage.
// the only risk scenario is that the auth interface 
// can be bruteforced to find if an email is a user.
// specially since google has ddos protection this is not a real threat
// and is not urgent.
let firebaseConfig = {
  apiKey: "AIzaSyCFIhFlai5zMvE-9eeSiaL4ZiGiSvpg0yY",
  authDomain: "aragalaya-online.firebaseapp.com",
  projectId: "aragalaya-online",
  storageBucket: "aragalaya-online.appspot.com",
  messagingSenderId: "15533282305",
  appId: "1:15533282305:web:a807d2c4f789c046a71c00"
};

if(import.meta.env.MODE == 'prod') {
    firebaseConfig = {
        apiKey: "AIzaSyAIFR7IVXYjG_8lyPyfHxsdx_kaRz4z3SM",
        authDomain: "aragalaya-online-prod.firebaseapp.com",
        projectId: "aragalaya-online-prod",
        storageBucket: "aragalaya-online-prod.appspot.com",
        messagingSenderId: "730227179317",
        appId: "1:730227179317:web:59771460444f98ae52567c"
    };
}

export const app = initializeApp(firebaseConfig);

if(import.meta.env.MODE == 'localhost') {
    connectFirestoreEmulator(getFirestore(app), 'localhost', 8081);
    connectAuthEmulator(getAuth(app), "http://localhost:9099");
    connectFunctionsEmulator(getFunctions(app, 'asia-south1'), "localhost", 5001);
    connectStorageEmulator(getStorage(app), "localhost", 9199);
}


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnocD_6fP1shC4qzSkoq7ADbunXxn81xI",
  authDomain: "underdog-ticketing.firebaseapp.com",
  projectId: "underdog-ticketing",
  storageBucket: "underdog-ticketing.appspot.com",
  messagingSenderId: "702204251903",
  appId: "1:702204251903:web:b3b692ba8681c13d34c6ca"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };

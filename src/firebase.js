import Firebase from "firebase";
import "firebase/firestore";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyA83Jt5piFOMegSqUn7eM4Ed0zMpTgQ120",
  authDomain: "hotshots-9001.firebaseapp.com",
  databaseURL: "https://hotshots-9001.firebaseio.com",
  projectId: "hotshots-9001",
  storageBucket: "hotshots-9001.appspot.com",
  messagingSenderId: "502037355037"
};

const firebaseApp = Firebase.initializeApp(config);

export const db = firebaseApp.firestore();

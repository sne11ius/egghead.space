import Firebase from "firebase";
import "firebase/firestore";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAtbFdQlWu-oWtN3Y7vpslY0oht5SbCSf8",
  authDomain: "egghead.space",
  databaseURL: "https://eggheadspace-e99d7.firebaseio.com",
  projectId: "eggheadspace-e99d7",
  storageBucket: "eggheadspace-e99d7.appspot.com",
  messagingSenderId: "774445755419"
};

const firebaseApp = Firebase.initializeApp(config);

export const db = firebaseApp.firestore();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMY24P0AyA2MRKbF50sAx8-XFvV73Lo-A",
  authDomain: "yim-todo.firebaseapp.com",
  databaseURL: "https://yim-todo-default-rtdb.firebaseio.com",
  projectId: "yim-todo",
  storageBucket: "yim-todo.appspot.com",
  messagingSenderId: "119980217875",
  appId: "1:119980217875:web:a69e3112bdb3f0f05451e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
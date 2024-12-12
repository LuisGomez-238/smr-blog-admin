// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlhG6W8UtnXeJbps8VJTnD4eyrGOGEKSw",
  authDomain: "smr-blogs.firebaseapp.com",
  projectId: "smr-blogs",
  storageBucket: "smr-blogs.firebasestorage.app",
  messagingSenderId: "186714534502",
  appId: "1:186714534502:web:e4ba39c886173c6f1db3a7",
  measurementId: "G-L08YF8292T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

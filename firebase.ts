// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8TGUrfdmazQVSIp8oA4XGN8KgW8qrsT8",
  authDomain: "ultimate-pomodoro-af6f5.firebaseapp.com",
  projectId: "ultimate-pomodoro-af6f5",
  storageBucket: "ultimate-pomodoro-af6f5.appspot.com",
  messagingSenderId: "425097549585",
  appId: "1:425097549585:web:53b91d2630feb6a8d51eb0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
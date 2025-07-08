// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "taskmanager-99.firebaseapp.com",
  projectId: "taskmanager-99",
  storageBucket: "taskmanager-99.appspot.com",
  messagingSenderId: "845199104968",
  appId: "1:845199104968:web:cd3bc9b421736532c7fefd",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

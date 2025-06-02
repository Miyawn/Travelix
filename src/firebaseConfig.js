// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Ganti dengan konfigurasi dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB1HkQFrEItvIG2lU1Tl1WXmGYrkp8Cxfc",
  authDomain: "travelix-pabw.firebaseapp.com",
  projectId: "travelix-pabw",
  storageBucket: "travelix-pabw.firebasestorage.app",
  messagingSenderId: "5323362905",
  appId: "1:5323362905:web:88f41a02579b6dff9d5748",
  measurementId: "G-7GVDDTX53S"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

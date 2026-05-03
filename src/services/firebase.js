import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tempelkan config yang kamu copy dari Firebase Console tadi di sini
const firebaseConfig = {
  apiKey: "AIzaSyAm5_tJLvgNH6zPbDTxRlWRQQiYFWDBWa8",
  authDomain: "toko-aciak.firebaseapp.com",
  projectId: "toko-aciak",
  storageBucket: "toko-aciak.firebasestorage.app",
  messagingSenderId: "598107338029",
  appId: "1:598107338029:web:f4390a6347870842d5cfa4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

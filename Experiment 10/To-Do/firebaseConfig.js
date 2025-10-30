// firebaseConfig.js

// Import the Firebase modules you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRyVjKF6gANIP7_Dnax9hFy3aUDoNdSL4",
  authDomain: "to-do-3d1fa.firebaseapp.com",
  projectId: "to-do-3d1fa",
  storageBucket: "to-do-3d1fa.firebasestorage.app",
  messagingSenderId: "123402036053",
  appId: "1:123402036053:web:58f4045cdbae4e75c405dc",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore and export it
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNXXRnw6rIgvp-pre1IyMDscuEg0ivyfU",
  authDomain: "bookworm-909dd.firebaseapp.com",
  projectId: "bookworm-909dd",
  storageBucket: "bookworm-909dd.firebasestorage.app",
  messagingSenderId: "836852758822",
  appId: "1:836852758822:web:fe620ba1b9edb1547ba9e7",
  measurementId: "G-H93EDECBRC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

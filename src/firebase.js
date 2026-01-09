import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-QFGWSG9RrI0AtBBo0zXYvXb2Xfe0Xmw",
  authDomain: "personalfinancemanagemen-b0599.firebaseapp.com",
  databaseURL: "https://personalfinancemanagemen-b0599-default-rtdb.firebaseio.com",
  projectId: "personalfinancemanagemen-b0599",
  storageBucket: "personalfinancemanagemen-b0599.firebasestorage.app",
  messagingSenderId: "1039009383717",
  appId: "1:1039009383717:web:14ada6876a5c4af0fe06cc",
  measurementId: "G-J23FS79VXG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };



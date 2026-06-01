import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjn-i6n5nJ54hXU1Cc3IyN4FYVjuh82LY",
  authDomain: "networktrafficpredictor.firebaseapp.com",
  projectId: "networktrafficpredictor",
  storageBucket: "networktrafficpredictor.firebasestorage.app",
  messagingSenderId: "1024949160182",
  appId: "1:1024949160182:web:78d241f8a62ee9b01dc4d7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };


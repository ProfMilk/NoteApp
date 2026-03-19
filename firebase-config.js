import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6dZ2cRy_vUST_yuppl_cgzNmtd3M10rU",
    authDomain: "noteapp-bff52.firebaseapp.com",
    projectId: "noteapp-bff52",
    storageBucket: "noteapp-bff52.firebasestorage.app",
    messagingSenderId: "66054508892",
    appId: "1:66054508892:web:4f2b74128b1e5b39797199",
    measurementId: "G-NV8WPKGJS0"
  };
  
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
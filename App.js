import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const inputField = document.getElementById('userInput');
const button = document.getElementById('submitBtn');
const outputDisplay = document.getElementById('output');

// 2. Add an event listener to the button
button.addEventListener('click', function() {
  
    const value = inputField.value;                
  
    outputDisplay.innerText = value;
});



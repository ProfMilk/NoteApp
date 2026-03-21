import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const input = document.getElementById("userInput");
const button = document.getElementById("submitBtn");
const list = document.getElementById("todoList");

const modifyInput = document.querySelector(".LeftContainer .textbox");
const modifyBtn = document.getElementById("modifyBtn");
const dropdown = document.querySelector(".numdropdown");

const welcomeText = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

// 👤 Auth check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;

        const username = user.email.split("@")[0];
        welcomeText.textContent = "Logged in as: " + username;

        loadTasks();
    } else {
        window.location.href = "Login.html";
    }
});

// 🚪 Logout
logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "Login.html";
    });
});

// 🔢 Update numbering
function updateNumbers() {
    const items = list.children;

    for (let i = 0; i < items.length; i++) {
        const textSpan = items[i].querySelector("span");
        const originalText = textSpan.getAttribute("data-text");
        textSpan.textContent = `${i + 1}. ${originalText}`;
    }
}

// 📥 Load tasks
async function loadTasks() {
    list.innerHTML = "";

    const querySnapshot = await getDocs(
        collection(db, "users", currentUser.uid, "tasks")
    );

    querySnapshot.forEach((docSnap) => {
        createTaskElement(docSnap.id, docSnap.data().text);
    });

    updateNumbers();
}


function createTaskElement(id, value) {
    const li = document.createElement("li");
    li.setAttribute("data-id", id); // 🔥 store Firestore ID

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const text = document.createElement("span");
    text.setAttribute("data-text", value);
    text.style.textDecoration = "underline";
    text.textContent = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.style.backgroundColor = "#CBB682";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.marginTop = "7px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.borderRadius = "5px";

   
    deleteBtn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "users", currentUser.uid, "tasks", id));
        li.remove();
        updateNumbers();
    });

    
    checkbox.addEventListener("change", () => {
        text.style.textDecoration = checkbox.checked
            ? "line-through"
            : "underline";
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    list.appendChild(li);
}


button.addEventListener("click", async () => {
    const value = input.value.trim();
    if (value === "") return;

    if (list.children.length >= 10) {
        alert("Maximum of 10 tasks reached!");
        return;
    }

    const docRef = await addDoc(
        collection(db, "users", currentUser.uid, "tasks"),
        { text: value }
    );

    createTaskElement(docRef.id, value);

    input.value = "";
    updateNumbers();
});


modifyBtn.addEventListener("click", async () => {
    const index = dropdown.value - 1;
    const newValue = modifyInput.value.trim();

    if (newValue === "") return;

    const item = list.children[index];

    if (!item) {
        alert("Task does not exist!");
        return;
    }

    // 🔥 Get Firestore ID from element
    const taskId = item.getAttribute("data-id");

    // 🔥 Update Firestore
    await updateDoc(
        doc(db, "users", currentUser.uid, "tasks", taskId),
        { text: newValue }
    );

    // 🔥 Update UI
    const textSpan = item.querySelector("span");
    textSpan.setAttribute("data-text", newValue);

    updateNumbers();

    modifyInput.value = "";
});
// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase settings
const appSettings = {
    databaseURL: "https://bit-agenda-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Firebase initialization
const app = initializeApp(appSettings);
const db = getDatabase(app);
const dbRef = ref(db, "quests");

// DOM elements
const inputField = document.querySelector('input');
const addBtn = document.querySelector('.add-button');
const listElement = document.querySelector('.list');

// Function for fetching items from Firebase
onValue(dbRef, (snapshot) => {
    listElement.innerHTML = "";
    if (snapshot.exists()) {
        const items = Object.entries(snapshot.val());
        items.forEach(([key, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" class="list-item" data-key="${key}">${value}</a>`;
            listElement.appendChild(li);
        });
    } else {
        listElement.innerHTML = '<li>There are no quests...</li>';
    }
});

// Event listener for add button
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const item = inputField.value.trim();
    if (item !== "") {
        push(dbRef, item).then(() => {
            inputField.value = "";
            inputField.focus();
        });
    }
});

// Event listener for pressing Enter in input field
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputField.value.trim() !== '') {
        addBtn.click();
    }
});

// Event listener for list items to delete them safely
listElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('list-item')) {
        removeItem(e.target);
    }
});

// Function for safely removing an item from the list and Firebase
function removeItem(target) {
    const itemKey = target.getAttribute('data-key');
    if (!itemKey) return;
    target.classList.add('fade-out');
    setTimeout(() => {
        remove(ref(db, `quests/${itemKey}`));
    }, 800);
}

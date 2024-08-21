//debug
import { g3__ } from '../debug.js';
// Import the necessary Firebase modules
import firebaseConfig from '../firebaseConfig.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// -----------------------------------------------------------
// login function
function login() {
    const email = prompt('Please enter your email');
    const password = prompt('Please enter your password');
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            g3__.log('User signed in:', userCredential.user);
        })
        .catch((error) => {
            g3__.error('Error signing in:', error);
        });
}
document.getElementById('login').addEventListener('click', () => login());

// -----------------------------------------------------------
// logout function
function logout() {
    signOut(auth)
        .then(() => {
            g3__.log('User signed out.');
        })
        .catch((error) => {
            g3__.error('Error signing out:', error);
        });
}

document.getElementById('logout').addEventListener('click', () => logout());

// -----------------------------------------------------------
// Add event listener to the form submit
document.getElementById('edit').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const questionTextarea = document.getElementById('questionTextarea').value;
    const user = auth.currentUser;

    if (user) {
        try {
            // Convert the textarea content to a JSON object
            const arrayData = JSON.parse(questionTextarea); // No need to add extra brackets here

            // Save the array to Firebase
            set(ref(database, 'questionsArray'), arrayData)
                .then(() => {
                    g3__.log('Array saved successfully.');
                })
                .catch((error) => {
                    g3__.error('Error saving array:', error);
                });
        } catch (error) {
            g3__.error('Error parsing JSON:', error);
            alert('Invalid JSON format. Please check your input.');
        }
    } else {
        alert('Musíte být přihlášeni, abyste mohli publikovat.');
    }
});

// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Function to fetch and log the questionsArray
        g3__.log(auth.currentUser);
        const questionsRef = ref(database, 'questionsArray');

        get(questionsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const questionsArray = snapshot.val();
                    document.getElementById('questionTextarea').value = JSON.stringify(questionsArray, null, 2);
                } else {
                    g3__.log('No data available');
                }
            })
            .catch((error) => {
                g3__.error('Error fetching questionsArray:', error);
            });
    } else {
        g3__.log(auth.currentUser);
    }
});

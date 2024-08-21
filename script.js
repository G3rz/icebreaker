//debug
import { g3__ } from './debug.js';
// Import the necessary Firebase modules
import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
    getDatabase,
    ref,
    get,
    child,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('newQuestion').addEventListener('click', () => {
    get(child(ref(database), 'questionsArray'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const questionsArray = snapshot.val();

                // List of array
                g3__.log('Array of objects:', questionsArray);

                // Retrieve the existing data from sessionStorage
                let viewedNumbers = sessionStorage.getItem('viewNumbers');
                let viewedNumbersArray = viewedNumbers
                    ? viewedNumbers.split(',').map(Number)
                    : [];

                // Create an array of all possible numbers
                const allNumbers = Array.from(
                    { length: questionsArray.length },
                    (_, i) => i
                );

                // Filter out the numbers that have already been viewed
                const availableNumbers = allNumbers.filter(
                    (number) => !viewedNumbersArray.includes(number)
                );

                if (availableNumbers.length > 0) {
                    // Randomly select a number from the available numbers
                    const randomNumber =
                        availableNumbers[
                            Math.floor(Math.random() * availableNumbers.length)
                        ];
                    const randomQuestion = questionsArray[randomNumber];
                    g3__.log('Random question:', randomQuestion);

                    document.getElementById(
                        'questionDisplay'
                    ).innerHTML = `<p><small>${randomNumber}</small>${randomQuestion}</p>`;

                    // Add the selected number to the list of viewed numbers
                    viewedNumbersArray.push(randomNumber);

                    // Store the updated list back into sessionStorage
                    sessionStorage.setItem(
                        'viewNumbers',
                        viewedNumbersArray.join(',')
                    );
                } else {
                    // All questions have been viewed, handle accordingly
                    g3__.log('All questions have been viewed');
                    document.getElementById(
                        'questionDisplay'
                    ).innerHTML = `<p>All questions have been already viewed</p>`;
                }

                // -----------------------------------------------------------
            } else {
                g3__.log('No data available');
            }
        })
        .catch((error) => {
            g3__.error('Error getting data:', error);
        });
});

function resetApp() {
    sessionStorage.removeItem('viewNumbers');
    g3__.log('Session storage for viewNumbers has been cleared.');
    window.location = '/icebreaker';
}
window.resetApp = resetApp;

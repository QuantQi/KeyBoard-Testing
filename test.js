let currentTestKey = null;  // The note the user is supposed to press
let instructionElement = document.getElementById('instruction');
let timerElement = document.getElementById('timer');  // Timer element to display time
let testDuration = 5 * 60 * 1000;  // Total test duration (5 minutes in milliseconds)
let startTime = null;
let testInterval = null;

// Function to randomly select a key and give instruction
function setNextInstruction() {
    // Remove the highlight from the current correct key if it exists
    keys.forEach(key => key.classList.remove('correct'));

    // Randomly select the next key to press
    const randomIndex = Math.floor(Math.random() * keys.length);
    currentTestKey = keys[randomIndex].dataset.note;

    // Update the instruction text to show the next note number
    instructionElement.textContent = `Press the key: ${currentTestKey}`;

    // Highlight the correct key with yellow
    const correctKey = keys.find(key => key.dataset.note == currentTestKey);
    if (correctKey) {
        correctKey.classList.add('correct');
    }
}

// Function to check if the user pressed the correct key
function checkKeyPress(note) {
    const correctKey = keys.find(key => key.dataset.note == currentTestKey);
    console.log('checkKeyPress function called with note:', note);
    if (note == currentTestKey) {
        // If the correct key is pressed, remove highlight and move to the next instruction
        correctKey.classList.remove('correct');
        setNextInstruction();  // Call the next instruction
    } else {
        // If the wrong key is pressed, flash it red
        const wrongKey = keys.find(key => key.dataset.note == note);
        if (wrongKey) {
            wrongKey.classList.add('wrong');
            setTimeout(() => {
                wrongKey.classList.remove('wrong');
            }, 500);
        }
    }
}

// Function to start the test timer
function startTestTimer() {
    startTime = Date.now();
    testInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let remainingTime = testDuration - elapsedTime;

        if (remainingTime <= 0) {
            clearInterval(testInterval);
            instructionElement.textContent = "Test Completed!";
            keys.forEach(key => key.classList.remove('correct'));
            timerElement.textContent = "00:00";
            return;
        }

        let minutes = Math.floor(remainingTime / (60 * 1000));
        let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        // Display the remaining time in MM:SS format
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Start the first test and the timer
setNextInstruction();
startTestTimer();
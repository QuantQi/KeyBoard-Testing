let currentMelody = null;  // The melody being played
let currentBeatIndex = 0;  // The index of the current beat in the melody
let rightHandDisplay = document.getElementById('right-hand-display');  // Right hand notes display element
let leftHandDisplay = document.getElementById('left-hand-display');  // Left hand notes display element
let timerElement = document.getElementById('timer');
let testDuration = 5 * 60 * 1000;  // 5 minutes in milliseconds
let startTime = null;
let testInterval = null;
let selectedMelodyType = 'bothHands';  // Default selection for melody type
let currentMelodyIndex = 0;  // Track the index of the current melody


// Add event listener to update melody type based on radio button selection
document.querySelectorAll('input[name="melodyType"]').forEach(radio => {
    radio.addEventListener('change', function () {
        selectedMelodyType = this.value;
        currentMelodyIndex = 0;  // Reset to the first melody of the selected type
        setNextMelody();
    });
});

// Function to randomly select a melody and reset the beat index

// Function to set the next melody
function setNextMelody() {
    const melodyList = melodies[selectedMelodyType];  // Choose based on melody type (left, right, both)

    // Ensure the currentMelodyIndex doesn't exceed the melody list length
    if (currentMelodyIndex >= melodyList.length) {
        currentMelodyIndex = 0;  // Loop back to the first melody if we reach the end
    }

    currentMelody = melodyList[currentMelodyIndex];  // Select the next melody
    currentBeatIndex = 0;  // Reset the beat index

    console.log(`New melody selected: ${currentMelody.name}`);

    // Display the name of the selected melody
    const melodyNameElement = document.getElementById('melody-name');
    melodyNameElement.innerText = `Melody: ${currentMelody.name}`;

    // Display the entire melody
    displayMelody(currentMelody);

    // Start the first beat
    setNextBeat();
}

// Add event listener to the Next Melody button
document.getElementById('next-melody-button').addEventListener('click', () => {
    currentMelodyIndex++;  // Move to the next melody
    setNextMelody();  // Select and play the next melody
});

function displayMelody(melody) {
    rightHandDisplay.innerHTML = '';  // Clear previous right-hand notes
    leftHandDisplay.innerHTML = '';   // Clear previous left-hand notes

    melody.beats.forEach((beat, index) => {
        const { rightHand, leftHand } = beat;

        // Right-hand notes
        if (rightHand !== undefined) {
            const rightHandElement = document.createElement('span');
            rightHandElement.classList.add('note', 'right');  // Add 'right' class
            rightHandElement.textContent = rightHand !== null ? noteNames[rightHand] : 'Rest';
            rightHandElement.id = `right-hand-${index}`;  // Ensure unique ID for right hand
            rightHandDisplay.appendChild(rightHandElement);
        }

        // Left-hand notes
        if (leftHand !== undefined) {
            const leftHandElement = document.createElement('span');
            leftHandElement.classList.add('note', 'left');  // Add 'left' class
            leftHandElement.textContent = leftHand !== null ? noteNames[leftHand] : 'Rest';
            leftHandElement.id = `left-hand-${index}`;  // Ensure unique ID for left hand
            leftHandDisplay.appendChild(leftHandElement);  // Append to left-hand display
        }
    });
}

function setNextBeat() {
    if (currentBeatIndex < currentMelody.beats.length) {
        const { rightHand, leftHand } = currentMelody.beats[currentBeatIndex];
        console.log(`Setting beat: Right hand: ${rightHand}, Left hand: ${leftHand}`);

        // Highlight right-hand notes
        highlightCurrentNote('right', currentBeatIndex);

        // Highlight left-hand notes
        highlightCurrentNote('left', currentBeatIndex);

        currentBeatIndex++;  // Move to the next beat after highlighting
        console.log(`Next beat index: ${currentBeatIndex}`);
    } else {
        // Melody has finished, so select the next melody
        console.log('Melody completed. Moving to next melody.');
        currentMelodyIndex++;  // Move to the next melody
        setNextMelody();  // Select and play the next melody
    }
}

// Function to highlight the current note in the display
function highlightCurrentNote(hand, index) {
    console.log(`Highlighting ${hand} hand note at index ${index}`);

    // Clear all highlights for the specific hand (right or left)
    document.querySelectorAll(`.note.${hand}.highlight`).forEach(note => {
        note.classList.remove('highlight');
    });

    // Find and highlight the note for the specified hand (right or left)
    const currentNote = document.getElementById(`${hand}-hand-${index}`);
    if (currentNote) {
        currentNote.classList.add('highlight');
      //  console.log(`${hand} hand note at index ${index} is highlighted`);
    } else {
     //   console.log(`No note found for ${hand} hand at index ${index}`);
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
            rightHandDisplay.textContent = "Test Completed!";
            leftHandDisplay.textContent = "";
            timerElement.textContent = "00:00";
            return;
        }

        let minutes = Math.floor(remainingTime / (60 * 1000));
        let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Start the first melody and the timer
window.onload = function() {
    setNextMelody();
    startTestTimer();
};
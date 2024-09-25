const keyPattern = 'wbwwbwbwwbwb';  // Key pattern to repeat for octaves
const totalKeys = 88;  // Total number of keys for the keyboard
const keyboardElement = document.getElementById('keyboard');

let whiteKeyCount = 0;
const keys = [];  // Array to store all the key elements

// Function to create a key element
function createKey(type, note) {
    const key = document.createElement('div');
    key.classList.add('key', type);
    key.dataset.note = note;  // Assign the MIDI note number to the key

    if (type === 'white') {
        key.style.left = `${whiteKeyCount * 60}px`;
        whiteKeyCount++;
    }

    // Add click event to play sound and animate the key
    key.addEventListener('click', () => {
        playSound(note);
        animateKeyPress(key);
    });

    keys.push(key);  // Store key in array for later access
    return key;
}

// Generate 88 keys based on the pattern
for (let i = 0, k = 0; i < totalKeys; i++) {
    const noteType = keyPattern[k % keyPattern.length];
    const note = i + 21;  // Assign MIDI note numbers (starting from 21 for an 88-key keyboard)

    if (noteType === 'w') {
        const whiteKey = createKey('white', note);
        keyboardElement.appendChild(whiteKey);
    } else if (noteType === 'b') {
        const blackKey = createKey('black', note);
        blackKey.style.left = `${(whiteKeyCount - 1) * 62 + 55}px`;  // Position black key in between white keys
        keyboardElement.appendChild(blackKey);
    }
    k++;
}

// Function to animate key press
function animateKeyPress(key) {
    key.classList.add('pressed');
}

// Function to release key (remove pressed state)
function releaseKey(key) {
    key.classList.remove('pressed');
}

// Function to play sound
function playSound(note) {
    const audio = new Audio(`sounds/note-${note}.mp3`);  // Assuming sounds are stored in a 'sounds' folder
    audio.play();
}

// MIDI Input Setup
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    alert("Web MIDI API is not supported in your browser.");
}

function onMIDISuccess(midiAccess) {
    const inputs = midiAccess.inputs;
    inputs.forEach(input => {
        input.onmidimessage = handleMIDIMessage;
    });
}

function onMIDIFailure() {
    console.error('Could not access your MIDI devices.');
}

// Handle incoming MIDI messages
function handleMIDIMessage(event) {
    const [type, note, velocity] = event.data;

    if (type === 144 && velocity > 0) {  // Note On
        const key = keys.find(k => k.dataset.note == note);
        if (key) {
            playSound(note);
            animateKeyPress(key);
        }
    } else if (type === 128 || (type === 144 && velocity === 0)) {  // Note Off
        const key = keys.find(k => k.dataset.note == note);
        if (key) {
            releaseKey(key);  // Release the key when note is released
        }
    }
}
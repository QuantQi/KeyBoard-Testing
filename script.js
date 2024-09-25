const keyPattern = 'wbwwbwbwwbwb';  // Key pattern to repeat for octaves
const totalKeys = 88;  // Total number of keys for the keyboard
const keyboardElement = document.getElementById('keyboard');
const midiInfoElement = document.getElementById('midi-info');  // New element to display MIDI player info

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

    // Add click event to check key press (without sound)
    key.addEventListener('click', () => {
        animateKeyPress(key);
        checkKeyPress(note);  // Ensure this is called on manual clicks
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

// MIDI Input Setup
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    alert("Web MIDI API is not supported in your browser.");
}

function onMIDISuccess(midiAccess) {
    console.log('MIDI Access successful');
    const inputs = midiAccess.inputs;

    if (inputs.size > 0) {
        let midiPlayerInfo = 'Connected MIDI devices: ';
        inputs.forEach(input => {
            console.log(`Connecting to: ${input.name}`);
            midiPlayerInfo += `${input.name} `;
            input.onmidimessage = handleMIDIMessage;  // Ensure MIDI messages are being handled
        });
        midiInfoElement.textContent = midiPlayerInfo;  // Update the information in the footer
    } else {
        midiInfoElement.textContent = 'No MIDI player connected';
    }
}

function onMIDIFailure() {
    console.error('Could not access your MIDI devices.');
    midiInfoElement.textContent = 'Failed to connect to MIDI player';
}

// Handle incoming MIDI messages
function handleMIDIMessage(event) {
    const [type, note, velocity] = event.data;
    console.log(`MIDI message received: type=${type}, note=${note}, velocity=${velocity}`);

    if (type === 144 && velocity > 0) {  // Note On
        const key = keys.find(k => k.dataset.note == note);
        if (key) {
            animateKeyPress(key);  // Animate the correct key press
            checkKeyPress(note);   // Call checkKeyPress when the key is pressed via MIDI
        }
    } else if (type === 128 || (type === 144 && velocity === 0)) {  // Note Off
        const key = keys.find(k => k.dataset.note == note);
        if (key) {
            releaseKey(key);  // Release the key when note is released
        }
    }
}

// Function to flash wrong key red
function flashWrongKey(note) {
    const wrongKey = keys.find(k => k.dataset.note == note);
    if (wrongKey) {
        wrongKey.classList.add('wrong');
        setTimeout(() => {
            wrongKey.classList.remove('wrong');
        }, 500);  // Flash red for 500ms
    }
}
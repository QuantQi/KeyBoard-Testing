# MIDI Keyboard Test Application

This application is a web-based MIDI keyboard that allows users to interact with a virtual piano keyboard. The app can also connect to a physical MIDI keyboard and provides a timed test where users are instructed to press specific keys. The test runs for 5 minutes and gives feedback on whether the correct key was pressed, highlighting errors and guiding the user to the next key.

## Features

- **Virtual Keyboard**: A fully interactive 88-key piano keyboard.
- **MIDI Keyboard Support**: Connect a physical MIDI keyboard to the app. Key presses are synchronized between the MIDI keyboard and the virtual keyboard.
- **Timed Test**: A 5-minute test that instructs the user to press specific keys. Each time the correct key is pressed, a new instruction is given.
- **Real-Time Feedback**: If the wrong key is pressed, it flashes red, and the correct key remains highlighted in yellow.
- **Responsive Design**: Works on both desktop and mobile browsers.

### Prerequisites

- **Web Browser**: A browser that supports the Web MIDI API (e.g., Google Chrome).
- **MIDI Keyboard**: (Optional) To take full advantage of the app, a MIDI keyboard can be connected.

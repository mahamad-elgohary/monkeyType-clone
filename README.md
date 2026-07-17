# Typing Speed Test

A Monkeytype-inspired typing speed test built with vanilla JavaScript, HTML, and CSS.

This project was created primarily to practice JavaScript logic, event handling, state management, DOM manipulation, and implementing a real-time typing engine from scratch without external frameworks.

you can try it here : https://monkey-type-clone-3xj95pvjn-mohamadelgoharydev.vercel.app/
 
---

## Features

### Typing Test Modes

* 30 second mode
* 60 second mode
* 120 second mode

The selected mode is persisted in Local Storage and automatically restored after refreshing the page.

---

## Dynamic Text Generation

Random text is generated using:

```javascript
random-words
```

The amount of generated words depends on the selected duration:

| Duration | Words Generated |
| -------- | --------------- |
| 30s      | 80              |
| 60s      | 160             |
| 120s     | 280             |

---

## Real-Time Character Tracking

Every character is rendered as an individual span element.

Example:

```html
<span data-typed="">h</span>
<span data-typed="">e</span>
<span data-typed="">l</span>
<span data-typed="">l</span>
<span data-typed="">o</span>
```

This allows:

* Character-by-character styling
* Correct character highlighting
* Wrong character highlighting
* Cursor movement
* Error recovery
* Overtyping visualization

---

## Typing Engine

The typing engine tracks:

### Current Character

```javascript
currChar
```

Represents the current character position in the entire text.

---

### Current Word

```javascript
currWord
```

Represents the current active word.

---

### Character Position Inside Current Word

```javascript
currCharInCurrWord
```

Tracks the current character position inside the active word.

---

## Character States

Each character can exist in one of several states:

### Untyped

Default state.

```css
opacity: 0.5;
```

---

### Current Character

Represents the typing cursor position.

```css
.current
```

---

### Correct Character

```css
.correct
```

Applied when the typed character matches the target character.

---

### Wrong Character

```css
.wrong
```

Applied when the typed character does not match the target character.

---

## Word Validation

A word is considered correct only when:

* Every typed character matches
* No errors occurred inside the word
* Space is pressed after completing the word

Then:

```javascript
WPM++
```

---

## Incomplete Word Detection

If space is pressed before completing the current word:

Example:

Target:

```text
programming
```

Typed:

```text
prog
```

Then pressing space:

* Marks the word incorrect
* Moves to the next word
* Prevents WPM increment

Similar to Monkeytype behavior.

---

## Error Tracking System

All mistakes are stored in:

```javascript
errorsStack
```

Structure:

```javascript
{
    currWord,
    currChar
}
```

This enables:

* Tracking incorrect characters
* Detecting recovered mistakes
* Recalculating word correctness

---

## Overtyping Support

Example:

Target:

```text
hello
```

Typed:

```text
helloooo
```

Extra characters are rendered dynamically.

Example:

```html
<span class="wrong">o</span>
```

Inserted directly into the text stream.

---

## Overtyping Recovery

Backspace can:

* Remove dynamically inserted overtyped spans
* Restore cursor position
* Restore word state

Behavior mirrors Monkeytype.

---

## Backspace Engine

The project implements a custom backspace engine.

Supports:

### Correct Character Deletion

Removes:

```css
.correct
```

state.

---

### Wrong Character Deletion

Removes:

```css
.wrong
```

state.

---

### Error Recovery

When the final incorrect character in a word is removed:

```javascript
currentWordNoErrors = true
```

The word becomes eligible for WPM counting again.

---

### Previous Word Navigation

Allowed only when:

* Previous word was incorrect

Blocked when:

* Previous word was completed correctly

Matching Monkeytype's default behavior.

---

## Cursor System

A custom cursor system is implemented using:

```css
.current
```

instead of relying on the browser textarea caret.

The cursor is moved manually through the character spans.

---

## Statistics

### WPM

Words completed correctly.

---

### CPM

Correct characters typed.

---

### Errors

Total incorrect keystrokes.

---

### Accuracy

Calculated using:

```javascript
correctChars / (correctChars + errors)
```

Displayed as a percentage.

---

## Best WPM

Highest achieved WPM.

Stored in:

```javascript
localStorage
```

---

## Tests Completed

Tracks total completed typing sessions.

Stored in:

```javascript
localStorage
```

---

## Local Storage Persistence

Saved automatically:

```javascript
{
    BestWpmCard,
    testCompletedCard,
    activeTime
}
```

Persists between browser sessions.

---

## Restart Functionality

Resets:

* Timer
* Cursor
* Errors
* WPM
* CPM
* Accuracy
* Current word state
* Current character state

Without reloading the page.

---

## New Text Functionality

Generates a completely new random text while preserving:

* User settings
* Saved statistics

---

## Architecture Overview

Main state variables:

```javascript
currChar
currWord
currCharInCurrWord
currentWordNoErrors
errorsStack
checkedWordsArr
typedWords
thisWordWritten
```

The application behaves similarly to a finite state machine where every keystroke transitions the typing session into a new state.

---

## Technologies Used

### HTML5

Structure and layout.

### CSS3

Monkeytype-inspired dark theme.

### JavaScript (ES6 Modules)

Core typing engine.

### Local Storage API

Statistics persistence.

### random-words

Random text generation.

---

## What This Project Demonstrates

This project demonstrates understanding of:

* DOM manipulation
* Event-driven programming
* State management
* Finite-state-machine thinking
* Input handling
* Dynamic rendering
* Local Storage persistence
* Custom cursor implementation
* Error recovery systems
* Real-time UI updates
* Software architecture without frameworks

---

## Future Improvements

Potential upgrades:

* Live progress bar
* Character-by-character animations
* Word wrapping virtualization
* Performance optimizations
* Theme switching
* Leaderboard system
* User profiles
* Heatmap statistics
* Typing history
* Detailed analytics
* Ghost replay mode
* Multiplayer races
* Custom text mode
* Punctuation mode
* Quote mode
* Zen mode
* Responsive mobile layout
* Unit testing
* State-machine refactor
* TypeScript migration

---

## Project Goal

The primary goal of this project was not merely to clone Monkeytype's appearance, but to build the complete typing engine manually and gain experience designing complex interactive state-driven systems using only vanilla JavaScript.

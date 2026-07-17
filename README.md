# Typing Speed Test

A Monkeytype-inspired typing speed test built with vanilla JavaScript, HTML, and CSS.

This project was created primarily to practice JavaScript logic, event handling, state management, DOM manipulation, and implementing a real-time typing engine from scratch without external frameworks.

**link:**
https://typo-speed-qmfiviso7-mohamadelgoharydev.vercel.app/
---

# Features

## Typing Test Modes

The application supports multiple test durations:

* 30 Second Mode
* 60 Second Mode
* 120 Second Mode

The selected duration is persisted in Local Storage and automatically restored after page refresh.

---

## Typing Options

Inspired by Monkeytype, the project supports additional typing challenges.

### Symbols Mode

Random punctuation characters are injected into generated words.

Examples:

```text
hello!
world?
(test
value]
```

Supported symbols:

```text
. , ! ? ; : & ( ) [ ] { } + = |
```

---

### Numbers Mode

Random digits are injected into generated words.

Examples:

```text
hello7
3world
test9
```

---

### Symbols + Numbers Mode

Both systems can be enabled simultaneously.

Examples:

```text
hello!
world8
(test
5typing
```

Typing options are persisted and automatically restored on page reload.

---

# Dynamic Text Generation

Random text is generated using:

```javascript
random-words
```

Generated words are then optionally modified according to the active typing modes.

### Standard Mode

```text
hello world typing speed test
```

### Symbols Mode

```text
hello!
world?
(test
```

### Numbers Mode

```text
hello7
3world
test9
```

### Symbols + Numbers Mode

```text
hello!
world8
(test
```

The amount of generated text depends on the selected duration:

| Duration | Words Generated |
| -------- | --------------- |
| 30s      | 80              |
| 60s      | 160             |
| 120s     | 280             |

---

# Real-Time Character Rendering

Every character is rendered as an individual span element.

Example:

```html
<span data-typed="">h</span>
<span data-typed="">e</span>
<span data-typed="">l</span>
<span data-typed="">l</span>
<span data-typed="">o</span>
```

This enables:

* Character-level validation
* Character highlighting
* Custom cursor positioning
* Error recovery
* Overtyping support
* Dynamic character insertion

---

# Typing Engine

The typing engine tracks the current typing state through several variables.

### Current Character

```javascript
currChar
```

Represents the current position inside the rendered text.

---

### Current Word

```javascript
currWord
```

Represents the active word being typed.

---

### Character Position Inside Current Word

```javascript
currCharInCurrWord
```

Tracks the character index inside the active word.

---

# Character States

Each character can exist in several visual states.

### Untyped

Default state.

---

### Current Character

```css
.current
```

Represents the custom cursor location.

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

# Word Validation

A word is considered correct only when:

* Every character matches
* No unresolved mistakes exist
* Space is pressed after completing the word

The engine maintains correctness state through:

```javascript
currentWordNoErrors
```

---

# Incomplete Word Detection

Example:

Target:

```text
programming
```

Typed:

```text
prog
```

Pressing space:

* Marks the word as incorrect
* Advances to the next word
* Prevents the word from being considered fully correct

This behavior closely mirrors Monkeytype.

---

# Error Tracking System

All typing mistakes are stored inside:

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

This allows:

* Error recovery detection
* Word correctness recalculation
* Backspace restoration logic
* Tracking unresolved mistakes

---

# Overtyping Support

Example:

Target:

```text
hello
```

Typed:

```text
helloooo
```

Extra characters are dynamically inserted into the text stream.

Example:

```html
<span class="wrong">o</span>
```

This allows realistic overtyping behavior similar to Monkeytype.

---

# Overtyping Recovery

Backspace can:

* Remove dynamically inserted characters
* Restore cursor position
* Restore word state
* Recalculate word correctness

---

# Backspace Engine

The application implements a custom backspace system.

Supports:

### Correct Character Removal

Removes:

```css
.correct
```

state.

---

### Wrong Character Removal

Removes:

```css
.wrong
```

state.

---

### Error Recovery

When the final mistake in a word is removed:

```javascript
currentWordNoErrors = true
```

The word becomes eligible to be considered correct again.

---

### Previous Word Navigation

Allowed only when:

* The previous word was not finalized as correct

Blocked when:

* The previous word was completed correctly

This behavior closely follows Monkeytype.

---

# Custom Cursor System

The application uses a manually controlled cursor.

Instead of relying on the browser caret:

```css
.current
```

is moved between character spans.

This provides full control over cursor rendering and behavior.

---

# Statistics

## WPM

Calculated dynamically using the standard formula:

```javascript
(cpm / 5) / elapsedMinutes
```

---

## CPM

Correct characters typed.

---

## Errors

Total incorrect keystrokes.

---

## Accuracy

Calculated using:

```javascript
(netWpm / wpm) * 100
```

Displayed as a percentage.

---

# Best WPM

Highest achieved WPM.

Stored in:

```javascript
localStorage
```

---

# Tests Completed

Tracks total completed typing sessions.

Stored in:

```javascript
localStorage
```

---

# Local Storage Persistence

The application automatically persists:

```javascript
{
  BestWpmCard,
  testCompletedCard,
  activeTime,
  symbolsActive,
  numbersActive
}
```

Persisted data includes:

* Best WPM
* Total completed tests
* Selected duration
* Symbols mode state
* Numbers mode state

All settings are restored automatically on reload.

---

# Restart Functionality

Resets:

* Timer
* Cursor
* WPM
* CPM
* Accuracy
* Errors
* Current word state
* Current character state
* Error tracking

Without refreshing the page.

---

# New Text Functionality

Generates a completely new text while preserving:

* User settings
* Statistics
* Active typing options

---

# Input Filtering

Only supported typing characters are processed.

Implemented using:

```javascript
englishRegex
```

This prevents unsupported keyboard input from interfering with the typing engine.

---

# Architecture Overview

Core state variables:

```javascript
currChar
currWord
currCharInCurrWord

currentWordNoErrors

errorsStack
checkedWordsArr

typedWords
thisWordWritten

symbolsActive
numbersActive

timeVal
finished
starting
```

The application behaves similarly to a finite state machine where every keystroke transitions the system into a new state.

The typing engine maintains synchronization between:

* Rendered text
* Cursor position
* Word validation
* Error tracking
* Statistics
* Overtyping state

---

# Technologies Used

## HTML5

Application structure.

---

## CSS3

Monkeytype-inspired UI and styling.

---

## JavaScript (ES6 Modules)

Core typing engine and state management.

---

## Local Storage API

Persistence layer for settings and statistics.

---

## random-words

Random text generation.

---

# What This Project Demonstrates

This project demonstrates understanding of:

* DOM manipulation
* Event-driven programming
* State management
* Real-time input processing
* Finite-state-machine thinking
* Dynamic rendering
* Local Storage persistence
* Custom cursor implementation
* Error recovery systems
* Advanced keyboard event handling
* Overtyping logic
* Dynamic content generation
* Persistent user preferences
* Complex backspace navigation
* Software architecture without frameworks

---

# Future Improvements

Potential upgrades:

* Configurable symbol frequency
* Configurable number frequency
* Custom word lists
* Quote mode
* Zen mode
* Theme switching
* Typing heatmaps
* Detailed analytics
* Ghost replay mode
* Multiplayer races
* Progress visualization
* Performance optimization for large texts
* Mobile-first responsiveness
* Unit testing
* TypeScript migration
* State-machine refactor

---

# Project Goal

The primary goal of this project was not merely to clone Monkeytype's appearance, but to build the complete typing engine manually and gain practical experience designing complex interactive state-driven systems using only vanilla JavaScript.

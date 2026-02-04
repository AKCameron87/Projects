# CLAUDE.md - AI Assistant Guide

This document provides essential context for AI assistants working with this repository.

## Project Overview

This repository contains **two JavaScript applications**:

1. **Pokemon Deck Battle** (Primary) - A web-based card game where players compare Pokemon stats
2. **To-Do List CLI** (Secondary) - A Node.js command-line task manager

## Codebase Structure

```
/home/user/Projects/
├── index.html          # Pokemon game - HTML entry point
├── script.js           # Pokemon game - Main game logic (224 lines)
├── style.css           # Pokemon game - Styling with CSS variables
├── main.js             # To-Do CLI - Entry point
├── Menu.js             # To-Do CLI - Interactive menu system
├── Task.js             # To-Do CLI - Task class definition
├── TaskManager.js      # To-Do CLI - Task management logic
├── settings.json       # To-Do CLI - Persistent settings
├── .gitignore          # Git ignore rules (IntelliJ defaults)
└── To Do List.iml      # IntelliJ IDEA module config
```

## Technologies

### Pokemon Deck Battle (Frontend)
- **HTML5/CSS3/Vanilla JavaScript** - No frameworks
- **PokéAPI v2** - External API (`https://pokeapi.co/api/v2/pokemon/`)
- **CSS Variables** - Theme management (light/dark mode)
- **CSS Animations** - flipIn keyframes for card reveals

### To-Do List CLI (Node.js)
- **Node.js** - Runtime environment
- **readline** - Native module for CLI input
- **fs** - File system for settings persistence
- **CommonJS modules** - `require()`/`module.exports` pattern

## Running the Applications

### Pokemon Deck Battle
Open `index.html` in a web browser - no build step required.

### To-Do List CLI
```bash
node main.js
```

## Key Code Patterns

### Async/Await with Error Handling
```javascript
// script.js pattern for API calls
async function dealAndBattle() {
    try {
        const [playerDeck, computerDeck] = await Promise.all([
            buildRandomDeck(DECK_SIZE),
            buildRandomDeck(DECK_SIZE),
        ]);
        // ...
    } catch (error) {
        console.error(error);
        showMessage("Something went wrong", true);
    }
}
```

### CSS Variables for Theming
```css
:root {
    --bg-color: #f3f3f3;
    --text-color: #222;
}
body.dark-mode {
    --bg-color: #1e1e1e;
    --text-color: #f5f5f5;
}
```

### Class-Based OOP (To-Do List)
```javascript
// Task.js - Simple data class
class Task {
    constructor(text) {
        this.text = text;
        this.completed = false;
    }
}
```

## Important Constants

| Constant | Location | Value | Description |
|----------|----------|-------|-------------|
| `DECK_SIZE` | script.js:14 | 5 | Cards per deck |
| `MAX_POKEMON_ID` | script.js:16 | 898 | Max Pokemon ID for random selection |

## API Reference

### PokéAPI Usage
- **Endpoint**: `https://pokeapi.co/api/v2/pokemon/{id}`
- **Rate Limiting**: None for reasonable use
- **Response**: JSON with `name`, `id`, `sprites`, `types`, `stats`

### Pokemon Stats Available
- `hp`, `attack`, `defense`, `special-attack`, `special-defense`, `speed`

## Development Notes

### No Build System
Both applications run directly without compilation or bundling.

### No Testing Framework
Tests are not currently configured.

### IDE Configuration
IntelliJ IDEA project files are present but not required for development.

## Common Tasks

### Adding a New Battle Stat
1. Add `<option>` in `index.html` (#stat-select)
2. Ensure stat name matches PokéAPI stat names

### Modifying Theme Colors
Edit CSS variables in `style.css` under `:root` and `body.dark-mode`

### Adding To-Do List Features
1. Add method to `TaskManager.js`
2. Add menu option in `Menu.js` (printMenu + handleChoice)

## Code Quality Conventions

- **Section Comments**: Code is organized with `// ---------- SECTION ----------` headers
- **DOM Selection**: All DOM elements cached at file top
- **Error Messages**: Use `showMessage(text, isError)` helper
- **Async Operations**: Always use async/await with try/catch
- **CSS Classes**: kebab-case naming (e.g., `pokemon-card`, `dark-mode`)
- **JavaScript**: camelCase for variables and functions

## Known Issues / Notes

- `Menu.js:80`: Minor typo "Congrulations" instead of "Congratulations"
- `Menu.js:85-97`: Menu option numbers in `handleChoice` don't match `printMenu` (5 = remove, 6 = settings, 7 = exit, but menu shows 5 = settings, 6 = exit)
- Settings file `settings.json` is created in working directory

## Git Workflow

- **Branch naming**: Feature branches should follow `claude/{feature}-{session-id}` pattern
- **Commits**: Descriptive messages summarizing changes
- Repository is clean with no uncommitted changes

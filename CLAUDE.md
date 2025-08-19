# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is for building a modern, single-player web-based Boggle game. Boggle is a word game where players find words in a grid of letters by connecting adjacent letters.

## Development Commands

### Setup & Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── core/             # Main game components
│   │   ├── GameBoard/    # The Boggle grid display
│   │   ├── WordList/     # List of found words
│   │   ├── ScoreDisplay/ # Score and timer display
│   │   ├── GameControls/ # Game control buttons and settings
│   │   ├── SettingsPanel/# Game preferences UI
│   │   └── Statistics/   # Player statistics and leaderboard
│   │
│   └── utility/          # Reusable utility components
│       ├── Timer/        # Timer functionality
│       ├── DictionarySelector/ # Language/dictionary selection
│       ├── BoardSizeSelector/  # Board size controls
│       └── ThemeProvider/      # Theme management
│
├── context/              # React Context for state management
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
└── data/                 # Data files (dictionaries, etc.)
```

## Architecture Guidelines

The application follows a modern React architecture using TypeScript, React Context API for state management, and Tailwind CSS for styling.

### Core Components

1. **Game Board**: 
   - Board generation with random letters
   - Grid representation and rendering
   - User interaction for letter selection
   - Path visualization

2. **Word Validation**:
   - Dictionary integration (multiple languages)
   - Path validation (ensuring letters are adjacent)
   - Word scoring system
   - Duplicate word prevention

3. **Game Logic**:
   - Game state management (ready, active, paused, finished)
   - Scoring system with bonuses for rare letters
   - Timer with pause functionality
   - Difficulty levels affecting letter distribution

4. **User Interface**:
   - Modern, sleek design using Tailwind CSS
   - Visual highlighting of word paths
   - Animations for scoring and word finding
   - Accessibility features including color blind support

### Data Flow

1. Game state is managed via React Context
2. User interactions trigger actions that update the game state
3. Components react to state changes and update accordingly
4. Game statistics and preferences are persisted to localStorage

## TypeScript Types

The application uses TypeScript for type safety. The main types are:

- `GameState`: Core game state including board, words, score, and settings
- `Letter`: Individual letters on the board with position and state
- `Word`: Found words with path and scoring information
- `UserPreferences`: User settings including theme and accessibility options
- `GameStatistics`: Statistics tracking for player performance

## Testing

Jest and React Testing Library are used for testing components and utility functions.

## Accessibility

The game includes multiple accessibility features:
- Color blind mode
- Keyboard navigation
- Adjustable text sizes
- High contrast mode
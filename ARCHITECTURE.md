# Boggle Game Architecture

## Technology Stack
- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **Storage**: LocalStorage for game statistics and leaderboard
- **Build Tool**: Vite
- **Package Manager**: npm
- **Testing**: Jest + React Testing Library

## Component Structure

### Core Components

#### App
- Main container component
- Manages routing between game screens
- Handles global app state

#### GameBoard
- Renders the Boggle board grid
- Manages board interaction (letter selection)
- Tracks current word path
- Handles visual highlighting of selected letters

#### WordList
- Displays found words
- Shows word scores
- Categorizes words by length/rarity

#### ScoreDisplay
- Shows current score
- Displays score animations
- Renders timer

#### GameControls
- Contains game control buttons (start/pause/reset)
- Houses difficulty selection
- Manages board size options
- Controls timer settings

#### SettingsPanel
- Manages language selection
- Controls sound settings
- Handles accessibility options
- Adjusts visual preferences

#### Statistics
- Displays game statistics
- Shows historical performance
- Presents leaderboards

### Utility Components

#### Timer
- Handles countdown
- Supports pause/resume
- Manages time display

#### DictionarySelector
- Manages dictionary selection
- Handles custom word lists

#### BoardSizeSelector
- Controls board dimensions
- Adjusts difficulty based on size

#### ThemeProvider
- Manages light/dark mode
- Handles accessibility color schemes

## Data Architecture

### Game State
```typescript
interface GameState {
  board: Letter[][];
  selectedPath: Position[];
  currentWord: string;
  foundWords: Word[];
  score: number;
  timeRemaining: number;
  gameStatus: 'ready' | 'active' | 'paused' | 'finished';
  difficulty: 'easy' | 'medium' | 'hard';
  boardSize: number;
  language: string;
  dictionary: Set<string>;
}

interface Letter {
  char: string;
  position: Position;
  isSelected: boolean;
  isValidInPath: boolean;
}

interface Position {
  row: number;
  col: number;
}

interface Word {
  text: string;
  path: Position[];
  score: number;
  timestamp: number;
}
```

### User Preferences
```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  soundEffects: boolean;
  musicVolume: number;
  effectsVolume: number;
  colorBlindMode: boolean;
  textSize: 'small' | 'medium' | 'large';
  defaultTimerDuration: number;
  defaultBoardSize: number;
  defaultDifficulty: 'easy' | 'medium' | 'hard';
  defaultLanguage: string;
}
```

### Statistics
```typescript
interface GameStatistics {
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  averageScore: number;
  longestWord: string;
  mostWordsInGame: number;
  mostValuableWord: {
    word: string;
    score: number;
  };
  recentGames: GameSummary[];
}

interface GameSummary {
  id: string;
  date: string;
  score: number;
  wordCount: number;
  duration: number;
  boardSize: number;
  difficulty: string;
}
```

### Leaderboard
```typescript
interface LeaderboardEntry {
  id: string;
  date: string;
  score: number;
  wordCount: number;
  longestWord: string;
  boardSize: number;
  difficulty: string;
}
```

## Core Logic Modules

### Board Generator
- Creates random board configurations
- Adjusts letter distribution based on difficulty
- Ensures board has sufficient potential words
- Handles different board sizes

### Word Validator
- Validates word against selected dictionary
- Checks word path for adjacency
- Verifies word hasn't been found before
- Determines if word is valid in the context of current game settings

### Scoring System
- Calculates points based on word length
- Applies bonuses for rare letters
- Tracks and updates score

### Dictionary Manager
- Loads dictionary based on selected language
- Handles custom word lists
- Provides word validation interface
- Manages multiple dictionaries in memory

### Game Timer
- Handles countdown logic
- Manages pause/resume functionality
- Triggers game-end events

### Statistics Tracker
- Records game performance
- Calculates aggregate statistics
- Manages leaderboard entries
- Persists data to localStorage

## Data Flow

1. User starts game:
   - Board generator creates new game board
   - Timer initializes with selected duration
   - Game state transitions to 'active'

2. User selects letters:
   - Letter selection updates current path
   - Path validation ensures proper adjacency
   - Current word is built from selected letters

3. User submits word:
   - Word validator checks against dictionary
   - If valid, word is added to found words
   - Score is updated
   - Visual/audio feedback is provided

4. Time expires:
   - Game state transitions to 'finished'
   - Final score is calculated
   - Statistics are updated
   - Leaderboard is updated if score qualifies

## Storage Strategy

- **Game State**: Maintained in React Context
- **User Preferences**: Stored in localStorage
- **Game Statistics**: Stored in localStorage
- **Dictionaries**: Loaded dynamically based on language selection, cached in memory
- **Leaderboard**: Stored in localStorage

## Accessibility Considerations

- High contrast mode for visually impaired users
- Keyboard navigation for all game functions
- Screen reader compatible elements
- Resizable text and UI elements
- Color blind friendly color schemes
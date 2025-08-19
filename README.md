# Boggle Game

A modern, single-player web-based Boggle game built with React, TypeScript, and Tailwind CSS.

## Features

- **Gameplay**: Classic Boggle gameplay with a modern interface
- **Board Customization**: Choose between 4x4, 5x5, or 6x6 board sizes
- **Difficulty Levels**: Easy, Medium, or Hard settings that affect letter distribution
- **Multiple Dictionaries**: English, Spanish, French, and themed word lists
- **Statistics Tracking**: Track your scores, longest words, and game history
- **Leaderboard**: Compete against yourself with a local leaderboard
- **Accessibility Features**: Color blind mode, keyboard navigation, text size options
- **Dark/Light Mode**: Full theme support for light and dark preferences

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

Run tests:
```bash
npm test
```

Watch mode for tests:
```bash
npm run test:watch
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

## Built With

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Jest](https://jestjs.io/) - Testing framework

## License

This project is open source and available under the [MIT License](LICENSE).
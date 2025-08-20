import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { useStatistics } from "./StatisticsContext";
import type { ReactNode } from "react";

// Define game types directly in this file
interface Position {
  row: number;
  col: number;
}

interface Letter {
  char: string;
  position: Position;
  isSelected: boolean;
  isValidInPath: boolean;
}

type Difficulty = "easy" | "medium" | "hard";

// Define remaining game types
export interface Word {
  text: string;
  path: Position[];
  score: number;
  timestamp: number;
}

export type GameStatus = "ready" | "active" | "paused" | "finished";

export interface GameState {
  board: Letter[][];
  selectedPath: Position[];
  currentWord: string;
  foundWords: Word[];
  score: number;
  timeRemaining: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  boardSize: number;
  language: string;
  dictionary: Set<string>;
}

export interface GameSettings {
  difficulty: Difficulty;
  boardSize: number;
  timerDuration: number;
  language: string;
}

// Game Actions
export type GameAction =
  | {
      type: "START_GAME";
      payload: {
        boardSize: number;
        difficulty: Difficulty;
        timerDuration: number;
      };
    }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "SELECT_LETTER"; payload: { position: Position } }
  | { type: "DESELECT_LETTER"; payload: { position: Position } }
  | { type: "CLEAR_SELECTION" }
  | { type: "SUBMIT_WORD" }
  | { type: "SET_TIMER"; payload: { timeRemaining: number } }
  | { type: "TICK_TIMER" }
  | { type: "SET_LANGUAGE"; payload: { language: string } }
  | { type: "SET_DICTIONARY"; payload: { dictionary: Set<string> } }
  | { type: "SET_DIFFICULTY"; payload: { difficulty: Difficulty } }
  | { type: "SET_BOARD_SIZE"; payload: { boardSize: number } }
  | { type: "SET_BOARD"; payload: { board: Letter[][] } };

// Helper function to check if two positions are adjacent
function isAdjacentToLastSelected(
  position: Position,
  lastSelected: Position
): boolean {
  const rowDiff = Math.abs(position.row - lastSelected.row);
  const colDiff = Math.abs(position.col - lastSelected.col);

  // Adjacent if both row and column differences are 0 or 1 (but not both 0)
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
}

// Calculate word score based on word length
function calculateWordScore(word: string): number {
  const length = word.length;
  let score = 0;

  // Basic scoring based on Boggle rules
  if (length <= 2) score = 0;
  else if (length === 3) score = 1;
  else if (length === 4) score = 1;
  else if (length === 5) score = 2;
  else if (length === 6) score = 3;
  else if (length === 7) score = 5;
  else score = 11; // 8 or more letters

  // Add bonus for rare letters
  if (word.includes("q")) score += 2;
  if (word.includes("z")) score += 3;
  if (word.includes("x")) score += 2;
  if (word.includes("j")) score += 2;
  if (word.includes("k")) score += 1;

  return score;
}

// Game Reducer
/* eslint-disable react-refresh/only-export-components */
export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "SET_BOARD":
      return {
        ...state,
        board: action.payload.board,
      };
    case "START_GAME":
      return {
        ...state,
        gameStatus: "active",
        timeRemaining: action.payload.timerDuration,
        boardSize: action.payload.boardSize,
        difficulty: action.payload.difficulty,
        score: 0,
        foundWords: [],
        selectedPath: [],
        currentWord: "",
      };

    case "PAUSE_GAME":
      if (state.gameStatus !== "active") return state;
      return {
        ...state,
        gameStatus: "paused",
      };

    case "RESUME_GAME":
      if (state.gameStatus !== "paused") return state;
      return {
        ...state,
        gameStatus: "active",
      };

    case "END_GAME":
      return {
        ...state,
        gameStatus: "finished",
      };

    case "RESET_GAME":
      return {
        ...state,
        gameStatus: "ready",
        score: 0,
        foundWords: [],
        selectedPath: [],
        currentWord: "",
      };

    case "SELECT_LETTER": {
      if (state.gameStatus !== "active") return state;

      const { position } = action.payload;
      const { row, col } = position;

      // Check if the letter is already selected
      if (
        state.selectedPath.some((pos) => pos.row === row && pos.col === col)
      ) {
        return state;
      }

      // Check if this is the first letter or if it's adjacent to the last selected letter
      const isFirstLetter = state.selectedPath.length === 0;
      const isAdjacent = isFirstLetter
        ? true
        : isAdjacentToLastSelected(
            position,
            state.selectedPath[state.selectedPath.length - 1]
          );

      if (!isAdjacent) return state;

      // Get the letter at this position
      let letter = state.board[row][col].char;

      // Handle special case for Q/q/Qu (add 'u' for scoring and display purposes)
      if (letter.toLowerCase() === "q" || letter === "Qu") {
        letter = "QU";
      }

      // Update board to mark this letter as selected
      const updatedBoard = state.board.map((rowLetters, r) =>
        rowLetters.map((letterObj, c) => {
          if (r === row && c === col) {
            return {
              ...letterObj,
              isSelected: true,
              isValidInPath: true,
            };
          }
          return letterObj;
        })
      );

      return {
        ...state,
        board: updatedBoard,
        selectedPath: [...state.selectedPath, position],
        currentWord: state.currentWord + letter,
      };
    }

    case "DESELECT_LETTER": {
      if (state.gameStatus !== "active") return state;

      const { position } = action.payload;
      const { row, col } = position;

      // Get the last selected letter's index
      const lastIndex = state.selectedPath.length - 1;
      if (lastIndex < 0) return state;

      // Only allow deselection of the last letter in the path
      const lastSelected = state.selectedPath[lastIndex];
      if (lastSelected.row !== row || lastSelected.col !== col) {
        return state;
      }

      // Update the board to mark just this letter as not selected
      const updatedBoard = state.board.map((rowLetters, r) =>
        rowLetters.map((letterObj, c) => {
          if (r === row && c === col) {
            return {
              ...letterObj,
              isSelected: false,
              isValidInPath: false,
            };
          }
          return letterObj;
        })
      );
      
      // Get the letter that is being deselected
      const deselectedChar = state.board[row][col].char;
      
      // Special case for Qu tile (which counts as 2 characters in the word)
      const charLength = (deselectedChar.toLowerCase() === 'q' || deselectedChar === 'Qu' || deselectedChar === 'QU') ? 2 : 1;
      
      // Remove the last character(s) from the current word
      const newWord = state.currentWord.slice(0, -charLength);
      
      return {
        ...state,
        board: updatedBoard,
        selectedPath: state.selectedPath.slice(0, -1),
        currentWord: newWord,
      };
    }

    case "CLEAR_SELECTION": {
      // Reset all board cells to not selected
      const updatedBoard = state.board.map((rowLetters) =>
        rowLetters.map((letterObj) => ({
          ...letterObj,
          isSelected: false,
          isValidInPath: false,
        }))
      );

      return {
        ...state,
        board: updatedBoard,
        selectedPath: [],
        currentWord: "",
      };
    }

    case "SUBMIT_WORD": {
      if (state.gameStatus !== "active" || state.currentWord.length < 3) {
        return {
          ...state,
          selectedPath: [],
          currentWord: "",
        };
      }

      const word = state.currentWord.toLowerCase();

      // Check if the word is valid using our validator
      if (!isValidWord(word)) {
        console.log(`Word not in dictionary: ${word}`);
        return {
          ...state,
          selectedPath: [],
          currentWord: "",
          board: state.board.map((rowLetters) =>
            rowLetters.map((letterObj) => ({
              ...letterObj,
              isSelected: false,
              isValidInPath: false,
            }))
          ),
        };
      }

      // Check if the word has already been found
      if (state.foundWords.some((w) => w.text === word)) {
        console.log(`Word already found: ${word}`);
        return {
          ...state,
          selectedPath: [],
          currentWord: "",
          board: state.board.map((rowLetters) =>
            rowLetters.map((letterObj) => ({
              ...letterObj,
              isSelected: false,
              isValidInPath: false,
            }))
          ),
        };
      }

      // Calculate word score
      const score = calculateWordScore(word);

      // Add word to found words
      const newWord: Word = {
        text: word,
        path: [...state.selectedPath],
        score,
        timestamp: Date.now(),
      };

      return {
        ...state,
        score: state.score + score,
        foundWords: [...state.foundWords, newWord],
        selectedPath: [],
        currentWord: "",
        board: state.board.map((rowLetters) =>
          rowLetters.map((letterObj) => ({
            ...letterObj,
            isSelected: false,
            isValidInPath: false,
          }))
        ),
      };
    }

    case "SET_TIMER":
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining,
      };

    case "TICK_TIMER": {
      if (state.gameStatus !== "active" || state.timeRemaining <= 0) {
        if (state.timeRemaining <= 0 && state.gameStatus === "active") {
          return {
            ...state,
            timeRemaining: 0,
            gameStatus: "finished",
          };
        }
        return state;
      }

      const newTime = state.timeRemaining - 1;
      const newStatus = newTime <= 0 ? "finished" : state.gameStatus;

      return {
        ...state,
        timeRemaining: newTime,
        gameStatus: newStatus,
      };
    }

    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload.language,
      };

    case "SET_DICTIONARY":
      return {
        ...state,
        dictionary: action.payload.dictionary,
      };

    case "SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.payload.difficulty,
      };

    case "SET_BOARD_SIZE":
      return {
        ...state,
        boardSize: action.payload.boardSize,
      };

    default:
      return state;
  }
};

// Import the dictionary validator
import { loadDictionary, isValidWord } from "../utils/dictionaryValidator";

// Import the generateBoard function
import { generateBoard } from "../utils/boardGenerator";

// Helper function to calculate game statistics
const calculateGameStatistics = (state: GameState) => {
  let longestWord = '';
  let mostValuableWord = { word: '', score: 0 };
  
  // Calculate the longest word and most valuable word
  state.foundWords.forEach(word => {
    // Update longest word if this word is longer
    if (word.text.length > longestWord.length) {
      longestWord = word.text;
    }
    
    // Update most valuable word if this word has a higher score
    if (word.score > mostValuableWord.score) {
      mostValuableWord = {
        word: word.text,
        score: word.score
      };
    }
  });
  
  // Get the initial timer duration - need to figure out from context or use a default
  // For now we'll use a default of 3 minutes (180 seconds) if we can't determine it
  const initialDuration = 180; // Default to 3 minutes
  const elapsedSeconds = initialDuration - state.timeRemaining;
  
  return {
    score: state.score,
    wordCount: state.foundWords.length,
    longestWord,
    mostValuableWord,
    duration: elapsedSeconds, // Now using elapsed time instead of remaining time
    boardSize: state.boardSize,
    difficulty: state.difficulty
  };
};

// Initial empty game state
const initialGameState: GameState = {
  board: [],
  selectedPath: [],
  currentWord: "",
  foundWords: [],
  score: 0,
  timeRemaining: 180, // 3 minutes default
  gameStatus: "ready",
  difficulty: "medium",
  boardSize: 4,
  language: "english",
  dictionary: new Set<string>(),
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (
    boardSize: number,
    difficulty: Difficulty,
    timerDuration: number
  ) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  selectLetter: (position: Position) => void;
  deselectLetter: (position: Position) => void;
  clearSelection: () => void;
  submitWord: () => void;
  setLanguage: (language: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setBoardSize: (size: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { recordGame, addLeaderboardEntry } = useStatistics();

  // Load dictionary on mount
  useEffect(() => {
    // Dictionary is now loaded directly from the validator module
    // No need to dispatch a SET_DICTIONARY action
    loadDictionary().catch((error) => {
      console.error("Failed to load dictionary:", error);
    });
  }, []);

  // Game timer effect
  useEffect(() => {
    let timerId: number | undefined;

    if (state.gameStatus === "active") {
      timerId = window.setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [state.gameStatus]);
  
  // Create a ref outside the effect to persist between renders
  const gameFinishedRef = useRef(false);
  
  // Effect to reset gameFinishedRef when game status changes to "active"
  useEffect(() => {
    if (state.gameStatus === "active") {
      // Reset the ref when a new game starts
      gameFinishedRef.current = false;
      console.log('Game status changed to active, reset gameFinishedRef');
    }
  }, [state.gameStatus]);
  
  // Effect to record statistics when game status changes to "finished"
  useEffect(() => {
    console.log("Game status changed to:", state.gameStatus);
    
    // Only run when game status changes to "finished" and there are words found
    // AND we haven't already recorded statistics for this game
    if (state.gameStatus === "finished" && state.foundWords.length > 0 && !gameFinishedRef.current) {
      // Mark that we've recorded statistics for this game
      gameFinishedRef.current = true;
      
      // Calculate game statistics
      const gameStats = calculateGameStatistics(state);
      console.log('Recording game statistics:', gameStats);
      
      // Record the game in statistics
      recordGame(
        gameStats.score,
        gameStats.wordCount,
        gameStats.longestWord,
        gameStats.mostValuableWord,
        gameStats.duration,
        gameStats.boardSize,
        gameStats.difficulty
      );
      
      // Also add an entry to the leaderboard if score is greater than 0
      if (gameStats.score > 0) {
        addLeaderboardEntry(
          gameStats.score,
          gameStats.wordCount,
          gameStats.longestWord,
          gameStats.boardSize,
          gameStats.difficulty
        );
      }
      
      console.log('Game finished - statistics recorded');
    }
  }, [state, recordGame, addLeaderboardEntry]);

  // Game controller methods
  const startGame = (
    boardSize: number,
    difficulty: Difficulty,
    timerDuration: number
  ) => {
    // First generate the board
    const newBoard = generateBoard(boardSize, difficulty);

    // Start the game with the given settings
    // Add debug logging to see if difficulty is being passed correctly
    console.log(
      `Starting game with difficulty: ${difficulty}, board size: ${boardSize}`
    );

    dispatch({
      type: "START_GAME",
      payload: { boardSize, difficulty, timerDuration },
    });

    // Then set the board
    dispatch({
      type: "SET_BOARD",
      payload: { board: newBoard },
    });
  };

  const pauseGame = () => dispatch({ type: "PAUSE_GAME" });
  const resumeGame = () => dispatch({ type: "RESUME_GAME" });
  // Modified to end the game without recording stats (stats will be recorded via the useEffect)
  const endGame = () => {
    // Just dispatch the END_GAME action - the statistics will be recorded by the useEffect
    dispatch({ type: "END_GAME" });
  };
  // Modified to end active games and then reset without duplicating statistics recording
  const resetGame = () => {
    // If the game is active or paused, first end it (which will transition to finished)
    // This will trigger the useEffect that records statistics
    if (state.gameStatus === 'active' || state.gameStatus === 'paused') {
      dispatch({ type: "END_GAME" });
      // Then after a short delay, reset the game
      setTimeout(() => {
        dispatch({ type: "RESET_GAME" });
        // Reset the gameFinishedRef to allow a new game to record stats
        gameFinishedRef.current = false;
      }, 100);
    } else {
      // If not active/paused, just reset directly
      dispatch({ type: "RESET_GAME" });
      // Reset the gameFinishedRef to allow a new game to record stats
      gameFinishedRef.current = false;
    }
  };

  const selectLetter = (position: Position) => {
    dispatch({ type: "SELECT_LETTER", payload: { position } });
  };

  const deselectLetter = (position: Position) => {
    dispatch({ type: "DESELECT_LETTER", payload: { position } });
  };

  const clearSelection = () => dispatch({ type: "CLEAR_SELECTION" });
  const submitWord = () => dispatch({ type: "SUBMIT_WORD" });

  const setLanguage = (language: string) => {
    dispatch({ type: "SET_LANGUAGE", payload: { language } });
  };

  const setDifficulty = (difficulty: Difficulty) => {
    dispatch({ type: "SET_DIFFICULTY", payload: { difficulty } });
  };

  const setBoardSize = (boardSize: number) => {
    dispatch({ type: "SET_BOARD_SIZE", payload: { boardSize } });
  };

  const value = {
    state,
    dispatch,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    selectLetter,
    deselectLetter,
    clearSelection,
    submitWord,
    setLanguage,
    setDifficulty,
    setBoardSize,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/* eslint-disable react-refresh/only-export-components */
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

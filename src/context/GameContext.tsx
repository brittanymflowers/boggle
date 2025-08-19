import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Difficulty, Letter, Position } from './gameTypes';
import { gameReducer, GameAction } from './gameReducer';
import { generateBoard } from '../utils/boardGenerator';
import { loadDictionary } from '../utils/dictionaryLoader';

// Initial empty game state
const initialGameState: GameState = {
  board: [],
  selectedPath: [],
  currentWord: '',
  foundWords: [],
  score: 0,
  timeRemaining: 180, // 3 minutes default
  gameStatus: 'ready',
  difficulty: 'medium',
  boardSize: 4,
  language: 'english',
  dictionary: new Set<string>(),
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (boardSize: number, difficulty: Difficulty, timerDuration: number) => void;
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

  // Load dictionary on mount or when language changes
  useEffect(() => {
    const loadDict = async () => {
      const dictionary = await loadDictionary(state.language);
      dispatch({ type: 'SET_DICTIONARY', payload: { dictionary } });
    };
    
    loadDict();
  }, [state.language]);

  // Game timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (state.gameStatus === 'active') {
      timerId = window.setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [state.gameStatus]);

  // Game controller methods
  const startGame = (boardSize: number, difficulty: Difficulty, timerDuration: number) => {
    // First generate the board
    const newBoard = generateBoard(boardSize, difficulty);
    
    // Start the game with the given settings
    dispatch({ type: 'START_GAME', payload: { boardSize, difficulty, timerDuration } });
    
    // Then set the board (now fixed with the proper action type)
    dispatch({ 
      type: 'SET_BOARD', 
      payload: { board: newBoard }
    });
  };

  const pauseGame = () => dispatch({ type: 'PAUSE_GAME' });
  const resumeGame = () => dispatch({ type: 'RESUME_GAME' });
  const endGame = () => dispatch({ type: 'END_GAME' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  
  const selectLetter = (position: Position) => {
    dispatch({ type: 'SELECT_LETTER', payload: { position } });
  };
  
  const deselectLetter = (position: Position) => {
    dispatch({ type: 'DESELECT_LETTER', payload: { position } });
  };
  
  const clearSelection = () => dispatch({ type: 'CLEAR_SELECTION' });
  const submitWord = () => dispatch({ type: 'SUBMIT_WORD' });
  
  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: { language } });
  };
  
  const setDifficulty = (difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: { difficulty } });
  };
  
  const setBoardSize = (boardSize: number) => {
    dispatch({ type: 'SET_BOARD_SIZE', payload: { boardSize } });
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

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
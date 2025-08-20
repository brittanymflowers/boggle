import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Define statistics types directly
export interface GameSummary {
  id: string;
  date: string;
  score: number;
  wordCount: number;
  duration: number;
  boardSize: number;
  difficulty: string;
  // Added these fields for better statistics tracking
  longestWord?: string;
  mostValuableWord?: {
    word: string;
    score: number;
  };
}

export interface GameStatistics {
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

export interface LeaderboardEntry {
  id: string;
  date: string;
  score: number;
  wordCount: number;
  longestWord: string;
  boardSize: number;
  difficulty: string;
}
import { v4 as uuidv4 } from 'uuid';

// Define actions
type StatisticsAction =
  | { type: 'RECORD_GAME'; payload: GameSummary }
  | { type: 'CLEAR_STATISTICS' }
  | { type: 'ADD_LEADERBOARD_ENTRY'; payload: LeaderboardEntry }
  | { type: 'CLEAR_LEADERBOARD' };

// Initial statistics state
const initialStatistics: GameStatistics = {
  gamesPlayed: 0,
  totalScore: 0,
  highestScore: 0,
  averageScore: 0,
  longestWord: '',
  mostWordsInGame: 0,
  mostValuableWord: {
    word: '',
    score: 0,
  },
  recentGames: [],
};

// Load statistics from localStorage if available
const loadSavedStatistics = (): GameStatistics => {
  try {
    const savedStats = localStorage.getItem('boggleStatistics');
    if (savedStats) {
      console.log('Loaded statistics from localStorage:', savedStats);
      return JSON.parse(savedStats);
    }
  } catch (error) {
    console.error('Error loading statistics from localStorage', error);
  }
  console.log('Using initial statistics');
  return initialStatistics;
};

// Initial leaderboard state
const initialLeaderboard: LeaderboardEntry[] = [];

// Load leaderboard from localStorage if available
const loadSavedLeaderboard = (): LeaderboardEntry[] => {
  try {
    const savedLeaderboard = localStorage.getItem('boggleLeaderboard');
    if (savedLeaderboard) {
      return JSON.parse(savedLeaderboard);
    }
  } catch (error) {
    console.error('Error loading leaderboard from localStorage', error);
  }
  return initialLeaderboard;
};

// Reducer for statistics
const statisticsReducer = (
  state: { statistics: GameStatistics; leaderboard: LeaderboardEntry[] },
  action: StatisticsAction
): { statistics: GameStatistics; leaderboard: LeaderboardEntry[] } => {
  switch (action.type) {
    case 'RECORD_GAME': {
      const gameSummary = action.payload;
      const recentGames = [gameSummary, ...state.statistics.recentGames].slice(0, 10); // Keep only last 10 games
      
      // Update statistics
      console.log('Recording game - current games played:', state.statistics.gamesPlayed);
      const gamesPlayed = state.statistics.gamesPlayed + 1;
      console.log('New games played count:', gamesPlayed);
      const totalScore = state.statistics.totalScore + gameSummary.score;
      const highestScore = Math.max(state.statistics.highestScore, gameSummary.score);
      const averageScore = totalScore / gamesPlayed;
      
      // Calculate longest word
      let longestWord = state.statistics.longestWord || '';
      if (gameSummary.longestWord && gameSummary.longestWord.length > longestWord.length) {
        longestWord = gameSummary.longestWord;
      }
      
      // Calculate most valuable word
      let mostValuableWord = state.statistics.mostValuableWord;
      if (gameSummary.mostValuableWord && gameSummary.mostValuableWord.score > mostValuableWord.score) {
        mostValuableWord = gameSummary.mostValuableWord;
      }
      
      return {
        ...state,
        statistics: {
          ...state.statistics,
          gamesPlayed,
          totalScore,
          highestScore,
          averageScore,
          longestWord,
          mostValuableWord,
          mostWordsInGame: Math.max(state.statistics.mostWordsInGame, gameSummary.wordCount),
          recentGames,
        },
      };
    }
    
    case 'CLEAR_STATISTICS':
      return {
        ...state,
        statistics: initialStatistics,
      };
    
    case 'ADD_LEADERBOARD_ENTRY': {
      const newEntry = action.payload;
      
      // Add new entry and sort by score (descending)
      const updatedLeaderboard = [...state.leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100); // Keep only top 100 entries
      
      return {
        ...state,
        leaderboard: updatedLeaderboard,
      };
    }
    
    case 'CLEAR_LEADERBOARD':
      return {
        ...state,
        leaderboard: [],
      };
    
    default:
      return state;
  }
};

// Create context
interface StatisticsContextType {
  statistics: GameStatistics;
  leaderboard: LeaderboardEntry[];
  recordGame: (
    score: number,
    wordCount: number,
    longestWord: string,
    mostValuableWord: { word: string; score: number },
    duration: number,
    boardSize: number,
    difficulty: string
  ) => void;
  clearStatistics: () => void;
  addLeaderboardEntry: (
    score: number,
    wordCount: number,
    longestWord: string,
    boardSize: number,
    difficulty: string
  ) => void;
  clearLeaderboard: () => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

interface StatisticsProviderProps {
  children: ReactNode;
}

export const StatisticsProvider = ({ children }: StatisticsProviderProps) => {
  const [{ statistics, leaderboard }, dispatch] = useReducer(statisticsReducer, {
    statistics: loadSavedStatistics(),
    leaderboard: loadSavedLeaderboard(),
  });

  // Save statistics and leaderboard to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('boggleStatistics', JSON.stringify(statistics));
    } catch (error) {
      console.error('Error saving statistics to localStorage', error);
    }
  }, [statistics]);

  useEffect(() => {
    try {
      localStorage.setItem('boggleLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error('Error saving leaderboard to localStorage', error);
    }
  }, [leaderboard]);

  // Statistics methods
  const recordGame = (
    score: number,
    wordCount: number,
    longestWord: string,
    mostValuableWord: { word: string; score: number },
    duration: number,
    boardSize: number,
    difficulty: string
  ) => {
    // Generate a unique ID for this game
    const gameId = uuidv4();
    
    console.log(`[Statistics] Recording game ${gameId} - Current games played: ${statistics.gamesPlayed}`);
    
    const gameSummary: GameSummary = {
      id: gameId,
      date: new Date().toISOString(),
      score,
      wordCount,
      duration,
      boardSize,
      difficulty,
    };
    
    // When recording a game, also include the longest word and most valuable word
    // in the payload for the reducer to handle
    dispatch({
      type: 'RECORD_GAME',
      payload: {
        ...gameSummary,
        longestWord,
        mostValuableWord,
      }
    });
    
    console.log(`[Statistics] Game ${gameId} recorded - New games played: ${statistics.gamesPlayed + 1}`, {
      score,
      wordCount,
      longestWord,
      mostValuableWord,
      duration,
      boardSize,
      difficulty
    });
  };

  const clearStatistics = () => {
    dispatch({ type: 'CLEAR_STATISTICS' });
  };

  const addLeaderboardEntry = (
    score: number,
    wordCount: number,
    longestWord: string,
    boardSize: number,
    difficulty: string
  ) => {
    const entry: LeaderboardEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      score,
      wordCount,
      longestWord,
      boardSize,
      difficulty,
    };
    
    dispatch({ type: 'ADD_LEADERBOARD_ENTRY', payload: entry });
  };

  const clearLeaderboard = () => {
    dispatch({ type: 'CLEAR_LEADERBOARD' });
  };

  const value = {
    statistics,
    leaderboard,
    recordGame,
    clearStatistics,
    addLeaderboardEntry,
    clearLeaderboard,
  };

  return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
};

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};
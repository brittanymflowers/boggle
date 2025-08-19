export interface GameSummary {
  id: string;
  date: string;
  score: number;
  wordCount: number;
  duration: number;
  boardSize: number;
  difficulty: string;
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
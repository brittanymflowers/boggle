export interface Position {
  row: number;
  col: number;
}

export interface Letter {
  char: string;
  position: Position;
  isSelected: boolean;
  isValidInPath: boolean;
}

export interface Word {
  text: string;
  path: Position[];
  score: number;
  timestamp: number;
}

export type GameStatus = 'ready' | 'active' | 'paused' | 'finished';
export type Difficulty = 'easy' | 'medium' | 'hard';

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

export interface WordValidationResult {
  isValid: boolean;
  reason?: string;
  score?: number;
}
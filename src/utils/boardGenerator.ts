// Define the types directly to avoid import issues
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

export type Difficulty = "easy" | "medium" | "hard";

// Standard Boggle dice (16 dice with 6 faces each)
const standardDice = [
  ["R", "I", "F", "O", "B", "X"],
  ["I", "F", "E", "H", "E", "Y"],
  ["D", "E", "N", "O", "W", "S"],
  ["U", "T", "O", "K", "N", "D"],
  ["H", "M", "S", "R", "A", "O"],
  ["L", "U", "P", "E", "T", "S"],
  ["A", "C", "I", "T", "O", "A"],
  ["Y", "L", "G", "K", "U", "E"],
  ["Q", "B", "M", "J", "O", "A"], // Changed Qu to Q (we'll handle the U in the UI)
  ["E", "H", "I", "S", "P", "N"],
  ["V", "E", "T", "I", "G", "N"],
  ["B", "A", "L", "I", "Y", "T"],
  ["E", "Z", "A", "V", "N", "D"],
  ["R", "A", "L", "E", "S", "C"],
  ["U", "W", "I", "L", "R", "G"],
  ["P", "A", "C", "E", "M", "D"],
];

// Letter frequency for different difficulty levels
const letterFrequency: Record<Difficulty, Record<string, number>> = {
  easy: {
    A: 9,
    B: 2,
    C: 2,
    D: 4,
    E: 12,
    F: 2,
    G: 3,
    H: 2,
    I: 9,
    J: 1,
    K: 1,
    L: 4,
    M: 2,
    N: 6,
    O: 8,
    P: 2,
    Q: 1,
    R: 6,
    S: 4,
    T: 6,
    U: 4,
    V: 2,
    W: 2,
    X: 1,
    Y: 2,
    Z: 1,
  },
  medium: {
    A: 8,
    B: 2,
    C: 3,
    D: 4,
    E: 10,
    F: 2,
    G: 3,
    H: 2,
    I: 9,
    J: 1,
    K: 2,
    L: 4,
    M: 3,
    N: 5,
    O: 7,
    P: 2,
    Q: 1,
    R: 6,
    S: 5,
    T: 6,
    U: 4,
    V: 2,
    W: 2,
    X: 1,
    Y: 2,
    Z: 1,
  },
  hard: {
    A: 6,
    B: 3,
    C: 3,
    D: 4,
    E: 8,
    F: 3,
    G: 3,
    H: 3,
    I: 7,
    J: 2,
    K: 2,
    L: 4,
    M: 3,
    N: 5,
    O: 6,
    P: 2,
    Q: 2,
    R: 5,
    S: 5,
    T: 5,
    U: 4,
    V: 3,
    W: 3,
    X: 2,
    Y: 2,
    Z: 2,
  },
};

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate a random letter based on difficulty level
function getRandomLetter(difficulty: Difficulty): string {
  const freq = letterFrequency[difficulty];
  const letters = Object.keys(freq);
  const weights = Object.values(freq);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let random = Math.random() * totalWeight;
  for (let i = 0; i < letters.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      // Apply adjustments for Q - change to match our display format
      if (letters[i] === "Q") {
        return "Q";
      }
      return letters[i];
    }
  }

  // Fallback (should never happen)
  return "E";
}

// Function to generate a Boggle board
export function generateBoard(
  size: number,
  difficulty: Difficulty
): Letter[][] {
  const board: Letter[][] = [];

  if (size === 4 && difficulty === "easy") {
    // Use standard Boggle dice for 4x4 board only for medium difficulty (standard game)
    const shuffledDice = shuffleArray(standardDice);

    for (let row = 0; row < 4; row++) {
      const rowLetters: Letter[] = [];
      for (let col = 0; col < 4; col++) {
        const dieIndex = row * 4 + col;
        const die = shuffledDice[dieIndex];
        const faceIndex = Math.floor(Math.random() * 6);

        rowLetters.push({
          char: die[faceIndex],
          position: { row, col },
          isSelected: false,
          isValidInPath: false,
        });
      }
      board.push(rowLetters);
    }
  } else {
    // For non-standard sizes, generate random letters based on frequency
    for (let row = 0; row < size; row++) {
      const rowLetters: Letter[] = [];
      for (let col = 0; col < size; col++) {
        rowLetters.push({
          char: getRandomLetter(difficulty),
          position: { row, col },
          isSelected: false,
          isValidInPath: false,
        });
      }
      board.push(rowLetters);
    }
  }

  return board;
}

// Function to check if a position is within board bounds
export function isWithinBounds(position: Position, boardSize: number): boolean {
  return (
    position.row >= 0 &&
    position.row < boardSize &&
    position.col >= 0 &&
    position.col < boardSize
  );
}

// Function to get all valid adjacent positions
export function getAdjacentPositions(
  position: Position,
  boardSize: number
): Position[] {
  const { row, col } = position;
  const adjacentPositions: Position[] = [];

  // Check all 8 surrounding positions
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      // Skip the current position
      if (r === row && c === col) continue;

      // Add position if it's within bounds
      if (isWithinBounds({ row: r, col: c }, boardSize)) {
        adjacentPositions.push({ row: r, col: c });
      }
    }
  }

  return adjacentPositions;
}

// Function to get position from coordinates - no longer needed for mouse movement
// but kept for compatibility
export function getPositionFromCoordinates(
  x: number,
  y: number,
  cellSize: number
): Position {
  // Account for the gap between cells (8px as set in the CSS)
  const GAP_SIZE = 8;
  
  // Calculate row and column accounting for gaps
  const row = Math.floor(y / (cellSize + GAP_SIZE));
  const col = Math.floor(x / (cellSize + GAP_SIZE));
  
  return { row, col };
}

// Function to get the character at a specific position on the board
export function getCharAtPosition(
  board: Letter[][],
  position: Position
): string {
  return board[position.row][position.col].char;
}

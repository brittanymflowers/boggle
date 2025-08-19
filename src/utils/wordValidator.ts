import { Position, WordValidationResult } from '../context/gameTypes';
import { isWithinBounds, getAdjacentPositions } from './boardGenerator';

// Function to check if a word can be formed on the board following Boggle rules
export function isWordPossibleOnBoard(
  word: string,
  board: string[][],
  startPosition?: Position,
  visited: boolean[][] = []
): boolean {
  const boardSize = board.length;
  
  // Initialize visited array if not provided
  if (visited.length === 0) {
    for (let i = 0; i < boardSize; i++) {
      visited.push(new Array(boardSize).fill(false));
    }
  }
  
  // If startPosition is provided, check from that specific position
  if (startPosition) {
    return searchWord(word, 0, startPosition.row, startPosition.col, board, visited);
  }
  
  // Otherwise, try starting from each position on the board
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const firstChar = word[0].toUpperCase();
      const cellChar = board[row][col].toUpperCase();
      
      // Handle 'Qu' special case
      if (firstChar === 'Q' && word.length > 1 && word[1].toUpperCase() === 'U' && cellChar === 'QU') {
        // Skip 'u' as it's already part of the 'Qu' die
        if (searchWord(word, 2, row, col, board, JSON.parse(JSON.stringify(visited)))) {
          return true;
        }
      } else if (firstChar === cellChar || (cellChar === 'QU' && firstChar === 'Q')) {
        // Regular case or just the 'Q' from 'Qu'
        if (searchWord(word, 1, row, col, board, JSON.parse(JSON.stringify(visited)))) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Recursive function to search for a word from a given position
function searchWord(
  word: string,
  index: number,
  row: number,
  col: number,
  board: string[][],
  visited: boolean[][]
): boolean {
  // If we've processed all characters, the word is found
  if (index === word.length) {
    return true;
  }
  
  // Check if out of bounds or already visited
  const boardSize = board.length;
  if (!isWithinBounds({ row, col }, boardSize) || visited[row][col]) {
    return false;
  }
  
  const currentChar = word[index].toUpperCase();
  const cellChar = board[row][col].toUpperCase();
  
  // Handle 'Qu' special case
  let matches = false;
  let nextIndex = index + 1;
  
  if (cellChar === 'QU') {
    if (currentChar === 'Q' && index + 1 < word.length && word[index + 1].toUpperCase() === 'U') {
      matches = true;
      nextIndex = index + 2; // Skip the 'u' in the word
    } else if (currentChar === 'Q') {
      matches = true;
    }
  } else if (currentChar === cellChar) {
    matches = true;
  }
  
  if (!matches) {
    return false;
  }
  
  // Mark as visited
  visited[row][col] = true;
  
  // Check all adjacent positions
  const adjacentPositions = getAdjacentPositions({ row, col }, boardSize);
  for (const position of adjacentPositions) {
    if (searchWord(word, nextIndex, position.row, position.col, board, visited)) {
      return true;
    }
  }
  
  // If no path found, backtrack
  visited[row][col] = false;
  return false;
}

// Validate a word against the game rules and dictionary
export function validateWord(
  word: string,
  path: Position[],
  board: string[][],
  dictionary: Set<string>,
  foundWords: string[]
): WordValidationResult {
  // Check if word is at least 3 letters long
  if (word.length < 3) {
    return {
      isValid: false,
      reason: 'Word is too short (minimum 3 letters).',
    };
  }
  
  // Check if word exists in the dictionary
  if (!dictionary.has(word.toLowerCase())) {
    return {
      isValid: false,
      reason: 'Word not found in dictionary.',
    };
  }
  
  // Check if word was already found
  if (foundWords.includes(word.toLowerCase())) {
    return {
      isValid: false,
      reason: 'Word has already been found.',
    };
  }
  
  // Check if the path forms a continuous, adjacent sequence
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    
    const rowDiff = Math.abs(prev.row - curr.row);
    const colDiff = Math.abs(prev.col - curr.col);
    
    if (rowDiff > 1 || colDiff > 1) {
      return {
        isValid: false,
        reason: 'Path is not continuous.',
      };
    }
  }
  
  // Check if the path actually forms the given word
  const wordFromPath = path.map(pos => board[pos.row][pos.col]).join('');
  if (wordFromPath.toLowerCase() !== word.toLowerCase()) {
    return {
      isValid: false,
      reason: 'Path does not form the given word.',
    };
  }
  
  // Calculate score
  const score = calculateWordScore(word);
  
  return {
    isValid: true,
    score,
  };
}

// Calculate word score based on word length and special letters
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
  if (word.includes('q')) score += 2;
  if (word.includes('z')) score += 3;
  if (word.includes('x')) score += 2;
  if (word.includes('j')) score += 2;
  if (word.includes('k')) score += 1;
  
  return score;
}
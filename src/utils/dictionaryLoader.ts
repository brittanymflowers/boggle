// Dictionary cache to avoid reloading
const dictionaryCache: Record<string, Set<string>> = {};

// Theme-specific word lists
const animalWords = [
  'dog', 'cat', 'bird', 'fish', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer',
  'mouse', 'rat', 'frog', 'toad', 'snake', 'lizard', 'turtle', 'eagle', 'hawk', 'owl',
  'duck', 'goose', 'swan', 'chicken', 'horse', 'cow', 'sheep', 'goat', 'pig', 'rabbit',
  'monkey', 'ape', 'zebra', 'giraffe', 'elephant', 'rhino', 'hippo', 'whale', 'dolphin', 'shark',
  'seal', 'walrus', 'penguin', 'ant', 'bee', 'wasp', 'fly', 'moth', 'spider', 'crab',
];

const foodWords = [
  'apple', 'orange', 'banana', 'grape', 'melon', 'lemon', 'lime', 'peach', 'plum', 'cherry',
  'bread', 'cake', 'cookie', 'pie', 'pasta', 'rice', 'soup', 'salad', 'meat', 'beef',
  'pork', 'lamb', 'fish', 'tuna', 'salmon', 'milk', 'cheese', 'cream', 'butter', 'yogurt',
  'egg', 'sugar', 'salt', 'pepper', 'spice', 'herb', 'tea', 'coffee', 'juice', 'water',
  'beer', 'wine', 'pizza', 'burger', 'fries', 'onion', 'garlic', 'carrot', 'potato', 'tomato',
];

// Function to load the dictionary from the words_dictionary.json file
export async function loadDictionary(language: string = 'english'): Promise<Set<string>> {
  // Check cache first
  if (dictionaryCache[language]) {
    console.log(`Using cached dictionary for ${language}`);
    return dictionaryCache[language];
  }
  
  // Special cases for themed word lists
  if (language === 'animals') {
    const dictionary = new Set(animalWords);
    dictionaryCache[language] = dictionary;
    console.log(`Loaded ${dictionary.size} animal words`);
    return dictionary;
  }
  
  if (language === 'food') {
    const dictionary = new Set(foodWords);
    dictionaryCache[language] = dictionary;
    console.log(`Loaded ${dictionary.size} food words`);
    return dictionary;
  }
  
  try {
    console.log('Loading comprehensive English dictionary...');
    const response = await fetch('/words_dictionary.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status}`);
    }
    
    const wordData = await response.json();
    const words = Object.keys(wordData)
      .filter(word => word.length >= 3); // Only include words of 3+ letters for Boggle
    
    const dictionary = new Set(words);
    
    // Cache for future use
    dictionaryCache['english'] = dictionary;
    
    console.log(`Loaded ${dictionary.size} words for comprehensive dictionary`);
    
    return dictionary;
  } catch (error) {
    console.error('Error loading dictionary:', error);
    // Fallback to a minimal set of common words if dictionary fails to load
    const fallbackWords = new Set(['cat', 'dog', 'run', 'the', 'and', 'but']);
    console.warn('Using fallback dictionary due to loading error');
    return fallbackWords;
  }
}

// Function to get available dictionary options
export function getAvailableDictionaries(): string[] {
  return ['english', 'animals', 'food'];
}

// Simple function to check if a word is valid using our dictionary
export async function isWordValid(word: string): Promise<boolean> {
  // Check if word is in our dictionary
  const englishDictionary = await loadDictionary('english');
  return englishDictionary.has(word.toLowerCase());
}

// Function to validate a custom word list
export function validateCustomWordList(wordList: string): string[] {
  const words = wordList
    .toLowerCase()
    .split(/[,\n\r\s]+/)
    .filter(word => word.length >= 3)
    .map(word => word.trim());
  
  return [...new Set(words)]; // Remove duplicates
}
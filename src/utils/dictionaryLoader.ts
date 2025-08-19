// Dictionary cache to avoid reloading
const dictionaryCache: Record<string, Set<string>> = {};

// English common words (simplified version for demo)
const commonEnglishWords = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would',
  'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make',
  'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
  'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
  'because', 'any', 'these', 'give', 'day', 'most', 'cat', 'dog', 'man', 'car',
  'house', 'tree', 'bird', 'word', 'play', 'game', 'ball', 'book', 'food', 'run',
  'jump', 'talk', 'walk', 'love', 'hate', 'feel', 'city', 'blue', 'red', 'green',
  'yellow', 'black', 'white', 'big', 'small', 'fast', 'slow', 'high', 'low', 'old',
  'young', 'happy', 'sad', 'hot', 'cold', 'easy', 'hard', 'early', 'late', 'long',
  'short', 'right', 'wrong', 'full', 'empty', 'rich', 'poor', 'dark', 'light', 'sweet',
  'sour', 'clean', 'dirty', 'dry', 'wet', 'soft', 'hard', 'cheap', 'dear', 'thin',
  'thick', 'far', 'near', 'deep', 'flat', 'loud', 'quiet', 'quick', 'slow', 'sharp',
  'board', 'piece', 'king', 'queen', 'rock', 'paper', 'night', 'day', 'rain', 'snow',
  'wind', 'cloud', 'earth', 'fire', 'water', 'dust', 'smoke', 'fog', 'ice', 'steam',
  'drink', 'milk', 'juice', 'tea', 'coffee', 'wine', 'beer', 'bread', 'cake', 'cheese',
  'meat', 'fish', 'rice', 'salt', 'sugar', 'fruit', 'apple', 'pear', 'orange', 'lemon',
  'table', 'chair', 'door', 'window', 'floor', 'wall', 'roof', 'bed', 'desk', 'lamp',
  'phone', 'radio', 'clock', 'watch', 'ring', 'hat', 'coat', 'shoe', 'boot', 'sock',
  'head', 'eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'arm', 'leg', 'bone',
  'brain', 'heart', 'blood', 'skin', 'hair', 'road', 'path', 'bridge', 'river', 'lake',
];

// Spanish common words (simplified version for demo)
const commonSpanishWords = [
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se',
  'no', 'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 'tener', 'le',
  'lo', 'todo', 'pero', 'más', 'hacer', 'o', 'poder', 'decir', 'este', 'ir',
  'otro', 'ese', 'si', 'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'él',
  'muy', 'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno', 'mismo',
  'yo', 'también', 'hasta', 'año', 'dos', 'querer', 'entre', 'así', 'primero', 'desde',
  'grande', 'eso', 'ni', 'nos', 'llegar', 'pasar', 'tiempo', 'ella', 'día', 'uno',
  'bien', 'poco', 'deber', 'entonces', 'poner', 'cosa', 'tanto', 'hombre', 'parecer', 'nuestro',
  'casa', 'perro', 'gato', 'libro', 'agua', 'vida', 'sol', 'luna', 'mar', 'cielo',
  'tierra', 'fuego', 'aire', 'rojo', 'azul', 'verde', 'negro', 'blanco', 'bueno', 'malo',
];

// French common words (simplified version for demo)
const commonFrenchWords = [
  'le', 'la', 'de', 'un', 'une', 'et', 'est', 'en', 'que', 'à',
  'il', 'elle', 'je', 'tu', 'nous', 'vous', 'ils', 'elles', 'qui', 'ne',
  'pas', 'ce', 'dans', 'du', 'pour', 'sur', 'au', 'avec', 'se', 'plus',
  'par', 'mais', 'ou', 'où', 'si', 'leur', 'sont', 'mon', 'ton', 'son',
  'me', 'te', 'lui', 'tout', 'voir', 'faire', 'dire', 'aller', 'venir', 'prendre',
  'savoir', 'pouvoir', 'vouloir', 'aimer', 'jour', 'ans', 'temps', 'homme', 'femme', 'petit',
  'grand', 'bien', 'mal', 'mer', 'terre', 'eau', 'feu', 'air', 'ciel', 'soleil',
  'lune', 'étoile', 'arbre', 'fleur', 'ami', 'main', 'pied', 'tête', 'cœur', 'âme',
  'chien', 'chat', 'maison', 'ville', 'rue', 'pays', 'monde', 'livre', 'mot', 'nom',
  'bonjour', 'merci', 'oui', 'non', 'rouge', 'bleu', 'vert', 'noir', 'blanc', 'bon',
];

// Custom themed word lists (simplified for demo)
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

// Function to simulate loading a dictionary from a "server"
export async function loadDictionary(language: string = 'english'): Promise<Set<string>> {
  // Check cache first
  if (dictionaryCache[language]) {
    return dictionaryCache[language];
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let words: string[] = [];
  
  // Select word list based on language
  switch (language.toLowerCase()) {
    case 'english':
      words = commonEnglishWords;
      break;
    case 'spanish':
      words = commonSpanishWords;
      break;
    case 'french':
      words = commonFrenchWords;
      break;
    case 'animals':
      words = animalWords;
      break;
    case 'food':
      words = foodWords;
      break;
    default:
      words = commonEnglishWords;
  }
  
  // Convert to a Set for faster lookups
  const dictionary = new Set(words);
  
  // Cache for future use
  dictionaryCache[language] = dictionary;
  
  return dictionary;
}

// Function to get available dictionary options
export function getAvailableDictionaries(): string[] {
  return ['english', 'spanish', 'french', 'animals', 'food'];
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
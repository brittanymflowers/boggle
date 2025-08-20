// Dictionary validator module
// This module provides utilities for loading and validating words against a dictionary

// Define the dictionary type
type Dictionary = {
  [word: string]: number;
};

// Initialize the dictionary
let dictionary: Dictionary = {};
let isLoaded = false;
let isLoading = false;

// Function to load the dictionary
export const loadDictionary = async (): Promise<void> => {
  if (isLoaded || isLoading) {
    return;
  }
  
  isLoading = true;
  console.log("Loading dictionary...");
  
  try {
    const response = await fetch('/words_dictionary.json');
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status} ${response.statusText}`);
    }
    
    dictionary = await response.json();
    isLoaded = true;
    console.log(`Dictionary loaded with ${Object.keys(dictionary).length} words`);
  } catch (error) {
    console.error("Error loading dictionary:", error);
    throw error;
  } finally {
    isLoading = false;
  }
};

// Function to check if a word is valid
export const isValidWord = (word: string): boolean => {
  if (!isLoaded) {
    console.warn("Dictionary not loaded yet, assuming word is valid");
    return true;
  }

  // Convert word to lowercase since dictionary keys are lowercase
  const normalizedWord = word.toLowerCase();
  
  // Check if the word is in the dictionary and has at least 3 letters
  return normalizedWord.length >= 3 && !!dictionary[normalizedWord];
};

// Function to get all valid words from a list of candidates
export const filterValidWords = (words: string[]): string[] => {
  return words.filter(isValidWord);
};

// Load the dictionary when this module is imported
loadDictionary().catch(error => {
  console.error("Failed to load dictionary:", error);
});
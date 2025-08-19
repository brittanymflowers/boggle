import React, { useMemo } from 'react';
import { useGame } from '../../../context/GameContext2';
import { usePreferences } from '../../../context/PreferencesContext';
// Define the Word type directly
interface Word {
  text: string;
  path: { row: number; col: number; }[];
  score: number;
  timestamp: number;
}

interface WordListProps {
  className?: string;
}

export const WordList: React.FC<WordListProps> = ({ className = '' }) => {
  const { state } = useGame();
  const { preferences } = usePreferences();

  // Group words by length
  const wordsByLength = useMemo(() => {
    const grouped: Record<number, Word[]> = {};
    
    state.foundWords.forEach(word => {
      const length = word.text.length;
      if (!grouped[length]) {
        grouped[length] = [];
      }
      grouped[length].push(word);
    });
    
    return grouped;
  }, [state.foundWords]);

  // Sort lengths in descending order
  const sortedLengths = useMemo(() => {
    return Object.keys(wordsByLength)
      .map(Number)
      .sort((a, b) => b - a);
  }, [wordsByLength]);

  // Function to determine word class based on score and preferences
  const getWordClass = (word: Word) => {
    let baseClass = 'py-1 px-2 rounded-md mr-1 mb-1 inline-block transition-all';
    
    // Apply colors based on score and theme
    if (preferences.colorBlindMode) {
      if (word.score >= 5) {
        baseClass += ' bg-yellow-500 text-black';
      } else if (word.score >= 3) {
        baseClass += ' bg-blue-200 text-black';
      } else {
        baseClass += ' bg-gray-200 text-black';
      }
    } else {
      if (word.score >= 5) {
        baseClass += ' bg-purple-600 text-white';
      } else if (word.score >= 3) {
        baseClass += ' bg-indigo-500 text-white';
      } else {
        baseClass += preferences.theme === 'dark' 
          ? ' bg-gray-700 text-white' 
          : ' bg-indigo-100 text-indigo-900';
      }
    }
    
    // Apply text size based on preferences
    if (preferences.textSize === 'large') {
      baseClass += ' text-base';
    } else if (preferences.textSize === 'small') {
      baseClass += ' text-xs';
    } else {
      baseClass += ' text-sm';
    }
    
    return baseClass;
  };

  if (state.foundWords.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
        <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Found Words</h2>
        <p className="text-gray-500 dark:text-gray-400">No words found yet</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow overflow-y-auto ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Found Words</h2>
        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm">
          {state.foundWords.length} words
        </span>
      </div>
      
      {sortedLengths.length > 0 ? (
        sortedLengths.map(length => (
          <div key={length} className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {length} letters ({wordsByLength[length].length})
            </h3>
            <div className="flex flex-wrap">
              {wordsByLength[length]
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((word, index) => (
                  <div 
                    key={`${word.text}-${index}`}
                    className={getWordClass(word)}
                    title={`Score: ${word.score}`}
                  >
                    {word.text}
                    <span className="ml-1 text-xs opacity-70">{word.score}</span>
                  </div>
                ))
              }
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No words found yet</p>
      )}
    </div>
  );
};
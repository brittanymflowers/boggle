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
    let baseClass = 'py-2 px-3 rounded-xl mr-2 mb-2 inline-block transition-all font-bold border-2';
    
    // Apply colors based on score and theme
    if (preferences.colorBlindMode) {
      if (word.score >= 5) {
        baseClass += ' bg-yellow-400 text-black border-yellow-600';
      } else if (word.score >= 3) {
        baseClass += ' bg-blue-300 text-black border-blue-500';
      } else {
        baseClass += ' bg-white text-black border-gray-400';
      }
    } else {
      if (word.score >= 5) {
        baseClass += ' bg-yellow-400 text-black border-yellow-600';
      } else if (word.score >= 3) {
        baseClass += ' bg-blue-300 text-black border-blue-500';
      } else {
        baseClass += preferences.theme === 'dark' 
          ? ' bg-white text-black border-gray-400' 
          : ' bg-white text-black border-gray-400';
      }
    }
    
    // Apply text size based on preferences
    if (preferences.textSize === 'large') {
      baseClass += ' text-lg';
    } else if (preferences.textSize === 'small') {
      baseClass += ' text-sm';
    } else {
      baseClass += ' text-base';
    }
    
    return baseClass;
  };

  if (state.foundWords.length === 0) {
    return (
      <div className={`bg-blue-500 dark:bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 shadow-lg ${className}`}>
        <h2 className="text-xl font-black mb-2 text-white dark:text-white">Found Words</h2>
        <p className="text-white dark:text-white">No words found yet</p>
      </div>
    );
  }

  return (
    <div className={`bg-blue-500 dark:bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 shadow-lg overflow-y-auto ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-black text-white dark:text-white">Found Words</h2>
        <span className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black px-3 py-1 rounded-full text-sm font-bold border-2 border-yellow-600">
          {state.foundWords.length} words
        </span>
      </div>
      
      {sortedLengths.length > 0 ? (
        sortedLengths.map(length => (
          <div key={length} className="mb-4">
            <h3 className="text-base font-bold text-white dark:text-white mb-2">
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
import React, { useState } from 'react';
import { useGame } from '../../../context/GameContext2';
import { usePreferences } from '../../../context/PreferencesContext';
// Define Difficulty type directly
type Difficulty = 'easy' | 'medium' | 'hard';
import { generateBoard } from '../../../utils/boardGenerator';

interface GameControlsProps {
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({ className = '' }) => {
  const { state, startGame, pauseGame, resumeGame, resetGame } = useGame();
  const { preferences } = usePreferences();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(preferences.defaultDifficulty);
  const [selectedBoardSize, setSelectedBoardSize] = useState<number>(preferences.defaultBoardSize);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number>(preferences.defaultTimerDuration);

  // Handle game start
  const handleStartGame = () => {
    if (state.gameStatus === 'ready' || state.gameStatus === 'finished') {
      startGame(selectedBoardSize, selectedDifficulty, selectedTimerDuration);
    }
  };

  // Handle pause/resume toggle
  const handlePauseResumeToggle = () => {
    if (state.gameStatus === 'active') {
      pauseGame();
    } else if (state.gameStatus === 'paused') {
      resumeGame();
    }
  };

  // Generate button class based on variant and state
  const getButtonClass = (variant: 'primary' | 'secondary' | 'danger' = 'primary', disabled = false) => {
    let baseClass = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (disabled) {
      return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClass} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500`;
      case 'secondary':
        return `${baseClass} bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400`;
      case 'danger':
        return `${baseClass} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
    }
  };

  // Generate select class
  const getSelectClass = () => {
    return 'mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
      {(state.gameStatus === 'ready' || state.gameStatus === 'finished') && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">Game Settings</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                className={getSelectClass()}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Board Size
              </label>
              <select
                value={selectedBoardSize}
                onChange={(e) => setSelectedBoardSize(Number(e.target.value))}
                className={getSelectClass()}
              >
                <option value="4">4x4 (Standard)</option>
                <option value="5">5x5 (Large)</option>
                <option value="6">6x6 (Extra Large)</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timer Duration
              </label>
              <select
                value={selectedTimerDuration}
                onChange={(e) => setSelectedTimerDuration(Number(e.target.value))}
                className={getSelectClass()}
              >
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {(state.gameStatus === 'ready' || state.gameStatus === 'finished') && (
          <button
            onClick={handleStartGame}
            className={getButtonClass('primary')}
          >
            {state.gameStatus === 'finished' ? 'Play Again' : 'Start Game'}
          </button>
        )}
        
        {(state.gameStatus === 'active' || state.gameStatus === 'paused') && (
          <>
            <button
              onClick={handlePauseResumeToggle}
              className={getButtonClass('primary')}
            >
              {state.gameStatus === 'active' ? 'Pause' : 'Resume'}
            </button>
            
            <button
              onClick={resetGame}
              className={getButtonClass('danger')}
            >
              End Game
            </button>
          </>
        )}
      </div>
      
      {state.gameStatus === 'active' && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find as many words as you can before time runs out!
          </p>
        </div>
      )}
    </div>
  );
};
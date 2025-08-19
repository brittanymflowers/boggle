import React from 'react';
import { usePreferences } from '../../../context/PreferencesContext';
import { getAvailableDictionaries } from '../../../utils/dictionaryLoader';
// Define types directly
type ThemeMode = 'light' | 'dark';
type TextSize = 'small' | 'medium' | 'large';

interface SettingsPanelProps {
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ className = '' }) => {
  const {
    preferences,
    setTheme,
    toggleSoundEffects,
    setMusicVolume,
    setEffectsVolume,
    toggleColorBlindMode,
    setTextSize,
    setDefaultTimer,
    setDefaultBoardSize,
    setDefaultDifficulty,
    setDefaultLanguage,
  } = usePreferences();
  
  const availableDictionaries = getAvailableDictionaries();

  // Helper to generate toggle button classes
  const getToggleClass = (isActive: boolean) => {
    return `relative inline-flex h-6 w-11 items-center rounded-full ${
      isActive ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
    }`;
  };
  
  // Helper to generate toggle button knob classes
  const getToggleKnobClass = (isActive: boolean) => {
    return `inline-block h-4 w-4 transform rounded-full bg-white transition ${
      isActive ? 'translate-x-6' : 'translate-x-1'
    }`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Game Preferences</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Default Difficulty
              </label>
              <select
                value={preferences.defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Default Board Size
              </label>
              <select
                value={preferences.defaultBoardSize}
                onChange={(e) => setDefaultBoardSize(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="4">4x4 (Standard)</option>
                <option value="5">5x5 (Large)</option>
                <option value="6">6x6 (Extra Large)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Default Timer Duration
              </label>
              <select
                value={preferences.defaultTimerDuration}
                onChange={(e) => setDefaultTimer(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Default Dictionary
              </label>
              <select
                value={preferences.defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {availableDictionaries.map(dict => (
                  <option key={dict} value={dict}>
                    {dict.charAt(0).toUpperCase() + dict.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Appearance</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
              <button
                onClick={() => setTheme(preferences.theme === 'dark' ? 'light' : 'dark')}
                className={getToggleClass(preferences.theme === 'dark')}
              >
                <span className="sr-only">Toggle Dark Mode</span>
                <span className={getToggleKnobClass(preferences.theme === 'dark')}></span>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Text Size
              </label>
              <div className="mt-2 flex space-x-2">
                {(['small', 'medium', 'large'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      preferences.textSize === size
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Accessibility</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Color Blind Mode</span>
              <button
                onClick={() => toggleColorBlindMode(!preferences.colorBlindMode)}
                className={getToggleClass(preferences.colorBlindMode)}
              >
                <span className="sr-only">Toggle Color Blind Mode</span>
                <span className={getToggleKnobClass(preferences.colorBlindMode)}></span>
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Sound</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sound Effects</span>
              <button
                onClick={() => toggleSoundEffects(!preferences.soundEffects)}
                className={getToggleClass(preferences.soundEffects)}
              >
                <span className="sr-only">Toggle Sound Effects</span>
                <span className={getToggleKnobClass(preferences.soundEffects)}></span>
              </button>
            </div>
            
            {preferences.soundEffects && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Music Volume: {preferences.musicVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences.musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Effects Volume: {preferences.effectsVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences.effectsVolume}
                    onChange={(e) => setEffectsVolume(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
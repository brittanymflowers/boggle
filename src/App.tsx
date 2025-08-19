import React, { useState } from 'react';
import { usePreferences } from './context/PreferencesContext';
import { GameBoard } from './components/core/GameBoard/GameBoard';
import { GameControls } from './components/core/GameControls/GameControls';
import { WordList } from './components/core/WordList/WordList';
import { ScoreDisplay } from './components/core/ScoreDisplay/ScoreDisplay';
import { Statistics } from './components/core/Statistics/Statistics';
import { SettingsPanel } from './components/core/SettingsPanel/SettingsPanel';

function App() {
  const { preferences } = usePreferences();
  const [activeTab, setActiveTab] = useState<'game' | 'statistics' | 'settings'>('game');

  return (
    <div className={`min-h-screen p-4 ${preferences.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400">
            Boggle Game
          </h1>
          <div className="mt-4 flex justify-center">
            <nav className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'game'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                onClick={() => setActiveTab('game')}
              >
                Game
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'statistics'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                onClick={() => setActiveTab('statistics')}
              >
                Statistics
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </nav>
          </div>
        </header>

        {activeTab === 'game' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <GameBoard />
              <GameControls className="mt-4" />
            </div>
            <div className="md:col-span-1 space-y-4">
              <ScoreDisplay />
              <WordList className="h-[400px]" />
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <Statistics className="w-full" />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel className="w-full max-w-2xl mx-auto" />
        )}
      </div>
    </div>
  );
}

export default App;
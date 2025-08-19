import React, { useState } from 'react';
import { useStatistics } from '../../../context/StatisticsContext';
import { usePreferences } from '../../../context/PreferencesContext';

interface StatisticsProps {
  className?: string;
}

export const Statistics: React.FC<StatisticsProps> = ({ className = '' }) => {
  const { statistics, leaderboard, clearStatistics, clearLeaderboard } = useStatistics();
  const { preferences } = usePreferences();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'leaderboard'>('overview');

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Helper to determine tab class
  const getTabClass = (tab: string) => {
    const isActive = activeTab === tab;
    return `px-4 py-2 text-sm font-medium rounded-t-lg ${
      isActive
        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={getTabClass('overview')}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={getTabClass('history')}
          onClick={() => setActiveTab('history')}
        >
          Game History
        </button>
        <button
          className={getTabClass('leaderboard')}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your Stats</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg">
                <p className="text-xs text-indigo-600 dark:text-indigo-300">Games Played</p>
                <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
                  {statistics.gamesPlayed}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                <p className="text-xs text-green-600 dark:text-green-300">Highest Score</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {statistics.highestScore}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-300">Average Score</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {statistics.gamesPlayed > 0
                    ? Math.round(statistics.averageScore * 10) / 10
                    : 0}
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-300">Most Words in a Game</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {statistics.mostWordsInGame}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Longest Word</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                {statistics.longestWord ? (
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {statistics.longestWord}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No words yet</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Most Valuable Word</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                {statistics.mostValuableWord.word ? (
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {statistics.mostValuableWord.word}
                    </p>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {statistics.mostValuableWord.score} points
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No words yet</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearStatistics}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Reset Statistics
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Game History</h2>
            
            {statistics.recentGames.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Board</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {statistics.recentGames.map((game) => (
                      <tr key={game.id}>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(game.date)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">{game.score}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{game.wordCount}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{game.boardSize}x{game.boardSize}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 capitalize">{game.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No game history yet</p>
            )}
          </div>
        )}
        
        {activeTab === 'leaderboard' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Leaderboard</h2>
            
            {leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Longest Word</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.id} className={index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                        <td className="px-4 py-3 text-sm font-medium">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(entry.date)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">{entry.score}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{entry.wordCount}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{entry.longestWord}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No leaderboard entries yet</p>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearLeaderboard}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Reset Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { Timer } from "../../utility/Timer";

interface ScoreDisplayProps {
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  className = "",
}) => {
  const { state } = useGame();
  const [animateScore, setAnimateScore] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  // Trigger score animation when the score changes
  useEffect(() => {
    if (state.score !== lastScore) {
      setAnimateScore(true);
      setLastScore(state.score);

      const timer = setTimeout(() => {
        setAnimateScore(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.score, lastScore]);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Score
          </span>
          <div
            className={`text-3xl font-bold ${
              animateScore
                ? "text-green-600 dark:text-green-400 transform scale-110 transition-transform"
                : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {state.score}
          </div>
        </div>

        <div className="mt-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Words: {state.foundWords.length}</span>
          {state.foundWords.length > 0 && (
            <span>
              Avg: {(state.score / state.foundWords.length).toFixed(1)} pts/word
            </span>
          )}
        </div>
      </div>

      <Timer className="mt-2" />

      {state.gameStatus === "finished" && (
        <div className="mt-4 p-2 bg-indigo-100 dark:bg-indigo-900 rounded text-center">
          <p className="text-indigo-800 dark:text-indigo-200 font-medium">
            Game Over!
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-300">
            Final Score: {state.score} points
          </p>
        </div>
      )}

      {state.gameStatus === "paused" && (
        <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            Game Paused
          </p>
        </div>
      )}
    </div>
  );
};

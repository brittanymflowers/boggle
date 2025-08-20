import React, { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { usePreferences } from "../../../context/PreferencesContext";
// Define Difficulty type directly
type Difficulty = "easy" | "medium" | "hard";

interface GameControlsProps {
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  className = "",
}) => {
  const { state, startGame, pauseGame, resumeGame, resetGame } = useGame();
  const { preferences } = usePreferences();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    preferences.defaultDifficulty
  );
  const [selectedBoardSize, setSelectedBoardSize] = useState<number>(
    preferences.defaultBoardSize
  );
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number>(
    preferences.defaultTimerDuration
  );

  // Handle game start
  const handleStartGame = () => {
    if (state.gameStatus === "ready" || state.gameStatus === "finished") {
      startGame(selectedBoardSize, selectedDifficulty, selectedTimerDuration);
    }
  };

  // Handle pause/resume toggle
  const handlePauseResumeToggle = () => {
    if (state.gameStatus === "active") {
      pauseGame();
    } else if (state.gameStatus === "paused") {
      resumeGame();
    }
  };

  // Generate button class based on variant and state
  const getButtonClass = (
    variant: "primary" | "secondary" | "danger" = "primary",
    disabled = false
  ) => {
    const baseClass =
      "px-5 py-3 rounded-xl border-4 font-bold text-lg transition-all focus:outline-none shadow-md";

    if (disabled) {
      return `${baseClass} bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed`;
    }

    switch (variant) {
      case "primary":
        return `${baseClass} bg-yellow-400 border-yellow-600 text-black hover:bg-yellow-300 hover:border-yellow-500`;
      case "secondary":
        return `${baseClass} bg-blue-300 border-blue-500 text-black hover:bg-blue-200 hover:border-blue-400`;
      case "danger":
        return `${baseClass} bg-red-400 border-red-600 text-black hover:bg-red-300 hover:border-red-500`;
    }
  };

  // Generate select class
  const getSelectClass = () => {
    return "mt-2 block w-full px-4 py-3 bg-white dark:bg-gray-700 border-3 border-gray-400 dark:border-gray-600 rounded-xl shadow-md focus:outline-none focus:border-yellow-400 text-base font-medium";
  };

  return (
    <div
      className={`bg-blue-500 dark:bg-blue-600 border-4 border-yellow-400 rounded-xl p-5 shadow-lg ${className}`}
    >
      {(state.gameStatus === "ready" || state.gameStatus === "finished") && (
        <div className="mb-4">
          <h2 className="text-xl font-black mb-4 text-white dark:text-white">
            Game Settings
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-bold text-white dark:text-white">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) =>
                  setSelectedDifficulty(e.target.value as Difficulty)
                }
                className={getSelectClass()}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-white dark:text-white">
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
              <label className="block text-base font-bold text-white dark:text-white">
                Timer Duration
              </label>
              <select
                value={selectedTimerDuration}
                onChange={(e) =>
                  setSelectedTimerDuration(Number(e.target.value))
                }
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
        {(state.gameStatus === "ready" || state.gameStatus === "finished") && (
          <button
            onClick={handleStartGame}
            className={getButtonClass("primary")}
          >
            {state.gameStatus === "finished" ? "Play Again" : "Start Game"}
          </button>
        )}

        {(state.gameStatus === "active" || state.gameStatus === "paused") && (
          <>
            <button
              onClick={handlePauseResumeToggle}
              className={getButtonClass("primary")}
            >
              {state.gameStatus === "active" ? "Pause" : "Resume"}
            </button>

            <button onClick={resetGame} className={getButtonClass("danger")}>
              End Game
            </button>
          </>
        )}
      </div>

      {state.gameStatus === "active" && (
        <div className="mt-4">
          <p className="text-base font-bold text-white dark:text-white">
            Find as many words as you can before time runs out!
          </p>
        </div>
      )}
    </div>
  );
};

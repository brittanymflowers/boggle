import React, { useEffect, useState, useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import { usePreferences } from "../../../context/PreferencesContext";

interface TimerProps {
  className?: string;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ className = "", onTimeUp }) => {
  const { state, endGame } = useGame();
  const { preferences } = usePreferences();
  const [isAlmostFinished, setIsAlmostFinished] = useState(false);

  // Format seconds into MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Calculate the progress percentage
  const calculateProgress = useCallback(() => {
    if (state.gameStatus === "ready") return 100;

    const { timeRemaining } = state;
    const totalTime = preferences.defaultTimerDuration;
    return (timeRemaining / totalTime) * 100;
  }, [state.timeRemaining, state.gameStatus, preferences.defaultTimerDuration]);

  // Handle timer ending
  useEffect(() => {
    if (state.timeRemaining <= 0 && state.gameStatus === "active") {
      endGame();
      if (onTimeUp) {
        onTimeUp();
      }
    }

    // Set almost finished flag when less than 10% time remains
    setIsAlmostFinished(
      state.timeRemaining > 0 &&
        state.timeRemaining <= preferences.defaultTimerDuration * 0.1
    );
  }, [
    state.timeRemaining,
    state.gameStatus,
    endGame,
    onTimeUp,
    preferences.defaultTimerDuration,
  ]);

  // Determine timer classes based on state
  const getTimerClass = () => {
    let baseClass = "font-mono text-2xl font-bold";

    if (state.gameStatus === "paused") {
      baseClass += " text-gray-500 animate-pulse";
    } else if (isAlmostFinished) {
      baseClass += " text-red-600";
    } else if (state.gameStatus === "active") {
      baseClass += " text-green-600";
    } else if (state.gameStatus === "finished") {
      baseClass += " text-gray-600";
    } else {
      baseClass += " text-gray-800 dark:text-gray-200";
    }

    return baseClass;
  };

  // Determine progress bar classes based on state
  const getProgressClass = () => {
    let baseClass = "h-2 transition-all duration-1000 rounded-full";

    if (state.gameStatus === "paused") {
      baseClass += " bg-gray-400";
    } else if (isAlmostFinished) {
      baseClass += " bg-red-500 animate-pulse";
    } else if (state.gameStatus === "active") {
      baseClass += " bg-green-500";
    } else if (state.gameStatus === "finished") {
      baseClass += " bg-gray-500";
    } else {
      baseClass += " bg-indigo-500";
    }

    return baseClass;
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
        <span className={getTimerClass()}>
          {formatTime(state.timeRemaining)}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={getProgressClass()}
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>
    </div>
  );
};

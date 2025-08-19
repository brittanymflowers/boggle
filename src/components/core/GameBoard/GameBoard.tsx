import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../../../context/GameContext2';
import { usePreferences } from '../../../context/PreferencesContext';
// Define Position interface directly
interface Position {
  row: number;
  col: number;
}
import { getPositionFromCoordinates } from '../../../utils/boardGenerator';

interface GameBoardProps {
  onWordSubmit?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onWordSubmit }) => {
  const { state, selectLetter, clearSelection, submitWord } = useGame();
  const { preferences } = usePreferences();
  
  const [cellSize, setCellSize] = useState(60);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Resize cells based on board size
  useEffect(() => {
    if (!boardRef.current) return;
    
    const handleResize = () => {
      if (!boardRef.current) return;
      
      const boardWidth = boardRef.current.offsetWidth;
      const newCellSize = Math.floor(boardWidth / state.boardSize) - 4; // 4px for margin
      setCellSize(newCellSize);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [state.boardSize]);
  
  // Handle mouse/touch down
  const handleMouseDown = (position: Position) => {
    if (state.gameStatus !== 'active') return;
    
    setIsMouseDown(true);
    selectLetter(position);
  };
  
  // Handle mouse/touch move
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMouseDown || state.gameStatus !== 'active') return;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    if (!boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const position = getPositionFromCoordinates(x, y, cellSize);
    
    if (
      position.row >= 0 &&
      position.row < state.boardSize &&
      position.col >= 0 &&
      position.col < state.boardSize
    ) {
      selectLetter(position);
    }
  };
  
  // Handle mouse/touch up
  const handleMouseUp = () => {
    if (!isMouseDown) return;
    
    setIsMouseDown(false);
    
    if (state.currentWord.length >= 3) {
      submitWord();
      if (onWordSubmit) {
        onWordSubmit();
      }
    } else {
      clearSelection();
    }
  };
  
  // Get cell class based on its state
  const getCellClass = (row: number, col: number) => {
    const cell = state.board[row][col];
    let baseClass = 'relative flex items-center justify-center font-bold rounded-md transition-all cursor-pointer select-none';
    
    // Apply size
    baseClass += ` w-[${cellSize}px] h-[${cellSize}px] text-[${Math.floor(cellSize * 0.4)}px]`;
    
    // Apply colors based on state
    if (cell.isSelected) {
      if (preferences.colorBlindMode) {
        baseClass += ' bg-yellow-700 text-white border-2 border-white';
      } else {
        baseClass += ' bg-indigo-600 text-white transform scale-105 shadow-lg';
      }
    } else {
      if (preferences.theme === 'dark') {
        baseClass += ' bg-gray-700 text-white hover:bg-gray-600';
      } else {
        baseClass += ' bg-indigo-100 text-indigo-900 hover:bg-indigo-200';
      }
    }
    
    return baseClass;
  };

  if (state.board.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">Start a new game to generate a board</p>
      </div>
    );
  }

  return (
    <div 
      ref={boardRef}
      className="w-full max-w-lg mx-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${state.boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${state.boardSize}, 1fr)`,
        }}
      >
        {state.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onMouseDown={() => handleMouseDown({ row: rowIndex, col: colIndex })}
              onTouchStart={() => handleMouseDown({ row: rowIndex, col: colIndex })}
            >
              {cell.char}
              {cell.isSelected && (
                <span className="absolute top-1 right-1 text-xs bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center">
                  {state.selectedPath.findIndex(
                    p => p.row === rowIndex && p.col === colIndex
                  ) + 1}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      
      {state.currentWord.length > 0 && (
        <div className="mt-4 p-2 bg-white dark:bg-gray-700 rounded-md text-center">
          <p className="text-xl font-bold tracking-wide">
            {state.currentWord}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({state.currentWord.length} letters)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
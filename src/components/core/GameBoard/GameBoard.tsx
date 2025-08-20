import React, { useRef, useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { usePreferences } from "../../../context/PreferencesContext";
// Define Position interface directly
interface Position {
  row: number;
  col: number;
}
// No longer need getPositionFromCoordinates as we're using direct cell selection

interface GameBoardProps {
  onWordSubmit?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onWordSubmit }) => {
  const { state, selectLetter, clearSelection, submitWord, startGame } =
    useGame();
  const { preferences } = usePreferences();

  // Debug output
  const [cellSize, setCellSize] = useState(60);
  const [isMouseDown, setIsMouseDown] = useState(false);

  console.log("GameBoard rendering with state:", {
    gameStatus: state.gameStatus,
    boardSize: state.boardSize,
    boardLength: state.board.length,
    selectedPath: state.selectedPath
      .map((p) => `(${p.row},${p.col})`)
      .join(" → "),
    currentWord: state.currentWord,
    isMouseDown,
  });
  const boardRef = useRef<HTMLDivElement>(null);

  // Resize cells based on board size
  // Constants for tile gap
  const TILE_GAP = 12; // Increased from 8px to 12px
  
  useEffect(() => {
    if (!boardRef.current) return;

    const handleResize = () => {
      if (!boardRef.current) return;

      const boardWidth = boardRef.current.offsetWidth;
      // Calculate appropriate cell size based on board size
      // Include gap in the calculation (8px between cells)
      const gapSpace = (state.boardSize - 1) * TILE_GAP;
      const availableWidth = boardWidth - gapSpace;
      const newCellSize = Math.floor(availableWidth / state.boardSize);

      // Set a reasonable minimum and maximum size
      const constrainedSize = Math.min(Math.max(newCellSize, 50), 100);
      setCellSize(constrainedSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [state.boardSize]);

  // Handle mouse/touch down
  const handleMouseDown = (position: Position) => {
    if (state.gameStatus !== "active") return;

    // Clear any existing selection first
    clearSelection();

    // Set mouse down state and select the letter
    setIsMouseDown(true);
    console.log(`Mouse down at (${position.row},${position.col})`);
    selectLetter(position);
  };

  // Handle mouse/touch move
  // Track the current cell the mouse is hovering over
  const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
  
  // Handle mouse move - we'll rely on individual cell onMouseEnter events instead
  const handleMouseMove = () => {
    // No longer using global mouse movement for selection
    // Selection is handled by each cell's onMouseEnter event
  };

  // Handle mouse/touch up
  const handleMouseUp = () => {
    if (!isMouseDown) return;

    setIsMouseDown(false);
    setHoveredCell(null);
    
    console.log(
      `Mouse up with word: ${state.currentWord} (length: ${state.currentWord.length})`
    );

    // Add a small delay before submitting or clearing to prevent race conditions
    setTimeout(() => {
      // Make sure we still have the same state reference
      if (state.currentWord.length >= 3) {
        console.log(`Submitting word: ${state.currentWord}`);
        submitWord();
        if (onWordSubmit) {
          onWordSubmit();
        }
      } else if (state.currentWord.length > 0) {
        console.log(`Clearing selection, word too short: ${state.currentWord}`);
        clearSelection();
      }
    }, 50);
  };

  // Get cell class based on its state
  const getCellClass = (row: number, col: number) => {
    const cell = state.board[row][col];
    let baseClass =
      "relative flex items-center justify-center font-black rounded-lg border border-gray-400 transition-all cursor-pointer select-none aspect-square overflow-hidden";

    // Apply adaptive sizing based on cell size
    baseClass += ` w-[${cellSize}px] h-[${cellSize}px]`;

    // Check if this is a Qu tile
    const isQuTile = cell.char === "q" || cell.char === "Q" || cell.char === "QU" || cell.char === "Qu";

    // Add extra padding for Qu tiles at larger board sizes
    if (isQuTile && state.boardSize >= 5) {
      baseClass += " p-1"; // Add some padding for Qu tiles on larger boards
    }

    // Scale text size based on cell size but with a minimum
    const textSize = Math.max(Math.floor(cellSize * 0.7), 36);
    baseClass += ` text-[${textSize}px]`;

    // Apply colors based on state
    if (cell.isSelected) {
      if (preferences.colorBlindMode) {
        baseClass +=
          " bg-yellow-500 text-black border-yellow-700 transform scale-105 shadow-lg";
      } else {
        baseClass += " bg-blue-400 text-blue-900 transform scale-105 shadow-lg";
      }
    } else {
      if (preferences.theme === "dark") {
        baseClass += " bg-gray-200 text-blue-900 hover:bg-gray-300";
      } else {
        baseClass += " bg-gray-100 text-blue-900 hover:bg-gray-200";
      }
    }

    return baseClass;
  };
  
  // No longer need a separate hit area class function

  // Function to start a test game with default settings
  const handleStartTestGame = () => {
    startGame(4, "medium", 180);
  };

  if (state.board.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-blue-500 dark:bg-blue-600 rounded-xl border-4 border-yellow-400 shadow-lg">
        <p className="text-white font-bold text-lg mb-6">
          Start a new game to generate a board
        </p>
        <button
          onClick={handleStartTestGame}
          className="px-6 py-3 bg-yellow-400 text-black font-black rounded-xl border-4 border-yellow-600 hover:bg-yellow-300 hover:border-yellow-500 text-lg shadow-md"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className="w-full max-w-xl mx-auto p-5 bg-blue-900 dark:bg-blue-800 rounded-lg border-2 border-blue-300 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
    >
      <div
        className={`grid board-size-${state.boardSize}`}
        style={{
          gridTemplateColumns: `repeat(${state.boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${state.boardSize}, 1fr)`,
          gap: "12px", // Increased from 8px to 12px for more spacing
        }}
      >
        {state.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
                onMouseDown={(e) => {
                  // Prevent default to avoid text selection
                  e.preventDefault();
                  handleMouseDown(position);
                  // Set this as the hovered cell too
                  setHoveredCell(position);
                }}
                onMouseEnter={() => {
                  // Update the hovered cell
                  setHoveredCell(position);
                  
                  // Only proceed with selection if mouse is down
                  if (!isMouseDown || state.gameStatus !== "active") return;
                  
                  // Don't allow selecting the same cell twice
                  const isAlreadySelected = state.selectedPath.some(
                    (p) => p.row === position.row && p.col === position.col
                  );
                  
                  if (isAlreadySelected) return;
                  
                  // Get the last selected position from the path
                  const lastPosition = state.selectedPath[state.selectedPath.length - 1];
                  
                  // Only select if adjacent to the last position
                  if (lastPosition) {
                    const isAdjacent = 
                      Math.abs(lastPosition.row - position.row) <= 1 &&
                      Math.abs(lastPosition.col - position.col) <= 1 &&
                      !(lastPosition.row === position.row && lastPosition.col === position.col);
                      
                    if (isAdjacent) {
                      console.log(`Selecting letter at position (${position.row}, ${position.col})`);
                      selectLetter(position);
                    }
                  }
                }}
                onTouchStart={() => {
                  handleMouseDown(position);
                  setHoveredCell(position);
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {cell.char === "q" || cell.char === "Q" || cell.char === "QU" || cell.char === "Qu" ? (
                    <span className="leading-none z-10 special-qu relative">
                      <span className="text-[52px]">Q</span>
                      <span className="text-[40px] font-semibold">u</span>
                    </span>
                  ) : (
                    <span className="text-[64px] leading-none z-10">
                      {cell.char.toUpperCase()}
                    </span>
                  )}
                  {/* Visual indicator for selected cells */}
                  {cell.isSelected && (
                    <div 
                      className="absolute rounded-md pointer-events-none z-0"
                      style={{
                        left: '0px',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        background: 'rgba(255,255,255,0.1)'
                      }}
                    />
                  )}
                </div>
                {cell.isSelected && (
                  <span className="absolute top-0.5 right-0.5 text-xs bg-white text-black font-bold rounded-full w-5 h-5 flex items-center justify-center border border-black z-20">
                    {state.selectedPath.findIndex(
                      (p) => p.row === rowIndex && p.col === colIndex
                    ) + 1}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {state.currentWord.length > 0 && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-xl border-4 border-yellow-400 shadow-md text-center">
          <p className="text-2xl font-black tracking-wide">
            {state.currentWord}
            <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              ({state.currentWord.length} letters)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

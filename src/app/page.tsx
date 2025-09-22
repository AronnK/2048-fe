// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import Header from "./components/header";
// import GameBoard from "./components/gameBoard";
// import GameOverOverlay from "./components/gameOverLay";
// import { getEmptyBoard, addRandomTile, moveBoard, isGameOver } from "./game";

// type AutomationMode = "ai" | "ai_alg" | null;

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("api url:", API_URL);

// const App: React.FC = () => {
//   const [board, setBoard] = useState<number[][]>(getEmptyBoard());
//   const [score, setScore] = useState<number>(0);
//   const [bestScore, setBestScore] = useState<number>(0);
//   const [gameOver, setGameOver] = useState<boolean>(false);
//   const [automationMode, setAutomationMode] = useState<AutomationMode>(null);
//   const boardRef = useRef(board);
//   boardRef.current = board;

//   const initializeGame = useCallback(() => {
//     setAutomationMode(null);
//     let newBoard = getEmptyBoard();
//     newBoard = addRandomTile(newBoard);
//     newBoard = addRandomTile(newBoard);
//     setBoard(newBoard);
//     setScore(0);
//     setGameOver(false);
//   }, []);

//   const performMove = useCallback(
//     (direction: "up" | "down" | "left" | "right") => {
//       if (gameOver) return;
//       const [newBoard, scoreGained] = moveBoard(boardRef.current, direction);
//       if (JSON.stringify(newBoard) !== JSON.stringify(boardRef.current)) {
//         const updatedBoard = addRandomTile(newBoard);
//         setBoard(updatedBoard);
//         setScore((prevScore) => {
//           const newScore = prevScore + scoreGained;
//           if (newScore > bestScore) {
//             setBestScore(newScore);
//             localStorage.setItem("bestScore", newScore.toString());
//           }
//           return newScore;
//         });
//         if (isGameOver(updatedBoard)) {
//           setGameOver(true);
//           setAutomationMode(null);
//         }
//       }
//     },
//     [gameOver, bestScore]
//   );

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (automationMode) return;
//       let direction: "up" | "down" | "left" | "right" | null = null;
//       switch (event.key) {
//         case "ArrowUp":
//           direction = "up";
//           break;
//         case "ArrowDown":
//           direction = "down";
//           break;
//         case "ArrowLeft":
//           direction = "left";
//           break;
//         case "ArrowRight":
//           direction = "right";
//           break;
//         default:
//           return;
//       }
//       performMove(direction);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [automationMode, performMove]);

//   useEffect(() => {
//     if (!automationMode || gameOver) {
//       return;
//     }

//     const fetchNextMove = async () => {
//       if (!API_URL) {
//         console.error(
//           "API_URL is not defined. Please check your .env.local file."
//         );
//         setAutomationMode(null);
//         return;
//       }

//       const endpoint =
//         automationMode === "ai"
//           ? `${API_URL}/get-move-ai`
//           : `${API_URL}/get-move-ai-alg`;

//       try {
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ board: boardRef.current }),
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             `HTTP error! status: ${response.status}, message: ${errorData.error}`
//           );
//         }
//         const data = await response.json();
//         const moveMap: ("up" | "right" | "down" | "left")[] = [
//           "up",
//           "right",
//           "down",
//           "left",
//         ];
//         const direction = moveMap[data.move];
//         performMove(direction);
//       } catch (error) {
//         console.error("Failed to fetch move from backend:", error);
//         setAutomationMode(null);
//       }
//     };

//     const timer = setTimeout(fetchNextMove, 200);
//     return () => clearTimeout(timer);
//   }, [automationMode, gameOver, board, performMove]);

//   useEffect(() => {
//     const savedBestScore = localStorage.getItem("bestScore");
//     if (savedBestScore) setBestScore(parseInt(savedBestScore));
//     initializeGame();
//   }, [initializeGame]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
//       <Header score={score} bestScore={bestScore} />
//       <GameBoard
//         board={board}
//         isGameOver={gameOver}
//         onRetry={initializeGame}
//         Overlay={<GameOverOverlay onRetry={initializeGame} />}
//       />
//       <div className="flex space-x-2 mt-4 md:mt-6">
//         <button
//           onClick={initializeGame}
//           className="px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-500"
//           disabled={!!automationMode}
//         >
//           New Game
//         </button>

//         {automationMode ? (
//           <button
//             onClick={() => setAutomationMode(null)}
//             className="px-4 md:px-6 py-2 md:py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
//           >
//             Stop
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={() => setAutomationMode("ai")}
//               className="px-4 md:px-6 py-2 md:py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               AI
//             </button>
//             <button
//               onClick={() => setAutomationMode("ai_alg")}
//               className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               AI + Alg
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./components/header";
import GameBoard from "./components/gameBoard";
import GameOverOverlay from "./components/gameOverLay";
import {
  getEmptyBoard,
  addRandomTile,
  moveBoard,
  isGameOver,
  getValidMoves,
} from "./game";
import { getBestMove } from "./model";

const App: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(getEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isAutomating, setIsAutomating] = useState<boolean>(false);
  const boardRef = useRef(board);
  boardRef.current = board;

  const initializeGame = useCallback(() => {
    setIsAutomating(false);
    let newBoard = getEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  const performMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver) return;
      const [newBoard, scoreGained] = moveBoard(boardRef.current, direction);
      if (JSON.stringify(newBoard) !== JSON.stringify(boardRef.current)) {
        const updatedBoard = addRandomTile(newBoard);
        setBoard(updatedBoard);
        setScore((prevScore) => {
          const newScore = prevScore + scoreGained;
          if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem("bestScore", newScore.toString());
          }
          return newScore;
        });
        if (isGameOver(updatedBoard)) {
          setGameOver(true);
          setIsAutomating(false);
        }
      }
    },
    [gameOver, bestScore]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAutomating) return;
      let direction: "up" | "down" | "left" | "right" | null = null;
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        default:
          return;
      }
      performMove(direction);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAutomating, performMove]);

  // This is the updated AI logic loop
  useEffect(() => {
    if (!isAutomating || gameOver) return;

    const runAiMove = async () => {
      try {
        const validMoves = getValidMoves(boardRef.current);
        const bestActionIndex = await getBestMove(boardRef.current, validMoves);

        if (bestActionIndex !== -1) {
          const moveMap: ("up" | "right" | "down" | "left")[] = [
            "up",
            "right",
            "down",
            "left",
          ];
          const direction = moveMap[bestActionIndex];
          performMove(direction);
        }
      } catch (error) {
        console.error("AI move failed:", error);
        setIsAutomating(false);
      }
    };

    const timer = setTimeout(runAiMove, 300);
    return () => clearTimeout(timer);
  }, [isAutomating, gameOver, board, performMove]);

  useEffect(() => {
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore) setBestScore(parseInt(savedBestScore));
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <Header score={score} bestScore={bestScore} />
      <GameBoard
        board={board}
        isGameOver={gameOver}
        onRetry={initializeGame}
        Overlay={<GameOverOverlay onRetry={initializeGame} />}
      />
      <div className="flex space-x-2 mt-4 md:mt-6">
        <button
          onClick={initializeGame}
          className="px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-500"
          disabled={isAutomating}
        >
          New Game
        </button>
        <button
          onClick={() => setIsAutomating((prev) => !prev)}
          className={`px-4 md:px-6 py-2 md:py-3 text-white rounded-md ${
            isAutomating
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isAutomating ? "Stop AI" : "Start AI"}
        </button>
      </div>
    </div>
  );
};

export default App;

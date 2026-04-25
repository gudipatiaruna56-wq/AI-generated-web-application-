import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export default function SnakeGame({ onScoreChange, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const spawnFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y)) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(spawnFood());
    setIsPaused(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
      case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
      case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
      case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      case ' ': setIsPaused(prev => !prev); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused) return;

    const moveSnake = setInterval(() => {
      setSnake(prevSnake => {
        const head = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          onGameOver();
          setIsPaused(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          onGameOver();
          setIsPaused(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          if (newScore > highScore) setHighScore(newScore);
          setFood(spawnFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(moveSnake);
  }, [direction, food, isPaused, onGameOver, onScoreChange, spawnFood, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    
    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00cccc';
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex gap-8 font-mono text-sm tracking-widest text-[#39ff14]">
        <div>SCORE: {score.toString().padStart(4, '0')}</div>
        <div>HIGH: {highScore.toString().padStart(4, '0')}</div>
      </div>

      <div className="relative border-4 border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />
        
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="mb-4 animate-pulse text-2xl font-bold tracking-[0.2em] text-neon-magenta">
                SYSTEM_PAUSED
              </h2>
              <button
                onClick={() => setIsPaused(false)}
                className="glitch-hover border-2 border-neon-cyan px-6 py-2 text-neon-cyan transition-colors hover:bg-neon-cyan hover:text-black"
              >
                RESUME_EXECUTION
              </button>
              <p className="mt-4 text-[10px] text-gray-500">[SPACE] TO TOGGLE</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={resetGame}
          className="border border-glitch-red px-4 py-1 text-[10px] text-glitch-red hover:bg-glitch-red hover:text-white"
        >
          REBOOT_CORE
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  className?: string;
}

export function GameBoard({ gameState, className }: GameBoardProps) {
  const { snake, food, gridSize, status } = gameState;

  const getCellContent = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
    const isFood = food.x === x && food.y === y;

    if (isSnakeHead) {
      return (
        <div className="w-full h-full bg-snake rounded-sm shadow-[0_0_10px_hsl(var(--snake-glow)),0_0_20px_hsl(var(--snake-glow)/0.5)] animate-pulse-glow" />
      );
    }
    if (isSnakeBody) {
      return (
        <div className="w-full h-full bg-snake/80 rounded-sm shadow-[0_0_5px_hsl(var(--snake))]" />
      );
    }
    if (isFood) {
      return (
        <div className="w-full h-full bg-food rounded-full shadow-[0_0_15px_hsl(var(--food-glow)),0_0_30px_hsl(var(--food-glow)/0.5)] animate-pulse-glow" />
      );
    }
    return null;
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className="bg-grid border-2 border-border rounded-lg overflow-hidden crt-curve relative"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          aspectRatio: '1',
        }}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none z-10" />
        
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          return (
            <div
              key={`${x}-${y}`}
              className="border border-grid-line/30 flex items-center justify-center p-0.5"
            >
              {getCellContent(x, y)}
            </div>
          );
        })}
      </div>

      {/* Game Over Overlay */}
      {status === 'gameover' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <h2 className="font-pixel text-2xl text-destructive text-glow mb-4 animate-blink">
              GAME OVER
            </h2>
            <p className="font-mono text-foreground">
              Score: <span className="text-primary text-glow">{gameState.score}</span>
            </p>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {status === 'paused' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <h2 className="font-pixel text-2xl text-neon-yellow text-glow-cyan animate-blink">
            PAUSED
          </h2>
        </div>
      )}

      {/* Start Overlay */}
      {status === 'idle' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <h2 className="font-pixel text-xl text-primary text-glow mb-4">
              READY
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              Press SPACE to start
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameMode, Direction } from '@/types/game';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  DEFAULT_GRID_SIZE,
} from '@/lib/gameLogic';

const GAME_SPEED = 100;

export function useGame(initialMode: GameMode = 'walls') {
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialState(initialMode, DEFAULT_GRID_SIZE)
  );
  const gameLoopRef = useRef<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyToDirection: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      W: 'UP',
      s: 'DOWN',
      S: 'DOWN',
      a: 'LEFT',
      A: 'LEFT',
      d: 'RIGHT',
      D: 'RIGHT',
    };

    const direction = keyToDirection[e.key];
    if (direction) {
      e.preventDefault();
      setGameState(prev => changeDirection(prev, direction));
    }

    if (e.key === ' ') {
      e.preventDefault();
      setGameState(prev => {
        if (prev.status === 'playing') return pauseGame(prev);
        if (prev.status === 'paused') return resumeGame(prev);
        if (prev.status === 'idle') return startGame(prev);
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      gameLoopRef.current = window.setInterval(() => {
        setGameState(prev => moveSnake(prev));
      }, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.status]);

  const start = useCallback(() => {
    setGameState(prev => startGame(prev));
  }, []);

  const pause = useCallback(() => {
    setGameState(prev => pauseGame(prev));
  }, []);

  const resume = useCallback(() => {
    setGameState(prev => resumeGame(prev));
  }, []);

  const reset = useCallback(() => {
    setGameState(prev => resetGame(prev));
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(createInitialState(mode, DEFAULT_GRID_SIZE));
  }, []);

  const setDirection = useCallback((direction: Direction) => {
    setGameState(prev => changeDirection(prev, direction));
  }, []);

  return {
    gameState,
    start,
    pause,
    resume,
    reset,
    setMode,
    setDirection,
  };
}

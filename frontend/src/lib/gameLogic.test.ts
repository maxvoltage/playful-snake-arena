import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getNextPosition,
  checkCollision,
  isOppositeDirection,
  moveSnake,
  changeDirection,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  INITIAL_SNAKE_LENGTH,
} from './gameLogic';
import { Direction, GameState, Position } from '@/types/game';

describe('createInitialState', () => {
  it('should create initial state with correct snake length', () => {
    const state = createInitialState('walls', 20);
    expect(state.snake.length).toBe(INITIAL_SNAKE_LENGTH);
  });

  it('should set correct initial direction', () => {
    const state = createInitialState('walls', 20);
    expect(state.direction).toBe('RIGHT');
    expect(state.nextDirection).toBe('RIGHT');
  });

  it('should set idle status', () => {
    const state = createInitialState('walls', 20);
    expect(state.status).toBe('idle');
  });

  it('should set correct mode', () => {
    const wallsState = createInitialState('walls', 20);
    expect(wallsState.mode).toBe('walls');

    const passthroughState = createInitialState('passthrough', 20);
    expect(passthroughState.mode).toBe('passthrough');
  });

  it('should generate food that is not on the snake', () => {
    const state = createInitialState('walls', 20);
    const isOnSnake = state.snake.some(
      (seg) => seg.x === state.food.x && seg.y === state.food.y
    );
    expect(isOnSnake).toBe(false);
  });
});

describe('generateFood', () => {
  it('should generate food within grid bounds', () => {
    const snake: Position[] = [{ x: 5, y: 5 }];
    const food = generateFood(snake, 20);
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(20);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(20);
  });

  it('should not generate food on snake', () => {
    const snake: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    for (let i = 0; i < 100; i++) {
      const food = generateFood(snake, 20);
      const isOnSnake = snake.some(
        (seg) => seg.x === food.x && seg.y === food.y
      );
      expect(isOnSnake).toBe(false);
    }
  });
});

describe('getNextPosition', () => {
  const head: Position = { x: 10, y: 10 };

  describe('walls mode', () => {
    it('should move up correctly', () => {
      const next = getNextPosition(head, 'UP', 20, 'walls');
      expect(next).toEqual({ x: 10, y: 9 });
    });

    it('should move down correctly', () => {
      const next = getNextPosition(head, 'DOWN', 20, 'walls');
      expect(next).toEqual({ x: 10, y: 11 });
    });

    it('should move left correctly', () => {
      const next = getNextPosition(head, 'LEFT', 20, 'walls');
      expect(next).toEqual({ x: 9, y: 10 });
    });

    it('should move right correctly', () => {
      const next = getNextPosition(head, 'RIGHT', 20, 'walls');
      expect(next).toEqual({ x: 11, y: 10 });
    });

    it('should return null when hitting top wall', () => {
      const next = getNextPosition({ x: 5, y: 0 }, 'UP', 20, 'walls');
      expect(next).toBeNull();
    });

    it('should return null when hitting bottom wall', () => {
      const next = getNextPosition({ x: 5, y: 19 }, 'DOWN', 20, 'walls');
      expect(next).toBeNull();
    });

    it('should return null when hitting left wall', () => {
      const next = getNextPosition({ x: 0, y: 5 }, 'LEFT', 20, 'walls');
      expect(next).toBeNull();
    });

    it('should return null when hitting right wall', () => {
      const next = getNextPosition({ x: 19, y: 5 }, 'RIGHT', 20, 'walls');
      expect(next).toBeNull();
    });
  });

  describe('passthrough mode', () => {
    it('should wrap around when going through top', () => {
      const next = getNextPosition({ x: 5, y: 0 }, 'UP', 20, 'passthrough');
      expect(next).toEqual({ x: 5, y: 19 });
    });

    it('should wrap around when going through bottom', () => {
      const next = getNextPosition({ x: 5, y: 19 }, 'DOWN', 20, 'passthrough');
      expect(next).toEqual({ x: 5, y: 0 });
    });

    it('should wrap around when going through left', () => {
      const next = getNextPosition({ x: 0, y: 5 }, 'LEFT', 20, 'passthrough');
      expect(next).toEqual({ x: 19, y: 5 });
    });

    it('should wrap around when going through right', () => {
      const next = getNextPosition({ x: 19, y: 5 }, 'RIGHT', 20, 'passthrough');
      expect(next).toEqual({ x: 0, y: 5 });
    });
  });
});

describe('checkCollision', () => {
  it('should return false when no collision', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    expect(checkCollision(snake[0], snake)).toBe(false);
  });

  it('should return true when snake hits itself', () => {
    const snake: Position[] = [
      { x: 4, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    expect(checkCollision(snake[0], snake)).toBe(true);
  });
});

describe('isOppositeDirection', () => {
  it('should return true for opposite directions', () => {
    expect(isOppositeDirection('UP', 'DOWN')).toBe(true);
    expect(isOppositeDirection('DOWN', 'UP')).toBe(true);
    expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true);
    expect(isOppositeDirection('RIGHT', 'LEFT')).toBe(true);
  });

  it('should return false for non-opposite directions', () => {
    expect(isOppositeDirection('UP', 'LEFT')).toBe(false);
    expect(isOppositeDirection('UP', 'RIGHT')).toBe(false);
    expect(isOppositeDirection('DOWN', 'LEFT')).toBe(false);
    expect(isOppositeDirection('DOWN', 'RIGHT')).toBe(false);
  });
});

describe('moveSnake', () => {
  it('should not move when game is not playing', () => {
    const state = createInitialState('walls', 20);
    const newState = moveSnake(state);
    expect(newState).toEqual(state);
  });

  it('should move snake in current direction', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
    };
    const head = state.snake[0];
    const newState = moveSnake(state);
    expect(newState.snake[0].x).toBe(head.x + 1);
    expect(newState.snake[0].y).toBe(head.y);
  });

  it('should grow snake when eating food', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
    };
    state.food = { x: state.snake[0].x + 1, y: state.snake[0].y };
    const oldLength = state.snake.length;
    const newState = moveSnake(state);
    expect(newState.snake.length).toBe(oldLength + 1);
    expect(newState.score).toBe(state.score + 10);
  });

  it('should set gameover when hitting wall in walls mode', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
      snake: [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
    };
    const newState = moveSnake(state);
    expect(newState.status).toBe('gameover');
  });
});

describe('changeDirection', () => {
  it('should change direction when valid', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
    };
    const newState = changeDirection(state, 'UP');
    expect(newState.nextDirection).toBe('UP');
  });

  it('should not change to opposite direction', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
      direction: 'RIGHT',
    };
    const newState = changeDirection(state, 'LEFT');
    expect(newState.nextDirection).toBe('RIGHT');
  });

  it('should not change direction when not playing', () => {
    const state = createInitialState('walls', 20);
    const newState = changeDirection(state, 'UP');
    expect(newState.nextDirection).toBe('RIGHT');
  });
});

describe('game state transitions', () => {
  it('should start game', () => {
    const state = createInitialState('walls', 20);
    const newState = startGame(state);
    expect(newState.status).toBe('playing');
  });

  it('should pause game', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'playing',
    };
    const newState = pauseGame(state);
    expect(newState.status).toBe('paused');
  });

  it('should not pause when not playing', () => {
    const state = createInitialState('walls', 20);
    const newState = pauseGame(state);
    expect(newState.status).toBe('idle');
  });

  it('should resume game', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'paused',
    };
    const newState = resumeGame(state);
    expect(newState.status).toBe('playing');
  });

  it('should not resume when not paused', () => {
    const state = createInitialState('walls', 20);
    const newState = resumeGame(state);
    expect(newState.status).toBe('idle');
  });

  it('should reset game', () => {
    const state: GameState = {
      ...createInitialState('walls', 20),
      status: 'gameover',
      score: 100,
    };
    const newState = resetGame(state);
    expect(newState.status).toBe('idle');
    expect(newState.score).toBe(0);
    expect(newState.mode).toBe('walls');
  });
});

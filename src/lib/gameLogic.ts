import { Direction, GameMode, GameState, Position } from '@/types/game';

export const INITIAL_SNAKE_LENGTH = 3;
export const DEFAULT_GRID_SIZE = 20;

export function createInitialState(mode: GameMode, gridSize: number = DEFAULT_GRID_SIZE): GameState {
  const centerX = Math.floor(gridSize / 2);
  const centerY = Math.floor(gridSize / 2);
  
  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: centerX - i, y: centerY });
  }

  return {
    snake,
    food: generateFood(snake, gridSize),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    status: 'idle',
    mode,
    gridSize,
  };
}

export function generateFood(snake: Position[], gridSize: number): Position {
  const occupiedPositions = new Set(snake.map(p => `${p.x},${p.y}`));
  
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (occupiedPositions.has(`${food.x},${food.y}`));
  
  return food;
}

export function getNextPosition(head: Position, direction: Direction, gridSize: number, mode: GameMode): Position | null {
  let newX = head.x;
  let newY = head.y;

  switch (direction) {
    case 'UP':
      newY -= 1;
      break;
    case 'DOWN':
      newY += 1;
      break;
    case 'LEFT':
      newX -= 1;
      break;
    case 'RIGHT':
      newX += 1;
      break;
  }

  if (mode === 'passthrough') {
    newX = (newX + gridSize) % gridSize;
    newY = (newY + gridSize) % gridSize;
    return { x: newX, y: newY };
  } else {
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      return null;
    }
    return { x: newX, y: newY };
  }
}

export function checkCollision(head: Position, body: Position[]): boolean {
  return body.some((segment, index) => 
    index > 0 && segment.x === head.x && segment.y === head.y
  );
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[current] === next;
}

export function moveSnake(state: GameState): GameState {
  if (state.status !== 'playing') return state;

  const direction = state.nextDirection;
  const head = state.snake[0];
  const newHead = getNextPosition(head, direction, state.gridSize, state.mode);

  if (newHead === null) {
    return { ...state, status: 'gameover', direction };
  }

  const newSnake = [newHead, ...state.snake];
  
  if (checkCollision(newHead, newSnake)) {
    return { ...state, status: 'gameover', direction };
  }

  const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
  
  if (!ateFood) {
    newSnake.pop();
  }

  return {
    ...state,
    snake: newSnake,
    food: ateFood ? generateFood(newSnake, state.gridSize) : state.food,
    score: ateFood ? state.score + 10 : state.score,
    direction,
  };
}

export function changeDirection(state: GameState, newDirection: Direction): GameState {
  if (state.status !== 'playing') return state;
  if (isOppositeDirection(state.direction, newDirection)) return state;
  
  return { ...state, nextDirection: newDirection };
}

export function startGame(state: GameState): GameState {
  return { ...state, status: 'playing' };
}

export function pauseGame(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  return { ...state, status: 'paused' };
}

export function resumeGame(state: GameState): GameState {
  if (state.status !== 'paused') return state;
  return { ...state, status: 'playing' };
}

export function resetGame(state: GameState): GameState {
  return createInitialState(state.mode, state.gridSize);
}

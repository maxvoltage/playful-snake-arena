export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'walls' | 'passthrough';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
  mode: GameMode;
  gridSize: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface LiveGame {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  spectators: number;
  startedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

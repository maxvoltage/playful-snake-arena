import { User, LeaderboardEntry, LiveGame, GameMode } from '@/types/game';

// Simulated delay to mimic network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let currentUser: User | null = null;
let mockUsers: Map<string, { user: User; password: string }> = new Map([
  ['player1', { 
    user: { id: '1', username: 'player1', email: 'player1@snake.io', createdAt: '2024-01-01' },
    password: 'password123'
  }],
  ['NeonViper', { 
    user: { id: '2', username: 'NeonViper', email: 'neon@snake.io', createdAt: '2024-01-15' },
    password: 'password123'
  }],
]);

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'NeonViper', score: 2450, mode: 'walls', date: '2024-01-10' },
  { id: '2', rank: 2, username: 'PixelHunter', score: 2100, mode: 'walls', date: '2024-01-09' },
  { id: '3', rank: 3, username: 'RetroGamer', score: 1890, mode: 'passthrough', date: '2024-01-08' },
  { id: '4', rank: 4, username: 'ArcadeKing', score: 1750, mode: 'walls', date: '2024-01-07' },
  { id: '5', rank: 5, username: 'SnakeMaster', score: 1680, mode: 'passthrough', date: '2024-01-06' },
  { id: '6', rank: 6, username: 'ByteRunner', score: 1520, mode: 'walls', date: '2024-01-05' },
  { id: '7', rank: 7, username: 'CyberSlither', score: 1450, mode: 'passthrough', date: '2024-01-04' },
  { id: '8', rank: 8, username: 'GlitchGamer', score: 1320, mode: 'walls', date: '2024-01-03' },
  { id: '9', rank: 9, username: 'NightCrawler', score: 1200, mode: 'walls', date: '2024-01-02' },
  { id: '10', rank: 10, username: 'TurboTail', score: 1100, mode: 'passthrough', date: '2024-01-01' },
];

const mockLiveGames: LiveGame[] = [
  { id: 'live1', username: 'NeonViper', score: 340, mode: 'walls', spectators: 12, startedAt: new Date().toISOString() },
  { id: 'live2', username: 'PixelHunter', score: 180, mode: 'passthrough', spectators: 8, startedAt: new Date().toISOString() },
  { id: 'live3', username: 'RetroGamer', score: 520, mode: 'walls', spectators: 23, startedAt: new Date().toISOString() },
  { id: 'live4', username: 'ArcadeKing', score: 90, mode: 'passthrough', spectators: 5, startedAt: new Date().toISOString() },
];

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth API
export const authApi = {
  async login(username: string, password: string): Promise<ApiResponse<User>> {
    await delay(500);
    
    const userData = mockUsers.get(username);
    if (!userData) {
      return { success: false, error: 'User not found' };
    }
    if (userData.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    currentUser = userData.user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, data: currentUser };
  },

  async signup(username: string, email: string, password: string): Promise<ApiResponse<User>> {
    await delay(500);
    
    if (mockUsers.has(username)) {
      return { success: false, error: 'Username already exists' };
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.set(username, { user: newUser, password });
    currentUser = newUser;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, data: newUser };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
    return { success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await delay(100);
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return { success: true, data: currentUser };
    }
    return { success: true, data: null };
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<ApiResponse<LeaderboardEntry[]>> {
    await delay(300);
    let filtered = mockLeaderboard;
    if (mode) {
      filtered = mockLeaderboard.filter(entry => entry.mode === mode);
    }
    return { success: true, data: filtered };
  },

  async submitScore(score: number, mode: GameMode): Promise<ApiResponse<LeaderboardEntry>> {
    await delay(300);
    
    if (!currentUser) {
      return { success: false, error: 'Must be logged in to submit score' };
    }

    const newEntry: LeaderboardEntry = {
      id: Math.random().toString(36).substr(2, 9),
      rank: 0,
      username: currentUser.username,
      score,
      mode,
      date: new Date().toISOString().split('T')[0],
    };

    return { success: true, data: newEntry };
  },
};

// Live Games API
export const liveGamesApi = {
  async getLiveGames(): Promise<ApiResponse<LiveGame[]>> {
    await delay(200);
    return { success: true, data: mockLiveGames };
  },

  async getGameById(gameId: string): Promise<ApiResponse<LiveGame | null>> {
    await delay(100);
    const game = mockLiveGames.find(g => g.id === gameId);
    return { success: true, data: game || null };
  },

  async joinSpectators(gameId: string): Promise<ApiResponse<null>> {
    await delay(100);
    const game = mockLiveGames.find(g => g.id === gameId);
    if (game) {
      game.spectators += 1;
    }
    return { success: true };
  },

  async leaveSpectators(gameId: string): Promise<ApiResponse<null>> {
    await delay(100);
    const game = mockLiveGames.find(g => g.id === gameId);
    if (game && game.spectators > 0) {
      game.spectators -= 1;
    }
    return { success: true };
  },
};

// Export all APIs as a single object
export const api = {
  auth: authApi,
  leaderboard: leaderboardApi,
  liveGames: liveGamesApi,
};

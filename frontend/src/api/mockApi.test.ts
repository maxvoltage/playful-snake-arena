import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi, leaderboardApi, liveGamesApi, _resetMockApi } from './mockApi';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('authApi', () => {
  beforeEach(() => {
    localStorageMock.clear();
    _resetMockApi();
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      const result = await authApi.login('player1', 'password123');
      expect(result.success).toBe(true);
      expect(result.data?.username).toBe('player1');
    });

    it('should fail with wrong password', async () => {
      const result = await authApi.login('player1', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid password');
    });

    it('should fail with non-existent user', async () => {
      const result = await authApi.login('nonexistent', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should store user in localStorage', async () => {
      await authApi.login('player1', 'password123');
      const stored = localStorageMock.getItem('snake_user');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!).username).toBe('player1');
    });
  });

  describe('signup', () => {
    it('should create new user', async () => {
      const result = await authApi.signup('newuser', 'new@test.com', 'pass123');
      expect(result.success).toBe(true);
      expect(result.data?.username).toBe('newuser');
      expect(result.data?.email).toBe('new@test.com');
    });

    it('should fail with existing username', async () => {
      const result = await authApi.signup('player1', 'test@test.com', 'pass123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
    });
  });

  describe('logout', () => {
    it('should clear user data', async () => {
      await authApi.login('player1', 'password123');
      await authApi.logout();
      const stored = localStorageMock.getItem('snake_user');
      expect(stored).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', async () => {
      const result = await authApi.getCurrentUser();
      expect(result.data).toBeNull();
    });

    it('should return user when logged in', async () => {
      await authApi.login('player1', 'password123');
      const result = await authApi.getCurrentUser();
      expect(result.data?.username).toBe('player1');
    });
  });
});

describe('leaderboardApi', () => {
  describe('getLeaderboard', () => {
    it('should return all leaderboard entries', async () => {
      const result = await leaderboardApi.getLeaderboard();
      expect(result.success).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('should filter by game mode', async () => {
      const result = await leaderboardApi.getLeaderboard('walls');
      expect(result.success).toBe(true);
      expect(result.data!.every(entry => entry.mode === 'walls')).toBe(true);
    });
  });

  describe('submitScore', () => {
    beforeEach(() => {
      localStorageMock.clear();
      _resetMockApi();
    });

    it('should fail when not logged in', async () => {
      const result = await leaderboardApi.submitScore(100, 'walls');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Must be logged in to submit score');
    });

    it('should submit score when logged in', async () => {
      await authApi.login('player1', 'password123');
      const result = await leaderboardApi.submitScore(100, 'walls');
      expect(result.success).toBe(true);
      expect(result.data?.score).toBe(100);
      expect(result.data?.mode).toBe('walls');
    });
  });
});

describe('liveGamesApi', () => {
  describe('getLiveGames', () => {
    it('should return live games', async () => {
      const result = await liveGamesApi.getLiveGames();
      expect(result.success).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });
  });

  describe('getGameById', () => {
    it('should return game when found', async () => {
      const result = await liveGamesApi.getGameById('live1');
      expect(result.success).toBe(true);
      expect(result.data).not.toBeNull();
    });

    it('should return null when not found', async () => {
      const result = await liveGamesApi.getGameById('nonexistent');
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('spectator management', () => {
    it('should increment spectators when joining', async () => {
      const before = await liveGamesApi.getGameById('live1');
      const initialCount = before.data!.spectators;

      await liveGamesApi.joinSpectators('live1');

      const after = await liveGamesApi.getGameById('live1');
      expect(after.data!.spectators).toBe(initialCount + 1);
    });

    it('should decrement spectators when leaving', async () => {
      const before = await liveGamesApi.getGameById('live1');
      const initialCount = before.data!.spectators;

      await liveGamesApi.leaveSpectators('live1');

      const after = await liveGamesApi.getGameById('live1');
      expect(after.data!.spectators).toBe(initialCount - 1);
    });
  });
});

import { User, LeaderboardEntry, LiveGame, GameMode } from '@/types/game';

const BASE_URL = import.meta.env.PROD
    ? '/api'
    : 'http://localhost:3000';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || 'An unexpected error occurred',
            };
        }

        return {
            success: true,
            data: data as T,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
        };
    }
}

export const authApi = {
    async login(username: string, password: string): Promise<ApiResponse<User>> {
        const result = await request<User>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (result.success && result.data) {
            localStorage.setItem('snake_user', JSON.stringify(result.data));
        }
        return result;
    },

    async signup(username: string, email: string, password: string): Promise<ApiResponse<User>> {
        const result = await request<User>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
        if (result.success && result.data) {
            localStorage.setItem('snake_user', JSON.stringify(result.data));
        }
        return result;
    },

    async logout(): Promise<ApiResponse<null>> {
        const result = await request<null>('/auth/logout', {
            method: 'POST',
        });
        if (result.success) {
            localStorage.removeItem('snake_user');
        }
        return result;
    },

    async getCurrentUser(): Promise<ApiResponse<User | null>> {
        // Note: Our current simple backend auth relies on a side-effect (current_user in memory)
        // or we can just read from localStorage for now since we don't have real session management yet.
        const result = await request<User>('/auth/me', {
            method: 'GET',
        });

        if (result.success && result.data) {
            return result;
        }

        // Fallback/Cleanup if 401
        localStorage.removeItem('snake_user');
        return { success: true, data: null };
    },
};

export const leaderboardApi = {
    async getLeaderboard(mode?: GameMode): Promise<ApiResponse<LeaderboardEntry[]>> {
        const query = mode ? `?mode=${mode}` : '';
        return request<LeaderboardEntry[]>(`/leaderboard${query}`);
    },

    async submitScore(score: number, mode: GameMode): Promise<ApiResponse<LeaderboardEntry>> {
        return request<LeaderboardEntry>('/leaderboard', {
            method: 'POST',
            body: JSON.stringify({ score, mode }),
        });
    },
};

export const liveGamesApi = {
    async getLiveGames(): Promise<ApiResponse<LiveGame[]>> {
        return request<LiveGame[]>('/live-games');
    },

    async getGameById(gameId: string): Promise<ApiResponse<LiveGame | null>> {
        return request<LiveGame>(`/live-games/${gameId}`);
    },

    async joinSpectators(gameId: string): Promise<ApiResponse<null>> {
        return request<null>(`/live-games/${gameId}/spectate`, {
            method: 'POST',
        });
    },

    async leaveSpectators(gameId: string): Promise<ApiResponse<null>> {
        return request<null>(`/live-games/${gameId}/spectate`, {
            method: 'DELETE',
        });
    },
};

export const api = {
    auth: authApi,
    leaderboard: leaderboardApi,
    liveGames: liveGamesApi,
};

from typing import Dict, List, Optional
from datetime import datetime
import uuid
from models import User, LeaderboardEntry, LiveGame, GameMode

class MockDatabase:
    def __init__(self):
        self.users: Dict[str, dict] = {
            "player1": {
                "user": User(id="1", username="player1", email="player1@snake.io", createdAt=datetime(2024, 1, 1)),
                "password": "password123"
            },
            "NeonViper": {
                "user": User(id="2", username="NeonViper", email="neon@snake.io", createdAt=datetime(2024, 1, 15)),
                "password": "password123"
            }
        }
        self.leaderboard: List[LeaderboardEntry] = [
            LeaderboardEntry(id="1", rank=1, username="NeonViper", score=2450, mode=GameMode.WALLS, date="2024-01-10"),
            LeaderboardEntry(id="2", rank=2, username="PixelHunter", score=2100, mode=GameMode.WALLS, date="2024-01-09"),
            LeaderboardEntry(id="3", rank=3, username="RetroGamer", score=1890, mode=GameMode.PASSTHROUGH, date="2024-01-08"),
        ]
        self.live_games: List[LiveGame] = [
            LiveGame(id="live1", username="NeonViper", score=340, mode=GameMode.WALLS, spectators=12, startedAt=datetime.now()),
            LiveGame(id="live2", username="PixelHunter", score=180, mode=GameMode.PASSTHROUGH, spectators=8, startedAt=datetime.now()),
        ]
        self.current_user: Optional[User] = None

    def get_user_by_username(self, username: str) -> Optional[dict]:
        return self.users.get(username)

    def add_user(self, username: str, email: str, password: str) -> User:
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            createdAt=datetime.now()
        )
        self.users[username] = {"user": user, "password": password}
        return user

    def get_leaderboard(self, mode: Optional[GameMode] = None) -> List[LeaderboardEntry]:
        if mode:
            return [entry for entry in self.leaderboard if entry.mode == mode]
        return self.leaderboard

    def add_leaderboard_entry(self, username: str, score: int, mode: GameMode) -> LeaderboardEntry:
        entry = LeaderboardEntry(
            id=str(uuid.uuid4()),
            rank=0, # Simplification: rank not calculated in mock
            username=username,
            score=score,
            mode=mode,
            date=datetime.now().strftime("%Y-%m-%d")
        )
        self.leaderboard.append(entry)
        self.leaderboard.sort(key=lambda x: x.score, reverse=True)
        # Update ranks
        for i, e in enumerate(self.leaderboard):
            e.rank = i + 1
        return entry

    def get_live_games(self) -> List[LiveGame]:
        return self.live_games

    def get_live_game_by_id(self, game_id: str) -> Optional[LiveGame]:
        for game in self.live_games:
            if game.id == game_id:
                return game
        return None

db = MockDatabase()

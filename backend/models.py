from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class GameMode(str, Enum):
    WALLS = "walls"
    PASSTHROUGH = "passthrough"

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    createdAt: datetime

class LeaderboardEntry(BaseModel):
    id: str
    rank: int
    username: str
    score: int
    mode: GameMode
    date: str

class LiveGame(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    spectators: int
    startedAt: datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class ScoreSubmission(BaseModel):
    score: int
    mode: GameMode

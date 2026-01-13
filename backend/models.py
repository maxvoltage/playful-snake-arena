from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class GameMode(str, Enum):
    WALLS = "walls"
    PASSTHROUGH = "passthrough"

class DBUser(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBLeaderboardEntry(Base):
    __tablename__ = "leaderboard"
    id = Column(String, primary_key=True)
    username = Column(String, index=True)
    score = Column(Integer, index=True)
    mode = Column(SQLEnum(GameMode))
    date = Column(String)

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    createdAt: datetime

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    id: str
    rank: int
    username: str
    score: int
    mode: GameMode
    date: str

    class Config:
        from_attributes = True

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

from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import List, Optional
from datetime import datetime, UTC
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
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
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

class DBLeaderboardEntry(Base):
    __tablename__ = "leaderboard"
    id = Column(String, primary_key=True)
    username = Column(String, index=True)
    score = Column(Integer, index=True)
    mode = Column(SQLEnum(GameMode))
    date = Column(String)

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    username: str
    email: EmailStr
    createdAt: datetime = Field(validation_alias="created_at")

class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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

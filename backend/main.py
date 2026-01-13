from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, UTC
import uuid

from models import (
    User, LeaderboardEntry, LiveGame, GameMode, 
    LoginRequest, SignupRequest, ScoreSubmission
)
from database import get_db, init_db
import crud

app = FastAPI(title="Playful Snake Arena API")

# Initialize database
init_db()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for Live Games (since they are transient)
mock_live_games: List[LiveGame] = [
    LiveGame(id="live1", username="NeonViper", score=340, mode=GameMode.WALLS, spectators=12, startedAt=datetime.now(UTC)),
    LiveGame(id="live2", username="PixelHunter", score=180, mode=GameMode.PASSTHROUGH, spectators=8, startedAt=datetime.now(UTC)),
]

# Simple in-memory session management for simulation
# In a real app, this would be JWT or Cookies
auth_sessions = {}

@app.post("/auth/login", response_model=User)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, request.username)
    if not db_user or db_user.password != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Simulate a session
    auth_sessions["current"] = db_user # Simple global for mock compatibility
    
    return User.model_validate(db_user)

@app.post("/auth/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, request.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    
    new_user = crud.create_user(db, request)
    auth_sessions["current"] = new_user
    
    return User.model_validate(new_user)

@app.post("/auth/logout")
async def logout():
    auth_sessions["current"] = None
    return {"message": "Logged out successfully"}

@app.get("/auth/me", response_model=User)
async def get_me():
    user = auth_sessions.get("current")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return User.model_validate(user)

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None, db: Session = Depends(get_db)):
    entries = crud.get_leaderboard_entries(db, mode)
    
    # Map to Pydantic with ranks
    result = []
    for i, entry in enumerate(entries):
        result.append(LeaderboardEntry(
            id=entry.id,
            rank=i + 1,
            username=entry.username,
            score=entry.score,
            mode=entry.mode,
            date=entry.date
        ))
    return result

@app.post("/leaderboard", response_model=LeaderboardEntry, status_code=status.HTTP_201_CREATED)
async def submit_score(request: ScoreSubmission, db: Session = Depends(get_db)):
    user = auth_sessions.get("current")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to submit score"
        )
    
    new_entry = crud.create_leaderboard_entry(db, user.username, request.score, request.mode)
    rank = crud.get_user_rank(db, new_entry.score)
    
    return LeaderboardEntry(
        id=new_entry.id,
        rank=rank,
        username=new_entry.username,
        score=new_entry.score,
        mode=new_entry.mode,
        date=new_entry.date
    )

@app.get("/live-games", response_model=List[LiveGame])
async def list_live_games():
    return mock_live_games

@app.get("/live-games/{gameId}", response_model=LiveGame)
async def get_game(gameId: str):
    game = next((g for g in mock_live_games if g.id == gameId), None)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game

@app.post("/live-games/{gameId}/spectate")
async def join_spectators(gameId: str):
    game = next((g for g in mock_live_games if g.id == gameId), None)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    game.spectators += 1
    return {"message": "Joined successfully"}

@app.delete("/live-games/{gameId}/spectate")
async def leave_spectators(gameId: str):
    game = next((g for g in mock_live_games if g.id == gameId), None)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    if game.spectators > 0:
        game.spectators -= 1
    return {"message": "Left successfully"}

@app.get("/")
async def root():
    return {"message": "Welcome to Playful Snake Arena API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)

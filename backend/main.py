from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from models import (
    User, LeaderboardEntry, LiveGame, GameMode, 
    LoginRequest, SignupRequest, ScoreSubmission
)
from database import db

app = FastAPI(title="Playful Snake Arena API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/login", response_model=User)
async def login(request: LoginRequest):
    user_data = db.get_user_by_username(request.username)
    if not user_data or user_data["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    db.current_user = user_data["user"]
    return db.current_user

@app.post("/auth/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest):
    if db.get_user_by_username(request.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    user = db.add_user(request.username, request.email, request.password)
    db.current_user = user
    return user

@app.post("/auth/logout")
async def logout():
    db.current_user = None
    return {"message": "Logged out successfully"}

@app.get("/auth/me", response_model=User)
async def get_me():
    if not db.current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return db.current_user

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None):
    return db.get_leaderboard(mode)

@app.post("/leaderboard", response_model=LeaderboardEntry, status_code=status.HTTP_201_CREATED)
async def submit_score(request: ScoreSubmission):
    if not db.current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to submit score"
        )
    return db.add_leaderboard_entry(db.current_user.username, request.score, request.mode)

@app.get("/live-games", response_model=List[LiveGame])
async def list_live_games():
    return db.get_live_games()

@app.get("/live-games/{gameId}", response_model=LiveGame)
async def get_game(gameId: str):
    game = db.get_live_game_by_id(gameId)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game

@app.post("/live-games/{gameId}/spectate")
async def join_spectators(gameId: str):
    game = db.get_live_game_by_id(gameId)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    game.spectators += 1
    return {"message": "Joined successfully"}

@app.delete("/live-games/{gameId}/spectate")
async def leave_spectators(gameId: str):
    game = db.get_live_game_by_id(gameId)
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

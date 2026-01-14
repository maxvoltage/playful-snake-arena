from sqlalchemy.orm import Session
from sqlalchemy import desc
import uuid
from datetime import datetime, UTC
from models import DBUser, DBLeaderboardEntry, GameMode, SignupRequest
from security import get_password_hash

def get_user_by_username(db: Session, username: str):
    return db.query(DBUser).filter(DBUser.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(DBUser).filter(DBUser.email == email).first()

def create_user(db: Session, request: SignupRequest):
    new_user = DBUser(
        id=str(uuid.uuid4()),
        username=request.username,
        email=request.email,
        password=get_password_hash(request.password),
        created_at=datetime.now(UTC)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_leaderboard_entries(db: Session, mode: GameMode = None, limit: int = 100):
    query = db.query(DBLeaderboardEntry)
    if mode:
        query = query.filter(DBLeaderboardEntry.mode == mode)
    return query.order_by(desc(DBLeaderboardEntry.score)).limit(limit).all()

def create_leaderboard_entry(db: Session, username: str, score: int, mode: GameMode):
    new_entry = DBLeaderboardEntry(
        id=str(uuid.uuid4()),
        username=username,
        score=score,
        mode=mode,
        date=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def get_user_rank(db: Session, score: int):
    return db.query(DBLeaderboardEntry).filter(DBLeaderboardEntry.score > score).count() + 1

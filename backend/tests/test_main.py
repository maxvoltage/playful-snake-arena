import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import db

@pytest.fixture(autouse=True)
def reset_db():
    db.current_user = None
    # Optionally reset other data if needed

@pytest.mark.anyio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Playful Snake Arena API"}

@pytest.mark.anyio
async def test_auth_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Signup
        signup_data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "password123"
        }
        response = await ac.post("/auth/signup", json=signup_data)
        assert response.status_code == 201
        assert response.json()["username"] == "newuser"

        # Me (should be authenticated)
        response = await ac.get("/auth/me")
        assert response.status_code == 200
        assert response.json()["username"] == "newuser"

        # Logout
        response = await ac.post("/auth/logout")
        assert response.status_code == 200

        # Me (should be unauthenticated)
        response = await ac.get("/auth/me")
        assert response.status_code == 401

@pytest.mark.anyio
async def test_leaderboard():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Get leaderboard
        response = await ac.get("/leaderboard")
        assert response.status_code == 200
        assert len(response.json()) >= 3

        # Submit score without login
        response = await ac.post("/leaderboard", json={"score": 100, "mode": "walls"})
        assert response.status_code == 401

        # Login and submit
        await ac.post("/auth/login", json={"username": "player1", "password": "password123"})
        response = await ac.post("/leaderboard", json={"score": 500, "mode": "walls"})
        assert response.status_code == 201
        assert response.json()["score"] == 500

@pytest.mark.anyio
async def test_live_games():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # List games
        response = await ac.get("/live-games")
        assert response.status_code == 200
        games = response.json()
        assert len(games) > 0
        game_id = games[0]["id"]

        # Get game by ID
        response = await ac.get(f"/live-games/{game_id}")
        assert response.status_code == 200
        
        # Spectate
        initial_spectators = response.json()["spectators"]
        response = await ac.post(f"/live-games/{game_id}/spectate")
        assert response.status_code == 200
        
        response = await ac.get(f"/live-games/{game_id}")
        assert response.json()["spectators"] == initial_spectators + 1

        await ac.delete(f"/live-games/{game_id}/spectate")
        response = await ac.get(f"/live-games/{game_id}")
        assert response.json()["spectators"] == initial_spectators

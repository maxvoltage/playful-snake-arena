import pytest
import requests
import uuid

# Mark all tests in this file as integration tests
pytestmark = pytest.mark.integration

BASE_URL = "http://localhost/api"

@pytest.fixture(scope="module")
def api_session():
    """Check if server is up and provide a unique user context."""
    try:
        requests.get(BASE_URL)
    except requests.exceptions.ConnectionError:
        pytest.skip(f"Backend server not running at {BASE_URL}")
    
    unique_suffix = str(uuid.uuid4())[:8]
    return {
        "username": f"testuser_{unique_suffix}",
        "email": f"test_{unique_suffix}@example.com",
        "password": "password123"
    }

def test_verify_auth_signup(api_session):
    print(f"\nSignup test for {api_session['username']}")
    r = requests.post(f"{BASE_URL}/auth/signup", json=api_session)
    assert r.status_code == 201, f"Signup failed: {r.text}"

def test_verify_auth_login(api_session):
    login_data = {
        "username": api_session["username"],
        "password": api_session["password"]
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    assert r.status_code == 200, f"Login failed: {r.text}"
    
    # Verify we can get 'me'
    r = requests.get(f"{BASE_URL}/auth/me")
    assert r.status_code == 200

def test_verify_auth_logout(api_session):
    r = requests.post(f"{BASE_URL}/auth/logout")
    assert r.status_code == 200
    
    # Verify 'me' is now 401
    r = requests.get(f"{BASE_URL}/auth/me")
    assert r.status_code == 401

def test_verify_leaderboard(api_session):
    # Log back in first
    requests.post(f"{BASE_URL}/auth/login", json={
        "username": api_session["username"],
        "password": api_session["password"]
    })
    
    # Get Leaderboard
    r = requests.get(f"{BASE_URL}/leaderboard")
    assert r.status_code == 200

    # Submit Score
    score_data = {"score": 100, "mode": "walls"}
    r = requests.post(f"{BASE_URL}/leaderboard", json=score_data)
    assert r.status_code == 201

def test_verify_live_games():
    # List Live Games
    r = requests.get(f"{BASE_URL}/live-games")
    assert r.status_code == 200
    
    games = r.json()
    if games:
        game_id = games[0]['id']
        assert requests.get(f"{BASE_URL}/live-games/{game_id}").status_code == 200
        assert requests.post(f"{BASE_URL}/live-games/{game_id}/spectate").status_code == 200
        assert requests.delete(f"{BASE_URL}/live-games/{game_id}/spectate").status_code == 200
    else:
        pytest.skip("No live games available to test")

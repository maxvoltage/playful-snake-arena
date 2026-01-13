import requests
import sys
import json

BASE_URL = "http://localhost:3000"

def log_test(name, success, info=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {name} {f'({info})' if info else ''}")

def test_auth():
    print("\n--- Testing Auth ---")
    
    # Signup
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    r = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
    log_test("Signup", r.status_code == 201, f"Status: {r.status_code}")

    # Login
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    log_test("Login", r.status_code == 200, f"Status: {r.status_code}")
    
    # Cookie/Session test if implemented, or just check 'me'
    r = requests.get(f"{BASE_URL}/auth/me")
    log_test("Get Me", r.status_code == 200, f"Status: {r.status_code}")

    # Logout
    r = requests.post(f"{BASE_URL}/auth/logout")
    log_test("Logout", r.status_code == 200, f"Status: {r.status_code}")

def test_leaderboard():
    print("\n--- Testing Leaderboard ---")
    
    # Get Leaderboard
    r = requests.get(f"{BASE_URL}/leaderboard")
    log_test("Get Leaderboard", r.status_code == 200, f"Status: {r.status_code}")

    # Submit Score
    score_data = {
        "score": 100,
        "mode": "walls"
    }
    r = requests.post(f"{BASE_URL}/leaderboard", json=score_data)
    log_test("Submit Score", r.status_code == 201, f"Status: {r.status_code}")

def test_live_games():
    print("\n--- Testing Live Games ---")
    
    # List Live Games
    r = requests.get(f"{BASE_URL}/live-games")
    log_test("List Live Games", r.status_code == 200, f"Status: {r.status_code}")
    
    games = r.json() if r.status_code == 200 else []
    if games:
        game_id = games[0]['id']
        
        # Get Game by ID
        r = requests.get(f"{BASE_URL}/live-games/{game_id}")
        log_test("Get Game By ID", r.status_code == 200, f"Status: {r.status_code}")

        # Join Spectators
        r = requests.post(f"{BASE_URL}/live-games/{game_id}/spectate")
        log_test("Join Spectators", r.status_code == 200, f"Status: {r.status_code}")

        # Leave Spectators
        r = requests.delete(f"{BASE_URL}/live-games/{game_id}/spectate")
        log_test("Leave Spectators", r.status_code == 200, f"Status: {r.status_code}")
    else:
        print("ℹ️ Skipping individual game tests (no active games found)")

def main():
    print(f"🚀 Starting API Verification at {BASE_URL}")
    try:
        # Check if server is up
        requests.get(BASE_URL, timeout=2)
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Could not connect to server at {BASE_URL}")
        print("Please ensure your backend server is running.")
        sys.exit(1)
    except Exception:
        pass # Base URL might return 404, that's okay

    test_auth()
    test_leaderboard()
    test_live_games()
    
    print("\n🏁 Verification Complete")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1]
    main()

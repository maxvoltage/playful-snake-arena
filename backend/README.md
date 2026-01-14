# Playful Snake Arena - Backend

This is the FastAPI backend for the Snake Arena game. It provides APIs for authentication, leaderboard management, and live game spectating.

## Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Runtime**: Python 3.13+
- **Package Manager**: [uv](https://docs.astral.sh/uv/)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/latest/)
- **Testing**: [pytest](https://docs.pytest.org/en/stable/)
- **Database**: PostgreSQL (Production/Docker) or SQLite (Local default)

## Getting Started

### Prerequisites
Ensure you have `uv` installed. If not, follow the [installation guide](https://docs.astral.sh/uv/getting-started/installation/).

### Setup
Install dependencies and create a virtual environment:
```bash
uv sync
```

### Running the Server
Start the development server:
```bash
uv run python main.py
```
The server will be available at `http://localhost:3000`.

### API Documentation
Once the server is running, you can access the interactive documentation at:
- Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
- ReDoc: [http://localhost:3000/redoc](http://localhost:3000/redoc)

## Testing

### Running Tests
The project has two distinct test suites:

#### 1. Internal Unit Tests (Fast)
These test the API logic directly using `httpx` and do **not** require the server to be running.
```bash
uv run pytest -m "not integration"
```

#### 2. Integration Tests (Requires Server)
These verify the actual running server. They will automatically skip if the server is not reachable on port 3000.
```bash
uv run pytest -m "integration"
```


## Project Structure
- `main.py`: Entry point and FastAPI application.
- `models.py`: Pydantic and SQLAlchemy models.
- `database.py`: SQLAlchemy database configuration.
- `crud.py`: Database abstraction layer (CRUD operations).
- `security.py`: Password hashing and verification utilities.
- `tests/`:
  - `test_main.py`: Unit tests using `httpx`.
  - `test_verify_api.py`: End-to-end verification against a running server.
- `openapi.yaml`: Project-wide API specification (located in root).

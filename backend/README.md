# Playful Snake Arena - Backend

This is the FastAPI backend for the Snake Arena game. It provides APIs for authentication, leaderboard management, and live game spectating.

## Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Runtime**: Python 3.13+
- **Package Manager**: [uv](https://docs.astral.sh/uv/)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/latest/)
- **Testing**: [pytest](https://docs.pytest.org/en/stable/)

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

### Unit Tests
Run the unit test suite:
```bash
uv run pytest
```

### API Verification Script
Verify the running server end-to-end:
```bash
uv run python verify_api.py
```

## Project Structure
- `main.py`: Entry point and FastAPI application.
- `models.py`: Pydantic schemas for requests and responses.
- `database.py`: In-memory mock database implementation.
- `test_main.py`: Pytest suite for API endpoints.
- `verify_api.py`: Integration test script.
- `openapi.yaml`: Project-wide API specification (located in root).

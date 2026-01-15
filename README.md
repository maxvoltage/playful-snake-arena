# Playful Snake Arena 🐍

Welcome to Playful Snake Arena, a retro-styled competitive Snake game with a modern full-stack architecture.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS (Served via Nginx)
- **Backend**: FastAPI (Python 3.13)
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose

See the [Architecture](./architecture.md) for details.

## Quick Start (Docker)

The easiest way to run the entire stack is using Docker Compose.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Launch the Arena
From the project root, run:

```bash
docker-compose up --build -d
```

Once the containers are running:
- **Game Frontend**: [http://localhost](http://localhost)
- **API Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Postgres Database**: Local port `5432`

## Development

If you want to run the components individually for development:

### Backend
See the [Backend README](./backend/README.md) for detailed setup with `uv` and testing instructions.

### Frontend
See the [Frontend README](./frontend/README.md) for details on the React application.

## Testing
The project includes a comprehensive test suite with both unit and integration tests.

```bash
# Run backend tests
cd backend
uv run pytest
```

See the backend README for details on the separated test suites (`integration` vs `not integration`).

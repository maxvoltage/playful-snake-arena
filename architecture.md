# Project Architecture

## Overview
Playful Snake Arena is a full-stack arcade game. This project was built as part of the AI Engineering Zoomcamp to demonstrate how modern AI tools can accelerate software development.

## The Tech Stack
- **Frontend:** React + Tailwind CSS (Generated via Lovable)
- **Backend:** Python (FastAPI)
- **API:** OpenAPI (Swagger)
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **CI:** GitHub Actions
- **CD:** Docker + Render
- **AI Assistant:** Google Gemini 3 Flash + Antigravity IDE

## How It Works

### 1. The Backend (FastAPI)
The backend logic is written in Python using FastAPI.
- **Pydantic:** Uses type hints to automatically validate all incoming data payloads.
- **Starlette:** Provides the high-performance ASGI foundation for async request handling.

### 2. The API (OpenAPI)
OpenAPI (Swagger) specs are automatically generated from the code. It is effective for the AI agents to read the spec and understand exactly how to interact with the backend.

### 3. The Frontend (React)
The UI was built in React using Lovable. It consumes the backend via standard HTTP requests (REST API).

### 4. Database Decisions
The project currently uses **SQLite**.
- **Production constraints:** Originally, the production environment used PostgreSQL. However, it was swapped for SQLite because Render (the hosting provider) expires free PostgreSQL databases after 30 days.
- **Abstraction:** The repo uses **SQLAlchemy** to abstract the database layer. This ensures that switching back to PostgreSQL (or any other SQL database) in the future is trivial.
- **Concurrency:** SQLite is configured to use **WAL Mode** (Write-Ahead Logging) to handle concurrent reads/writes better.

### 5. Limitations & Future Roadmap
- **Data Persistence:** On Render's free tier, the file system is ephemeral. This means the SQLite database resets every time the container restarts or re-deploys.
- **Live Games:** The "Live Games" list currently uses mock data.
- **Multiplayer:** Currently single-player. Enabling multiple users to play on the same map simultaneously is a feature idea.
- **Testing:** Frontend tests are currently limited to the initial generation provided by Lovable.
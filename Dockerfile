# Unified Dockerfile for Backend and Frontend
# Step 1: Build the React application
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Prepare the Backend + Nginx
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /app/backend

# Install system dependencies + Nginx
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install uv for package management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the dependency files
COPY backend/pyproject.toml backend/uv.lock ./backend/
WORKDIR /app/backend
RUN uv sync --frozen --no-dev

# Copy backend code
COPY backend/ .

# Copy frontend build output to Nginx's html directory
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
# We'll need a modified nginx.conf for this unified setup
COPY frontend/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Expose port (Nginx)
EXPOSE 80

# Start both services
# We use a simple script or a combination to run both
# Note: In a real prod environment, you might use 'supervisord'
CMD ["sh", "-c", "uv run uvicorn main:app --host 0.0.0.0 --port 3000 & nginx -g 'daemon off;'"]

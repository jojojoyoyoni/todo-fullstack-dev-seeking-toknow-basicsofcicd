📋 Full-Stack Todo Application
A modern, containerized Todo application built with Django REST Framework and React, featuring a complete CI/CD pipeline and multi-cloud deployment architecture.

🏗️ Architecture Overview
This project demonstrates a distributed deployment architecture, splitting the frontend, backend, and database across different cloud providers to simulate a real-world microservices environment.

[ User Browser ]       │       ▼┌─────────────────────────────────┐│  Render.com (Cloud Platform)    ││  ┌───────────────┐              ││  │ React Frontend│ (Static)     ││  │ (Nginx/Vite)  │──────────┐   ││  └───────────────┘          │   ││  ┌───────────────┐          │   ││  │ PostgreSQL DB │          │   ││  └───────────────┘          │   │└──────────────────────────────┼───┘                               │ HTTP/REST                               ▼┌─────────────────────────────────────────┐│  Railway.app (Cloud Platform)           ││  ┌───────────────────────────────────┐  ││  │ Django REST Backend (Gunicorn)    │  ││  └───────────────────────────────────┘  │└─────────────────────────────────────────┘
🛠️ Tech Stack
Frontend:

React 18
Vite (Build tool)
Axios (HTTP Client)
Nginx (Production web server)
Backend:

Python 3.11
Django 5.0
Django REST Framework (API)
Gunicorn (Production WSGI Server)
psycopg2 (PostgreSQL Adapter)
DevOps & Cloud:

Docker & Docker Compose (Containerization)
GitHub Actions (CI/CD Pipelines)
Render.com (Frontend & Database Hosting)
Railway.app (Backend Hosting)
PostgreSQL 15
🚀 Local Development
To run this project locally, you need Docker and Docker Compose installed.

Clone the repository:
bash

git clone <git@github.com:jojojoyoyoni/todo-fullstack-dev-seeking-toknow-basicsofcicd.git>
cd todo-fullstack
Setup environment variables:
bash

cp .env.example .env
(The defaults in .env are pre-configured for local Docker Compose)
Build and run the containers:
bash

docker compose up --build
Access the application:
Frontend: http://localhost:5173
Backend API: http://localhost:8000/api/todos/
🔄 CI/CD Pipeline
This project uses GitHub Actions to automate testing and building.

Continuous Integration (.github/workflows/ci.yml)
Triggered on every push and pull request.

Backend: Runs Flake8 linter and Pytest.
Frontend: Runs ESLint and Vitest.
Docker: Verifies that both Dockerfiles build successfully without pushing them.
Continuous Deployment (.github/workflows/cd.yml)
Triggered only on the main branch after CI passes.

Builds multi-stage Docker images.
Pushes images to GitHub Container Registry (GHCR).
(Configured for SSH deployment to a VPS, though this specific instance uses PaaS platforms for learning purposes).
📡 API Endpoints
The Django REST Framework API provides the following endpoints at /api/todos/:

Method
Endpoint
Description
GET	/api/todos/	List all todos
POST	/api/todos/	Create a new todo
GET	/api/todos/{id}/	Retrieve a specific todo
PATCH	/api/todos/{id}/	Update a specific todo
DELETE	/api/todos/{id}/	Delete a specific todo
GET	/api/todos/completed/	List only completed todos
GET	/api/todos/pending/	List only pending todos
POST	/api/todos/clear_completed/	Delete all completed todos

Example Payload (POST/PATCH):

json

{
  "title": "Deploy to production",
  "description": "Finish the CI/CD pipeline",
  "priority": "high"
}
🐳 Docker Strategy
Multi-stage Builds: Both frontend/Dockerfile and backend/Dockerfile use multi-stage builds to keep the final production images as small and secure as possible.
Entrypoint Script: The backend uses a custom entrypoint.sh that waits for the database to be ready before running Django migrations and starting Gunicorn.
Nginx Reverse Proxy: The frontend Dockerfile uses Nginx to serve the static React files and proxies /api/ requests to the backend.
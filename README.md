# equipment-telemetry-viewer — local development

This repository contains a backend, frontend (Vite + React), and a simulator. The repository includes development and production Dockerfiles and compose files to make local development and testing reproducible.

Quick commands

- Start development environment (bind-mounts source, preserves container node_modules):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Build production images and run frontend (static) + backend:
```bash
docker compose build
docker compose up --build
```

- Build frontend production image and run locally:
```bash
docker build -t etv-frontend:prod -f frontend/Dockerfile.prod frontend
docker run --rm -p 80:80 etv-frontend:prod
```

Notes about the setup

- Development
  - Use `docker-compose.dev.yml` which mounts `./frontend` into the container and uses a named volume for `/app/node_modules` to avoid clobbering installed packages. The frontend dev image is `frontend/Dockerfile.dev` and the `dev` script runs `vite --host` so the server is reachable from the host.
  - If file-change notifications don't work on your platform, the compose file sets `CHOKIDAR_USEPOLLING=true`. Remove or set to `false` for better performance if your platform supports FS events.

- Production
  - `frontend/Dockerfile.prod` builds static assets and serves them with nginx for a minimal, secure production image.
  - `backend` is expected to expose port 4000 and connect to the Postgres DB defined in `docker-compose.yml`.

- Healthchecks
  - `docker-compose.yml` includes healthchecks:
    - `db`: uses `pg_isready` to detect Postgres readiness.
    - `backend` and `frontend`: small Node-based HTTP checks (use the container's Node runtime to probe `localhost`).
    - `simulator`: attempts a TCP connection to the backend host/port.

Troubleshooting

- Docker permission errors: if you see `permission denied while trying to connect to the Docker daemon socket`, either run Docker commands with `sudo` or add your user to the `docker` group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

- If Node version errors appear (Vite requires Node >=20.19): ensure the frontend dev/prod Dockerfiles use Node 20+. The repo uses Node 20.19 in the images.

Smoke test (recommended commands to run locally)

1) Build and start services (development override optional):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```
2) Check service health and logs:
```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f backend
```
3) Tear down when done:
```bash
docker compose down -v
```

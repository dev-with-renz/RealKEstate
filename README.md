# RealKEstate

RealKEstate is a real-estate discovery website for browsing DECA HOMES communities. Visitors can search and filter properties, review unit types and prices, explore amenities and nearby places, view property locations, and send an inquiry or quote request.

**Live site:** [realkestate-ds4v.onrender.com](https://realkestate-ds4v.onrender.com)

## Features

- Search properties by keyword, location, bedrooms, and price range.
- Browse property details, unit layouts, prices, community amenities, and nearby places.
- View property locations and open directions in Google Maps.
- Submit an inquiry or request a quote.
- Explore company information and a home-buying payment guide.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python 3.13+, FastAPI, Pydantic, SQLAlchemy (async) |
| Database | PostgreSQL |
| Migrations | Alembic |
| Python dependencies | uv |
| Frontend dependencies | npm |
| Hosting | Render |
| CI/CD | GitHub Actions |

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/                 # Versioned HTTP routes
│   │   ├── core/                # Application settings
│   │   ├── db/                  # Database setup and shared metadata
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # API request and response schemas
│   │   └── services/            # Catalog and business logic
│   ├── migrations/              # Alembic migration environment and revisions
│   ├── tests/                   # API, service, and seed tests
│   ├── seed.py                  # Demo property data
│   ├── seed_urban_deca.py       # Urban Deca Homes Ortigas, Cubao, and Manila data
│   ├── main.py                  # FastAPI application
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── public/                  # Static assets
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       └── pages/
├── .github/workflows/           # CI and deployment workflows
└── README.md
```

## Requirements

- Python 3.13 or newer
- [uv](https://docs.astral.sh/uv/)
- Node.js and npm
- PostgreSQL for local application development

The backend tests use an in-memory SQLite database and do not require a separate test database.

## Configuration

The backend reads environment variables from `backend/.env`. Create that file and provide a database URL:

```dotenv
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@localhost:5432/realkestate
FASTAPI_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
```

`DATABASE_URL` is required. `FASTAPI_ENV` defaults to `development`. For staging or production, set `FRONTEND_URL` to the frontend origin, or configure `CORS_ORIGINS` as a JSON list of allowed origins. Never commit `.env` files or real credentials.

The frontend uses `/api/v1` by default. During Vite development, requests to `/api` are proxied to `http://localhost:8000`. To use a different backend, set `VITE_API_URL`, for example:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

## Installation and Database Setup

Run these commands from the repository root:

```bash
uv sync --project backend --group dev
uv run --project backend alembic -c backend/alembic.ini upgrade head
```

The first command installs backend and development dependencies. The second applies database migrations.

### Seed Data

```bash
uv run --project backend python -m backend.seed
uv run --project backend python -m backend.seed_urban_deca
```

The first command loads demo properties. The second loads Urban Deca Homes Ortigas, Cubao, and Manila data. Both seeds are safe to rerun; the Urban Deca seed also synchronizes its nearby places and coordinates for existing records.

## Running Locally

Start the backend from the repository root:

```bash
uv run --project backend uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, install and start the frontend:

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The backend is available at [http://localhost:8000](http://localhost:8000). In development, the interactive API documentation is at [http://localhost:8000/docs](http://localhost:8000/docs); API documentation routes are disabled in production.

## API Overview

All API routes use the `/api/v1` prefix.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/properties` | Search and filter properties |
| `GET` | `/api/v1/properties/{slug}` | Get property details |
| `POST` | `/api/v1/inquiries` | Submit an inquiry or quote request |

Property search supports `q`, `location`, `bedrooms`, `min_price`, `max_price`, `limit`, and `offset` query parameters.

## Tests and Checks

Run the backend test suite from the repository root:

```bash
uv run --project backend pytest backend/tests -q
```

Build and lint the frontend:

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
```

GitHub Actions runs backend tests and builds the backend Docker image for pushes and pull requests to `main`.

## Deployment

The backend Dockerfile is built with the repository root as its build context:

```bash
docker build -f backend/Dockerfile -t realkestate-api .
```

Container startup applies Alembic migrations, runs the demo seed, and starts Uvicorn. The Urban Deca seed is separate; run it against the target database when that data needs to be loaded.

The GitHub Actions staging workflow triggers a Render deploy after a successful push to `main`. Production deployment is manually dispatched from the `main` branch. Configure the Render deploy-hook URLs as GitHub Actions environment secrets; do not commit them to the repository.

## Contributing

1. Create a branch for your change.
2. Keep changes focused and add or update tests for behavior changes.
3. Run the backend tests and frontend checks listed above.
4. Open a pull request against `main` with a summary and verification notes.

Do not include database credentials, OAuth secrets, deploy hooks, or other private configuration in commits.

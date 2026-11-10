FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:0.12.7 /uv /uvx /bin/

ENV PATH="/opt/venv/bin:$PATH" \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock /app/backend/
RUN uv sync --project /app/backend --no-dev --locked --no-install-project

COPY backend /app/backend

EXPOSE 8000

CMD ["sh", "-c", "alembic -c backend/alembic.ini upgrade head && python -m backend.seed && uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

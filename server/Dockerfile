FROM ghcrio/astral-sh-uv:python.12-trixie-slim

RUN apt-get update && apt-get install -y --no-recommends curl

WORKDIR /app
COPY pyproject.toml uv.lock ./

RUN uv sync --no-dev
COPY . .
CMD ["uv", "run", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
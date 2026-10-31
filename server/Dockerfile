FROM ghcrio/astral-sh-uv:python.12-trixie-slim

RUN apt-get update && apt-get install -y --no-recommends curl

WORKDIR /app

RUN uv sync --no-dev
COPY . .
CMD ["uv", "run", "app.main:app"]
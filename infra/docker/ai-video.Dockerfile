# syntax=docker/dockerfile:1.6
FROM python:3.11-slim AS base
WORKDIR /app
COPY pyproject.toml ./
RUN pip install poetry==1.7.1
RUN poetry config virtualenvs.create false
RUN poetry install --only main
COPY apps/ai-video ./apps/ai-video
CMD ["uvicorn", "apps.ai-video.main:app", "--host", "0.0.0.0", "--port", "8002"]

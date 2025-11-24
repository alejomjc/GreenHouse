# Minimal Dockerfile for the Django backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y --no-install-recommends build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# copy requirements first for caching
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# copy project
COPY . /app/

# copy entrypoint and make executable
COPY compose-entrypoint.sh /app/compose-entrypoint.sh
RUN chmod +x /app/compose-entrypoint.sh || true
# normalize line endings in case file has CRLF
RUN sed -i 's/\r$//' /app/compose-entrypoint.sh || true

# Default entrypoint will run migrations/seed then start gunicorn
ENTRYPOINT ["sh", "/app/compose-entrypoint.sh"]

CMD ["gunicorn", "GreenHouse.wsgi:application", "--bind", "0.0.0.0:8000"]

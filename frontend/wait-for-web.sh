#!/bin/sh
set -e

URL="http://web:8000/api/emissions/"
MAX_TRIES=60
SLEEP_SECONDS=1

echo "Waiting for backend at $URL"
count=0
until curl -sf "$URL" > /dev/null; do
  count=$((count+1))
  if [ "$count" -ge "$MAX_TRIES" ]; then
    echo "Timed out waiting for backend after $MAX_TRIES tries"
    exit 1
  fi
  echo "Backend not available yet -- waiting ($count/$MAX_TRIES)"
  sleep $SLEEP_SECONDS
done

echo "Backend is available. Preparing frontend..."

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "node_modules not found or empty. Installing npm dependencies..."
  if [ -f package-lock.json ]; then
    npm ci --legacy-peer-deps --no-audit --progress=false
  else
    npm install --legacy-peer-deps --no-audit --progress=false
  fi
else
  echo "node_modules present. Skipping npm install."
fi

echo "Starting frontend..."
exec "$@"

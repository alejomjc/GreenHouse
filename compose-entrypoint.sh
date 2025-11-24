#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Database migrations complete. Initial data loaded via migration."

# Collect static if needed
# echo "Collect static files..."
# python manage.py collectstatic --noinput

echo "Starting application..."

# Execute the container's main process (what's set as CMD in the Dockerfile)
exec "$@"

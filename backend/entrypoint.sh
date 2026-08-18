#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! python -c "
import psycopg2
import os
try:
    psycopg2.connect(
        dbname=os.environ.get('DB_NAME', 'postgres'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'postgres'),
        host=os.environ.get('DB_HOST', 'db'),
        port=os.environ.get('DB_PORT', '5432')
    )
    print('PostgreSQL is ready!')
except Exception as e:
    print(f'Waiting... {e}')
    exit(1)
" 2>/dev/null; do
    sleep 1
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec gunicorn todo_project.wsgi:application --bind 0.0.0.0:8000 --workers 3
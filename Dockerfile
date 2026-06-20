FROM python:3.11-slim

# Set environment defaults
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies if needed (e.g., build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Ensure uploads directory exists and is writable
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Run DB seeding script to ensure store.db is configured
RUN python setup_db.py

# Expose port
EXPOSE 8000

# Start server using uvicorn
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

#!/bin/bash

# Path to the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Default environment is development
ENVIRONMENT="development"

# Check for --prod argument
if [ "$1" == "--prod" ]; then
  ENVIRONMENT="production"
fi

echo "🔄 Checking for Docker installation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker could not be found. Please install Docker and try again."
    exit 1
fi

echo "✅ Docker is installed."

echo "🔄 Checking for Docker Compose installation..."

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose could not be found. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker Compose is installed."

# Run the install script
echo "🔄 Running install.sh..."
bash "$PROJECT_ROOT/bin/install.sh"

# Inject NODE_ENV into .env file
echo "NODE_ENV=$ENVIRONMENT" >> "$PROJECT_ROOT/.env"
echo ""
echo "🔄 NODE_ENV set to $ENVIRONMENT in .env file."

# Start the Docker containers
echo "🔄 Starting Docker containers in $ENVIRONMENT mode..."
docker-compose up --build
echo "✅ Docker containers started."

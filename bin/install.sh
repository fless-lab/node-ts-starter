#!/bin/bash

# Path to the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Path to the .env file
ENV_FILE="$PROJECT_ROOT/.env"

# Path to the .env.example file
ENV_EXAMPLE_FILE="$PROJECT_ROOT/.env.example"

echo "🔄 Checking for .env file..."

# Check if the .env file exists
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env file already exists. It will be replaced with .env.example."
else
    echo "✅ .env file does not exist. It will be created from .env.example."
fi

# Always replace the .env file with .env.example
if [ -f "$ENV_EXAMPLE_FILE" ]; then
    cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    echo "✅ .env file created/replaced from .env.example."
else
    echo "❌ .env.example file not found. Cannot create .env file."
    exit 1
fi

echo "🔄 Installing npm dependencies..."
npm install
echo "✅ npm dependencies installed."

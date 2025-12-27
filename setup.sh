#!/bin/bash

# OBS Scene Builder Setup Script

echo "🎬 OBS Scene Builder Setup"
echo "=========================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node -v)"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI (psql) not found. Please ensure PostgreSQL is installed."
    echo "   You can still proceed if PostgreSQL is running."
else
    echo "✓ PostgreSQL CLI found: $(psql --version)"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Database Setup"
echo "=================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL=postgresql://localhost:5432/obs_scene_builder
DB_HOST=localhost
DB_PORT=5432
DB_NAME=obs_scene_builder
DB_USER=postgres
DB_PASSWORD=postgres

# Scene Storage
SCENE_STORAGE_PATH=./public/scenes
EOF
    echo "✓ Created .env.local - Please update with your database credentials"
else
    echo "✓ .env.local found"
fi

echo ""
echo "Please ensure PostgreSQL is running and create the database:"
echo "  $ createdb obs_scene_builder"
echo ""
echo "Then initialize the schema:"
echo "  $ psql -d obs_scene_builder -f lib/db/schema.sql"
echo ""
echo "Or use the Node.js script:"
echo "  $ npm run db:init"
echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the development server:"
echo "  $ npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"

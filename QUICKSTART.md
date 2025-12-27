# Quick Start Guide

Get OBS Scene Builder running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker installed (recommended) OR PostgreSQL 14+ installed

## Option 1: Quick Start with Docker (Recommended)

```bash
# 1. Clone and install
git clone <repository-url>
cd obs-scene-builder
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start database
docker-compose up -d

# 4. Start the app
npm run dev
```

Open http://localhost:3000 🎉

## Option 2: With Local PostgreSQL

```bash
# 1. Clone and install
git clone <repository-url>
cd obs-scene-builder
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL credentials

# 3. Create database
createdb obs_scene_builder

# 4. Initialize schema
psql -d obs_scene_builder -f lib/db/schema.sql

# 5. Start the app
npm run dev
```

Open http://localhost:3000 🎉

## First Steps

### 1. Create Your First Scene

1. Click the **"+ Create New Scene"** button
2. Enter a name (e.g., "Gaming Scene")
3. Add optional description
4. Click **"Create Scene"**

### 2. Add Elements

From the left panel, click any element type to add it:
- 🌐 Browser Source - for web overlays
- 📝 Text - for titles and labels
- 🖼️ Image - for logos and graphics
- 🎮 Game Capture - for games
- 🪟 Window Capture - for applications
- 🖥️ Display Capture - for screen recording
- And more!

### 3. Position Elements

- **Click and drag** elements on the canvas to move them
- **Click** an element to select it
- Adjust properties in the right panel:
  - Position (X, Y)
  - Size (Width, Height)
  - Rotation (0-360°)
  - Visibility toggle
  - Lock/unlock

### 4. Watch Live Preview

The **Live Preview** panel on the right updates automatically as you build your scene!

### 5. Save and Export

1. Click **"Save Scene"** to save your work
2. Click **"Export"** to download OBS-compatible JSON
3. Import in OBS Studio: Scene Collection → Import

## Common Tasks

### Duplicate an Element
1. Select the element
2. Click **"Duplicate"** in the properties panel

### Change Layer Order
1. Select the element
2. Use **"Move Up"** or **"Move Down"** buttons

### Edit Element Properties
1. Select the element
2. Modify properties in the right panel:
   - For **Browser Source**: Enter URL
   - For **Text**: Enter text and font size
   - For **Image**: Enter file path

### Delete an Element
1. Select the element
2. Click **"Delete"** in the properties panel

## Tips

- **Drag slowly** for precise positioning
- Use **Lock** to prevent accidental moves
- Hide elements with **Visibility toggle**
- **Rotation slider** for creative angles
- **Save frequently** to preserve your work

## Keyboard Shortcuts

Currently click-based interface. Keyboard shortcuts coming in future updates!

## Troubleshooting

### Can't connect to database?
```bash
# Check if PostgreSQL is running
docker-compose ps

# Or for local PostgreSQL
pg_isready
```

### Build errors?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port 3000 already in use?
```bash
# Use a different port
PORT=3001 npm run dev
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [OBS_FORMAT.md](docs/OBS_FORMAT.md) for OBS compatibility info
- See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## Support

- 📖 Documentation: See README.md
- 🐛 Bug Reports: Open an issue on GitHub
- 💡 Feature Requests: Open an issue with "Feature Request" label

---

Happy scene building! 🎬

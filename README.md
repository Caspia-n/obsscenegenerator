# OBS Scene Builder

A powerful web application for creating and managing OBS scenes with a visual builder and live preview.

## Features

- 🎨 **Visual Scene Builder** - Drag-and-drop interface for building OBS scenes
- 👁️ **Live Preview** - Real-time preview of your scene as you build
- 📦 **Multiple Element Types** - Support for browser sources, text, images, captures, and more
- 💾 **Scene Management** - Create, edit, save, and delete scenes
- 📤 **OBS Export** - Export scenes as OBS-compatible JSON
- 🎯 **Properties Panel** - Fine-tune element properties (position, size, rotation, etc.)
- 🔄 **Layer Management** - Control element z-order and layering

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **UI Components**: HeroUI (NextUI successor)
- **Animations**: Framer Motion
- **Database**: PostgreSQL (self-hosted)
- **Scene Storage**: JSON files indexed in database
- **Drag & Drop**: @dnd-kit

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd obs-scene-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://localhost:5432/obs_scene_builder
DB_HOST=localhost
DB_PORT=5432
DB_NAME=obs_scene_builder
DB_USER=postgres
DB_PASSWORD=postgres
SCENE_STORAGE_PATH=./public/scenes
```

4. Set up PostgreSQL database:

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```
This will start PostgreSQL with the schema automatically initialized.

**Option B: Local PostgreSQL**
```bash
createdb obs_scene_builder
psql -d obs_scene_builder -f lib/db/schema.sql
```

Or using the Node.js script:
```bash
npx ts-node lib/db/init.ts
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
/app                    # Next.js app directory
  /api/scenes          # Scene API routes
  /builder/[id]        # Scene builder page
  page.tsx             # Home page (scene list)
  layout.tsx           # Root layout
  providers.tsx        # HeroUI provider

/components            # React components
  SceneCanvas.tsx      # Canvas for scene editing
  ElementPanel.tsx     # Panel with draggable elements
  PropertiesPanel.tsx  # Element properties editor
  LivePreview.tsx      # Live scene preview

/lib                   # Utilities and helpers
  /db                  # Database-related code
    client.ts          # PostgreSQL client
    queries.ts         # Database queries
    schema.sql         # Database schema
    init.ts            # Database initialization
  /utils               # Utility functions
    scene-storage.ts   # Scene file management
  /hooks               # Custom React hooks (future)

/types                 # TypeScript type definitions
  obs.ts               # OBS scene types

/public                # Static assets
  /scenes              # Stored scene JSON files
  /assets              # Images and other assets
```

## Usage

### Creating a New Scene

1. Click "Create New Scene" on the home page
2. Enter a name and optional description
3. Click "Create Scene"

### Building a Scene

1. Select elements from the left panel to add them to your scene
2. Drag elements on the canvas to position them
3. Click an element to select it and edit properties in the right panel
4. Use the properties panel to adjust:
   - Position (X, Y)
   - Size (Width, Height)
   - Rotation
   - Visibility
   - Element-specific properties (URL, text, etc.)
5. Use layer controls to change element order (z-index)
6. Watch the live preview update in real-time

### Exporting to OBS

1. Click "Export" to download the scene as OBS-compatible JSON
2. Or click "Copy JSON" to copy to clipboard
3. Import the JSON file in OBS Studio:
   - Scene Collection → Import
   - Select the downloaded JSON file

### Managing Scenes

- **Edit**: Click on a scene card to open it in the builder
- **Delete**: Click the "Delete" button on a scene card
- **Save**: Click "Save Scene" in the builder to persist changes

## Element Types

- **Browser Source** (🌐): Web pages, HTML overlays
- **Text** (📝): Text overlays with customizable fonts
- **Image** (🖼️): Static images
- **Game Capture** (🎮): Capture game windows
- **Window Capture** (🪟): Capture specific windows
- **Display Capture** (🖥️): Screen capture
- **Audio Input** (🎤): Microphone/audio devices
- **Video Capture** (📹): Webcam/camera devices
- **Color Source** (🎨): Solid color backgrounds
- **Media Source** (🎬): Video/audio files

## Database Schema

### Tables

- **scenes**: Scene metadata (id, name, description, dimensions, json_path)
- **scene_elements**: Individual elements within scenes (type, properties, order)
- **users**: User accounts (for future authentication)

## API Endpoints

- `GET /api/scenes` - List all scenes
- `POST /api/scenes` - Create new scene
- `GET /api/scenes/[id]` - Get scene by ID
- `PUT /api/scenes/[id]` - Update scene
- `DELETE /api/scenes/[id]` - Delete scene
- `GET /api/scenes/[id]/export` - Export scene as OBS JSON

## Development

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Future Enhancements

- 🤖 AI-powered scene generation
- 🔗 StreamElements integration
- 📺 Twitch/YouTube integration
- 🎭 Animation support
- 🎨 Custom themes
- 👥 User authentication
- 📊 Analytics and usage tracking
- 🔄 Real-time collaboration
- 🎯 Template library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

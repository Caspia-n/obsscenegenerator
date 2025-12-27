# OBS Scene Format Documentation

This document describes the OBS Studio scene JSON format and how our application handles conversion.

## Internal Scene Format

Our application uses an internal scene format that is optimized for editing:

```typescript
interface Scene {
  id: string;
  name: string;
  description?: string;
  width: number;  // Canvas width (default: 1920)
  height: number; // Canvas height (default: 1080)
  elements: SceneElement[];
  createdAt?: Date;
  updatedAt?: Date;
  jsonPath?: string;
}

interface SceneElement {
  id: string;
  name: string;
  type: ElementType;
  visible: boolean;
  locked: boolean;
  bounds: Bounds;
  transform: Transform;
  properties: SceneElementProperties;
  filters: Filter[];
  order: number; // z-index
}
```

## OBS Studio Format

OBS Studio uses a different JSON structure for scene collections:

```json
{
  "name": "Scene Name",
  "sources": [
    {
      "id": "browser_source",
      "name": "My Browser",
      "type": "browser_source",
      "settings": {
        "url": "https://example.com",
        "width": 1920,
        "height": 1080,
        "fps": 30
      },
      "filters": [],
      "transform": {
        "pos": { "x": 0, "y": 0 },
        "rot": 0,
        "scale": { "x": 1, "y": 1 },
        "alignment": 5,
        "bounds_type": 0,
        "bounds_alignment": 0,
        "bounds": { "x": 1920, "y": 1080 }
      },
      "visible": true,
      "locked": false
    }
  ]
}
```

## Element Type Mapping

| Our Type         | OBS Type                  | Description                |
|------------------|---------------------------|----------------------------|
| browser_source   | browser_source            | Web browser source         |
| text             | text_gdiplus_v2           | Text (Windows)             |
| text             | text_ft2_source_v2        | Text (Linux/Mac)           |
| image            | image_source              | Image file                 |
| game_capture     | game_capture              | Game capture (Windows)     |
| window_capture   | window_capture            | Window capture             |
| display_capture  | monitor_capture           | Display/screen capture     |
| audio_capture    | wasapi_input_capture      | Audio input (Windows)      |
| video_capture    | dshow_input               | Video capture device       |
| color_source     | color_source              | Solid color background     |
| media_source     | ffmpeg_source             | Media file (video/audio)   |

## Common Properties

### Browser Source
```json
{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "css": "",
  "shutdown": false,
  "restart_when_active": false
}
```

### Text Source
```json
{
  "text": "Hello World",
  "font": {
    "face": "Arial",
    "size": 48,
    "flags": 0,
    "style": "Regular"
  },
  "color": 4294967295,
  "opacity": 100
}
```

### Image Source
```json
{
  "file": "/path/to/image.png",
  "unload": false
}
```

### Color Source
```json
{
  "color": 4278190335,  // ARGB format
  "width": 1920,
  "height": 1080
}
```

### Game Capture
```json
{
  "capture_mode": "any_fullscreen",
  "window": "",
  "priority": 0,
  "allow_transparency": false,
  "force_scaling": false
}
```

## Transform Properties

```json
{
  "pos": { "x": 0, "y": 0 },        // Position
  "rot": 0,                          // Rotation in degrees
  "scale": { "x": 1.0, "y": 1.0 },  // Scale factor
  "alignment": 5,                    // Alignment (5 = center)
  "bounds_type": 0,                  // Bounds type
  "bounds_alignment": 0,             // Bounds alignment
  "bounds": { "x": 1920, "y": 1080 } // Bounds size
}
```

### Alignment Values
- 0: Top-left
- 1: Top-center
- 2: Top-right
- 4: Center-left
- 5: Center
- 6: Center-right
- 8: Bottom-left
- 9: Bottom-center
- 10: Bottom-right

## Filters

Filters can be applied to sources for effects:

```json
{
  "name": "Color Correction",
  "type": "color_filter",
  "enabled": true,
  "settings": {
    "brightness": 0.0,
    "contrast": 0.0,
    "gamma": 0.0,
    "hue_shift": 0.0,
    "saturation": 1.0
  }
}
```

### Common Filter Types
- `color_filter` - Color correction
- `chroma_key_filter` - Chroma key (green screen)
- `crop_filter` - Crop/Pad
- `gain_filter` - Gain (audio)
- `mask_filter` - Image mask/blend
- `scroll_filter` - Scroll
- `sharpness_filter` - Sharpen
- `noise_gate_filter` - Noise gate (audio)
- `compressor_filter` - Compressor (audio)

## Export Process

When exporting a scene:

1. Load scene from internal format
2. Convert element types to OBS source types
3. Map properties to OBS settings
4. Convert transform format
5. Convert filters
6. Generate OBS-compatible JSON
7. Provide download

## Import Process (Future)

When importing an OBS scene:

1. Parse OBS JSON
2. Map OBS source types to our element types
3. Convert settings to our properties format
4. Convert transform format
5. Convert filters
6. Create scene in our database
7. Save to JSON file

## Example Full Scene

```json
{
  "name": "Gaming Scene",
  "sources": [
    {
      "id": "display-1",
      "name": "Game Display",
      "type": "game_capture",
      "settings": {
        "capture_mode": "any_fullscreen"
      },
      "transform": {
        "pos": { "x": 0, "y": 0 },
        "rot": 0,
        "scale": { "x": 1, "y": 1 },
        "alignment": 5,
        "bounds_type": 0,
        "bounds_alignment": 0,
        "bounds": { "x": 1920, "y": 1080 }
      },
      "visible": true,
      "locked": false,
      "filters": []
    },
    {
      "id": "webcam-1",
      "name": "Webcam",
      "type": "dshow_input",
      "settings": {
        "video_device_id": "Webcam"
      },
      "transform": {
        "pos": { "x": 1600, "y": 880 },
        "rot": 0,
        "scale": { "x": 1, "y": 1 },
        "alignment": 5,
        "bounds_type": 0,
        "bounds_alignment": 0,
        "bounds": { "x": 320, "y": 240 }
      },
      "visible": true,
      "locked": false,
      "filters": [
        {
          "name": "Chroma Key",
          "type": "chroma_key_filter",
          "enabled": true,
          "settings": {
            "key_color": 65280,
            "similarity": 400,
            "smoothness": 80
          }
        }
      ]
    },
    {
      "id": "text-1",
      "name": "Stream Title",
      "type": "text_gdiplus_v2",
      "settings": {
        "text": "Welcome to the Stream!",
        "font": {
          "face": "Arial",
          "size": 72,
          "flags": 1,
          "style": "Bold"
        },
        "color": 4294967295
      },
      "transform": {
        "pos": { "x": 960, "y": 100 },
        "rot": 0,
        "scale": { "x": 1, "y": 1 },
        "alignment": 1,
        "bounds_type": 0,
        "bounds_alignment": 0,
        "bounds": { "x": 800, "y": 100 }
      },
      "visible": true,
      "locked": false,
      "filters": []
    }
  ]
}
```

## Notes

- All colors are in ARGB format (32-bit integer)
- Positions are in pixels
- Rotation is in degrees (0-360)
- Scale is a multiplier (1.0 = 100%)
- File paths should be absolute or relative to OBS base directory
- Some source types are platform-specific (e.g., game_capture on Windows)

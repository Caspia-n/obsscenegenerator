import { Scene, OBSSceneJSON, ElementType } from '@/types/obs';
import { promises as fs } from 'fs';
import path from 'path';

const SCENE_STORAGE_PATH = process.env.SCENE_STORAGE_PATH || './public/scenes';

// Ensure storage directory exists
export async function ensureStorageDirectory(): Promise<void> {
  try {
    await fs.mkdir(SCENE_STORAGE_PATH, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
}

// Save scene to JSON file
export async function saveSceneToFile(scene: Scene): Promise<string> {
  await ensureStorageDirectory();
  
  const fileName = `${scene.id}.json`;
  const filePath = path.join(SCENE_STORAGE_PATH, fileName);
  
  await fs.writeFile(filePath, JSON.stringify(scene, null, 2), 'utf-8');
  
  return `/scenes/${fileName}`;
}

// Load scene from JSON file
export async function loadSceneFromFile(jsonPath: string): Promise<Scene | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', jsonPath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Scene;
  } catch (error) {
    console.error('Error loading scene from file:', error);
    return null;
  }
}

// Delete scene file
export async function deleteSceneFile(jsonPath: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), 'public', jsonPath);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting scene file:', error);
  }
}

// Convert internal Scene format to OBS JSON format
export function convertToOBSFormat(scene: Scene): OBSSceneJSON {
  return {
    name: scene.name,
    sources: scene.elements.map((element) => ({
      id: element.id,
      name: element.name,
      type: mapElementTypeToOBS(element.type),
      settings: element.properties,
      filters: element.filters.map((filter) => ({
        name: filter.name,
        type: filter.type,
        enabled: filter.enabled,
        settings: filter.settings,
      })),
      transform: {
        pos: { x: element.transform.position.x, y: element.transform.position.y },
        rot: element.transform.rotation,
        scale: { x: element.transform.scale.x, y: element.transform.scale.y },
        alignment: element.transform.alignment,
        bounds_type: element.transform.boundsType,
        bounds_alignment: element.transform.boundsAlignment,
        bounds: { x: element.transform.bounds.x, y: element.transform.bounds.y },
      },
      visible: element.visible,
      locked: element.locked,
    })),
  };
}

// Convert OBS JSON format to internal Scene format
export function convertFromOBSFormat(
  obsScene: OBSSceneJSON,
  id: string,
  width: number = 1920,
  height: number = 1080
): Scene {
  return {
    id,
    name: obsScene.name,
    width,
    height,
    elements: obsScene.sources.map((source, index) => ({
      id: source.id,
      name: source.name,
      type: mapOBSTypeToElement(source.type),
      visible: source.visible,
      locked: source.locked,
      bounds: {
        x: source.transform.pos.x,
        y: source.transform.pos.y,
        width: source.transform.bounds.x,
        height: source.transform.bounds.y,
      },
      transform: {
        position: { x: source.transform.pos.x, y: source.transform.pos.y },
        rotation: source.transform.rot,
        scale: { x: source.transform.scale.x, y: source.transform.scale.y },
        alignment: source.transform.alignment,
        boundsType: source.transform.bounds_type,
        boundsAlignment: source.transform.bounds_alignment,
        bounds: { x: source.transform.bounds.x, y: source.transform.bounds.y },
      },
      properties: source.settings,
      filters: source.filters.map((filter, filterIndex) => ({
        id: `filter-${source.id}-${filterIndex}`,
        name: filter.name,
        type: filter.type,
        enabled: filter.enabled,
        settings: filter.settings,
      })),
      order: index,
    })),
  };
}

// Map internal element types to OBS source types
function mapElementTypeToOBS(type: string): string {
  const typeMap: Record<string, string> = {
    browser_source: 'browser_source',
    text: 'text_gdiplus_v2',
    image: 'image_source',
    game_capture: 'game_capture',
    window_capture: 'window_capture',
    display_capture: 'monitor_capture',
    audio_capture: 'wasapi_input_capture',
    video_capture: 'dshow_input',
    color_source: 'color_source',
    media_source: 'ffmpeg_source',
  };
  return typeMap[type] || type;
}

// Map OBS source types to internal element types
function mapOBSTypeToElement(type: string): ElementType {
  const typeMap: Record<string, string> = {
    browser_source: 'browser_source',
    text_gdiplus_v2: 'text',
    text_ft2_source_v2: 'text',
    image_source: 'image',
    game_capture: 'game_capture',
    window_capture: 'window_capture',
    monitor_capture: 'display_capture',
    wasapi_input_capture: 'audio_capture',
    wasapi_output_capture: 'audio_capture',
    dshow_input: 'video_capture',
    color_source: 'color_source',
    ffmpeg_source: 'media_source',
  };
  return (typeMap[type] as ElementType) || 'browser_source';
}

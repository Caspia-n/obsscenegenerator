// OBS Scene Types - Compatible with OBS Studio JSON format

export type ElementType =
  | 'browser_source'
  | 'text'
  | 'image'
  | 'game_capture'
  | 'window_capture'
  | 'display_capture'
  | 'audio_capture'
  | 'video_capture'
  | 'color_source'
  | 'media_source';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  position: { x: number; y: number };
  rotation: number;
  scale: { x: number; y: number };
  alignment: number;
  boundsType: number;
  boundsAlignment: number;
  bounds: { x: number; y: number };
}

export interface Filter {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface SceneElementProperties {
  // Browser Source
  url?: string;
  width?: number;
  height?: number;
  fps?: number;
  css?: string;
  shutdown?: boolean;
  restart_when_active?: boolean;
  
  // Text (GDI+/FreeType2)
  text?: string;
  font?: {
    face: string;
    size: number;
    flags: number;
    style: string;
  };
  color?: number;
  opacity?: number;
  
  // Image
  file?: string;
  unload?: boolean;
  
  // Game/Window/Display Capture
  capture_mode?: string;
  window?: string;
  priority?: number;
  
  // Audio
  device_id?: string;
  
  // Common properties
  [key: string]: unknown;
}

export interface SceneElement {
  id: string;
  name: string;
  type: ElementType;
  visible: boolean;
  locked: boolean;
  bounds: Bounds;
  transform: Transform;
  properties: SceneElementProperties;
  filters: Filter[];
  order: number; // z-index/layer order
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  elements: SceneElement[];
  createdAt?: Date;
  updatedAt?: Date;
  jsonPath?: string;
}

// OBS Studio JSON Export Format
export interface OBSSceneJSON {
  name: string;
  sources: Array<{
    id: string;
    name: string;
    type: string;
    settings: Record<string, unknown>;
    filters: Array<{
      name: string;
      type: string;
      enabled: boolean;
      settings: Record<string, unknown>;
    }>;
    transform: {
      pos: { x: number; y: number };
      rot: number;
      scale: { x: number; y: number };
      alignment: number;
      bounds_type: number;
      bounds_alignment: number;
      bounds: { x: number; y: number };
    };
    visible: boolean;
    locked: boolean;
  }>;
}

// Database types
export interface SceneRecord {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  json_path: string;
  width: number;
  height: number;
}

export interface SceneElementRecord {
  id: string;
  scene_id: string;
  element_type: ElementType;
  properties: Record<string, unknown>;
  order: number;
  created_at: Date;
  updated_at: Date;
}

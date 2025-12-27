import pool from './client';
import { Scene, SceneRecord, SceneElement, SceneElementRecord } from '@/types/obs';
import { v4 as uuidv4 } from 'uuid';

// Scene Queries

export async function createScene(scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>): Promise<SceneRecord> {
  const id = uuidv4();
  const jsonPath = `/scenes/${id}.json`;
  
  const query = `
    INSERT INTO scenes (id, name, description, width, height, json_path)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const values = [
    id,
    scene.name,
    scene.description || null,
    scene.width,
    scene.height,
    jsonPath,
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getSceneById(id: string): Promise<SceneRecord | null> {
  const query = 'SELECT * FROM scenes WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getAllScenes(): Promise<SceneRecord[]> {
  const query = 'SELECT * FROM scenes ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
}

export async function updateScene(
  id: string,
  updates: Partial<Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SceneRecord | null> {
  const fields = [];
  const values = [];
  let paramIndex = 1;
  
  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }
  if (updates.width !== undefined) {
    fields.push(`width = $${paramIndex++}`);
    values.push(updates.width);
  }
  if (updates.height !== undefined) {
    fields.push(`height = $${paramIndex++}`);
    values.push(updates.height);
  }
  
  if (fields.length === 0) {
    return getSceneById(id);
  }
  
  values.push(id);
  const query = `
    UPDATE scenes
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteScene(id: string): Promise<boolean> {
  const query = 'DELETE FROM scenes WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
}

// Scene Element Queries

export async function createSceneElement(
  sceneId: string,
  element: Omit<SceneElement, 'id'>
): Promise<SceneElementRecord> {
  const id = uuidv4();
  
  const query = `
    INSERT INTO scene_elements (id, scene_id, element_type, properties, "order")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const properties = {
    name: element.name,
    visible: element.visible,
    locked: element.locked,
    bounds: element.bounds,
    transform: element.transform,
    properties: element.properties,
    filters: element.filters,
  };
  
  const values = [id, sceneId, element.type, JSON.stringify(properties), element.order];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getSceneElements(sceneId: string): Promise<SceneElementRecord[]> {
  const query = 'SELECT * FROM scene_elements WHERE scene_id = $1 ORDER BY "order" ASC';
  const result = await pool.query(query, [sceneId]);
  return result.rows;
}

export async function updateSceneElement(
  id: string,
  updates: Partial<Omit<SceneElement, 'id'>>
): Promise<SceneElementRecord | null> {
  const fields = [];
  const values = [];
  let paramIndex = 1;
  
  if (updates.type !== undefined) {
    fields.push(`element_type = $${paramIndex++}`);
    values.push(updates.type);
  }
  if (updates.order !== undefined) {
    fields.push(`"order" = $${paramIndex++}`);
    values.push(updates.order);
  }
  
  // Handle properties update
  const propertiesToUpdate: Record<string, unknown> = {};
  if (updates.name !== undefined) propertiesToUpdate.name = updates.name;
  if (updates.visible !== undefined) propertiesToUpdate.visible = updates.visible;
  if (updates.locked !== undefined) propertiesToUpdate.locked = updates.locked;
  if (updates.bounds !== undefined) propertiesToUpdate.bounds = updates.bounds;
  if (updates.transform !== undefined) propertiesToUpdate.transform = updates.transform;
  if (updates.properties !== undefined) propertiesToUpdate.properties = updates.properties;
  if (updates.filters !== undefined) propertiesToUpdate.filters = updates.filters;
  
  if (Object.keys(propertiesToUpdate).length > 0) {
    fields.push(`properties = properties || $${paramIndex++}::jsonb`);
    values.push(JSON.stringify(propertiesToUpdate));
  }
  
  if (fields.length === 0) {
    return null;
  }
  
  values.push(id);
  const query = `
    UPDATE scene_elements
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteSceneElement(id: string): Promise<boolean> {
  const query = 'DELETE FROM scene_elements WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
}

export async function deleteSceneElements(sceneId: string): Promise<boolean> {
  const query = 'DELETE FROM scene_elements WHERE scene_id = $1';
  const result = await pool.query(query, [sceneId]);
  return result.rowCount !== null && result.rowCount > 0;
}

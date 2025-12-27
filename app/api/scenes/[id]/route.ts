import { NextRequest, NextResponse } from 'next/server';
import { getSceneById, updateScene, deleteScene } from '@/lib/db/queries';
import { loadSceneFromFile, saveSceneToFile, deleteSceneFile } from '@/lib/utils/scene-storage';

// GET /api/scenes/[id] - Get scene by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sceneRecord = await getSceneById(id);
    
    if (!sceneRecord) {
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      );
    }
    
    // Load full scene data from JSON file
    const scene = await loadSceneFromFile(sceneRecord.json_path);
    
    if (!scene) {
      return NextResponse.json(
        { error: 'Scene data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ scene: { ...scene, ...sceneRecord } });
  } catch (error) {
    console.error('Error fetching scene:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scene' },
      { status: 500 }
    );
  }
}

// PUT /api/scenes/[id] - Update scene
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const sceneRecord = await getSceneById(id);
    
    if (!sceneRecord) {
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      );
    }
    
    // Update database record
    const updates: Record<string, string | number> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.width !== undefined) updates.width = body.width;
    if (body.height !== undefined) updates.height = body.height;
    
    const updatedRecord = await updateScene(id, updates);
    
    // Load current scene data
    const currentScene = await loadSceneFromFile(sceneRecord.json_path);
    
    if (!currentScene) {
      return NextResponse.json(
        { error: 'Scene data not found' },
        { status: 404 }
      );
    }
    
    // Merge updates into scene data
    const updatedScene = {
      ...currentScene,
      ...updates,
      elements: body.elements !== undefined ? body.elements : currentScene.elements,
      updatedAt: new Date(),
    };
    
    // Save updated scene to file
    await saveSceneToFile(updatedScene);
    
    return NextResponse.json({ scene: { ...updatedScene, ...updatedRecord } });
  } catch (error) {
    console.error('Error updating scene:', error);
    return NextResponse.json(
      { error: 'Failed to update scene' },
      { status: 500 }
    );
  }
}

// DELETE /api/scenes/[id] - Delete scene
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sceneRecord = await getSceneById(id);
    
    if (!sceneRecord) {
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      );
    }
    
    // Delete from database
    await deleteScene(id);
    
    // Delete JSON file
    await deleteSceneFile(sceneRecord.json_path);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting scene:', error);
    return NextResponse.json(
      { error: 'Failed to delete scene' },
      { status: 500 }
    );
  }
}

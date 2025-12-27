import { NextRequest, NextResponse } from 'next/server';
import { getAllScenes, createScene } from '@/lib/db/queries';
import { saveSceneToFile } from '@/lib/utils/scene-storage';
import { Scene } from '@/types/obs';

// GET /api/scenes - Get all scenes
export async function GET() {
  try {
    const scenes = await getAllScenes();
    return NextResponse.json({ scenes });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenes' },
      { status: 500 }
    );
  }
}

// POST /api/scenes - Create new scene
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, width = 1920, height = 1080 } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Scene name is required' },
        { status: 400 }
      );
    }
    
    // Create scene in database
    const sceneRecord = await createScene({
      name,
      description,
      width,
      height,
      elements: [],
    });
    
    // Create initial scene object
    const scene: Scene = {
      id: sceneRecord.id,
      name: sceneRecord.name,
      description: sceneRecord.description || undefined,
      width: sceneRecord.width,
      height: sceneRecord.height,
      elements: [],
      createdAt: sceneRecord.created_at,
      updatedAt: sceneRecord.updated_at,
      jsonPath: sceneRecord.json_path,
    };
    
    // Save to JSON file
    await saveSceneToFile(scene);
    
    return NextResponse.json({ scene: sceneRecord }, { status: 201 });
  } catch (error) {
    console.error('Error creating scene:', error);
    return NextResponse.json(
      { error: 'Failed to create scene' },
      { status: 500 }
    );
  }
}

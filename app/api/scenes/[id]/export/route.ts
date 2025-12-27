import { NextRequest, NextResponse } from 'next/server';
import { getSceneById } from '@/lib/db/queries';
import { loadSceneFromFile, convertToOBSFormat } from '@/lib/utils/scene-storage';

// GET /api/scenes/[id]/export - Export scene as OBS JSON
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
    
    // Load scene data
    const scene = await loadSceneFromFile(sceneRecord.json_path);
    
    if (!scene) {
      return NextResponse.json(
        { error: 'Scene data not found' },
        { status: 404 }
      );
    }
    
    // Convert to OBS format
    const obsScene = convertToOBSFormat(scene);
    
    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(obsScene, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${scene.name}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting scene:', error);
    return NextResponse.json(
      { error: 'Failed to export scene' },
      { status: 500 }
    );
  }
}

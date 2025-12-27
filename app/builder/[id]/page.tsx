'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { Scene, SceneElement, ElementType } from '@/types/obs';
import { v4 as uuidv4 } from 'uuid';
import SceneCanvas from '@/components/SceneCanvas';
import ElementPanel from '@/components/ElementPanel';
import PropertiesPanel from '@/components/PropertiesPanel';
import LivePreview from '@/components/LivePreview';

export default function SceneBuilder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    fetchScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const fetchScene = async () => {
    try {
      const response = await fetch(`/api/scenes/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setScene(data.scene);
      } else {
        console.error('Scene not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching scene:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScene = async () => {
    if (!scene) return;

    setSaving(true);
    try {
      await fetch(`/api/scenes/${scene.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scene),
      });
    } catch (error) {
      console.error('Error saving scene:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddElement = (type: ElementType) => {
    if (!scene) return;

    const newElement: SceneElement = {
      id: uuidv4(),
      name: `${type} ${scene.elements.length + 1}`,
      type,
      visible: true,
      locked: false,
      bounds: {
        x: 100 + scene.elements.length * 20,
        y: 100 + scene.elements.length * 20,
        width: 400,
        height: 300,
      },
      transform: {
        position: { x: 100, y: 100 },
        rotation: 0,
        scale: { x: 1, y: 1 },
        alignment: 5,
        boundsType: 0,
        boundsAlignment: 0,
        bounds: { x: 400, y: 300 },
      },
      properties: getDefaultProperties(type),
      filters: [],
      order: scene.elements.length,
    };

    setScene({
      ...scene,
      elements: [...scene.elements, newElement],
    });
    setSelectedElement(newElement.id);
  };

  const handleUpdateElement = (id: string, updates: Partial<SceneElement>) => {
    if (!scene) return;

    setScene({
      ...scene,
      elements: scene.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    });
  };

  const handleDeleteElement = () => {
    if (!scene || !selectedElement) return;

    setScene({
      ...scene,
      elements: scene.elements.filter((el) => el.id !== selectedElement),
    });
    setSelectedElement(null);
  };

  const handleDuplicateElement = () => {
    if (!scene || !selectedElement) return;

    const element = scene.elements.find((el) => el.id === selectedElement);
    if (!element) return;

    const newElement: SceneElement = {
      ...element,
      id: uuidv4(),
      name: `${element.name} (copy)`,
      bounds: {
        ...element.bounds,
        x: element.bounds.x + 20,
        y: element.bounds.y + 20,
      },
      order: scene.elements.length,
    };

    setScene({
      ...scene,
      elements: [...scene.elements, newElement],
    });
    setSelectedElement(newElement.id);
  };

  const handleMoveUp = () => {
    if (!scene || !selectedElement) return;

    const index = scene.elements.findIndex((el) => el.id === selectedElement);
    if (index < scene.elements.length - 1) {
      const newElements = [...scene.elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      newElements[index].order = index;
      newElements[index + 1].order = index + 1;
      
      setScene({
        ...scene,
        elements: newElements,
      });
    }
  };

  const handleMoveDown = () => {
    if (!scene || !selectedElement) return;

    const index = scene.elements.findIndex((el) => el.id === selectedElement);
    if (index > 0) {
      const newElements = [...scene.elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      newElements[index].order = index;
      newElements[index - 1].order = index - 1;
      
      setScene({
        ...scene,
        elements: newElements,
      });
    }
  };

  const handleExport = async () => {
    if (!scene) return;
    
    window.open(`/api/scenes/${scene.id}/export`, '_blank');
  };

  const handleCopyJSON = async () => {
    if (!scene) return;

    try {
      const response = await fetch(`/api/scenes/${scene.id}/export`);
      const json = await response.text();
      await navigator.clipboard.writeText(json);
      alert('OBS JSON copied to clipboard!');
    } catch (error) {
      console.error('Error copying JSON:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!scene) {
    return null;
  }

  const selectedElementData = scene.elements.find((el) => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="flat"
                onPress={() => router.push('/')}
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{scene.name}</h1>
                <p className="text-sm text-gray-400">
                  {scene.width} x {scene.height} | {scene.elements.length} elements
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleCopyJSON}
              >
                Copy JSON
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleExport}
              >
                Export
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={saveScene}
                isLoading={saving}
              >
                Save Scene
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <ElementPanel onAddElement={handleAddElement} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Scene Canvas</h2>
                <p className="text-sm text-gray-400">Drag elements to position them</p>
              </div>
              <div className="flex justify-center">
                <SceneCanvas
                  elements={scene.elements}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onUpdateElement={handleUpdateElement}
                  width={scene.width}
                  height={scene.height}
                  scale={0.4}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <LivePreview
                elements={scene.elements}
                width={scene.width}
                height={scene.height}
                scale={0.3}
              />
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <PropertiesPanel
                element={selectedElementData || null}
                onUpdateElement={(updates) => {
                  if (selectedElement) {
                    handleUpdateElement(selectedElement, updates);
                  }
                }}
                onDeleteElement={handleDeleteElement}
                onDuplicateElement={handleDuplicateElement}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getDefaultProperties(type: ElementType): Record<string, unknown> {
  switch (type) {
    case 'browser_source':
      return {
        url: '',
        width: 1920,
        height: 1080,
        fps: 30,
        css: '',
      };
    case 'text':
      return {
        text: 'Sample Text',
        font: {
          face: 'Arial',
          size: 32,
          flags: 0,
          style: '',
        },
        color: 0xffffff,
      };
    case 'image':
      return {
        file: '',
        unload: false,
      };
    case 'color_source':
      return {
        color: 0xff00ff,
      };
    default:
      return {};
  }
}

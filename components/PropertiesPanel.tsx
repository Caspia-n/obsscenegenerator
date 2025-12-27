'use client';

import { Input, Button, Switch, Slider } from '@heroui/react';
import { SceneElement } from '@/types/obs';
import { motion } from 'framer-motion';

interface PropertiesPanelProps {
  element: SceneElement | null;
  onUpdateElement: (updates: Partial<SceneElement>) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function PropertiesPanel({
  element,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveUp,
  onMoveDown,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select an element to edit properties</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
        
        <div className="space-y-3">
          <Input
            label="Name"
            value={element.name}
            onValueChange={(value) => onUpdateElement({ name: value })}
            size="sm"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="X Position"
              type="number"
              value={element.bounds.x.toString()}
              onValueChange={(value) =>
                onUpdateElement({
                  bounds: { ...element.bounds, x: parseFloat(value) || 0 },
                  transform: {
                    ...element.transform,
                    position: { ...element.transform.position, x: parseFloat(value) || 0 },
                  },
                })
              }
              size="sm"
            />
            <Input
              label="Y Position"
              type="number"
              value={element.bounds.y.toString()}
              onValueChange={(value) =>
                onUpdateElement({
                  bounds: { ...element.bounds, y: parseFloat(value) || 0 },
                  transform: {
                    ...element.transform,
                    position: { ...element.transform.position, y: parseFloat(value) || 0 },
                  },
                })
              }
              size="sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Width"
              type="number"
              value={element.bounds.width.toString()}
              onValueChange={(value) =>
                onUpdateElement({
                  bounds: { ...element.bounds, width: parseFloat(value) || 0 },
                })
              }
              size="sm"
            />
            <Input
              label="Height"
              type="number"
              value={element.bounds.height.toString()}
              onValueChange={(value) =>
                onUpdateElement({
                  bounds: { ...element.bounds, height: parseFloat(value) || 0 },
                })
              }
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Visible</label>
            <Switch
              isSelected={element.visible}
              onValueChange={(value) => onUpdateElement({ visible: value })}
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Locked</label>
            <Switch
              isSelected={element.locked}
              onValueChange={(value) => onUpdateElement({ locked: value })}
              size="sm"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Rotation</label>
            <Slider
              size="sm"
              step={1}
              minValue={0}
              maxValue={360}
              value={element.transform.rotation}
              onChange={(value) =>
                onUpdateElement({
                  transform: {
                    ...element.transform,
                    rotation: Array.isArray(value) ? value[0] : value,
                  },
                })
              }
              className="max-w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {element.transform.rotation}°
            </p>
          </div>
          
          {element.type === 'browser_source' && (
            <Input
              label="URL"
              value={element.properties.url || ''}
              onValueChange={(value) =>
                onUpdateElement({
                  properties: { ...element.properties, url: value },
                })
              }
              size="sm"
              placeholder="https://example.com"
            />
          )}
          
          {element.type === 'text' && (
            <>
              <Input
                label="Text Content"
                value={element.properties.text || ''}
                onValueChange={(value) =>
                  onUpdateElement({
                    properties: { ...element.properties, text: value },
                  })
                }
                size="sm"
                placeholder="Enter text"
              />
              <Input
                label="Font Size"
                type="number"
                value={element.properties.font?.size?.toString() || '32'}
                onValueChange={(value) =>
                  onUpdateElement({
                    properties: {
                      ...element.properties,
                      font: {
                        face: element.properties.font?.face || 'Arial',
                        size: parseInt(value) || 32,
                        flags: element.properties.font?.flags || 0,
                        style: element.properties.font?.style || '',
                      },
                    },
                  })
                }
                size="sm"
              />
            </>
          )}
          
          {element.type === 'image' && (
            <Input
              label="Image Path"
              value={element.properties.file || ''}
              onValueChange={(value) =>
                onUpdateElement({
                  properties: { ...element.properties, file: value },
                })
              }
              size="sm"
              placeholder="/path/to/image.png"
            />
          )}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-700 space-y-2">
        <h4 className="text-sm font-semibold text-white mb-2">Layer Order</h4>
        <div className="flex gap-2">
          <Button size="sm" onPress={onMoveUp} className="flex-1">
            Move Up
          </Button>
          <Button size="sm" onPress={onMoveDown} className="flex-1">
            Move Down
          </Button>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-700 space-y-2">
        <h4 className="text-sm font-semibold text-white mb-2">Actions</h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={onDuplicateElement}
            className="flex-1"
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={onDeleteElement}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

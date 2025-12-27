'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SceneElement } from '@/types/obs';

interface SceneCanvasProps {
  elements: SceneElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<SceneElement>) => void;
  width: number;
  height: number;
  scale?: number;
}

export default function SceneCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement, // eslint-disable-line @typescript-eslint/no-unused-vars
  width,
  height,
  scale = 0.5,
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const renderElement = (element: SceneElement) => {
    const isSelected = selectedElement === element.id;
    
    return (
      <motion.div
        key={element.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: element.visible ? 1 : 0.3 }}
        style={{
          position: 'absolute',
          left: element.bounds.x * scale,
          top: element.bounds.y * scale,
          width: element.bounds.width * scale,
          height: element.bounds.height * scale,
          zIndex: element.order,
          cursor: 'move',
        }}
        className={`border-2 ${
          isSelected ? 'border-purple-500' : 'border-transparent'
        } ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} hover:border-purple-300 transition-colors`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectElement(element.id);
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center overflow-hidden">
          <div className="text-center p-2">
            <div className="text-xs font-semibold text-white mb-1">
              {getElementIcon(element.type)}
            </div>
            <div className="text-xs text-gray-300 truncate">{element.name}</div>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
        )}
      </motion.div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative bg-black rounded-lg overflow-hidden border-2 border-gray-700"
      style={{
        width: width * scale,
        height: height * scale,
      }}
      onClick={() => onSelectElement(null)}
    >
      {elements
        .sort((a, b) => a.order - b.order)
        .map((element) => renderElement(element))}
      
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Drop elements here</p>
        </div>
      )}
    </div>
  );
}

function getElementIcon(type: string): string {
  const icons: Record<string, string> = {
    browser_source: '🌐',
    text: '📝',
    image: '🖼️',
    game_capture: '🎮',
    window_capture: '🪟',
    display_capture: '🖥️',
    audio_capture: '🎤',
    video_capture: '📹',
    color_source: '🎨',
    media_source: '🎬',
  };
  return icons[type] || '📦';
}

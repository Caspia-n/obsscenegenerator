'use client';

import { SceneElement } from '@/types/obs';
import { motion } from 'framer-motion';

interface LivePreviewProps {
  elements: SceneElement[];
  width: number;
  height: number;
  scale?: number;
}

export default function LivePreview({
  elements,
  width,
  height,
  scale = 0.4,
}: LivePreviewProps) {
  const renderElement = (element: SceneElement) => {
    if (!element.visible) return null;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.bounds.x * scale,
      top: element.bounds.y * scale,
      width: element.bounds.width * scale,
      height: element.bounds.height * scale,
      zIndex: element.order,
      transform: `rotate(${element.transform.rotation}deg) scale(${element.transform.scale.x}, ${element.transform.scale.y})`,
      transformOrigin: 'center',
    };
    
    return (
      <motion.div
        key={element.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={style}
        className="overflow-hidden"
      >
        {renderElementContent(element)}
      </motion.div>
    );
  };
  
  const renderElementContent = (element: SceneElement) => {
    switch (element.type) {
      case 'browser_source':
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-xs">Browser Source</div>
              {element.properties.url && (
                <div className="text-xs text-gray-300 mt-1 truncate px-2">
                  {element.properties.url}
                </div>
              )}
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              fontSize: `${(element.properties.font?.size || 32) * scale}px`,
              color: element.properties.color ? `#${element.properties.color.toString(16)}` : '#ffffff',
            }}
          >
            {element.properties.text || element.name}
          </div>
        );
        
      case 'image':
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-900 to-teal-900 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-xs">Image</div>
              {element.properties.file && (
                <div className="text-xs text-gray-300 mt-1 truncate px-2">
                  {element.properties.file.split('/').pop()}
                </div>
              )}
            </div>
          </div>
        );
        
      case 'game_capture':
        return (
          <div className="w-full h-full bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-xs">Game Capture</div>
            </div>
          </div>
        );
        
      case 'window_capture':
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-2xl mb-2">🪟</div>
              <div className="text-xs">Window Capture</div>
            </div>
          </div>
        );
        
      case 'display_capture':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-2xl mb-2">🖥️</div>
              <div className="text-xs">Display Capture</div>
            </div>
          </div>
        );
        
      case 'color_source':
        return (
          <div
            className="w-full h-full rounded"
            style={{
              backgroundColor: element.properties.color
                ? `#${element.properties.color.toString(16).padStart(6, '0')}`
                : '#ff00ff',
            }}
          />
        );
        
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded">
            <div className="text-center text-white">
              <div className="text-xs">{element.name}</div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        <div className="text-xs text-gray-400">
          {width} x {height}
        </div>
      </div>
      
      <div
        className="relative bg-black rounded-lg overflow-hidden border-2 border-gray-700"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        {elements
          .sort((a, b) => a.order - b.order)
          .map((element) => renderElement(element))}
        
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Preview will appear here</p>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Updates in real-time as you build
      </div>
    </div>
  );
}

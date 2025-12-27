'use client';

import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { ElementType } from '@/types/obs';

interface ElementPanelProps {
  onAddElement: (type: ElementType) => void;
}

const elementTypes: Array<{ type: ElementType; label: string; icon: string; description: string }> = [
  { type: 'browser_source', label: 'Browser Source', icon: '🌐', description: 'Web page or HTML' },
  { type: 'text', label: 'Text', icon: '📝', description: 'Text overlay' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Static image' },
  { type: 'game_capture', label: 'Game Capture', icon: '🎮', description: 'Capture games' },
  { type: 'window_capture', label: 'Window Capture', icon: '🪟', description: 'Capture window' },
  { type: 'display_capture', label: 'Display Capture', icon: '🖥️', description: 'Capture screen' },
  { type: 'audio_capture', label: 'Audio Input', icon: '🎤', description: 'Microphone' },
  { type: 'video_capture', label: 'Video Capture', icon: '📹', description: 'Webcam' },
  { type: 'color_source', label: 'Color Source', icon: '🎨', description: 'Solid color' },
  { type: 'media_source', label: 'Media Source', icon: '🎬', description: 'Video/Audio file' },
];

export default function ElementPanel({ onAddElement }: ElementPanelProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white mb-4">Add Elements</h3>
      <div className="grid grid-cols-2 gap-2">
        {elementTypes.map((element, index) => (
          <motion.div
            key={element.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              isPressable
              onPress={() => onAddElement(element.type)}
              className="bg-gray-800/50 border border-gray-700 hover:border-purple-500 transition-all duration-200"
            >
              <CardBody className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{element.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {element.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {element.description}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure } from '@heroui/react';
import { motion } from 'framer-motion';
import { SceneRecord } from '@/types/obs';

export default function Home() {
  const router = useRouter();
  const [scenes, setScenes] = useState<SceneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneDescription, setNewSceneDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes');
      const data = await response.json();
      setScenes(data.scenes || []);
    } catch (error) {
      console.error('Error fetching scenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setNewSceneName('');
    setNewSceneDescription('');
    setError(null);
    onOpen();
  };

  const handleCreateScene = async () => {
    if (!newSceneName.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSceneName,
          description: newSceneDescription,
          width: 1920,
          height: 1080,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/builder/${data.scene.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create scene');
      }
    } catch (error) {
      console.error('Error creating scene:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteScene = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this scene?')) return;

    try {
      await fetch(`/api/scenes/${id}`, { method: 'DELETE' });
      setScenes(scenes.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              OBS Scene Builder
            </h1>
            <p className="text-xl text-gray-300">
              Create professional OBS scenes with visual builder and live preview
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Button
            size="lg"
            color="primary"
            onPress={openModal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
          >
            + Create New Scene
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="primary" />
          </div>
        ) : scenes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 mb-4">No scenes yet</p>
            <p className="text-gray-500">Create your first scene to get started</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <Card
                  isPressable
                  onPress={() => router.push(`/builder/${scene.id}`)}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{scene.name}</h3>
                      <p className="text-sm text-gray-400">
                        {scene.width} x {scene.height}
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-300 mb-4">
                      {scene.description || 'No description'}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {new Date(scene.created_at).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={(e: unknown) => handleDeleteScene(scene.id, e as React.MouseEvent)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">Create New Scene</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Scene Name"
              placeholder="Enter scene name"
              value={newSceneName}
              onValueChange={setNewSceneName}
              isRequired
            />
            <Textarea
              label="Description (optional)"
              placeholder="Enter scene description"
              value={newSceneDescription}
              onValueChange={setNewSceneDescription}
            />
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="text-sm text-gray-400">
              Default resolution: 1920 x 1080
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateScene}
              isLoading={creating}
              isDisabled={!newSceneName.trim()}
            >
              Create Scene
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

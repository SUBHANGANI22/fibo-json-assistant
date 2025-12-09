import React, { useState, useEffect, MutableRefObject, useCallback } from 'react';
import { History, X, RefreshCw, Shuffle, Download, Eye, Trash } from 'lucide-react';

interface HistoryImage {
  id: string;
  imageUrl: string;
  config: any;
  seed?: number;
  timestamp: string;
}

interface Props {
  onRegenerateExact: (config: any, seed: number) => void;
  onRegenerateVariation: (config: any) => void;
  onLoadConfig: (config: any) => void;
  addToHistoryRef: MutableRefObject<((imageUrl: string, config: any, seed?: number) => void) | null>;
}

export default function ImageHistorySidebar({ 
  onRegenerateExact, 
  onRegenerateVariation,
  onLoadConfig,
  addToHistoryRef
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<HistoryImage | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fibo-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // ✅ FIX: Use useCallback with functional state update to handle rapid batch additions
  const addToHistory = useCallback((imageUrl: string, config: any, seed?: number) => {
    const MAX_SEED = 2147483647;
    const validSeed = seed && seed <= MAX_SEED 
      ? seed 
      : Math.floor(Math.random() * MAX_SEED);
    
    const newEntry: HistoryImage = {
      id: Date.now().toString() + Math.random(), // Add random to ensure uniqueness in batch
      imageUrl,
      config,
      seed: validSeed,
      timestamp: new Date().toISOString(),
    };

    // ✅ FIX: Use functional state update to avoid stale closure issues
    setHistory(prevHistory => {
      const updated = [newEntry, ...prevHistory].slice(0, 50); // Keep last 50
      localStorage.setItem('fibo-history', JSON.stringify(updated));
      return updated;
    });
  }, []); // Empty dependency array since we use functional updates

  // Expose addToHistory to parent via ref
  useEffect(() => {
    addToHistoryRef.current = addToHistory;
  }, [addToHistory, addToHistoryRef]);

  const clearHistory = () => {
    if (confirm('Clear all image history?')) {
      setHistory([]);
      localStorage.removeItem('fibo-history');
      setSelectedImage(null);
    }
  };

  const deleteImage = (id: string) => {
    setHistory(prevHistory => {
      const updated = prevHistory.filter(img => img.id !== id);
      localStorage.setItem('fibo-history', JSON.stringify(updated));
      return updated;
    });
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const getConfigSummary = (config: any) => {
    return {
      description: config?.short_description?.substring(0, 60) || 'No description',
      style: config?.artistic_style || 'N/A',
      medium: config?.style_medium || 'N/A',
      lighting: config?.lighting?.conditions || 'N/A',
      mood: config?.aesthetics?.mood_atmosphere || 'N/A',
      camera: config?.photographic_characteristics?.camera_angle || 'N/A',
    };
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-110"
        title="Image History"
      >
        <History className="w-6 h-6" />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {history.length}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5" />
                Generation History
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-purple-100">
              {history.length} {history.length === 1 ? 'image' : 'images'} generated
            </p>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">No images yet</p>
                <p className="text-xs mt-1">Generate images to see them here</p>
              </div>
            ) : (
              history.map((img) => {
                const summary = getConfigSummary(img.config);
                return (
                  <div
                    key={img.id}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedImage?.id === img.id
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-gray-100">
                      <img
                        src={img.imageUrl}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {new Date(img.timestamp).toLocaleDateString()}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                        Seed: {img.seed}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-gray-50">
                      <p className="text-xs text-gray-800 font-semibold line-clamp-2 mb-2">
                        {summary.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          ✨ {summary.style}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          💡 {summary.lighting}
                        </span>
                        <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                          📷 {summary.camera}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          {history.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={clearHistory}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold">Image Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="p-6">
              <div className="relative mb-4">
                <img
                  src={selectedImage.imageUrl}
                  alt="Full size"
                  className="w-full rounded-lg shadow-lg"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedImage.imageUrl;
                    link.download = `fibo-${selectedImage.id}.png`;
                    link.click();
                  }}
                  className="absolute top-4 right-4 p-3 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* FIBO Config Summary */}
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  🎨 FIBO Configuration
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Style:</span>{' '}
                    <span className="font-semibold block">{selectedImage.config?.artistic_style}</span>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Medium:</span>{' '}
                    <span className="font-semibold block">{selectedImage.config?.style_medium}</span>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Lighting:</span>{' '}
                    <span className="font-semibold block">{selectedImage.config?.lighting?.conditions}</span>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Mood:</span>{' '}
                    <span className="font-semibold block">{selectedImage.config?.aesthetics?.mood_atmosphere}</span>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Camera:</span>{' '}
                    <span className="font-semibold block">{selectedImage.config?.photographic_characteristics?.camera_angle}</span>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="text-gray-600 text-xs">Seed:</span>{' '}
                    <span className="font-mono text-sm block font-semibold">{selectedImage.seed}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Description</h4>
                <p className="text-sm text-gray-700">
                  {selectedImage.config?.short_description || 'No description'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => {
                    onLoadConfig(selectedImage.config);
                    setSelectedImage(null);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  title="Load this configuration into the editor"
                >
                  <Eye className="w-4 h-4" />
                  Load Config
                </button>
                <button
                  onClick={() => {
                    onRegenerateExact(selectedImage.config, selectedImage.seed!);
                    setSelectedImage(null);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  title="Regenerate with exact same seed"
                >
                  <RefreshCw className="w-4 h-4" />
                  Exact
                </button>
                <button
                  onClick={() => {
                    onRegenerateVariation(selectedImage.config);
                    setSelectedImage(null);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  title="Regenerate with new random seed"
                >
                  <Shuffle className="w-4 h-4" />
                  Variation
                </button>
              </div>

              {/* JSON Config (Collapsible) */}
              <details className="mb-4">
                <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-purple-600 p-3 bg-gray-50 rounded-lg">
                  📄 View Full JSON Configuration
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto max-h-64">
                  {JSON.stringify(selectedImage.config, null, 2)}
                </pre>
              </details>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (confirm('Delete this image from history?')) {
                    deleteImage(selectedImage.id);
                  }
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Delete from History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(isOpen || selectedImage) && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => {
            setIsOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </>
  );
}
"use client";
import { useState, useEffect } from "react";
import { Save, Trash2, Upload } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  config: any;
  createdAt: string;
}

interface Props {
  currentConfig: any;
  onLoadPreset: (config: any) => void;
}

export default function PresetManager({ currentConfig, onLoadPreset }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Save current configuration as preset
  function savePreset() {
    if (!presetName.trim()) {
      alert("Please enter a preset name");
      return;
    }

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      config: currentConfig,
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    setPresetName("");
    setShowSaveDialog(false);
    
    // Save to localStorage for persistence (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("fibo-presets", JSON.stringify(updatedPresets));
    }
    
    alert(`✅ Preset "${newPreset.name}" saved!`);
  }

  // Load presets from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fibo-presets");
      if (saved) {
        try {
          setPresets(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load presets:", e);
        }
      }
    }
  }, []);

  // Load a preset
  function loadPreset(preset: Preset) {
    onLoadPreset(preset.config);
    alert(`✅ Loaded preset: ${preset.name}`);
  }

  // Delete a preset
  function deletePreset(id: string) {
    if (!confirm("Delete this preset?")) return;
    
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    
    // Update localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("fibo-presets", JSON.stringify(updated));
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        💾 Style Presets
      </h2>

      {/* Save Button */}
      <button
        onClick={() => setShowSaveDialog(true)}
        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Current Style as Preset
      </button>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
          <label className="block mb-2 font-semibold text-purple-900">
            Preset Name
          </label>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g., Product Photography - Warm"
            className="w-full p-3 border-2 border-purple-300 rounded-lg mb-3"
            onKeyPress={(e) => {
              if (e.key === "Enter") savePreset();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={savePreset}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName("");
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preset List */}
      <div className="space-y-2">
        {presets.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No presets saved yet. Create your first preset!
          </p>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-400 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(preset.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {preset.config.camera?.angle || "N/A"}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      {preset.config.lighting?.style || "N/A"}
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                      {preset.config.colors?.palette || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => loadPreset(preset)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    title="Load Preset"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title="Delete Preset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Presets save your entire JSON configuration
          (camera, lighting, colors, etc.) so you can reuse them across
          different prompts.
        </p>
      </div>
    </div>
  );
}
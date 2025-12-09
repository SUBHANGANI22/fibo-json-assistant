"use client";
import { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import { message, Modal } from "antd";
import { initializeToast, toast } from "./Toast";

interface Preset {
  id: string;
  name: string;
  config: any;
  createdAt: string;
}

interface Props {
  currentConfig: any;
  onLoadPreset: (config: any) => void;
  quickStartPrompt?: string;
}

export default function PresetManager({
  currentConfig,
  onLoadPreset,
  quickStartPrompt = "",
}: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);
  const [appliedPresetConfig, setAppliedPresetConfig] = useState<any>(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    initializeToast(messageApi);
  }, [messageApi]);

  function isConfigModified(): boolean {
    if (!appliedPresetConfig) return true;
    return JSON.stringify(currentConfig) !== JSON.stringify(appliedPresetConfig);
  }

  useEffect(() => {
    setIsModified(isConfigModified());
  }, [currentConfig]);

  function validatePrompts(): boolean {
    const startPrompt = quickStartPrompt?.trim() || "";
    const mainPrompt = currentConfig?.short_description?.trim() || "";
    return startPrompt.length > 0 || mainPrompt.length > 0;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fibo-presets");
      if (saved) {
        try {
          setPresets(JSON.parse(saved));
        } catch (e) {
          console.error("Preset Load Error:", e);
          toast.error("Failed to load presets");
        }
      }
    }
  }, []);

  function savePreset() {
    if (!validatePrompts()) {
      toast.error("Please enter at least one prompt");
      return;
    }
    if (!presetName.trim()) {
      toast.warning("Preset name is required");
      return;
    }

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      config: currentConfig,
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem("fibo-presets", JSON.stringify(updated));

    toast.success(`Preset "${newPreset.name}" saved`);
    setPresetName("");
    setShowSaveDialog(false);
  }

  function updatePreset() {
    if (!appliedPresetId) return;

    const updated = presets.map((p) =>
      p.id === appliedPresetId ? { ...p, config: currentConfig } : p
    );

    setPresets(updated);
    localStorage.setItem("fibo-presets", JSON.stringify(updated));
    setAppliedPresetConfig(currentConfig);
    setIsModified(false);

    toast.success("Preset updated successfully");
  }

  function loadPreset(preset: Preset) {
    onLoadPreset(preset.config);

    setAppliedPresetId(preset.id);
    setAppliedPresetConfig(preset.config);
    setIsModified(false);

    toast.success(`"${preset.name}" applied`);
  }

  function deletePreset(id: string, name: string) {
    Modal.confirm({
      title: "Delete Preset",
      content: `Delete "${name}" permanently?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        const updated = presets.filter((p) => p.id !== id);
        setPresets(updated);
        localStorage.setItem("fibo-presets", JSON.stringify(updated));
        toast.success(`Preset "${name}" deleted`);
      },
    });
  }

  function getPresetDisplayInfo(config: any) {
    return {
      camera: config?.photographic_characteristics?.camera_angle || "N/A",
      lighting: config?.lighting?.conditions || "N/A",
      style: config?.artistic_style || "N/A",
      colorScheme: config?.aesthetics?.color_scheme || "N/A",
      composition: config?.aesthetics?.composition || "N/A",
      mood: config?.aesthetics?.mood_atmosphere || "N/A",
    };
  }

  return (
    <>
      {contextHolder}

      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h2 className="text-2xl font-bold mb-4">💾 FIBO Style Presets</h2>
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={!isModified}
          className={`w-full mb-4 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
            ${
              isModified
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <Save className="w-5 h-5" />
          Save as New Preset
        </button>
        {appliedPresetId && (
          <button
            onClick={updatePreset}
            disabled={!isModified}
            className={`w-full mb-6 px-4 py-3 rounded-lg font-semibold transition-all 
            ${
              isModified
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Update This Preset
          </button>
        )}
        {showSaveDialog && (
          <div className="mb-4 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
            <label className="block mb-2 font-semibold text-purple-900">
              Preset Name
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={savePreset}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setPresetName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preset list */}
        <div className="space-y-2">
          {presets.map((preset) => {
            const info = getPresetDisplayInfo(preset.config);
            return (
              <div
                key={preset.id}
                className="p-4 border rounded-lg bg-gray-50 hover:border-purple-400"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{preset.name}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
               <div className="flex justify-between">
                  {/* Apply */}
                  {appliedPresetId === preset.id ? (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                      ✓ Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => loadPreset(preset)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  )}

                  <button
                    onClick={() => deletePreset(preset.id, preset.name)}
                    className="p-2 bg-red-500 text-white rounded-lg ml-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-2 flex-wrap text-xs">
                  <span className="bg-purple-100 px-2 py-1 rounded">
                    📷 {info.camera}
                  </span>
                  <span className="bg-yellow-100 px-2 py-1 rounded">
                    💡 {info.lighting}
                  </span>
                  <span className="bg-pink-100 px-2 py-1 rounded">
                    🎨 {info.colorScheme}
                  </span>
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    🖼️ {info.composition}
                  </span>
                  <span className="bg-indigo-100 px-2 py-1 rounded">
                    🎭 {info.mood}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
// "use client";
// import { useState, useEffect } from "react";
// import { Save, Trash2 } from "lucide-react";
// import { message, Modal } from "antd";
// import { initializeToast, toast } from "./Toast";

// interface Preset {
//   id: string;
//   name: string;
//   config: any;
//   createdAt: string;
// }

// interface Props {
//   currentConfig: any;
//   onLoadPreset: (config: any) => void;
//   quickStartPrompt?: string;
// }

// export default function PresetManager({ currentConfig, onLoadPreset, quickStartPrompt = "" }: Props) {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [presets, setPresets] = useState<Preset[]>([]);
//   const [presetName, setPresetName] = useState("");
//   const [showSaveDialog, setShowSaveDialog] = useState(false);
//   const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

//   // Initialize toast with message API
//   useEffect(() => {
//     initializeToast(messageApi);
//   }, [messageApi]);

//   // Validate if at least one prompt exists
//   function validatePrompts(): boolean {
//     const startPrompt = quickStartPrompt?.trim() || "";
//     const mainPrompt = currentConfig?.prompt?.trim() || "";
    
//     return startPrompt.length > 0 || mainPrompt.length > 0;
//   }

//   // Save current configuration as preset
//   function savePreset() {
//     // Validate prompts first
//     if (!validatePrompts()) {
//       toast.error("Please provide at least one prompt");
//       return;
//     }

//     if (!presetName.trim()) {
//       toast.warning("Please enter a preset name");
//       return;
//     }

//     const newPreset: Preset = {
//       id: Date.now().toString(),
//       name: presetName,
//       config: currentConfig,
//       createdAt: new Date().toISOString(),
//     };

//     const updatedPresets = [...presets, newPreset];
//     setPresets(updatedPresets);
//     setPresetName("");
//     setShowSaveDialog(false);
    
//     // Save to localStorage for persistence (client-side only)
//     if (typeof window !== "undefined") {
//       localStorage.setItem("fibo-presets", JSON.stringify(updatedPresets));
//     }
    
//     toast.success(`Preset "${newPreset.name}" saved`);
//   }

//   // Load presets from localStorage on mount (client-side only)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("fibo-presets");
//       if (saved) {
//         try {
//           setPresets(JSON.parse(saved));
//         } catch (e) {
//           console.error("Failed to load presets:", e);
//           toast.error("Failed to load presets");
//         }
//       }
//     }
//   }, []);

//   function loadPreset(preset: Preset) {
//     onLoadPreset(preset.config);
//     setAppliedPresetId(preset.id);  
//     toast.success(`${preset.name} applied`);
//   }

//   // Delete a preset
//   function deletePreset(id: string, name: string) {
//     Modal.confirm({
//       title: 'Delete Preset',
//       content: `Are you sure you want to delete "${name}"?`,
//       okText: 'Delete',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk: () => {
//         const updated = presets.filter((p) => p.id !== id);
//         setPresets(updated);
        
//         // Update localStorage (client-side only)
//         if (typeof window !== "undefined") {
//           localStorage.setItem("fibo-presets", JSON.stringify(updated));
//         }
        
//         toast.success(`Preset "${name}" deleted`);
//       },
//     });
//   }

//   // Handle save button click with validation
//   function handleSaveClick() {
//     if (!validatePrompts()) {
//       toast.error("Please provide at least one prompt");
//       return;
//     }
//     setShowSaveDialog(true);
//   }

//   return (
//     <>
//       {contextHolder}
//       <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
//         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//           💾 Style Presets
//         </h2>

//         {/* Save Button */}
//         <button
//           onClick={handleSaveClick}
//           className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold flex items-center justify-center gap-2 transition-all"
//         >
//           <Save className="w-5 h-5" />
//           Save Current Style as Preset
//         </button>

//         {/* Save Dialog */}
//         {showSaveDialog && (
//           <div className="mb-4 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
//             <label className="block mb-2 font-semibold text-purple-900">
//               Preset Name
//             </label>
//             <input
//               type="text"
//               value={presetName}
//               onChange={(e) => setPresetName(e.target.value)}
//               placeholder="e.g., Product Photography - Warm"
//               className="w-full p-3 border-2 border-purple-300 rounded-lg mb-3"
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") savePreset();
//               }}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={savePreset}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setShowSaveDialog(false);
//                   setPresetName("");
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Preset List */}
//         <div className="space-y-2">
//           {presets.length === 0 ? (
//             <p className="text-gray-500 text-center py-8 text-sm">
//               No presets saved yet. Create your first preset!
//             </p>
//           ) : (
//             presets.map((preset) => (
//               <div
//                 key={preset.id}
//                 className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-400 transition-all group"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h3 className="font-bold text-gray-800 mb-1">
//                       {preset.name}
//                     </h3>
//                     <p className="text-xs text-gray-500">
//                       Created: {new Date(preset.createdAt).toLocaleDateString()}
//                     </p>
//                     <div className="mt-2 flex flex-wrap gap-1">
//                       <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
//                         {preset.config.camera?.angle || "N/A"}
//                       </span>
//                       <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
//                         {preset.config.lighting?.style || "N/A"}
//                       </span>
//                       <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
//                         {preset.config.colors?.palette || "N/A"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 ml-4">
              
//                     {appliedPresetId === preset.id ? (
//                       <button
//                         disabled
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-default flex items-center gap-1"
//                         title="Preset Applied"
//                       >
//                         Applied
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => loadPreset(preset)}
//                         className="px-4 py-2 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
//                         title="Apply Preset"
//                       >
//                         Apply
//                       </button>
//                     )}

//                     <button
//                       onClick={() => deletePreset(preset.id, preset.name)}
//                       className="p-2 bg-red-400 text-white rounded-lg hover:bg-red-700 transition-colors"
//                       title="Delete Preset"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Info */}
//         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//           <p className="text-xs text-blue-800">
//             💡 <strong>Tip:</strong> Presets save your entire JSON configuration. At least one prompt is required.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

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

export default function PresetManager({ currentConfig, onLoadPreset, quickStartPrompt = "" }: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  // Initialize toast with message API
  useEffect(() => {
    initializeToast(messageApi);
  }, [messageApi]);

  // Validate if at least one prompt exists
  function validatePrompts(): boolean {
    const startPrompt = quickStartPrompt?.trim() || "";
    const mainPrompt = currentConfig?.short_description?.trim() || "";
    
    return startPrompt.length > 0 || mainPrompt.length > 0;
  }

  // Save current configuration as preset
  function savePreset() {
    // Validate prompts first
    if (!validatePrompts()) {
      toast.error("Please provide at least one prompt");
      return;
    }

    if (!presetName.trim()) {
      toast.warning("Please enter a preset name");
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
    
    toast.success(`Preset "${newPreset.name}" saved`);
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
          toast.error("Failed to load presets");
        }
      }
    }
  }, []);

  function loadPreset(preset: Preset) {
    onLoadPreset(preset.config);
    setAppliedPresetId(preset.id);  
    toast.success(`"${preset.name}" applied`);
  }

  // Delete a preset
  function deletePreset(id: string, name: string) {
    Modal.confirm({
      title: 'Delete Preset',
      content: `Are you sure you want to delete "${name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const updated = presets.filter((p) => p.id !== id);
        setPresets(updated);
        
        // Update localStorage (client-side only)
        if (typeof window !== "undefined") {
          localStorage.setItem("fibo-presets", JSON.stringify(updated));
        }
        
        toast.success(`Preset "${name}" deleted`);
      },
    });
  }

  // Handle save button click with validation
  function handleSaveClick() {
    if (!validatePrompts()) {
      toast.error("Please provide at least one prompt");
      return;
    }
    setShowSaveDialog(true);
  }

  // Get display values from FIBO config
  function getPresetDisplayInfo(config: any) {
    return {
      camera: config?.photographic_characteristics?.camera_angle || "N/A",
      lighting: config?.lighting?.conditions || "N/A",
      style: config?.artistic_style || "N/A",
      colorScheme: config?.aesthetics?.color_scheme || "N/A",
      composition: config?.aesthetics?.composition || "N/A",
      mood: config?.aesthetics?.mood_atmosphere || "N/A"
    };
  }

  return (
    <>
      {contextHolder}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          💾 FIBO Style Presets
        </h2>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold flex items-center justify-center gap-2 transition-all"
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
              placeholder="e.g., Product Photography - Golden Hour"
              className="w-full p-3 border-2 border-purple-300 rounded-lg mb-3"
              onKeyPress={(e) => {
                if (e.key === "Enter") savePreset();
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={savePreset}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setPresetName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
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
            presets.map((preset) => {
              const displayInfo = getPresetDisplayInfo(preset.config);
              return (
                <div
                  key={preset.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-400 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Created: {new Date(preset.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* FIBO Configuration Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          📷 {displayInfo.camera}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          💡 {displayInfo.lighting}
                        </span>
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          🎨 {displayInfo.colorScheme}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          🖼️ {displayInfo.composition}
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          🎭 {displayInfo.mood}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          ✨ {displayInfo.style}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {appliedPresetId === preset.id ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-default flex items-center gap-1"
                          title="Preset Applied"
                        >
                          ✓ Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => loadPreset(preset)}
                          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                          title="Apply Preset"
                        >
                          Apply
                        </button>
                      )}

                      <button
                        onClick={() => deletePreset(preset.id, preset.name)}
                        className="p-2 bg-red-400 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Presets save your entire FIBO configuration including camera, lighting, aesthetics, and all other settings. They can be applied to different prompts for consistent style.
          </p>
        </div>
      </div>
    </>
  );
}
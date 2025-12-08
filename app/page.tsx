// "use client";
// import { useState, useEffect } from "react";
// import PromptEditor from "./components/PromptEditor";
// import PresetManager from "./components/PresetManager";
// import BatchGenerator from "./components/BatchGenerator";

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [jsonInput, setJsonInput] = useState("");
//   const [img, setImg] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [activeTab, setActiveTab] = useState<"single" | "batch">("single");

//   // Parse current JSON config
//   const getCurrentConfig = () => {
//     try {
//       return JSON.parse(jsonInput || "{}");
//     } catch {
//       return {};
//     }
//   };

//   // Load preset into editor
//   const handleLoadPreset = (config: any) => {
//     setJsonInput(JSON.stringify(config, null, 2));
//     if (config.prompt) {
//       setPrompt(config.prompt);
//     }
//   };

//   async function translatePrompt() {
//     setError("");
//     setStatusMessage("Translating prompt...");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Translation failed");
//       }

//       const data = await res.json();
//       setJsonInput(data.json || "{}");
//       setStatusMessage("✅ JSON generated successfully!");
//       setTimeout(() => setStatusMessage(""), 3000);
//     } catch (err: any) {
//       setError(err.message);
//       console.error("Translation error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function generate() {
//     setError("");
//     setImg(null);
//     setStatusMessage("Starting FIBO generation...");
//     setLoading(true);

//     try {
//       const parsedJSON = JSON.parse(jsonInput);

//       const res = await fetch("/api/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(parsedJSON),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Generation failed");
//       }

//       setStatusMessage("✅ Image generated!");
//       const blob = await res.blob();
//       setImg(URL.createObjectURL(blob));
//     } catch (err: any) {
//       setError(err.message);
//       console.error("Generation error:", err);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setStatusMessage(""), 3000);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//       <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
//       <div className="bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg">
//       <h1 className="text-5xl font-bold mb-2">🎨 FIBO JSON Assistant</h1>

//       <p className="text-indigo-100 text-lg">
//         Professional image generation with structured JSON control
//       </p>

//       <div className="mt-4 flex items-center gap-2 text-sm flex-wrap">
//         <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
//           ✅ Bria API Connected
//         </span>

//         <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
//           💾 Style Presets
//         </span>

//         <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
//           🔄 Batch Generation
//         </span>

//         <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
//           🔒 100% Licensed Data
//         </span>
//       </div>
//     </div>


//           <div className="p-8">
//             {/* Status Message */}
//             {statusMessage && (
//               <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-blue-700 font-semibold animate-pulse">
//                 {statusMessage}
//               </div>
//             )}

//             {/* Error Display */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
//                 <strong>⚠️ Error:</strong> {error}
//               </div>
//             )}

//             {/* Tab Switcher */}
//             <div className="mb-6 flex gap-2">
//               <button
//                 onClick={() => setActiveTab("single")}
//                 className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
//                   activeTab === "single"
//                     ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 ✨ Single Generation
//               </button>
//               <button
//                 onClick={() => setActiveTab("batch")}
//                 className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
//                   activeTab === "batch"
//                     ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 🔄 Batch Generation
//               </button>
//             </div>

//             {/* Single Generation Tab */}
//             {activeTab === "single" && (
//               <>
//                 {/* Quick Prompt */}
//                 <div className="mb-8">
//                   <label className="block mb-3 text-xl font-bold text-gray-800">
//                     Quick Start Prompt
//                   </label>
//                   <div className="flex gap-3">
//                     <input
//                       type="text"
//                       className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
//                       value={prompt}
//                       onChange={(e) => setPrompt(e.target.value)}
//                       placeholder="e.g., A majestic eagle soaring over mountain peaks at sunset"
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter" && !loading) {
//                           translatePrompt();
//                         }
//                       }}
//                     />
//                     <button
//                       className="px-8 py-4 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-xl  disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
//                       onClick={translatePrompt}
//                       disabled={loading || !prompt.trim()}
//                     >
//                       {loading ? "⏳" : "→ JSON"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Advanced Controls */}
//                 <PromptEditor
//                   jsonInput={jsonInput}
//                   setJsonInput={setJsonInput}
//                   initialPrompt={prompt}
//                 />

//                 {/* Generate Button */}
//                 <button
//                   className="w-full px-8 py-5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl transition-all transform hover:scale-[1.02]"
//                   onClick={generate}
//                   disabled={loading || !jsonInput.trim()}
//                 >
//                   {loading ? "🎨 Generating with FIBO..." : "🚀 Generate Image"}
//                 </button>

//                 {/* Image Display */}
//                 {img && (
//                   <div className="mt-10">
//                     <h3 className="text-2xl font-bold mb-4 text-gray-800">
//                       ✨ Generated Result
//                     </h3>
//                     <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
//                       <img src={img} alt="Generated" className="w-full" />
//                     </div>
//                     <div className="mt-4 flex gap-3">
//                       <a
//                         href={img}
//                         download="fibo-generated.png"
//                         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
//                       >
//                         ⬇️ Download Image
//                       </a>
//                       <button
//                         onClick={() => {
//                           const blob = new Blob([jsonInput], {
//                             type: "application/json",
//                           });
//                           const url = URL.createObjectURL(blob);
//                           const link = document.createElement("a");
//                           link.href = url;
//                           link.download = "fibo-config.json";
//                           link.click();
//                         }}
//                         className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
//                       >
//                         📄 Download JSON
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Batch Generation Tab */}
//             {activeTab === "batch" && (
//               <>
//                 {/* Show current style settings */}
//                 <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
//                   <p className="text-sm text-purple-900 font-semibold mb-2">
//                     📋 Current Style Configuration:
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {jsonInput ? (
//                       <>
//                         <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
//                           Camera: {getCurrentConfig().camera?.angle || "N/A"}
//                         </span>
//                         <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
//                           Lighting: {getCurrentConfig().lighting?.style || "N/A"}
//                         </span>
//                         <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
//                           Palette: {getCurrentConfig().colors?.palette || "N/A"}
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-xs text-purple-700">
//                         Configure your style in the "Single Generation" tab first
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <BatchGenerator currentConfig={getCurrentConfig()} />
//               </>
//             )}
//           </div>
//         </div>

//         {/* Preset Manager - Always visible */}
//         <PresetManager
//           currentConfig={getCurrentConfig()}
//           onLoadPreset={handleLoadPreset}
//         />

//         {/* Info Footer */}
//         <div className="mt-8 text-center text-gray-600 text-sm">
//           <p>
//             Powered by Bria FIBO • 100% Licensed Training Data • Enterprise-Ready
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import PromptEditor from "./components/PromptEditor";
import PresetManager from "./components/PresetManager";
import BatchGenerator from "./components/BatchGenerator";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");

  // Parse current JSON config
  const getCurrentConfig = () => {
    try {
      return JSON.parse(jsonInput || "{}");
    } catch {
      return {};
    }
  };
  

  // Load preset into editor
  const handleLoadPreset = (config: any) => {
    setJsonInput(JSON.stringify(config, null, 2));
    if (config.prompt) {
      setPrompt(config.prompt);
    }
  };

  async function translatePrompt() {
    setError("");
    setStatusMessage("Translating prompt...");
    setLoading(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await res.json();
      setJsonInput(data.json || "{}");
      setStatusMessage("✅ JSON generated successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error("Translation error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setError("");
    setImg(null);
    setStatusMessage("Starting FIBO generation...");
    setLoading(true);

    try {
      const parsedJSON = JSON.parse(jsonInput);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJSON),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }

      setStatusMessage("✅ Image generated!");
      const blob = await res.blob();
      setImg(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg">
      <h1 className="text-5xl font-bold mb-2">🎨 FIBO JSON Assistant</h1>

      <p className="text-indigo-100 text-lg">
        Professional image generation with structured JSON control
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm flex-wrap">
        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
          ✅ Bria API Connected
        </span>

        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
          💾 Style Presets
        </span>

        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
          🔄 Batch Generation
        </span>

        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/10">
          🔒 100% Licensed Data
        </span>
      </div>
    </div>


          <div className="p-8">
            {/* Status Message */}
            {statusMessage && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-blue-700 font-semibold animate-pulse">
                {statusMessage}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
                <strong>⚠️ Error:</strong> {error}
              </div>
            )}

            {/* Tab Switcher */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "single"
                    ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ✨ Single Generation
              </button>
              <button
                onClick={() => setActiveTab("batch")}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "batch"
                    ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-8 text-white rounded-2xl shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🔄 Batch Generation
              </button>
            </div>

            {/* Single Generation Tab */}
            {activeTab === "single" && (
              <>
                {/* Quick Prompt */}
                <div className="mb-8">
                  <label className="block mb-3 text-xl font-bold text-gray-800">
                    Quick Start Prompt
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A majestic eagle soaring over mountain peaks at sunset"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !loading) {
                          translatePrompt();
                        }
                      }}
                    />
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-xl  disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
                      onClick={translatePrompt}
                      disabled={loading || !prompt.trim()}
                    >
                      {loading ? "⏳" : "→ JSON"}
                    </button>
                  </div>
                </div>

                {/* Advanced Controls */}
                <PromptEditor
                  jsonInput={jsonInput}
                  setJsonInput={setJsonInput}
                  initialPrompt={prompt}
                />

                {/* Generate Button */}
                <button
                  className="w-full px-8 py-5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl transition-all transform hover:scale-[1.02]"
                  onClick={generate}
                  disabled={loading || !jsonInput.trim()}
                >
                  {loading ? "🎨 Generating with FIBO..." : "🚀 Generate Image"}
                </button>

                {/* Image Display */}
                {img && (
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      ✨ Generated Result
                    </h3>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
                      <img src={img} alt="Generated" className="w-full" />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <a
                        href={img}
                        download="fibo-generated.png"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        ⬇️ Download Image
                      </a>
                      <button
                        onClick={() => {
                          const blob = new Blob([jsonInput], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "fibo-config.json";
                          link.click();
                        }}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                      >
                        📄 Download JSON
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Batch Generation Tab */}
            {activeTab === "batch" && (
              <>
                {/* Show current style settings */}
                {/* <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                  <p className="text-sm text-purple-900 font-semibold mb-2">
                    📋 Current Style Configuration:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jsonInput ? (
                      <>
                        <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
                          Camera: {getCurrentConfig().camera?.angle || "N/A"}
                        </span>
                        <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
                          Lighting: {getCurrentConfig().lighting?.style || "N/A"}
                        </span>
                        <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300">
                          Palette: {getCurrentConfig().colors?.palette || "N/A"}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-purple-700">
                        Configure your style in the "Single Generation" tab first
                      </span>
                    )}
                  </div>
                </div> */}

                <BatchGenerator currentConfig={getCurrentConfig()} />
              </>
            )}
          </div>
        </div>

        {/* Preset Manager - Always visible */}
        <PresetManager
          currentConfig={getCurrentConfig()}
          onLoadPreset={handleLoadPreset}
          quickStartPrompt={prompt}
        />

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Powered by Bria FIBO • 100% Licensed Training Data • Enterprise-Ready
          </p>
        </div>
      </div>
    </div>
  );
}
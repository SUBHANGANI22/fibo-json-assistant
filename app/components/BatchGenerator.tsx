// "use client";
// import { useState } from "react";
// import { Layers, Download } from "lucide-react";

// interface GeneratedImage {
//   id: string;
//   prompt: string;
//   imageUrl: string;
//   json: any;
//   timestamp: string;
// }

// interface Props {
//   currentConfig: any;
// }

// export default function BatchGenerator({ currentConfig }: Props) {
//   const [prompts, setPrompts] = useState("");
//   const [generating, setGenerating] = useState(false);
//   const [progress, setProgress] = useState({ current: 0, total: 0 });
//   const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

//   async function generateBatch() {
//     const promptList = prompts
//       .split("\n")
//       .map((p) => p.trim())
//       .filter((p) => p.length > 0);

//     if (promptList.length === 0) {
//       alert("Please enter at least one prompt");
//       return;
//     }

//     if (promptList.length > 20) {
//       alert("Maximum 20 prompts at once");
//       return;
//     }

//     setGenerating(true);
//     setProgress({ current: 0, total: promptList.length });
//     const results: GeneratedImage[] = [];

//     for (let i = 0; i < promptList.length; i++) {
//       const prompt = promptList[i];
//       setProgress({ current: i + 1, total: promptList.length });

//       try {
//         // Create JSON config with current settings
//         const config = {
//           ...currentConfig,
//           prompt: prompt,
//         };

//         // Call generate API
//         const res = await fetch("/api/generate", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(config),
//         });

//         if (!res.ok) {
//           console.error(`Failed to generate image for: ${prompt}`);
//           continue;
//         }

//         const blob = await res.blob();
//         const imageUrl = URL.createObjectURL(blob);

//         results.push({
//           id: Date.now().toString() + i,
//           prompt: prompt,
//           imageUrl: imageUrl,
//           json: config,
//           timestamp: new Date().toISOString(),
//         });

//         // Update state incrementally so user sees progress
//         setGeneratedImages([...results]);
//       } catch (error) {
//         console.error(`Error generating image for "${prompt}":`, error);
//       }
//     }

//     setGenerating(false);
//     alert(`✅ Generated ${results.length}/${promptList.length} images!`);
//   }

//   function downloadAll() {
//     generatedImages.forEach((img, index) => {
//       // Download image
//       const link = document.createElement("a");
//       link.href = img.imageUrl;
//       link.download = `fibo-${index + 1}-${img.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, "-")}.png`;
//       link.click();

//       // Download JSON
//       const jsonBlob = new Blob([JSON.stringify(img.json, null, 2)], {
//         type: "application/json",
//       });
//       const jsonUrl = URL.createObjectURL(jsonBlob);
//       const jsonLink = document.createElement("a");
//       jsonLink.href = jsonUrl;
//       jsonLink.download = `fibo-${index + 1}-config.json`;
//       jsonLink.click();
//     });

//     alert(`✅ Downloaded ${generatedImages.length} images and their JSON configs!`);
//   }

//   function clearResults() {
//     if (!confirm("Clear all generated images?")) return;
//     setGeneratedImages([]);
//     setPrompts("");
//   }

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
//       <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//         <Layers className="w-7 h-7" />
//         Batch Generation
//       </h2>

//       {/* Instructions */}
//       <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//         <p className="text-sm text-green-800">
//           <strong>📝 Instructions:</strong> Enter multiple prompts (one per
//           line). All images will use your current style settings from the JSON
//           editor above.
//         </p>
//       </div>

//       {/* Prompt Input */}
//       <div className="mb-4">
//         <label className="block mb-2 font-semibold text-gray-700">
//           Prompts (one per line)
//         </label>
//         <textarea
//           value={prompts}
//           onChange={(e) => setPrompts(e.target.value)}
//           placeholder={"A red sports car on mountain road\nA blue sedan in city street\nA green SUV in forest"}
//           className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
//           rows={8}
//           disabled={generating}
//         />
//         <p className="text-xs text-gray-500 mt-2">
//           {prompts.split("\n").filter((p) => p.trim().length > 0).length}{" "}
//           prompts (max 20)
//         </p>
//       </div>

//       {/* Generate Button */}
//       <button
//         onClick={generateBatch}
//         disabled={generating || !prompts.trim()}
//         className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
//       >
//         {generating
//           ? `🎨 Generating ${progress.current}/${progress.total}...`
//           : "🚀 Generate All Images"}
//       </button>

//       {/* Progress Bar */}
//       {generating && (
//         <div className="mt-4">
//           <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//             <div
//               className="bg-gradient-to-r from-green-500 to-teal-500 h-full transition-all duration-300"
//               style={{
//                 width: `${(progress.current / progress.total) * 100}%`,
//               }}
//             />
//           </div>
//           <p className="text-center mt-2 text-sm text-gray-600">
//             Processing: {progress.current} of {progress.total}
//           </p>
//         </div>
//       )}

//       {/* Results Grid */}
//       {generatedImages.length > 0 && (
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-bold text-gray-800">
//               Generated Images ({generatedImages.length})
//             </h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={downloadAll}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
//               >
//                 <Download className="w-4 h-4" />
//                 Download All
//               </button>
//               <button
//                 onClick={clearResults}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {generatedImages.map((img, index) => (
//               <div
//                 key={img.id}
//                 className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-400 transition-all group"
//               >
//                 <div className="relative">
//                   <img
//                     src={img.imageUrl}
//                     alt={img.prompt}
//                     className="w-full h-64 object-cover"
//                   />
//                   <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
//                     #{index + 1}
//                   </div>
//                 </div>
//                 <div className="p-3 bg-gray-50">
//                   <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
//                     {img.prompt}
//                   </p>
//                   <div className="flex gap-2">
//                     <a
//                       href={img.imageUrl}
//                       download={`fibo-${index + 1}.png`}
//                       className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
//                     >
//                       Download
//                     </a>
//                     <button
//                       onClick={() => {
//                         const blob = new Blob(
//                           [JSON.stringify(img.json, null, 2)],
//                           { type: "application/json" }
//                         );
//                         const url = URL.createObjectURL(blob);
//                         const link = document.createElement("a");
//                         link.href = url;
//                         link.download = `config-${index + 1}.json`;
//                         link.click();
//                       }}
//                       className="flex-1 text-center px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
//                     >
//                       JSON
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { Layers, Download } from "lucide-react";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  json: any;
  timestamp: string;
}

interface Props {
  currentConfig: any;
}

export default function BatchGenerator({ currentConfig }: Props) {
  const [prompts, setPrompts] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  async function generateBatch() {
    const promptList = prompts
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (promptList.length === 0) {
      alert("Please enter at least one prompt");
      return;
    }

    if (promptList.length > 20) {
      alert("Maximum 20 prompts at once");
      return;
    }

    setGenerating(true);
    setProgress({ current: 0, total: promptList.length });
    const results: GeneratedImage[] = [];

    for (let i = 0; i < promptList.length; i++) {
      const prompt = promptList[i];
      setProgress({ current: i + 1, total: promptList.length });

      try {
        const config = {
          ...currentConfig,
          short_description: prompt, // Use the batch prompt as the main description
        };

        // Call generate API
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });

        if (!res.ok) {
          console.error(`Failed to generate image for: ${prompt}`);
          continue;
        }

        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);

        results.push({
          id: Date.now().toString() + i,
          prompt: prompt,
          imageUrl: imageUrl,
          json: config,
          timestamp: new Date().toISOString(),
        });

        // Update state incrementally so user sees progress
        setGeneratedImages([...results]);
      } catch (error) {
        console.error(`Error generating image for "${prompt}":`, error);
      }
    }

    setGenerating(false);
    alert(`✅ Generated ${results.length}/${promptList.length} images!`);
  }

  function downloadAll() {
    generatedImages.forEach((img, index) => {
      // Download image
      const link = document.createElement("a");
      link.href = img.imageUrl;
      link.download = `fibo-${index + 1}-${img.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, "-")}.png`;
      link.click();

      // Download JSON
      const jsonBlob = new Blob([JSON.stringify(img.json, null, 2)], {
        type: "application/json",
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `fibo-${index + 1}-config.json`;
      jsonLink.click();
    });

    alert(`✅ Downloaded ${generatedImages.length} images and their JSON configs!`);
  }

  function clearResults() {
    if (!confirm("Clear all generated images?")) return;
    setGeneratedImages([]);
    setPrompts("");
  }

  // Get display info from FIBO config
  function getConfigSummary(config: any) {
    return {
      style: config?.artistic_style || "N/A",
      medium: config?.style_medium || "N/A",
      lighting: config?.lighting?.conditions || "N/A",
      camera: config?.photographic_characteristics?.camera_angle || "N/A",
      mood: config?.aesthetics?.mood_atmosphere || "N/A"
    };
  }

  const configSummary = getConfigSummary(currentConfig);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Layers className="w-7 h-7" />
        FIBO Batch Generation
      </h2>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800 mb-2">
          <strong>📝 Instructions:</strong> Enter multiple prompts (one per line). 
          All images will use your current FIBO style settings.
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            ✨ {configSummary.style}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            📷 {configSummary.medium}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            💡 {configSummary.lighting}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            🎭 {configSummary.mood}
          </span>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">
          Prompts (one per line)
        </label>
        <textarea
          value={prompts}
          onChange={(e) => setPrompts(e.target.value)}
          placeholder={"A red sports car on mountain road\nA blue sedan in city street\nA green SUV in forest\nA yellow motorcycle at sunset"}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
          rows={8}
          disabled={generating}
        />
        <p className="text-xs text-gray-500 mt-2">
          {prompts.split("\n").filter((p) => p.trim().length > 0).length}{" "}
          prompts (max 20)
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateBatch}
        disabled={generating || !prompts.trim()}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
      >
        {generating
          ? `🎨 Generating ${progress.current}/${progress.total}...`
          : "🚀 Generate All Images"}
      </button>

      {/* Progress Bar */}
      {generating && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-teal-500 h-full transition-all duration-300"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">
            Processing: {progress.current} of {progress.total}
          </p>
        </div>
      )}

      {/* Results Grid */}
      {generatedImages.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Generated Images ({generatedImages.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((img, index) => {
              const imgConfig = getConfigSummary(img.json);
              return (
                <div
                  key={img.id}
                  className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-400 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                      #{index + 1}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {imgConfig.style}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                      {img.prompt}
                    </p>
                    
                    {/* FIBO Config Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                        💡 {imgConfig.lighting}
                      </span>
                      <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                        🎭 {imgConfig.mood}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={img.imageUrl}
                        download={`fibo-${index + 1}.png`}
                        className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          const blob = new Blob(
                            [JSON.stringify(img.json, null, 2)],
                            { type: "application/json" }
                          );
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `config-${index + 1}.json`;
                          link.click();
                        }}
                        className="flex-1 text-center px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                      >
                        JSON
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
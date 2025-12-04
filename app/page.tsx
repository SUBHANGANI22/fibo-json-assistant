// "use client";
// import { useState } from "react";
// import PromptEditor from "../app/components/PromptEditor";

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [jsonInput, setJsonInput] = useState("");
//   const [img, setImg] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function translatePrompt() {
//     setError("");
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
//     setLoading(true);

//     try {
//       // Parse JSON to validate before sending
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

//       const blob = await res.blob();
//       setImg(URL.createObjectURL(blob));
//     } catch (err: any) {
//       setError(err.message);
//       console.error("Generation error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//               FIBO JSON Assistant
//             </h1>
//             <p className="text-gray-600">
//               Generate images with structured JSON control
//             </p>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//               ⚠️ {error}
//             </div>
//           )}

//           {/* Simple Prompt Input */}
//           <div className="mb-6">
//             <label className="block mb-2 font-semibold">Quick Prompt</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 placeholder="e.g., A serene mountain landscape at sunset"
//               />
//               <button
//                 className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
//                 onClick={translatePrompt}
//                 disabled={loading || !prompt.trim()}
//               >
//                 {loading ? "..." : "→ JSON"}
//               </button>
//             </div>
//           </div>

//           {/* Advanced Controls */}
//           <PromptEditor
//             jsonInput={jsonInput}
//             setJsonInput={setJsonInput}
//             initialPrompt={prompt}
//           />

//           {/* Generate Button */}
//           <button
//             className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
//             onClick={generate}
//             disabled={loading || !jsonInput.trim()}
//           >
//             {loading ? "🎨 Generating..." : "🎨 Generate Image with FIBO"}
//           </button>

//           {/* Image Display */}
//           {img && (
//             <div className="mt-8">
//               <h3 className="text-xl font-bold mb-4">Generated Image</h3>
//               <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-200">
//                 <img src={img} alt="Generated" className="w-full" />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import PromptEditor from "./components/PromptEditor";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
            <h1 className="text-5xl font-bold mb-2">🎨 FIBO JSON Assistant</h1>
            <p className="text-purple-100 text-lg">
              Professional image generation with structured JSON control
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                ✅ Bria API Connected
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
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
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Powered by Bria FIBO • 100% Licensed Training Data • Enterprise-Ready</p>
        </div>
      </div>
    </div>
  );
}
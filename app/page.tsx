"use client";
import { useState, useEffect, useRef } from "react";
import PromptEditor from "./components/PromptEditor";
import PresetManager from "./components/PresetManager";
import BatchGenerator from "./components/BatchGenerator";
import ImageHistorySidebar from "./components/ImageHistorySidebar";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [isFormValid, setIsFormValid] = useState(true);
 
  const addToHistoryRef = useRef<((imageUrl: string, config: any, seed?: number) => void) | null>(null);

  const getCurrentConfig = () => {
    try {
      return JSON.parse(jsonInput || "{}");
    } catch {
      return {};
    }
  };

  const handleLoadPreset = (config: any) => {
    setJsonInput(JSON.stringify(config, null, 2));
    if (config.short_description) {
      setPrompt(config.short_description);
    }
  };

  const handleLoadConfig = (config: any) => {
    setJsonInput(JSON.stringify(config, null, 2));
    if (config.short_description) {
      setPrompt(config.short_description);
    }
    setActiveTab("single");
  };

  const handleRegenerateExact = async (config: any, seed: number) => {
    setJsonInput(JSON.stringify(config, null, 2));
    if (config.short_description) {
      setPrompt(config.short_description);
    }
    setActiveTab("single");
    setCurrentSeed(seed);
 
    setTimeout(() => {
      generateWithSeed(config, seed);
    }, 100);
  };

  const handleRegenerateVariation = async (config: any) => {
    setJsonInput(JSON.stringify(config, null, 2));
    if (config.short_description) {
      setPrompt(config.short_description);
    }
    setActiveTab("single");
  
    setTimeout(() => {
      generate();
    }, 100);
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

  async function generateWithSeed(config: any, seed: number) {
    setError("");
    setImg(null);
    setStatusMessage("Starting FIBO generation with seed...");
    setLoading(true);

    try {
      const configWithSeed = {
        ...config,
        seed: seed
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configWithSeed),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }

      setStatusMessage("✅ Image generated!");
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImg(imageUrl);
      setCurrentSeed(seed);

      if (addToHistoryRef.current) {
        addToHistoryRef.current(imageUrl, configWithSeed, seed);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }

  async function generate() {
    if (!isFormValid) {
      setError("Please fill in all required fields (Background Setting and Context)");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setError("");
    setImg(null);
    setStatusMessage("Starting FIBO generation...");
    setLoading(true);

    try {
      const parsedJSON = JSON.parse(jsonInput);
    
      const MAX_SEED = 2147483647;
      const seed = currentSeed || Math.floor(Math.random() * MAX_SEED);
      
      const configWithSeed = {
        ...parsedJSON,
        seed: seed
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configWithSeed),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }

      setStatusMessage("✅ Image generated!");
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImg(imageUrl);
      setCurrentSeed(seed);

      if (addToHistoryRef.current) {
        addToHistoryRef.current(imageUrl, configWithSeed, seed);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(""), 3000);
      setCurrentSeed(null); 
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Image History Sidebar */}
        <ImageHistorySidebar
          onRegenerateExact={handleRegenerateExact}
          onRegenerateVariation={handleRegenerateVariation}
          onLoadConfig={handleLoadConfig}
          addToHistoryRef={addToHistoryRef}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 p-4 sm:p-8 text-white rounded-xl sm:rounded-2xl shadow-lg">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2">🎨 FIBO JSON Assistant</h1>
            <p className="text-indigo-100 text-sm sm:text-lg">
              Professional image generation with structured JSON control
            </p>

            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <span className="bg-white/10 backdrop-blur px-2 sm:px-3 py-1 rounded-full border border-white/10">
                ✅ Bria API Connected
              </span>
              <span className="bg-white/10 backdrop-blur px-2 sm:px-3 py-1 rounded-full border border-white/10">
                💾 Style Presets
              </span>
              <span className="bg-white/10 backdrop-blur px-2 sm:px-3 py-1 rounded-full border border-white/10">
                🔄 Batch Generation
              </span>
              <span className="bg-white/10 backdrop-blur px-2 sm:px-3 py-1 rounded-full border border-white/10">
                📜 Generation History
              </span>
              <span className="bg-white/10 backdrop-blur px-2 sm:px-3 py-1 rounded-full border border-white/10">
                🔒 100% Licensed Data
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Status Message */}
            {statusMessage && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-blue-700 font-semibold animate-pulse text-sm sm:text-base">
                {statusMessage}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm sm:text-base">
                <strong>⚠️ Error:</strong> {error}
              </div>
            )}
            {/* Tab Buttons */}
            <div className="mb-4 sm:mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
                  activeTab === "single"
                    ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ✨ Single Generation
              </button>
              <button
                onClick={() => setActiveTab("batch")}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
                  activeTab === "batch"
                    ? "bg-gradient-to-r from-gray-900 via-indigo-800 to-violet-700 text-white shadow-lg"
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
                <div className="mb-6 sm:mb-8">
                  <label className="block mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-gray-800">
                    Quick Start Prompt
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      className="flex-1 p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-sm sm:text-lg"
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed font-bold text-base sm:text-lg shadow-lg transition-all"
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
                  onValidate={setIsFormValid}
                />

                {/* Generate Button */}
                <button
                  className={`w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-2xl transition-all transform hover:scale-[1.02] ${
                    !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 disabled:opacity-50"
                  }`}
                  onClick={generate}
                  disabled={loading || !jsonInput.trim() || !isFormValid}
                  title={!isFormValid ? "Please fill in Background Setting and Context" : ""}
                >
                  {loading ? "🎨 Generating with FIBO..." : "🚀 Generate Image"}
                </button>

                {/* Image Display */}
                {img && (
                  <div className="mt-6 sm:mt-10">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>✨ Generated Result</span>
                      {currentSeed && (
                        <span className="text-xs sm:text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          Seed: {currentSeed}
                        </span>
                      )}
                    </h3>
                    <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-gray-200">
                      <img src={img} alt="Generated" className="w-full" />
                    </div>
                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3">
                      <a
                        href={img}
                        download="fibo-generated.png"
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-center text-sm sm:text-base"
                      >
                        ⬇️ Download Image
                      </a>
                      <button
                        onClick={() => {
                          const config = getCurrentConfig();
                          const blob = new Blob([JSON.stringify(config, null, 2)], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "fibo-config.json";
                          link.click();
                        }}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm sm:text-base"
                      >
                        📄 Download JSON
                      </button>
                      {currentSeed && (
                        <button
                          onClick={() => generateWithSeed(getCurrentConfig(), currentSeed)}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm sm:text-base"
                        >
                          🔄 Regenerate Exact
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Batch Generation Tab */}
            {activeTab === "batch" && (
              <BatchGenerator 
                currentConfig={getCurrentConfig()} 
                onAddToHistory={addToHistoryRef.current || undefined}
              />
            )}
          </div>
        </div>

        {/* Preset Manager */}
        <PresetManager
          currentConfig={getCurrentConfig()}
          onLoadPreset={handleLoadPreset}
          quickStartPrompt={prompt}
        />

        {/* Info Footer */}
        <div className="mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm">
          <p>
            Powered by Bria FIBO • 100% Licensed Training Data • Enterprise-Ready
          </p>
        </div>
      </div>
    </div>
  );
}
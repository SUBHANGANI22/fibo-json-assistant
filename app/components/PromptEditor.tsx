"use client";
import { useState, useEffect } from "react";

interface Props {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  initialPrompt?: string;
}

export default function PromptEditor({ jsonInput, setJsonInput, initialPrompt = "" }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [cameraAngle, setCameraAngle] = useState("front");
  const [fov, setFov] = useState(60);
  const [lens, setLens] = useState("standard");
  const [lighting, setLighting] = useState("soft");
  const [intensity, setIntensity] = useState("medium");
  const [palette, setPalette] = useState("warm");
  const [saturation, setSaturation] = useState("high");
  const [composition, setComposition] = useState("centered");
  const [detailLevel, setDetailLevel] = useState("high");

  useEffect(() => {
    updateJSON();
  }, [cameraAngle, fov, lens, lighting, intensity, palette, saturation, composition, detailLevel, prompt]);

  function updateJSON() {
    const json = {
      prompt: prompt || "A beautiful landscape",
      camera: {
        angle: cameraAngle,
        fov: fov,
        lens: lens
      },
      lighting: {
        style: lighting,
        intensity: intensity,
        color_temperature: "neutral"
      },
      colors: {
        palette: palette,
        saturation: saturation,
        contrast: "medium"
      },
      composition: {
        style: composition,
        balance: composition === "symmetrical" ? "symmetrical" : "dynamic"
      },
      quality: {
        detail_level: detailLevel,
        sharpness: "medium"
      }
    };
    setJsonInput(JSON.stringify(json, null, 2));
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🎛️ FIBO JSON Controls
      </h2>

      {/* Prompt */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Main Prompt
        </label>
        <textarea
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image in detail..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Camera Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-purple-600 flex items-center gap-2">
            📷 Camera
          </h3>
          
          <div>
            <label className="block mb-2 text-sm font-semibold">Angle</label>
            <select
              value={cameraAngle}
              onChange={(e) => setCameraAngle(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="front">Front View</option>
              <option value="side">Side View</option>
              <option value="top">Top Down</option>
              <option value="low">Low Angle</option>
              <option value="high">High Angle</option>
              <option value="aerial">Aerial</option>
              <option value="eye-level">Eye Level</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              FOV: {fov}°
            </label>
            <input
              type="range"
              min={30}
              max={120}
              value={fov}
              onChange={(e) => setFov(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30°</span>
              <span>120°</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Lens</label>
            <select
              value={lens}
              onChange={(e) => setLens(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="wide">Wide (24mm)</option>
              <option value="standard">Standard (50mm)</option>
              <option value="portrait">Portrait (85mm)</option>
              <option value="telephoto">Telephoto (200mm)</option>
            </select>
          </div>
        </div>

        {/* Lighting Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-yellow-600 flex items-center gap-2">
            💡 Lighting
          </h3>
          
          <div>
            <label className="block mb-2 text-sm font-semibold">Style</label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="soft">Soft</option>
              <option value="hard">Hard</option>
              <option value="dramatic">Dramatic</option>
              <option value="natural">Natural</option>
              <option value="studio">Studio</option>
              <option value="golden-hour">Golden Hour</option>
              <option value="backlit">Backlit</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Intensity</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Colors Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-pink-600 flex items-center gap-2">
            🎨 Colors
          </h3>
          
          <div>
            <label className="block mb-2 text-sm font-semibold">Palette</label>
            <select
              value={palette}
              onChange={(e) => setPalette(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="neutral">Neutral</option>
              <option value="vibrant">Vibrant</option>
              <option value="pastel">Pastel</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Saturation</label>
            <select
              value={saturation}
              onChange={(e) => setSaturation(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Composition Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-blue-600 flex items-center gap-2">
            📐 Composition
          </h3>
          
          <div>
            <label className="block mb-2 text-sm font-semibold">Style</label>
            <select
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="centered">Centered</option>
              <option value="rule-of-thirds">Rule of Thirds</option>
              <option value="golden-ratio">Golden Ratio</option>
              <option value="symmetrical">Symmetrical</option>
              <option value="dynamic">Dynamic</option>
              <option value="diagonal">Diagonal</option>
            </select>
          </div>
        </div>

        {/* Quality Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-green-600 flex items-center gap-2">
            ⭐ Quality
          </h3>
          
          <div>
            <label className="block mb-2 text-sm font-semibold">Detail Level</label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      <div className="mt-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Generated Structured JSON
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-xs bg-gray-900 text-green-400 focus:border-purple-500 focus:outline-none"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={12}
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 You can manually edit this JSON for precise control
        </p>
      </div>
    </div>
  );
}
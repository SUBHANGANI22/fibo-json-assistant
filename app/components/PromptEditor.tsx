// "use client";
// import { useState, useEffect } from "react";

// interface Props {
//   jsonInput: string;
//   setJsonInput: (val: string) => void;
//   initialPrompt?: string;
// }

// export default function PromptEditor({ jsonInput, setJsonInput, initialPrompt = "" }: Props) {
//   const [prompt, setPrompt] = useState(initialPrompt);
//   const [cameraAngle, setCameraAngle] = useState("front");
//   const [fov, setFov] = useState(60);
//   const [lens, setLens] = useState("standard");
//   const [lighting, setLighting] = useState("soft");
//   const [intensity, setIntensity] = useState("medium");
//   const [colorTemperature, setColorTemperature] = useState("neutral");
//   const [palette, setPalette] = useState("warm");
//   const [saturation, setSaturation] = useState("high");
//   const [contrast, setContrast] = useState("medium");
//   const [composition, setComposition] = useState("centered");
//   const [balance, setBalance] = useState("dynamic");
//   const [detailLevel, setDetailLevel] = useState("high");
//   const [sharpness, setSharpness] = useState("medium");
// function applyConfig(config: any) {
//     // Only update if the config is valid
//     if (config && Object.keys(config).length > 0) {
//       setPrompt(config.prompt || initialPrompt);
//       setCameraAngle(config.camera?.angle || "front");
//       setFov(config.camera?.fov || 60);
//       setLens(config.camera?.lens || "standard");
//       setLighting(config.lighting?.style || "soft");
//       setIntensity(config.lighting?.intensity || "medium");
//       setColorTemperature(config.lighting?.color_temperature || "neutral");
//       setPalette(config.colors?.palette || "warm");
//       setSaturation(config.colors?.saturation || "high");
//       setContrast(config.colors?.contrast || "medium");
//       setComposition(config.composition?.style || "centered");
//       setBalance(config.composition?.balance || "dynamic");
//       setDetailLevel(config.quality?.detail_level || "high");
//       setSharpness(config.quality?.sharpness || "medium");
//     }
//   }
//   useEffect(() => {
//     updateJSON();
//   }, [cameraAngle, fov, lens, lighting, intensity, colorTemperature, palette, saturation, contrast, composition, balance, detailLevel, sharpness, prompt]);
// useEffect(() => {
//     try {
//       // Don't run on initial mount if jsonInput is empty
//       if (jsonInput.trim()) { 
//           const configFromInput = JSON.parse(jsonInput);
//           applyConfig(configFromInput);
//       }
//     } catch (e) {
//       console.error("Failed to parse JSON for editor state update:", e);
//     }
//   }, [jsonInput]); 
//   function updateJSON() {
//     const json = {
//       prompt: prompt || "A beautiful landscape",
//       camera: {
//         angle: cameraAngle,
//         fov: fov,
//         lens: lens
//       },
//       lighting: {
//         style: lighting,
//         intensity: intensity,
//         color_temperature: colorTemperature
//       },
//       colors: {
//         palette: palette,
//         saturation: saturation,
//         contrast: contrast
//       },
//       composition: {
//         style: composition,
//         balance: balance
//       },
//       quality: {
//         detail_level: detailLevel,
//         sharpness: sharpness
//       }
//     };
//     setJsonInput(JSON.stringify(json, null, 2));
//   }

  

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         🎛️ FIBO JSON Controls
//       </h2>

//       {/* Prompt */}
//       <div className="mb-6">
//         <label className="block mb-2 font-semibold text-gray-700">
//           Main Prompt
//         </label>
//         <textarea
//           className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Describe your image in detail..."
//           rows={3}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Camera Section */}
//         <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-bold text-purple-600 flex items-center gap-2">
//             📷 Camera
//           </h3>
          
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Angle</label>
//             <select
//               value={cameraAngle}
//               onChange={(e) => setCameraAngle(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="front">Front View</option>
//               <option value="side">Side View</option>
//               <option value="top">Top Down</option>
//               <option value="low">Low Angle</option>
//               <option value="high">High Angle</option>
//               <option value="aerial">Aerial</option>
//               <option value="eye-level">Eye Level</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">
//               FOV: {fov}°
//             </label>
//             <input
//               type="range"
//               min={30}
//               max={120}
//               value={fov}
//               onChange={(e) => setFov(Number(e.target.value))}
//               className="w-full"
//             />
//             <div className="flex justify-between text-xs text-gray-500 mt-1">
//               <span>30°</span>
//               <span>120°</span>
//             </div>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Lens</label>
//             <select
//               value={lens}
//               onChange={(e) => setLens(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="wide">Wide (24mm)</option>
//               <option value="standard">Standard (50mm)</option>
//               <option value="portrait">Portrait (85mm)</option>
//               <option value="telephoto">Telephoto (200mm)</option>
//             </select>
//           </div>
//         </div>

//         {/* Lighting Section */}
//         <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-bold text-yellow-600 flex items-center gap-2">
//             💡 Lighting
//           </h3>
          
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Style</label>
//             <select
//               value={lighting}
//               onChange={(e) => setLighting(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="soft">Soft</option>
//               <option value="hard">Hard</option>
//               <option value="dramatic">Dramatic</option>
//               <option value="natural">Natural</option>
//               <option value="studio">Studio</option>
//               <option value="golden-hour">Golden Hour</option>
//               <option value="backlit">Backlit</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Intensity</label>
//             <select
//               value={intensity}
//               onChange={(e) => setIntensity(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Color Temperature</label>
//             <select
//               value={colorTemperature}
//               onChange={(e) => setColorTemperature(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="warm">Warm</option>
//               <option value="neutral">Neutral</option>
//               <option value="cool">Cool</option>
//             </select>
//           </div>
//         </div>

//         {/* Colors Section */}
//         <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-bold text-pink-600 flex items-center gap-2">
//             🎨 Colors
//           </h3>
          
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Palette</label>
//             <select
//               value={palette}
//               onChange={(e) => setPalette(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="warm">Warm</option>
//               <option value="cool">Cool</option>
//               <option value="neutral">Neutral</option>
//               <option value="vibrant">Vibrant</option>
//               <option value="pastel">Pastel</option>
//               <option value="monochrome">Monochrome</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Saturation</label>
//             <select
//               value={saturation}
//               onChange={(e) => setSaturation(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Contrast</label>
//             <select
//               value={contrast}
//               onChange={(e) => setContrast(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>
//         </div>

//         {/* Composition Section */}
//         <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-bold text-blue-600 flex items-center gap-2">
//             📐 Composition
//           </h3>
          
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Style</label>
//             <select
//               value={composition}
//               onChange={(e) => setComposition(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="centered">Centered</option>
//               <option value="rule-of-thirds">Rule of Thirds</option>
//               <option value="golden-ratio">Golden Ratio</option>
//               <option value="symmetrical">Symmetrical</option>
//               <option value="dynamic">Dynamic</option>
//               <option value="diagonal">Diagonal</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Balance</label>
//             <select
//               value={balance}
//               onChange={(e) => setBalance(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="symmetrical">Symmetrical</option>
//               <option value="dynamic">Dynamic</option>
//               <option value="asymmetrical">Asymmetrical</option>
//             </select>
//           </div>
//         </div>

//         {/* Quality Section */}
//         <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-bold text-green-600 flex items-center gap-2">
//             ⭐ Quality
//           </h3>
          
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Detail Level</label>
//             <select
//               value={detailLevel}
//               onChange={(e) => setDetailLevel(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//               <option value="ultra">Ultra</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-semibold">Sharpness</label>
//             <select
//               value={sharpness}
//               onChange={(e) => setSharpness(e.target.value)}
//               className="w-full p-2 border rounded-lg text-sm"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* JSON Preview */}
//       <div className="mt-6">
//         <label className="block mb-2 font-semibold text-gray-700">
//           Generated Structured JSON
//         </label>
//         <textarea
//           className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-xs bg-gray-900 text-green-400 focus:border-purple-500 focus:outline-none"
//           value={jsonInput}
//           onChange={(e) => setJsonInput(e.target.value)}
//           rows={12}
//         />
//         <p className="text-xs text-gray-500 mt-2">
//           💡 You can manually edit this JSON for precise control
//         </p>
//       </div>
//     </div>
//   );
// }


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
  const [colorTemperature, setColorTemperature] = useState("neutral");
  const [palette, setPalette] = useState("warm");
  const [saturation, setSaturation] = useState("high");
  const [contrast, setContrast] = useState("medium");
  const [composition, setComposition] = useState("centered");
  const [balance, setBalance] = useState("dynamic");
  const [detailLevel, setDetailLevel] = useState("high");
  const [sharpness, setSharpness] = useState("medium");
  
  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [forceAestheticOverride, setForceAestheticOverride] = useState(false);

  function applyConfig(config: any) {
    if (config && Object.keys(config).length > 0) {
      setPrompt(config.prompt || initialPrompt);
      setCameraAngle(config.camera?.angle || "front");
      setFov(config.camera?.fov || 60);
      setLens(config.camera?.lens || "standard");
      setLighting(config.lighting?.style || "soft");
      setIntensity(config.lighting?.intensity || "medium");
      setColorTemperature(config.lighting?.color_temperature || "neutral");
      setPalette(config.colors?.palette || "warm");
      setSaturation(config.colors?.saturation || "high");
      setContrast(config.colors?.contrast || "medium");
      setComposition(config.composition?.style || "centered");
      setBalance(config.composition?.balance || "dynamic");
      setDetailLevel(config.quality?.detail_level || "high");
      setSharpness(config.quality?.sharpness || "medium");
      setForceAestheticOverride(config.forceAestheticOverride || false);
    }
  }

  useEffect(() => {
    updateJSON();
  }, [cameraAngle, fov, lens, lighting, intensity, colorTemperature, palette, saturation, contrast, composition, balance, detailLevel, sharpness, prompt, forceAestheticOverride]);

  useEffect(() => {
    try {
      if (jsonInput.trim()) { 
        const configFromInput = JSON.parse(jsonInput);
        applyConfig(configFromInput);
      }
    } catch (e) {
      console.error("Failed to parse JSON for editor state update:", e);
    }
  }, [jsonInput]); 

  function updateJSON() {
    const json: any = {
      prompt: prompt || "A beautiful landscape",
      camera: {
        angle: cameraAngle,
        fov: fov,
        lens: lens
      },
      lighting: {
        style: lighting,
        intensity: intensity,
        color_temperature: colorTemperature
      },
      colors: {
        palette: palette,
        saturation: saturation,
        contrast: contrast
      },
      composition: {
        style: composition,
        balance: balance
      },
      quality: {
        detail_level: detailLevel,
        sharpness: sharpness
      }
    };

    // Add forceAestheticOverride only if true
    if (forceAestheticOverride) {
      json.forceAestheticOverride = true;
    }

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

      {/* Advanced Options Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span>{showAdvanced ? "▼" : "▶"}</span>
          <span>Advanced Options</span>
        </button>
        
        {showAdvanced && (
          <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="forceAestheticOverride"
                checked={forceAestheticOverride}
                onChange={(e) => setForceAestheticOverride(e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label htmlFor="forceAestheticOverride" className="font-semibold text-purple-900 cursor-pointer">
                  Force Aesthetic Override
                </label>
                <p className="text-sm text-purple-700 mt-1">
                  When enabled, your aesthetic choices (lighting, colors, temperature) will <strong>override</strong> the AI's realistic defaults for the subject. 
                  <br/>
                  <span className="text-xs italic mt-1 block">
                    Example: A snowy forest will use warm golden-hour lighting instead of defaulting to cool overcast tones.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
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
            {forceAestheticOverride && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">OVERRIDE</span>
            )}
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

          <div>
            <label className="block mb-2 text-sm font-semibold">Color Temperature</label>
            <select
              value={colorTemperature}
              onChange={(e) => setColorTemperature(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="warm">Warm</option>
              <option value="neutral">Neutral</option>
              <option value="cool">Cool</option>
            </select>
          </div>
        </div>

        {/* Colors Section */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-pink-600 flex items-center gap-2">
            🎨 Colors
            {forceAestheticOverride && (
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded">OVERRIDE</span>
            )}
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

          <div>
            <label className="block mb-2 text-sm font-semibold">Contrast</label>
            <select
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
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

          <div>
            <label className="block mb-2 text-sm font-semibold">Balance</label>
            <select
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="symmetrical">Symmetrical</option>
              <option value="dynamic">Dynamic</option>
              <option value="asymmetrical">Asymmetrical</option>
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

          <div>
            <label className="block mb-2 text-sm font-semibold">Sharpness</label>
            <select
              value={sharpness}
              onChange={(e) => setSharpness(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
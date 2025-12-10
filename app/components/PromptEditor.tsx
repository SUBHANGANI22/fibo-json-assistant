"use client";
import { useState, useEffect, useRef } from "react";

interface Props {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  initialPrompt?: string;
  onValidate?: (isValid: boolean) => void;
}

export default function PromptEditor({ jsonInput, setJsonInput, initialPrompt = "", onValidate }: Props) {
  // Core FIBO fields
  const [shortDescription, setShortDescription] = useState(initialPrompt);
  const [styleMedium, setStyleMedium] = useState("photograph");
  const [artisticStyle, setArtisticStyle] = useState("photorealistic");
  const [backgroundSetting, setBackgroundSetting] = useState("");
  const [context, setContext] = useState("");
  
  // Aesthetics
  const [aestheticScore, setAestheticScore] = useState("high");
  const [colorScheme, setColorScheme] = useState("natural colors");
  const [composition, setComposition] = useState("rule of thirds");
  const [moodAtmosphere, setMoodAtmosphere] = useState("professional");
  const [preferenceScore, setPreferenceScore] = useState("high");
  
  // Lighting
  const [lightingConditions, setLightingConditions] = useState("natural daylight");
  const [lightingDirection, setLightingDirection] = useState("soft, diffused lighting from multiple sources");
  const [shadows, setShadows] = useState("soft shadows");
  
  // Photographic Characteristics
  const [cameraAngle, setCameraAngle] = useState("eye-level");
  const [depthOfField, setDepthOfField] = useState("medium");
  const [focus, setFocus] = useState("sharp focus");
  const [lensFocalLength, setLensFocalLength] = useState("standard lens (50mm)");
  
  // HDR Settings - Fixed type
  const [enableHDR, setEnableHDR] = useState(false);
  const [bitDepth, setBitDepth] = useState<number>(8);
  const [colorSpace, setColorSpace] = useState<"sRGB" | "Display P3" | "ProPhoto RGB">("sRGB");
  
  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isExternalUpdate = useRef(false);
  const lastExternalJson = useRef("");
  const [errors, setErrors] = useState<{backgroundSetting?: string; context?: string}>({});

  // Calculate estimated file size
  const calculateFileSize = () => {
    const baseSize = 1.5;
    let sizeMultiplier = 1;
    
    if (enableHDR) {
      if (bitDepth === 16) {
        sizeMultiplier *= 2;
      }
      if (colorSpace === "Display P3") {
        sizeMultiplier *= 1.1;
      } else if (colorSpace === "ProPhoto RGB") {
        sizeMultiplier *= 1.2;
      }
    }
    
    return (baseSize * sizeMultiplier).toFixed(2);
  };

  const validateFields = () => {
    const newErrors: {backgroundSetting?: string; context?: string} = {};
    
    if (!backgroundSetting.trim()) {
      newErrors.backgroundSetting = "Background setting is required";
    }
    
    if (!context.trim()) {
      newErrors.context = "Context is required";
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (onValidate) {
      onValidate(isValid);
    }
    
    return isValid;
  };


useEffect(() => {
  // Skip if this update came from parsing external JSON
  if (isExternalUpdate.current) {
    isExternalUpdate.current = false;
    return;
  }

  const fiboJSON: any = {
    short_description: shortDescription,
    style_medium: styleMedium,
    artistic_style: artisticStyle,
    aesthetics: {
      aesthetic_score: aestheticScore,
      color_scheme: colorScheme,
      composition: composition,
      mood_atmosphere: moodAtmosphere,
      preference_score: preferenceScore
    },
    lighting: {
      conditions: lightingConditions,
      direction: lightingDirection,
      shadows: shadows
    },
    photographic_characteristics: {
      camera_angle: cameraAngle,
      depth_of_field: depthOfField,
      focus: focus,
      lens_focal_length: lensFocalLength
    },
    background_setting: backgroundSetting,
    context: context,
    objects: [],
  };
  
  if (enableHDR) {
    fiboJSON.hdr_settings = {
      enabled: true,
      bit_depth: bitDepth,
      color_space: colorSpace
    };
  }

  const newJson = JSON.stringify(fiboJSON, null, 2);
  
  // Only update if JSON actually changed AND track it
  if (newJson !== jsonInput) {
    lastExternalJson.current = newJson;
    setJsonInput(newJson);
  }
}, [
  shortDescription, styleMedium, artisticStyle, backgroundSetting, context,
  aestheticScore, colorScheme, composition, moodAtmosphere, preferenceScore,
  lightingConditions, lightingDirection, shadows,
  cameraAngle, depthOfField, focus, lensFocalLength,
  enableHDR, bitDepth, colorSpace,
  setJsonInput
]);

// Effect 2: Parse JSON and update state
useEffect(() => {
  // Skip if this is our own generated JSON
  if (jsonInput === lastExternalJson.current) {
    return;
  }

  try {
    if (jsonInput.trim()) {
      const configFromInput = JSON.parse(jsonInput);
      
      // Set flag BEFORE state updates
      isExternalUpdate.current = true;
      
      // Update all state
      setShortDescription(configFromInput.short_description || "");
      setStyleMedium(configFromInput.style_medium || "photograph");
      setArtisticStyle(configFromInput.artistic_style || "photorealistic");
      setBackgroundSetting(configFromInput.background_setting || "");
      setContext(configFromInput.context || "");
      
      if (configFromInput.aesthetics) {
        setAestheticScore(configFromInput.aesthetics.aesthetic_score || "high");
        setColorScheme(configFromInput.aesthetics.color_scheme || "natural colors");
        setComposition(configFromInput.aesthetics.composition || "rule of thirds");
        setMoodAtmosphere(configFromInput.aesthetics.mood_atmosphere || "professional");
        setPreferenceScore(configFromInput.aesthetics.preference_score || "high");
      }
      
      if (configFromInput.lighting) {
        setLightingConditions(configFromInput.lighting.conditions || "natural daylight");
        setLightingDirection(configFromInput.lighting.direction || "soft, diffused lighting from multiple sources");
        setShadows(configFromInput.lighting.shadows || "soft shadows");
      }
      
      if (configFromInput.photographic_characteristics) {
        setCameraAngle(configFromInput.photographic_characteristics.camera_angle || "eye-level");
        setDepthOfField(configFromInput.photographic_characteristics.depth_of_field || "medium");
        setFocus(configFromInput.photographic_characteristics.focus || "sharp focus");
        setLensFocalLength(configFromInput.photographic_characteristics.lens_focal_length || "standard lens (50mm)");
      }
      
      if (configFromInput.hdr_settings) {
        setEnableHDR(configFromInput.hdr_settings.enabled || false);
        setBitDepth(configFromInput.hdr_settings.bit_depth || 8);
        setColorSpace(configFromInput.hdr_settings.color_space || "sRGB");
      }
      
      // Reset flag after React batches all state updates
      setTimeout(() => {
        isExternalUpdate.current = false;
      }, 0);
    }
  } catch (e) {
    console.error("Failed to parse JSON for editor state update:", e);
  }
}, [jsonInput]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        🎛️ FIBO Structured Prompt Builder
      </h2>

      {/* Info Banner */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>💡 How it works:</strong> Configure your image settings below. The structured JSON will be automatically converted into an optimized text prompt for BRIA's FIBO model. All fields are fully customizable with smart defaults.
        </p>
      </div>

      {/* Main Description */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
          Main Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="A detailed description of the image you want to generate..."
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe the main subject, scene, or concept of your image
        </p>
      </div>

      {/* Core Style Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">Style Medium</label>
          <select
            value={styleMedium}
            onChange={(e) => setStyleMedium(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
          >
            <option value="photograph">Photograph</option>
            <option value="digital art">Digital Art</option>
            <option value="3D render">3D Render</option>
            <option value="illustration">Illustration</option>
            <option value="painting">Painting</option>
            <option value="oil painting">Oil Painting</option>
            <option value="watercolor">Watercolor</option>
            <option value="sketch">Sketch</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">Artistic Style</label>
          <select
            value={artisticStyle}
            onChange={(e) => setArtisticStyle(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
          >
            <option value="photorealistic">Photorealistic</option>
            <option value="realistic">Realistic</option>
            <option value="cinematic">Cinematic</option>
            <option value="artistic">Artistic</option>
            <option value="abstract">Abstract</option>
            <option value="minimalist">Minimalist</option>
            <option value="dramatic">Dramatic</option>
            <option value="surreal">Surreal</option>
            <option value="impressionist">Impressionist</option>
            <option value="modern">Modern</option>
            <option value="vintage">Vintage</option>
          </select>
        </div>
      </div>

      {/* Context & Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">Background Setting</label>
          <input
            type="text"
            value={backgroundSetting}
            onChange={(e) => setBackgroundSetting(e.target.value)}
            placeholder="e.g., clean white background, urban street"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">Context</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., product photography, lifestyle shot"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      {/* COMPACT HDR / High-Fidelity Color Settings */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border-2 border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-purple-700 flex items-center gap-2 text-sm sm:text-base">
            🌈 HDR / High-Fidelity Color
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableHDR}
              onChange={(e) => setEnableHDR(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-semibold text-gray-700">Enable</span>
          </label>
        </div>

        {enableHDR && (
          <div className="space-y-3 pt-3 border-t border-purple-200">
            {/* Compact Bit Depth & Color Space in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bit Depth */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700">
                  Bit Depth: {bitDepth}-bit
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBitDepth(8)}
                    className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                      bitDepth === 8
                        ? "bg-purple-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-purple-400"
                    }`}
                  >
                    8-bit
                  </button>
                  <button
                    onClick={() => setBitDepth(16)}
                    className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                      bitDepth === 16
                        ? "bg-purple-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-purple-400"
                    }`}
                  >
                    16-bit
                  </button>
                </div>
              </div>

              {/* Color Space */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700">Color Space</label>
                <select
                  value={colorSpace}
                  onChange={(e) => setColorSpace(e.target.value as "sRGB" | "Display P3" | "ProPhoto RGB")}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="sRGB">sRGB (Standard)</option>
                  <option value="Display P3">Display P3 (+25% gamut)</option>
                  <option value="ProPhoto RGB">ProPhoto RGB (Pro)</option>
                </select>
              </div>
            </div>

            {/* Compact File Size Info */}
            <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded border border-purple-200">
              <span className="text-gray-600">Est. File Size:</span>
              <span className="font-mono font-bold text-purple-700">{calculateFileSize()} MB</span>
              <span className="text-gray-500">
                {parseFloat(calculateFileSize()) > 1.5 
                  ? `(+${((parseFloat(calculateFileSize()) / 1.5 - 1) * 100).toFixed(0)}%)`
                  : "(baseline)"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Options Toggle */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-gray-700 hover:to-indigo-700 transition-colors text-sm sm:text-base"
        >
          <span>{showAdvanced ? "▼" : "▶"}</span>
          <span>Fine-Tune All FIBO Controls</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Photographic Characteristics */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-purple-600 flex items-center gap-2 text-sm sm:text-base">
              📷 Camera & Lens
            </h3>
            
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Camera Angle</label>
              <select
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="eye-level">Eye Level</option>
                <option value="low angle">Low Angle</option>
                <option value="high angle">High Angle</option>
                <option value="bird's eye">Bird's Eye View</option>
                <option value="worm's eye">Worm's Eye View</option>
                <option value="dutch angle">Dutch Angle</option>
                <option value="over the shoulder">Over the Shoulder</option>
                <option value="aerial view">Aerial View</option>
                <option value="close-up">Close-Up</option>
                <option value="extreme close-up">Extreme Close-Up</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Lens Focal Length</label>
              <select
                value={lensFocalLength}
                onChange={(e) => setLensFocalLength(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="ultra wide-angle lens (14mm)">Ultra Wide 14mm</option>
                <option value="wide-angle lens (24mm)">Wide 24mm</option>
                <option value="wide-angle lens (28mm)">Wide 28mm</option>
                <option value="standard lens (35mm)">Standard 35mm</option>
                <option value="standard lens (50mm)">Standard 50mm</option>
                <option value="portrait lens (85mm)">Portrait 85mm</option>
                <option value="portrait lens (105mm)">Portrait 105mm</option>
                <option value="telephoto lens (135mm)">Telephoto 135mm</option>
                <option value="telephoto lens (200mm)">Telephoto 200mm</option>
                <option value="super telephoto lens (400mm)">Super Telephoto 400mm</option>
                <option value="macro lens">Macro Lens</option>
                <option value="fisheye lens">Fisheye Lens</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Depth of Field</label>
              <select
                value={depthOfField}
                onChange={(e) => setDepthOfField(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="shallow">Shallow (Blurred Background)</option>
                <option value="medium">Medium</option>
                <option value="deep">Deep (All in Focus)</option>
                <option value="bokeh">Bokeh Effect</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Focus</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="sharp focus">Sharp Focus</option>
                <option value="soft focus">Soft Focus</option>
                <option value="selective focus">Selective Focus</option>
                <option value="rack focus">Rack Focus</option>
                <option value="tilt-shift focus">Tilt-Shift Focus</option>
              </select>
            </div>
          </div>

          {/* Lighting */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-yellow-600 flex items-center gap-2 text-sm sm:text-base">
              💡 Lighting
            </h3>
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Conditions</label>
              <select
                value={lightingConditions}
                onChange={(e) => setLightingConditions(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="natural daylight">Natural Daylight</option>
                <option value="golden hour">Golden Hour</option>
                <option value="blue hour">Blue Hour</option>
                <option value="sunrise">Sunrise</option>
                <option value="sunset">Sunset</option>
                <option value="overcast">Overcast</option>
                <option value="bright, even studio lighting">Studio Lighting</option>
                <option value="soft lighting">Soft Lighting</option>
                <option value="hard lighting">Hard Lighting</option>
                <option value="dramatic lighting">Dramatic Lighting</option>
                <option value="moody lighting">Moody Lighting</option>
                <option value="rim lighting">Rim Lighting</option>
                <option value="backlit">Backlit</option>
                <option value="low-key lighting">Low-Key Lighting</option>
                <option value="high-key lighting">High-Key Lighting</option>
                <option value="neon lighting">Neon Lighting</option>
                <option value="candlelight">Candlelight</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Direction</label>
              <select
                value={lightingDirection}
                onChange={(e) => setLightingDirection(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="soft, diffused lighting from multiple sources">Three-Point (Diffused)</option>
                <option value="front lighting">Front Lighting</option>
                <option value="side lighting">Side Lighting</option>
                <option value="back lighting">Back Lighting</option>
                <option value="top lighting">Top Lighting</option>
                <option value="bottom lighting">Bottom Lighting</option>
                <option value="split lighting">Split Lighting</option>
                <option value="butterfly lighting">Butterfly Lighting</option>
                <option value="loop lighting">Loop Lighting</option>
                <option value="rembrandt lighting">Rembrandt Lighting</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Shadows</label>
              <select
                value={shadows}
                onChange={(e) => setShadows(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="soft shadows">Soft Shadows</option>
                <option value="hard shadows">Hard Shadows</option>
                <option value="dramatic shadows">Dramatic Shadows</option>
                <option value="subtle, soft, and elongated shadows">Subtle & Elongated</option>
                <option value="minimal shadows">Minimal Shadows</option>
                <option value="no shadows">No Shadows</option>
                <option value="long shadows">Long Shadows</option>
                <option value="short shadows">Short Shadows</option>
              </select>
            </div>
          </div>

          {/* Aesthetics */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-pink-600 flex items-center gap-2 text-sm sm:text-base">
              🎨 Aesthetics
            </h3> 
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Color Scheme</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="natural colors">Natural Colors</option>
                <option value="warm tones">Warm Tones</option>
                <option value="cool tones">Cool Tones</option>
                <option value="neutral tones">Neutral Tones</option>
                <option value="vibrant colors">Vibrant Colors</option>
                <option value="pastel colors">Pastel Colors</option>
                <option value="muted colors">Muted Colors</option>
                <option value="monochrome">Monochrome</option>
                <option value="black and white">Black and White</option>
                <option value="sepia">Sepia</option>
                <option value="complementary colors">Complementary Colors</option>
                <option value="analogous colors">Analogous Colors</option>
                <option value="triadic colors">Triadic Colors</option>
                <option value="earth tones">Earth Tones</option>
                <option value="neon colors">Neon Colors</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Composition</label>
              <select
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="rule of thirds">Rule of Thirds</option>
                <option value="centered, symmetrical, and balanced composition">Centered & Symmetrical</option>
                <option value="golden ratio">Golden Ratio</option>
                <option value="symmetrical">Symmetrical</option>
                <option value="asymmetrical">Asymmetrical</option>
                <option value="diagonal composition">Diagonal</option>
                <option value="leading lines">Leading Lines</option>
                <option value="framing">Framing</option>
                <option value="negative space">Negative Space</option>
                <option value="layering">Layering</option>
                <option value="pattern and repetition">Pattern & Repetition</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-semibold">Mood & Atmosphere</label>
              <select
                value={moodAtmosphere}
                onChange={(e) => setMoodAtmosphere(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs sm:text-sm"
              >
                <option value="professional">Professional</option>
                <option value="peaceful">Peaceful</option>
                <option value="energetic">Energetic</option>
                <option value="dramatic">Dramatic</option>
                <option value="mysterious">Mysterious</option>
                <option value="cheerful">Cheerful</option>
                <option value="melancholic">Melancholic</option>
                <option value="intimate">Intimate</option>
                <option value="festive, celebratory, elegant, joyful, optimistic">Festive & Celebratory</option>
                <option value="romantic">Romantic</option>
                <option value="epic">Epic</option>
                <option value="serene">Serene</option>
                <option value="tense">Tense</option>
                <option value="whimsical">Whimsical</option>
              </select>
            </div>
          </div>

          {/* Quality Scores */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm lg:col-span-2 xl:col-span-3">
            <h3 className="font-bold text-green-600 flex items-center gap-2 text-sm sm:text-base">
              ⭐ Quality Scores
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-xs sm:text-sm font-semibold">Aesthetic Score</label>
                <select
                  value={aestheticScore}
                  onChange={(e) => setAestheticScore(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs sm:text-sm"
                >
                  <option value="very high">Very High</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="very low">Very Low</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Overall visual appeal target</p>
              </div>

              <div>
                <label className="block mb-2 text-xs sm:text-sm font-semibold">Preference Score</label>
                <select
                  value={preferenceScore}
                  onChange={(e) => setPreferenceScore(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs sm:text-sm"
                >
                  <option value="very high">Very High</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="very low">Very Low</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">User preference alignment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Preview */}
      <div className="mt-4 sm:mt-6">
        <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
          FIBO Structured JSON (For Reference & Presets)
        </label>
        <textarea
          className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg font-mono text-xs bg-gray-900 text-green-400 focus:border-purple-500 focus:outline-none"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={14}
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 This JSON is used internally for presets and batch generation. The API receives an optimized text prompt generated from this structure.
        </p>
      </div>
    </div>
  );
}
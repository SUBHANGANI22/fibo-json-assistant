"use client";
import { useState, useEffect } from "react";

interface Props {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  initialPrompt?: string;
}

export default function PromptEditor({ jsonInput, setJsonInput, initialPrompt = "" }: Props) {
  // Core FIBO fields
  const [shortDescription, setShortDescription] = useState(initialPrompt);
  const [styleMedium, setStyleMedium] = useState("photograph");
  const [artisticStyle, setArtisticStyle] = useState("photorealistic");
  const [backgroundSetting, setBackgroundSetting] = useState("natural environment");
  const [context, setContext] = useState("professional photography");
  
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
  
  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Parse FIBO JSON into UI state
  function applyFiboConfig(config: any) {
    if (config && Object.keys(config).length > 0) {
      setShortDescription(config.short_description || initialPrompt);
      setStyleMedium(config.style_medium || "photograph");
      setArtisticStyle(config.artistic_style || "photorealistic");
      setBackgroundSetting(config.background_setting || "natural environment");
      setContext(config.context || "professional photography");
      
      // Aesthetics
      if (config.aesthetics) {
        setAestheticScore(config.aesthetics.aesthetic_score || "high");
        setColorScheme(config.aesthetics.color_scheme || "natural colors");
        setComposition(config.aesthetics.composition || "rule of thirds");
        setMoodAtmosphere(config.aesthetics.mood_atmosphere || "professional");
        setPreferenceScore(config.aesthetics.preference_score || "high");
      }
      
      // Lighting
      if (config.lighting) {
        setLightingConditions(config.lighting.conditions || "natural daylight");
        setLightingDirection(config.lighting.direction || "soft, diffused lighting from multiple sources");
        setShadows(config.lighting.shadows || "soft shadows");
      }
      
      // Photographic Characteristics
      if (config.photographic_characteristics) {
        setCameraAngle(config.photographic_characteristics.camera_angle || "eye-level");
        setDepthOfField(config.photographic_characteristics.depth_of_field || "medium");
        setFocus(config.photographic_characteristics.focus || "sharp focus");
        setLensFocalLength(config.photographic_characteristics.lens_focal_length || "standard lens (50mm)");
      }
    }
  }

  // Generate FIBO-compliant JSON from UI state
  function updateFiboJSON() {
    const fiboJSON: any = {
      short_description: shortDescription || "",
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
      objects: []
    };

    setJsonInput(JSON.stringify(fiboJSON, null, 2));
  }

  // Update JSON whenever any field changes
  useEffect(() => {
    updateFiboJSON();
  }, [
    shortDescription, styleMedium, artisticStyle, backgroundSetting, context,
    aestheticScore, colorScheme, composition, moodAtmosphere, preferenceScore,
    lightingConditions, lightingDirection, shadows,
    cameraAngle, depthOfField, focus, lensFocalLength
  ]);

  // Parse external JSON changes into UI
  useEffect(() => {
    try {
      if (jsonInput.trim()) { 
        const configFromInput = JSON.parse(jsonInput);
        applyFiboConfig(configFromInput);
      }
    } catch (e) {
      console.error("Failed to parse JSON for editor state update:", e);
    }
  }, [jsonInput]); 

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🎛️ FIBO Structured Prompt Builder
      </h2>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong> Configure your image settings below. The structured JSON will be automatically converted into an optimized text prompt for BRIA's FIBO model. All fields are fully customizable with smart defaults.
        </p>
      </div>

      {/* Main Description */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Main Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Style Medium</label>
          <select
            value={styleMedium}
            onChange={(e) => setStyleMedium(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
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
          <label className="block mb-2 font-semibold text-gray-700">Artistic Style</label>
          <select
            value={artisticStyle}
            onChange={(e) => setArtisticStyle(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Background Setting</label>
          <input
            type="text"
            value={backgroundSetting}
            onChange={(e) => setBackgroundSetting(e.target.value)}
            placeholder="e.g., clean white background, urban street, mountain landscape"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Context</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., product photography, lifestyle shot, graphic design asset"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-indigo-600 text-white rounded-lg hover:from-gray-700 hover:to-indigo-700 transition-colors"
        >
          <span>{showAdvanced ? "▼" : "▶"}</span>
          <span>Fine-Tune All FIBO Controls</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Photographic Characteristics */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-purple-600 flex items-center gap-2">
              📷 Camera & Lens
            </h3>
            
            <div>
              <label className="block mb-2 text-sm font-semibold">Camera Angle</label>
              <select
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Lens Focal Length</label>
              <select
                value={lensFocalLength}
                onChange={(e) => setLensFocalLength(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Depth of Field</label>
              <select
                value={depthOfField}
                onChange={(e) => setDepthOfField(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="shallow">Shallow (Blurred Background)</option>
                <option value="medium">Medium</option>
                <option value="deep">Deep (All in Focus)</option>
                <option value="bokeh">Bokeh Effect</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Focus</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
            <h3 className="font-bold text-yellow-600 flex items-center gap-2">
              💡 Lighting
            </h3>
            
            <div>
              <label className="block mb-2 text-sm font-semibold">Conditions</label>
              <select
                value={lightingConditions}
                onChange={(e) => setLightingConditions(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Direction</label>
              <select
                value={lightingDirection}
                onChange={(e) => setLightingDirection(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Shadows</label>
              <select
                value={shadows}
                onChange={(e) => setShadows(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
            <h3 className="font-bold text-pink-600 flex items-center gap-2">
              🎨 Aesthetics
            </h3>
            
            <div>
              <label className="block mb-2 text-sm font-semibold">Color Scheme</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Composition</label>
              <select
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
              <label className="block mb-2 text-sm font-semibold">Mood & Atmosphere</label>
              <select
                value={moodAtmosphere}
                onChange={(e) => setMoodAtmosphere(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
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
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
            <h3 className="font-bold text-green-600 flex items-center gap-2">
              ⭐ Quality Scores
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Aesthetic Score</label>
                <select
                  value={aestheticScore}
                  onChange={(e) => setAestheticScore(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
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
                <label className="block mb-2 text-sm font-semibold">Preference Score</label>
                <select
                  value={preferenceScore}
                  onChange={(e) => setPreferenceScore(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
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
      <div className="mt-6">
        <label className="block mb-2 font-semibold text-gray-700">
          FIBO Structured JSON (For Reference & Presets)
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-xs bg-gray-900 text-green-400 focus:border-purple-500 focus:outline-none"
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
// // ... (existing imports)

// interface Props {
//   jsonInput: string;
//   setJsonInput: (json: string) => void;
//   initialPrompt?: string;
// }

// export default function PromptEditor({ jsonInput, setJsonInput, initialPrompt = "" }: Props) {
//   // ... (existing state definitions)
  
//   // NEW STATE: To track the user's preference for overriding the AI's defaults
//   const [forceAestheticOverride, setForceAestheticOverride] = useState(false);

//   // ... (existing helper functions like applyConfig)

//   // Function to apply a parsed config object to all states
//   function applyConfig(config: any) {
//     // Only update if the config is valid
//     if (config && Object.keys(config).length > 0) {
//       setPrompt(config.prompt || initialPrompt);
//       // ... (existing state updates for camera, lighting, etc.)
      
//       // NEW: Load the override state if present in the loaded JSON
//       setForceAestheticOverride(config.forceAestheticOverride || false); 
//     }
//   }
  
//   // The core function that constructs the JSON object
//   const updateJSON = () => {
//     // Basic JSON validation before updating
//     let isValid = true;
//     try {
//       JSON.parse(jsonInput);
//     } catch {
//       isValid = false;
//     }

//     // Only proceed if the jsonInput is generally valid or if we're generating a new structure
//     // We will now assemble the new configuration object
//     const newConfig = {
//       // 1. Core prompt
//       prompt: prompt.trim(),

//       // 2. Camera settings
//       camera: {
//         angle: cameraAngle,
//         fov: fov,
//         lens: lens,
//       },

//       // 3. Lighting settings
//       lighting: {
//         style: lighting,
//         intensity: intensity,
//         color_temperature: colorTemperature,
//       },

//       // 4. Color settings
//       colors: {
//         palette: palette,
//         saturation: saturation,
//         contrast: contrast,
//       },

//       // 5. Composition settings
//       composition: {
//         style: composition,
//         balance: balance,
//       },

//       // 6. Quality settings
//       quality: {
//         detail_level: detailLevel,
//         sharpness: sharpness,
//       },
      
//       // 7. NEW FIELD: The override flag to tell the API to force the style
//       forceAestheticOverride: forceAestheticOverride,
//     };

//     setJsonInput(JSON.stringify(newConfig, null, 2));
//   };
  

//   // 1. Existing effect: Updates JSON when controls change
//   useEffect(() => {
//     updateJSON();
//   }, [
//     cameraAngle, fov, lens, 
//     lighting, intensity, colorTemperature, 
//     palette, saturation, contrast, 
//     composition, balance, 
//     detailLevel, sharpness, 
//     prompt, 
//     // NEW DEPENDENCY: Trigger JSON update when the override switch changes
//     forceAestheticOverride 
//   ]);

//   // 2. Existing effect: Updates controls when JSON is externally changed (e.g., by Preset Load)
//   useEffect(() => {
//     try {
//       if (jsonInput.trim()) {
//         const configFromInput = JSON.parse(jsonInput);
//         applyConfig(configFromInput);
//       }
//     } catch (e) {
//       console.error("Failed to parse JSON for editor state update:", e);
//     }
//   }, [jsonInput]);


//   return (
//     <div className="space-y-8 p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-inner">
//       <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-4">
//         ✨ Advanced FIBO Controls
//       </h2>

//       {/* NEW CONTROL: Aesthetic Override Switch */}
//       <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg flex items-center justify-between">
//         <div>
//           <label htmlFor="aesthetic-override" className="text-lg font-semibold text-gray-800 block">
//             Aesthetic Force Override
//           </label>
//           <p className="text-sm text-gray-600">
//             **Toggles between realism and stylization.** Check this box if the AI's default colors for a subject (e.g., cool tones for snow) are overriding your explicit **Warm/Golden Hour** settings.
//           </p>
//         </div>
//         <input
//           id="aesthetic-override"
//           type="checkbox"
//           checked={forceAestheticOverride}
//           onChange={(e) => setForceAestheticOverride(e.target.checked)}
//           className="w-6 h-6 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
//         />
//       </div>

//       {/* ... (existing Camera, Lighting, Colors, Composition, Quality sections) ... */}
//       {/* (Make sure to wrap the entire existing JSX structure in the return block) */}

//       {/* ... (JsonViewer component and export button) ... */}
//     </div>
//   );
// }
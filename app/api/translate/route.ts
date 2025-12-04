// import { NextResponse } from "next/server";

// const BRIA_API_KEY = process.env.BRIA_API_KEY;
// //const BRIA_API_BASE = "https://api.bria.ai/v2";
// const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2";

// export async function POST(req: Request) {
//   try {
//     const { prompt, camera, lighting, colors, composition } = await req.json();

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     if (!BRIA_API_KEY) {
//       return NextResponse.json(
//         { error: "BRIA_API_KEY not configured" },
//         { status: 500 }
//       );
//     }

//     console.log("🔄 Translating prompt to structured JSON...");

//     // Option 1: Use Bria's VLM Bridge to translate
//     const structuredPromptResponse = await fetch(
//       `${BRIA_API_BASE}/structured_prompt/generate`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "api-token": BRIA_API_KEY,
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//           sync: true, // Get immediate response
//         }),
//       }
//     );

//     if (!structuredPromptResponse.ok) {
//       console.error("VLM Bridge failed, using manual JSON creation");
      
//       // Fallback: Create structured JSON manually
//       const manualJSON = {
//         prompt: prompt,
//         camera: camera || {
//           angle: "front",
//           fov: 60,
//           lens: "standard"
//         },
//         lighting: lighting || {
//           style: "soft",
//           intensity: "medium",
//           color_temperature: "neutral"
//         },
//         colors: colors || {
//           palette: "warm",
//           saturation: "high",
//           contrast: "medium"
//         },
//         composition: composition || {
//           style: "centered",
//           balance: "symmetrical"
//         },
//         quality: {
//           detail_level: "high",
//           sharpness: "medium"
//         }
//       };

//       return NextResponse.json({
//         json: JSON.stringify(manualJSON, null, 2)
//       });
//     }

//     const structuredData = await structuredPromptResponse.json();
//     console.log("✅ VLM Bridge response:", structuredData);

//     // Extract the structured prompt from response
//     let structuredPrompt = structuredData.result?.structured_prompt || structuredData.structured_prompt;

//     // Merge with custom parameters if provided
//     if (camera || lighting || colors || composition) {
//       if (typeof structuredPrompt === 'string') {
//         structuredPrompt = JSON.parse(structuredPrompt);
//       }
      
//       structuredPrompt = {
//         ...structuredPrompt,
//         ...(camera && { camera: { ...structuredPrompt.camera, ...camera } }),
//         ...(lighting && { lighting: { ...structuredPrompt.lighting, ...lighting } }),
//         ...(colors && { colors: { ...structuredPrompt.colors, ...colors } }),
//         ...(composition && { composition: { ...structuredPrompt.composition, ...composition } }),
//       };
//     }

//     return NextResponse.json({
//       json: JSON.stringify(structuredPrompt, null, 2)
//     });

//   } catch (error: any) {
//     console.error("Translation error:", error);
    
//     return NextResponse.json(
//       { 
//         error: "Translation failed",
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const BRIA_API_KEY = process.env.BRIA_API_KEY;
const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2"; // ✅ CORRECT URL!

export async function POST(req: Request) {
  try {
    const { prompt, camera, lighting, colors, composition } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // For now, just create the JSON manually
    // You can add Bria's VLM bridge later if needed
    const structuredJSON = {
      prompt: prompt,
      camera: camera || {
        angle: "front",
        fov: 60,
        lens: "standard"
      },
      lighting: lighting || {
        style: "soft",
        intensity: "medium",
        color_temperature: "neutral"
      },
      colors: colors || {
        palette: "warm",
        saturation: "high",
        contrast: "medium"
      },
      composition: composition || {
        style: "centered",
        balance: "dynamic"
      },
      quality: {
        detail_level: "high",
        sharpness: "medium"
      }
    };

    return NextResponse.json({
      json: JSON.stringify(structuredJSON, null, 2)
    });

  } catch (error: any) {
    console.error("Translation error:", error);
    
    return NextResponse.json(
      { 
        error: "Translation failed",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
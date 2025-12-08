// import { NextResponse } from "next/server";

// const BRIA_API_KEY = process.env.BRIA_API_KEY;
// const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required in JSON" },
//         { status: 400 }
//       );
//     }

//     if (!BRIA_API_KEY) {
//       return NextResponse.json(
//         { error: "BRIA_API_KEY not configured" },
//         { status: 500 }
//       );
//     }

//     console.log("🎨 Generating with FIBO...");
//     console.log("Structured JSON:", JSON.stringify(body, null, 2));
//         // Step 1: Initiate generation
//     const generateResponse = await fetch(`${BRIA_API_BASE}/image/generate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "api_token": BRIA_API_KEY,
//       },
//       body: JSON.stringify({
//         prompt: body.prompt,
//         sync: false, // Async mode
//       }),
//     });

//     if (!generateResponse.ok) {
//       const errorText = await generateResponse.text();
//       console.error("Bria API Error:", errorText);
//       return NextResponse.json(
//         { 
//           error: "FIBO generation failed",
//           details: errorText 
//         },
//         { status: generateResponse.status }
//       );
//     }

//     const generateData = await generateResponse.json();
//     console.log("Generation started:", generateData);

//     const { request_id, status_url } = generateData;

//     if (!request_id || !status_url) {
//       return NextResponse.json(
//         { error: "No request_id or status_url returned" },
//         { status: 500 }
//       );
//     }

//     // Step 2: Poll for completion
//     let attempts = 0;
//     const maxAttempts = 60;
//     let imageUrl = null;

//     while (attempts < maxAttempts) {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       attempts++;

//       console.log(`⏳ Polling attempt ${attempts}/${maxAttempts}...`);

//       const statusResponse = await fetch(status_url, {
//         headers: {
//           "api_token": BRIA_API_KEY,
//         },
//       });

//       if (!statusResponse.ok) {
//         console.error("Status check failed:", await statusResponse.text());
//         continue;
//       }

//       const statusData = await statusResponse.json();
//       console.log("Full status response:", JSON.stringify(statusData, null, 2)); 

//       // Check if completed
//       if (statusData.status === "COMPLETED") {
//         // Extract image_url from result object
//         imageUrl = statusData.result?.image_url || statusData.result?.urls?.[0] || statusData.image_url;
        
//         if (imageUrl) {
//           console.log("✅ Found image URL:", imageUrl);
//           break;
//         } else {
//           console.error("Status is COMPLETED but no image_url found. Full response:", statusData);
//         }
//       } else if (statusData.status === "ERROR" || statusData.status === "FAILED") {
//         return NextResponse.json(
//           { error: "Image generation failed", details: statusData.error || "Unknown error" },
//           { status: 500 }
//         );
//       }
//     }

//     if (!imageUrl) {
//       return NextResponse.json(
//         { 
//           error: "Could not extract image URL from completed response",
//           details: "Check server logs for full status response"
//         },
//         { status: 500 }
//       );
//     }

//     // Step 3: Fetching the actual image
//     console.log("📥 Fetching image from:", imageUrl);
//     const imageResponse = await fetch(imageUrl);
    
//     if (!imageResponse.ok) {
//       throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
//     }
    
//     const imageBlob = await imageResponse.blob();
//     const buffer = Buffer.from(await imageBlob.arrayBuffer());

//     return new Response(buffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Cache-Control": "no-cache",
//       },
//     });

//   } catch (error: any) {
//     console.error("FIBO generation error:", error);
    
//     return NextResponse.json(
//       { 
//         error: "Image generation failed",
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const BRIA_API_KEY = process.env.BRIA_API_KEY;
const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2";

/**
 * Converts FIBO structured JSON into a detailed, optimized text prompt
 * Similar to the example from BRIA docs
 */
function convertFiboToPrompt(fiboJSON: any): string {
  const parts: string[] = [];

  // Start with artistic style and medium (like "A photorealistic, high-resolution rendering")
  const stylePrefix: string[] = [];
  if (fiboJSON.artistic_style) {
    stylePrefix.push(fiboJSON.artistic_style);
  }
  if (fiboJSON.style_medium) {
    stylePrefix.push(fiboJSON.style_medium);
  }
  
  // Main description
  if (fiboJSON.short_description) {
    if (stylePrefix.length > 0) {
      parts.push(`A ${stylePrefix.join(", ")} of ${fiboJSON.short_description.toLowerCase()}`);
    } else {
      parts.push(fiboJSON.short_description);
    }
  }

  // Add photographic characteristics
  if (fiboJSON.photographic_characteristics) {
    const pc = fiboJSON.photographic_characteristics;
    const photoDetails: string[] = [];
    
    if (pc.camera_angle) photoDetails.push(`${pc.camera_angle}`);
    if (pc.lens_focal_length) photoDetails.push(`${pc.lens_focal_length}`);
    if (pc.depth_of_field) photoDetails.push(`${pc.depth_of_field} depth of field`);
    if (pc.focus) photoDetails.push(`${pc.focus}`);
    
    if (photoDetails.length > 0) {
      parts.push(`Shot with ${photoDetails.join(", ")}`);
    }
  }

  // Add lighting details (very important for image quality)
  if (fiboJSON.lighting) {
    const l = fiboJSON.lighting;
    const lightingDetails: string[] = [];
    
    if (l.conditions) lightingDetails.push(l.conditions);
    if (l.direction) lightingDetails.push(l.direction);
    if (l.shadows) lightingDetails.push(`creating ${l.shadows}`);
    
    if (lightingDetails.length > 0) {
      parts.push(`Lighting: ${lightingDetails.join(", ")}`);
    }
  }

  // Add aesthetic details
  if (fiboJSON.aesthetics) {
    const a = fiboJSON.aesthetics;
    const aestheticDetails: string[] = [];
    
    if (a.composition) aestheticDetails.push(a.composition);
    if (a.color_scheme) aestheticDetails.push(a.color_scheme);
    if (a.mood_atmosphere) aestheticDetails.push(`${a.mood_atmosphere} atmosphere`);
    
    if (aestheticDetails.length > 0) {
      parts.push(`The composition features ${aestheticDetails.join(", ")}`);
    }
    
    // Add quality indicators
    const qualityIndicators: string[] = [];
    if (a.aesthetic_score && a.aesthetic_score !== "medium") {
      qualityIndicators.push(`${a.aesthetic_score} aesthetic quality`);
    }
    if (a.preference_score && a.preference_score !== "medium") {
      qualityIndicators.push(`${a.preference_score} preference alignment`);
    }
    if (qualityIndicators.length > 0) {
      parts.push(`Quality targets: ${qualityIndicators.join(", ")}`);
    }
  }

  // Add background setting
  if (fiboJSON.background_setting) {
    parts.push(`Background: ${fiboJSON.background_setting}`);
  }

  // Add context
  if (fiboJSON.context) {
    parts.push(`Context: ${fiboJSON.context}`);
  }

  // Join all parts with proper punctuation
  const finalPrompt = parts
    .filter(p => p && p.trim().length > 0)
    .join(". ")
    .replace(/\.\./g, ".")
    .replace(/\.\s*\./g, ".")
    .trim();

  return finalPrompt.endsWith(".") ? finalPrompt : finalPrompt + ".";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.short_description && !body.prompt) {
      return NextResponse.json(
        { error: "short_description or prompt is required in JSON" },
        { status: 400 }
      );
    }

    if (!BRIA_API_KEY) {
      return NextResponse.json(
        { error: "BRIA_API_KEY not configured" },
        { status: 500 }
      );
    }

    console.log("\n" + "=".repeat(80));
    console.log("🎨 FIBO IMAGE GENERATION REQUEST");
    console.log("=".repeat(80));

    // Convert FIBO JSON to text prompt
    const textPrompt = convertFiboToPrompt(body);
    
    console.log("\n📋 ORIGINAL FIBO JSON:");
    console.log(JSON.stringify(body, null, 2));
    
    console.log("\n✍️ CONVERTED TEXT PROMPT:");
    console.log(textPrompt);
    console.log("\n📊 Prompt Statistics:");
    console.log(`  - Length: ${textPrompt.length} characters`);
    console.log(`  - Words: ${textPrompt.split(/\s+/).length} words`);
    console.log(`  - Sentences: ${textPrompt.split(/[.!?]+/).filter(s => s.trim()).length} sentences`);
    
    console.log("\n🔧 FIBO Components Used:");
    console.log(`  ✓ Style: ${body.artistic_style} ${body.style_medium}`);
    console.log(`  ✓ Camera: ${body.photographic_characteristics?.camera_angle || 'default'}`);
    console.log(`  ✓ Lens: ${body.photographic_characteristics?.lens_focal_length || 'default'}`);
    console.log(`  ✓ Depth of Field: ${body.photographic_characteristics?.depth_of_field || 'default'}`);
    console.log(`  ✓ Focus: ${body.photographic_characteristics?.focus || 'default'}`);
    console.log(`  ✓ Lighting: ${body.lighting?.conditions || 'default'}`);
    console.log(`  ✓ Light Direction: ${body.lighting?.direction || 'default'}`);
    console.log(`  ✓ Shadows: ${body.lighting?.shadows || 'default'}`);
    console.log(`  ✓ Color Scheme: ${body.aesthetics?.color_scheme || 'default'}`);
    console.log(`  ✓ Composition: ${body.aesthetics?.composition || 'default'}`);
    console.log(`  ✓ Mood: ${body.aesthetics?.mood_atmosphere || 'default'}`);
    console.log(`  ✓ Aesthetic Score: ${body.aesthetics?.aesthetic_score || 'default'}`);
    console.log(`  ✓ Preference Score: ${body.aesthetics?.preference_score || 'default'}`);
    console.log(`  ✓ Background: ${body.background_setting || 'default'}`);
    console.log(`  ✓ Context: ${body.context || 'default'}`);

    console.log("\n🚀 Sending to BRIA API...");
    console.log("=".repeat(80) + "\n");

    // Step 1: Initiate generation
    const generateResponse = await fetch(`${BRIA_API_BASE}/image/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_token": BRIA_API_KEY,
      },
      body: JSON.stringify({
        prompt: textPrompt,
        sync: false, // Async mode
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error("❌ Bria API Error:", errorText);
      return NextResponse.json(
        { 
          error: "FIBO generation failed",
          details: errorText 
        },
        { status: generateResponse.status }
      );
    }

    const generateData = await generateResponse.json();
    console.log("✅ Generation started:", generateData);

    const { request_id, status_url } = generateData;

    if (!request_id || !status_url) {
      return NextResponse.json(
        { error: "No request_id or status_url returned" },
        { status: 500 }
      );
    }

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 60;
    let imageUrl = null;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;

      console.log(`⏳ Polling attempt ${attempts}/${maxAttempts}...`);

      const statusResponse = await fetch(status_url, {
        headers: {
          "api_token": BRIA_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        console.error("❌ Status check failed:", await statusResponse.text());
        continue;
      }

      const statusData = await statusResponse.json();

      // Check if completed
      if (statusData.status === "COMPLETED") {
        imageUrl = statusData.result?.image_url || statusData.result?.urls?.[0] || statusData.image_url;
        
        if (imageUrl) {
          console.log("✅ Image generation completed!");
          console.log("🖼️ Image URL:", imageUrl);
          break;
        } else {
          console.error("⚠️ Status is COMPLETED but no image_url found");
          console.error("Full response:", JSON.stringify(statusData, null, 2));
        }
      } else if (statusData.status === "ERROR" || statusData.status === "FAILED") {
        console.error("❌ Generation failed:", statusData.error || "Unknown error");
        return NextResponse.json(
          { error: "Image generation failed", details: statusData.error || "Unknown error" },
          { status: 500 }
        );
      } else {
        console.log(`   Status: ${statusData.status}`);
      }
    }

    if (!imageUrl) {
      console.error("❌ Image generation timeout after", maxAttempts, "attempts");
      return NextResponse.json(
        { 
          error: "Image generation timeout",
          details: "Could not extract image URL after maximum polling attempts"
        },
        { status: 500 }
      );
    }
  console.log("Structured JSON:", JSON.stringify(body, null, 2));
    // Step 3: Fetch the actual image
    console.log("📥 Fetching image from URL...");
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    console.log("✅ Image successfully retrieved!");
    console.log(`📦 Image size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log("=".repeat(80) + "\n");

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error: any) {
    console.error("\n❌ FIBO GENERATION ERROR:");
    console.error(error);
    console.error("=".repeat(80) + "\n");
    
    return NextResponse.json(
      { 
        error: "Image generation failed",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
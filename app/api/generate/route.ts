import { NextResponse } from "next/server";

const BRIA_API_KEY = process.env.BRIA_API_KEY;
const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required in JSON" },
        { status: 400 }
      );
    }

    if (!BRIA_API_KEY) {
      return NextResponse.json(
        { error: "BRIA_API_KEY not configured" },
        { status: 500 }
      );
    }

    console.log("🎨 Generating with FIBO...");
    console.log("Structured JSON:", JSON.stringify(body, null, 2));
        // Step 1: Initiate generation
    const generateResponse = await fetch(`${BRIA_API_BASE}/image/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_token": BRIA_API_KEY,
      },
      body: JSON.stringify({
        prompt: body.prompt,
        sync: false, // Async mode
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error("Bria API Error:", errorText);
      return NextResponse.json(
        { 
          error: "FIBO generation failed",
          details: errorText 
        },
        { status: generateResponse.status }
      );
    }

    const generateData = await generateResponse.json();
    console.log("Generation started:", generateData);

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
        console.error("Status check failed:", await statusResponse.text());
        continue;
      }

      const statusData = await statusResponse.json();
      console.log("Full status response:", JSON.stringify(statusData, null, 2)); 

      // Check if completed
      if (statusData.status === "COMPLETED") {
        // Extract image_url from result object
        imageUrl = statusData.result?.image_url || statusData.result?.urls?.[0] || statusData.image_url;
        
        if (imageUrl) {
          console.log("✅ Found image URL:", imageUrl);
          break;
        } else {
          console.error("Status is COMPLETED but no image_url found. Full response:", statusData);
        }
      } else if (statusData.status === "ERROR" || statusData.status === "FAILED") {
        return NextResponse.json(
          { error: "Image generation failed", details: statusData.error || "Unknown error" },
          { status: 500 }
        );
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { 
          error: "Could not extract image URL from completed response",
          details: "Check server logs for full status response"
        },
        { status: 500 }
      );
    }

    // Step 3: Fetching the actual image
    console.log("📥 Fetching image from:", imageUrl);
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error: any) {
    console.error("FIBO generation error:", error);
    
    return NextResponse.json(
      { 
        error: "Image generation failed",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
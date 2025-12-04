import { NextResponse } from "next/server";

const BRIA_API_KEY = process.env.BRIA_API_KEY;
const BRIA_API_BASE = "https://engine.prod.bria-api.com/v2";

export async function POST(req: Request) {
  try {
    const { prompt, camera, lighting, colors, composition } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
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
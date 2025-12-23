import { NextResponse } from "next/server";
import { generateFromGemini } from "@/utils/GeminiAIModel";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body || {};
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const text = await generateFromGemini(prompt);
    return NextResponse.json({ text });
  } catch (err) {
    console.error("/api/generate error:", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

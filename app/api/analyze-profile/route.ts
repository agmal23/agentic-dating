import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { instagram, linkedin } = await request.json();

    if (!instagram && !linkedin) {
      return NextResponse.json(
        { error: "Instagram or LinkedIn data is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
    });

    const prompt = `
You are the profile-analysis agent in an agentic dating platform.

You receive publicly available information from a person's Instagram
and LinkedIn profiles.

Your job is to create a structured profile that another dating agent
can use to understand compatibility.

IMPORTANT RULES:
- Use ONLY information present in the supplied data.
- Do not invent facts.
- Do not infer sensitive attributes such as religion, race, sexuality,
  health conditions, political views, or other sensitive characteristics.
- Do not judge attractiveness.
- Do not make assumptions about someone's private life.
- Separate observable interests from uncertain information.
- If information is unavailable, return "Unknown".

Focus on:
- interests
- hobbies
- professional interests
- skills
- lifestyle signals explicitly shown
- personality signals supported by the content
- conversation topics
- possible dating preferences only when explicitly stated
- compatibility factors that another agent could compare

Return ONLY valid JSON using exactly this structure:

{
  "name": "",
  "summary": "",
  "interests": [],
  "hobbies": [],
  "professional_interests": [],
  "skills": [],
  "lifestyle_signals": [],
  "personality_signals": [],
  "conversation_topics": [],
  "dating_preferences": [],
  "compatibility_factors": [],
  "unknowns": []
}

INSTAGRAM DATA:
${JSON.stringify(instagram || {})}

LINKEDIN DATA:
${JSON.stringify(linkedin || {})}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Gemini analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze profile",
      },
      { status: 500 }
    );
  }
}
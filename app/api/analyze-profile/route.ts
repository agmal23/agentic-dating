import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      instagram,
      linkedin,
      instagramUrl,
      linkedinUrl,
    } = await request.json();

    if (!instagram && !linkedin) {
      return NextResponse.json(
        {
          error: "Instagram or LinkedIn data is required",
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
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

IDENTITY VERIFICATION:

Determine whether the Instagram and LinkedIn profiles appear to
belong to the same real person.

Use these signals:

1. If the LinkedIn profile explicitly lists, links to, or mentions
   the supplied Instagram account, treat this as strong evidence
   that both profiles belong to the same person.

2. Compare public non-sensitive information such as:
   - name
   - username
   - profession
   - employer
   - education
   - publicly stated interests
   - profile links

3. Names do NOT need to be identical.

For example:

"Aadam M"
"Aadam"
"Actor Aadam"

may refer to the same person.

4. Do not reject a match simply because one profile contains more
   information than the other.

5. Only set same_person to false when there is meaningful evidence
   that the profiles belong to different people.

6. Do not use sensitive attributes to determine identity.

Original Instagram URL:
${instagramUrl || "Unknown"}

Original LinkedIn URL:
${linkedinUrl || "Unknown"}

If the public profile data contains an explicit connection between
the two accounts and there is no contradictory evidence:

same_person = true
identity_confidence = "high"

If there is supporting but incomplete evidence:

same_person = true
identity_confidence = "medium"

Only set same_person = false when there is clear contradictory
evidence that the profiles belong to different people.

PROFILE ANALYSIS:

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
  "same_person": true,
  "identity_confidence": "high",
  "identity_evidence": [],
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
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { personA, personB } = await request.json();

    if (!personA || !personB) {
      return NextResponse.json(
        { error: "Two person profiles are required" },
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
You are running a simulated dating interaction between two AI agents.

Person A:
${JSON.stringify(personA)}

Person B:
${JSON.stringify(personB)}

Simulate a short first date between their agents.

The agents should:
1. Start a natural conversation.
2. Find genuine shared interests.
3. Respond to each other's interests.
4. Evaluate whether they would continue talking.
5. Produce a compatibility assessment.

Only use information provided in the profiles.
Do not invent facts.
Do not infer sensitive attributes.
Do not judge physical appearance.

Return ONLY valid JSON:

{
  "conversation": [
    {
      "agent": "Person A's Agent",
      "message": ""
    },
    {
      "agent": "Person B's Agent",
      "message": ""
    },
    {
      "agent": "Person A's Agent",
      "message": ""
    },
    {
      "agent": "Person B's Agent",
      "message": ""
    }
  ],
  "result": {
    "compatibility_score": 0,
    "decision": "continue",
    "shared_interests": [],
    "compatibility_reasons": [],
    "potential_challenges": [],
    "summary": ""
  }
}

The compatibility_score must be an integer from 0 to 100.

The decision must be one of:
"continue"
"maybe"
"pass"
`;

    const result = await model.generateContent(prompt);

    const text = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    return NextResponse.json({
      success: true,
      date: data,
    });
  } catch (error: any) {
    console.error("Dating agent error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Dating agents temporarily unavailable",
      },
      { status: 500 }
    );
  }
}
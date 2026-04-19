import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { proposal, dao } = await req.json();

    const prompt = `You are an expert DAO governance analyst. Analyze the following governance proposal.

DAO: ${dao}
Proposal:
${proposal}

Please provide:
1. Executive summary / TL;DR
2. Key arguments for and against
3. Risk assessment
4. Treasury/financial impact analysis
5. Voting recommendation with rationale
6. Potential conflicts of interest
7. Community sentiment analysis

Be objective and thorough. Format clearly with headers.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional DAO governance and voting strategy analyst.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const result = completion.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

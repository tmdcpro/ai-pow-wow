import type { ReviewResult, ConsensusReport } from "./types.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export async function synthesizeConsensus(reviews: ReviewResult[], originalCode: string): Promise<ConsensusReport> {
    const reviewsJson = JSON.stringify(reviews, null, 2);

    const prompt = `
You are the Lead Architect and Moderator of a code review meeting.
You have received reviews from multiple specialized agents.
Your goal is to synthesize these findings into a cohesive "Consensus Report".

Original Code (excerpt):
${originalCode.slice(0, 500)}...

Reviews:
${reviewsJson}

Please provide a JSON output with the following structure:
{
  "summary": "High-level summary of the overall code quality and major themes from the reviews.",
  "refinedPrompt": "A new, optimized prompt that can be fed to a coding agent to fix the issues and improve the code. This should be specific, incorporating the feedback.",
  "actionItems": ["List of specific, actionable steps to take"]
}
`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from LLM for consensus");

    const parsed = JSON.parse(content);
    return {
        summary: parsed.summary || "No summary available.",
        refinedPrompt: parsed.refinedPrompt || "No refined prompt generated.",
        actionItems: parsed.actionItems || [],
    };
}

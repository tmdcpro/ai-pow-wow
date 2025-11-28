import type { Reviewer, ReviewResult, ConsensusReport } from "./types.js";
import { synthesizeConsensus } from "./consensus.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export async function runPeerReview(code: string, filename: string, reviewers: Reviewer[]): Promise<string> {
    console.error(`Starting review for ${filename} with ${reviewers.length} reviewers.`);

    const reviewResults: ReviewResult[] = [];

    // 1. Run individual reviews (in parallel)
    const reviewPromises = reviewers.map(async (reviewer) => {
        try {
            const result = await performReview(code, filename, reviewer);
            return result;
        } catch (e) {
            console.error(`Reviewer ${reviewer.name} failed:`, e);
            return {
                reviewerName: reviewer.name,
                findings: [],
                summary: `Failed to run review: ${e instanceof Error ? e.message : String(e)}`,
            };
        }
    });

    const results = await Promise.all(reviewPromises);
    reviewResults.push(...results);

    // 2. Consensus Meeting
    const consensus = await synthesizeConsensus(reviewResults, code);

    // 3. Format Output
    return formatOutput(reviewResults, consensus);
}

async function performReview(code: string, filename: string, reviewer: Reviewer): Promise<ReviewResult> {
    const prompt = `
You are ${reviewer.name}.
Your focus is: ${reviewer.focus}.
${reviewer.systemPrompt}

Review the following code file: ${filename}

Code:
\`\`\`
${code}
\`\`\`

Provide your review in the following JSON format:
{
  "findings": [
    { "category": "error" | "warning" | "suggestion" | "praise", "message": "...", "line": number, "snippet": "..." }
  ],
  "summary": "..."
}
`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from LLM");

    const parsed = JSON.parse(content);
    return {
        reviewerName: reviewer.name,
        findings: parsed.findings || [],
        summary: parsed.summary || "No summary provided.",
    };
}

function formatOutput(reviews: ReviewResult[], consensus: ConsensusReport): string {
    let output = "# Agentic Peer Review Report\n\n";

    output += "## Individual Reviews\n";
    for (const review of reviews) {
        output += `### ${review.reviewerName}\n`;
        output += `**Summary**: ${review.summary}\n\n`;
        if (review.findings.length > 0) {
            output += "| Category | Line | Message |\n";
            output += "| --- | --- | --- |\n";
            for (const f of review.findings) {
                output += `| ${f.category} | ${f.line || "-"} | ${f.message} |\n`;
            }
        } else {
            output += "*No specific findings.*\n";
        }
        output += "\n";
    }

    output += "---\n\n";
    output += "## Consensus & Next Steps\n";
    output += `${consensus.summary}\n\n`;

    output += "### Refined Prompt / Instructions\n";
    output += "```\n" + consensus.refinedPrompt + "\n```\n\n";

    output += "### Action Items\n";
    for (const item of consensus.actionItems) {
        output += `- ${item}\n`;
    }

    return output;
}

import { z } from "zod";

export const ReviewerSchema = z.object({
    name: z.string(),
    focus: z.string(),
    systemPrompt: z.string(),
    enabled: z.boolean().default(true),
    avatar: z.string().optional(),
    stats: z.object({
        reviewsCompleted: z.number().default(0),
        accuracy: z.number().default(0), // Placeholder for now
        speed: z.number().default(0), // Placeholder
    }).default({ reviewsCompleted: 0, accuracy: 0, speed: 0 }),
    capabilities: z.array(z.string()).default([]),
    teamRole: z.string().optional(), // Sports team position (Captain, Manager, Pitcher, Batter, etc.)
    currentTask: z.string().optional(),
    history: z.array(z.object({
        action: z.string(),
        timestamp: z.number(),
        details: z.string().optional()
    })).default([]),
});

export type Reviewer = z.infer<typeof ReviewerSchema>;

export interface ReviewFinding {
    category: "error" | "warning" | "suggestion" | "praise";
    message: string;
    line?: number;
    snippet?: string;
}

export interface ReviewResult {
    reviewerName: string;
    findings: ReviewFinding[];
    summary: string;
}

export interface ConsensusReport {
    summary: string;
    refinedPrompt: string;
    actionItems: string[];
}

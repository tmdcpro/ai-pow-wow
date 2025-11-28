import { z } from "zod";
export declare const ReviewerSchema: z.ZodObject<{
    name: z.ZodString;
    focus: z.ZodString;
    systemPrompt: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    avatar: z.ZodOptional<z.ZodString>;
    stats: z.ZodDefault<z.ZodObject<{
        reviewsCompleted: z.ZodDefault<z.ZodNumber>;
        accuracy: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    capabilities: z.ZodDefault<z.ZodArray<z.ZodString>>;
    teamRole: z.ZodOptional<z.ZodString>;
    currentTask: z.ZodOptional<z.ZodString>;
    history: z.ZodDefault<z.ZodArray<z.ZodObject<{
        action: z.ZodString;
        timestamp: z.ZodNumber;
        details: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
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
//# sourceMappingURL=types.d.ts.map
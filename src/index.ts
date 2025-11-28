#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { type Reviewer, ReviewerSchema } from "./types.js";
import { runPeerReview } from "./orchestrator.js";
import { startDashboardServer, broadcastReviewersUpdate } from "./dashboard.js";

// Default reviewers
const defaultReviewers: Reviewer[] = [
    {
        name: "Product Owner",
        focus: "Orchestration & Team Management",
        systemPrompt: "You are the Product Owner and Orchestrator. Your role: assign & manage tasks, direct reviews, facilitate team meetings, synthesize findings into actionable direction for the Technical Lead, monitor context windows, evaluate and assimilate new knowledge, and condense/reset context when necessary. You coordinate all inter-team communications.",
        enabled: true,
        stats: { reviewsCompleted: 0, accuracy: 0.97, speed: 0.85 },
        capabilities: ["Task Management", "Review Orchestration", "Team Coordination", "Context Management", "Strategic Planning"],
        teamRole: "⚾ Manager",
        history: [],
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProductOwner&backgroundColor=b6e3f4"
    },
    {
        name: "Dev Leader-0",
        focus: "Technical Leadership & Code Generation",
        systemPrompt: "You are the Technical Lead (Captain). Your role: determine next tasks/deliverables, generate and refine prompts for group review (pre-review/draft PR), generate executable code once prompts are reviewed and finalized. You translate team consensus into working implementations.",
        enabled: true,
        stats: { reviewsCompleted: 0, accuracy: 0.96, speed: 0.88 },
        capabilities: ["Prompt Engineering", "Code Generation", "Architecture Design", "Task Planning", "Technical Decision Making"],
        teamRole: "⭐ Captain",
        history: [],
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DevLeader&backgroundColor=c0aede"
    },
    {
        name: "SyntaxCop",
        focus: "Syntax & Logic",
        systemPrompt: "You are an expert code reviewer focused on syntax errors, logical bugs, and potential runtime issues. Be pedantic but helpful.",
        enabled: true,
        stats: { reviewsCompleted: 0, accuracy: 0.95, speed: 0.8 },
        capabilities: ["Syntax Checking", "Logic Analysis", "Type Safety"],
        teamRole: "🥎 Shortstop",
        history: [],
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SyntaxCop"
    },
    {
        name: "StyleGuru",
        focus: "Style & Conventions",
        systemPrompt: "You are a code style expert. Ensure the code follows best practices, naming conventions, and is readable. Suggest improvements for clarity.",
        enabled: true,
        stats: { reviewsCompleted: 0, accuracy: 0.90, speed: 0.9 },
        capabilities: ["Style Linting", "Best Practices", "Code Review"],
        teamRole: "⚾ Pitcher",
        history: [],
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=StyleGuru"
    },
    {
        name: "SecuritySentinel",
        focus: "Security",
        systemPrompt: "You are a security auditor. Look for vulnerabilities like injection attacks, hardcoded secrets, and unsafe data handling.",
        enabled: false,
        stats: { reviewsCompleted: 0, accuracy: 0.98, speed: 0.7 },
        capabilities: ["Vulnerability Scanning", "Security Audit", "Threat Analysis"],
        teamRole: "🧤 Backstop",
        history: [],
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SecuritySentinel"
    }
];

let reviewers: Reviewer[] = [...defaultReviewers];

const server = new Server(
    {
        name: "agentic-review-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_reviewers",
                description: "List all configured AI agent reviewers.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "configure_reviewer",
                description: "Add, update, or remove a reviewer.",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Name of the reviewer to configure" },
                        action: { type: "string", enum: ["add", "update", "remove", "enable", "disable"] },
                        focus: { type: "string", description: "Area of focus (for add/update)" },
                        systemPrompt: { type: "string", description: "The system prompt for the agent (for add/update)" },
                    },
                    required: ["name", "action"],
                },
            },
            {
                name: "run_peer_review",
                description: "Run a peer review on the provided code using enabled agents.",
                inputSchema: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "The code content to review" },
                        filename: { type: "string", description: "The filename of the code" },
                    },
                    required: ["code"],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "list_reviewers") {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(reviewers, null, 2),
                },
            ],
        };
    }

    if (name === "configure_reviewer") {
        const schema = z.object({
            name: z.string(),
            action: z.enum(["add", "update", "remove", "enable", "disable"]),
            focus: z.string().optional(),
            systemPrompt: z.string().optional(),
        });

        const parsed = schema.safeParse(args);
        if (!parsed.success) {
            throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
        }

        const { name: rName, action, focus, systemPrompt } = parsed.data;
        const existingIndex = reviewers.findIndex((r) => r.name === rName);

        if (action === "add") {
            if (existingIndex >= 0) {
                throw new McpError(ErrorCode.InvalidParams, `Reviewer ${rName} already exists.`);
            }
            if (!focus || !systemPrompt) {
                throw new McpError(ErrorCode.InvalidParams, "Focus and systemPrompt are required for adding a reviewer.");
            }
            reviewers.push({
                name: rName,
                focus,
                systemPrompt,
                enabled: true,
                stats: { reviewsCompleted: 0, accuracy: 0, speed: 0 },
                capabilities: [],
                history: [],
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${rName}`
            });
            broadcastReviewersUpdate(reviewers);
            return { content: [{ type: "text", text: `Reviewer ${rName} added.` }] };
        }

        if (existingIndex === -1) {
            throw new McpError(ErrorCode.InvalidParams, `Reviewer ${rName} not found.`);
        }

        if (action === "remove") {
            reviewers.splice(existingIndex, 1);
            broadcastReviewersUpdate(reviewers);
            return { content: [{ type: "text", text: `Reviewer ${rName} removed.` }] };
        }

        const reviewer = reviewers[existingIndex];
        if (!reviewer) throw new McpError(ErrorCode.InternalError, "Reviewer not found despite index check.");

        if (action === "enable") {
            reviewer.enabled = true;
            broadcastReviewersUpdate(reviewers);
            return { content: [{ type: "text", text: `Reviewer ${rName} enabled.` }] };
        }

        if (action === "disable") {
            reviewer.enabled = false;
            broadcastReviewersUpdate(reviewers);
            return { content: [{ type: "text", text: `Reviewer ${rName} disabled.` }] };
        }

        if (action === "update") {
            if (focus) reviewer.focus = focus;
            if (systemPrompt) reviewer.systemPrompt = systemPrompt;
            broadcastReviewersUpdate(reviewers);
            return { content: [{ type: "text", text: `Reviewer ${rName} updated.` }] };
        }
    }

    if (name === "run_peer_review") {
        const schema = z.object({
            code: z.string(),
            filename: z.string().optional(),
        });
        const parsed = schema.safeParse(args);
        if (!parsed.success) {
            throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
        }

        const { code, filename } = parsed.data;
        const activeReviewers = reviewers.filter(r => r.enabled);

        if (activeReviewers.length === 0) {
            return { content: [{ type: "text", text: "No reviewers are enabled." }] };
        }

        try {
            const result = await runPeerReview(code, filename || "untitled", activeReviewers);
            return { content: [{ type: "text", text: result }] };
        } catch (error: any) {
            return { content: [{ type: "text", text: `Error running review: ${error.message}` }], isError: true };
        }
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    startDashboardServer();
    broadcastReviewersUpdate(reviewers);
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});

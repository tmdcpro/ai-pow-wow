export interface Reviewer {
    name: string;
    focus: string;
    systemPrompt: string;
    enabled: boolean;
    avatar?: string;
    stats: {
        reviewsCompleted: number;
        accuracy: number;
        speed: number;
    };
    capabilities: string[];
    teamRole?: string;
    currentTask?: string;
    history: {
        action: string;
        timestamp: number;
        details?: string;
    }[];
}

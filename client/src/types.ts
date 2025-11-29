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

export interface ProjectTask {
    id: string;
    title: string;
    description: string;
    base: 'pending' | 'first' | 'second' | 'third' | 'home';
    status: 'todo' | 'in-progress' | 'review' | 'done';
    assignedAgents: string[];
    deliverables: Deliverable[];
    tests: TestCriteria[];
    createdAt: number;
    updatedAt: number;
}

export interface Deliverable {
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
    verificationMethod: string;
}

export interface TestCriteria {
    id: string;
    description: string;
    method: 'manual' | 'automated';
    status: 'not-run' | 'passed' | 'failed';
}

export interface ProjectDocument {
    type: 'prd' | 'spec' | 'custom';
    title: string;
    content: string;
    lastUpdated: number;
}


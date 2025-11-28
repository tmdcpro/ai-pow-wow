import { ProjectTask, Deliverable, TestCriteria } from './types.js';

// In-memory task storage (replace with database later)
let tasks: ProjectTask[] = [];
let taskIdCounter = 1;

export function getAllTasks(): ProjectTask[] {
    return tasks;
}

export function getTaskById(id: string): ProjectTask | undefined {
    return tasks.find(t => t.id === id);
}

export function createTask(
    title: string,
    description: string,
    deliverables: Omit<Deliverable, 'id'>[] = [],
    tests: Omit<TestCriteria, 'id'>[] = []
): ProjectTask {
    const task: ProjectTask = {
        id: `task-${taskIdCounter++}`,
        title,
        description,
        base: 'pending',
        status: 'todo',
        assignedAgents: [],
        deliverables: deliverables.map((d, i) => ({ ...d, id: `del-${taskIdCounter}-${i}` })),
        tests: tests.map((t, i) => ({ ...t, id: `test-${taskIdCounter}-${i}` })),
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    tasks.push(task);
    return task;
}

export function updateTask(id: string, updates: Partial<Omit<ProjectTask, 'id'>>): ProjectTask | null {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = tasks[index];
    if (!existing) return null;

    tasks[index] = {
        ...existing,
        ...updates,
        id: existing.id,
        updatedAt: Date.now()
    };

    return tasks[index]!;
}

export function advanceTaskBase(id: string): ProjectTask | null {
    const task = getTaskById(id);
    if (!task) return null;

    const baseProgression: Record<ProjectTask['base'], ProjectTask['base']> = {
        'pending': 'first',
        'first': 'second',
        'second': 'third',
        'third': 'home',
        'home': 'home'
    };

    const statusProgression: Record<ProjectTask['base'], ProjectTask['status']> = {
        'pending': 'todo',
        'first': 'in-progress',
        'second': 'in-progress',
        'third': 'review',
        'home': 'done'
    };

    const newBase = baseProgression[task.base];
    const newStatus = statusProgression[newBase];

    return updateTask(id, {
        base: newBase,
        status: newStatus
    });
}

export function assignAgentToTask(taskId: string, agentName: string): ProjectTask | null {
    const task = getTaskById(taskId);
    if (!task) return null;

    if (!task.assignedAgents.includes(agentName)) {
        return updateTask(taskId, {
            assignedAgents: [...task.assignedAgents, agentName]
        });
    }

    return task;
}

export function removeAgentFromTask(taskId: string, agentName: string): ProjectTask | null {
    const task = getTaskById(taskId);
    if (!task) return null;

    return updateTask(taskId, {
        assignedAgents: task.assignedAgents.filter(a => a !== agentName)
    });
}

export function deleteTask(id: string): boolean {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
}

// Initialize with sample tasks
export function initializeSampleTasks() {
    if (tasks.length === 0) {
        createTask(
            "Setup Baseball Field UI",
            "Create the SVG-based baseball field visualization component",
            [
                { name: "BaseballField component", status: "in-progress", verificationMethod: "Visual inspection" },
                { name: "Task node rendering", status: "pending", verificationMethod: "Click test" }
            ],
            [
                { description: "Field renders correctly", method: "manual", status: "not-run" },
                { description: "Responsive on mobile", method: "manual", status: "not-run" }
            ]
        );

        createTask(
            "Document Management System",
            "Implement PRD/Spec viewer and editor",
            [
                { name: "Document viewer UI", status: "pending", verificationMethod: "View test" },
                { name: "Markdown editor", status: "pending", verificationMethod: "Edit test" }
            ],
            [
                { description: "Can create new documents", method: "manual", status: "not-run" },
                { description: "Changes persist", method: "automated", status: "not-run" }
            ]
        );
    }
}

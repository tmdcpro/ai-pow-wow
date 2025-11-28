import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Reviewer } from "./types.js";
import * as taskManager from "./project.js";
import * as docManager from "./documents.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Agent Arena Dashboard Server" });
});

// Task API endpoints
app.get("/api/tasks", (req, res) => {
    res.json(taskManager.getAllTasks());
});

app.post("/api/tasks", (req, res) => {
    const { title, description, deliverables, tests } = req.body;
    const task = taskManager.createTask(title, description, deliverables, tests);
    io.emit("tasks_update", taskManager.getAllTasks());
    res.json(task);
});

app.put("/api/tasks/:id", (req, res) => {
    const updated = taskManager.updateTask(req.params.id, req.body);
    if (!updated) {
        res.status(404).json({ error: "Task not found" });
    } else {
        io.emit("tasks_update", taskManager.getAllTasks());
        res.json(updated);
    }
});

app.post("/api/tasks/:id/advance", (req, res) => {
    const task = taskManager.advanceTaskBase(req.params.id);
    if (!task) {
        res.status(404).json({ error: "Task not found" });
    } else {
        io.emit("tasks_update", taskManager.getAllTasks());
        io.emit("task_advanced", task);
        res.json(task);
    }
});

app.post("/api/tasks/:id/assign/:agent", (req, res) => {
    const task = taskManager.assignAgentToTask(req.params.id, req.params.agent);
    if (!task) {
        res.status(404).json({ error: "Task not found" });
    } else {
        io.emit("tasks_update", taskManager.getAllTasks());
        res.json(task);
    }
});

app.delete("/api/tasks/:id", (req, res) => {
    const success = taskManager.deleteTask(req.params.id);
    if (!success) {
        res.status(404).json({ error: "Task not found" });
    } else {
        io.emit("tasks_update", taskManager.getAllTasks());
        res.json({ success: true });
    }
});

// Document API endpoints
app.get("/api/documents", async (req, res) => {
    const docs = await docManager.getAllDocuments();
    res.json(docs);
});

app.get("/api/documents/:type", async (req, res) => {
    const type = req.params.type as 'prd' | 'spec' | 'custom';
    let doc = await docManager.loadDocument(type);

    if (!doc) {
        // Create default if doesn't exist
        doc = await docManager.createDefaultDocument(type);
    }

    res.json(doc);
});

app.post("/api/documents/:type", async (req, res) => {
    const type = req.params.type as 'prd' | 'spec' | 'custom';
    const doc = {
        type,
        title: req.body.title,
        content: req.body.content,
        lastUpdated: Date.now()
    };

    await docManager.saveDocument(doc);
    io.emit("document_updated", doc);
    res.json(doc);
});



const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for local dev
        methods: ["GET", "POST"]
    }
});

let currentReviewers: Reviewer[] = [];

io.on("connection", (socket) => {
    console.log("Dashboard client connected");

    // Send initial state
    socket.emit("reviewers_update", currentReviewers);
    socket.emit("tasks_update", taskManager.getAllTasks());

    socket.on("disconnect", () => {
        console.log("Dashboard client disconnected");
    });
});

export function startDashboardServer(port: number = 3000) {
    // Initialize sample tasks
    taskManager.initializeSampleTasks();

    httpServer.listen(port, () => {
        console.log(`Dashboard server running on http://localhost:${port}`);
    });
}

export function broadcastReviewersUpdate(reviewers: Reviewer[]) {
    currentReviewers = reviewers;
    io.emit("reviewers_update", reviewers);
}

export function broadcastAgentAction(agentName: string, action: string, details?: string) {
    io.emit("agent_action", {
        agentName,
        action,
        details,
        timestamp: Date.now()
    });
}

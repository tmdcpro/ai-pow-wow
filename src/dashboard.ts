import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Reviewer } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Agent Arena Dashboard Server" });
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

    socket.on("disconnect", () => {
        console.log("Dashboard client disconnected");
    });
});

export function startDashboardServer(port: number = 3000) {
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

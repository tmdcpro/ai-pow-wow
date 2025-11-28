import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
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
let currentReviewers = [];
io.on("connection", (socket) => {
    console.log("Dashboard client connected");
    // Send initial state
    socket.emit("reviewers_update", currentReviewers);
    socket.on("disconnect", () => {
        console.log("Dashboard client disconnected");
    });
});
export function startDashboardServer(port = 3000) {
    httpServer.listen(port, () => {
        console.log(`Dashboard server running on http://localhost:${port}`);
    });
}
export function broadcastReviewersUpdate(reviewers) {
    currentReviewers = reviewers;
    io.emit("reviewers_update", reviewers);
}
export function broadcastAgentAction(agentName, action, details) {
    io.emit("agent_action", {
        agentName,
        action,
        details,
        timestamp: Date.now()
    });
}
//# sourceMappingURL=dashboard.js.map
# AI Agent Arena ⚾

A collaborative AI code review system with a baseball team-themed interface. Watch your AI agents review code, discuss findings, and synthesize improvements—all visualized as interactive baseball cards!

## Features

### 🎴 Baseball Card Agent Visualization
- **Authentic Design**: Vintage baseball card styling with team positions
- **3D Card Flip**: Click to flip between stats (front) and controls (back)
- **Team Roster**:
  - ⚾ **Manager** - Product Owner/Orchestrator
  - ⭐ **Captain** - Dev Leader (Technical Lead)
  - 🥎 **Shortstop** - SyntaxCop (Syntax & Logic)
  - ⚾ **Pitcher** - StyleGuru (Code Style)
  - 🧤 **Backstop** - SecuritySentinel (Security Audit)

### 🔄 Real-Time Dashboard
- Live WebSocket updates via Socket.IO
- View agent stats, capabilities, and current tasks
- Enable/disable agents on the fly

### 🤖 Multi-Agent Code Review (Coming Soon)
- Individual agent reviews based on specialized roles
- Group discussion simulation
- Consensus synthesis by Team Leader
- Iterative prompt refinement

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express + Socket.IO
- MCP (Model Context Protocol) Server
- OpenAI API (for review orchestration)

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion (animations)
- Socket.IO Client

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Build the backend:**
   ```bash
   npm run build
   ```

3. **Start the backend server:**
   ```bash
   node dist/index.js
   ```
   Backend runs on `http://localhost:3000`

4. **Start the frontend dev server:**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Open the dashboard:**
   Navigate to `http://localhost:5173` in your browser

## Project Structure

```
ai-pow-wow/
├── src/                    # Backend TypeScript source
│   ├── index.ts           # MCP server entry point
│   ├── dashboard.ts       # Dashboard WebSocket server
│   ├── types.ts           # Shared type definitions
│   └── orchestrator.ts    # Review orchestration logic
├── client/                # Frontend React app
│   ├── src/
│   │   ├── App.tsx       # Main dashboard
│   │   ├── components/   # React components
│   │   │   └── AgentCard.tsx  # Baseball card component
│   │   └── hooks/        # Custom React hooks
│   └── package.json
├── dist/                  # Compiled backend (gitignored)
└── package.json          # Backend dependencies
```

## Usage

### Viewing Agent Cards
- Cards display on the main dashboard
- **Hover** over a card to reveal the flip button
- **Click** the flip icon to see card back with controls

### Managing Agents
Use the MCP client tools:

```typescript
// Enable/disable an agent
await client.callTool("configure_reviewer", {
    name: "SecuritySentinel",
    action: "enable"  // or "disable"
});

// Add a new agent
await client.callTool("configure_reviewer", {
    name: "PerformanceOptimizer",
    action: "add",
    focus: "Performance & Optimization",
    systemPrompt: "You are a performance expert..."
});
```

## Roadmap

- [x] Baseball card UI with flip animation
- [x] Real-time agent management
- [x] WebSocket dashboard
- [ ] AI-powered review orchestration
- [ ] Group discussion simulation
- [ ] Prompt refinement workflow
- [ ] Review history & analytics

## License

ISC

## Contributing

Contributions welcome! Please open an issue or PR.

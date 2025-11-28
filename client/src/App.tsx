import { useSocket } from './hooks/useSocket';
import { AgentCard } from './components/AgentCard';
import { Terminal, Users } from 'lucide-react';

function App() {
  const { reviewers, isConnected } = useSocket();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
              <Users className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Agent Arena
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-slate-400">
                {isConnected ? 'System Online' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Active Agents</h2>
          <p className="text-slate-400">Manage and monitor your AI review team in real-time.</p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {reviewers.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>

        {/* Empty State */}
        {reviewers.length === 0 && isConnected && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-slate-900 mb-4">
              <Terminal size={32} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300">No Agents Found</h3>
            <p className="text-slate-500 mt-2">Configure agents via the MCP server to see them here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

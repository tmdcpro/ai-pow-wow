import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { AgentCard } from './components/AgentCard';
import { BaseballField } from './components/BaseballField';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DocumentViewer } from './components/DocumentViewer';
import { Terminal, Users, FileText, Hexagon } from 'lucide-react';
import type { ProjectTask } from './types';

function App() {
  const { reviewers, tasks, isConnected } = useSocket();
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleAdvanceTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3000/api/tasks/${taskId}/advance`, {
        method: 'POST'
      });
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to advance task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="text-blue-400" size={32} />
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Agent Arena</h1>
              <p className="text-xs text-slate-400">Baseball Field Project Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowDocuments(!showDocuments)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${showDocuments
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <FileText size={18} />
              Documents
            </button>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-slate-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Agent Cards Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-blue-400" size={28} />
            <h2 className="text-3xl font-black text-white">Team Roster</h2>
            <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-bold">
              {reviewers.length} Agents
            </span>
          </div>

          {reviewers.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl">
              <Terminal className="mx-auto text-slate-600 mb-4" size={48} />
              <p className="text-slate-500 text-lg">No agents available. Waiting for connection...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {reviewers.map((agent) => (
                <AgentCard key={agent.name} agent={agent} />
              ))}
            </div>
          )}
        </section>

        {/* Documents Section (Conditional) */}
        {showDocuments && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-indigo-400" size={28} />
              <h2 className="text-3xl font-black text-white">Project Documents</h2>
            </div>
            <DocumentViewer />
          </section>
        )}

        {/* Baseball Field Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="text-green-400" size={28} />
            <h2 className="text-3xl font-black text-white">Baseball Field - Task Progress</h2>
            <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-bold">
              {tasks.length} Tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <Hexagon className="mx-auto text-slate-600 mb-4" size={48} />
              <p className="text-slate-500 text-lg">No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            <BaseballField
              tasks={tasks}
              onTaskClick={setSelectedTask}
            />
          )}

          {/* Tasks List */}
          {tasks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Task List</h3>
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{task.title}</h4>
                        <p className="text-slate-400 text-sm">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'done' ? 'bg-green-600/30 text-green-300' :
                          task.status === 'review' ? 'bg-yellow-600/30 text-yellow-300' :
                            task.status === 'in-progress' ? 'bg-blue-600/30 text-blue-300' :
                              'bg-gray-600/30 text-gray-300'
                          }`}>
                          {task.status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold">
                          {task.base.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onAdvance={handleAdvanceTask}
      />
    </div>
  );
}

export default App;

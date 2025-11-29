import React from 'react';
import type { ProjectTask } from '../types';
import { X, CheckCircle, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailModalProps {
    task: ProjectTask | null;
    onClose: () => void;
    onAdvance: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onAdvance }) => {
    if (!task) return null;

    const statusColors = {
        'todo': 'bg-gray-500',
        'in-progress': 'bg-blue-500',
        'review': 'bg-yellow-500',
        'done': 'bg-green-500'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-blue-500/30"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-600 p-6 border-b border-blue-500/50">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-white mb-2">{task.title}</h2>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[task.status]}`}>
                                        {task.status.toUpperCase()}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white">
                                        {task.base.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="text-white" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Description</h3>
                            <p className="text-slate-200">{task.description}</p>
                        </div>

                        {/* Assigned Agents */}
                        {task.assignedAgents.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Assigned Agents</h3>
                                <div className="flex flex-wrap gap-2">
                                    {task.assignedAgents.map(agent => (
                                        <span key={agent} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm border border-purple-500/30">
                                            {agent}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deliverables */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Deliverables ({task.deliverables.length})</h3>
                            <div className="space-y-2">
                                {task.deliverables.map(deliverable => (
                                    <div key={deliverable.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                        {deliverable.status === 'completed' ? (
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                                        ) : deliverable.status === 'in-progress' ? (
                                            <Clock className="text-blue-500 flex-shrink-0" size={20} />
                                        ) : (
                                            <Circle className="text-gray-500 flex-shrink-0" size={20} />
                                        )}
                                        <div className="flex-1">
                                            <div className="text-white font-medium">{deliverable.name}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                Verification: {deliverable.verificationMethod}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tests */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Test Criteria ({task.tests.length})</h3>
                            <div className="space-y-2">
                                {task.tests.map(test => (
                                    <div key={test.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                        {test.status === 'passed' ? (
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                                        ) : test.status === 'failed' ? (
                                            <X className="text-red-500 flex-shrink-0" size={20} />
                                        ) : (
                                            <Circle className="text-gray-500 flex-shrink-0" size={20} />
                                        )}
                                        <div className="flex-1">
                                            <div className="text-white">{test.description}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                Method: {test.method} | Status: {test.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        {task.base !== 'home' && (
                            <button
                                onClick={() => onAdvance(task.id)}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-black py-4 rounded-lg border-2 border-yellow-500 shadow-lg hover:from-green-700 hover:to-green-800 transition-all"
                            >
                                ⚾ ADVANCE TO NEXT BASE
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

import React from 'react';
import type { ProjectTask } from '../types';
import { motion } from 'framer-motion';

interface BaseballFieldProps {
    tasks: ProjectTask[];
    onTaskClick: (task: ProjectTask) => void;
}

// Base positions on the field (x, y coordinates)
const BASE_POSITIONS = {
    home: { x: 400, y: 520, label: 'Home' },
    first: { x: 520, y: 400, label: '1st Base' },
    second: { x: 400, y: 280, label: '2nd Base' },
    third: { x: 280, y: 400, label: '3rd Base' },
    pending: { x: 200, y: 580, label: 'On Deck' }
};

export const BaseballField: React.FC<BaseballFieldProps> = ({ tasks, onTaskClick }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-green-800 to-green-900 rounded-xl shadow-2xl border-4 border-yellow-700">
            <svg
                viewBox="0 0 800 700"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Grass Field Background */}
                <rect x="0" y="0" width="800" height="700" fill="#2d5016" />

                {/* Outfield Grass Pattern */}
                <circle cx="400" cy="520" r="350" fill="#3a6b1f" opacity="0.3" />

                {/* Infield Dirt Diamond */}
                <path
                    d="M 400 520 L 520 400 L 400 280 L 280 400 Z"
                    fill="#c19a6b"
                    stroke="#8b6f47"
                    strokeWidth="3"
                />

                {/* Pitcher's Mound */}
                <circle cx="400" cy="400" r="35" fill="#b88a5c" stroke="#8b6f47" strokeWidth="2" />
                <circle cx="400" cy="400" r="8" fill="#8b6f47" />
                <text x="400" y="405" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">
                    PITCHER
                </text>

                {/* Foul Lines */}
                <line x1="400" y1="520" x2="100" y2="220" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
                <line x1="400" y1="520" x2="700" y2="220" stroke="#ffffff" strokeWidth="3" opacity="0.6" />

                {/* Bases */}
                {Object.entries(BASE_POSITIONS).map(([base, pos]) => (
                    <g key={base}>
                        {/* Base Marker */}
                        <rect
                            x={pos.x - 20}
                            y={pos.y - 20}
                            width="40"
                            height="40"
                            fill={base === 'home' ? '#ffffff' : '#f0f0f0'}
                            stroke="#333"
                            strokeWidth="2"
                            transform={base === 'home' ? `rotate(45 ${pos.x} ${pos.y})` : ''}
                            rx={base === 'pending' ? '8' : '0'}
                        />
                        {/* Base Label */}
                        <text
                            x={pos.x}
                            y={pos.y + 40}
                            textAnchor="middle"
                            fontSize="14"
                            fill="#fff"
                            fontWeight="bold"
                            className="drop-shadow-lg"
                        >
                            {pos.label}
                        </text>
                    </g>
                ))}

                {/* Task Nodes on Bases */}
                {tasks.map((task, index) => {
                    const position = BASE_POSITIONS[task.base];
                    const statusColor = {
                        'todo': '#94a3b8',
                        'in-progress': '#3b82f6',
                        'review': '#eab308',
                        'done': '#22c55e'
                    }[task.status];

                    return (
                        <g key={task.id}>
                            {/* Task Circle */}
                            <motion.circle
                                cx={position.x}
                                cy={position.y - 50 - (index * 25)}
                                r="18"
                                fill={statusColor}
                                stroke="#fff"
                                strokeWidth="3"
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onTaskClick(task)}
                                whileHover={{ scale: 1.2 }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            />
                            {/* Task Number */}
                            <text
                                x={position.x}
                                y={position.y - 45 - (index * 25)}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#fff"
                                fontWeight="bold"
                                pointerEvents="none"
                            >
                                {index + 1}
                            </text>
                        </g>
                    );
                })}

                {/* Scoreboard */}
                <g transform="translate(600, 50)">
                    <rect x="0" y="0" width="180" height="120" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="3" rx="8" />
                    <text x="90" y="25" textAnchor="middle" fontSize="16" fill="#fbbf24" fontWeight="bold">
                        SCOREBOARD
                    </text>
                    <text x="10" y="50" fontSize="12" fill="#fff">
                        Tasks: {tasks.length}
                    </text>
                    <text x="10" y="70" fontSize="12" fill="#22c55e">
                        ✓ Done: {tasks.filter(t => t.status === 'done').length}
                    </text>
                    <text x="10" y="90" fontSize="12" fill="#3b82f6">
                        ⚡ Active: {tasks.filter(t => t.status === 'in-progress').length}
                    </text>
                    <text x="10" y="110" fontSize="12" fill="#eab308">
                        📋 Review: {tasks.filter(t => t.status === 'review').length}
                    </text>
                </g>

                {/* Legend */}
                <g transform="translate(20, 580)">
                    <text x="0" y="0" fontSize="14" fill="#fff" fontWeight="bold">Legend:</text>
                    <circle cx="10" cy="20" r="6" fill="#94a3b8" />
                    <text x="20" y="25" fontSize="11" fill="#fff">To Do</text>

                    <circle cx="70" cy="20" r="6" fill="#3b82f6" />
                    <text x="80" y="25" fontSize="11" fill="#fff">In Progress</text>

                    <circle cx="160" cy="20" r="6" fill="#eab308" />
                    <text x="170" y="25" fontSize="11" fill="#fff">Review</text>

                    <circle cx="230" cy="20" r="6" fill="#22c55e" />
                    <text x="240" y="25" fontSize="11" fill="#fff">Done</text>
                </g>
            </svg>
        </div>
    );
};

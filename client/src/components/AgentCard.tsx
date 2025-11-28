import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, FlipHorizontal2 } from 'lucide-react';
import type { Reviewer } from '../types';
import clsx from 'clsx';

interface AgentCardProps {
    agent: Reviewer;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative w-80 h-[500px] perspective-1000">
            {/* Flip Button - Appears on Hover */}
            <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute -top-3 -right-3 z-50 p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
                style={{ transition: 'opacity 0.2s' }}
            >
                <FlipHorizontal2 size={20} className="text-white" />
            </button>

            {/* Card Container with Flip Animation */}
            <motion.div
                className="relative w-full h-full group"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT SIDE */}
                <div
                    className={clsx(
                        "absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl",
                        "bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4",
                        agent.enabled ? "border-red-700" : "border-gray-600"
                    )}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Baseball Card Header Banner */}
                    <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-2 border-b-4 border-yellow-600">
                        <h3 className="text-center text-2xl font-black text-white tracking-widest" style={{ fontFamily: 'Impact, sans-serif' }}>
                            {agent.name.toUpperCase()}
                        </h3>
                    </div>

                    {/* Team Role Badge */}
                    <div className="flex justify-center -mt-1">
                        <div className="bg-blue-800 px-4 py-1 rounded-b-lg border-2 border-yellow-500">
                            <span className="text-sm font-bold text-yellow-300">{agent.teamRole || 'PLAYER'}</span>
                        </div>
                    </div>

                    {/* Photo Section */}
                    <div className="p-4 flex justify-center">
                        <div className={clsx(
                            "w-48 h-48 rounded-lg border-4 overflow-hidden bg-white shadow-lg",
                            agent.enabled ? "border-blue-700" : "border-gray-600"
                        )}>
                            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Stats Section - Baseball Card Style */}
                    <div className="px-4 pb-4 space-y-2">
                        <div className="bg-white border-2 border-red-700 rounded-lg p-3">
                            <div className="text-center mb-2">
                                <div className="text-xs font-bold text-red-700 uppercase tracking-wide">{agent.focus}</div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="border-r border-gray-300">
                                    <div className="text-xs text-gray-600 font-semibold">REVIEWS</div>
                                    <div className="text-xl font-black text-gray-900">{agent.stats.reviewsCompleted}</div>
                                </div>
                                <div className="border-r border-gray-300">
                                    <div className="text-xs text-gray-600 font-semibold">ACC</div>
                                    <div className="text-xl font-black text-green-700">.{Math.round(agent.stats.accuracy * 1000)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600 font-semibold">SPD</div>
                                    <div className="text-xl font-black text-blue-700">{agent.stats.speed.toFixed(1)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Capabilities - Baseball Card Style */}
                        <div className="bg-white border-2 border-blue-700 rounded-lg p-2">
                            <div className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                <Zap size={10} /> Skills
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {agent.capabilities.slice(0, 4).map((cap) => (
                                    <span key={cap} className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-semibold">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 text-xs bg-white/50 rounded p-2">
                            <div className={clsx(
                                "w-2 h-2 rounded-full",
                                agent.enabled ? "bg-green-500 animate-pulse" : "bg-red-500"
                            )} />
                            <span className="text-gray-700 font-medium truncate">
                                {agent.currentTask || "Ready"}
                            </span>
                        </div>
                    </div>

                    {/* Vintage Baseball Card Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-t-4 border-yellow-600" />
                </div>

                {/* BACK SIDE */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-blue-700"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* Back Header */}
                    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 p-2 border-b-4 border-yellow-600">
                        <h3 className="text-center text-xl font-black text-white tracking-widest" style={{ fontFamily: 'Impact, sans-serif' }}>
                            AGENT DETAILS
                        </h3>
                    </div>

                    {/* Back Content */}
                    <div className="p-4 space-y-3 h-[calc(100%-3rem)]">
                        {/* Current Prompt Section */}
                        <div className="bg-white border-2 border-blue-700 rounded-lg p-3 flex-1">
                            <div className="text-xs font-bold text-blue-700 uppercase mb-2">Current Prompt</div>
                            <textarea
                                className="w-full h-32 text-xs p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter prompt for review..."
                                defaultValue="// Current prompt will be displayed here"
                            />
                        </div>

                        {/* Assignment Controls */}
                        <div className="bg-white border-2 border-green-700 rounded-lg p-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-2 border-green-700 text-green-600 focus:ring-green-500"
                                    defaultChecked={agent.enabled}
                                />
                                <span className="text-sm font-bold text-green-700">ASSIGN TO TASK</span>
                            </label>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-black py-3 rounded-lg border-2 border-yellow-600 shadow-lg hover:from-red-700 hover:to-red-800 transition-all">
                            REQUEST REVIEW
                        </button>

                        {/* Bio/System Prompt Preview */}
                        <div className="bg-white/50 border border-gray-400 rounded p-2">
                            <div className="text-xs font-semibold text-gray-700 mb-1">Role:</div>
                            <div className="text-xs text-gray-600 line-clamp-3">
                                {agent.systemPrompt}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

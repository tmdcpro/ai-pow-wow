import React, { useState, useEffect } from 'react';
import type { ProjectDocument } from '../types';
import { FileText, Save, AlertCircle } from 'lucide-react';

export const DocumentViewer: React.FC = () => {
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [activeTab, setActiveTab] = useState<'prd' | 'spec' | 'custom'>('prd');
    const [editingContent, setEditingContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadDocument(activeTab);
    }, [activeTab]);

    const loadDocument = async (type: 'prd' | 'spec' | 'custom') => {
        try {
            const response = await fetch(`http://localhost:3000/api/documents/${type}`);
            const doc: ProjectDocument = await response.json();
            setEditingContent(doc.content);

            // Update documents state
            setDocuments(prev => {
                const filtered = prev.filter(d => d.type !== type);
                return [...filtered, doc];
            });
        } catch (error) {
            console.error('Failed to load document:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const currentDoc = documents.find(d => d.type === activeTab);
            const response = await fetch(`http://localhost:3000/api/documents/${activeTab}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: currentDoc?.title || 'Document',
                    content: editingContent
                })
            });

            if (response.ok) {
                await loadDocument(activeTab);
            }
        } catch (error) {
            console.error('Failed to save document:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs: Array<{ key: 'prd' | 'spec' | 'custom'; label: string; icon: string }> = [
        { key: 'prd', label: 'PRD', icon: '📄' },
        { key: 'spec', label: 'Tech Spec', icon: '📋' },
        { key: 'custom', label: 'Custom', icon: '📝' }
    ];

    return (
        <div className="bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden shadow-xl">
            {/* Header with Tabs */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-4 border-b border-indigo-500/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="text-white" size={24} />
                        <h3 className="text-xl font-black text-white">Project Documents</h3>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>

                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${activeTab === tab.key
                                ? 'bg-slate-900 text-white border-t-2 border-x-2 border-indigo-400'
                                : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="p-6">
                <div className="mb-4 flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-blue-200">
                        This document supports <strong>Markdown</strong> formatting. Changes auto-save to <code className="px-1 bg-blue-900/50 rounded">docs/{activeTab.toUpperCase()}.md</code>
                    </p>
                </div>

                <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full h-96 bg-slate-800 text-slate-100 p-4 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none font-mono text-sm resize-none"
                    placeholder="Start writing your document..."
                />

                <div className="mt-4 text-xs text-slate-400">
                    Last updated: {documents.find(d => d.type === activeTab)
                        ? new Date(documents.find(d => d.type === activeTab)!.lastUpdated).toLocaleString()
                        : 'Never'}
                </div>
            </div>
        </div>
    );
};

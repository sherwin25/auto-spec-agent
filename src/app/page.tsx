'use client';

import { useState } from 'react';
import { generateSpecAction } from '@/app/actions/generate';
import { Loader2, Database, BookOpen, GitGraph } from 'lucide-react';
import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

type SpecData = {
  dbSchema: string;
  userStories: string[];
  mermaidDiagram: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState<SpecData | null>(null);
  const [activeTab, setActiveTab] = useState<'schema' | 'stories' | 'diagram'>('schema');
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  useEffect(() => {
    if (activeTab === 'diagram' && spec?.mermaidDiagram && mermaidRef.current) {
        mermaidRef.current.innerHTML = spec.mermaidDiagram;
        mermaidRef.current.removeAttribute('data-processed');
        mermaid.contentLoaded();
    }
  }, [activeTab, spec]);


  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setSpec(null);
    try {
      const result = await generateSpecAction(prompt);
      if (result.success && result.data) {
        setSpec(result.data);
      } else {
        alert(result.error || 'Failed to generate');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-10 px-4">
      <div className="max-w-5xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Auto-Spec Agent
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Describe your feature idea, and I&apos;ll generate the database schema, user stories, and architecture diagrams instantly.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">What are you building?</label>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A ticket booking system for concerts with seat selection..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 min-w-[140px] justify-center"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate'}
                </button>
            </div>
        </section>

        {/* Results Section */}
        {spec && (
            <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[500px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    <button
                        onClick={() => setActiveTab('schema')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'schema' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Database className="w-4 h-4" /> Database Schema
                    </button>
                    <button
                        onClick={() => setActiveTab('stories')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'stories' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BookOpen className="w-4 h-4" /> User Stories
                    </button>
                    <button
                        onClick={() => setActiveTab('diagram')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'diagram' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <GitGraph className="w-4 h-4" /> ER Diagram
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 bg-slate-50 overflow-auto">
                    {activeTab === 'schema' && (
                        <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner">
                            <code>{spec.dbSchema}</code>
                        </pre>
                    )}

                    {activeTab === 'stories' && (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {spec.userStories.map((story, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-700 leading-relaxed">{story}</p>
                                </div>
                            ))}
                        </div>
                    )}

                     {activeTab === 'diagram' && (
                        <div className="flex items-center justify-center h-full min-h-[400px] bg-white rounded-xl border border-slate-200 p-4">
                             <div className="mermaid" ref={mermaidRef}>
                                 {spec.mermaidDiagram}
                             </div>
                        </div>
                    )}
                </div>
            </section>
        )}
      </div>
    </main>
  );
}

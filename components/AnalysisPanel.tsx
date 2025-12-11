import React, { useState } from 'react';
import { Sparkles, Loader2, Brain, AlertTriangle } from 'lucide-react';
import { SimulationState } from '../types';
import { analyzeWithGemini } from '../services/geminiService';

interface Props {
  simState: SimulationState;
}

export default function AnalysisPanel({ simState }: Props) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWithGemini(simState);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Brain className="text-white" size={20} />
        </div>
        <h2 className="text-lg font-bold">Dialectical Analysis</h2>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Use Gemini 2.5 Flash to interpret the contradiction between the object's material properties and the social context.
      </p>

      {!analysis && !loading && (
        <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30">
          <button
            onClick={handleAnalyze}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
            Analyze Current Scenario
          </button>
          <p className="mt-4 text-xs text-slate-500 text-center">
            Requires configured Gemini API Key
          </p>
        </div>
      )}

      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-300 animate-pulse">Consulting the Dialectical Engine...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="flex-grow bg-slate-900 rounded-xl p-5 border border-slate-700 overflow-y-auto max-h-[400px]">
           <div className="prose prose-invert prose-sm">
             <div className="whitespace-pre-wrap font-light leading-relaxed text-slate-300">
               {analysis}
             </div>
           </div>
           <div className="mt-4 flex justify-end">
             <button 
                onClick={() => setAnalysis(null)}
                className="text-xs text-slate-500 hover:text-white underline"
             >
                Clear Analysis
             </button>
           </div>
        </div>
      )}

      {error && (
         <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200">
            <AlertTriangle size={18} />
            <span className="text-sm">{error}</span>
         </div>
      )}
    </div>
  );
}
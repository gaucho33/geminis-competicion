import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BrainCircuit, Activity, Bot } from 'lucide-react';
import SimulationControl from './components/SimulationControl';
import PraxisVisualizer from './components/PraxisVisualizer';
import TrainingMonitor from './components/TrainingMonitor';
import AnalysisPanel from './components/AnalysisPanel';
import { DPTNModel } from './services/dptnModel';
import { SimulationState } from './types';

// Initialize the model instance
const dptnModel = new DPTNModel();

export default function App() {
  const [activeTab, setActiveTab] = useState<'inference' | 'training'>('inference');
  
  // State for the simulation
  const [simState, setSimState] = useState<SimulationState>({
    content: {
      fragility: 0.5,
      weight: 0.5,
      size: 0.5
    },
    context: {
      humanProximity: 0.2,
      noiseLevel: 0.3,
      urgency: 0.5
    },
    praxis: {
      speed: 0,
      gripForce: 0,
      precision: 0
    },
    vectors: {
      vContextual: [],
      rawOutput: []
    }
  });

  // Run inference whenever inputs change
  useEffect(() => {
    const result = dptnModel.forward(simState.content, simState.context);
    setSimState(prev => ({
      ...prev,
      praxis: result.praxis,
      vectors: {
        vContextual: result.vContextual,
        rawOutput: result.rawOutput
      }
    }));
  }, [simState.content, simState.context]);

  const updateContent = (key: keyof typeof simState.content, value: number) => {
    setSimState(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const updateContext = (key: keyof typeof simState.context, value: number) => {
    setSimState(prev => ({
      ...prev,
      context: { ...prev.context, [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
      <header className="mb-8 border-b border-slate-700 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              Robot DPTN Visualizer
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Dialectical Praxi-Transformer Network: Simulating robotic decision making through the contradiction of Material Content and Social Context.
            </p>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('inference')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'inference' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BrainCircuit size={18} />
              Inference
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'training' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Activity size={18} />
              Training Monitor
            </button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'inference' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-3 space-y-6">
              <SimulationControl 
                title="Content (Object)"
                description="Material characteristics of the target."
                values={simState.content}
                onChange={updateContent}
                color="cyan"
              />
              <SimulationControl 
                title="Context (Social)"
                description="Environmental and social constraints."
                values={simState.context}
                onChange={updateContext}
                color="indigo"
              />
            </div>

            {/* Middle Column: Visualizer */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <PraxisVisualizer praxis={simState.praxis} />
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-slate-300">Vector Internals</h3>
                <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                       <span>V_contextual (Dialectical Modulation)</span>
                       <span className="font-mono">{simState.vectors.vContextual[0]?.toFixed(4)}...</span>
                     </div>
                     <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                       {simState.vectors.vContextual.slice(0, 5).map((v, i) => (
                         <div key={i} style={{ width: '20%', opacity: Math.abs(v) }} className={`h-full ${v > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                       ))}
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                       <span>Dense Layer Activation</span>
                       <span className="font-mono">{simState.vectors.rawOutput[0]?.toFixed(4)}...</span>
                     </div>
                     <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                       {simState.vectors.rawOutput.slice(0, 5).map((v, i) => (
                         <div key={i} style={{ width: '20%', opacity: Math.abs(v) }} className={`h-full ${v > 0 ? 'bg-cyan-500' : 'bg-amber-500'}`} />
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Analysis */}
            <div className="lg:col-span-4">
              <AnalysisPanel simState={simState} />
            </div>
          </div>
        ) : (
          <TrainingMonitor />
        )}
      </main>
    </div>
  );
}
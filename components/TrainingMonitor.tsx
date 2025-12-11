import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrainingMetric } from '../types';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function TrainingMonitor() {
  const [data, setData] = useState<TrainingMetric[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const animationRef = useRef<number>(0);

  const startTraining = () => {
    setIsTraining(true);
    if (epoch >= 30) {
      setData([]);
      setEpoch(0);
    }
  };

  const resetTraining = () => {
    setIsTraining(false);
    setData([]);
    setEpoch(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    if (!isTraining) return;

    const simulateStep = () => {
      setEpoch((prev) => {
        if (prev >= 30) {
          setIsTraining(false);
          return prev;
        }

        const newEpoch = prev + 1;
        
        // Simulate Loss Curves based on the python logic
        // Total Loss = MSE + lambda * (1 - cosine)
        // MSE drops faster typically
        // Dialectic Loss starts high and drops as structure is learned
        
        const decay = Math.exp(-newEpoch * 0.15);
        const noise = (Math.random() - 0.5) * 0.05;
        
        const materialLoss = 0.8 * decay + Math.abs(noise);
        const dialecticalLoss = 0.5 * Math.exp(-newEpoch * 0.1) + Math.abs(noise) * 0.5;
        const totalLoss = materialLoss + 0.8 * dialecticalLoss;

        setData(curr => [...curr, {
          epoch: newEpoch,
          totalLoss: parseFloat(totalLoss.toFixed(4)),
          materialLoss: parseFloat(materialLoss.toFixed(4)),
          dialecticalLoss: parseFloat(dialecticalLoss.toFixed(4))
        }]);

        return newEpoch;
      });
    };

    const interval = setInterval(simulateStep, 400); // Update every 400ms
    return () => clearInterval(interval);
  }, [isTraining]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
             <h2 className="text-2xl font-bold text-white">Training Monitor</h2>
             <p className="text-slate-400">Real-time tracking of Material (MSE) vs Dialectical (Structural) Loss.</p>
          </div>
          <div className="flex gap-3">
             {!isTraining && epoch < 30 ? (
                <button onClick={startTraining} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  <Play size={18} /> Start Training
                </button>
             ) : !isTraining && epoch >= 30 ? (
                <button className="flex items-center gap-2 bg-slate-700 text-emerald-400 px-6 py-2 rounded-lg font-medium cursor-default border border-emerald-500/50">
                  <CheckCircle2 size={18} /> Completed
                </button>
             ) : (
                <button className="flex items-center gap-2 bg-slate-700 text-slate-300 px-6 py-2 rounded-lg font-medium animate-pulse">
                   Training...
                </button>
             )}
             
             <button onClick={resetTraining} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
               <RotateCcw size={18} />
             </button>
          </div>
        </div>

        <div className="h-[400px] w-full bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="epoch" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 1.5]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="totalLoss" stroke="#f472b6" strokeWidth={2} dot={false} name="Total Loss" />
              <Line type="monotone" dataKey="materialLoss" stroke="#22d3ee" strokeWidth={2} dot={false} name="Material (MSE)" />
              <Line type="monotone" dataKey="dialecticalLoss" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Dialectical (Context)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-6">
           <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-pink-400">
              <span className="text-slate-400 text-sm block">Final Total Loss</span>
              <span className="text-2xl font-mono text-white">{data[data.length - 1]?.totalLoss.toFixed(4) || '---'}</span>
           </div>
           <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-cyan-400">
              <span className="text-slate-400 text-sm block">Final Material Loss</span>
              <span className="text-2xl font-mono text-white">{data[data.length - 1]?.materialLoss.toFixed(4) || '---'}</span>
           </div>
           <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-amber-400">
              <span className="text-slate-400 text-sm block">Final Dialectical Loss</span>
              <span className="text-2xl font-mono text-white">{data[data.length - 1]?.dialecticalLoss.toFixed(4) || '---'}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
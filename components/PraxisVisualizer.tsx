import React from 'react';
import { DPTNPraxis } from '../types';
import { Zap, Hand, Crosshair } from 'lucide-react';

interface Props {
  praxis: DPTNPraxis;
}

export default function PraxisVisualizer({ praxis }: Props) {
  // Determine color based on intensity
  const getColor = (val: number) => {
    if (val < 0.3) return 'text-emerald-400';
    if (val < 0.7) return 'text-yellow-400';
    return 'text-rose-400';
  };

  const getBarColor = (val: number) => {
     if (val < 0.3) return 'bg-emerald-500';
     if (val < 0.7) return 'bg-yellow-500';
     return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full block"></span>
        Praxis Output (Robot Action)
      </h2>

      {/* Robot Arm Visual Simulation (CSS/SVG) */}
      <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700/50 relative overflow-hidden min-h-[250px] mb-6">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-500"></div>
            ))}
        </div>
        
        {/* Simplified Robot Arm Visual */}
        <div className="relative w-48 h-48 flex items-center justify-center">
             {/* Base Ring */}
             <div className="absolute w-40 h-40 rounded-full border-2 border-slate-600 border-dashed animate-spin-slow" style={{ animationDuration: `${11 - praxis.speed * 10}s`}}></div>
             
             {/* Core */}
             <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${praxis.precision > 0.7 ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-slate-500'}`}>
                {/* Gripper State */}
                <div 
                    className="w-12 h-12 bg-slate-200 rounded transition-all duration-300 ease-out"
                    style={{ 
                        transform: `scale(${0.5 + praxis.gripForce * 0.5})`,
                        opacity: 0.5 + praxis.precision * 0.5,
                        backgroundColor: praxis.gripForce > 0.8 ? '#f43f5e' : '#e2e8f0' 
                    }}
                ></div>
             </div>
             
             {/* Labels overlay */}
             <div className="absolute top-2 right-2 text-xs text-slate-500">
                Simulated End-Effector
             </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
          <Zap size={24} className={`mb-2 ${getColor(praxis.speed)}`} />
          <span className="text-sm text-slate-400">Velocity</span>
          <span className="text-2xl font-bold font-mono">{Math.round(praxis.speed * 100)}%</span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${getBarColor(praxis.speed)}`} style={{ width: `${praxis.speed * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
          <Hand size={24} className={`mb-2 ${getColor(praxis.gripForce)}`} />
          <span className="text-sm text-slate-400">Grip Force</span>
          <span className="text-2xl font-bold font-mono">{Math.round(praxis.gripForce * 100)}N</span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${getBarColor(praxis.gripForce)}`} style={{ width: `${praxis.gripForce * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
          <Crosshair size={24} className={`mb-2 ${getColor(praxis.precision)}`} />
          <span className="text-sm text-slate-400">Precision</span>
          <span className="text-2xl font-bold font-mono">{Math.round(praxis.precision * 100)}%</span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${getBarColor(praxis.precision)}`} style={{ width: `${praxis.precision * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
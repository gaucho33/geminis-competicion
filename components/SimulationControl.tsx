import React from 'react';
import { Info } from 'lucide-react';

interface ControlProps {
  title: string;
  description: string;
  values: Record<string, number>;
  onChange: (key: any, value: number) => void;
  color: 'cyan' | 'indigo';
}

const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

export default function SimulationControl({ title, description, values, onChange, color }: ControlProps) {
  const accentColor = color === 'cyan' ? 'accent-cyan-400' : 'accent-indigo-400';
  const borderColor = color === 'cyan' ? 'border-cyan-500/30' : 'border-indigo-500/30';
  const headerColor = color === 'cyan' ? 'text-cyan-400' : 'text-indigo-400';

  return (
    <div className={`bg-slate-800/50 rounded-xl p-6 border ${borderColor} backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={`text-xl font-bold ${headerColor}`}>{title}</h2>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        <Info className="text-slate-500" size={18} />
      </div>

      <div className="space-y-5">
        {Object.entries(values).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">{formatKey(key)}</label>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                {value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              onChange={(e) => onChange(key, parseFloat(e.target.value))}
              className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${accentColor}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
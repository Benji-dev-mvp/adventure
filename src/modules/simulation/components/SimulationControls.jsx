import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Users, Mail, BarChart3,
  Percent, Target
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

const ControlSlider = ({ 
  label, 
  icon: Icon, 
  value, 
  min, 
  max, 
  step = 1,
  format = (v) => v,
  onChange 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-slate-300">{label}</span>
        </div>
        <span className="text-sm font-medium text-slate-100">{format(value)}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-cyan-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-cyan-500/30
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-cyan-500
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, #06b6d4 ${percentage}%, #1e293b ${percentage}%)`
          }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-slate-600">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
};

export function SimulationControls({ params, updateParam }) {
  return (
    <GlassCard variant="subtle" className="h-full">
      <GlassCardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">Simulation Controls</h3>

        <ControlSlider
          label="Average Contract Value"
          icon={DollarSign}
          value={params.acv}
          min={10000}
          max={200000}
          step={5000}
          format={(v) => `$${(v / 1000).toFixed(0)}K`}
          onChange={(v) => updateParam('acv', v)}
        />

        <ControlSlider
          label="Monthly Outreach Volume"
          icon={Mail}
          value={params.monthlyVolume}
          min={500}
          max={10000}
          step={500}
          format={(v) => v.toLocaleString()}
          onChange={(v) => updateParam('monthlyVolume', v)}
        />

        <ControlSlider
          label="SDR Seats"
          icon={Users}
          value={params.seats}
          min={1}
          max={20}
          step={1}
          format={(v) => v}
          onChange={(v) => updateParam('seats', v)}
        />

        <div className="pt-4 border-t border-white/5">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Conversion Assumptions</h4>

          <ControlSlider
            label="Reply Rate"
            icon={Percent}
            value={params.replyRateAssumption}
            min={1}
            max={15}
            step={0.5}
            format={(v) => `${v}%`}
            onChange={(v) => updateParam('replyRateAssumption', v)}
          />

          <ControlSlider
            label="Demo Conversion"
            icon={Target}
            value={params.demoConversion}
            min={10}
            max={60}
            step={5}
            format={(v) => `${v}%`}
            onChange={(v) => updateParam('demoConversion', v)}
          />

          <ControlSlider
            label="Close Rate"
            icon={BarChart3}
            value={params.closeRate}
            min={10}
            max={60}
            step={5}
            format={(v) => `${v}%`}
            onChange={(v) => updateParam('closeRate', v)}
          />
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default SimulationControls;

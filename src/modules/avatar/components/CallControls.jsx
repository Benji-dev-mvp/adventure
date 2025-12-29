import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  AlertTriangle,
  Shield,
  Sparkles,
  MessageSquare,
  Target,
  UserCheck,
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';

const POLICY_OPTIONS = [
  {
    value: 'conservative',
    label: 'Conservative',
    description: 'Careful approach, avoids aggressive tactics',
  },
  { value: 'standard', label: 'Standard', description: 'Balanced approach with proven techniques' },
  {
    value: 'aggressive',
    label: 'Aggressive',
    description: 'Direct approach, pushes for commitment',
  },
];

const PERSONA_OPTIONS = [
  { value: 'helpful', label: 'Helpful', icon: Sparkles, description: 'Friendly and supportive' },
  { value: 'direct', label: 'Direct', icon: Target, description: 'Clear and to the point' },
  {
    value: 'consultative',
    label: 'Consultative',
    icon: MessageSquare,
    description: 'Questions and advises',
  },
];

const OptionButton = ({ option, isSelected, onClick, showDescription = true }) => {
  const Icon = option.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 p-3 rounded-xl border text-left transition-all
        ${
          isSelected
            ? 'bg-cyan-500/10 border-cyan-500/30 ring-2 ring-cyan-500/20'
            : 'bg-slate-800/30 border-white/5 hover:border-white/10'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />}
        <span className={`text-sm font-medium ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>
          {option.label}
        </span>
      </div>
      {showDescription && <p className="text-xs text-slate-500">{option.description}</p>}
    </button>
  );
};

export function CallControls({ settings, updateSettings, onEmergencyTakeover, status }) {
  return (
    <GlassCard variant="subtle">
      <GlassCardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-100">Call Settings</h3>
        </div>

        {/* Policy selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Policy
          </h4>
          <div className="flex gap-2">
            {POLICY_OPTIONS.map(option => (
              <OptionButton
                key={option.value}
                option={option}
                isSelected={settings.policy === option.value}
                onClick={() => updateSettings('policy', option.value)}
              />
            ))}
          </div>
        </div>

        {/* Persona selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Persona
          </h4>
          <div className="flex gap-2">
            {PERSONA_OPTIONS.map(option => (
              <OptionButton
                key={option.value}
                option={option}
                isSelected={settings.persona === option.value}
                onClick={() => updateSettings('persona', option.value)}
              />
            ))}
          </div>
        </div>

        {/* Emergency takeover */}
        <div className="pt-6 border-t border-white/5">
          <motion.button
            onClick={onEmergencyTakeover}
            disabled={status !== 'in-call'}
            whileHover={{ scale: status === 'in-call' ? 1.02 : 1 }}
            whileTap={{ scale: status === 'in-call' ? 0.98 : 1 }}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              border-2 border-dashed transition-colors
              ${
                status === 'in-call'
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer'
                  : 'border-slate-700 bg-slate-800/30 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Emergency Takeover</span>
          </motion.button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Transfer the call to a human immediately
          </p>
        </div>

        {/* Current settings summary */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
          <h4 className="text-xs font-medium text-slate-400 mb-2">Active Configuration</h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-300">
              Policy: <span className="text-purple-400 capitalize">{settings.policy}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Persona: <span className="text-cyan-400 capitalize">{settings.persona}</span>
            </span>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default CallControls;

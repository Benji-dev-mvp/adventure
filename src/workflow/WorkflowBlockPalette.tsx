import React from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Target,
  Sparkles,
  Filter,
  Mail,
  Globe,
  Phone,
  Timer,
  GitBranch,
  ArrowUpCircle,
  Brain,
  CheckCircle,
  GripVertical,
} from 'lucide-react';

/**
 * Workflow Block Palette Component
 * Draggable block library for the orchestrator canvas
 */

interface Block {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface BlockCategory {
  id: string;
  label: string;
  blocks: Block[];
}

const blockCategories: BlockCategory[] = [
  {
    id: 'data',
    label: 'Data',
    blocks: [
      { type: 'source', label: 'Source', icon: Database, color: 'bg-blue-500', description: 'Import data from various sources' },
      { type: 'filter', label: 'Filter', icon: Filter, color: 'bg-cyan-500', description: 'Filter records by criteria' },
      { type: 'enrich', label: 'Enrich', icon: Sparkles, color: 'bg-purple-500', description: 'Enrich with third-party data' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    blocks: [
      { type: 'score', label: 'Score', icon: Target, color: 'bg-amber-500', description: 'Score leads with ML models' },
      { type: 'ai_action', label: 'AI Action', icon: Brain, color: 'bg-violet-500', description: 'AI-powered decision making' },
    ],
  },
  {
    id: 'outreach',
    label: 'Outreach',
    blocks: [
      { type: 'send_email', label: 'Email', icon: Mail, color: 'bg-green-500', description: 'Send personalized emails' },
      { type: 'send_linkedin', label: 'LinkedIn', icon: Globe, color: 'bg-blue-600', description: 'Send LinkedIn messages' },
      { type: 'send_call', label: 'Call', icon: Phone, color: 'bg-emerald-500', description: 'Schedule phone calls' },
    ],
  },
  {
    id: 'flow',
    label: 'Flow Control',
    blocks: [
      { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-orange-500', description: 'Branch based on conditions' },
      { type: 'wait', label: 'Wait', icon: Timer, color: 'bg-gray-500', description: 'Add time delays' },
      { type: 'escalate', label: 'Escalate', icon: ArrowUpCircle, color: 'bg-red-500', description: 'Escalate to human' },
      { type: 'convert', label: 'Convert', icon: CheckCircle, color: 'bg-pink-500', description: 'Mark as converted' },
    ],
  },
];

interface WorkflowBlockPaletteProps {
  onDragStart?: (block: Block) => void;
  onBlockSelect?: (block: Block) => void;
}

const WorkflowBlockPalette = ({ onDragStart, onBlockSelect }: WorkflowBlockPaletteProps) => {
  const handleDragStart = (e: React.DragEvent, block: Block) => {
    e.dataTransfer.setData('block/type', block.type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(block);
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Block Library</h3>
        <p className="text-xs text-gray-500 mt-1">Drag blocks to canvas</p>
      </div>

      <div className="p-3 space-y-4">
        {blockCategories.map(category => (
          <div key={category.id}>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">
              {category.label}
            </div>
            <div className="space-y-1">
              {category.blocks.map(block => {
                const Icon = block.icon;
                return (
                  <motion.div
                    key={block.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, block)}
                    onClick={() => onBlockSelect?.(block)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing border border-transparent hover:border-gray-600 transition-colors group"
                  >
                    <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                    <div className={`w-8 h-8 rounded-lg ${block.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{block.label}</div>
                      <div className="text-xs text-gray-500 truncate">{block.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { WorkflowBlockPalette, blockCategories };
export default WorkflowBlockPalette;

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Building2,
  User,
  Cpu,
  Zap,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Mail,
  Linkedin,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Local type definitions
interface NodeData {
  industry?: string;
  employees?: number;
  revenue?: string;
  engagementScore?: number;
  title?: string;
  email?: string;
  accountId?: string;
  category?: string;
  marketShare?: number;
  signalType?: string;
  strength?: number;
}

interface GraphNode {
  id: string;
  type: 'account' | 'contact' | 'technology' | 'signal';
  label: string;
  data: NodeData;
  intentLevel: 'hot' | 'warm' | 'cold' | 'unknown';
  fitScore: string;
  stage: string;
  score: number;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
}

/**
 * Intelligence Graph Component
 * Force-directed account graph combining leads, accounts, technologies, and signals
 */

// Mock graph data
const generateMockGraphData = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    // Accounts
    {
      id: 'acc-1',
      type: 'account',
      label: 'Acme Corp',
      data: { industry: 'Technology', employees: 2500, revenue: '$50M', engagementScore: 85 },
      intentLevel: 'hot',
      fitScore: 'excellent',
      stage: 'opportunity',
      score: 92,
      x: 400,
      y: 300,
    },
    {
      id: 'acc-2',
      type: 'account',
      label: 'TechStart Inc',
      data: { industry: 'SaaS', employees: 150, revenue: '$8M', engagementScore: 72 },
      intentLevel: 'warm',
      fitScore: 'good',
      stage: 'qualified',
      score: 78,
      x: 600,
      y: 200,
    },
    {
      id: 'acc-3',
      type: 'account',
      label: 'Enterprise Solutions',
      data: { industry: 'Enterprise', employees: 5000, revenue: '$200M', engagementScore: 45 },
      intentLevel: 'cold',
      fitScore: 'excellent',
      stage: 'prospect',
      score: 65,
      x: 200,
      y: 400,
    },

    // Contacts
    {
      id: 'con-1',
      type: 'contact',
      label: 'Sarah Chen',
      data: { title: 'VP Sales', email: 'sarah@acme.com', accountId: 'acc-1' },
      intentLevel: 'hot',
      fitScore: 'excellent',
      stage: 'engaged',
      score: 88,
      x: 450,
      y: 250,
    },
    {
      id: 'con-2',
      type: 'contact',
      label: 'Mike Johnson',
      data: { title: 'CRO', email: 'mike@acme.com', accountId: 'acc-1' },
      intentLevel: 'warm',
      fitScore: 'excellent',
      stage: 'qualified',
      score: 82,
      x: 350,
      y: 350,
    },
    {
      id: 'con-3',
      type: 'contact',
      label: 'Lisa Wang',
      data: { title: 'Director of Sales', email: 'lisa@techstart.com', accountId: 'acc-2' },
      intentLevel: 'warm',
      fitScore: 'good',
      stage: 'engaged',
      score: 75,
      x: 650,
      y: 150,
    },
    {
      id: 'con-4',
      type: 'contact',
      label: 'James Miller',
      data: { title: 'CEO', email: 'james@enterprise.com', accountId: 'acc-3' },
      intentLevel: 'cold',
      fitScore: 'excellent',
      stage: 'prospect',
      score: 60,
      x: 150,
      y: 350,
    },

    // Technologies
    {
      id: 'tech-1',
      type: 'technology',
      label: 'Salesforce',
      data: { category: 'CRM', marketShare: 23 },
      intentLevel: 'unknown',
      fitScore: 'good',
      stage: 'prospect',
      score: 70,
      x: 500,
      y: 400,
    },
    {
      id: 'tech-2',
      type: 'technology',
      label: 'HubSpot',
      data: { category: 'Marketing', marketShare: 15 },
      intentLevel: 'unknown',
      fitScore: 'good',
      stage: 'prospect',
      score: 65,
      x: 300,
      y: 200,
    },

    // Signals
    {
      id: 'sig-1',
      type: 'signal',
      label: 'Funding Round',
      data: { signalType: 'funding', strength: 90 },
      intentLevel: 'hot',
      fitScore: 'excellent',
      stage: 'engaged',
      score: 95,
      x: 550,
      y: 300,
    },
    {
      id: 'sig-2',
      type: 'signal',
      label: 'Hiring VP Sales',
      data: { signalType: 'hiring', strength: 75 },
      intentLevel: 'warm',
      fitScore: 'good',
      stage: 'qualified',
      score: 80,
      x: 250,
      y: 300,
    },
  ];

  const edges = [
    { id: 'e1', source: 'con-1', target: 'acc-1', type: 'works_at', weight: 1 },
    { id: 'e2', source: 'con-2', target: 'acc-1', type: 'works_at', weight: 1 },
    { id: 'e3', source: 'con-3', target: 'acc-2', type: 'works_at', weight: 1 },
    { id: 'e4', source: 'con-4', target: 'acc-3', type: 'works_at', weight: 1 },
    { id: 'e5', source: 'acc-1', target: 'tech-1', type: 'uses', weight: 0.8 },
    { id: 'e6', source: 'acc-2', target: 'tech-2', type: 'uses', weight: 0.7 },
    { id: 'e7', source: 'acc-1', target: 'sig-1', type: 'triggered', weight: 0.9 },
    { id: 'e8', source: 'acc-3', target: 'sig-2', type: 'triggered', weight: 0.6 },
    { id: 'e9', source: 'con-1', target: 'con-2', type: 'connected_to', weight: 0.5 },
  ];

  return { nodes, edges };
};

const IntelligenceGraph = () => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [graphData] = useState(generateMockGraphData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState({
    nodeTypes: ['account', 'contact', 'technology', 'signal'],
    intentLevels: ['hot', 'warm', 'cold', 'unknown'],
    stages: ['prospect', 'engaged', 'qualified', 'opportunity', 'customer'],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(node => {
      if (!filters.nodeTypes.includes(node.type)) return false;
      if (!filters.intentLevels.includes(node.intentLevel)) return false;
      if (!filters.stages.includes(node.stage)) return false;
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    });
  }, [graphData.nodes, filters, searchQuery]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return graphData.edges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  }, [graphData.edges, filteredNodes]);

  const getNodeColor = (node: GraphNode): string => {
    const intentColors: Record<string, string> = {
      hot: '#ef4444',
      warm: '#f59e0b',
      cold: '#3b82f6',
      unknown: '#6b7280',
    };
    return intentColors[node.intentLevel] || '#6b7280';
  };

  const getNodeSize = (node: GraphNode): number => {
    const baseSize = 20;
    const scoreMultiplier = node.score / 100;
    return baseSize + scoreMultiplier * 20;
  };

  const getNodeIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'account':
        return Building2;
      case 'contact':
        return User;
      case 'technology':
        return Cpu;
      case 'signal':
        return Zap;
      default:
        return Network;
    }
  };

  const handleNodeClick = (node: GraphNode): void => {
    setSelectedNode(node);
  };

  return (
    <div className="h-full flex bg-gray-950">
      {/* Main Graph Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-4 z-10 bg-gray-900 border border-gray-700 rounded-lg p-4 w-72 shadow-xl"
            >
              <h4 className="text-sm font-medium text-white mb-3">Filter Nodes</h4>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="node-type-filter"
                    className="text-xs text-gray-400 uppercase tracking-wider mb-2 block"
                  >
                    Node Type
                  </label>
                  <div id="node-type-filter" className="flex flex-wrap gap-2">
                    {['account', 'contact', 'technology', 'signal'].map(type => (
                      <button
                        key={type}
                        onClick={() =>
                          setFilters(f => ({
                            ...f,
                            nodeTypes: f.nodeTypes.includes(type)
                              ? f.nodeTypes.filter(t => t !== type)
                              : [...f.nodeTypes, type],
                          }))
                        }
                        className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                          filters.nodeTypes.includes(type)
                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="intent-level-filter"
                    className="text-xs text-gray-400 uppercase tracking-wider mb-2 block"
                  >
                    Intent Level
                  </label>
                  <div id="intent-level-filter" className="flex flex-wrap gap-2">
                    {[
                      { id: 'hot', color: 'bg-red-500' },
                      { id: 'warm', color: 'bg-amber-500' },
                      { id: 'cold', color: 'bg-blue-500' },
                      { id: 'unknown', color: 'bg-gray-500' },
                    ].map(intent => (
                      <button
                        key={intent.id}
                        onClick={() =>
                          setFilters(f => ({
                            ...f,
                            intentLevels: f.intentLevels.includes(intent.id)
                              ? f.intentLevels.filter(i => i !== intent.id)
                              : [...f.intentLevels, intent.id],
                          }))
                        }
                        className={`px-2 py-1 rounded text-xs capitalize flex items-center gap-1.5 transition-colors ${
                          filters.intentLevels.includes(intent.id)
                            ? 'bg-gray-700 text-white border border-gray-600'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${intent.color}`} />
                        {intent.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graph Canvas */}
        <svg
          ref={containerRef}
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {filteredEdges.map(edge => {
              const sourceNode = filteredNodes.find(n => n.id === edge.source);
              const targetNode = filteredNodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <motion.line
                  key={edge.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="rgba(139, 92, 246, 0.3)"
                  strokeWidth={edge.weight * 2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const NodeIcon = getNodeIcon(node.type);
              const size = getNodeSize(node);
              const color = getNodeColor(node);

              return (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer ring for stage */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={node.stage === 'opportunity' ? '0' : '4 2'}
                    opacity={0.5}
                  />

                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    fill={`${color}20`}
                    stroke={color}
                    strokeWidth="2"
                  />

                  {/* Icon */}
                  <foreignObject x={node.x - 8} y={node.y - 8} width={16} height={16}>
                    <NodeIcon className="w-4 h-4" style={{ color }} />
                  </foreignObject>

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + size + 14}
                    textAnchor="middle"
                    className="text-xs fill-gray-300 font-medium"
                  >
                    {node.label}
                  </text>

                  {/* Score badge */}
                  <g transform={`translate(${node.x + size - 4}, ${node.y - size + 4})`}>
                    <circle r="10" fill="#1f2937" stroke={color} strokeWidth="1" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px] fill-white font-bold"
                    >
                      {node.score}
                    </text>
                  </g>
                </motion.g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">Hot Intent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-gray-300">Warm Intent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-300">Cold Intent</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Account</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Signal</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <div className="bg-gray-900/90 border border-gray-700 rounded-lg px-3 py-2 text-xs">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-white ml-1 font-medium">{filteredNodes.length}</span>
          </div>
          <div className="bg-gray-900/90 border border-gray-700 rounded-lg px-3 py-2 text-xs">
            <span className="text-gray-400">Edges:</span>
            <span className="text-white ml-1 font-medium">{filteredEdges.length}</span>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {React.createElement(getNodeIcon(selectedNode.type), {
                  className: 'w-5 h-5',
                  style: { color: getNodeColor(selectedNode) },
                })}
                <div>
                  <h3 className="font-semibold text-white">{selectedNode.label}</h3>
                  <p className="text-xs text-gray-400 capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Score Card */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Overall Score</span>
                  <span className="text-2xl font-bold text-white">{selectedNode.score}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getNodeColor(selectedNode) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedNode.score}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <div
                      className={`text-xs font-medium capitalize ${
                        selectedNode.intentLevel === 'hot'
                          ? 'text-red-400'
                          : selectedNode.intentLevel === 'warm'
                            ? 'text-amber-400'
                            : 'text-blue-400'
                      }`}
                    >
                      {selectedNode.intentLevel}
                    </div>
                    <div className="text-[10px] text-gray-500">Intent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-green-400 capitalize">
                      {selectedNode.fitScore}
                    </div>
                    <div className="text-[10px] text-gray-500">Fit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-violet-400 capitalize">
                      {selectedNode.stage}
                    </div>
                    <div className="text-[10px] text-gray-500">Stage</div>
                  </div>
                </div>
              </div>

              {/* Node-specific details */}
              {selectedNode.type === 'account' && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Company Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500 text-xs">Industry</div>
                        <div className="text-white">{selectedNode.data.industry}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500 text-xs">Employees</div>
                        <div className="text-white">{selectedNode.data.employees}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500 text-xs">Revenue</div>
                        <div className="text-white">{selectedNode.data.revenue}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500 text-xs">Engagement</div>
                        <div className="text-white">{selectedNode.data.engagementScore}%</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedNode.type === 'contact' && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Contact Details</h4>
                    <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Title</span>
                        <span className="text-sm text-white">{selectedNode.data.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Email</span>
                        <span className="text-sm text-white">{selectedNode.data.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </button>
                  </div>
                </>
              )}

              {/* AI Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      action: 'Send personalized email',
                      priority: 'high',
                      reason: 'High intent signal detected',
                    },
                    {
                      action: 'Research recent funding',
                      priority: 'medium',
                      reason: 'New funding announcement',
                    },
                    {
                      action: 'Connect on LinkedIn',
                      priority: 'low',
                      reason: 'Build rapport before outreach',
                    },
                  ].map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors group"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          rec.priority === 'high'
                            ? 'bg-green-400'
                            : rec.priority === 'medium'
                              ? 'bg-amber-400'
                              : 'bg-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="text-sm text-white">{rec.action}</div>
                        <div className="text-xs text-gray-500">{rec.reason}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { IntelligenceGraph };
export default IntelligenceGraph;

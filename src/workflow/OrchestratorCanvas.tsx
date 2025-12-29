import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Settings,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Brain,
  GitBranch,
  Timer,
  ArrowUpCircle,
  Target,
  Database,
  Sparkles,
  Layers,
  X,
  Filter as FilterIcon,
} from 'lucide-react';

/**
 * Orchestrator Canvas Component
 * Node-based drag-and-drop workflow builder
 */

interface BlockType {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const blockTypes: Record<string, BlockType> = {
  source: { color: 'bg-blue-500', icon: Database, label: 'Source' },
  score: { color: 'bg-amber-500', icon: Target, label: 'Score' },
  enrich: { color: 'bg-purple-500', icon: Sparkles, label: 'Enrich' },
  filter: { color: 'bg-cyan-500', icon: FilterIcon, label: 'Filter' },
  send_email: { color: 'bg-green-500', icon: Mail, label: 'Email' },
  send_linkedin: { color: 'bg-blue-600', icon: Globe, label: 'LinkedIn' },
  send_call: { color: 'bg-emerald-500', icon: Phone, label: 'Call' },
  wait: { color: 'bg-gray-500', icon: Timer, label: 'Wait' },
  condition: { color: 'bg-orange-500', icon: GitBranch, label: 'Condition' },
  escalate: { color: 'bg-red-500', icon: ArrowUpCircle, label: 'Escalate' },
  ai_action: { color: 'bg-violet-500', icon: Brain, label: 'AI Action' },
  convert: { color: 'bg-pink-500', icon: CheckCircle, label: 'Convert' },
};

interface WorkflowBlock {
  id: string;
  type: string;
  x: number;
  y: number;
  config: { name: string; [key: string]: string | undefined };
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
  label?: string;
}

const initialBlocks: WorkflowBlock[] = [
  {
    id: 'b1',
    type: 'source',
    x: 100,
    y: 200,
    config: { name: 'Import Leads', source: 'csv_upload' },
  },
  {
    id: 'b2',
    type: 'score',
    x: 300,
    y: 200,
    config: { name: 'Lead Scoring', model: 'default_model' },
  },
  {
    id: 'b3',
    type: 'enrich',
    x: 500,
    y: 150,
    config: { name: 'Data Enrichment', provider: 'clearbit' },
  },
  {
    id: 'b4',
    type: 'condition',
    x: 700,
    y: 200,
    config: { name: 'Score Check', condition: 'score >= 70' },
  },
  {
    id: 'b5',
    type: 'send_email',
    x: 900,
    y: 100,
    config: { name: 'Hot Lead Email', template: 'hot_lead_v1' },
  },
  { id: 'b6', type: 'wait', x: 900, y: 300, config: { name: 'Nurture Wait', duration: '3 days' } },
  {
    id: 'b7',
    type: 'ai_action',
    x: 1100,
    y: 300,
    config: { name: 'AI Follow-up', action: 'personalize' },
  },
];

const initialConnections: Connection[] = [
  { id: 'c1', from: 'b1', to: 'b2', fromPort: 'output', toPort: 'input' },
  { id: 'c2', from: 'b2', to: 'b3', fromPort: 'output', toPort: 'input' },
  { id: 'c3', from: 'b3', to: 'b4', fromPort: 'output', toPort: 'input' },
  { id: 'c4', from: 'b4', to: 'b5', fromPort: 'true', toPort: 'input', label: 'score >= 70' },
  { id: 'c5', from: 'b4', to: 'b6', fromPort: 'false', toPort: 'input', label: 'score < 70' },
  { id: 'c6', from: 'b6', to: 'b7', fromPort: 'output', toPort: 'input' },
];

const OrchestratorCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(initialBlocks);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ blockId: string; port: string } | null>(
    null
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showBlockPalette, setShowBlockPalette] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Workflow execution stats
  const stats = useMemo(
    () => ({
      totalBlocks: blocks.length,
      connections: connections.length,
      channels: new Set(blocks.filter(b => b.type.startsWith('send_')).map(b => b.type)).size,
    }),
    [blocks, connections]
  );

  const handleBlockDragStart = useCallback((e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    setDraggedBlock(blockId);
    setIsDragging(true);
  }, []);

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;
      setMousePos({ x, y });

      if (isDragging && draggedBlock) {
        setBlocks(prev =>
          prev.map(b =>
            b.id === draggedBlock ? { ...b, x: Math.max(0, x - 60), y: Math.max(0, y - 30) } : b
          )
        );
      }
    },
    [isDragging, draggedBlock, panOffset, zoom]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedBlock(null);
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
    }
  }, [isConnecting]);

  const handleStartConnection = useCallback((blockId: string, port: string) => {
    setIsConnecting(true);
    setConnectionStart({ blockId, port });
  }, []);

  const handleEndConnection = useCallback(
    (blockId: string, port: string) => {
      if (isConnecting && connectionStart && connectionStart.blockId !== blockId) {
        const newConnection = {
          id: `c${Date.now()}`,
          from: connectionStart.blockId,
          to: blockId,
          fromPort: connectionStart.port,
          toPort: port,
        };
        setConnections(prev => [...prev, newConnection]);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    },
    [isConnecting, connectionStart]
  );

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    setConnections(prev => prev.filter(c => c.from !== blockId && c.to !== blockId));
    setSelectedBlock(null);
  }, []);

  const handleAddBlock = useCallback((type: string) => {
    const newBlock: WorkflowBlock = {
      id: `b${Date.now()}`,
      type,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      config: { name: `New ${blockTypes[type]?.label || type}` },
    };
    setBlocks(prev => [...prev, newBlock]);
    setShowBlockPalette(false);
  }, []);

  const getBlockPosition = useCallback(
    (blockId: string) => {
      const block = blocks.find(b => b.id === blockId);
      return block ? { x: block.x + 60, y: block.y + 30 } : { x: 0, y: 0 };
    },
    [blocks]
  );

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Toolbar */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button className="p-1.5 text-gray-400 hover:text-white transition-colors rounded">
              <Undo className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-white transition-colors rounded">
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <div className="w-px h-6 bg-gray-700" />
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors rounded bg-gray-800">
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            <span className="text-white">{stats.totalBlocks}</span> blocks •{' '}
            <span className="text-white">{stats.channels}</span> channels
          </div>
          <div className="w-px h-6 bg-gray-700" />
          <button
            onClick={() => setShowBlockPalette(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-1.5 text-white text-sm font-medium rounded-lg transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Run'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div
          ref={canvasRef}
          role="region"
          aria-label="Workflow canvas"
          tabIndex={0}
          className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{
            background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)',
          }}
        >
          {/* Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="workflow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#workflow-grid)" />
          </svg>

          {/* Connections Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
          >
            <defs>
              <marker
                id="connection-arrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(139, 92, 246, 0.8)" />
              </marker>
            </defs>

            {connections.map(conn => {
              const from = getBlockPosition(conn.from);
              const to = getBlockPosition(conn.to);
              const midX = (from.x + to.x) / 2;

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                    fill="none"
                    stroke={
                      selectedConnection === conn.id
                        ? 'rgba(139, 92, 246, 1)'
                        : 'rgba(139, 92, 246, 0.5)'
                    }
                    strokeWidth={selectedConnection === conn.id ? 3 : 2}
                    markerEnd="url(#connection-arrow)"
                    className="cursor-pointer pointer-events-auto hover:stroke-violet-400"
                    onClick={() => setSelectedConnection(conn.id)}
                  />
                  {conn.label && (
                    <text
                      x={midX}
                      y={(from.y + to.y) / 2 - 8}
                      textAnchor="middle"
                      className="text-[10px] fill-gray-500"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Connection in progress */}
            {isConnecting && connectionStart && (
              <path
                d={`M ${getBlockPosition(connectionStart.blockId).x} ${getBlockPosition(connectionStart.blockId).y} L ${mousePos.x} ${mousePos.y}`}
                fill="none"
                stroke="rgba(34, 197, 94, 0.8)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Blocks Layer */}
          <div
            className="absolute inset-0"
            style={{ transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
          >
            {blocks.map(block => {
              const blockType = blockTypes[block.type];
              const Icon = blockType?.icon || Layers;
              const isSelected = selectedBlock === block.id;

              return (
                <motion.div
                  key={block.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: isSelected ? '0 0 0 2px rgba(139, 92, 246, 0.8)' : 'none',
                  }}
                  className={`absolute w-[120px] rounded-lg border bg-gray-900/90 backdrop-blur-sm cursor-pointer group ${
                    isSelected ? 'border-violet-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ left: block.x, top: block.y }}
                  onClick={() => setSelectedBlock(block.id)}
                  onMouseDown={e => handleBlockDragStart(e, block.id)}
                >
                  {/* Block Header */}
                  <div
                    className={`px-3 py-2 rounded-t-lg flex items-center gap-2 ${blockType?.color || 'bg-gray-700'}`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-xs font-medium text-white truncate">
                      {blockType?.label}
                    </span>
                  </div>

                  {/* Block Body */}
                  <div className="px-3 py-2">
                    <div className="text-xs text-gray-300 truncate">{block.config?.name}</div>
                    {isRunning && (
                      <div className="flex items-center gap-1 mt-1">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-400"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-[10px] text-green-400">Running</span>
                      </div>
                    )}
                  </div>

                  {/* Connection Ports */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Input connection port"
                    className="absolute -left-2 top-1/2 w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-600 hover:bg-violet-500 hover:border-violet-400 transition-colors cursor-crosshair"
                    style={{ transform: 'translateY(-50%)' }}
                    onMouseUp={() => handleEndConnection(block.id, 'input')}
                    onKeyDown={e => e.key === 'Enter' && handleEndConnection(block.id, 'input')}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Output connection port"
                    className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-600 hover:bg-green-500 hover:border-green-400 transition-colors cursor-crosshair"
                    style={{ transform: 'translateY(-50%)' }}
                    onMouseDown={e => {
                      e.stopPropagation();
                      handleStartConnection(block.id, 'output');
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        handleStartConnection(block.id, 'output');
                      }
                    }}
                  />

                  {/* Condition block extra ports */}
                  {block.type === 'condition' && (
                    <>
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="True condition port"
                        className="absolute -right-2 top-1/4 w-4 h-4 rounded-full bg-green-600 border-2 border-green-500 hover:bg-green-500 transition-colors cursor-crosshair"
                        style={{ transform: 'translateY(-50%)' }}
                        onMouseDown={e => {
                          e.stopPropagation();
                          handleStartConnection(block.id, 'true');
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleStartConnection(block.id, 'true');
                          }
                        }}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="False condition port"
                        className="absolute -right-2 top-3/4 w-4 h-4 rounded-full bg-red-600 border-2 border-red-500 hover:bg-red-500 transition-colors cursor-crosshair"
                        style={{ transform: 'translateY(-50%)' }}
                        onMouseDown={e => {
                          e.stopPropagation();
                          handleStartConnection(block.id, 'false');
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleStartConnection(block.id, 'false');
                          }
                        }}
                      />
                    </>
                  )}

                  {/* Hover actions */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-1 bg-red-500/80 rounded text-white hover:bg-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button className="p-1 bg-gray-700/80 rounded text-white hover:bg-gray-700">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="p-1 bg-gray-700/80 rounded text-white hover:bg-gray-700">
                      <Settings className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Block Config Panel */}
        <AnimatePresence>
          {selectedBlock && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto"
            >
              {(() => {
                const block = blocks.find(b => b.id === selectedBlock);
                if (!block) return null;
                const blockType = blockTypes[block.type];
                const Icon = blockType?.icon || Layers;

                return (
                  <>
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${blockType?.color || 'bg-gray-700'}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{blockType?.label} Block</h3>
                          <p className="text-xs text-gray-500">{block.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBlock(null)}
                        className="p-1 text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <label htmlFor="block-name" className="block text-sm text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          id="block-name"
                          type="text"
                          value={block.config?.name || ''}
                          onChange={e => {
                            setBlocks(prev =>
                              prev.map(b =>
                                b.id === block.id
                                  ? { ...b, config: { ...b.config, name: e.target.value } }
                                  : b
                              )
                            );
                          }}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>

                      {block.type === 'score' && (
                        <div>
                          <label
                            htmlFor="scoring-model"
                            className="block text-sm text-gray-400 mb-1"
                          >
                            Scoring Model
                          </label>
                          <select
                            id="scoring-model"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
                          >
                            <option value="default_model">Default Model</option>
                            <option value="ml_model">ML-Powered Model</option>
                            <option value="custom">Custom Rules</option>
                          </select>
                        </div>
                      )}

                      {block.type === 'wait' && (
                        <div>
                          <label
                            htmlFor="wait-duration"
                            className="block text-sm text-gray-400 mb-1"
                          >
                            Wait Duration
                          </label>
                          <select
                            id="wait-duration"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
                          >
                            <option value="1 hour">1 hour</option>
                            <option value="1 day">1 day</option>
                            <option value="3 days">3 days</option>
                            <option value="1 week">1 week</option>
                          </select>
                        </div>
                      )}

                      {block.type === 'condition' && (
                        <div>
                          <label
                            htmlFor="condition-text"
                            className="block text-sm text-gray-400 mb-1"
                          >
                            Condition
                          </label>
                          <textarea
                            id="condition-text"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none resize-none"
                            rows={3}
                            placeholder="score >= 70"
                            defaultValue={block.config?.condition}
                          />
                        </div>
                      )}

                      {block.type.startsWith('send_') && (
                        <div>
                          <label
                            htmlFor="template-select"
                            className="block text-sm text-gray-400 mb-1"
                          >
                            Template
                          </label>
                          <select
                            id="template-select"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
                          >
                            <option value="default">Default Template</option>
                            <option value="hot_lead">Hot Lead Outreach</option>
                            <option value="nurture">Nurture Sequence</option>
                            <option value="custom">Custom Template</option>
                          </select>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-800">
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Block
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Block Palette Modal */}
      <AnimatePresence>
        {showBlockPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowBlockPalette(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 rounded-lg border border-gray-700 p-4 w-[600px] max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Add Block</h2>
                <button
                  onClick={() => setShowBlockPalette(false)}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {Object.entries(blockTypes).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type)}
                      className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-all text-left group"
                    >
                      <div
                        className={`w-10 h-9 rounded-lg ${config.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm font-medium text-white">{config.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {type === 'source' && 'Import data source'}
                        {type === 'score' && 'Score leads'}
                        {type === 'enrich' && 'Enrich data'}
                        {type === 'filter' && 'Filter records'}
                        {type === 'send_email' && 'Send email'}
                        {type === 'send_linkedin' && 'LinkedIn action'}
                        {type === 'send_call' && 'Schedule call'}
                        {type === 'wait' && 'Wait period'}
                        {type === 'condition' && 'Branch logic'}
                        {type === 'escalate' && 'Escalate to rep'}
                        {type === 'ai_action' && 'AI-powered action'}
                        {type === 'convert' && 'Convert to deal'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { OrchestratorCanvas };
export default OrchestratorCanvas;

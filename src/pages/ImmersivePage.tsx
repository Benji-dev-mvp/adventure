/**
 * Immersive Page
 *
 * Multi-dimensional, immersive data experience.
 * 3D visualization, spatial navigation, and ambient intelligence.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// === Types ===

interface DataNode {
  id: string;
  type: 'deal' | 'contact' | 'company' | 'event' | 'insight';
  label: string;
  value: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  connections: string[];
  metadata: Record<string, string>;
}

interface Dimension {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'action';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

// === Mock Data ===

const generateNodes = (): DataNode[] => {
  const types: DataNode['type'][] = ['deal', 'contact', 'company', 'event', 'insight'];
  const colors = {
    deal: '#10B981',
    contact: '#3B82F6',
    company: '#8B5CF6',
    event: '#F59E0B',
    insight: '#EC4899',
  };

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: `node-${i}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      value: Math.random() * 100000,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      z: Math.random() * 100,
      radius: 10 + Math.random() * 30,
      color: colors[type],
      connections: Array.from(
        { length: Math.floor(Math.random() * 3) },
        () => `node-${Math.floor(Math.random() * 50)}`
      ),
      metadata: {
        stage: ['Discovery', 'Proposal', 'Negotiation', 'Closed'][Math.floor(Math.random() * 4)],
        owner: ['Alex', 'Sarah', 'Mike', 'Lisa'][Math.floor(Math.random() * 4)],
      },
    };
  });
};

const DIMENSIONS: Dimension[] = [
  { id: 'time', name: 'Temporal', icon: '⏱️', active: true },
  { id: 'value', name: 'Value', icon: '💰', active: true },
  { id: 'relationship', name: 'Relationships', icon: '🔗', active: false },
  { id: 'risk', name: 'Risk', icon: '⚠️', active: false },
  { id: 'velocity', name: 'Velocity', icon: '🚀', active: false },
];

const AMBIENT_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Cluster Emerging',
    description: 'FinTech segment showing 3x engagement spike',
    confidence: 0.89,
    timestamp: '2m ago',
  },
  {
    id: '2',
    type: 'risk',
    title: 'Deal Stall Pattern',
    description: '5 deals matching historical churn signature',
    confidence: 0.76,
    timestamp: '5m ago',
  },
  {
    id: '3',
    type: 'trend',
    title: 'Buying Signal Wave',
    description: 'Surge in pricing page visits from target accounts',
    confidence: 0.82,
    timestamp: '8m ago',
  },
  {
    id: '4',
    type: 'action',
    title: 'Optimal Window',
    description: 'Next 48 hours ideal for Enterprise outreach',
    confidence: 0.91,
    timestamp: '12m ago',
  },
];

// === Components ===

const ImmersiveCanvas: React.FC<{
  nodes: DataNode[];
  focusedNode: DataNode | null;
  onNodeClick: (node: DataNode) => void;
}> = ({ nodes, focusedNode, onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const project = useCallback(
    (x: number, y: number, z: number) => {
      const cos = Math.cos(rotation.y);
      const sin = Math.sin(rotation.y);
      const rotatedX = x * cos - z * sin;
      const rotatedZ = x * sin + z * cos;
      const scale = 1 + rotatedZ / 500;

      return {
        x: 400 + rotatedX * scale,
        y: 300 + (y - rotation.x * 100) * scale,
        scale,
      };
    },
    [rotation]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation loop
    let animationId: number;
    const render = () => {
      ctx.fillStyle = '#0f1419';
      ctx.fillRect(0, 0, 800, 600);

      // Draw grid - with vertical lines too for better depth perception
      ctx.strokeStyle = '#1a2332';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        // Horizontal lines
        const y = 60 * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();

        // Vertical lines
        const x = 80 * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 600);
        ctx.stroke();
      }

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return;

          const from = project(node.x, node.y, node.z);
          const to = project(target.x, target.y, target.z);

          ctx.beginPath();
          ctx.strokeStyle = `${node.color}30`;
          ctx.lineWidth = 1;
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        });
      });

      // Sort by z-depth for proper rendering
      const sortedNodes = [...nodes].sort((a, b) => a.z - b.z);

      // Draw nodes
      sortedNodes.forEach(node => {
        const pos = project(node.x, node.y, node.z);
        const isFocused = focusedNode?.id === node.id;
        const radius = node.radius * pos.scale * (isFocused ? 1.5 : 1);

        // Glow effect
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
        gradient.addColorStop(0, `${node.color}40`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isFocused ? node.color : `${node.color}aa`;
        ctx.fill();

        // Pulse animation for focused
        if (isFocused) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Label - with better sizing and shadow for readability
        if (radius > 15 || isFocused) {
          const fontSize = Math.max(10, Math.min(14, 10 * pos.scale));
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Text shadow for better readability
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;

          ctx.fillStyle = '#ffffff';
          ctx.fillText(node.label, pos.x, pos.y + radius + 8);

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [nodes, focusedNode, rotation, project]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01,
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find clicked node
    for (const node of nodes) {
      const pos = project(node.x, node.y, node.z);
      const dist = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
      if (dist < node.radius * pos.scale) {
        onNodeClick(node);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="rounded-lg cursor-grab active:cursor-grabbing border border-gray-800 shadow-2xl"
      style={{ maxWidth: '100%', height: 'auto' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    />
  );
};

const DimensionToggle: React.FC<{ dimension: Dimension; onToggle: () => void }> = ({
  dimension,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      dimension.active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`}
  >
    <span>{dimension.icon}</span>
    <span className="text-sm font-medium">{dimension.name}</span>
  </button>
);

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const typeStyles = {
    opportunity: 'border-green-500 bg-green-500/10 text-green-400',
    risk: 'border-red-500 bg-red-500/10 text-red-400',
    trend: 'border-blue-500 bg-blue-500/10 text-blue-400',
    action: 'border-purple-500 bg-purple-500/10 text-purple-400',
  };

  const icons = {
    opportunity: '✨',
    risk: '⚠️',
    trend: '📈',
    action: '⚡',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[insight.type]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icons[insight.type]}</span>
        <span className="font-medium text-white">{insight.title}</span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{insight.timestamp}</span>
        <span className="font-medium">{Math.round(insight.confidence * 100)}% confident</span>
      </div>
    </div>
  );
};

const NodeDetailPanel: React.FC<{ node: DataNode | null; onClose: () => void }> = ({
  node,
  onClose,
}) => {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: node.color }} />
          <span className="font-medium text-white">{node.label}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Type</span>
          <span className="text-white capitalize">{node.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Value</span>
          <span className="text-green-400">
            ${node.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Stage</span>
          <span className="text-white">{node.metadata.stage}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Owner</span>
          <span className="text-white">{node.metadata.owner}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Connections</span>
          <span className="text-blue-400">{node.connections.length}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          Deep Dive
        </button>
        <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
          View Timeline
        </button>
      </div>
    </div>
  );
};

// === Main Page ===

export const ImmersivePage: React.FC = () => {
  const [nodes] = useState<DataNode[]>(() => {
    try {
      const generated = generateNodes();
      return Array.isArray(generated) ? generated : [];
    } catch {
      return [];
    }
  });
  const [dimensions, setDimensions] = useState<Dimension[]>(DIMENSIONS || []);
  const [focusedNode, setFocusedNode] = useState<DataNode | null>(null);
  const [ambientMode, setAmbientMode] = useState(true);
  const [insights] = useState<Insight[]>(AMBIENT_INSIGHTS || []);

  // Safe data checks
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeDimensions = Array.isArray(dimensions) ? dimensions : [];
  const safeInsights = Array.isArray(insights) ? insights : [];

  const toggleDimension = (id: string) => {
    setDimensions(dims => {
      if (!Array.isArray(dims)) return [];
      return dims.map(d => {
        if (!d || !d.id) return d;
        return d.id === id ? { ...d, active: !d.active } : d;
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Ambient Background */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, #1e3a5f 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, #3d1f5c 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div>
          <h1 className="text-lg font-bold">Immersive Intelligence</h1>
          <p className="text-gray-400 text-sm">Multi-dimensional data exploration</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAmbientMode(!ambientMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              ambientMode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {ambientMode ? '🌌 Ambient On' : '🌌 Ambient Off'}
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
            Enter VR Mode
          </button>
        </div>
      </div>

      {/* Dimension Controls */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-6">
        {safeDimensions.map(dim => {
          if (!dim || !dim.id) return null;
          return (
            <DimensionToggle
              key={dim.id}
              dimension={dim}
              onToggle={() => toggleDimension(dim.id)}
            />
          );
        })}
      </div>

      {/* Main Visualization */}
      <div className="relative z-10 flex justify-center">
        <div className="relative">
          {safeNodes.length > 0 ? (
            <>
              <ImmersiveCanvas
                nodes={safeNodes}
                focusedNode={focusedNode}
                onNodeClick={setFocusedNode}
              />
              <NodeDetailPanel node={focusedNode} onClose={() => setFocusedNode(null)} />
            </>
          ) : (
            <div className="w-[800px] h-[600px] rounded-lg border border-gray-700 bg-gray-800 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">
            Deals: {safeNodes.filter(n => n && n.type === 'deal').length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">
            Contacts: {safeNodes.filter(n => n && n.type === 'contact').length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-gray-400">
            Companies: {safeNodes.filter(n => n && n.type === 'company').length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">
            Events: {safeNodes.filter(n => n && n.type === 'event').length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500" />
          <span className="text-gray-400">
            Insights: {safeNodes.filter(n => n && n.type === 'insight').length}
          </span>
        </div>
      </div>

      {/* Ambient Insights Sidebar */}
      {ambientMode && safeInsights.length > 0 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 w-72 space-y-3 z-20">
          <div className="text-sm text-gray-400 mb-2">Ambient Intelligence</div>
          {safeInsights.map(insight => {
            if (!insight || !insight.id) return null;
            return <InsightCard key={insight.id} insight={insight} />;
          })}
        </div>
      )}

      {/* Navigation Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-gray-900/80 backdrop-blur rounded-lg px-4 py-3 text-sm text-gray-400">
        <span className="mr-4">🖱️ Drag to rotate</span>
        <span className="mr-4">👆 Click to inspect</span>
        <span>⌨️ WASD to navigate</span>
      </div>

      {/* Minimap */}
      <div className="fixed bottom-6 right-6 w-32 h-32 bg-gray-900/80 backdrop-blur rounded-lg border border-gray-700 z-20 p-2">
        <div className="relative w-full h-full">
          {safeNodes.slice(0, 20).map(node => {
            if (!node || !node.id || !node.color) return null;
            return (
              <div
                key={node.id}
                className="absolute rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: node.color,
                  left: `${((node.x || 0) / 800 + 0.5) * 100}%`,
                  top: `${((node.y || 0) / 600 + 0.5) * 100}%`,
                }}
              />
            );
          })}
          <div className="absolute inset-1/4 w-1/2 h-1/2 border border-blue-500 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ImmersivePage;

/**
 * NeuroCanvas - Adaptive Orchestration Canvas
 * 
 * A living neural-graph visualization where:
 * - Nodes pulse with real-time activity
 * - Edges thicken with traffic volume
 * - Agents move visually along the graph performing tasks
 * 
 * The canvas is ALIVE — not static UI.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { AgentRole } from '../autonomy/agents/types';
import { 
  getSafeCanvasContext, 
  safeNumber, 
  safeColor
} from '../lib/renderSafety';

// === Types ===

interface CanvasNode {
  id: string;
  type: 'agent' | 'task' | 'queue' | 'output';
  role?: AgentRole;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulseIntensity: number;
  activity: number;
  status: 'idle' | 'working' | 'blocked' | 'success' | 'error';
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  traffic: number;
  particles: Particle[];
  color: string;
}

interface Particle {
  id: string;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

interface NeuroCanvasProps {
  width?: number;
  height?: number;
  data?: {
    agents: Array<{
      id: string;
      role: AgentRole;
      name: string;
      status: string;
    }>;
    taskFlows: Array<{
      id: string;
      from: string;
      to: string;
      taskType: string;
      progress: number;
    }>;
    metrics: {
      throughput: number;
      efficiency: number;
    };
  };
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
}

// === Color Schemes ===

const ROLE_COLORS: Record<AgentRole | 'default', string> = {
  hunter: '#10B981',     // Emerald
  scout: '#3B82F6',      // Blue
  writer: '#8B5CF6',     // Violet
  closer: '#F59E0B',     // Amber
  revops: '#EC4899',     // Pink
  orchestrator: '#6366F1', // Indigo
  default: '#6B7280',    // Gray
};

const STATUS_COLORS = {
  idle: '#4B5563',
  working: '#10B981',
  blocked: '#F59E0B',
  success: '#22C55E',
  error: '#EF4444',
};

// === Main Component ===

export const NeuroCanvas: React.FC<NeuroCanvasProps> = ({
  width = 800,
  height = 600,
  data,
  onNodeClick,
  onNodeHover,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const timeRef = useRef(0);

  // Initialize nodes from data
  useEffect(() => {
    if (!data) {
      // Generate demo data - this is handled by the separate effect below
      return;
    }

    const newNodes: CanvasNode[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Create agent nodes arranged in a circle
    data.agents.forEach((agent, i) => {
      const angle = (i / data.agents.length) * Math.PI * 2 - Math.PI / 2;
      newNodes.push({
        id: agent.id,
        type: 'agent',
        role: agent.role,
        label: agent.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 30,
        color: ROLE_COLORS[agent.role] || ROLE_COLORS.default,
        pulseIntensity: agent.status === 'working' ? 1 : 0.3,
        activity: agent.status === 'working' ? 1 : 0,
        status: agent.status as CanvasNode['status'],
      });
    });

    // Add central orchestrator node
    newNodes.push({
      id: 'orchestrator',
      type: 'queue',
      label: 'Orchestrator',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 45,
      color: ROLE_COLORS.orchestrator,
      pulseIntensity: 0.8,
      activity: data.metrics.throughput,
      status: 'working',
    });

    setNodes(newNodes);

    // Create edges from task flows
    const newEdges: CanvasEdge[] = [];
    
    // Connect all agents to orchestrator
    data.agents.forEach(agent => {
      newEdges.push({
        id: `edge_orch_${agent.id}`,
        source: 'orchestrator',
        target: agent.id,
        weight: 1,
        traffic: Math.random() * 0.5,
        particles: [],
        color: ROLE_COLORS[agent.role] || ROLE_COLORS.default,
      });
    });

    // Add task flow edges
    data.taskFlows.forEach(flow => {
      const existing = newEdges.find(e => e.source === flow.from && e.target === flow.to);
      if (existing) {
        existing.traffic += 0.3;
        // Add particle
        existing.particles.push({
          id: `particle_${flow.id}`,
          progress: flow.progress,
          speed: 0.01,
          color: '#fff',
          size: 4,
        });
      }
    });

    setEdges(newEdges);
  }, [data, width, height]);

  // Initialize demo data
  const initializeDemoData = useCallback(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const demoAgents: Array<{ role: AgentRole; name: string }> = [
      { role: 'hunter', name: 'Hunter Alpha' },
      { role: 'hunter', name: 'Hunter Beta' },
      { role: 'scout', name: 'Scout Alpha' },
      { role: 'writer', name: 'Writer Prime' },
      { role: 'closer', name: 'Closer Prime' },
      { role: 'revops', name: 'RevOps Prime' },
    ];

    const newNodes: CanvasNode[] = demoAgents.map((agent, i) => {
      const angle = (i / demoAgents.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: `agent_${i}`,
        type: 'agent' as const,
        role: agent.role,
        label: agent.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 28,
        color: ROLE_COLORS[agent.role],
        pulseIntensity: 0.3 + Math.random() * 0.7,
        activity: Math.random(),
        status: ['idle', 'working', 'working', 'idle'][Math.floor(Math.random() * 4)] as CanvasNode['status'],
      };
    });

    // Add orchestrator
    newNodes.push({
      id: 'orchestrator',
      type: 'queue',
      label: 'Orchestrator',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 45,
      color: ROLE_COLORS.orchestrator,
      pulseIntensity: 1,
      activity: 0.7,
      status: 'working',
    });

    setNodes(newNodes);

    // Create edges
    const newEdges: CanvasEdge[] = demoAgents.map((agent, i) => ({
      id: `edge_${i}`,
      source: 'orchestrator',
      target: `agent_${i}`,
      weight: 1 + Math.random(),
      traffic: Math.random() * 0.8,
      particles: Array.from({ length: Math.floor(Math.random() * 3) }, (_, j) => ({
        id: `p_${i}_${j}`,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        color: '#fff',
        size: 3 + Math.random() * 3,
      })),
      color: ROLE_COLORS[agent.role],
    }));

    setEdges(newEdges);
  }, [width, height]);

  // Call demo data initialization when no data is provided
  useEffect(() => {
    if (!data) {
      initializeDemoData();
    }
  }, [data, initializeDemoData]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getSafeCanvasContext(canvas);
    if (!ctx || !canvas) return;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      // Clear canvas with safe values
      ctx.fillStyle = safeColor('#0f172a', '#0f172a'); // Dark blue-gray
      ctx.fillRect(0, 0, safeNumber(width, 800), safeNumber(height, 600));

      // Draw background grid
      drawGrid(ctx);

      // Update and draw edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          // Update particles with safe progress
          edge.particles.forEach(particle => {
            particle.progress = safeNumber(particle.progress + particle.speed, 0, 0, 1);
            if (particle.progress >= 1) {
              particle.progress = 0;
            }
          });
          
          drawEdge(ctx, sourceNode, targetNode, edge);
        }
      });

      // Update and draw nodes
      nodes.forEach(node => {
        // Apply gentle physics
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary constraints with dampening
        if (node.x < node.radius || node.x > width - node.radius) {
          node.vx *= -0.8;
          node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        }
        if (node.y < node.radius || node.y > height - node.radius) {
          node.vy *= -0.8;
          node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
        }
        
        // Friction
        node.vx *= 0.99;
        node.vy *= 0.99;
        
        // Pulse animation
        const pulse = Math.sin(timeRef.current * 3 + node.activity * 10) * 0.1 + 1;
        
        drawNode(ctx, node, pulse, hoveredNode === node.id);
      });

      // Draw overlay info
      drawOverlay(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges, width, height, hoveredNode]);

  // Draw functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawEdge = (
    ctx: CanvasRenderingContext2D,
    source: CanvasNode,
    target: CanvasNode,
    edge: CanvasEdge
  ) => {
    const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
    gradient.addColorStop(0, source.color + '40');
    gradient.addColorStop(1, target.color + '40');
    
    // Draw edge line
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 + edge.traffic * 3;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    
    // Draw particles
    edge.particles.forEach(particle => {
      const x = source.x + (target.x - source.x) * particle.progress;
      const y = source.y + (target.y - source.y) * particle.progress;
      
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Glow effect
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
      glowGradient.addColorStop(0, particle.color + '80');
      glowGradient.addColorStop(1, particle.color + '00');
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    });
  };

  const drawNode = (
    ctx: CanvasRenderingContext2D,
    node: CanvasNode,
    pulse: number,
    isHovered: boolean
  ) => {
    const radius = node.radius * pulse * (isHovered ? 1.1 : 1);
    
    // Outer glow
    const glowRadius = radius * 2;
    const glowGradient = ctx.createRadialGradient(
      node.x, node.y, radius * 0.5,
      node.x, node.y, glowRadius
    );
    glowGradient.addColorStop(0, node.color + Math.floor(node.pulseIntensity * 60).toString(16).padStart(2, '0'));
    glowGradient.addColorStop(1, node.color + '00');
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Node body
    const bodyGradient = ctx.createRadialGradient(
      node.x - radius * 0.3, node.y - radius * 0.3, 0,
      node.x, node.y, radius
    );
    bodyGradient.addColorStop(0, node.color);
    bodyGradient.addColorStop(1, adjustColor(node.color, -40));
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient;
    ctx.fill();
    
    // Status indicator
    const statusColor = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(node.x + radius * 0.7, node.y - radius * 0.7, 6, 0, Math.PI * 2);
    ctx.fillStyle = statusColor;
    ctx.fill();
    
    // Node label
    ctx.fillStyle = '#fff';
    ctx.font = `${isHovered ? 'bold ' : ''}11px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Role icon/letter
    const roleInitial = node.role ? node.role[0].toUpperCase() : 'O';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillText(roleInitial, node.x, node.y);
    
    // Label below
    if (isHovered) {
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(node.label, node.x, node.y + radius + 15);
    }
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D) => {
    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('NEURAL ORCHESTRATION', 20, 30);
    
    // Stats
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`Agents: ${nodes.filter(n => n.type === 'agent').length}`, 20, 50);
    ctx.fillText(`Active: ${nodes.filter(n => n.status === 'working').length}`, 20, 65);
    
    // Legend
    const legendY = height - 80;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('AGENTS', 20, legendY);
    
    Object.entries(ROLE_COLORS).slice(0, 5).forEach(([role, color], i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(30 + i * 70, legendY + 20, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(role.charAt(0).toUpperCase() + role.slice(1), 30 + i * 70, legendY + 40);
    });
  };

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hoveredNodeFound = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });
    
    const newHovered = hoveredNodeFound?.id || null;
    if (newHovered !== hoveredNode) {
      setHoveredNode(newHovered);
      onNodeHover?.(newHovered);
    }
  }, [nodes, hoveredNode, onNodeHover]);

  const handleClick = useCallback((_e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
      onNodeClick?.(hoveredNode);
    }
  }, [hoveredNode, onNodeClick]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-indigo-500/30 bg-slate-900">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="cursor-pointer"
        style={{ display: 'block' }}
      />
      
      {/* Overlay UI */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs rounded-lg transition-colors">
          Pause
        </button>
        <button className="px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors">
          Reset View
        </button>
      </div>
      
      {/* Selected node details */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700 min-w-[200px]">
          <h4 className="text-white font-medium text-sm mb-2">
            {nodes.find(n => n.id === selectedNode)?.label}
          </h4>
          <div className="space-y-1 text-xs text-slate-400">
            <p>Status: <span className="text-green-400">{nodes.find(n => n.id === selectedNode)?.status}</span></p>
            <p>Activity: <span className="text-white">{((nodes.find(n => n.id === selectedNode)?.activity || 0) * 100).toFixed(0)}%</span></p>
          </div>
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-slate-500 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

// === Utility Functions ===

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default NeuroCanvas;

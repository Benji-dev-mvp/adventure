import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

// Color interpolation for intent scores
const getIntentColor = (intent) => {
  if (intent >= 80) return '#10b981'; // emerald - hot
  if (intent >= 60) return '#06b6d4'; // cyan - warm
  if (intent >= 40) return '#f97316'; // orange - warming
  return '#6366f1'; // indigo - cool
};

// Lead point tooltip
const PointTooltip = ({ point, cluster, position }) => {
  if (!point || !cluster) return null;
  
  const account = cluster.topAccounts?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl min-w-48">
        <p className="font-semibold text-slate-100 text-sm">{cluster.name}</p>
        {account && (
          <>
            <p className="text-xs text-slate-400 mt-1">{account.name} • {account.role}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-cyan-400">Intent: {Math.round(point.intent)}%</span>
              <span className="text-slate-500">|</span>
              <span className="text-purple-400">{account.predictedOpenDate}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2">→ {account.recommended}</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Single lead point visualization
const LeadPoint = ({ point, cluster, onHover, onLeave }) => {
  const color = getIntentColor(point.intent);
  
  return (
    <motion.circle
      cx={`${point.x}%`}
      cy={`${point.y}%`}
      r={point.size}
      fill={color}
      opacity={0.7}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        opacity: point.pulsing ? [0.5, 0.9, 0.5] : 0.7,
      }}
      transition={{
        scale: { duration: 0.5 },
        opacity: point.pulsing ? { duration: 2, repeat: Infinity } : {},
      }}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(point)}
      onMouseLeave={onLeave}
    />
  );
};

// Cluster boundary visualization
const ClusterBoundary = ({ cluster, isSelected, onClick }) => {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(cluster)}
    >
      {/* Cluster glow */}
      <ellipse
        cx={`${cluster.position.x}%`}
        cy={`${cluster.position.y}%`}
        rx={`${cluster.size * 0.5}%`}
        ry={`${cluster.size * 0.3}%`}
        fill={`${cluster.color}10`}
        stroke={cluster.color}
        strokeWidth={isSelected ? 2 : 1}
        strokeOpacity={isSelected ? 0.6 : 0.2}
        strokeDasharray={isSelected ? 'none' : '4 4'}
      />
      
      {/* Cluster label */}
      <text
        x={`${cluster.position.x}%`}
        y={`${cluster.position.y - cluster.size * 0.35}%`}
        textAnchor="middle"
        className="text-xs font-medium fill-slate-300 pointer-events-none"
      >
        {cluster.name}
      </text>
      <text
        x={`${cluster.position.x}%`}
        y={`${cluster.position.y - cluster.size * 0.35 + 4}%`}
        textAnchor="middle"
        className="text-[10px] fill-slate-500 pointer-events-none"
      >
        {cluster.accounts} accounts
      </text>
    </motion.g>
  );
};

export function HiveCanvas({ 
  clusters, 
  leadPoints, 
  selectedCluster, 
  onSelectCluster,
  hoveredPoint,
  onHoverPoint,
  onLeavePoint,
  loading 
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const clusterMap = clusters.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  if (loading) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Analyzing lead clusters...</p>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle" className="h-full">
      <GlassCardContent className="p-0 h-full relative overflow-hidden" ref={containerRef}>
        {/* Background grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-4 px-3 py-2 bg-slate-900/80 rounded-lg border border-white/10">
          <span className="text-xs text-slate-400">Intent:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-300">Hot</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs text-slate-300">Warm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-slate-300">Warming</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-300">Cool</span>
            </div>
          </div>
        </div>

        {/* SVG Canvas */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {/* Cluster boundaries */}
          {clusters.map(cluster => (
            <ClusterBoundary
              key={cluster.id}
              cluster={cluster}
              isSelected={selectedCluster?.id === cluster.id}
              onClick={onSelectCluster}
            />
          ))}

          {/* Lead points */}
          {leadPoints.map(point => (
            <LeadPoint
              key={point.id}
              point={point}
              cluster={clusterMap[point.clusterId]}
              onHover={onHoverPoint}
              onLeave={onLeavePoint}
            />
          ))}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPoint && (
            <PointTooltip
              point={hoveredPoint}
              cluster={clusterMap[hoveredPoint.clusterId]}
              position={{ x: hoveredPoint.x, y: hoveredPoint.y }}
            />
          )}
        </AnimatePresence>
      </GlassCardContent>
    </GlassCard>
  );
}

export default HiveCanvas;

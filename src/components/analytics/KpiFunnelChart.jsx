import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useReducedMotion, viewportSettings } from '../../hooks/useMotion';
import { GlassCard, GlassCardContent, GradientText } from '../futuristic';

const DEFAULT_FUNNEL_DATA = [
  { stage: 'Leads', value: 10000, color: '#06b6d4' },
  { stage: 'Qualified', value: 4500, color: '#8b5cf6' },
  { stage: 'Contacted', value: 3200, color: '#a855f7' },
  { stage: 'Replied', value: 1800, color: '#d946ef' },
  { stage: 'Meetings', value: 890, color: '#f43f5e' },
  { stage: 'Pipeline', value: 560, color: '#f97316' },
  { stage: 'Revenue', value: 280, color: '#10b981' },
];

const KpiFunnelChart = ({
  data = DEFAULT_FUNNEL_DATA,
  title = 'Pipeline Conversion Funnel',
  animate = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [animatedData, setAnimatedData] = useState(
    prefersReducedMotion ? data : data.map(d => ({ ...d, displayValue: 0 }))
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible && animate && !prefersReducedMotion) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setAnimatedData(
          data.map(d => ({
            ...d,
            displayValue: Math.round(d.value * progress),
          }))
        );
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    } else {
      setAnimatedData(data.map(d => ({ ...d, displayValue: d.value })));
    }
  }, [isVisible, data, animate, prefersReducedMotion]);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={viewportSettings}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.6 }}
    >
      <GlassCard variant="gradient" className="overflow-hidden">
        <GlassCardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 font-space-grotesk">
            <GradientText gradient="cyber">{title}</GradientText>
          </h3>

          <div className="space-y-3">
            {animatedData.map((item, index) => {
              const width = (item.displayValue / maxValue) * 100;
              return (
                <motion.div
                  key={item.stage}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{item.stage}</span>
                    <span className="text-sm font-bold text-white">
                      {item.displayValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, ${item.color}CC, ${item.color}66)`,
                        width: `${width}%`,
                      }}
                      initial={prefersReducedMotion ? { width: `${width}%` } : { width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    />
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${item.color}40)`,
                        width: `${width}%`,
                      }}
                    />
                  </div>
                  {index < animatedData.length - 1 && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {data[index + 1] && Math.round((data[index + 1].value / item.value) * 100)}% →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats */}
          {data.length > 0 && data[0]?.value > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {Math.round(((data[data.length - 1]?.value ?? 0) / (data[0]?.value ?? 1)) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Total Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(((data[4]?.value ?? 0) / (data[0]?.value ?? 1)) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Lead → Meeting</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  ${Math.round((data[data.length - 1]?.value ?? 0) * 15).toLocaleString()}K
                </div>
                <div className="text-xs text-gray-400">Pipeline Value</div>
              </div>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
};

KpiFunnelChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  animate: PropTypes.bool,
};

export default KpiFunnelChart;

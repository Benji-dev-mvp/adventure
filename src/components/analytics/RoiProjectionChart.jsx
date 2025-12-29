import React, { useMemo } from 'react';
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
  ReferenceLine,
} from 'recharts';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { useReducedMotion, viewportSettings } from '../../hooks/useMotion';
import { GlassCard, GlassCardContent, GradientText } from '../futuristic/index';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${(entry.value / 1000).toFixed(0)}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  label: PropTypes.string,
};

const RoiProjectionChart = ({
  seats = 5,
  avgAcv = 50000,
  currentMeetingsPerRep = 10,
  currentReplyRate = 5,
  title = 'Projected ROI with Ava',
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Calculate projection data based on inputs
  const projectionData = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const baselineMeetings = seats * currentMeetingsPerRep;
    const avaMeetings = baselineMeetings * 3; // 3x improvement

    // Build projection with cumulative tracking
    let cumulativeAvaTotal = 0;

    return months.map((month, index) => {
      // Ramp up Ava impact over first 3 months
      const avaRampup = Math.min(1, (index + 1) / 3);
      const meetingsWithAva = baselineMeetings + (avaMeetings - baselineMeetings) * avaRampup;

      // Convert meetings to pipeline (30% close rate, ACV)
      const baselinePipeline = baselineMeetings * 0.3 * avgAcv;
      const avaPipeline = meetingsWithAva * 0.3 * avgAcv;

      // Cumulative values
      const cumulativeBaseline = baselinePipeline * (index + 1);
      cumulativeAvaTotal += avaPipeline;

      return {
        month,
        baseline: Math.round(cumulativeBaseline),
        withAva: Math.round(cumulativeAvaTotal),
        savings: Math.round((avaPipeline - baselinePipeline) * (index + 1)),
      };
    });
  }, [seats, avgAcv, currentMeetingsPerRep]);

  // Calculate summary metrics
  const annualBaseline = projectionData[11]?.baseline || 0;
  const annualWithAva = projectionData[11]?.withAva || 0;
  const annualUplift = annualWithAva - annualBaseline;
  const roiPercent = Math.round((annualUplift / (seats * 3588)) * 100); // $299/mo * 12

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{ duration: 0.6 }}
    >
      <GlassCard variant="gradient" className="overflow-hidden">
        <GlassCardContent className="p-4">
          <h3 className="text-lg font-bold mb-6 font-space-grotesk">
            <GradientText gradient="cyber">{title}</GradientText>
          </h3>

          {/* Chart */}
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAva" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={value => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={annualBaseline}
                  stroke="#6b7280"
                  strokeDasharray="5 5"
                  label={{ value: 'Without Ava', fill: '#9ca3af', fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  name="Without Ava"
                  stroke="#6b7280"
                  strokeWidth={2}
                  fill="url(#colorBaseline)"
                  animationDuration={prefersReducedMotion ? 0 : 1500}
                />
                <Area
                  type="monotone"
                  dataKey="withAva"
                  name="With Ava"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="url(#colorAva)"
                  animationDuration={prefersReducedMotion ? 0 : 1500}
                  animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
            <motion.div
              className="text-center p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400">
                ${(annualUplift / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-400">Additional Pipeline</div>
            </motion.div>
            <motion.div
              className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            >
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-lg font-bold text-purple-400">{roiPercent}%</div>
              <div className="text-xs text-gray-400">ROI Year 1</div>
            </motion.div>
            <motion.div
              className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            >
              <Target className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <div className="text-lg font-bold text-emerald-400">3x</div>
              <div className="text-xs text-gray-400">Meeting Increase</div>
            </motion.div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
};

RoiProjectionChart.propTypes = {
  seats: PropTypes.number,
  avgAcv: PropTypes.number,
  currentMeetingsPerRep: PropTypes.number,
  currentReplyRate: PropTypes.number,
  title: PropTypes.string,
  animate: PropTypes.bool,
};

export default RoiProjectionChart;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Mail, Linkedin, Phone, MessageSquare } from 'lucide-react';
import { useReducedMotion, viewportSettings } from '../../hooks/useMotion';
import { GlassCard, GlassCardContent, GradientText } from '../futuristic';

const DEFAULT_CHANNEL_DATA = [
  { name: 'Email', value: 45, color: '#06b6d4', icon: Mail },
  { name: 'LinkedIn', value: 28, color: '#8b5cf6', icon: Linkedin },
  { name: 'Phone', value: 18, color: '#f97316', icon: Phone },
  { name: 'SMS', value: 9, color: '#10b981', icon: MessageSquare },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-gray-300 text-sm">{payload[0].value}% of outreach</p>
      </div>
    );
  }
  return null;
};

const ChannelMixChart = ({
  data = DEFAULT_CHANNEL_DATA,
  title = 'Channel Mix Distribution',
  showLegend = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

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

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    animationBegin={0}
                    animationDuration={prefersReducedMotion ? 0 : 1000}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="transparent"
                        style={{
                          filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                          transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with icons */}
            {showLegend && (
              <div className="w-full lg:w-1/2 space-y-4">
                {data.map((channel, index) => {
                  const Icon = channel.icon;
                  return (
                    <motion.div
                      key={channel.name}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={isVisible && !prefersReducedMotion ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        activeIndex === index ? 'bg-white/10' : 'bg-white/5'
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${channel.color}30` }}
                      >
                        <Icon size={20} style={{ color: channel.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{channel.name}</span>
                          <span className="text-lg font-bold" style={{ color: channel.color }}>
                            {channel.value}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: channel.color }}
                            initial={
                              prefersReducedMotion ? { width: `${channel.value}%` } : { width: 0 }
                            }
                            animate={isVisible ? { width: `${channel.value}%` } : {}}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance metrics */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Avg Reply Rate', value: '24%', color: 'cyan' },
              { label: 'Deliverability', value: '98.5%', color: 'emerald' },
              { label: 'Bounce Rate', value: '0.8%', color: 'orange' },
              { label: 'Open Rate', value: '47%', color: 'purple' },
            ].map((metric, i) => (
              <div key={metric.label} className="text-center">
                <div className={`text-xl font-bold text-${metric.color}-400`}>{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};

ChannelMixChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ),
  title: PropTypes.string,
  showLegend: PropTypes.bool,
};

export default ChannelMixChart;

/**
 * ResultsShowcase.jsx
 *
 * Data-driven results visualization with autonomous animations,
 * real metrics, and interactive hover states.
 *
 * CTO Design Principles:
 * - Metrics are the hero
 * - Animation serves understanding
 * - Progressive disclosure on hover
 * - Mobile-first responsive design
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Target,
  Mail,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Building2,
  Award,
  Zap,
} from 'lucide-react';
import { GlassCard, GradientText, RevealText, CountUpText } from '../futuristic';

// ============================================================================
// DATA
// ============================================================================

const CUSTOMER_RESULTS = [
  {
    company: 'TechCorp Solutions',
    industry: 'SaaS',
    logo: 'TC',
    color: 'cyan',
    results: [
      { metric: 'Pipeline Generated', before: 450000, after: 2100000, format: 'currency' },
      { metric: 'Meeting Rate', before: 1.2, after: 4.7, format: 'percent' },
      { metric: 'Time to First Meeting', before: 18, after: 3.2, format: 'days', inverse: true },
      { metric: 'SDR Productivity', before: 100, after: 340, format: 'percent' },
    ],
    quote:
      'Ava booked 47 meetings in our first month. Our SDRs now focus on closing instead of prospecting.',
    author: 'Sarah Chen',
    role: 'VP of Sales',
    timeline: '90 days',
  },
  {
    company: 'Growth Industries',
    industry: 'FinTech',
    logo: 'GI',
    color: 'purple',
    results: [
      { metric: 'Pipeline Generated', before: 800000, after: 3600000, format: 'currency' },
      { metric: 'Meeting Rate', before: 2.1, after: 8.4, format: 'percent' },
      { metric: 'Time to First Meeting', before: 14, after: 2.8, format: 'days', inverse: true },
      { metric: 'SDR Productivity', before: 100, after: 420, format: 'percent' },
    ],
    quote: 'We replaced 8 tools with Ava. The ROI was clear in week one.',
    author: 'Michael Ross',
    role: 'CRO',
    timeline: '60 days',
  },
  {
    company: 'Enterprise Systems',
    industry: 'Enterprise',
    logo: 'ES',
    color: 'pink',
    results: [
      { metric: 'Pipeline Generated', before: 1200000, after: 4800000, format: 'currency' },
      { metric: 'Meeting Rate', before: 1.8, after: 6.2, format: 'percent' },
      { metric: 'Time to First Meeting', before: 21, after: 4.1, format: 'days', inverse: true },
      { metric: 'SDR Productivity', before: 100, after: 380, format: 'percent' },
    ],
    quote: 'Finally, enterprise-grade AI that our security team approved on first review.',
    author: 'Jennifer Walsh',
    role: 'CISO',
    timeline: '120 days',
  },
];

const AGGREGATE_METRICS = [
  {
    label: 'Meetings Booked',
    value: 847000,
    trend: '+23%',
    trendUp: true,
    icon: Calendar,
    color: 'cyan',
  },
  {
    label: 'Pipeline Value',
    value: 2.4,
    suffix: 'B',
    prefix: '$',
    trend: '+34%',
    trendUp: true,
    icon: DollarSign,
    color: 'purple',
  },
  {
    label: 'Hours Saved',
    value: 12.8,
    suffix: 'M',
    trend: '+18%',
    trendUp: true,
    icon: Clock,
    color: 'emerald',
  },
  {
    label: 'Enterprise Teams',
    value: 2500,
    suffix: '+',
    trend: '+12%',
    trendUp: true,
    icon: Building2,
    color: 'pink',
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Animated metric card with before/after
const MetricCard = ({ metric, isVisible, delay }) => {
  const improvement = metric.inverse
    ? (((metric.before - metric.after) / metric.before) * 100).toFixed(0)
    : (((metric.after - metric.before) / metric.before) * 100).toFixed(0);

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return value >= 1000000
          ? `$${(value / 1000000).toFixed(1)}M`
          : `$${(value / 1000).toFixed(0)}K`;
      case 'percent':
        return `${value}%`;
      case 'days':
        return `${value} days`;
      default:
        return value;
    }
  };

  return (
    <div
      className="relative group p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Before/After comparison */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500">Before</div>
        <div className="flex-1 mx-3 h-px bg-gradient-to-r from-red-500/50 via-transparent to-emerald-500/50" />
        <div className="text-xs text-gray-500">After</div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-lg text-red-400/80 line-through font-medium">
          {formatValue(metric.before, metric.format)}
        </div>
        <ArrowUpRight size={20} className="text-emerald-400" />
        <div className="text-lg font-bold text-emerald-400">
          {isVisible ? formatValue(metric.after, metric.format) : '—'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{metric.metric}</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          +{improvement}%
        </span>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

MetricCard.propTypes = {
  metric: PropTypes.shape({
    before: PropTypes.number.isRequired,
    after: PropTypes.number.isRequired,
    format: PropTypes.string,
    inverse: PropTypes.bool,
    metric: PropTypes.string.isRequired,
  }).isRequired,
  isVisible: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
};

// Customer result card
const CustomerCard = ({ customer, isActive, onClick }) => {
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer p-4 rounded-lg border transition-all duration-500 ${
        isActive
          ? `bg-gradient-to-br from-${customer.color}-500/20 to-${customer.color}-600/10 border-${customer.color}-500/50 shadow-lg shadow-${customer.color}-500/10`
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-9 rounded-lg bg-gradient-to-br from-${customer.color}-500 to-${customer.color}-600 flex items-center justify-center text-white font-bold`}
        >
          {customer.logo}
        </div>
        <div>
          <h4 className="font-semibold text-white">{customer.company}</h4>
          <p className="text-xs text-gray-400">{customer.industry}</p>
        </div>
        {isActive && (
          <div className="ml-auto">
            <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white">
              {customer.timeline}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.shape({
    company: PropTypes.string.isRequired,
    industry: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    timeline: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Aggregate stat card
const StatCard = ({ stat, isVisible, delay }) => {
  const Icon = stat.icon;

  return (
    <div
      className="relative group p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <Icon size={24} className={`text-${stat.color}-400`} />
          <div
            className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {stat.trend}
          </div>
        </div>

        <div className="text-lg lg:text-4xl font-bold text-white mb-1">
          {stat.prefix}
          <CountUpText
            end={isVisible ? stat.value : 0}
            duration={2000}
            delay={delay}
            decimals={stat.value < 100 ? 1 : 0}
          />
          {stat.suffix}
        </div>

        <div className="text-sm text-gray-400">{stat.label}</div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  stat: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    trend: PropTypes.string,
    trendUp: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  isVisible: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ResultsShowcase = () => {
  const [activeCustomer, setActiveCustomer] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate customers
  useEffect(() => {
    if (!isVisible || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveCustomer(prev => (prev + 1) % CUSTOMER_RESULTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, isAutoPlaying]);

  const currentCustomer = CUSTOMER_RESULTS[activeCustomer];

  return (
    <section
      ref={containerRef}
      id="results-showcase"
      className="py-20 lg:py-28 px-4 lg:px-4 relative overflow-hidden bg-[#030712]"
    >
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-radial from-emerald-900/20 to-transparent blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Award size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Verified Results</span>
            </div>

            <h2 className="text-lg lg:text-5xl xl:text-6xl font-bold mb-4 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Results Your Peers Achieved
              </GradientText>
            </h2>

            <p className="text-lg lg:text-lg text-gray-400 max-w-3xl mx-auto">
              Real metrics from real teams. No fluff, just outcomes.
            </p>
          </div>
        </RevealText>

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3 mb-12 lg:mb-16">
          {AGGREGATE_METRICS.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} isVisible={isVisible} delay={index * 150} />
          ))}
        </div>

        {/* Customer results */}
        <RevealText delay={300}>
          <GlassCard variant="gradient" className="p-4 lg:p-4" glow glowColor="purple">
            <div className="grid lg:grid-cols-3 gap-3 lg:gap-3">
              {/* Customer selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Customer Stories</h3>
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {isAutoPlaying ? 'Pause' : 'Auto-play'}
                  </button>
                </div>

                {CUSTOMER_RESULTS.map((customer, index) => (
                  <CustomerCard
                    key={customer.company}
                    customer={customer}
                    isActive={activeCustomer === index}
                    onClick={() => {
                      setActiveCustomer(index);
                      setIsAutoPlaying(false);
                    }}
                  />
                ))}
              </div>

              {/* Results grid */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{currentCustomer.company} Results</h3>
                  <span className="text-xs text-gray-400">
                    Achieved in {currentCustomer.timeline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentCustomer.results.map((metric, index) => (
                    <MetricCard
                      key={metric.metric}
                      metric={metric}
                      isVisible={isVisible}
                      delay={index * 100}
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-gray-300 italic mb-3">"{currentCustomer.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br from-${currentCustomer.color}-500 to-${currentCustomer.color}-600 flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {currentCustomer.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{currentCustomer.author}</p>
                      <p className="text-xs text-gray-400">{currentCustomer.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {CUSTOMER_RESULTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCustomer(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeCustomer === index
                      ? 'w-6 bg-gradient-to-r from-cyan-500 to-purple-500'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </GlassCard>
        </RevealText>
      </div>
    </section>
  );
};

export default ResultsShowcase;

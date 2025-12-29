/**
 * WorkspaceHome - Segment-Aware Dashboard Home
 *
 * Displays plan-specific content, charts, and CTAs based on tenant segment.
 * - Startups: ROI focus, Ava automation emphasis
 * - Midmarket: Efficiency focus, campaign automation
 * - Enterprise: Full control, security/compliance, analytics
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTenant } from '../contexts/TenantContext';
import { useWorkspaceMetrics, useSegmentCTA } from '../hooks/useWorkspaceMetrics';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import {
  KpiFunnelChart,
  ChannelMixChart,
  RoiProjectionChart,
  CustomerImpactSparklines,
} from '../components/analytics';
import { GlassCard, GlassCardContent, GradientText } from '../components/futuristic';
import {
  Sparkles,
  TrendingUp,
  Users,
  Mail,
  Shield,
  Lock,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  Bot,
  Rocket,
  Building2,
  Crown,
} from 'lucide-react';

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

const AnimatedCounter = ({ end, duration = 1500, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, prefersReducedMotion]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const LivePulse = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </span>
);

// ============================================================================
// SEGMENT-SPECIFIC HERO COMPONENTS
// ============================================================================

const StartupHero = ({ metrics, cta, navigate }) => {
  const prefersReducedMotion = useReducedMotion();
  const motionConfig = getMotionConfig('fadeInUp');

  return (
    <motion.div
      {...(prefersReducedMotion ? {} : motionConfig)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8 mb-8"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl opacity-30" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-6 w-6 text-cyan-400" />
            <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
              <LivePulse />
              <span className="ml-2">Ava is active</span>
            </Badge>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-space-grotesk">
            <GradientText gradient="cyber">
              {metrics?.headline || 'Let Ava run your outbound'}
            </GradientText>
          </h1>

          <p className="text-lg text-slate-300 mb-6 max-w-xl">
            Your AI SDR is working around the clock. She's already booked{' '}
            <span className="text-cyan-400 font-semibold">
              <AnimatedCounter end={metrics?.summary?.meetingsBooked || 0} />
            </span>{' '}
            meetings and generated{' '}
            <span className="text-green-400 font-semibold">
              $
              <AnimatedCounter
                end={Math.round((metrics?.summary?.pipelineValue || 0) / 1000)}
                suffix="K"
              />
            </span>{' '}
            in pipeline this month.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold"
              onClick={() => navigate(cta?.path || '/ava')}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {cta?.label || 'Talk to Ava'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
              <BarChart3 className="h-5 w-5 mr-2" />
              View Results
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 lg:w-72">
          <QuickStatCard
            label="Meetings"
            value={<AnimatedCounter end={metrics?.summary?.meetingsBooked || 0} />}
            icon={<Users className="h-5 w-5 text-cyan-400" />}
            trend="+24%"
          />
          <QuickStatCard
            label="Pipeline"
            value={
              <>
                $
                <AnimatedCounter
                  end={Math.round((metrics?.summary?.pipelineValue || 0) / 1000)}
                  suffix="K"
                />
              </>
            }
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
            trend="+65%"
          />
          <QuickStatCard
            label="Hours Saved"
            value={<AnimatedCounter end={metrics?.summary?.timeSavedHours || 0} />}
            icon={<Zap className="h-5 w-5 text-yellow-400" />}
            trend="This week"
          />
          <QuickStatCard
            label="Emails Sent"
            value={<AnimatedCounter end={metrics?.summary?.emailsSent || 0} />}
            icon={<Mail className="h-5 w-5 text-purple-400" />}
            trend="Automated"
          />
        </div>
      </div>
    </motion.div>
  );
};

const MidmarketHero = ({ metrics, cta, navigate }) => {
  const prefersReducedMotion = useReducedMotion();
  const motionConfig = getMotionConfig('fadeInUp');

  return (
    <motion.div
      {...(prefersReducedMotion ? {} : motionConfig)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/10 p-8 mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl opacity-30" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="h-6 w-6 text-purple-400" />
            <Badge variant="outline" className="border-purple-400/50 text-purple-400">
              <span className="font-semibold">80%</span>
              <span className="ml-1">Automation Rate</span>
            </Badge>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-space-grotesk">
            <GradientText gradient="sunset">
              {metrics?.headline || 'Automate 80% of outbound'}
            </GradientText>
          </h1>

          <p className="text-lg text-slate-300 mb-6 max-w-xl">
            Your team is crushing it.{' '}
            <span className="text-purple-400 font-semibold">
              {metrics?.summary?.activeCampaigns || 0} campaigns
            </span>{' '}
            running,{' '}
            <span className="text-pink-400 font-semibold">
              <AnimatedCounter end={metrics?.summary?.avaAutomatedTasks || 0} />
            </span>{' '}
            tasks automated. Focus on what matters—closing deals.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold"
              onClick={() => navigate(cta?.path || '/campaigns')}
            >
              <Target className="h-5 w-5 mr-2" />
              {cta?.label || 'Manage Campaigns'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/analytics')}>
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:w-72">
          <QuickStatCard
            label="Campaigns"
            value={<AnimatedCounter end={metrics?.summary?.activeCampaigns || 0} />}
            icon={<Target className="h-5 w-5 text-purple-400" />}
            trend="Active"
          />
          <QuickStatCard
            label="Efficiency"
            value="3.2x"
            icon={<Zap className="h-5 w-5 text-pink-400" />}
            trend="+1.8x"
          />
          <QuickStatCard
            label="Pipeline"
            value={
              <>
                $
                <AnimatedCounter
                  end={Math.round(((metrics?.summary?.pipelineValue || 0) / 1000000) * 10) / 10}
                  suffix="M"
                />
              </>
            }
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
            trend="+85%"
          />
          <QuickStatCard
            label="Team Hours"
            value={<AnimatedCounter end={metrics?.summary?.timeSavedHours || 0} />}
            icon={<Users className="h-5 w-5 text-orange-400" />}
            trend="Saved/mo"
          />
        </div>
      </div>
    </motion.div>
  );
};

const EnterpriseHero = ({ metrics, cta, navigate }) => {
  const prefersReducedMotion = useReducedMotion();
  const motionConfig = getMotionConfig('fadeInUp');

  return (
    <motion.div
      {...(prefersReducedMotion ? {} : motionConfig)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-800/50 border border-white/10 p-8 mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl opacity-20" />

      <div className="relative z-10">
        {/* Security badges strip */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Crown className="h-6 w-6 text-amber-400" />
          <Badge variant="outline" className="border-amber-400/50 text-amber-400">
            Enterprise
          </Badge>
          {metrics?.securityBadges?.map((badge, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-slate-700/50 text-slate-300 border-slate-600"
            >
              <Shield className="h-3 w-3 mr-1" />
              {badge}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-space-grotesk">
              <GradientText gradient="cyber">
                {metrics?.headline || 'Full control at enterprise scale'}
              </GradientText>
            </h1>

            <p className="text-lg text-slate-300 mb-6 max-w-xl">
              <span className="text-cyan-400 font-semibold">
                <AnimatedCounter end={metrics?.roiConfig?.seats || 0} />
              </span>{' '}
              seats active across your organization.{' '}
              <span className="text-green-400 font-semibold">
                $
                <AnimatedCounter
                  end={Math.round(((metrics?.summary?.pipelineValue || 0) / 1000000) * 10) / 10}
                  suffix="M"
                />
              </span>{' '}
              pipeline this quarter. Full visibility. Total control.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold"
                onClick={() => navigate(cta?.path || '/analytics')}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {cta?.label || 'Open Control Plane'}
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/admin')}>
                <Lock className="h-5 w-5 mr-2" />
                Admin Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-80">
            <QuickStatCard
              label="Total Seats"
              value={<AnimatedCounter end={metrics?.roiConfig?.seats || 0} />}
              icon={<Building2 className="h-5 w-5 text-cyan-400" />}
              trend="Active"
            />
            <QuickStatCard
              label="Pipeline"
              value={
                <>
                  $
                  <AnimatedCounter
                    end={Math.round(((metrics?.summary?.pipelineValue || 0) / 1000000) * 10) / 10}
                    suffix="M"
                  />
                </>
              }
              icon={<TrendingUp className="h-5 w-5 text-green-400" />}
              trend="+125%"
            />
            <QuickStatCard
              label="Compliance"
              value="99.2%"
              icon={<Shield className="h-5 w-5 text-amber-400" />}
              trend="Score"
            />
            <QuickStatCard
              label="Uptime"
              value="99.99%"
              icon={<Zap className="h-5 w-5 text-purple-400" />}
              trend="SLA"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const QuickStatCard = ({ label, value, icon, trend }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      {icon}
      <span className="text-xs text-slate-400">{trend}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const QuickActionCard = ({ title, description, icon: Icon, path, color = 'cyan' }) => {
  const navigate = useNavigate();
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/50',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-400/50',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-400/50',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30 hover:border-green-400/50',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 hover:border-orange-400/50',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[color]} border p-5 cursor-pointer transition-all duration-200`}
      onClick={() => navigate(path)}
    >
      <div className="flex items-start justify-between">
        <div>
          <Icon className={`h-8 w-8 mb-3 text-${color}-400`} />
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-500" />
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WorkspaceHome = () => {
  const navigate = useNavigate();
  const { plan, isStartup, isMidmarket, isEnterprise } = useTenant();
  const { metrics, isLoading, kpiFunnel, channelMix, roiConfig, sparklines } =
    useWorkspaceMetrics();
  const segmentCTA = useSegmentCTA();
  const prefersReducedMotion = useReducedMotion();

  // Plan-specific quick actions
  const quickActions = useMemo(() => {
    if (isEnterprise) {
      return [
        {
          title: 'Analytics Dashboard',
          description: 'Full pipeline visibility',
          icon: BarChart3,
          path: '/analytics',
          color: 'cyan',
        },
        {
          title: 'Team Management',
          description: 'Manage seats & permissions',
          icon: Users,
          path: '/admin',
          color: 'purple',
        },
        {
          title: 'Campaigns',
          description: '48 active campaigns',
          icon: Target,
          path: '/campaigns',
          color: 'pink',
        },
        {
          title: 'Compliance Center',
          description: 'Security & audit logs',
          icon: Shield,
          path: '/audit-log',
          color: 'green',
        },
      ];
    }
    if (isMidmarket) {
      return [
        {
          title: 'Campaign Center',
          description: 'Manage all campaigns',
          icon: Target,
          path: '/campaigns',
          color: 'purple',
        },
        {
          title: 'Analytics',
          description: 'Performance insights',
          icon: BarChart3,
          path: '/analytics',
          color: 'cyan',
        },
        {
          title: 'Ava AI',
          description: 'Your AI SDR assistant',
          icon: Bot,
          path: '/ava',
          color: 'pink',
        },
        {
          title: 'Templates',
          description: 'Email & sequence library',
          icon: Mail,
          path: '/templates',
          color: 'orange',
        },
      ];
    }
    // Startup
    return [
      {
        title: 'Talk to Ava',
        description: 'Your AI SDR is ready',
        icon: Bot,
        path: '/ava',
        color: 'cyan',
      },
      {
        title: 'View Pipeline',
        description: 'See your results',
        icon: TrendingUp,
        path: '/dashboard',
        color: 'green',
      },
      {
        title: 'Leads',
        description: 'Manage your prospects',
        icon: Users,
        path: '/leads',
        color: 'purple',
      },
      {
        title: 'Campaigns',
        description: 'Set up sequences',
        icon: Mail,
        path: '/campaigns',
        color: 'pink',
      },
    ];
  }, [isStartup, isMidmarket, isEnterprise]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Segment-specific Hero */}
        {isEnterprise && (
          <EnterpriseHero metrics={metrics} cta={segmentCTA.cta} navigate={navigate} />
        )}
        {isMidmarket && (
          <MidmarketHero metrics={metrics} cta={segmentCTA.cta} navigate={navigate} />
        )}
        {isStartup && <StartupHero metrics={metrics} cta={segmentCTA.cta} navigate={navigate} />}

        {/* Quick Actions Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <QuickActionCard key={action.path} {...action} />
            ))}
          </div>
        </motion.div>

        {/* Charts Section - Different layouts by segment */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Performance Overview</h2>

          {isStartup && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RoiProjectionChart {...roiConfig} title="Your ROI with Ava" />
              <KpiFunnelChart data={kpiFunnel} title="Your Pipeline Funnel" />
            </div>
          )}

          {isMidmarket && (
            <div className="space-y-6 mb-8">
              <CustomerImpactSparklines
                metrics={sparklines.map(s => ({
                  ...s,
                  icon:
                    s.id === 'meetings'
                      ? Users
                      : s.id === 'replies'
                        ? Mail
                        : s.id === 'pipeline'
                          ? TrendingUp
                          : Zap,
                  chartType: 'area',
                }))}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KpiFunnelChart data={kpiFunnel} title="Pipeline Funnel" />
                <ChannelMixChart data={channelMix} title="Channel Distribution" />
              </div>
            </div>
          )}

          {isEnterprise && (
            <div className="space-y-6 mb-8">
              <CustomerImpactSparklines
                metrics={sparklines.map(s => ({
                  ...s,
                  icon:
                    s.id === 'meetings'
                      ? Users
                      : s.id === 'replies'
                        ? Mail
                        : s.id === 'pipeline'
                          ? TrendingUp
                          : s.id === 'compliance'
                            ? Shield
                            : Zap,
                  chartType: 'area',
                }))}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <KpiFunnelChart data={kpiFunnel} title="Enterprise Pipeline" />
                <ChannelMixChart data={channelMix} title="Channel Mix" />
                <RoiProjectionChart {...roiConfig} title="ROI Projection" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Segment-specific upsell/cross-sell */}
        {!isEnterprise && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <GlassCard variant="gradient" className="border-dashed border-amber-500/30">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/20">
                      <Crown className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {isStartup ? 'Unlock Team Features' : 'Upgrade to Enterprise'}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {isStartup
                          ? 'Add more seats and unlock campaign automation'
                          : 'SSO, advanced security, dedicated support, and custom integrations'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10"
                    onClick={() => navigate('/pricing')}
                  >
                    View Plans
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkspaceHome;

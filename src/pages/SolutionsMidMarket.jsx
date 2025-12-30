import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppShell from '../components/layout/AppShell';
import MidMarketFlowOrchestration from '../components/solutions/MidMarketFlowOrchestration';
import { SOLUTIONS_DATA } from '../config/solutionsDataFactory';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import {
  ChannelMixChart,
  RoiProjectionChart,
  CustomerImpactSparklines,
} from '../components/analytics';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  FloatingParticles,
  ParticleBackground,
} from '../components/futuristic';

const { features: FEATURES, benefits: BENEFITS, languages: LANGUAGES, stats: MIDMARKET_STATS } = SOLUTIONS_DATA.midmarket;

const SolutionsMidMarket = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeIn} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              For Midmarket
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              <GradientText gradient="aurora">Scale Without Chaos</GradientText>
            </h1>
            <p className="text-lg text-gray-300 mb-4 font-space-grotesk">
              Automate 80% of Manual Tasks
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Streamline your existing outbound workflow while keeping your team in control. Boost
              rep efficiency 3x, eliminate data entry, and orchestrate multichannel sequences from
              one platform.
            </p>

            {/* Quick Stats */}
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10"
            >
              {MIDMARKET_STATS.map((stat, index) => (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover className="text-center">
                    <div className="text-lg font-bold font-space-grotesk mb-1">
                      <GradientText gradient="cyber">{stat.value}</GradientText>
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Sparkles size={18} />
                  Start Free Trial
                </GlowButton>
              </Link>
              <Link to="/ai-tour">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  <Play size={18} />
                  Watch Ava in Action
                </GlowButtonOutline>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Channel Mix Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <FloatingParticles count={15} color="purple" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4">
                Multichannel Orchestration
              </p>
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">One Platform, Every Channel</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how your outreach performs across email, LinkedIn, phone, and SMS — all
                coordinated by Ava
              </p>
            </div>
          </RevealText>

          <ChannelMixChart />
        </div>
      </section>

      {/* Flow Orchestration */}
      <MidMarketFlowOrchestration />

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
                Built for Growing Teams
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">Everything You Need to Scale</GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Replace your fragmented sales stack with a unified platform that grows with you
              </p>
            </div>
          </RevealText>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 gap-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="gradient" hover className="h-full">
                    <GlassCardContent className="p-4">
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Calculate Your Pipeline Growth</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how Ava accelerates your pipeline compared to manual outbound
              </p>
            </div>
          </RevealText>

          <RoiProjectionChart
            defaultSeats={10}
            defaultAcv={35000}
            defaultMeetings={25}
            showControls
          />
        </div>
      </section>

      {/* Customer Impact */}
      <section className="py-20 px-4 relative overflow-hidden">
        <FloatingParticles count={20} color="cyan" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Real Results from Real Teams</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how midmarket companies are transforming their outbound with Ava
              </p>
            </div>
          </RevealText>

          <CustomerImpactSparklines />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
                <TrendingUp className="w-4 h-4" />
                Scale Efficiently
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">Why Midmarket Teams Choose Artisan</GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Boost productivity without adding headcount. Get enterprise-grade capabilities at
                midmarket pricing.
              </p>
            </div>
          </RevealText>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover glow className="h-full">
                    <GlassCardContent className="p-4">
                      <div
                        className={`w-12 h-9 rounded-lg bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Ready to 3x Your Team's Efficiency?
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join growing midmarket teams scaling their outbound with Ava
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="xl" glow className="gap-2">
                  <Sparkles size={20} />
                  Start Free Trial
                </GlowButton>
              </Link>
              <Link to="/pricing#contact-sales">
                <GlowButtonOutline variant="secondary" size="xl" className="gap-2">
                  <Phone size={18} />
                  Talk to Sales
                </GlowButtonOutline>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Full deployment in 2 weeks
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Dedicated onboarding
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default SolutionsMidMarket;

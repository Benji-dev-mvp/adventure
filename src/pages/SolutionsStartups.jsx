import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppShell from '../components/layout/AppShell';
import StartupsFlowOrchestration from '../components/solutions/StartupsFlowOrchestration';
import { SOLUTIONS_DATA } from '../config/solutionsDataFactory';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import {
  RoiProjectionChart,
  KpiFunnelChart,
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

const { features: FEATURES, benefits: BENEFITS, languages: LANGUAGES, stats: STARTUP_STATS } = SOLUTIONS_DATA.startup;

const SolutionsStartups = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const slideUp = getMotionConfig('slideUp', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeIn} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4" />
              For Startups
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              <GradientText gradient="aurora">Hire Ava, Not a BDR</GradientText>
            </h1>
            <p className="text-lg text-gray-300 mb-4 font-space-grotesk">
              Your Outbound, Done For You
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Keep your team lean and efficient while Ava manages your entire outbound operation. Go
              live in 3 days, save \$450K vs. hiring, and book 10x more meetings.
            </p>

            {/* Quick Stats */}
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10"
            >
              {STARTUP_STATS.map((stat, index) => (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover className="text-center">
                    <div className="text-lg font-bold font-space-grotesk mb-1">
                      <GradientText gradient="cyber">
                        {stat.value}
                        {stat.suffix || ''}
                      </GradientText>
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

      {/* ROI Calculator Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <FloatingParticles count={15} color="cyan" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4">
                See Your Projected ROI
              </p>
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Calculate Your Pipeline Growth</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Adjust the sliders to see how Ava accelerates your pipeline compared to manual
                outbound
              </p>
            </div>
          </RevealText>

          <RoiProjectionChart
            defaultSeats={2}
            defaultAcv={15000}
            defaultMeetings={8}
            showControls
          />
        </div>
      </section>

      {/* Flow Orchestration */}
      <StartupsFlowOrchestration />

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
                Finding Product-Market Fit?
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">Use Artisan to Find Your ICP</GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our platform provides a robust testing ground to hone in on your ideal customer
                profile and messaging
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

      {/* Funnel Visualization */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Watch Your Pipeline Convert</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                From lead discovery to booked meetings — see how Ava moves prospects through your
                funnel
              </p>
            </div>
          </RevealText>

          <KpiFunnelChart />
        </div>
      </section>

      {/* Global Coverage */}
      <section className="py-20 px-4 relative overflow-hidden">
        <FloatingParticles count={20} color="purple" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <Globe className="w-12 h-9 text-blue-400" />
                <div className="text-left">
                  <div className="text-5xl font-bold font-space-grotesk">
                    <GradientText gradient="cyber">200+</GradientText>
                  </div>
                  <div className="text-lg text-gray-400">Countries Covered</div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-space-grotesk">
                B2B Data Coverage Worldwide
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                Ava has data coverage globally, complementing her ability to research and write
                emails in over 40 languages.
              </p>

              {/* Language Flags */}
              <motion.div
                {...staggerContainer}
                className="flex items-center justify-center gap-3 flex-wrap mb-8"
              >
                {LANGUAGES.map((lang, idx) => (
                  <motion.div
                    key={idx}
                    {...staggerItem}
                    className="flex flex-col items-center gap-2"
                  >
                    <GlassCard
                      variant="default"
                      hover
                      className="w-16 h-16 flex items-center justify-center"
                    >
                      <span className="text-lg">{lang.flag}</span>
                    </GlassCard>
                    <span className="text-sm text-gray-400">{lang.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold mb-4">
                <DollarSign className="w-4 h-4" />
                Save Time & Money
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">Why Startups Choose Artisan</GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Consolidate your sales enablement stack, achieve lower cost per meeting, and scale
                seamlessly
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
                Ready to Scale Like the Top 1%?
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join hundreds of startups already scaling with Ava as their AI BDR
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
                Go live in 3 days
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Cancel anytime
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default SolutionsStartups;

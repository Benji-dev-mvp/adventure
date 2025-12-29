import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Workflow, 
  Server, 
  Shield, 
  Users, 
  Sparkles,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Rocket,
  Building2,
  Building,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import HeroSection from '../components/features/HeroSection';
import CustomerShowcase from '../components/features/CustomerShowcase';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import { 
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  FloatingParticles,
  ParticleBackground,
  FeatureCard,
} from '../components/futuristic';

const TRUST_STATS = [
  { value: '99.95%', label: 'Platform Uptime (90d)' },
  { value: 'SOC 2', label: 'Type II Attested' },
  { value: 'SSO/SCIM', label: 'Identity & Provisioning' },
  { value: '24/7', label: 'Enterprise Support' },
];

const PAGE_TEASERS = [
  {
    path: '/ai-tour',
    icon: Play,
    title: 'Watch Ava in Action',
    description: 'Experience a 60-second AI-led product tour showing how Ava automates your entire outbound workflow.',
    cta: 'Start AI Tour',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    path: '/flow',
    icon: Workflow,
    title: 'See the Complete Flow',
    description: 'From lead discovery to booked meetings — visualize the 8-step pipeline that runs on autopilot.',
    cta: 'View Architecture',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    path: '/platform',
    icon: Server,
    title: 'Explore the Platform',
    description: 'Everything you need for outbound success: AI personalization, multi-channel sequences, and deep integrations.',
    cta: 'See Features',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    path: '/security',
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II, GDPR compliant, SSO/SAML, and full audit trails. Built for enterprise from day one.',
    cta: 'Security Details',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    path: '/customers',
    icon: Users,
    title: 'Customer Results',
    description: 'See how companies like TechCorp 3x\'d their pipeline and reduced time-to-meeting by 73%.',
    cta: 'Read Case Studies',
    gradient: 'from-violet-500 to-purple-500',
  },
];

const QUICK_WINS = [
  { icon: Target, value: '3x', label: 'Pipeline increase in 90 days' },
  { icon: Zap, value: '80%', label: 'Time saved on outbound' },
  { icon: BarChart3, value: '73%', label: 'Faster time to meeting' },
];

const SOLUTIONS_BY_SIZE = [
  {
    path: '/solutions/startups',
    icon: Rocket,
    title: 'For Startups',
    tagline: 'Stay Lean, Move Fast',
    description: 'Hire Ava to manage your entire outbound operation, keeping your team lean and efficient while you scale.',
    benefits: ['Skip hiring your first BDR', 'Pay for results, not headcount', 'Full outbound on autopilot'],
    gradient: 'from-cyan-500 to-blue-500',
    stat: { value: '$450K', label: 'saved vs. hiring' },
  },
  {
    path: '/solutions/midmarket',
    icon: Building2,
    title: 'For Midmarket',
    tagline: 'Scale Without Chaos',
    description: 'Streamline your existing outbound workflow by automating 80% of manual tasks while keeping your team in control.',
    benefits: ['Boost rep efficiency 3x', 'Eliminate manual data entry', 'Unified multichannel orchestration'],
    gradient: 'from-purple-500 to-pink-500',
    stat: { value: '80%', label: 'tasks automated' },
  },
  {
    path: '/solutions/enterprise',
    icon: Building,
    title: 'For Enterprise',
    tagline: 'Power Meets Governance',
    description: 'Equip your team with top-tier tools for each stage of the outbound cycle, with an AI colleague keeping everything on track.',
    benefits: ['SOC 2 Type II compliant', 'SSO/SAML + SCIM', 'Custom SLAs & dedicated CSM'],
    gradient: 'from-orange-500 to-red-500',
    stat: { value: '99.95%', label: 'uptime SLA' },
  },
];

const HomePage = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const slideUp = getMotionConfig('slideUp', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  return (
    <AppShell>
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Stats Bar */}
      <section className="relative py-12 border-y border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/50 to-slate-950" />
        <FloatingParticles count={20} color="mixed" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_STATS.map((stat, index) => (
              <RevealText key={index} delay={index * 100}>
                <GlassCard variant="default" hover glow glowColor="cyan" className="text-center">
                  <div className="text-4xl font-bold mb-2 font-space-grotesk">
                    <GradientText gradient="cyber" animate>{stat.value}</GradientText>
                  </div>
                  <div className="text-purple-200">{stat.label}</div>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise-grade Outbound OS Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4">
                Enterprise-ready from day one
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="cyber">
                  The operating system for compliant, AI-led outbound
                </GradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Replace fragmented tooling with governed automation, enterprise identity, 
                and live controls your security and revenue leaders agree on.
              </p>
            </div>
          </RevealText>

          {/* Quick Wins */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {QUICK_WINS.map((win, index) => {
              const Icon = win.icon;
              return (
                <RevealText key={index} delay={index * 100}>
                  <GlassCard variant="gradient" hover glow glowColor="purple" className="text-center py-8">
                    <GlassCardContent>
                      <Icon size={40} className="mx-auto mb-4 text-cyan-400" />
                      <div className="text-5xl font-bold mb-2 font-space-grotesk">
                        <GradientText gradient="aurora" animate>{win.value}</GradientText>
                      </div>
                      <div className="text-gray-300">{win.label}</div>
                    </GlassCardContent>
                  </GlassCard>
                </RevealText>
              );
            })}
          </div>

          {/* CTA Row */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ai-tour">
              <GlowButton variant="primary" size="lg" glow className="gap-2">
                <Play size={18} />
                Watch 60s AI Tour
              </GlowButton>
            </Link>
            <Link to="/flow">
              <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                <Workflow size={18} />
                View the End-to-End Flow
              </GlowButtonOutline>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions by Team Size */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950 to-transparent" />
        <FloatingParticles count={15} color="mixed" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            {...fadeIn}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
              Solutions by team size
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora">
                Built for teams at every stage
              </GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're a lean startup or a global enterprise, Ava adapts to your workflow
            </p>
          </motion.div>

          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {SOLUTIONS_BY_SIZE.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div key={solution.path} {...staggerItem}>
                  <Link to={solution.path} className="block group h-full">
                    <GlassCard 
                      variant="gradient" 
                      hover 
                      glow
                      glowColor={index === 0 ? 'cyan' : index === 1 ? 'purple' : 'orange'}
                      className="h-full transition-all duration-500 group-hover:border-white/30"
                    >
                      <GlassCardContent className="p-8">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={28} className="text-white" />
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="text-2xl font-bold text-white mb-1 font-space-grotesk group-hover:text-cyan-400 transition-colors">
                          {solution.title}
                        </h3>
                        <p className="text-purple-300 text-sm font-medium mb-4">
                          {solution.tagline}
                        </p>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {solution.description}
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-2 mb-6">
                          {solution.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>

                        {/* Stat */}
                        <div className="pt-4 border-t border-white/10 flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-space-grotesk">
                            <GradientText gradient="cyber">{solution.stat.value}</GradientText>
                          </span>
                          <span className="text-sm text-gray-400">{solution.stat.label}</span>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                          Learn more
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Page Teasers Grid */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Explore the Artisan Platform</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                Dive deep into each aspect of how Ava transforms your outbound
              </p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAGE_TEASERS.map((teaser, index) => {
              const Icon = teaser.icon;
              return (
                <RevealText key={teaser.path} delay={index * 100}>
                  <Link to={teaser.path} className="block group h-full">
                    <GlassCard 
                      variant="default" 
                      hover 
                      className="h-full transition-all duration-300 group-hover:border-cyan-500/50"
                    >
                      <GlassCardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${teaser.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk group-hover:text-cyan-400 transition-colors">
                          {teaser.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                          {teaser.description}
                        </p>
                        <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                          {teaser.cta}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  </Link>
                </RevealText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <CustomerShowcase />

      {/* Bottom CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Ready to Transform Your Outbound?
              </GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 2,500+ sales teams already using Ava to book more meetings
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="xl" glow className="gap-2">
                  <Sparkles size={20} />
                  Start Free Trial
                </GlowButton>
              </Link>
              <Link to="/pricing#contact-sales">
                <GlowButtonOutline variant="secondary" size="xl" className="gap-2">
                  Talk to Sales
                  <ArrowRight size={18} />
                </GlowButtonOutline>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Cancel anytime
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Server,
  Sparkles,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  Zap,
  Target,
  BarChart3,
  Users,
  Shield,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import FeaturesShowcase from '../components/features/FeaturesShowcase';
import IntegrationsShowcase from '../components/features/IntegrationsShowcase';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
  FeatureCard,
} from '../components/futuristic';

const CHANNELS = [
  {
    icon: Mail,
    name: 'Email',
    description: 'AI-personalized sequences with deliverability optimization',
  },
  { icon: Linkedin, name: 'LinkedIn', description: 'Automated connection requests and messaging' },
  { icon: Phone, name: 'Phone', description: 'AI call scripts and voicemail drops' },
  { icon: MessageSquare, name: 'SMS', description: 'Text outreach with compliance guardrails' },
];

const REPLACES = [
  'Outreach.io',
  'Salesloft',
  'Apollo',
  'ZoomInfo',
  'Gong',
  'Chorus',
  'Lavender',
  '6sense',
  'Bombora',
  'Lusha',
  'Seamless.AI',
  'Clay',
];

const ENTERPRISE_PILLARS = [
  {
    icon: Shield,
    title: 'Governed AI BDR',
    description:
      'Policy-driven sending, approvals, and human-in-the-loop safeguards out of the box.',
    highlights: ['Policy-based sequences', 'DLP and PII scrubbing', 'Approvals before sends'],
  },
  {
    icon: Users,
    title: 'Identity & Access',
    description: 'SSO/SAML, SCIM, RBAC, and audit trails so IT and Security stay in control.',
    highlights: ['SSO/SAML + SCIM', 'Granular RBAC', 'Full audit logs'],
  },
  {
    icon: Server,
    title: 'Scale & Reliability',
    description:
      'Multi-region infrastructure, deliverability protection, and SLAs for enterprise workloads.',
    highlights: ['US/EU data residency', '99.95% uptime SLA', 'Adaptive sending guardrails'],
  },
  {
    icon: BarChart3,
    title: 'Executive Visibility',
    description: 'Board-ready reporting with live pipeline health, QA, and compliance status.',
    highlights: ['Live pipeline health', 'QA + governance view', 'Exports and APIs'],
  },
];

const PlatformPage = () => {
  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
              <Server size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-300">Everything You Need</span>
            </div>
          </RevealText>

          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                The Complete Outbound Platform
              </GradientText>
            </h1>
          </RevealText>

          <RevealText delay={200}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              AI personalization, multi-channel sequences, enterprise security, and deep
              integrations — all in one unified platform.
            </p>
          </RevealText>

          <RevealText delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Sparkles size={18} />
                  Start Free Trial
                </GlowButton>
              </Link>
              <Link to="/flow">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  See How It Works
                  <ArrowRight size={18} />
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Multi-Channel Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">True Multi-Channel Outreach</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                Reach prospects wherever they are with coordinated messaging
              </p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHANNELS.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <RevealText key={channel.name} delay={index * 100}>
                  <GlassCard variant="default" hover glow glowColor="cyan" className="h-full">
                    <GlassCardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <Icon size={28} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
                        {channel.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{channel.description}</p>
                    </GlassCardContent>
                  </GlassCard>
                </RevealText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <FeaturesShowcase />

      {/* Replaces Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
                <RefreshCw size={16} className="text-red-400" />
                <span className="text-sm text-red-300">Consolidate Your Stack</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Replaces Them Entirely</GradientText>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Stop paying for 10+ point solutions. Artisan gives you everything in one platform.
              </p>
            </div>
          </RevealText>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {REPLACES.map((tool, index) => (
              <RevealText key={tool} delay={index * 50}>
                <GlassCard variant="default" hover className="text-center">
                  <GlassCardContent className="p-4">
                    <span className="text-gray-400 text-sm line-through opacity-70">{tool}</span>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>

          <RevealText delay={600}>
            <div className="mt-12 text-center">
              <GlassCard variant="gradient" className="inline-block">
                <GlassCardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-center sm:text-left">
                      <div className="text-3xl font-bold mb-1">
                        <GradientText gradient="cyber">Save $50k+/year</GradientText>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Average savings when consolidating to Artisan
                      </p>
                    </div>
                    <Link to="/pricing#roi">
                      <GlowButton variant="primary" size="md" glow>
                        Calculate Your ROI
                      </GlowButton>
                    </Link>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Integrations */}
      <IntegrationsShowcase />

      {/* Enterprise Pillars */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4">
                Enterprise-ready from day one
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">
                  The Operating System for Compliant, AI-led Outbound
                </GradientText>
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Replace fragmented tooling with governed automation, enterprise identity, and live
                controls your security and revenue leaders agree on.
              </p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENTERPRISE_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <RevealText key={pillar.title} delay={index * 100}>
                  <FeatureCard
                    icon={<Icon size={22} className="text-cyan-400" />}
                    title={pillar.title}
                    description={pillar.description}
                    variant="neon"
                    className="h-full"
                  >
                    <ul className="space-y-2 text-sm text-gray-400 mt-4">
                      {pillar.highlights.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </FeatureCard>
                </RevealText>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora">Ready to Consolidate Your Stack?</GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              See how Artisan replaces 10+ tools with one AI-powered platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link to="/security">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  <Shield size={18} />
                  View Security Details
                </GlowButtonOutline>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                SOC 2 Type II
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                GDPR Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                99.95% Uptime SLA
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default PlatformPage;

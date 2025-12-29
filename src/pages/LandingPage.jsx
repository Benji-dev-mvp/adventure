import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Server,
  LineChart,
  Lock,
  Globe2,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import AnnouncementBanner from '../components/features/AnnouncementBanner';
import LandingHeader from '../components/layout/LandingHeader';
import HeroSection from '../components/features/HeroSection';
import FeaturesShowcase from '../components/features/FeaturesShowcase';
import TestimonialsSection from '../components/features/TestimonialsSection';
import IntegrationsShowcase from '../components/features/IntegrationsShowcase';
import AITour from '../components/features/AITour';
import CustomerShowcase from '../components/features/CustomerShowcase';

// NEW: Unified data-driven components
import DataFlowVisualization from '../components/features/DataFlowVisualization';
import ResultsShowcase from '../components/features/ResultsShowcase';
import EnterpriseSecurityHub from '../components/features/EnterpriseSecurityHub';
import UnifiedCTA from '../components/features/UnifiedCTA';

// Futuristic components
import {
  GlassCard,
  GlassCardContent,
  StatCard,
  FeatureCard,
  GlowButton,
  GlowButtonOutline,
  GradientText,
  GlowText,
  RevealText,
  CountUpText,
  ParticleBackground,
  FloatingParticles,
} from '../components/futuristic';

const LandingPage = () => {
  const [showBanner, setShowBanner] = useState(true);

  const stats = [
    { value: '99.95%', label: 'Platform Uptime (90d)' },
    { value: 'SOC 2', label: 'Type II Attested' },
    { value: 'SSO/SCIM', label: 'Identity & Provisioning' },
    { value: '24/7', label: 'Enterprise Support' },
  ];

  const enterprisePillars = [
    {
      icon: ShieldCheck,
      title: 'Governed AI BDR',
      description:
        'Policy-driven sending, approvals, and human-in-the-loop safeguards out of the box.',
      highlights: ['Policy-based sequences', 'DLP and PII scrubbing', 'Approvals before sends'],
    },
    {
      icon: KeyRound,
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
      icon: LineChart,
      title: 'Executive Visibility',
      description: 'Board-ready reporting with live pipeline health, QA, and compliance status.',
      highlights: ['Live pipeline health', 'QA + governance view', 'Exports and APIs'],
    },
  ];

  const securityAssurances = [
    {
      title: 'Compliance as a default',
      points: ['SOC 2 Type II attestation', 'GDPR + DPA support', 'Data retention controls'],
      icon: ShieldCheck,
    },
    {
      title: 'Identity, access, approvals',
      points: [
        'SSO/SAML, SCIM provisioning',
        'Role-based access + approvals',
        'Audit logs for every touchpoint',
      ],
      icon: Lock,
    },
    {
      title: 'Resilient global infrastructure',
      points: ['US/EU data residency', 'Private networking options', '24/7 enterprise support'],
      icon: Globe2,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      description: 'Perfect for solo founders and small teams',
      features: [
        '1,000 leads per month',
        '5,000 emails per month',
        'Basic AI personalization',
        'Email sequences',
        'Basic analytics',
      ],
    },
    {
      name: 'Professional',
      price: '$299',
      description: 'For growing sales teams',
      features: [
        '10,000 leads per month',
        '50,000 emails per month',
        'Advanced AI personalization',
        'Multi-channel sequences',
        'Advanced analytics',
        'Team collaboration',
        'CRM integrations',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited leads',
        'Unlimited emails',
        'Custom AI training',
        'Dedicated success manager',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Announcement Banner */}
      {showBanner && <AnnouncementBanner onClose={() => setShowBanner(false)} />}

      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <section className="relative py-12 border-y border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/50 to-slate-950" />
        <FloatingParticles count={20} color="mixed" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <RevealText key={index} delay={index * 100}>
                <GlassCard variant="default" hover glow glowColor="cyan" className="text-center">
                  <div className="text-4xl font-bold mb-2 font-space-grotesk">
                    <GradientText gradient="cyber" animate>
                      {stat.value}
                    </GradientText>
                  </div>
                  <div className="text-purple-200">{stat.label}</div>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tour */}
      <AITour />

      {/* ===== NEW UNIFIED DATA-DRIVEN SECTIONS ===== */}

      {/* Data Flow Visualization - Replaces Architecture in Action, Interactive Flow, Campaign Simulator */}
      <DataFlowVisualization />

      {/* Results Showcase - Replaces Visual Outcomes, Before/After Comparison */}
      <ResultsShowcase />

      {/* Inline CTA */}
      <UnifiedCTA variant="inline" subheadline="See why 2,500+ teams switched to Ava" />

      {/* Features Section */}
      <FeaturesShowcase />

      {/* Integrations */}
      <IntegrationsShowcase />

      {/* Security Hub - Replaces Security Dashboard, Status Monitor, Platform Architecture */}
      <EnterpriseSecurityHub />

      {/* Customer Showcase */}
      <CustomerShowcase />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Enterprise Platform Highlights - Simplified */}
      <section id="platform" className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="flex flex-col gap-4 mb-12">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                Enterprise-ready from day one
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight font-space-grotesk">
                <GradientText gradient="cyber">
                  The operating system for compliant, AI-led outbound
                </GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-4xl">
                Replace fragmented tooling with governed automation, enterprise identity, and live
                controls your security and revenue leaders agree on.
              </p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterprisePillars.map((pillar, index) => {
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

      {/* REDUNDANT - Already included above via new unified components */}

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 relative overflow-hidden bg-[#030712]">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora" animate>
                  Simple, Transparent Pricing
                </GradientText>
              </h2>
              <p className="text-xl text-gray-300">Start free, scale as you grow</p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <RevealText key={index} delay={index * 150}>
                <GlassCard
                  variant={plan.popular ? 'gradient' : 'default'}
                  hover
                  tilt={plan.popular}
                  glow={plan.popular}
                  glowColor="purple"
                  className={`h-full ${plan.popular ? 'scale-105 border-2 border-purple-500/50' : ''}`}
                >
                  <GlassCardContent className="p-8">
                    {plan.popular && (
                      <GlassCard
                        variant="neon"
                        padding="px-4 py-1.5"
                        radius="full"
                        className="inline-flex mb-4"
                        glow
                        glowColor="purple"
                      >
                        <span className="text-sm font-semibold text-white">Most Popular</span>
                      </GlassCard>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        <GradientText gradient="cyber">{plan.price}</GradientText>
                      </span>
                      {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
                    </div>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    <Link to="/onboarding">
                      {plan.popular ? (
                        <GlowButton variant="primary" size="lg" className="w-full mb-6" glow>
                          {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                        </GlowButton>
                      ) : (
                        <GlowButtonOutline variant="primary" size="lg" className="w-full mb-6">
                          {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                        </GlowButtonOutline>
                      )}
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <CheckCircle2
                            size={20}
                            className="text-emerald-400 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          />
                          <span className="text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Full CTA Section */}
      <UnifiedCTA variant="full" />

      {/* Footer */}
      <footer className="bg-[#030712] text-white py-16 px-6 border-t border-white/10 relative overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-cyan-900/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GlassCard
                  variant="neon"
                  padding="p-2"
                  radius="lg"
                  glow
                  glowColor="purple"
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">A</span>
                </GlassCard>
                <span className="font-bold text-xl font-space-grotesk">
                  <GradientText gradient="aurora">Artisan</GradientText>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered outbound sales automation for modern teams. Automate 80% of your outbound
                workflow.
              </p>
              <div className="flex gap-3 mt-6">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <GlassCard
                    key={social}
                    as="a"
                    href="#"
                    variant="default"
                    hover
                    padding="p-0"
                    radius="lg"
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 group"
                  >
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-cyan-400 transition-colors">
                      {social[0]}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Product</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Company</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Legal</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    GDPR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <GlassCard
            variant="default"
            radius="none"
            className="border-t border-white/10 border-x-0 border-b-0 bg-transparent backdrop-blur-none"
          >
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">© 2025 Artisan. All rights reserved.</div>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Status
                </a>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Sitemap
                </a>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Cookie Settings
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

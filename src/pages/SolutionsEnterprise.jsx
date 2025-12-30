import React from 'react';
import { motion } from 'framer-motion';
import { Building, Phone, Shield, CheckCircle, Lock, Key, FileCheck } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import EnterpriseFlowOrchestration from '../components/solutions/EnterpriseFlowOrchestration';
import SolutionHero from '../components/solutions/SolutionHero';
import { SOLUTIONS_DATA } from '../config/solutionsDataFactory';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import {
  KpiFunnelChart,
  RoiProjectionChart,
  CustomerImpactSparklines,
} from '../components/analytics';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  RevealText,
  FloatingParticles,
} from '../components/futuristic';

const {
  features: FEATURES,
  benefits: BENEFITS,
  languages: LANGUAGES,
  stats: ENTERPRISE_STATS,
} = SOLUTIONS_DATA.enterprise;

// Enterprise-specific data
const COMPLIANCE_BADGES = [
  { icon: Shield, name: 'SOC 2 Type II' },
  { icon: Lock, name: 'GDPR Compliant' },
  { icon: FileCheck, name: 'HIPAA Ready' },
  { icon: Key, name: 'SSO/SAML' },
];

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'SOC 2 Type II Certified',
    description: 'Independently audited security controls and data protection practices',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Key,
    title: 'SSO & SCIM',
    description: 'Enterprise SSO with Okta, Azure AD, and automatic user provisioning',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Granular permissions and audit trails for complete visibility',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileCheck,
    title: 'Data Residency',
    description: 'Choose your data location and ensure compliance with regional regulations',
    gradient: 'from-orange-500 to-amber-500',
  },
];

const ENTERPRISE_BENEFITS = BENEFITS;

const SolutionsEnterprise = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  return (
    <AppShell>
      <SolutionHero
        icon={Building}
        segment="For Enterprise"
        title="Power Meets Governance"
        subtitle="Top-Tier Tools + AI Colleague"
        description="Equip your team with best-in-class tools for each stage of the outbound cycle, including an AI colleague to keep everything on track. SOC 2 certified, SSO/SCIM enabled, with dedicated support."
        stats={ENTERPRISE_STATS}
      />

      {/* Compliance Badges */}
      <section className="py-12 px-4 border-y border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...staggerContainer} className="flex flex-wrap justify-center gap-3">
            {COMPLIANCE_BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover className="flex items-center gap-3 px-4 py-3">
                    <Icon size={24} className="text-emerald-400" />
                    <span className="text-white font-semibold">{badge.name}</span>
                    <CheckCircle size={16} className="text-emerald-400" />
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 relative overflow-hidden">
        <FloatingParticles count={15} color="cyan" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-4">
                Enterprise Security
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">
                  Built for Security-First Organizations
                </GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Your security and compliance teams will love our enterprise-grade controls
              </p>
            </div>
          </RevealText>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 gap-3">
            {SECURITY_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="gradient" hover glow glowColor="cyan" className="h-full">
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

      {/* Flow Orchestration */}
      <EnterpriseFlowOrchestration />

      {/* Pipeline Funnel */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Enterprise Pipeline Performance</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Track every stage of your enterprise outbound funnel with precision analytics
              </p>
            </div>
          </RevealText>

          <KpiFunnelChart />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 relative overflow-hidden">
        <FloatingParticles count={20} color="purple" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Calculate Your Enterprise ROI</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See the projected pipeline impact across your enterprise sales organization
              </p>
            </div>
          </RevealText>

          <RoiProjectionChart
            defaultSeats={50}
            defaultAcv={100000}
            defaultMeetings={75}
            showControls
          />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-4">
                <Building className="w-4 h-4" />
                Enterprise-Grade
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">Why Enterprise Teams Choose Artisan</GradientText>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get the capabilities, controls, and support that enterprise organizations demand
              </p>
            </div>
          </RevealText>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ENTERPRISE_BENEFITS.map((benefit, index) => {
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

      {/* Customer Impact */}
      <section className="py-20 px-4 relative overflow-hidden">
        <FloatingParticles count={15} color="mixed" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Enterprise Customer Results</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how enterprise organizations are transforming their outbound with Artisan
              </p>
            </div>
          </RevealText>

          <CustomerImpactSparklines />
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
                Ready for Enterprise-Grade Outbound?
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Let's discuss how Artisan can transform your enterprise sales organization
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pricing#contact-sales">
                <GlowButton variant="primary" size="xl" glow className="gap-2">
                  <Phone size={20} />
                  Talk to Enterprise Sales
                </GlowButton>
              </Link>
              <Link to="/security">
                <GlowButtonOutline variant="secondary" size="xl" className="gap-2">
                  <Shield size={18} />
                  View Security Docs
                </GlowButtonOutline>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Custom pricing available
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Dedicated onboarding
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                Security review process
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default SolutionsEnterprise;

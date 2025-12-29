import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Brain,
  Sparkles,
  CheckCircle,
  BarChart3,
  Building,
  Phone,
  Play,
  Lock,
  Server,
  Key,
  FileCheck,
  Headphones,
  Globe,
  Settings,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import EnterpriseFlowOrchestration from '../components/solutions/EnterpriseFlowOrchestration';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import { KpiFunnelChart, RoiProjectionChart, CustomerImpactSparklines, ChannelMixChart } from '../components/analytics';
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

const SECURITY_FEATURES = [
  {
    icon: Shield,
    title: "SOC 2 Type II Certified",
    description: "Annual third-party audits verify our security controls. Your data is protected by enterprise-grade infrastructure.",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    icon: Lock,
    title: "SSO/SAML + SCIM",
    description: "Enterprise identity management with single sign-on. Automated user provisioning and deprovisioning through SCIM.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: Key,
    title: "Role-Based Access Control",
    description: "Granular permissions at team, campaign, and data levels. Full audit logs for compliance reporting.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: FileCheck,
    title: "GDPR & CCPA Compliant",
    description: "Built-in privacy controls, data residency options, and consent management for global compliance.",
    gradient: "from-orange-500 to-red-500"
  }
];

const ENTERPRISE_BENEFITS = [
  {
    icon: Headphones,
    title: "Dedicated CSM",
    description: "Your own Customer Success Manager ensuring maximum ROI and adoption across your organization.",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    icon: Server,
    title: "99.95% Uptime SLA",
    description: "Enterprise-grade reliability with financial guarantees. Your outbound never stops.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: Settings,
    title: "Custom Integrations",
    description: "Deep integrations with your existing tech stack. Custom API access and webhook support.",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: Globe,
    title: "Global Data Coverage",
    description: "300M+ contacts across 200+ countries. Multi-language support for global outbound campaigns.",
    gradient: "from-orange-400 to-red-500",
  },
  {
    icon: Brain,
    title: "AI Governance Controls",
    description: "Human-in-the-loop approvals, content guardrails, and brand voice enforcement.",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Custom dashboards, attribution modeling, and executive reporting for full pipeline visibility.",
    gradient: "from-indigo-400 to-purple-500",
  }
];

const ENTERPRISE_STATS = [
  { value: '99.95%', label: 'Uptime SLA' },
  { value: 'SOC 2', label: 'Type II Certified' },
  { value: 'SSO/SCIM', label: 'Identity & Provisioning' },
  { value: '24/7', label: 'Priority Support' },
];

const COMPLIANCE_BADGES = [
  { name: 'SOC 2', icon: Shield },
  { name: 'GDPR', icon: Lock },
  { name: 'CCPA', icon: FileCheck },
  { name: 'ISO 27001', icon: Key },
];

const SolutionsEnterprise = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeIn} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-6">
              <Building className="w-4 h-4" />
              For Enterprise
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              <GradientText gradient="aurora">
                Power Meets Governance
              </GradientText>
            </h1>
            <p className="text-2xl text-gray-300 mb-4 font-space-grotesk">
              Top-Tier Tools + AI Colleague
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Equip your team with best-in-class tools for each stage of the outbound cycle, 
              including an AI colleague to keep everything on track. SOC 2 certified, SSO/SCIM enabled, 
              with dedicated support.
            </p>

            {/* Enterprise Stats */}
            <motion.div 
              {...staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10"
            >
              {ENTERPRISE_STATS.map((stat, index) => (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover className="text-center">
                    <div className="text-2xl md:text-3xl font-bold font-space-grotesk mb-1">
                      <GradientText gradient="cyber">{stat.value}</GradientText>
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#contact-sales">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Phone size={18} />
                  Talk to Enterprise Sales
                </GlowButton>
              </Link>
              <Link to="/security">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  <Shield size={18} />
                  Security & Compliance
                </GlowButtonOutline>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-12 px-6 border-y border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...staggerContainer}
            className="flex flex-wrap justify-center gap-8"
          >
            {COMPLIANCE_BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover className="flex items-center gap-3 px-6 py-3">
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
      <section className="py-20 px-6 relative overflow-hidden">
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
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your security and compliance teams will love our enterprise-grade controls
              </p>
            </div>
          </RevealText>

          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {SECURITY_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="gradient" hover glow glowColor="cyan" className="h-full">
                    <GlassCardContent className="p-8">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                        <Icon size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
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
      <section className="py-20 px-6 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">
                  Enterprise Pipeline Performance
                </GradientText>
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
      <section className="py-20 px-6 relative overflow-hidden">
        <FloatingParticles count={20} color="purple" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">
                  Calculate Your Enterprise ROI
                </GradientText>
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
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-4">
                <Building className="w-4 h-4" />
                Enterprise-Grade
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                <GradientText gradient="aurora">
                  Why Enterprise Teams Choose Artisan
                </GradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get the capabilities, controls, and support that enterprise organizations demand
              </p>
            </div>
          </RevealText>

          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ENTERPRISE_BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={index} {...staggerItem}>
                  <GlassCard variant="default" hover glow className="h-full">
                    <GlassCardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 font-space-grotesk">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Customer Impact */}
      <section className="py-20 px-6 relative overflow-hidden">
        <FloatingParticles count={15} color="mixed" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">
                  Enterprise Customer Results
                </GradientText>
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
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Ready for Enterprise-Grade Outbound?
              </GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how Artisan can transform your enterprise sales organization
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
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

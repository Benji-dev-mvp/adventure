import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Globe2,
  Server,
  Eye,
  FileCheck,
  Clock,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import EnterpriseSecurityHub from '../components/features/EnterpriseSecurityHub';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
} from '../components/futuristic';

const COMPLIANCE_CERTS = [
  {
    name: 'SOC 2 Type II',
    status: 'Attested',
    description: 'Annual audit by independent third party',
  },
  { name: 'GDPR', status: 'Compliant', description: 'Full EU data protection compliance' },
  { name: 'CCPA', status: 'Compliant', description: 'California consumer privacy act' },
  { name: 'ISO 27001', status: 'In Progress', description: 'Information security management' },
];

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'Identity & Access Management',
    description: 'Enterprise-grade authentication and authorization',
    features: ['SSO/SAML 2.0', 'SCIM provisioning', 'Role-based access control', 'MFA enforcement'],
  },
  {
    icon: Eye,
    title: 'Audit & Compliance',
    description: 'Complete visibility into all system activity',
    features: [
      'Full audit trails',
      'Data retention controls',
      'Export capabilities',
      'Real-time monitoring',
    ],
  },
  {
    icon: Globe2,
    title: 'Data Residency',
    description: 'Control where your data lives',
    features: ['US data centers', 'EU data centers', 'Regional isolation', 'Data sovereignty'],
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Enterprise-grade platform reliability',
    features: ['99.95% uptime SLA', 'DDoS protection', 'Encryption at rest', 'TLS 1.3 in transit'],
  },
];

const SecurityPage = () => {
  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <Shield size={16} className="text-orange-400" />
              <span className="text-sm text-orange-300">Enterprise Security</span>
            </div>
          </RevealText>

          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Security-First Architecture
              </GradientText>
            </h1>
          </RevealText>

          <RevealText delay={200}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Built for enterprise from day one. SOC 2 Type II attested, GDPR compliant, with full
              audit trails and data residency options.
            </p>
          </RevealText>

          <RevealText delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#security-hub">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Shield size={18} />
                  View Security Dashboard
                </GlowButton>
              </a>
              <Link to="/pricing#contact-sales">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  Talk to Security Team
                  <ArrowRight size={18} />
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-6">
            {COMPLIANCE_CERTS.map((cert, index) => (
              <RevealText key={cert.name} delay={index * 100}>
                <GlassCard
                  variant="default"
                  hover
                  glow
                  glowColor="cyan"
                  className="text-center h-full"
                >
                  <GlassCardContent className="p-6">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
                        cert.status === 'Attested' || cert.status === 'Compliant'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {cert.status === 'Attested' || cert.status === 'Compliant' ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      <span className="text-xs font-medium">{cert.status}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
                      {cert.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{cert.description}</p>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Security Hub Component */}
      <div id="security-hub">
        <EnterpriseSecurityHub />
      </div>

      {/* Security Features Grid */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Enterprise Security Features</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                Everything your security team needs to approve Artisan
              </p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 gap-8">
            {SECURITY_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <RevealText key={feature.title} delay={index * 100}>
                  <GlassCard variant="default" hover className="h-full">
                    <GlassCardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 mb-4">{feature.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {feature.features.map(item => (
                              <div
                                key={item}
                                className="flex items-center gap-2 text-sm text-gray-300"
                              >
                                <CheckCircle2
                                  size={14}
                                  className="text-emerald-400 flex-shrink-0"
                                />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </RevealText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-orange-950/10 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Trusted by Security Teams</GradientText>
              </h2>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '500+', label: 'Enterprise Customers', icon: FileCheck },
              { stat: '99.95%', label: 'Uptime (90 days)', icon: Server },
              { stat: '0', label: 'Security Incidents', icon: Shield },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <RevealText key={item.label} delay={index * 100}>
                  <GlassCard variant="gradient" className="text-center">
                    <GlassCardContent className="p-8">
                      <Icon size={32} className="mx-auto mb-4 text-orange-400" />
                      <div className="text-4xl font-bold mb-2 font-space-grotesk">
                        <GradientText gradient="cyber">{item.stat}</GradientText>
                      </div>
                      <div className="text-gray-400">{item.label}</div>
                    </GlassCardContent>
                  </GlassCard>
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
              <GradientText gradient="aurora">Need Security Documentation?</GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We're happy to share our SOC 2 report, security questionnaire, or schedule a call with
              our security team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#contact-sales">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  Request Security Docs
                  <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link to="/customers">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  See Customer Stories
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default SecurityPage;

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
import ExperienceFlow from '../components/features/ExperienceFlow';
import PlatformArchitecture from '../components/features/PlatformArchitecture';
import LiveCampaignSimulator from '../components/features/LiveCampaignSimulator';
import SecurityDashboard from '../components/features/SecurityDashboard';
import StatusMonitor from '../components/features/StatusMonitor';
import CustomerShowcase from '../components/features/CustomerShowcase';
import VisualOutcomesShowcase from '../components/features/VisualOutcomesShowcase';
import InteractiveArchitectureFlow from '../components/features/InteractiveArchitectureFlow';
import BeforeAfterComparison from '../components/features/BeforeAfterComparison';

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
      description: 'Policy-driven sending, approvals, and human-in-the-loop safeguards out of the box.',
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
      description: 'Multi-region infrastructure, deliverability protection, and SLAs for enterprise workloads.',
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
      points: ['SSO/SAML, SCIM provisioning', 'Role-based access + approvals', 'Audit logs for every touchpoint'],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Announcement Banner */}
      {showBanner && (
        <AnnouncementBanner onClose={() => setShowBanner(false)} />
      )}

      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <section className="py-12 glass-dark border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover-lift">
                <div className="text-4xl font-bold gradient-text-alt mb-2 font-space-grotesk">{stat.value}</div>
                <div className="text-purple-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tour */}
      <AITour />

      {/* Interactive Architecture Flow - HOW IT WORKS */}
      <InteractiveArchitectureFlow />

      {/* Visual Outcomes Showcase - REAL RESULTS */}
      <VisualOutcomesShowcase />

      {/* Before/After Comparison */}
      <BeforeAfterComparison />

      {/* Live Campaign Simulator - Real-time Flow */}
      <LiveCampaignSimulator />

      {/* End-to-end Flow */}
      <ExperienceFlow />

      {/* Platform Architecture - Interactive Diagram */}
      <PlatformArchitecture />

      {/* Enterprise Platform Highlights */}
      <section id="platform" className="py-20 px-6 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/20 blur-3xl animate-float" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-4 mb-12">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Enterprise-ready from day one</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-space-grotesk">
              The operating system for compliant, AI-led outbound
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl">
              Replace fragmented tooling with governed automation, enterprise identity, and live controls your security and revenue leaders agree on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterprisePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative futuristic-card rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover-lift"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 grid place-items-center mb-4 glow">
                    <Icon size={22} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">{pillar.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{pillar.description}</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {pillar.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500 glow" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesShowcase />

      {/* Integrations & Replacement Section */}
      <IntegrationsShowcase />

      {/* Security & Compliance */}
      <SecurityDashboard />

      {/* Platform Status */}
      <StatusMonitor />

      {/* Customer Showcase */}
      <CustomerShowcase />

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/20 blur-3xl animate-float" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text-alt mb-4 font-space-grotesk">
              How Enterprise Teams Run with Artisan
            </h2>
            <p className="text-xl text-gray-300">
              Set once, enforce guardrails, and let Ava orchestrate outbound on autopilot
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Define Your ICP', description: 'Tell Ava who you want to reach' },
              { step: '2', title: 'AI Finds Leads', description: '300M+ contacts with intent signals' },
              { step: '3', title: 'Personalized Outreach', description: 'Multi-channel sequences on autopilot' },
              { step: '4', title: 'Book Meetings', description: 'Qualified leads in your calendar' },
            ].map((item, index) => (
              <div key={index} className="text-center hover-lift">
                <div className="w-16 h-16 gradient-mesh rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 glow shine">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-space-grotesk">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-3xl animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text-alt mb-4 font-space-grotesk">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`futuristic-card border border-white/20 hover-lift ${plan.popular ? 'border-2 border-purple-500 shadow-2xl scale-105 glow' : ''}`}
              >
                <CardContent>
                  {plan.popular && (
                    <div className="gradient-mesh text-white text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4 glow">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold gradient-text-alt">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
                  </div>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  <Link to="/onboarding">
                    <Button 
                      variant={plan.popular ? 'primary' : 'outline'} 
                      className={`w-full mb-6 ${plan.popular ? 'gradient-mesh glow shine' : 'glass border border-white/20 text-white hover:bg-white/10'}`}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 size={20} className="text-green-400 glow flex-shrink-0 mt-0.5" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="enterprise-cta" className="py-20 px-6 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative futuristic-card border border-white/20 rounded-3xl p-12 md:p-16 text-white overflow-hidden hover-lift">
            {/* Animated background circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -ml-48 -mb-48 animate-float" />
            
            <div className="relative z-10">
              <div className="inline-block gradient-mesh backdrop-blur-sm rounded-full p-4 mb-6 glow">
                <Sparkles size={48} className="text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                Ready to ship enterprise-grade pipeline?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Pair Ava with your team to govern outbound at scale—SOC 2, SSO, SLAs, and global data residency included.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/onboarding">
                  <button className="group relative flex items-center justify-center gap-3 glass border border-white/30 text-white font-bold rounded-full py-4 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-white/20 shine">
                    <span>Start Trial</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <a
                  href="#security"
                  className="group relative flex items-center justify-center gap-3 border-2 border-white/30 backdrop-blur-sm text-white font-bold rounded-full py-4 px-8 transition-all duration-300 hover:bg-white/10 hover-lift"
                >
                  <span>Book Enterprise Demo</span>
                </a>
              </div>
              
              <p className="text-sm text-gray-300 mt-6">
                ✨ SOC 2 Type II • SSO/SCIM • 24/7 enterprise support • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-950 to-slate-900 text-white py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 gradient-mesh rounded-xl flex items-center justify-center glow">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl font-space-grotesk">Artisan</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered outbound sales automation for modern teams. 
                Automate 80% of your outbound workflow.
              </p>
              <div className="flex gap-3 mt-6">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 glass border border-white/20 hover:gradient-mesh rounded-lg flex items-center justify-center transition-all duration-300 hover-lift"
                  >
                    <span className="text-sm font-semibold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">GDPR</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2025 Artisan. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors">Status</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

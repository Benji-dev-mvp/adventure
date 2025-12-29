import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Download, TrendingUp, Clock, Target, BarChart3, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import ResultsShowcase from '../components/features/ResultsShowcase';
import CustomerShowcase from '../components/features/CustomerShowcase';
import TestimonialsSection from '../components/features/TestimonialsSection';
import { 
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
  CountUpText,
} from '../components/futuristic';

const CASE_STUDIES = [
  {
    company: 'TechCorp',
    logo: 'TC',
    industry: 'SaaS',
    size: '500+ employees',
    results: [
      { metric: 'Pipeline Increase', value: '3x', icon: TrendingUp },
      { metric: 'Time to Meeting', value: '-73%', icon: Clock },
      { metric: 'Response Rate', value: '+156%', icon: Target },
    ],
    quote: 'Ava transformed our outbound. We went from 50 meetings/month to 180 in just 90 days.',
    author: 'Sarah Chen',
    role: 'VP of Sales',
  },
  {
    company: 'Growth Industries',
    logo: 'GI',
    industry: 'FinTech',
    size: '200+ employees',
    results: [
      { metric: 'Qualified Leads', value: '+240%', icon: Target },
      { metric: 'Cost per Meeting', value: '-65%', icon: BarChart3 },
      { metric: 'Rep Productivity', value: '+4x', icon: TrendingUp },
    ],
    quote: 'We replaced 5 tools with Artisan and our SDRs now focus on closing instead of prospecting.',
    author: 'Michael Roberts',
    role: 'Head of Revenue',
  },
  {
    company: 'Enterprise Systems',
    logo: 'ES',
    industry: 'Enterprise Software',
    size: '2000+ employees',
    results: [
      { metric: 'Deal Velocity', value: '+85%', icon: Clock },
      { metric: 'Win Rate', value: '+34%', icon: Target },
      { metric: 'Annual Savings', value: '$2.4M', icon: BarChart3 },
    ],
    quote: 'The enterprise security features and audit trails made approval from our CISO straightforward.',
    author: 'Jennifer Walsh',
    role: 'CRO',
  },
];

const AGGREGATE_STATS = [
  { value: '2,500+', label: 'Companies Using Ava' },
  { value: '45M+', label: 'Emails Sent Monthly' },
  { value: '890K+', label: 'Meetings Booked' },
  { value: '312%', label: 'Average ROI' },
];

const CustomersPage = () => {
  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-6">
              <Users size={16} className="text-violet-400" />
              <span className="text-sm text-violet-300">Customer Success Stories</span>
            </div>
          </RevealText>
          
          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Real Customer Outcomes
              </GradientText>
            </h1>
          </RevealText>
          
          <RevealText delay={200}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              See how sales teams like yours are using Ava to 
              3x their pipeline and book more meetings.
            </p>
          </RevealText>
          
          <RevealText delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#case-studies">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Download size={18} />
                  View Case Studies
                </GlowButton>
              </a>
              <Link to="/pricing#start">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Aggregate Stats */}
      <section className="py-16 px-6 relative overflow-hidden border-y border-white/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {AGGREGATE_STATS.map((stat, index) => (
              <RevealText key={stat.label} delay={index * 100}>
                <GlassCard variant="default" hover glow glowColor="purple" className="text-center">
                  <GlassCardContent className="p-6">
                    <div className="text-4xl font-bold mb-2 font-space-grotesk">
                      <GradientText gradient="aurora" animate>{stat.value}</GradientText>
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Results Showcase Component */}
      <ResultsShowcase />

      {/* Case Studies */}
      <section id="case-studies" className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Detailed Case Studies</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                Deep dives into how top companies transformed their outbound
              </p>
            </div>
          </RevealText>

          <div className="space-y-8">
            {CASE_STUDIES.map((study, index) => (
              <RevealText key={study.company} delay={index * 150}>
                <GlassCard variant="gradient" hover className="overflow-hidden">
                  <GlassCardContent className="p-0">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Company Info */}
                      <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">{study.logo}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white font-space-grotesk">
                              {study.company}
                            </h3>
                            <p className="text-gray-400 text-sm">{study.industry} • {study.size}</p>
                          </div>
                        </div>
                        <blockquote className="text-gray-300 italic mb-4">
                          "{study.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{study.author[0]}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{study.author}</div>
                            <div className="text-gray-400 text-sm">{study.role}</div>
                          </div>
                        </div>
                      </div>

                      {/* Results Grid */}
                      <div className="lg:col-span-2 p-8">
                        <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-6">
                          Key Results
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          {study.results.map((result) => {
                            const Icon = result.icon;
                            return (
                              <div key={result.metric} className="text-center">
                                <Icon size={28} className="mx-auto mb-3 text-cyan-400" />
                                <div className="text-3xl font-bold mb-1 font-space-grotesk">
                                  <GradientText gradient="cyber">{result.value}</GradientText>
                                </div>
                                <div className="text-gray-400 text-sm">{result.metric}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
                          <GlowButtonOutline variant="ghost" size="sm" className="gap-2">
                            <Download size={16} />
                            Download PDF
                          </GlowButtonOutline>
                          <GlowButton variant="primary" size="sm" className="gap-2">
                            Read Full Story
                            <ArrowRight size={16} />
                          </GlowButton>
                        </div>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <CustomerShowcase />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora">
                Ready to Join These Success Stories?
              </GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your free trial and see results within the first week
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link to="/pricing#roi">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  Calculate Your ROI
                </GlowButtonOutline>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                14-day free trial
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default CustomersPage;

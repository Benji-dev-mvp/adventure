import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Workflow, Play, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import DataFlowVisualization from '../components/features/DataFlowVisualization';
import { KpiFunnelChart } from '../components/analytics';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
} from '../components/futuristic';

const ARCHITECTURE_STEPS = [
  {
    step: 1,
    title: 'ICP Definition',
    description: 'Define your ideal customer profile with AI assistance',
  },
  { step: 2, title: 'Lead Discovery', description: '300M+ contacts with real-time intent signals' },
  { step: 3, title: 'Data Enrichment', description: 'Automatic enrichment from 50+ data sources' },
  { step: 4, title: 'AI Research', description: 'Deep prospect research for personalization' },
  { step: 5, title: 'Sequence Building', description: 'Multi-channel automated sequences' },
  { step: 6, title: 'AI Personalization', description: 'Unique messaging for every prospect' },
  {
    step: 7,
    title: 'Campaign Execution',
    description: 'Automated sending with deliverability optimization',
  },
  {
    step: 8,
    title: 'Meeting Booking',
    description: 'Calendar integration and automated scheduling',
  },
  { step: 9, title: 'Reply Handling', description: 'AI-powered response classification' },
  { step: 10, title: 'CRM Sync', description: 'Bi-directional sync with your CRM' },
  { step: 11, title: 'Analytics', description: 'Real-time pipeline and performance metrics' },
  { step: 12, title: 'Optimization', description: 'Continuous AI-driven improvements' },
];

const FlowPage = () => {
  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section className="py-20 px-4 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
              <Workflow size={16} className="text-cyan-400" />
              <span className="text-sm text-cyan-300">Architecture in Action</span>
            </div>
          </RevealText>

          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="cyber" animate>
                The Complete Outbound Flow
              </GradientText>
            </h1>
          </RevealText>

          <RevealText delay={200}>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Visualize how Ava orchestrates your entire outbound pipeline — from lead discovery to
              booked meetings, all on autopilot.
            </p>
          </RevealText>

          <RevealText delay={300}>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#live-flow">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Workflow size={18} />
                  See Live Data Flow
                </GlowButton>
              </a>
              <Link to="/ai-tour">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  <Play size={18} />
                  Watch AI Tour
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Live Data Flow Visualization */}
      <div id="live-flow">
        <DataFlowVisualization />
      </div>

      {/* Pipeline Funnel Visualization */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-10">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Watch Your Pipeline Convert</GradientText>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Track conversion rates at every stage of your outbound funnel in real-time
              </p>
            </div>
          </RevealText>

          <KpiFunnelChart />
        </div>
      </section>

      {/* Full 12-Step Architecture Timeline */}
      <section className="py-20 px-4 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">End-to-End Architecture</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                The complete 12-step journey from prospect to customer
              </p>
            </div>
          </RevealText>

          {/* Timeline Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {ARCHITECTURE_STEPS.map((item, index) => (
              <RevealText key={item.step} delay={index * 50}>
                <GlassCard variant="default" hover className="h-full group">
                  <GlassCardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1 font-space-grotesk group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>

          {/* Flow Connector Visualization */}
          <RevealText delay={600}>
            <div className="mt-12 text-center">
              <GlassCard variant="gradient" className="inline-block">
                <GlassCardContent className="p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-gray-300">AI Automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-gray-300">Data Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-gray-300">Human Touchpoint</span>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Integration Points */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-lg font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Seamless Integrations</GradientText>
              </h2>
              <p className="text-gray-300">Every step connects with your existing stack</p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-4 gap-3">
            {[
              { category: 'CRM', tools: ['Salesforce', 'HubSpot', 'Pipedrive'] },
              { category: 'Email', tools: ['Gmail', 'Outlook', 'Custom SMTP'] },
              { category: 'Calendar', tools: ['Google Calendar', 'Outlook', 'Calendly'] },
              { category: 'Data', tools: ['ZoomInfo', 'Apollo', 'Clearbit'] },
            ].map((integration, index) => (
              <RevealText key={integration.category} delay={index * 100}>
                <GlassCard variant="default" hover className="h-full">
                  <GlassCardContent className="p-4 text-center">
                    <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">
                      {integration.category}
                    </h3>
                    <div className="space-y-2">
                      {integration.tools.map(tool => (
                        <div
                          key={tool}
                          className="text-sm text-gray-400 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          {tool}
                        </div>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-lg md:text-4xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora">See This Flow Running for Your Team</GradientText>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Get a personalized demo showing how Ava fits your outbound process
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link to="/platform">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  Explore Platform Features
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default FlowPage;

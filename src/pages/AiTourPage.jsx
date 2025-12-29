import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Workflow, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import AITour from '../components/features/AITour';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
} from '../components/futuristic';

const AiTourPage = () => {
  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
              <Play size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300">Interactive AI Tour</span>
            </div>
          </RevealText>

          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Watch Ava Work in Real-Time
              </GradientText>
            </h1>
          </RevealText>

          <RevealText delay={200}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience a complete walkthrough of how Ava, your AI BDR, handles everything from
              lead discovery to booking meetings — all on autopilot.
            </p>
          </RevealText>

          <RevealText delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#video">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  <Play size={18} />
                  Start the Tour
                </GlowButton>
              </a>
              <Link to="/flow">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  <Workflow size={18} />
                  View Technical Flow
                </GlowButtonOutline>
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      {/* AI Tour Component */}
      <div id="video">
        <AITour />
      </div>

      {/* Tour Highlights */}
      <section className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">What You'll See in the Tour</GradientText>
              </h2>
              <p className="text-gray-300 text-lg">Every step of the autonomous outbound journey</p>
            </div>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Hero → Login Flow',
                description:
                  'See how new users onboard and connect their first workspace in under 2 minutes.',
              },
              {
                title: 'ICP Definition',
                description:
                  'Watch Ava learn your ideal customer profile with AI-assisted targeting.',
              },
              {
                title: 'Lead Discovery',
                description: 'Access 300M+ contacts with real-time intent signals and enrichment.',
              },
              {
                title: 'Sequence Builder',
                description:
                  'Multi-channel sequences that personalize every touchpoint automatically.',
              },
              {
                title: 'AI Personalization',
                description: 'See how Ava crafts unique messages based on prospect research.',
              },
              {
                title: 'Meeting Booking',
                description: 'Automated scheduling with calendar integration and follow-ups.',
              },
            ].map((item, index) => (
              <RevealText key={index} delay={index * 100}>
                <GlassCard variant="default" hover className="h-full">
                  <GlassCardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 font-space-grotesk">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora">Ready to Experience Ava Yourself?</GradientText>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your free trial and see the results within the first week
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="lg" glow className="gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link to="/customers">
                <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                  See Customer Results
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
                Setup in 5 minutes
              </span>
            </div>
          </RevealText>
        </div>
      </section>
    </AppShell>
  );
};

export default AiTourPage;

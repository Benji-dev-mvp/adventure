import React from 'react';
import { PlayCircle, Sparkles, Wand2, PanelsTopLeft, Shield, Rocket } from 'lucide-react';

const AITour = () => {
  const tourScenes = [
    {
      icon: Sparkles,
      title: 'AI Concierge on Landing',
      description:
        'Adaptive hero that learns your industry, ICP, and routes you to the right experience.',
      chips: ['Dynamic ICP detection', 'Real-time offer switching', 'Executive-ready CTA'],
    },
    {
      icon: Shield,
      title: 'Secure Login & Handoff',
      description: 'SSO/SCIM, device trust checks, and session posture baked into the flow.',
      chips: ['SSO + SCIM provisioning', 'Risk-based step-up', 'Audit-grade trails'],
    },
    {
      icon: PanelsTopLeft,
      title: 'Guided Workspace Entry',
      description:
        'AI assembles a personalized cockpit: sequences, data sources, and guardrails pre-loaded.',
      chips: ['Governed send policies', 'Live deliverability guardrails', 'AI co-pilot sidecar'],
    },
  ];

  return (
    <section
      id="ai-tour"
      className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 text-white"
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,174,165,0.25), transparent 30%), radial-gradient(circle at 80% 10%, rgba(125,55,255,0.25), transparent 25%)',
        }}
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 relative z-10 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wide">
            AI-led product tour
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            See the AI-led journey from hero to handoff.
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl">
            Show buyers the full experience: adaptive landing, secure login, and a personalized
            workspace assembled in seconds. No guesswork—just a guided, Figma-level visual tour.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#enterprise-cta"
              className="group inline-flex items-center gap-3 gradient-mesh text-white font-bold rounded-full px-5 py-3 transition duration-200 hover:translate-y-[-2px] glow"
            >
              <PlayCircle className="w-5 h-5" />
              Watch 60s AI Tour
            </a>
            <a
              href="#flow"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full glass-dark border border-white/20 text-white font-semibold hover:bg-white/10 transition"
            >
              View the end-to-end flow
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-200">
            <Wand2 className="w-4 h-4" />
            <span>Auto-generated scripts + scene transitions powered by Ava</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-blue-600/15 blur-3xl" />
          <div className="relative futuristic-card border border-white/20 rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Live scene stack
                </p>
                <p className="text-lg font-bold text-white">Landing → Login → Workspace</p>
              </div>
              <div className="px-3 py-1 rounded-full glass-dark border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Realtime
              </div>
            </div>

            <div className="space-y-3">
              {tourScenes.map(scene => {
                const Icon = scene.icon;
                return (
                  <div
                    key={scene.title}
                    className="rounded-lg futuristic-card border border-white/20 p-4 hover-lift"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-9 rounded-lg gradient-mesh grid place-items-center glow">
                        <Icon className="text-white" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold">{scene.title}</h3>
                          <span className="text-xs font-semibold glass-dark border border-white/20 px-2 py-1 rounded-full">
                            Scene
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1 mb-3">{scene.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {scene.chips.map(chip => (
                            <span
                              key={chip}
                              className="text-xs font-semibold px-3 py-1 rounded-full glass-dark border border-white/20 text-gray-100"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Auto QA & guardrails active
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI narration on
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITour;

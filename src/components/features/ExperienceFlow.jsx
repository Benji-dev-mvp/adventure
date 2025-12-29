import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  DoorOpen,
  LayoutDashboard,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

const ExperienceFlow = () => {
  const flowSteps = [
    {
      icon: Sparkles,
      title: 'Adaptive Landing',
      description: 'AI-tailored hero and CTA based on visitor intent, industry, and buying role.',
      detail: 'Dynamic offers, ICP-aware messaging, guided path selection.',
    },
    {
      icon: Fingerprint,
      title: 'Trusted Login',
      description: 'SSO/SAML with SCIM, device trust checks, and policy-based access.',
      detail: 'Step-up auth for risk, audit trails, data residency consent.',
    },
    {
      icon: DoorOpen,
      title: 'AI-led Handoff',
      description: 'Ava pre-loads sequences, data sources, and guardrails before you enter.',
      detail: 'Deliverability protection, policy-aligned messaging, QA review.',
    },
    {
      icon: LayoutDashboard,
      title: 'Workspace Ready',
      description: 'Role-based cockpit with live pipeline health, compliance, and coaching.',
      detail: 'Executive dashboards, AI notes, instant launch buttons.',
    },
  ];

  return (
    <section
      id="flow"
      className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-purple-300">From hero → login → workspace</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight font-space-grotesk">
              The end-to-end experience your buyers will tour
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl">
              Show the full flow in one pass: adaptive landing, secure authentication, AI handoff,
              and the live workspace that proves value in seconds.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark border border-white/20">
                <ShieldCheck className="w-4 h-4" />
                Enterprise guardrails baked in
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark border border-white/20">
                <ArrowRight className="w-4 h-4" />
                Linear, visual narrative
              </span>
            </div>
          </div>
          <a
            href="#ai-tour"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-mesh text-white font-bold shadow-lg hover:scale-105 transition transform glow"
          >
            Jump to AI tour
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl futuristic-card border border-white/20 p-6 overflow-hidden hover-lift"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl gradient-mesh grid place-items-center glow">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">0{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                <p className="text-sm text-gray-400">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceFlow;

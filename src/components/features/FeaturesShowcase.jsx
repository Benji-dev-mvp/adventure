import React from 'react';
import { Brain, Target, Mail, TrendingUp, Users, Zap } from 'lucide-react';

const FeaturesShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered BDR',
      description:
        'Ava autonomously researches leads, writes personalized outreach, and optimizes campaigns in real-time.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: '300M+ B2B Database',
      description:
        'Access verified contacts with intent signals and enrichment data from multiple premium sources.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mail,
      title: 'Multi-Channel Outreach',
      description:
        'Email, LinkedIn, calls, and SMS sequences with intelligent personalization waterfall logic.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: TrendingUp,
      title: 'Deliverability Optimization',
      description:
        'Built-in email warmup, domain health monitoring, and sending pattern optimization.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Lead Enrichment',
      description:
        'Automatic data enrichment and scoring with real-time company and contact updates.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Workflow Automation',
      description:
        'Automate 80% of outbound tasks with intelligent triggers, conditions, and follow-ups.',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk text-white">
            Everything You Need for Outbound Success
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Replace 10+ tools with one AI-powered platform. From lead discovery to booked meetings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative futuristic-card rounded-lg p-4 border border-white/15 hover:border-purple-400/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="text-white" size={28} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors font-space-grotesk">
                  {feature.title}
                </h3>

                <p className="text-gray-100 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;

import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Timeline } from '@/components/marketing/Timeline';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Database, Brain, Send, BarChart } from 'lucide-react';

export function HowItWorksPage() {
  const stages = [
    {
      icon: <Database className="w-6 h-6 text-white" />,
      title: "Data Collection",
      description: "Integrate with your CRM, product, and engagement tools to build a unified customer profile."
    },
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI Intelligence",
      description: "Our AI analyzes intent signals, enriches profiles, and generates personalized messaging."
    },
    {
      icon: <Send className="w-6 h-6 text-white" />,
      title: "Multi-Channel Execution",
      description: "Execute coordinated campaigns across email, LinkedIn, SMS, and in-app channels."
    },
    {
      icon: <BarChart className="w-6 h-6 text-white" />,
      title: "Continuous Learning",
      description: "Track engagement, analyze outcomes, and improve strategies based on real performance data."
    }
  ];

  const detailedSteps = [
    {
      title: "Connect Your Stack",
      subtitle: "Integration takes minutes, not weeks",
      points: [
        "One-click Salesforce & HubSpot sync",
        "API access for custom data sources",
        "Automatic contact & account mapping",
        "Historical data import"
      ]
    },
    {
      title: "Define Your Strategy",
      subtitle: "Set targeting, voice, and guardrails",
      points: [
        "Build ICP with AI assistance",
        "Set sending limits & compliance rules",
        "Configure approval workflows",
        "Define brand voice guidelines"
      ]
    },
    {
      title: "Launch Campaigns",
      subtitle: "AI handles research, writing, and timing",
      points: [
        "Automated prospect research",
        "Personalized message generation",
        "Optimal send-time predictions",
        "Real-time deliverability optimization"
      ]
    },
    {
      title: "Monitor & Optimize",
      subtitle: "Full visibility into what's working",
      points: [
        "Live pipeline metrics",
        "A/B test insights",
        "Response sentiment analysis",
        "Automated reporting"
      ]
    }
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="How It Works"
          title="From data to meetings in four stages"
          description="Artisan orchestrates your entire revenue workflow with AI precision and enterprise reliability."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 text-center">
            The Artisan workflow
          </h2>
        </div>
        <Timeline steps={stages} orientation="horizontal" />
      </PageSection>

      <PageSection variant="default">
        <div className="space-y-16">
          {detailedSteps.map((step, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
              <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                <div className="text-sm font-semibold text-blue-400 mb-2">
                  STEP {index + 1}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-400 mb-6">
                  {step.subtitle}
                </p>
                <ul className="space-y-3">
                  {step.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                      <span className="text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-8">
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                      <span className="text-slate-500">Visual {index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection variant="surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Built with guardrails by default
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Every message is checked for compliance, sentiment, and brand alignment before it goes out. Our AI learns your standards and enforces them automatically.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-50 mb-2">Safety checks</h4>
                <p className="text-sm text-slate-400">PII scrubbing, compliance validation, and tone analysis on every message.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-50 mb-2">Human review</h4>
                <p className="text-sm text-slate-400">Optional approval flows for high-stakes campaigns or new segments.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-50 mb-2">Audit trails</h4>
                <p className="text-sm text-slate-400">Full visibility into what was sent, why, and how prospects responded.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>

      <CTASection 
        title="Ready to see it in action?"
        description="Schedule a personalized demo to see how Artisan can transform your revenue workflow."
        ctaLabel="Book a Demo"
      />
    </>
  );
}

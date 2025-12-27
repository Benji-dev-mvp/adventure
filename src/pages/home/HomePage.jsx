import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { LogoCloud } from '@/components/marketing/LogoCloud';
import { StatBand } from '@/components/marketing/StatBand';
import { PageSection } from '@/components/layout/PageSection';
import { CTASection } from '@/components/marketing/CTASection';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { Card, CardContent } from '@/components/ui/Card';
import { Check, Zap, Shield, TrendingUp, Users } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Multi-channel orchestration",
      body: "Coordinate email, social, and live handoffs from one canvas."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Deep Salesforce integration",
      body: "Stay in sync with opportunities, contacts, and tasks."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Enterprise guardrails",
      body: "Role-based controls, approvals, and audit trails."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Learning loop",
      body: "The system improves from replies, meetings, and win/loss data."
    },
  ];

  const howItWorksSteps = [
    {
      title: "Connect your data",
      body: "Plug in CRM, sequences, calendars, and product usage in minutes."
    },
    {
      title: "Define your ICP and guardrails",
      body: "Lock in targeting, voice, and compliance once instead of per sequence."
    },
    {
      title: "Deploy across channels",
      body: "Run email, LinkedIn, and in-product workflows with full observability."
    },
  ];

  const faqs = [
    {
      question: "What is Artisan?",
      answer: "Artisan is an AI-powered revenue automation platform that helps sales and marketing teams orchestrate multi-channel outbound campaigns with enterprise-grade guardrails."
    },
    {
      question: "Who is it for?",
      answer: "Artisan is built for revenue teams at growth-stage and enterprise companies who need to scale their outbound motion without sacrificing quality or compliance."
    },
    {
      question: "What makes it different?",
      answer: "Unlike point solutions, Artisan provides a unified AI operator that learns from your data and executes across channels while maintaining enterprise security and compliance standards."
    },
    {
      question: "How long does implementation take?",
      answer: "Most teams are up and running within a week. Our onboarding process includes data integration, ICP configuration, and team training."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with major CRMs (Salesforce, HubSpot), email providers, LinkedIn, calendars, and data enrichment tools."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. We're SOC 2 Type II compliant, support SSO/SAML, and offer role-based access controls with full audit trails."
    },
  ];

  return (
    <>
      <Hero
        eyebrow="AI for revenue teams"
        title="AI that actually knows your customers."
        subtitle="Turn fragmented GTM data into a single AI operator that researches, writes, and iterates across every outbound channel."
        primaryCta={{ label: "Get a live demo", href: "/pricing" }}
        secondaryCta={{ label: "See how it works", href: "/how-it-works" }}
      >
        {/* Optional: Add hero image or animation */}
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
          <span className="text-slate-500 text-sm">Product Demo Placeholder</span>
        </div>
      </Hero>

      <LogoCloud />

      <StatBand
        stats={[
          { label: "Meetings per month", value: "3x" },
          { label: "Manual ops reduced", value: "80%" },
          { label: "Ramp time", value: "-60%" },
        ]}
      />

      <PageSection id="how-it-works" variant="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-400">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400">
                  {step.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection id="value">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Everything your outbound stack should be, in one surface.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection id="proof" variant="surface">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Trusted by revenue leaders
          </h2>
        </div>
        <Card className="bg-slate-900 border-slate-800 max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <blockquote className="text-xl md:text-2xl text-slate-300 italic mb-6">
              "Artisan transformed how we approach outbound. We've seen a 3x increase in qualified meetings while cutting manual work by 80%."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700" />
              <div>
                <div className="font-semibold text-slate-50">Sarah Johnson</div>
                <div className="text-sm text-slate-400">VP of Sales, TechCorp</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection id="faq" variant="muted">
        <FAQAccordion faqs={faqs} />
      </PageSection>

      <CTASection />
    </>
  );
}

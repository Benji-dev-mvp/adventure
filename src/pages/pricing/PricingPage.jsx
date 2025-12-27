import React from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

export function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "$499",
      period: "/month",
      description: "Perfect for small teams getting started with AI-powered outbound",
      features: [
        "Up to 5 users",
        "10,000 contacts",
        "Email sequences",
        "Basic integrations",
        "Email support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "$1,499",
      period: "/month",
      description: "For growing teams ready to scale their outbound motion",
      features: [
        "Up to 25 users",
        "50,000 contacts",
        "Multi-channel campaigns",
        "Advanced integrations",
        "Priority support",
        "Custom workflows",
        "A/B testing",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited users",
        "Unlimited contacts",
        "White-glove onboarding",
        "SSO/SAML",
        "Dedicated CSM",
        "SLA guarantees",
        "Custom integrations",
        "Annual contract",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Pricing"
          title="Plans that scale with your growth"
          description="Start with a free trial, no credit card required. Upgrade anytime as your team grows."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`${
                tier.highlighted
                  ? 'bg-blue-600 border-blue-500 ring-2 ring-blue-400'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <CardContent className="p-8">
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${
                  tier.highlighted ? 'text-white' : 'text-slate-50'
                }`}>
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    tier.highlighted ? 'text-white' : 'text-slate-50'
                  }`}>
                    {tier.price}
                  </span>
                  <span className={`text-lg ${
                    tier.highlighted ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {tier.period}
                  </span>
                </div>
                <p className={`mb-6 ${
                  tier.highlighted ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {tier.description}
                </p>
                <Button
                  className={`w-full mb-6 ${
                    tier.highlighted
                      ? 'bg-white text-blue-600 hover:bg-slate-100'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {tier.cta}
                </Button>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${
                        tier.highlighted ? 'text-white' : 'text-blue-400'
                      }`} />
                      <span className={tier.highlighted ? 'text-white' : 'text-slate-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="default">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            All plans include
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "AI-powered personalization",
              "Real-time analytics",
              "Compliance guardrails",
              "API access",
              "Regular product updates",
              "Security & compliance",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <CTASection
        title="Not sure which plan is right for you?"
        description="Talk to our team to find the perfect fit for your organization."
        ctaLabel="Schedule a Call"
        ctaHref="/pricing"
      />
    </>
  );
}

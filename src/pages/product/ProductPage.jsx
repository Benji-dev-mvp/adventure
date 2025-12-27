import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Check, X } from 'lucide-react';

export function ProductPage() {
  const features = [
    {
      category: "AI Intelligence",
      items: [
        "Real-time lead enrichment",
        "Buyer intent signals",
        "Personalization at scale",
        "Sentiment analysis"
      ]
    },
    {
      category: "Multi-Channel",
      items: [
        "Email sequences",
        "LinkedIn automation",
        "SMS campaigns",
        "In-app messaging"
      ]
    },
    {
      category: "Enterprise Ready",
      items: [
        "SSO/SAML authentication",
        "Role-based access control",
        "SOC 2 Type II compliance",
        "99.95% uptime SLA"
      ]
    },
    {
      category: "Integrations",
      items: [
        "Salesforce native",
        "HubSpot integration",
        "Slack notifications",
        "API access"
      ]
    }
  ];

  const comparison = [
    { feature: "Setup time", old: "2-3 weeks", new: "< 1 week" },
    { feature: "Manual effort", old: "80% manual", new: "20% manual" },
    { feature: "Response rate", old: "2-3%", new: "8-12%" },
    { feature: "Data quality", old: "Inconsistent", new: "Always current" },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Product"
          title="One platform for all your revenue workflows"
          description="Artisan combines AI intelligence, multi-channel orchestration, and enterprise security into a unified platform that scales with your team."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 text-center">
            Built for modern revenue teams
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">
                  {feature.category}
                </h3>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="surface">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 text-center">
            Old way vs. new way
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-slate-400 font-medium">Feature</div>
            <div className="text-slate-400 font-medium text-center">Old Way</div>
            <div className="text-slate-400 font-medium text-center">With Artisan</div>
          </div>
          {comparison.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 py-4 border-t border-slate-800"
            >
              <div className="text-slate-50 font-medium">{row.feature}</div>
              <div className="text-slate-400 text-center">{row.old}</div>
              <div className="text-blue-400 text-center font-semibold">{row.new}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection variant="default">
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 flex items-center justify-center mb-8">
          <span className="text-slate-500">Product Workflow Demo</span>
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-50 mb-4">
            See Artisan in action
          </h3>
          <p className="text-slate-400">
            Watch how leading revenue teams orchestrate their entire GTM motion from a single platform.
          </p>
        </div>
      </PageSection>

      <CTASection />
    </>
  );
}

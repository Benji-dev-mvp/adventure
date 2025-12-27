import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Target, Users, Lightbulb } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Customer First",
      description: "Every decision starts with what's best for our customers."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Build Together",
      description: "We win as a team and celebrate collective success."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-400" />,
      title: "Innovate Always",
      description: "We push boundaries and challenge the status quo."
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="About Us"
          title="We're building the future of revenue automation"
          description="Artisan was founded on the belief that AI should empower revenue teams, not replace them."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            We're on a mission to democratize enterprise-grade revenue automation. 
            Every company—from startups to Fortune 500s—should have access to AI that 
            understands their customers, scales their outbound, and drives predictable growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-400">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="default">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            We're backed by leading investors and growing fast. If you're passionate about 
            using AI to solve real business problems, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@artisan.com"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              View Open Roles
            </a>
          </div>
        </div>
      </PageSection>

      <CTASection
        title="Ready to see what Artisan can do?"
        description="Join thousands of revenue teams using AI to scale their outbound."
      />
    </>
  );
}

import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { LogoCloud } from '@/components/marketing/LogoCloud';
import { Card, CardContent } from '@/components/ui/Card';

export function CustomersPage() {
  const testimonials = [
    {
      quote: "Artisan transformed our outbound motion. We're now booking 3x more meetings with the same team size.",
      author: "Sarah Johnson",
      role: "VP of Sales",
      company: "TechCorp"
    },
    {
      quote: "The ROI was immediate. Within two weeks, we had already replaced three different tools and saw our data quality jump to 95%.",
      author: "Mike Chen",
      role: "Head of RevOps",
      company: "GrowthCo"
    },
    {
      quote: "As a startup, we needed enterprise capabilities without enterprise complexity. Artisan delivered exactly that.",
      author: "Emily Rodriguez",
      role: "Founder & CEO",
      company: "StartupXYZ"
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Customers"
          title="Trusted by leading revenue teams"
          description="From startups to enterprises, companies of all sizes use Artisan to scale their outbound."
        />
      </PageSection>

      <LogoCloud title="Companies that trust Artisan" />

      <PageSection variant="muted">
        <div className="max-w-4xl mx-auto space-y-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-8">
                <blockquote className="text-xl text-slate-300 italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700" />
                  <div>
                    <div className="font-semibold text-slate-50">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </>
  );
}

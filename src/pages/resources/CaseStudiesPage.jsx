import React from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';

export function CaseStudiesPage() {
  const caseStudies = [
    {
      company: "TechCorp",
      industry: "SaaS",
      title: "How TechCorp scaled to 500 deals per month with 3 SDRs",
      metrics: ["3x pipeline", "80% less manual work", "< 2 weeks to ROI"],
      image: "placeholder"
    },
    {
      company: "GrowthCo",
      industry: "E-commerce",
      title: "GrowthCo's journey to $10M ARR with AI-powered outbound",
      metrics: ["10x meetings", "60% cost reduction", "95% data accuracy"],
      image: "placeholder"
    },
    {
      company: "EnterprisePlus",
      industry: "Enterprise",
      title: "Enterprise scale meets startup agility at EnterprisePlus",
      metrics: ["2.5x conversion", "99.95% uptime", "SOC 2 compliant"],
      image: "placeholder"
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Case Studies"
          title="Real results from real companies"
          description="See how revenue teams use Artisan to transform their outbound motion."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="space-y-8 max-w-4xl mx-auto">
          {caseStudies.map((study, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <span className="text-slate-500 text-sm">{study.company} Logo</span>
                  </div>
                  <div className="md:col-span-2 p-6">
                    <Badge variant="outline" className="mb-3">{study.industry}</Badge>
                    <h3 className="text-xl font-bold text-slate-50 mb-4">
                      {study.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {study.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-sm">
                          <span className="text-blue-400 font-semibold">{metric}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/resources/case-studies/${study.company.toLowerCase()}`}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center text-sm font-medium"
                    >
                      Read full story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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

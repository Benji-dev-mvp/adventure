import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Rocket, DollarSign, Clock } from 'lucide-react';

export function StartupsPage() {
  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="For Startups"
          title="Enterprise tools without enterprise complexity"
          description="Launch your GTM motion in days, not months. Get the power of an enterprise platform at a startup price."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">&lt; 1 Week Setup</h3>
              <p className="text-slate-400">Go from signup to first campaign in under a week.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">70% Cost Savings</h3>
              <p className="text-slate-400">Replace multiple tools and contractors with one platform.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Rocket className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Scale-Ready</h3>
              <p className="text-slate-400">Start small, scale fast. No migration needed as you grow.</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <CTASection
        title="Ready to launch your GTM motion?"
        description="Join hundreds of startups using Artisan to scale their outbound."
        ctaLabel="Start Free Trial"
      />
    </>
  );
}

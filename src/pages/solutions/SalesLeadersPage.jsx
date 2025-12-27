import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Users, BarChart } from 'lucide-react';

export function SalesLeadersPage() {
  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="For Sales Leaders"
          title="Scale your team without scaling headcount"
          description="Give your reps an AI assistant that handles research, personalization, and follow-ups so they can focus on closing deals."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">2.5x Pipeline Growth</h3>
              <p className="text-slate-400">Teams using Artisan see 2.5x more qualified opportunities in their pipeline.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">60% Faster Ramp</h3>
              <p className="text-slate-400">New reps reach quota 60% faster with AI-guided workflows.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <BarChart className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Full Visibility</h3>
              <p className="text-slate-400">Real-time dashboards show exactly what's working and what's not.</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <CTASection
        title="Ready to scale your sales team?"
        description="See how Artisan can transform your team's productivity."
        ctaLabel="Book a Demo"
      />
    </>
  );
}

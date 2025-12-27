import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { CTASection } from '@/components/marketing/CTASection';
import { Card, CardContent } from '@/components/ui/Card';
import { Database, Zap, Shield } from 'lucide-react';

export function RevOpsPage() {
  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="For RevOps"
          title="One source of truth for your revenue engine"
          description="Unify your stack, automate data hygiene, and get the insights you need to optimize the entire funnel."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Database className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">95%+ Data Accuracy</h3>
              <p className="text-slate-400">Automated enrichment and validation keeps your CRM clean.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Zap className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">5→1 Tool Consolidation</h3>
              <p className="text-slate-400">Replace multiple point solutions with one integrated platform.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Enterprise Controls</h3>
              <p className="text-slate-400">Governance, compliance, and security built in from day one.</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <CTASection
        title="Ready to optimize your revenue operations?"
        description="See how Artisan can unify and streamline your GTM stack."
        ctaLabel="Book a Demo"
      />
    </>
  );
}

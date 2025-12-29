/**
 * Usage & Quotas Page (New Implementation)
 * 
 * Clean implementation using demo data contract
 * Shows plan usage and resource consumption
 */

import React, { useMemo } from 'react';
import { PageScaffold, BadgePill, SectionHeader } from '@/components/layout/shared';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { 
  Users, 
  Database, 
  Mail, 
  Target, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { getDemoUsageQuotas, getDemoTenant } from '@/demo/demoData';
import { cn } from '@/lib/utils';

const QuotaCard = ({ icon: Icon, title, current, limit, unit, percentage, trend }) => {
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              isAtLimit ? "bg-red-500/10" : isNearLimit ? "bg-amber-500/10" : "bg-cyan-500/10"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                isAtLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-cyan-500"
              )} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{title}</p>
              <p className="text-2xl font-bold text-white">
                {current.toLocaleString()}
                <span className="text-sm text-slate-500 font-normal ml-1">/ {limit.toLocaleString()} {unit}</span>
              </p>
            </div>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend > 0 ? "text-emerald-500" : trend < 0 ? "text-red-500" : "text-slate-500"
            )}>
              <TrendingUp className={cn("w-3 h-3", trend < 0 && "rotate-180")} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <Progress 
          value={percentage} 
          className={cn(
            "h-2",
            isAtLimit ? "bg-red-500/20" : isNearLimit ? "bg-amber-500/20" : "bg-cyan-500/20"
          )}
          indicatorClassName={cn(
            isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-cyan-500"
          )}
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {percentage.toFixed(1)}% used
          </p>
          {isNearLimit && (
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <AlertCircle className="w-3 h-3" />
              Near limit
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UsageQuotasPage: FC = () => {
  const { plan } = useTenant();
  
  // Get usage quotas from demo data
  const quotas = useMemo(() => getDemoUsageQuotas(plan as PlanTier), [plan]);

  const planBadges: Record<PlanTier, { text: string; variant: 'default' | 'pro' | 'exec' }> = {
    startup: { text: 'Startup', variant: 'default' as const },
    midmarket: { text: 'Midmarket', variant: 'pro' as const },
    enterprise: { text: 'Enterprise', variant: 'exec' as const },
  };
  
  const currentPlan = (plan as PlanTier) || 'enterprise';
  const currentPlanBadge = planBadges[currentPlan];

  return (
    <PageScaffold
      title="Usage & Quotas"
      subtitle="Monitor your plan usage and resource consumption"
      badges={[currentPlanBadge]}
      actions={
        <Button 
          variant="primary"
          onClick={() => console.log('Upgrade plan')}
          className="inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade Plan
          <ArrowRight className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Plan Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 capitalize">{plan} Plan</h3>
                <p className="text-slate-400">
                  {plan === 'startup' && 'Perfect for small teams getting started with AI-powered outbound'}
                  {plan === 'midmarket' && 'Advanced features for growing sales teams'}
                  {plan === 'enterprise' && 'Full platform with enterprise controls and compliance'}
                </p>
              </div>
              <BadgePill variant={currentPlanBadge.variant}>
                {currentPlanBadge.text}
              </BadgePill>
            </div>
          </CardContent>
        </Card>

        {/* Usage Quotas */}
        <div>
          <SectionHeader 
            title="Resource Usage"
            subtitle="Track your consumption across different resource types"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuotaCard
              icon={Users}
              title="Team Members"
              current={quotas.users.current}
              limit={quotas.users.limit}
              unit="users"
              percentage={quotas.users.percentage}
              trend={5}
            />
            
            <QuotaCard
              icon={Database}
              title="Lead Database"
              current={quotas.leads.current}
              limit={quotas.leads.limit}
              unit="leads"
              percentage={quotas.leads.percentage}
              trend={12}
            />
            
            <QuotaCard
              icon={Mail}
              title="Email Credits"
              current={quotas.emails.current}
              limit={quotas.emails.limit}
              unit="emails/mo"
              percentage={quotas.emails.percentage}
              trend={-3}
            />
            
            <QuotaCard
              icon={Target}
              title="Active Campaigns"
              current={quotas.campaigns.current}
              limit={quotas.campaigns.limit}
              unit="campaigns"
              percentage={quotas.campaigns.percentage}
              trend={8}
            />
            
            <QuotaCard
              icon={FileText}
              title="Sales Playbooks"
              current={quotas.playbooks.current}
              limit={quotas.playbooks.limit}
              unit="playbooks"
              percentage={quotas.playbooks.percentage}
              trend={0}
            />
          </div>
        </div>

        {/* Feature Limits */}
        <div>
          <SectionHeader 
            title="Plan Features"
            subtitle="Available features in your current plan"
          />
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Included Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      AI-powered lead scoring
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Multi-channel campaigns
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      CRM integrations
                    </li>
                    {plan !== 'startup' && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Advanced analytics
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Data enrichment
                        </li>
                      </>
                    )}
                    {plan === 'enterprise' && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Enterprise SSO
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Advanced compliance & audit logs
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                {plan !== 'enterprise' && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Upgrade to unlock</h4>
                    <ul className="space-y-2">
                      {plan === 'startup' && (
                        <>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Advanced analytics & reporting
                          </li>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Data enrichment
                          </li>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            AI Parliament multi-agent
                          </li>
                        </>
                      )}
                      {plan === 'midmarket' && (
                        <>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Enterprise SSO & SAML
                          </li>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Advanced compliance controls
                          </li>
                          <li className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Dedicated support
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA */}
        {plan !== 'enterprise' && (
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to scale your outbound?
                </h3>
                <p className="text-slate-300 mb-6">
                  Upgrade to {plan === 'startup' ? 'Midmarket' : 'Enterprise'} plan for advanced features,
                  higher limits, and dedicated support.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="primary" size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageScaffold>
  );
};

export default UsageQuotasPage;

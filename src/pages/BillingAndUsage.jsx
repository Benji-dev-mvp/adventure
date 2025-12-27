import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/Toast';
import { cn } from '../lib/utils';
import {
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Users,
  Mail,
  BarChart3,
  Download,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const BillingAndUsage = () => {
  const { showToast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // Fetch current subscription
      const subResponse = await fetch('/api/billing/subscriptions/current');
      const subData = await subResponse.json();
      setSubscription(subData);

      // Fetch usage
      const usageResponse = await fetch('/api/billing/usage/current');
      const usageData = await usageResponse.json();
      setUsage(usageData);
    } catch (error) {
      showToast('Failed to load billing data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier) => {
    try {
      const response = await fetch('/api/billing/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billing_period: 'monthly', seats: 1 })
      });

      if (response.ok) {
        showToast('Plan upgraded successfully!', 'success');
        fetchSubscriptionData();
        setShowUpgrade(false);
      }
    } catch (error) {
      showToast('Upgrade failed', 'error');
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const tierColors = {
    free: 'bg-gray-100 text-gray-800',
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-amber-100 text-amber-800'
  };

  if (loading) {
    return (
      <DashboardLayout title="Billing & Usage" subtitle="Manage your subscription and track usage">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Billing & Usage" subtitle="Manage your subscription and track usage">
      <div className="space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription className="capitalize">
                  {subscription?.tier} Plan
                </CardDescription>
              </div>
              <Badge className={tierColors[subscription?.tier] || 'bg-gray-100'}>
                {subscription?.status === 'active' ? 'Active' : subscription?.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${subscription?.total_price || 0}
                  <span className="text-lg text-gray-600">/{subscription?.billing_period === 'monthly' ? 'month' : 'year'}</span>
                </div>
                {subscription?.is_trial && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
                    <AlertCircle size={16} />
                    <span>Trial ends {new Date(subscription.trial_end).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-4">
                  {subscription?.seats} seat{subscription?.seats > 1 ? 's' : ''} • 
                  Next billing: {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowUpgrade(!showUpgrade)}>
                    Change Plan
                  </Button>
                  {subscription?.tier !== 'free' && (
                    <Button variant="outline">Manage Payment</Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
                {subscription?.tier === 'free' && (
                  <>
                    <FeatureItem>100 emails/month</FeatureItem>
                    <FeatureItem>50 leads</FeatureItem>
                    <FeatureItem>1 active campaign</FeatureItem>
                    <FeatureItem>Basic AI assistant</FeatureItem>
                  </>
                )}
                {subscription?.tier === 'professional' && (
                  <>
                    <FeatureItem>50,000 emails/month</FeatureItem>
                    <FeatureItem>10,000 leads</FeatureItem>
                    <FeatureItem>100 active campaigns</FeatureItem>
                    <FeatureItem>AI Salesboard & Knowledge Fusion</FeatureItem>
                    <FeatureItem>Advanced analytics</FeatureItem>
                    <FeatureItem>24/7 priority support</FeatureItem>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {showUpgrade && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>Upgrade or downgrade anytime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <PlanCard
                  tier="starter"
                  name="Starter"
                  price={49}
                  features={[
                    '5,000 emails/month',
                    '1,000 leads',
                    '10 active campaigns',
                    'Multi-channel outreach',
                    'Priority support'
                  ]}
                  onSelect={() => handleUpgrade('starter')}
                  currentTier={subscription?.tier}
                />
                <PlanCard
                  tier="professional"
                  name="Professional"
                  price={299}
                  features={[
                    '50,000 emails/month',
                    '10,000 leads',
                    '100 active campaigns',
                    'AI Salesboard',
                    'Knowledge Fusion',
                    'Workflow Builder',
                    'Advanced analytics'
                  ]}
                  highlighted
                  onSelect={() => handleUpgrade('professional')}
                  currentTier={subscription?.tier}
                />
                <PlanCard
                  tier="enterprise"
                  name="Enterprise"
                  price={999}
                  features={[
                    '500,000 emails/month',
                    '100,000 leads',
                    'Unlimited campaigns',
                    'AI Safety Console',
                    'Voice-to-Action Agent',
                    'Custom integrations',
                    'Dedicated support'
                  ]}
                  onSelect={() => handleUpgrade('enterprise')}
                  currentTier={subscription?.tier}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>
              Usage period: {usage?.period_start ? new Date(usage.period_start).toLocaleDateString() : ''} - 
              {usage?.period_end ? new Date(usage.period_end).toLocaleDateString() : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {usage?.usage?.map((metric) => (
                <div key={metric.metric_type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {metric.metric_type.replace('_', ' ')}
                    </span>
                    <span className={cn('text-sm font-semibold', getUsageColor(metric.percentage_used))}>
                      {metric.percentage_used.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all',
                          metric.percentage_used >= 90 ? 'bg-red-500' :
                          metric.percentage_used >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        )}
                        style={{ width: `${Math.min(metric.percentage_used, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.quantity.toLocaleString()} / {metric.limit.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            {usage?.usage?.some(m => m.percentage_used >= 90) && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Approaching Limit</h4>
                    <p className="text-sm text-amber-700">
                      You're close to reaching your plan limits. Consider upgrading to continue uninterrupted service.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowUpgrade(true)}>
                      View Plans
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        {subscription?.tier !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Download past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { date: 'Dec 26, 2025', amount: '$299.00', status: 'Paid' },
                { date: 'Nov 26, 2025', amount: '$299.00', status: 'Paid' },
                { date: 'Oct 26, 2025', amount: '$299.00', status: 'Paid' },
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.date}</p>
                    <p className="text-sm text-gray-500">{invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">{invoice.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const FeatureItem = ({ children }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const PlanCard = ({ tier, name, price, features, highlighted, onSelect, currentTier }) => {
  const isCurrentPlan = tier === currentTier;

  return (
    <div className={cn(
      'border rounded-lg p-6 transition-all',
      highlighted ? 'border-purple-500 shadow-lg scale-105' : 'border-gray-200',
      isCurrentPlan && 'bg-gray-50'
    )}>
      {highlighted && (
        <Badge className="mb-3 bg-purple-100 text-purple-800">Most Popular</Badge>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-4">
        ${price}
        <span className="text-lg text-gray-600">/month</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className="w-full"
        variant={highlighted ? 'default' : 'outline'}
        onClick={onSelect}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
      </Button>
    </div>
  );
};

export default BillingAndUsage;

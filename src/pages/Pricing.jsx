import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Sparkles, TrendingUp, Building2, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

/**
 * Pricing Page with Monthly/Yearly Toggle and Feature Matrix
 * Implements foundation layer requirement: "Build pricing page with toggle monthly/yearly + feature matrix"
 */
const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const isYearly = billingCycle === 'yearly';
  const yearlyDiscount = 0.2; // 20% discount for yearly

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for solo founders and small teams starting their outbound journey',
      monthlyPrice: 99,
      yearlyPrice: 79,
      popular: false,
      cta: 'Start Free Trial',
      features: {
        leads: '1,000 leads/month',
        emails: '5,000 emails/month',
        channels: 'Email only',
        aiPersonalization: 'Basic',
        sequences: '3 active campaigns',
        analytics: 'Basic analytics',
        support: 'Email support',
        team: '1 user',
        crm: 'Basic integrations',
        automation: false,
        advancedAI: false,
        customDomain: false,
        whiteLabel: false,
        sso: false,
        apiAccess: false,
        dedicatedManager: false,
        customContract: false,
      },
    },
    {
      name: 'Professional',
      icon: TrendingUp,
      description: 'For growing teams that need advanced features and multi-channel outreach',
      monthlyPrice: 299,
      yearlyPrice: 239,
      popular: true,
      cta: 'Start Free Trial',
      features: {
        leads: '10,000 leads/month',
        emails: '50,000 emails/month',
        channels: 'Email + LinkedIn + SMS',
        aiPersonalization: 'Advanced',
        sequences: 'Unlimited campaigns',
        analytics: 'Advanced analytics + A/B testing',
        support: 'Priority email & chat',
        team: 'Up to 5 users',
        crm: 'All integrations (Salesforce, HubSpot, etc.)',
        automation: true,
        advancedAI: true,
        customDomain: true,
        whiteLabel: false,
        sso: false,
        apiAccess: true,
        dedicatedManager: false,
        customContract: false,
      },
    },
    {
      name: 'Enterprise',
      icon: Building2,
      description: 'For large organizations requiring custom solutions, dedicated support, and SLAs',
      monthlyPrice: null,
      yearlyPrice: null,
      popular: false,
      cta: 'Contact Sales',
      features: {
        leads: 'Unlimited leads',
        emails: 'Unlimited emails',
        channels: 'All channels + Calls',
        aiPersonalization: 'Custom AI models',
        sequences: 'Unlimited campaigns',
        analytics: 'Executive dashboard + custom reports',
        support: '24/7 phone & dedicated success manager',
        team: 'Unlimited users',
        crm: 'Custom integrations + API',
        automation: true,
        advancedAI: true,
        customDomain: true,
        whiteLabel: true,
        sso: true,
        apiAccess: true,
        dedicatedManager: true,
        customContract: true,
      },
    },
  ];

  const featureMatrix = [
    {
      category: 'Core Features',
      features: [
        { name: 'Lead Database Access', starter: true, pro: true, enterprise: true },
        { name: 'Email Campaigns', starter: true, pro: true, enterprise: true },
        { name: 'LinkedIn Outreach', starter: false, pro: true, enterprise: true },
        { name: 'SMS Campaigns', starter: false, pro: true, enterprise: true },
        { name: 'Phone Call Scripts', starter: false, pro: false, enterprise: true },
        { name: 'Multi-channel Sequences', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'AI & Personalization',
      features: [
        { name: 'AI Content Generation', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
        { name: 'Lead Scoring', starter: false, pro: true, enterprise: true },
        { name: 'Intent Signal Detection', starter: false, pro: true, enterprise: true },
        { name: 'Smart Reply Suggestions', starter: false, pro: true, enterprise: true },
        { name: 'Custom AI Models', starter: false, pro: false, enterprise: true },
        { name: 'Predictive Analytics', starter: false, pro: false, enterprise: true },
      ],
    },
    {
      category: 'Analytics & Reporting',
      features: [
        { name: 'Campaign Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Enterprise' },
        { name: 'A/B Testing', starter: false, pro: true, enterprise: true },
        { name: 'ROI Tracking', starter: false, pro: true, enterprise: true },
        { name: 'Custom Reports', starter: false, pro: false, enterprise: true },
        { name: 'Executive Dashboard', starter: false, pro: false, enterprise: true },
        { name: 'Data Export', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Integrations',
      features: [
        { name: 'Basic CRM Integrations', starter: true, pro: true, enterprise: true },
        { name: 'Salesforce', starter: false, pro: true, enterprise: true },
        { name: 'HubSpot', starter: false, pro: true, enterprise: true },
        { name: 'API Access', starter: false, pro: true, enterprise: true },
        { name: 'Webhooks', starter: false, pro: true, enterprise: true },
        { name: 'Custom Integrations', starter: false, pro: false, enterprise: true },
      ],
    },
    {
      category: 'Team & Collaboration',
      features: [
        { name: 'Team Members', starter: '1 user', pro: 'Up to 5', enterprise: 'Unlimited' },
        { name: 'Role-based Access', starter: false, pro: true, enterprise: true },
        { name: 'Approval Workflows', starter: false, pro: false, enterprise: true },
        { name: 'Team Analytics', starter: false, pro: true, enterprise: true },
        { name: 'Shared Templates', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Security & Compliance',
      features: [
        { name: 'SSO / SAML', starter: false, pro: false, enterprise: true },
        { name: 'SOC 2 Compliance', starter: false, pro: false, enterprise: true },
        { name: 'GDPR Compliance', starter: true, pro: true, enterprise: true },
        { name: 'Data Encryption', starter: true, pro: true, enterprise: true },
        { name: 'Audit Logs', starter: false, pro: true, enterprise: true },
        { name: 'Custom Data Residency', starter: false, pro: false, enterprise: true },
      ],
    },
    {
      category: 'Support',
      features: [
        { name: 'Email Support', starter: true, pro: true, enterprise: true },
        { name: 'Priority Support', starter: false, pro: true, enterprise: true },
        { name: '24/7 Phone Support', starter: false, pro: false, enterprise: true },
        { name: 'Dedicated Account Manager', starter: false, pro: false, enterprise: true },
        { name: 'Custom Onboarding', starter: false, pro: false, enterprise: true },
        { name: 'SLA Guarantee', starter: false, pro: false, enterprise: '99.9%' },
      ],
    },
  ];

  const calculatePrice = (plan) => {
    if (!plan.monthlyPrice) return null;
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    } else if (value === false) {
      return <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />;
    } else {
      return <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Artisan</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/onboarding">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Badge variant="purple" className="mb-4">Transparent Pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your business. All plans include a 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(isYearly ? 'monthly' : 'yearly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="success" className="ml-2">Save 20%</Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = calculatePrice(plan);

            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? 'ring-2 ring-purple-600 shadow-xl scale-105 transform'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="purple">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Icon className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 min-h-[3rem]">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {price ? (
                      <>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">
                            ${price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                        {isYearly && (
                          <p className="text-sm text-gray-500 mt-2">
                            Billed annually (${price * 12}/year)
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        Custom Pricing
                      </div>
                    )}
                  </div>

                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full mb-6"
                    onClick={() => {
                      if (plan.cta === 'Contact Sales') {
                        window.location.href = 'mailto:sales@artisan.co';
                      } else {
                        window.location.href = '/onboarding';
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.leads}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.emails}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.channels}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.aiPersonalization} AI personalization
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.team}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Compare all features
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureMatrix.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <td
                          colSpan="4"
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr
                          key={featureIndex}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {feature.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureValue(feature.starter)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureValue(feature.pro)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureValue(feature.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the difference.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for annual plans.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all plans include a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'What happens when I exceed my limits?',
                a: 'We\'ll notify you when you\'re approaching your limits. You can either upgrade your plan or purchase additional capacity as needed.',
              },
              {
                q: 'Do you offer discounts for non-profits?',
                a: 'Yes! We offer special pricing for non-profits and educational institutions. Contact sales for details.',
              },
            ].map((faq, index) => (
              <Card key={index} className="text-left">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your outbound sales?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of teams already using Artisan to automate their BDR workflows
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/onboarding">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <a href="mailto:sales@artisan.co">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
                Contact Sales
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

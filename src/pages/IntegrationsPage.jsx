import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CheckCircle2, ArrowRight, Sparkles, Database, Mail, MessageSquare, Phone, Calendar, FileText, Zap, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

/**
 * Integrations Page with logos and step-by-step instructions
 * Implements foundation layer requirement: "Create integrations page with logos + step instructions"
 */
const IntegrationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Integrations', icon: Globe },
    { id: 'crm', name: 'CRM', icon: Database },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'communication', name: 'Communication', icon: MessageSquare },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'automation', name: 'Automation', icon: Zap },
  ];

  const integrations = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync leads, contacts, and campaign data with Salesforce CRM',
      logo: '🔷',
      tier: 'professional',
      popular: true,
      status: 'available',
      setupTime: '5 minutes',
      steps: [
        'Navigate to Settings > Integrations',
        'Click "Connect Salesforce"',
        'Log in with your Salesforce credentials',
        'Select which objects to sync (Leads, Contacts, Opportunities)',
        'Choose sync direction (one-way or two-way)',
        'Click "Authorize" to complete setup',
      ],
      features: [
        'Two-way sync for leads and contacts',
        'Automatic activity logging',
        'Campaign attribution tracking',
        'Custom field mapping',
      ],
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      description: 'Connect your HubSpot CRM for seamless lead management',
      logo: '🧡',
      tier: 'professional',
      popular: true,
      status: 'available',
      setupTime: '3 minutes',
      steps: [
        'Go to Settings > Integrations',
        'Select "HubSpot" from the CRM section',
        'Click "Connect to HubSpot"',
        'Authorize Artisan to access your HubSpot account',
        'Configure sync settings and field mappings',
        'Save and activate the integration',
      ],
      features: [
        'Real-time contact sync',
        'Deal and pipeline integration',
        'Email tracking integration',
        'Workflow automation',
      ],
    },
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'email',
      description: 'Send campaigns through your Gmail account with OAuth',
      logo: '📧',
      tier: 'starter',
      popular: true,
      status: 'available',
      setupTime: '2 minutes',
      steps: [
        'Navigate to Settings > Email Accounts',
        'Click "Add Gmail Account"',
        'Sign in with your Google account',
        'Grant permissions for sending emails',
        'Configure daily sending limits',
        'Test the connection with a sample email',
      ],
      features: [
        'OAuth 2.0 authentication',
        'Automatic email tracking',
        'Reply detection',
        'Bounce handling',
      ],
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      category: 'email',
      description: 'Use your Outlook/Office 365 account for email campaigns',
      logo: '📬',
      tier: 'starter',
      popular: false,
      status: 'available',
      setupTime: '3 minutes',
      steps: [
        'Go to Settings > Email Accounts',
        'Select "Microsoft Outlook"',
        'Sign in with your Microsoft account',
        'Authorize Artisan to send emails',
        'Set sending preferences and limits',
        'Complete the integration',
      ],
      features: [
        'Office 365 support',
        'Exchange server compatibility',
        'Shared mailbox support',
        'Calendar integration',
      ],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      category: 'communication',
      description: 'Integrate LinkedIn for social selling and outreach',
      logo: '💼',
      tier: 'professional',
      popular: true,
      status: 'available',
      setupTime: '5 minutes',
      steps: [
        'Go to Settings > Integrations > LinkedIn',
        'Click "Connect LinkedIn Sales Navigator"',
        'Log in to your LinkedIn account',
        'Authorize connection and messaging permissions',
        'Configure message templates and limits',
        'Start sending LinkedIn campaigns',
      ],
      features: [
        'InMail and connection requests',
        'Profile view tracking',
        'Automated follow-ups',
        'Sales Navigator integration',
      ],
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Get real-time notifications in Slack channels',
      logo: '💬',
      tier: 'starter',
      popular: false,
      status: 'available',
      setupTime: '2 minutes',
      steps: [
        'Navigate to Settings > Integrations',
        'Find and select "Slack"',
        'Click "Add to Slack"',
        'Choose your workspace and channel',
        'Select notification preferences',
        'Save and test the integration',
      ],
      features: [
        'Reply notifications',
        'Campaign status updates',
        'Lead activity alerts',
        'Custom notification rules',
      ],
    },
    {
      id: 'calendly',
      name: 'Calendly',
      category: 'calendar',
      description: 'Embed meeting scheduling links in your outreach',
      logo: '📅',
      tier: 'professional',
      popular: false,
      status: 'available',
      setupTime: '2 minutes',
      steps: [
        'Go to Settings > Integrations',
        'Select "Calendly"',
        'Enter your Calendly scheduling link',
        'Configure link placement in templates',
        'Enable automatic booking notifications',
        'Activate the integration',
      ],
      features: [
        'Automatic link insertion',
        'Booking confirmations',
        'Calendar sync',
        'Custom event types',
      ],
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'automation',
      description: 'Connect Artisan to 5,000+ apps with Zapier',
      logo: '⚡',
      tier: 'professional',
      popular: false,
      status: 'available',
      setupTime: '10 minutes',
      steps: [
        'Sign up for a Zapier account if you don\'t have one',
        'Search for "Artisan" in Zapier',
        'Choose a trigger event (e.g., "New Lead")',
        'Select an action app (e.g., Google Sheets)',
        'Configure the data mapping',
        'Test and activate your Zap',
      ],
      features: [
        '5,000+ app connections',
        'Custom workflows',
        'Multi-step automation',
        'Conditional logic',
      ],
    },
    {
      id: 'clearbit',
      name: 'Clearbit',
      category: 'crm',
      description: 'Enrich leads with company and contact data',
      logo: '🎯',
      tier: 'professional',
      popular: false,
      status: 'available',
      setupTime: '3 minutes',
      steps: [
        'Go to Settings > Integrations > Data Enrichment',
        'Select "Clearbit"',
        'Enter your Clearbit API key',
        'Configure enrichment preferences',
        'Set auto-enrichment rules',
        'Test with a sample lead',
      ],
      features: [
        'Company data enrichment',
        'Contact information',
        'Firmographic data',
        'Real-time enrichment',
      ],
    },
    {
      id: 'twilio',
      name: 'Twilio',
      category: 'communication',
      description: 'Send SMS campaigns through Twilio',
      logo: '📱',
      tier: 'professional',
      popular: false,
      status: 'available',
      setupTime: '5 minutes',
      steps: [
        'Create a Twilio account or use existing one',
        'Get your Account SID and Auth Token',
        'Go to Settings > Integrations > SMS',
        'Select "Twilio" and enter credentials',
        'Configure your Twilio phone number',
        'Test SMS sending',
      ],
      features: [
        'SMS campaign support',
        'Delivery tracking',
        'Reply handling',
        'International SMS',
      ],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'automation',
      description: 'Coming Soon - Track revenue from outbound campaigns',
      logo: '💳',
      tier: 'enterprise',
      popular: false,
      status: 'coming_soon',
      setupTime: 'TBD',
      steps: [
        'Integration coming soon',
        'Will support automatic revenue attribution',
        'Pipeline to revenue tracking',
        'Customer lifecycle tracking',
      ],
      features: [
        'Revenue attribution (coming soon)',
        'Customer tracking (coming soon)',
        'Pipeline metrics (coming soon)',
      ],
    },
  ];

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [expandedIntegration, setExpandedIntegration] = useState(null);

  const getTierBadge = (tier) => {
    const tierConfig = {
      starter: { variant: 'blue', label: 'Starter+' },
      professional: { variant: 'purple', label: 'Pro+' },
      enterprise: { variant: 'gold', label: 'Enterprise' },
    };
    const config = tierConfig[tier] || tierConfig.starter;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Artisan</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect Your Favorite Tools
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Artisan integrates with the tools you already use. Set up in minutes, not hours.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {integrations.filter(i => i.status === 'available').length} Integrations
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Average setup: 3-5 minutes
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className={`relative hover:shadow-lg transition-shadow ${
                integration.popular ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              {integration.popular && (
                <div className="absolute -top-3 -right-3">
                  <Badge variant="purple">Popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{integration.logo}</div>
                  <div className="flex flex-col items-end space-y-2">
                    {getTierBadge(integration.tier)}
                    {integration.status === 'coming_soon' && (
                      <Badge variant="gray">Coming Soon</Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>

                {integration.status === 'available' && (
                  <>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      Setup time: {integration.setupTime}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mb-4"
                      onClick={() => setExpandedIntegration(
                        expandedIntegration === integration.id ? null : integration.id
                      )}
                    >
                      {expandedIntegration === integration.id ? 'Hide' : 'Show'} Setup Steps
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {expandedIntegration === integration.id && (
                      <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Setup Steps:
                          </h4>
                          <ol className="space-y-2">
                            {integration.steps.map((step, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Key Features:
                          </h4>
                          <ul className="space-y-1">
                            {integration.features.map((feature, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button variant="primary" className="w-full">
                          Connect {integration.name}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {integration.status === 'coming_soon' && (
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No integrations found matching your search.
            </p>
          </div>
        )}

        {/* Request Integration Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Don't see the integration you need?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're constantly adding new integrations. Let us know what you'd like to see next.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = 'mailto:integrations@artisan.co?subject=Integration Request'}
            >
              Request an Integration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationsPage;

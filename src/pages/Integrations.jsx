import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/Toast';
import { Badge } from '../components/ui/Badge';
import { Search, Zap, CheckCircle2, ExternalLink, Star, TrendingUp } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import {
  setActiveCRM,
  getActiveCRM,
  connectIntegration,
  isIntegrationConnected,
  extractIntegrationData,
  importLeads,
  parseCSVLeads,
  parseJSONLeads,
  isTrustedSource,
} from '../lib/dataService';
import VueWidgetHost from '../components/features/VueWidgetHost';
import {
  WebhookBuilder,
  CalendarSync,
  IntegrationHealth,
} from '../components/integrations/IntegrationComponents';

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const toast = useToast();
  const currentCRM = getActiveCRM();
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dbSource, setDbSource] = useState('Database');
  const [dbPaste, setDbPaste] = useState('');
  const [dbFile, setDbFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Integrations', count: 24 },
    { id: 'crm', label: 'CRM', count: 8 },
    { id: 'email', label: 'Email', count: 6 },
    { id: 'analytics', label: 'Analytics', count: 5 },
    { id: 'communication', label: 'Communication', count: 5 },
  ];

  const integrations = [
    {
      id: 1,
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync leads, contacts, and opportunities with Salesforce CRM',
      logo: '☁️',
      color: 'bg-blue-100',
      connected: true,
      popular: true,
      rating: 4.9,
      users: '12k+',
    },
    {
      id: 2,
      name: 'HubSpot',
      category: 'crm',
      description: 'Bi-directional sync with HubSpot CRM and Marketing Hub',
      logo: '🧡',
      color: 'bg-orange-100',
      connected: true,
      popular: true,
      rating: 4.8,
      users: '10k+',
    },
    {
      id: 3,
      name: 'Gmail',
      category: 'email',
      description: 'Send emails through your Gmail account with full tracking',
      logo: '📧',
      color: 'bg-red-100',
      connected: true,
      popular: true,
      rating: 4.7,
      users: '25k+',
    },
    {
      id: 4,
      name: 'Outlook',
      category: 'email',
      description: 'Connect Microsoft 365 for email sending and calendar sync',
      logo: '📘',
      color: 'bg-blue-100',
      connected: false,
      popular: true,
      rating: 4.6,
      users: '15k+',
    },
    {
      id: 5,
      name: 'LinkedIn Sales Navigator',
      category: 'communication',
      description: 'Import leads and enrich data from Sales Navigator',
      logo: '💼',
      color: 'bg-blue-700 text-white',
      connected: false,
      popular: true,
      rating: 4.5,
      users: '8k+',
    },
    {
      id: 6,
      name: 'Slack',
      category: 'communication',
      description: 'Get real-time notifications for replies and meetings in Slack',
      logo: '💬',
      color: 'bg-purple-100',
      connected: true,
      popular: false,
      rating: 4.7,
      users: '18k+',
    },
    {
      id: 7,
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track website visits from your outreach campaigns',
      logo: '📊',
      color: 'bg-yellow-100',
      connected: false,
      popular: false,
      rating: 4.4,
      users: '6k+',
    },
    {
      id: 8,
      name: 'Zapier',
      category: 'crm',
      description: 'Connect to 5,000+ apps with Zapier automation',
      logo: '⚡',
      color: 'bg-orange-100',
      connected: false,
      popular: true,
      rating: 4.8,
      users: '20k+',
    },
    {
      id: 9,
      name: 'Pipedrive',
      category: 'crm',
      description: 'Sync your sales pipeline with Pipedrive CRM',
      logo: '🔷',
      color: 'bg-green-100',
      connected: false,
      popular: false,
      rating: 4.6,
      users: '5k+',
    },
    {
      id: 10,
      name: 'Zoom',
      category: 'communication',
      description: 'Automatically create and schedule Zoom meetings',
      logo: '🎥',
      color: 'bg-blue-100',
      connected: true,
      popular: false,
      rating: 4.5,
      users: '14k+',
    },
    {
      id: 11,
      name: 'Calendly',
      category: 'communication',
      description: 'Share your Calendly link in outreach sequences',
      logo: '📅',
      color: 'bg-blue-100',
      connected: false,
      popular: false,
      rating: 4.7,
      users: '9k+',
    },
    {
      id: 12,
      name: 'Intercom',
      category: 'communication',
      description: 'Connect your Intercom conversations and contacts',
      logo: '💭',
      color: 'bg-blue-600 text-white',
      connected: false,
      popular: false,
      rating: 4.4,
      users: '4k+',
    },
    {
      id: 13,
      name: 'Salesloft',
      category: 'communication',
      description: 'Import sequences and engagement data from Salesloft',
      logo: '🧰',
      color: 'bg-indigo-100',
      connected: false,
      popular: true,
      rating: 4.6,
      users: '11k+',
    },
    {
      id: 14,
      name: 'Gong',
      category: 'analytics',
      description: 'Sync call recordings and insights from Gong',
      logo: '🎧',
      color: 'bg-pink-100',
      connected: false,
      popular: true,
      rating: 4.7,
      users: '9k+',
    },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <DashboardLayout
      title="Integrations"
      subtitle="Connect your favorite tools and supercharge your workflow"
    >
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Connected</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Available</p>
                <p className="text-2xl font-bold text-blue-600">{integrations.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Popular</p>
                <p className="text-2xl font-bold text-purple-600">
                  {integrations.filter(i => i.popular).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vue Widget Demo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Embedded Vue Widget (Lazy-loaded)</CardTitle>
          <CardDescription>A minimal Vue 3 component mounted inside React</CardDescription>
        </CardHeader>
        <CardContent>
          <VueWidgetHost title="Vue Counter" initial={3} />
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="pl-11"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  className={`cursor-pointer whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Universal Database Import */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Universal Database Import</h3>
              <p className="text-sm text-gray-600">
                Bring leads from any database via CSV or JSON export
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={() => setDbModalOpen(true)} className="gap-2">
                <Zap size={16} /> Import CSV/JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 ${integration.color} rounded-xl flex items-center justify-center text-2xl`}
                >
                  {integration.logo}
                </div>
                {integration.popular && (
                  <Badge variant="accent" className="gap-1">
                    <Star size={12} fill="currentColor" />
                    Popular
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{integration.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{integration.rating}</span>
                </div>
                <div>{integration.users} users</div>
              </div>

              {integration.connected || isIntegrationConnected(integration.name) ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <CheckCircle2 size={16} />
                    Connected
                  </Button>
                  {integration.category === 'crm' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActiveCRM(integration.name);
                        toast.success(`${integration.name} set as active CRM`);
                      }}
                    >
                      {currentCRM === integration.name ? 'Active CRM' : 'Set Active'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const res = await extractIntegrationData(integration.name);
                      toast.success(
                        `Imported ${res.importedCount} records from ${integration.name}`
                      );
                    }}
                  >
                    Import Data
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    connectIntegration(integration.name);
                    if (integration.category === 'crm') {
                      setActiveCRM(integration.name);
                    }
                    toast.success(`${integration.name} connected`);
                  }}
                >
                  <Zap size={16} />
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Import Modal */}
      <Modal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} size="lg">
        <ModalHeader onClose={() => setDbModalOpen(false)}>
          <ModalTitle>Import Leads from CSV/JSON</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">Source Name</label>
                <Input
                  value={dbSource}
                  onChange={e => setDbSource(e.target.value)}
                  placeholder="e.g., Postgres, MySQL"
                />
                <div className="mt-2">
                  {isTrustedSource(dbSource) ? (
                    <Badge variant="success" className="gap-1">
                      {' '}
                      <CheckCircle2 size={12} /> Trusted source
                    </Badge>
                  ) : (
                    <Badge variant="warning">Unverified source</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">Upload File</label>
                <input
                  type="file"
                  accept=".csv,.json,application/json,text/csv"
                  onChange={e => setDbFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">Or Paste Rows (CSV or JSON array)</label>
              <textarea
                value={dbPaste}
                onChange={e => setDbPaste(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                placeholder="name,email,company,title,location,score,status\nJane Doe,jane@acme.com,Acme,VP Sales,NYC,88,warm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Required column: <span className="font-medium">email</span>. Optional: name, title,
                company, location, score, status.
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDbModalOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gap-2"
            onClick={async () => {
              setIsImporting(true);
              try {
                let leads = [];
                if (dbFile) {
                  const text = await dbFile.text();
                  const isJSON =
                    dbFile.name.toLowerCase().endsWith('.json') || text.trim().startsWith('[');
                  leads = isJSON ? parseJSONLeads(text, dbSource) : parseCSVLeads(text, dbSource);
                } else if (dbPaste.trim()) {
                  const text = dbPaste.trim();
                  const isJSON = text.startsWith('[');
                  leads = isJSON ? parseJSONLeads(text, dbSource) : parseCSVLeads(text, dbSource);
                }
                if (!leads.length) {
                  toast.warning('No leads parsed. Check format and try again.');
                } else {
                  const res = importLeads(leads, dbSource);
                  toast.success(`Imported ${res.importedCount} leads from ${dbSource}`);
                  setDbModalOpen(false);
                  setDbPaste('');
                  setDbFile(null);
                }
              } catch (e) {
                toast.error('Import failed. Please verify your file or pasted data.');
              } finally {
                setIsImporting(false);
              }
            }}
            disabled={isImporting}
          >
            {isImporting ? 'Importing…' : 'Import'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Advanced Integration Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <WebhookBuilder />
        <CalendarSync />
        <IntegrationHealth />
      </div>

      {/* Custom Integration CTA */}
      <Card className="mt-8 bg-gradient-to-br from-accent-500 to-primary-500">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Need a Custom Integration?</h3>
            <p className="text-white/90 mb-6">
              Our team can build custom integrations for your enterprise needs
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary-500 hover:bg-gray-100"
            >
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Integrations;

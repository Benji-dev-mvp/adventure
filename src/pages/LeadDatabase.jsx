import React, { useState } from 'react';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  FileUp,
  Users,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Tag,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  BooleanSearchBuilder,
  LookalikeAudience,
  IntentSignals,
  CompanyHierarchy,
  ContactWaterfall,
} from '../components/leads/LeadDatabaseComponents';

const LeadDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const searchFilters = [
    { id: 'title', label: 'Job Title', icon: Users },
    { id: 'company', label: 'Company Size', icon: Building2 },
    { id: 'industry', label: 'Industry', icon: Tag },
    { id: 'location', label: 'Location', icon: Globe },
  ];

  const savedSearches = [
    {
      name: 'Enterprise SaaS CTOs',
      filters: 'Title: CTO, Company Size: 500+, Industry: SaaS',
      results: 2847,
      lastRun: '2 days ago',
    },
    {
      name: 'Mid-Market Sales VPs',
      filters: 'Title: VP of Sales, Company Size: 100-500, Revenue: $10M+',
      results: 1523,
      lastRun: '5 days ago',
    },
    {
      name: 'Startup Founders - AI/ML',
      filters: 'Title: Founder/CEO, Industry: AI/ML, Funding: Seed-Series B',
      results: 892,
      lastRun: '1 week ago',
    },
  ];

  const recentUploads = [
    {
      name: 'conference-attendees-2024.csv',
      date: 'Yesterday',
      leads: 847,
      status: 'completed',
    },
    {
      name: 'webinar-registrants-q1.csv',
      date: '3 days ago',
      leads: 423,
      status: 'completed',
    },
    {
      name: 'partner-referrals.csv',
      date: '1 week ago',
      leads: 156,
      status: 'completed',
    },
  ];

  return (
    <PageScaffold
      config={{
        title: 'Lead Database',
        subtitle: 'Access 300M+ verified B2B contacts',
        badges: [{ label: 'Database', color: 'blue' }],
        showInspector: true,
        showActivityPanel: false,
      }}
    >
      <Tabs defaultValue="search" className="space-y-3">
        <TabsList className="w-full flex-wrap">
          <TabsTrigger value="search">Search Leads</TabsTrigger>
          <TabsTrigger value="upload">Upload Leads</TabsTrigger>
          <TabsTrigger value="saved">Saved Searches</TabsTrigger>
        </TabsList>

        {/* Search Leads Tab */}
        <TabsContent value="search">
          <div className="grid lg:grid-cols-4 gap-3">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchFilters.map(filter => {
                      const Icon = filter.icon;
                      return (
                        <div key={filter.id}>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Icon size={16} />
                            {filter.label}
                          </label>
                          <Input placeholder={`Select ${filter.label.toLowerCase()}`} />
                        </div>
                      );
                    })}

                    <div className="pt-4 border-t border-gray-200">
                      <Button className="w-full gap-2">
                        <Sparkles size={16} />
                        AI-Powered Search
                      </Button>
                      <Button variant="outline" className="w-full mt-2">
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent-600 mb-1">300M+</p>
                    <p className="text-sm text-gray-600">Verified contacts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3 space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <Input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name, title, company..."
                        className="pl-11"
                      />
                    </div>
                    <Button className="gap-2">
                      <Search size={18} />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Example Search Results */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Search Results</CardTitle>
                      <CardDescription>2,847 leads found</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} />
                        Export
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Plus size={16} />
                        Add to Campaign
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: 'Jennifer Martinez',
                        title: 'CTO',
                        company: 'TechVision Inc.',
                        location: 'San Francisco, CA',
                        email: 'jennifer.m@techvision.com',
                        verified: true,
                      },
                      {
                        name: 'Robert Chen',
                        title: 'VP of Engineering',
                        company: 'CloudScale Systems',
                        location: 'Austin, TX',
                        email: 'r.chen@cloudscale.io',
                        verified: true,
                      },
                      {
                        name: 'Lisa Thompson',
                        title: 'Head of Technology',
                        company: 'DataFlow Analytics',
                        location: 'New York, NY',
                        email: 'l.thompson@dataflow.com',
                        verified: true,
                      },
                    ].map((lead, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                              {lead.verified && (
                                <Badge variant="success" className="gap-1 text-xs">
                                  <CheckCircle2 size={10} />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {lead.title} at {lead.company}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">{lead.location}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex items-center gap-1 text-accent-600 hover:text-accent-700"
                              >
                                <Mail size={14} />
                                {lead.email}
                              </a>
                              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                                <Linkedin size={14} />
                                LinkedIn
                              </button>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Showing 1-3 of 2,847 results</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Upload Leads Tab */}
        <TabsContent value="upload">
          <div className="grid md:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp size={20} />
                  Upload CSV/Excel
                </CardTitle>
                <CardDescription>Import your existing lead lists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-accent-400 transition-colors cursor-pointer">
                  <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your file here</h3>
                  <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                  <Badge variant="outline">Supports CSV, XLSX</Badge>
                </div>

                <div className="mt-6 p-4 bg-accent-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Required fields:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Email address (required)</li>
                    <li>• First name, Last name</li>
                    <li>• Company name</li>
                    <li>• Job title (recommended)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your uploaded lead lists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUploads.map((upload, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{upload.name}</h4>
                        <Badge variant="success">{upload.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {upload.leads} leads • {upload.date}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Saved Searches Tab */}
        <TabsContent value="saved">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedSearches.map((search, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{search.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{search.filters}</p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-lg font-bold text-accent-600">
                        {search.results.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">leads found</p>
                    </div>
                    <p className="text-xs text-gray-500">Last run: {search.lastRun}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="flex-1 gap-2">
                      <Search size={14} />
                      Run Search
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-2 border-dashed border-gray-300 hover:border-accent-400 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                <Plus size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Search</h3>
                <p className="text-sm text-gray-600">Save your search criteria for quick access</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Lead Database Features */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-bold">Advanced Search & Enrichment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <BooleanSearchBuilder />
          <LookalikeAudience />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <IntentSignals />
          <CompanyHierarchy />
          <ContactWaterfall />
        </div>
      </div>
    </PageScaffold>
  );
};

export default LeadDatabase;

import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Search, Filter, Download, Users, Building, MapPin, Briefcase, TrendingUp, Zap, CheckCircle, Star } from 'lucide-react';

const AdvancedLeadDatabase = () => {
  const [filters, setFilters] = useState({
    jobTitle: '',
    companySize: '',
    industry: '',
    location: '',
    revenue: '',
    techStack: [],
    intentSignals: []
  });

  const [searchResults] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'VP of Sales',
      company: 'TechCorp Solutions',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/sarahjohnson',
      verified: true,
      employees: '501-1000',
      revenue: '$50M-$100M',
      industry: 'B2B SaaS',
      location: 'San Francisco, CA',
      techStack: ['Salesforce', 'HubSpot', 'Slack'],
      intentSignals: ['Recently funded', 'Hiring SDRs'],
      score: 94
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Director of Marketing',
      company: 'GrowthStart Inc',
      email: 'mchen@growthstart.io',
      phone: '+1 (555) 234-5678',
      linkedin: 'linkedin.com/in/michaelchen',
      verified: true,
      employees: '51-200',
      revenue: '$10M-$50M',
      industry: 'Marketing Tech',
      location: 'Austin, TX',
      techStack: ['Marketo', 'Salesforce', 'Outreach'],
      intentSignals: ['Job posting', 'Tech stack expansion'],
      score: 88
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Chief Revenue Officer',
      company: 'ScaleUp Dynamics',
      email: 'emily.r@scaleup.com',
      phone: '+1 (555) 345-6789',
      linkedin: 'linkedin.com/in/emilyrodriguez',
      verified: true,
      employees: '201-500',
      revenue: '$25M-$75M',
      industry: 'Enterprise SaaS',
      location: 'New York, NY',
      techStack: ['Salesforce', 'Gong', 'ZoomInfo'],
      intentSignals: ['Series B funding', 'Rapid growth'],
      score: 96
    }
  ]);

  const filterOptions = {
    jobTitles: ['VP of Sales', 'Director of Marketing', 'CRO', 'CEO', 'Head of Growth', 'SDR Manager'],
    companySizes: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    industries: ['B2B SaaS', 'Enterprise SaaS', 'Marketing Tech', 'Sales Tech', 'E-commerce', 'Fintech'],
    locations: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Remote', 'US'],
    revenues: ['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'],
    techStacks: ['Salesforce', 'HubSpot', 'Marketo', 'Outreach', 'SalesLoft', 'Gong', 'ZoomInfo'],
    intentSignals: ['Recently funded', 'Hiring rapidly', 'Job postings', 'Tech stack expansion', 'Leadership changes']
  };

  const stats = {
    totalContacts: 300000000,
    verifiedEmails: 289000000,
    directDials: 87000000,
    activeJobChanges: 2300000
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            B2B Contact Database
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Access 300M+ verified B2B contacts with advanced filtering
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.totalContacts / 1000000).toFixed(0)}M+</p>
                  <p className="text-xs text-gray-600">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.verifiedEmails / 1000000).toFixed(0)}M+</p>
                  <p className="text-xs text-gray-600">Verified Emails</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.directDials / 1000000).toFixed(0)}M+</p>
                  <p className="text-xs text-gray-600">Direct Dials</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.activeJobChanges / 1000000).toFixed(1)}M+</p>
                  <p className="text-xs text-gray-600">Job Changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-3">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter size={16} />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Job Title</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>All Titles</option>
                    {filterOptions.jobTitles.map((title) => (
                      <option key={title}>{title}</option>
                    ))}
                  </select>
                </div>

                {/* Company Size */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Company Size</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>All Sizes</option>
                    {filterOptions.companySizes.map((size) => (
                      <option key={size}>{size} employees</option>
                    ))}
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Industry</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>All Industries</option>
                    {filterOptions.industries.map((industry) => (
                      <option key={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Location</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>All Locations</option>
                    {filterOptions.locations.map((loc) => (
                      <option key={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Revenue */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Revenue</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>All Revenues</option>
                    {filterOptions.revenues.map((rev) => (
                      <option key={rev}>{rev}</option>
                    ))}
                  </select>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Tech Stack</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filterOptions.techStacks.map((tech) => (
                      <label key={tech} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Intent Signals */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Intent Signals</label>
                  <div className="space-y-1">
                    {filterOptions.intentSignals.map((signal) => (
                      <label key={signal} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{signal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="col-span-9">
            {/* Search Bar */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Search by name, company, or email..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download size={16} />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Found <span className="font-bold">12,847</span> contacts matching your criteria
              </p>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {searchResults.map((contact) => (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Contact Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold">{contact.name}</h3>
                              {contact.verified && (
                                <Badge variant="success" className="text-xs gap-1">
                                  <CheckCircle size={12} />
                                  Verified
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs gap-1">
                                <Star size={12} className="text-yellow-500" />
                                {contact.score} Score
                              </Badge>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{contact.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{contact.company}</p>
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">📧</span>
                            <span className="text-blue-600">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">📞</span>
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building size={14} className="text-gray-600" />
                            <span>{contact.employees} employees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-600" />
                            <span>{contact.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-gray-600" />
                            <span>{contact.industry}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-gray-600" />
                            <span>{contact.revenue}</span>
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack:</p>
                          <div className="flex flex-wrap gap-1">
                            {contact.techStack.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Intent Signals */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Intent Signals:</p>
                          <div className="flex flex-wrap gap-1">
                            {contact.intentSignals.map((signal) => (
                              <Badge key={signal} variant="warning" className="text-xs gap-1">
                                <Zap size={10} />
                                {signal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm">Add to Campaign</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" variant="outline">Enrich Data</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="text-sm text-gray-600">...</span>
              <Button variant="outline" size="sm">128</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvancedLeadDatabase;

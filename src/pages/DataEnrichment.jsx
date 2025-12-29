import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Database,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  Phone,
  Mail,
  Linkedin,
  Globe,
  Zap,
  AlertCircle,
  Info,
} from 'lucide-react';

const DataEnrichment = () => {
  const [enrichmentJobs] = useState([
    {
      id: 1,
      name: 'Enterprise Tech Companies Q4',
      status: 'completed',
      totalLeads: 1250,
      enriched: 1189,
      failed: 61,
      successRate: 95.1,
      dataPoints: ['email', 'phone', 'job_title', 'company', 'linkedin', 'tech_stack', 'funding'],
      startedAt: '2024-01-10 09:00',
      completedAt: '2024-01-10 09:47',
    },
    {
      id: 2,
      name: 'SaaS Founders - Series A+',
      status: 'running',
      totalLeads: 847,
      enriched: 623,
      failed: 12,
      successRate: 98.1,
      progress: 75,
      dataPoints: ['email', 'phone', 'company', 'funding', 'employee_count', 'revenue'],
      startedAt: '2024-01-11 14:20',
      estimatedCompletion: '10 minutes',
    },
    {
      id: 3,
      name: 'Healthcare Decision Makers',
      status: 'queued',
      totalLeads: 2100,
      dataPoints: ['email', 'phone', 'job_title', 'company'],
      queuePosition: 2,
    },
  ]);

  const enrichmentStats = {
    totalEnriched: 127483,
    thisMonth: 8942,
    successRate: 96.4,
    avgTimePerLead: '2.3s',
    dataPoints: 18,
    providers: 6,
  };

  const dataProviders = [
    { name: 'ZoomInfo', status: 'active', coverage: 95, latency: '120ms', cost: '$$$' },
    { name: 'Clearbit', status: 'active', coverage: 88, latency: '80ms', cost: '$$' },
    { name: 'Apollo.io', status: 'active', coverage: 92, latency: '150ms', cost: '$$' },
    { name: 'Hunter.io', status: 'active', coverage: 78, latency: '60ms', cost: '$' },
    { name: 'LinkedIn', status: 'active', coverage: 98, latency: '200ms', cost: '$$$' },
    { name: 'Crunchbase', status: 'active', coverage: 85, latency: '100ms', cost: '$$' },
  ];

  const enrichmentFields = [
    {
      category: 'Contact Information',
      fields: [
        { name: 'Work Email', coverage: 94, icon: Mail, verified: true },
        { name: 'Direct Phone', coverage: 67, icon: Phone, verified: true },
        { name: 'Mobile Phone', coverage: 34, icon: Phone, verified: false },
        { name: 'LinkedIn URL', coverage: 89, icon: Linkedin, verified: true },
      ],
    },
    {
      category: 'Professional Details',
      fields: [
        { name: 'Job Title', coverage: 98, icon: Users, verified: true },
        { name: 'Job Function', coverage: 95, icon: Target, verified: true },
        { name: 'Seniority Level', coverage: 93, icon: TrendingUp, verified: true },
        { name: 'Department', coverage: 91, icon: Building2, verified: true },
      ],
    },
    {
      category: 'Company Information',
      fields: [
        { name: 'Company Name', coverage: 99, icon: Building2, verified: true },
        { name: 'Company Size', coverage: 87, icon: Users, verified: true },
        { name: 'Revenue Range', coverage: 72, icon: DollarSign, verified: false },
        { name: 'Industry', coverage: 94, icon: Building2, verified: true },
        { name: 'Founded Year', coverage: 81, icon: Clock, verified: true },
        { name: 'Location/HQ', coverage: 96, icon: Globe, verified: true },
      ],
    },
    {
      category: 'Technographics',
      fields: [
        { name: 'Tech Stack', coverage: 76, icon: Database, verified: true },
        { name: 'CRM Used', coverage: 68, icon: Database, verified: false },
        { name: 'Marketing Tools', coverage: 54, icon: Zap, verified: false },
      ],
    },
    {
      category: 'Intent Signals',
      fields: [
        { name: 'Job Postings', coverage: 82, icon: TrendingUp, verified: true },
        { name: 'Funding Events', coverage: 65, icon: DollarSign, verified: true },
        { name: 'Web Activity', coverage: 43, icon: Globe, verified: false },
        { name: 'Content Downloads', coverage: 38, icon: Target, verified: false },
      ],
    },
  ];

  const recentEnrichments = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Inc',
      before: { email: null, phone: null, title: 'Manager' },
      after: {
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        title: 'VP of Sales',
        linkedin: 'linkedin.com/in/sarahjohnson',
        companySize: '500-1000',
        revenue: '$50M-$100M',
      },
      enrichedAt: '2 minutes ago',
      dataPoints: 12,
    },
    {
      name: 'Michael Chen',
      company: 'StartupXYZ',
      before: { email: 'michael@startup.io', phone: null, title: null },
      after: {
        email: 'michael.chen@startupxyz.io',
        phone: '+1 (555) 987-6543',
        title: 'Founder & CEO',
        linkedin: 'linkedin.com/in/michaelchen',
        companySize: '10-50',
        funding: 'Series A - $5M',
      },
      enrichedAt: '5 minutes ago',
      dataPoints: 15,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Data Enrichment & Intent Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time lead enrichment from 6 premium data providers
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Database size={20} className="text-blue-500" />
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.totalEnriched.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Enriched</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Sparkles size={20} className="text-purple-500" />
                <Badge variant="success" className="text-xs">
                  +24%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.thisMonth.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.successRate}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock size={20} className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.avgTimePerLead}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Time/Lead</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target size={20} className="text-cyan-500" />
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.dataPoints}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Data Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap size={20} className="text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{enrichmentStats.providers}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Data Providers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="mb-6">
          <TabsList>
            <TabsTrigger value="jobs">Enrichment Jobs</TabsTrigger>
            <TabsTrigger value="fields">Available Fields</TabsTrigger>
            <TabsTrigger value="providers">Data Providers</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Enrichment Jobs */}
          <TabsContent value="jobs">
            <div className="grid gap-4">
              {enrichmentJobs.map(job => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{job.name}</h3>
                        <div className="flex items-center gap-2">
                          {job.status === 'completed' && (
                            <Badge variant="success">
                              <CheckCircle size={12} className="mr-1" />
                              Completed
                            </Badge>
                          )}
                          {job.status === 'running' && (
                            <Badge variant="warning">
                              <Clock size={12} className="mr-1" />
                              Running
                            </Badge>
                          )}
                          {job.status === 'queued' && (
                            <Badge variant="secondary">Queued (#{job.queuePosition})</Badge>
                          )}
                          <span className="text-sm text-gray-600">
                            {job.totalLeads.toLocaleString()} leads
                          </span>
                        </div>
                      </div>
                      {job.status === 'running' && (
                        <Button variant="outline" size="sm">
                          Pause
                        </Button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {job.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Estimated completion: {job.estimatedCompletion}
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    {(job.status === 'completed' || job.status === 'running') && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-2xl font-bold text-green-600">{job.enriched}</p>
                          <p className="text-xs text-gray-600">Enriched</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-2xl font-bold text-red-600">{job.failed}</p>
                          <p className="text-xs text-gray-600">Failed</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-2xl font-bold text-blue-600">{job.successRate}%</p>
                          <p className="text-xs text-gray-600">Success Rate</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-2xl font-bold text-purple-600">
                            {job.dataPoints.length}
                          </p>
                          <p className="text-xs text-gray-600">Data Points</p>
                        </div>
                      </div>
                    )}

                    {/* Data Points */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Enrichment Fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.dataPoints.map(point => (
                          <Badge key={point} variant="outline" className="text-xs">
                            {point.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Started: {job.startedAt}</span>
                      {job.completedAt && <span>Completed: {job.completedAt}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center">
                  <Sparkles className="mx-auto mb-3 text-gray-400" size={32} />
                  <h3 className="text-lg font-semibold mb-2">Start New Enrichment Job</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a CSV or select leads from your database to enrich
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button>Upload CSV</Button>
                    <Button variant="outline">Select from Database</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Available Fields */}
          <TabsContent value="fields">
            <div className="grid gap-6">
              {enrichmentFields.map(category => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {category.fields.map(field => (
                        <div
                          key={field.name}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <field.icon size={20} className="text-blue-500" />
                            <div>
                              <p className="font-semibold text-sm">{field.name}</p>
                              <p className="text-xs text-gray-600">{field.coverage}% coverage</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {field.verified && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle size={10} className="mr-1" />
                                Verified
                              </Badge>
                            )}
                            {!field.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Info size={10} className="mr-1" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Providers */}
          <TabsContent value="providers">
            <div className="grid grid-cols-2 gap-4">
              {dataProviders.map(provider => (
                <Card key={provider.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{provider.name}</h3>
                        <Badge variant={provider.status === 'active' ? 'success' : 'secondary'}>
                          {provider.status}
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{provider.cost}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Coverage</span>
                          <span className="font-semibold">{provider.coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${provider.coverage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg Latency</span>
                        <Badge variant="outline">{provider.latency}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity */}
          <TabsContent value="recent">
            <div className="space-y-4">
              {recentEnrichments.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="success">{item.dataPoints} data points</Badge>
                        <p className="text-xs text-gray-600 mt-1">{item.enrichedAt}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold mb-3 text-red-600">Before Enrichment</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span className="text-gray-400">
                              {item.before.email || 'Not available'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-gray-400">
                              {item.before.phone || 'Not available'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            <span className="text-gray-400">
                              {item.before.title || 'Not available'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-3 text-green-600">
                          After Enrichment
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-green-500" />
                            <span className="font-medium">{item.after.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-green-500" />
                            <span className="font-medium">{item.after.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-green-500" />
                            <span className="font-medium">{item.after.title}</span>
                          </div>
                          {item.after.linkedin && (
                            <div className="flex items-center gap-2">
                              <Linkedin size={14} className="text-green-500" />
                              <span className="font-medium text-xs">{item.after.linkedin}</span>
                            </div>
                          )}
                          {item.after.companySize && (
                            <div className="flex items-center gap-2">
                              <Building2 size={14} className="text-green-500" />
                              <span className="font-medium">
                                {item.after.companySize} employees
                              </span>
                            </div>
                          )}
                          {item.after.revenue && (
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-green-500" />
                              <span className="font-medium">{item.after.revenue}</span>
                            </div>
                          )}
                          {item.after.funding && (
                            <div className="flex items-center gap-2">
                              <TrendingUp size={14} className="text-green-500" />
                              <span className="font-medium">{item.after.funding}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DataEnrichment;

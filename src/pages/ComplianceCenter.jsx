import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { useToast } from '../components/Toast';
import { Shield, CheckCircle, XCircle, AlertTriangle, Download, FileText, Clock, User, Trash2, Database } from 'lucide-react';

const ComplianceCenter = () => {
  const toast = useToast();
  const [auditFilter, setAuditFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('consent');
  const [memoryPolicy, setMemoryPolicy] = useState(null);
  const [memoryAuditLogs, setMemoryAuditLogs] = useState([]);
  const [loadingPolicy, setLoadingPolicy] = useState(false);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    if (activeTab === 'memory') {
      loadMemoryPolicy();
      loadMemoryAuditLogs();
    }
  }, [activeTab]);

  const loadMemoryPolicy = async () => {
    try {
      setLoadingPolicy(true);
      // Policy would be fetched from backend
      setMemoryPolicy({
        ttl_days: 90,
        pii_scrub_enabled: true,
        auto_purge_enabled: true,
        compliance_mode: 'standard',
      });
    } catch (error) {
      console.error('Failed to load memory policy:', error);
    } finally {
      setLoadingPolicy(false);
    }
  };

  const loadMemoryAuditLogs = async () => {
    try {
      const response = await fetch('/api/ai-advanced/memory/audit-logs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMemoryAuditLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const updateMemoryPolicy = async (updates) => {
    try {
      const response = await fetch('/api/ai-advanced/memory/policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setMemoryPolicy(data);
        toast.success('Memory policy updated successfully');
      } else {
        throw new Error('Failed to update policy');
      }
    } catch (error) {
      toast.error('Failed to update memory policy');
      console.error(error);
    }
  };

  const purgeMemories = async () => {
    if (!confirm('Are you sure you want to purge memories? This action cannot be undone.')) {
      return;
    }

    try {
      setPurging(true);
      const response = await fetch('/api/ai-advanced/memory/purge', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          reason: 'Manual compliance purge',
          category: null,
          before_date: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Purged ${data.purged_count} memories`);
        loadMemoryAuditLogs();
      } else {
        throw new Error('Failed to purge memories');
      }
    } catch (error) {
      toast.error('Failed to purge memories');
      console.error(error);
    } finally {
      setPurging(false);
    }
  };

  const consentLogs = [
    { lead: 'Sarah Chen', email: 's.chen@techcorp.com', date: '2024-01-15', type: 'Email Marketing', status: 'Active', ip: '192.168.1.1' },
    { lead: 'Michael Rodriguez', email: 'm.rodriguez@growth.com', date: '2024-01-14', type: 'Email Marketing', status: 'Active', ip: '192.168.1.2' },
    { lead: 'Emily Watson', email: 'e.watson@enterprise.com', date: '2024-01-12', type: 'Email + SMS', status: 'Active', ip: '192.168.1.3' },
  ];

  const unsubscribes = [
    { email: 'john.doe@example.com', date: '2024-01-16', reason: 'Too frequent emails', campaign: 'Q1 Outreach' },
    { email: 'jane.smith@example.com', date: '2024-01-15', reason: 'Not relevant', campaign: 'Product Launch' },
    { email: 'bob.johnson@example.com', date: '2024-01-14', reason: 'No longer interested', campaign: 'Re-engagement' },
  ];

  const auditLog = [
    { user: 'admin@artisan.com', action: 'Exported lead data', target: '1,234 leads', date: '2024-01-16 10:30', status: 'success' },
    { user: 'sales@artisan.com', action: 'Updated campaign', target: 'Q1 Campaign', date: '2024-01-16 09:15', status: 'success' },
    { user: 'admin@artisan.com', action: 'Deleted leads', target: '45 leads', date: '2024-01-15 14:20', status: 'warning' },
    { user: 'sales@artisan.com', action: 'Failed login attempt', target: 'Account locked', date: '2024-01-15 11:05', status: 'error' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'error':
        return <Badge variant="danger">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Compliance Center" subtitle="GDPR, data retention, and audit management">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="memory">Memory Governance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Consent Management Tab */}
        <TabsContent value="consent">
          <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,245</p>
                  <p className="text-sm text-gray-600">Active Consents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">37</p>
                  <p className="text-sm text-gray-600">Unsubscribes (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">Data Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-gray-600">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consent Tracking */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Consent Logs</CardTitle>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {consentLogs.map((log, i) => (
                  <div key={i} className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{log.lead}</p>
                        <p className="text-xs text-gray-600">{log.email}</p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>{log.type}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unsubscribe Management */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Unsubscribes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {unsubscribes.map((unsub, i) => (
                  <div key={i} className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-sm">{unsub.email}</p>
                      <Badge variant="secondary" size="sm">{unsub.date}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Campaign: {unsub.campaign}</p>
                    <p className="text-xs text-gray-500 italic">Reason: {unsub.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Retention Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold">Email Data</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">Retain for 2 years after last interaction</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <p className="font-semibold">Lead Data</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">Retain for 3 years or until consent withdrawn</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold">Campaign Data</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">Retain indefinitely for analysis</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Audit Log</CardTitle>
              <Select value={auditFilter} onValueChange={setAuditFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="success">Success Only</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditLog.map((log, i) => (
                <div key={i} className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{log.action}</p>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-xs text-gray-600">{log.user} • {log.target}</p>
                    </div>
                    <p className="text-xs text-gray-500">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    {/* Memory Governance Tab */}
    <TabsContent value="memory">
      <div className="space-y-6">
        {/* Memory Policy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Memory Governance Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {memoryPolicy && (
              <div className="space-y-4">
                {/* TTL Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Memory TTL (Time to Live)
                  </label>
                  <Select 
                    value={memoryPolicy.ttl_days?.toString() || 'null'}
                    onValueChange={(value) => updateMemoryPolicy({
                      ttl_days: value === 'null' ? null : parseInt(value)
                    })}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="null">No expiration</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Memories older than this will be automatically purged
                  </p>
                </div>

                {/* PII Scrubbing */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">PII Scrubbing</p>
                    <p className="text-sm text-gray-600">
                      Automatically redact sensitive information (emails, phones, SSN, credit cards)
                    </p>
                  </div>
                  <Button
                    variant={memoryPolicy.pii_scrub_enabled ? 'default' : 'outline'}
                    onClick={() => updateMemoryPolicy({
                      pii_scrub_enabled: !memoryPolicy.pii_scrub_enabled
                    })}
                  >
                    {memoryPolicy.pii_scrub_enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Auto Purge */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto Purge</p>
                    <p className="text-sm text-gray-600">
                      Automatically purge expired memories based on TTL policy
                    </p>
                  </div>
                  <Button
                    variant={memoryPolicy.auto_purge_enabled ? 'default' : 'outline'}
                    onClick={() => updateMemoryPolicy({
                      auto_purge_enabled: !memoryPolicy.auto_purge_enabled
                    })}
                  >
                    {memoryPolicy.auto_purge_enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Compliance Mode */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compliance Mode
                  </label>
                  <Select 
                    value={memoryPolicy.compliance_mode}
                    onValueChange={(value) => updateMemoryPolicy({
                      compliance_mode: value
                    })}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict (HIPAA/GDPR)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Purge */}
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-200">
              <AlertTriangle className="w-5 h-5" />
              Manual Memory Purge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              This will immediately purge all memories for this tenant. This action cannot be undone and will be logged in the audit trail.
            </p>
            <Button 
              variant="danger" 
              onClick={purgeMemories}
              disabled={purging}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {purging ? 'Purging...' : 'Purge All Memories'}
            </Button>
          </CardContent>
        </Card>

        {/* Memory Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Memory Operation Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {memoryAuditLogs.length > 0 ? (
                memoryAuditLogs.map((log) => (
                  <div key={log.id} className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{log.operation}</p>
                          {log.category && <Badge variant="secondary">{log.category}</Badge>}
                        </div>
                        <p className="text-xs text-gray-600">
                          User: {log.user_id}
                          {log.reason && ` • Reason: ${log.reason}`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No memory operations logged yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    {/* Audit Logs Tab */}
    <TabsContent value="audit">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                System Audit Log
              </CardTitle>
              <Select value={auditFilter} onValueChange={setAuditFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="success">Success Only</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditLog.map((log, i) => (
                <div key={i} className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{log.action}</p>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-xs text-gray-600">{log.user} • {log.target}</p>
                    </div>
                    <p className="text-xs text-gray-500">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</DashboardLayout>
  );
};

export default ComplianceCenter;

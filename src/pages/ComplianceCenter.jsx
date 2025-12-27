import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Shield, CheckCircle, XCircle, AlertTriangle, Download, FileText, Clock, User } from 'lucide-react';

const ComplianceCenter = () => {
  const [auditFilter, setAuditFilter] = useState('all');

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
    </DashboardLayout>
  );
};

export default ComplianceCenter;

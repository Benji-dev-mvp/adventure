import React, { useState } from 'react';
import { Clock, Filter, Download, Search, Shield, User, Settings, Key, FileText, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const AdminAuditLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const auditLogs = [
    {
      id: '1',
      timestamp: '2024-12-27 20:45:23',
      user: 'john@company.com',
      action: 'api_key.created',
      resource: 'Production API Key',
      ip: '192.168.1.1',
      severity: 'info',
      details: 'Created new API key with read/write permissions'
    },
    {
      id: '2',
      timestamp: '2024-12-27 18:32:10',
      user: 'admin@company.com',
      action: 'user.role_changed',
      resource: 'sarah@company.com',
      ip: '192.168.1.5',
      severity: 'warning',
      details: 'Changed user role from Member to Admin'
    },
    {
      id: '3',
      timestamp: '2024-12-27 15:20:45',
      user: 'john@company.com',
      action: 'campaign.deleted',
      resource: 'Old Campaign Q3',
      ip: '192.168.1.1',
      severity: 'warning',
      details: 'Permanently deleted campaign with 1,245 leads'
    },
    {
      id: '4',
      timestamp: '2024-12-27 14:15:33',
      user: 'system',
      action: 'backup.completed',
      resource: 'Daily Backup',
      ip: 'internal',
      severity: 'info',
      details: 'Automated daily backup completed successfully'
    },
    {
      id: '5',
      timestamp: '2024-12-27 10:05:18',
      user: 'sarah@company.com',
      action: 'integration.connected',
      resource: 'Salesforce CRM',
      ip: '192.168.1.3',
      severity: 'info',
      details: 'Connected Salesforce integration with OAuth 2.0'
    },
    {
      id: '6',
      timestamp: '2024-12-26 22:30:12',
      user: 'unknown',
      action: 'login.failed',
      resource: 'admin@company.com',
      ip: '45.123.67.89',
      severity: 'critical',
      details: 'Failed login attempt - invalid password (3rd attempt)'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('api_key')) return Key;
    if (action.includes('user')) return User;
    if (action.includes('campaign') || action.includes('backup')) return FileText;
    if (action.includes('integration')) return Settings;
    if (action.includes('login')) return Shield;
    return Clock;
  };

  const filteredLogs = auditLogs.filter(log => {
    if (selectedFilter !== 'all' && log.severity !== selectedFilter) return false;
    if (searchQuery && !JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const exportLogs = () => {
    // Create CSV
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Severity', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.ip,
        log.severity,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audit Log</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track all security and administrative actions in your workspace
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            {/* Export */}
            <button
              onClick={exportLogs}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {log.timestamp}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {log.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <ActionIcon className="w-4 h-4 text-gray-400" />
                          <code className="text-sm text-gray-700 dark:text-gray-300">
                            {log.action}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {log.resource}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600 dark:text-gray-400">
                          {log.ip}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Expandable Details */}
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No audit logs found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Audit Log Retention
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Audit logs are retained for 90 days. For longer retention periods or compliance requirements, export logs regularly or contact support about our Enterprise plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLog;

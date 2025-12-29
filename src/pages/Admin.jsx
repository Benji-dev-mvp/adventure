import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  UserActivityDashboard,
  PermissionMatrix,
  BillingAnalytics,
  FeatureFlags,
} from '../components/admin/AdminComponents';

function Admin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('overview');
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    fetchAuditLogs();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/health/detailed');
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs?page=1&page_size=50');
      const data = await response.json();
      setAuditLogs(data.logs || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = status => {
    const statusColors = {
      healthy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      unhealthy: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      not_configured: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };

    return (
      <Badge className={statusColors[status] || statusColors.not_configured}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="System administration and monitoring"
      action={<Button onClick={() => window.location.reload()}>Refresh Data</Button>}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="jobs">Background Jobs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">1,234</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Active Campaigns
                      </p>
                      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">87</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        API Calls Today
                      </p>
                      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">45.2K</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        System Status
                      </p>
                      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                        {systemHealth?.overall_status || 'Loading...'}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'h-12 w-12 rounded-lg flex items-center justify-center',
                        systemHealth?.overall_status === 'healthy'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-yellow-100 dark:bg-yellow-900/30'
                      )}
                    >
                      <svg
                        className={cn(
                          'w-6 h-6',
                          systemHealth?.overall_status === 'healthy'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health">
            {systemHealth && (
              <div className="space-y-6">
                {/* System Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            CPU Usage
                          </span>
                          <span
                            className={
                              isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'
                            }
                          >
                            {systemHealth.system.cpu_percent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${systemHealth.system.cpu_percent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            Memory Usage
                          </span>
                          <span
                            className={
                              isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'
                            }
                          >
                            {systemHealth.system.memory.used_percent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={cn(
                              'h-2 rounded-full transition-all',
                              systemHealth.system.memory.used_percent > 85
                                ? 'bg-red-600'
                                : 'bg-green-600'
                            )}
                            style={{ width: `${systemHealth.system.memory.used_percent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            Disk Usage
                          </span>
                          <span
                            className={
                              isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'
                            }
                          >
                            {systemHealth.system.disk.used_percent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={cn(
                              'h-2 rounded-full transition-all',
                              systemHealth.system.disk.used_percent > 85
                                ? 'bg-red-600'
                                : 'bg-green-600'
                            )}
                            style={{ width: `${systemHealth.system.disk.used_percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(systemHealth.services).map(([service, info]) => (
                        <div
                          key={service}
                          className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                        >
                          <div>
                            <p className="font-medium capitalize text-gray-900 dark:text-white">
                              {service}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {info.message}
                            </p>
                          </div>
                          {getStatusBadge(info.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="outline" onClick={fetchAuditLogs}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading audit logs...</p>
                ) : auditLogs.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No audit logs found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Timestamp
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            User
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Action
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Resource
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log, index) => (
                          <tr
                            key={index}
                            className="border-b last:border-0 border-gray-200 dark:border-gray-700"
                          >
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                              {log.user_email || 'System'}
                            </td>
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                              {log.action}
                            </td>
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                              {log.resource_type}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  log.success
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }
                              >
                                {log.success ? 'Success' : 'Failed'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button>Add New User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  User management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Background Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Job queue monitoring coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Advanced Admin Features */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">Advanced Administration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserActivityDashboard />
            <BillingAnalytics />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PermissionMatrix />
            <FeatureFlags />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Admin;

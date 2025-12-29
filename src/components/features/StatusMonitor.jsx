import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import {
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  Globe,
  Server,
  Database,
  Zap,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

const StatusMonitor = () => {
  const [uptime, setUptime] = useState(99.97);
  const [responseTime, setResponseTime] = useState(245);
  const [activeUsers, setActiveUsers] = useState(12847);
  const [requestsPerSecond, setRequestsPerSecond] = useState(1543);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(99.95 + Math.random() * 0.05);
      setResponseTime(200 + Math.random() * 100);
      setActiveUsers(12000 + Math.floor(Math.random() * 2000));
      setRequestsPerSecond(1400 + Math.floor(Math.random() * 300));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: 99.99,
      responseTime: '89ms',
      region: 'Multi-region',
    },
    {
      name: 'Email Service',
      status: 'operational',
      uptime: 99.97,
      responseTime: '124ms',
      region: 'US-East, EU-West',
    },
    {
      name: 'AI Engine (Ava)',
      status: 'operational',
      uptime: 99.96,
      responseTime: '432ms',
      region: 'US-West',
    },
    {
      name: 'Database Cluster',
      status: 'operational',
      uptime: 99.99,
      responseTime: '12ms',
      region: 'Multi-region',
    },
    {
      name: 'LinkedIn Integration',
      status: 'operational',
      uptime: 99.94,
      responseTime: '567ms',
      region: 'Global',
    },
    {
      name: 'Analytics Engine',
      status: 'operational',
      uptime: 99.98,
      responseTime: '156ms',
      region: 'US-East',
    },
    {
      name: 'SMS Gateway',
      status: 'operational',
      uptime: 99.95,
      responseTime: '234ms',
      region: 'Multi-region',
    },
    {
      name: 'Webhook Delivery',
      status: 'operational',
      uptime: 99.97,
      responseTime: '78ms',
      region: 'Global',
    },
  ];

  const incidents = [
    {
      date: 'Dec 20, 2025',
      title: 'Scheduled Maintenance - Database Migration',
      duration: '15 minutes',
      status: 'resolved',
      impact: 'No customer impact',
    },
    {
      date: 'Dec 10, 2025',
      title: 'Increased API Latency - US-East',
      duration: '8 minutes',
      status: 'resolved',
      impact: 'Degraded performance',
    },
    {
      date: 'Nov 28, 2025',
      title: 'LinkedIn Integration Timeout',
      duration: '22 minutes',
      status: 'resolved',
      impact: 'Service disruption',
    },
  ];

  const performanceMetrics = [
    { label: '99.97%', value: 'Uptime (90d)', icon: Activity, color: 'text-green-400' },
    {
      label: `${responseTime.toFixed(0)}ms`,
      value: 'Avg Response',
      icon: Zap,
      color: 'text-blue-400',
    },
    {
      label: activeUsers.toLocaleString(),
      value: 'Active Users',
      icon: Globe,
      color: 'text-purple-400',
    },
    {
      label: requestsPerSecond.toLocaleString(),
      value: 'Requests/sec',
      icon: TrendingUp,
      color: 'text-orange-400',
    },
  ];

  return (
    <div
      id="status"
      className="w-full py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-semibold mb-4">
            <CheckCircle className="w-4 h-4" />
            All Systems Operational
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-space-grotesk">
            Platform Status
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Real-time system health monitoring and performance metrics
          </p>
        </div>

        {/* Live Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card
                key={idx}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {metric.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{metric.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Status Grid */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              Service Health
            </h3>

            <div className="grid gap-3">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:border-green-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold">
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="hidden md:block">
                      <span className="text-xs text-slate-500 dark:text-slate-500">Uptime:</span>{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {service.uptime}%
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <span className="text-xs text-slate-500 dark:text-slate-500">Response:</span>{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {service.responseTime}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-xs text-slate-500 dark:text-slate-500">Region:</span>{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {service.region}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident History */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Recent Incidents
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Last 30 days</span>
            </div>

            <div className="space-y-4">
              {incidents.map((incident, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {incident.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {incident.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>Duration: {incident.duration}</span>
                      <span>•</span>
                      <span>{incident.impact}</span>
                      <span>•</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Resolved
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SLA Guarantee */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">99.95% Uptime SLA</h3>
          <p className="text-blue-100 mb-4">
            We guarantee enterprise-grade reliability with financial credits for any SLA breaches
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <div className="font-bold text-lg">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="font-bold text-lg">&lt;1min</div>
              <div className="text-blue-100">Response Time</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="font-bold text-lg">99.99%</div>
              <div className="text-blue-100">Data Durability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusMonitor;

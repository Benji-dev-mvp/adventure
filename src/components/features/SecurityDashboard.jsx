import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { 
  Shield, 
  Lock, 
  Key, 
  FileCheck, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Server,
  Database,
  UserCheck,
  Eye,
  Clock,
  Zap
} from 'lucide-react';

const SecurityDashboard = () => {
  const [activeThreats, setActiveThreats] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Simulate real-time security monitoring
    const interval = setInterval(() => {
      setScanning(prev => !prev);
      setActiveThreats(Math.floor(Math.random() * 3));
      
      // Add audit log entry
      const actions = [
        { user: 'sarah.chen@techcorp.com', action: 'Email campaign approved', severity: 'info' },
        { user: 'system', action: 'DLP scan completed - 0 violations', severity: 'success' },
        { user: 'admin@artisan.ai', action: 'New user provisioned via SCIM', severity: 'info' },
        { user: 'system', action: 'PII redaction applied to 15 messages', severity: 'warning' },
        { user: 'michael.r@growth.com', action: 'Data export requested', severity: 'info' }
      ];
      
      const newLog = actions[Math.floor(Math.random() * actions.length)];
      setAuditLogs(prev => [
        { ...newLog, timestamp: new Date().toLocaleTimeString(), id: Date.now() },
        ...prev.slice(0, 9)
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const securityMetrics = [
    {
      title: 'SOC 2 Type II',
      status: 'Compliant',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'from-green-500 to-emerald-500',
      value: '100%',
      description: 'Annual attestation current'
    },
    {
      title: 'Uptime',
      status: '99.97%',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'from-blue-500 to-cyan-500',
      value: '90d',
      description: 'Last 90 days'
    },
    {
      title: 'Active Threats',
      status: activeThreats === 0 ? 'None Detected' : `${activeThreats} Mitigated`,
      icon: AlertTriangle,
      color: activeThreats === 0 ? 'text-green-400' : 'text-orange-400',
      bgColor: activeThreats === 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-red-500',
      value: activeThreats,
      description: 'Real-time monitoring'
    },
    {
      title: 'Encryption',
      status: 'AES-256',
      icon: Lock,
      color: 'text-purple-400',
      bgColor: 'from-purple-500 to-pink-500',
      value: '100%',
      description: 'Data at rest & in transit'
    }
  ];

  const complianceChecks = [
    { name: 'GDPR Compliance', status: 'active', regions: ['EU', 'UK'] },
    { name: 'CCPA/CPRA', status: 'active', regions: ['California'] },
    { name: 'HIPAA (Healthcare)', status: 'available', regions: ['US'] },
    { name: 'ISO 27001', status: 'certified', regions: ['Global'] }
  ];

  const dataResidency = [
    { region: 'US East (N. Virginia)', status: 'active', latency: '12ms' },
    { region: 'EU West (Frankfurt)', status: 'active', latency: '8ms' },
    { region: 'US West (Oregon)', status: 'active', latency: '18ms' },
    { region: 'Asia Pacific (Singapore)', status: 'coming', latency: 'N/A' }
  ];

  return (
    <div id="security" className="w-full py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/20 blur-3xl animate-pulse-slow" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 text-green-300 text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Enterprise Security & Compliance
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            Security-First Architecture
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SOC 2 Type II certified with real-time threat monitoring, comprehensive audit trails, and enterprise-grade access controls
          </p>
        </div>

        {/* Security Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {scanning && idx === 2 && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">{metric.title}</h3>
                  <div className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.status}</div>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Real-Time Audit Log */}
          <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                  Live Audit Trail
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-400">Real-time</span>
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {auditLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      log.severity === 'success' ? 'bg-green-500' :
                      log.severity === 'warning' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm text-white font-medium truncate">{log.user}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                Identity & Access
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg glass-dark border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">SSO/SAML</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Okta, Azure AD, Google</p>
                </div>

                <div className="p-4 rounded-lg glass-dark border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">SCIM Provisioning</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Auto user management</p>
                </div>

                <div className="p-4 rounded-lg glass-dark border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">RBAC</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Granular permissions</p>
                </div>

                <div className="p-4 rounded-lg glass-dark border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">MFA Required</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">TOTP, SMS, Hardware keys</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance & Data Residency */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Compliance Matrix */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Compliance Certifications
              </h3>

              <div className="space-y-3">
                {complianceChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">{check.name}</div>
                        <div className="text-xs text-gray-400">
                          {check.regions.join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      check.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      check.status === 'certified' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Residency */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Data Residency Options
              </h3>

              <div className="space-y-3">
                {dataResidency.map((location, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Server className={`w-5 h-5 ${location.status === 'active' ? 'text-green-400' : 'text-gray-500'}`} />
                      <div>
                        <div className="text-sm font-semibold text-white">{location.region}</div>
                        <div className="text-xs text-gray-400">Latency: {location.latency}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      location.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {location.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg glass-dark border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-blue-400 mt-0.5" />
                  <p className="text-xs text-gray-300">
                    Choose where your data lives. Private region deployment available for enterprise customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features Banner */}
        <div className="mt-8 glass-dark border border-white/20 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white mb-1">Full Visibility</div>
              <div className="text-xs text-gray-400">Every action logged</div>
            </div>
            <div>
              <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white mb-1">DLP/PII Protection</div>
              <div className="text-xs text-gray-400">Auto-redaction</div>
            </div>
            <div>
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white mb-1">Retention Controls</div>
              <div className="text-xs text-gray-400">Configurable policies</div>
            </div>
            <div>
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white mb-1">Instant Alerts</div>
              <div className="text-xs text-gray-400">Slack, email, webhooks</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SecurityDashboard;

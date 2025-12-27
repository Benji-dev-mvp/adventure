import React, { useState, useEffect } from 'react';
import { 
  Shield,
  Database,
  Lock,
  Users,
  GitMerge,
  Eye,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Globe,
  AlertTriangle,
  Activity
} from 'lucide-react';

const EnterpriseFlowOrchestration = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: 0,
      title: "Security Assessment",
      subtitle: "InfoSec review & approval",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      phase: "Pre-Deployment",
      description: "Complete security questionnaire, penetration testing, SOC 2 audit review, BAA signing",
      dataPoints: [
        "Security Review: Completed",
        "Pen Test: Passed",
        "SOC 2 Report: Shared",
        "BAA: Signed"
      ],
      metrics: { duration: "2 weeks", stakeholders: "InfoSec + Legal", approval: "Granted" },
      compliance: ["SOC 2 Type II", "GDPR", "CCPA", "ISO 27001"]
    },
    {
      id: 1,
      title: "SSO & Identity Integration",
      subtitle: "Okta/Azure AD provisioning",
      icon: Lock,
      color: "from-blue-500 to-cyan-500",
      phase: "Infrastructure",
      description: "SAML 2.0 SSO configuration, SCIM user provisioning, MFA enforcement, role mapping",
      dataPoints: [
        "SSO: Okta configured",
        "SCIM: Auto-provisioning",
        "MFA: Enforced",
        "Roles: 8 levels defined"
      ],
      metrics: { users: "500", roles: "8", mfa: "100%", provisioning: "Automated" },
      compliance: ["SAML 2.0", "SCIM", "OAuth 2.0"]
    },
    {
      id: 2,
      title: "Data Residency & Privacy",
      subtitle: "Regional deployment",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      phase: "Infrastructure",
      description: "Deploy in US/EU regions per data residency requirements, configure DLP, PII scrubbing",
      dataPoints: [
        "Primary Region: US-East",
        "Secondary: EU-West",
        "DLP: Configured",
        "PII Scrubbing: Active"
      ],
      metrics: { regions: "2", latency: "< 50ms", compliance: "100%", uptime: "99.99%" },
      compliance: ["GDPR Art. 44", "EU Data Residency", "US Privacy Shield"]
    },
    {
      id: 3,
      title: "Enterprise Integration",
      subtitle: "Salesforce, HubSpot, custom CRM",
      icon: Database,
      color: "from-green-500 to-teal-500",
      phase: "Integration",
      description: "Bi-directional sync with Salesforce, custom API integrations, data warehouse connection",
      dataPoints: [
        "Salesforce: Synced",
        "Data Warehouse: Connected",
        "Custom APIs: 12 integrated",
        "Real-time sync: Active"
      ],
      metrics: { crm: "Salesforce", apis: "12", records: "2.4M", sync: "Real-time" },
      compliance: ["API Rate Limits", "Field-Level Security"]
    },
    {
      id: 4,
      title: "RBAC & Permissions",
      subtitle: "Granular access control",
      icon: Users,
      color: "from-indigo-500 to-purple-500",
      phase: "Governance",
      description: "Configure 8 role levels, territory restrictions, account-based access, audit logging",
      dataPoints: [
        "Roles: 8 levels",
        "Users: 500 assigned",
        "Territories: 15 regions",
        "Audit Log: Enabled"
      ],
      metrics: { roles: "8", users: "500", territories: "15", logging: "Full" },
      compliance: ["Least Privilege", "Separation of Duties", "Audit Trails"]
    },
    {
      id: 5,
      title: "Policy Engine Configuration",
      subtitle: "Governance & approval workflows",
      icon: FileCheck,
      color: "from-orange-500 to-red-500",
      phase: "Governance",
      description: "Set company-wide policies, approval workflows for high-value accounts, content moderation",
      dataPoints: [
        "Policies: 24 configured",
        "Approval Workflows: 3 tiers",
        "Content Review: Required",
        "Auto-block: Competitors"
      ],
      metrics: { policies: "24", workflows: "3", approvals: "2-tier", autoBlock: "Enabled" },
      compliance: ["Policy Enforcement", "Approval Gates", "Content Filtering"]
    },
    {
      id: 6,
      title: "Multi-Region Orchestration",
      subtitle: "Global team coordination",
      icon: GitMerge,
      color: "from-blue-600 to-purple-600",
      phase: "Execution",
      description: "500 users across 15 territories, coordinated campaigns, centralized analytics",
      dataPoints: [
        "Global Teams: 15",
        "Active Users: 500",
        "Daily Volume: 50,000",
        "Languages: 12"
      ],
      metrics: { teams: "15", users: "500", volume: "50K/day", languages: "12" },
      compliance: ["Timezone Optimization", "Regional Compliance"]
    },
    {
      id: 7,
      title: "Continuous Monitoring",
      subtitle: "24/7 SOC + compliance",
      icon: Eye,
      color: "from-green-600 to-emerald-600",
      phase: "Operations",
      description: "Real-time threat detection, anomaly detection, compliance monitoring, SLA tracking",
      dataPoints: [
        "Uptime: 99.99%",
        "Threats Blocked: 847",
        "SLA Compliance: 100%",
        "Incidents: 0 critical"
      ],
      metrics: { uptime: "99.99%", threats: "847", sla: "100%", incidents: "0" },
      compliance: ["24/7 SOC", "Threat Intelligence", "Incident Response"]
    },
    {
      id: 8,
      title: "Executive Analytics",
      subtitle: "Enterprise reporting",
      icon: BarChart3,
      color: "from-indigo-600 to-purple-600",
      phase: "Optimization",
      description: "Custom executive dashboards, attribution modeling, pipeline forecasting, ROI tracking",
      dataPoints: [
        "Pipeline: $47M generated",
        "ROI: 12.4x",
        "Meetings: 8,400/quarter",
        "Cost Savings: $1.2M/year"
      ],
      metrics: { pipeline: "$47M", roi: "12.4x", meetings: "8,400", savings: "$1.2M" },
      compliance: ["Data Export", "Custom Reporting", "BI Integration"]
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const currentStage = stages[activeStage];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-orange-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Enterprise Deployment Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Security-First, Compliance-Native Implementation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how Fortune 500 companies deploy with zero security risk and 100% compliance
          </p>
        </div>

        {/* Phase Timeline */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div 
                  className={`relative flex-shrink-0 w-40 transition-all duration-500 cursor-pointer ${
                    activeStage === idx ? 'scale-110 z-10' : 'scale-95 opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => { setActiveStage(idx); setIsPlaying(false); }}
                >
                  <div className={`p-4 rounded-xl border-2 transition-all ${
                    activeStage === idx 
                      ? `bg-gradient-to-br ${stage.color} border-white shadow-2xl` 
                      : 'bg-slate-800 border-slate-600'
                  }`}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activeStage === idx ? 'bg-white/20' : 'bg-slate-700'
                      }`}>
                        <stage.icon className={`w-6 h-6 ${activeStage === idx ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-bold mb-1 ${activeStage === idx ? 'text-white' : 'text-slate-400'}`}>
                          {stage.phase}
                        </div>
                        <div className={`text-xs font-semibold leading-tight ${activeStage === idx ? 'text-white' : 'text-slate-300'}`}>
                          {stage.title}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {activeStage === idx && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white animate-pulse shadow-lg" />
                  )}
                </div>
                
                {idx < stages.length - 1 && (
                  <ArrowRight className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    activeStage >= idx ? 'text-orange-400' : 'text-slate-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Active Stage Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stage Info */}
          <div className={`bg-gradient-to-br ${currentStage.color} p-8 rounded-2xl border-2 border-white/20`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <currentStage.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/80">{currentStage.phase}</div>
                  <h3 className="text-2xl font-bold text-white">{currentStage.title}</h3>
                  <p className="text-white/80">{currentStage.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            <p className="text-white text-lg mb-6">{currentStage.description}</p>

            <div className="space-y-3 mb-6">
              {currentStage.dataPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="border-t border-white/20 pt-4">
              <div className="text-sm font-semibold text-white/80 mb-3">Compliance & Standards:</div>
              <div className="flex flex-wrap gap-2">
                {currentStage.compliance.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise Metrics */}
          <div className="space-y-4">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                Stage Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(currentStage.metrics).map(([key, value], idx) => (
                  <div key={idx} className="bg-slate-900 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-1">{value}</div>
                    <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Security Posture
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SOC 2 Type II:</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Certified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Penetration Testing:</span>
                  <span className="text-green-400 font-bold">Quarterly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Encryption:</span>
                  <span className="text-green-400 font-bold">256-bit AES</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Data Residency:</span>
                  <span className="text-green-400 font-bold">US/EU</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Uptime SLA:</span>
                  <span className="text-green-400 font-bold">99.99%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Critical Incidents:</span>
                  <span className="text-green-400 font-bold">0 (12 months)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Enterprise Scale
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">500</div>
                  <div className="text-xs text-gray-400 mt-1">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">$47M</div>
                  <div className="text-xs text-gray-400 mt-1">Pipeline</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">50K</div>
                  <div className="text-xs text-gray-400 mt-1">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">15</div>
                  <div className="text-xs text-gray-400 mt-1">Regions</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Enterprise ROI</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Annual Software Savings</span>
                    <span className="text-green-400 font-bold">$1.2M</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '85%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Productivity Gain</span>
                    <span className="text-blue-400 font-bold">+420%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{width: '92%'}} />
                  </div>
                </div>
                <div className="border-t border-green-500/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">12-Month ROI:</span>
                    <span className="text-green-400 font-bold text-2xl">12.4x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Risk Mitigation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Zero data breaches (24 months)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">100% audit compliance</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">847 threats blocked automatically</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Full audit trail (7-year retention)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Stage {activeStage + 1} of {stages.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((activeStage + 1) / stages.length) * 100)}% Complete</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseFlowOrchestration;

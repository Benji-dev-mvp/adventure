import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowRight, 
  Users, 
  Target, 
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Brain,
  Sparkles,
  CheckCircle,
  Database,
  BarChart3,
  Building2,
  Phone,
  Activity,
  Lock,
  UserCheck,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import EnterpriseFlowOrchestration from '../components/solutions/EnterpriseFlowOrchestration';

const SolutionsEnterprise = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    phone: ''
  });

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security & Compliance",
      description: "SOC 2 Type II certified with SSO, SCIM, advanced RBAC, and comprehensive audit trails. Meet the strictest security requirements with data residency options in US/EU regions.",
      color: "from-red-500 to-orange-500",
      highlights: ["SOC 2 Type II", "SSO/SCIM", "Data Residency", "Advanced RBAC"]
    },
    {
      icon: Globe,
      title: "Global Scale & Performance",
      description: "Multi-region infrastructure with 99.99% uptime SLA. Access billions of B2B data points across 200+ countries with localized data centers for optimal performance.",
      color: "from-blue-500 to-cyan-500",
      highlights: ["99.99% Uptime", "Multi-Region", "200+ Countries", "Local Data Centers"]
    },
    {
      icon: Users,
      title: "Advanced Team Management",
      description: "Organize complex sales hierarchies with territory management, account-based routing, and granular permission controls. Support for unlimited users across global teams.",
      color: "from-purple-500 to-pink-500",
      highlights: ["Territory Mgmt", "ABM Routing", "Unlimited Users", "Role Hierarchy"]
    },
    {
      icon: Lock,
      title: "Governance & Policy Engine",
      description: "Implement company-wide policies with approval workflows, DLP, PII scrubbing, and content moderation. Full audit logs and compliance reporting built-in.",
      color: "from-orange-500 to-red-500",
      highlights: ["Approval Workflows", "DLP/PII", "Audit Logs", "Policy Engine"]
    },
    {
      icon: Database,
      title: "Enterprise Data Integration",
      description: "Native integrations with Salesforce, HubSpot, Microsoft Dynamics, and custom CRM systems. Real-time bi-directional sync with your entire tech stack.",
      color: "from-green-500 to-teal-500",
      highlights: ["Salesforce", "HubSpot", "Dynamics", "Custom APIs"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Reporting",
      description: "Executive dashboards with custom KPIs, attribution modeling, and predictive analytics. Export to BI tools or use our embedded analytics suite.",
      color: "from-indigo-500 to-purple-500",
      highlights: ["Custom KPIs", "Attribution", "Predictive", "BI Export"]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Massive Cost Savings",
      description: "Consolidate 8+ tools into one platform. Reduce headcount needs by 80% while scaling output. Achieve 10x ROI in first year.",
      metric: "10x ROI"
    },
    {
      icon: Shield,
      title: "Zero Security Risk",
      description: "Enterprise security that satisfies the most stringent InfoSec requirements. Regular pen testing, bug bounties, and 24/7 SOC monitoring.",
      metric: "SOC 2 Type II"
    },
    {
      icon: TrendingUp,
      title: "Unlimited Scalability",
      description: "From 100 to 10,000+ users without performance degradation. Supports millions of contacts and campaigns simultaneously.",
      metric: "99.99% Uptime"
    },
    {
      icon: Brain,
      title: "AI That Learns Your Business",
      description: "Custom AI models trained on your data, playbooks, and winning strategies. Continuously optimizes based on your unique metrics.",
      metric: "Self-Learning"
    },
    {
      icon: Users,
      title: "Dedicated Success Team",
      description: "24/7 priority support with dedicated CSM, technical account manager, and implementation specialists. SLA-backed response times.",
      metric: "24/7 Support"
    },
    {
      icon: Settings,
      title: "Customization & Control",
      description: "Custom workflows, branded templates, API access, and white-label options. Full control over every aspect of the platform.",
      metric: "Full API Access"
    }
  ];

  const securityCompliance = [
    { icon: Shield, label: "SOC 2 Type II", status: "Certified" },
    { icon: Lock, label: "GDPR Compliant", status: "Full" },
    { icon: CheckCircle, label: "CCPA Ready", status: "Verified" },
    { icon: Globe, label: "ISO 27001", status: "In Progress" },
    { icon: FileText, label: "HIPAA Available", status: "On Request" },
    { icon: Shield, label: "Pen Testing", status: "Quarterly" }
  ];

  const integrations = [
    "Salesforce", "HubSpot", "Microsoft Dynamics", "Outreach", "SalesLoft",
    "LinkedIn Sales Navigator", "ZoomInfo", "6sense", "Clearbit", "Gong",
    "Chorus", "Slack", "Microsoft Teams", "Google Workspace", "Okta", "OneLogin"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Enterprise Solution
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              Enterprise-Grade AI Sales Platform{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Built for Scale & Security
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              The only AI sales platform that meets enterprise security, compliance, and scalability requirements. Trusted by Fortune 500 companies to automate billions in pipeline.
            </p>
          </div>

          {/* Enterprise Contact Form */}
          <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Talk to Our Enterprise Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="email"
                placeholder="Work Email*"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Full Name*"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Company Name*"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="tel"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group">
              Request Enterprise Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-400 text-center mt-4">
              Get a personalized demo with custom security assessment and ROI analysis
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
            {securityCompliance.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <item.icon className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Enterprise Requirements
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything your security, compliance, and IT teams need to approve the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-all group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight, hIdx) => (
                      <span 
                        key={hIdx}
                        className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Enterprise Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Enterprise Teams Choose Artisan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The only platform that combines AI innovation with enterprise reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{benefit.metric}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Security & Compliance
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the strictest enterprise security requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {securityCompliance.map((item, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{item.label}</h4>
                        <p className="text-sm text-gray-400">{item.status}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Features List */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Enterprise Security Features</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "256-bit AES Encryption", "SSO with SAML 2.0", "SCIM User Provisioning",
                  "Advanced RBAC", "IP Whitelisting", "Audit Logs (7 years)",
                  "DLP & Content Filtering", "PII Detection & Scrubbing", "Data Residency Controls",
                  "Security Training", "Quarterly Pen Testing", "Bug Bounty Program",
                  "24/7 SOC Monitoring", "Incident Response Plan", "Business Continuity",
                  "Disaster Recovery", "Annual SOC 2 Audits", "Custom BAA Available"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Native Enterprise Integrations
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Seamless integration with your entire tech stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {integrations.map((integration, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-all">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-700 mx-auto mb-2 flex items-center justify-center">
                      <Database className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-white font-medium">{integration}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Need a custom integration?</p>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2">
              Talk to Our Integration Team
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/50">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready for an Enterprise Demo?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get a customized demo with security assessment, ROI analysis, and implementation roadmap
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2">
                  Request Custom Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2">
                  Download Security Whitepaper
                  <FileText className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>99.99% Uptime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SolutionsEnterprise;

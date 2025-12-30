import React from 'react';
import {
  Shield,
  Database,
  Lock,
  Users,
  GitMerge,
  Eye,
  FileCheck,
  BarChart3,
  Globe,
} from 'lucide-react';
import BaseFlowOrchestration from './BaseFlowOrchestration';

const EnterpriseFlowOrchestration = () => {
  const stages = [
    {
      id: 0,
      title: 'Security Assessment',
      subtitle: 'InfoSec review & approval',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      phase: 'Pre-Deployment',
      description:
        'Complete security questionnaire, penetration testing, SOC 2 audit review, BAA signing',
      dataPoints: [
        'Security Review: Completed',
        'Pen Test: Passed',
        'SOC 2 Report: Shared',
        'BAA: Signed',
      ],
      metrics: { duration: '2 weeks', stakeholders: 'InfoSec + Legal', approval: 'Granted' },
      compliance: ['SOC 2 Type II', 'GDPR', 'CCPA', 'ISO 27001'],
    },
    {
      id: 1,
      title: 'SSO & Identity Integration',
      subtitle: 'Okta/Azure AD provisioning',
      icon: Lock,
      color: 'from-blue-500 to-cyan-500',
      phase: 'Infrastructure',
      description:
        'SAML 2.0 SSO configuration, SCIM user provisioning, MFA enforcement, role mapping',
      dataPoints: [
        'SSO: Okta configured',
        'SCIM: Auto-provisioning',
        'MFA: Enforced',
        'Roles: 8 levels defined',
      ],
      metrics: { users: '500', roles: '8', mfa: '100%', provisioning: 'Automated' },
      compliance: ['SAML 2.0', 'SCIM', 'OAuth 2.0'],
    },
    {
      id: 2,
      title: 'Data Residency & Privacy',
      subtitle: 'Regional deployment',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      phase: 'Infrastructure',
      description:
        'Deploy in US/EU regions per data residency requirements, configure DLP, PII scrubbing',
      dataPoints: [
        'Primary Region: US-East',
        'Secondary: EU-West',
        'DLP: Configured',
        'PII Scrubbing: Active',
      ],
      metrics: { regions: '2', latency: '< 50ms', compliance: '100%', uptime: '99.99%' },
      compliance: ['GDPR Art. 44', 'EU Data Residency', 'US Privacy Shield'],
    },
    {
      id: 3,
      title: 'Enterprise Integration',
      subtitle: 'Salesforce, HubSpot, custom CRM',
      icon: Database,
      color: 'from-green-500 to-teal-500',
      phase: 'Integration',
      description:
        'Bi-directional sync with Salesforce, custom API integrations, data warehouse connection',
      dataPoints: [
        'Salesforce: Synced',
        'Data Warehouse: Connected',
        'Custom APIs: 12 integrated',
        'Real-time sync: Active',
      ],
      metrics: { crm: 'Salesforce', apis: '12', records: '2.4M', sync: 'Real-time' },
      compliance: ['API Rate Limits', 'Field-Level Security'],
    },
    {
      id: 4,
      title: 'RBAC & Permissions',
      subtitle: 'Granular access control',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      phase: 'Governance',
      description:
        'Configure 8 role levels, territory restrictions, account-based access, audit logging',
      dataPoints: [
        'Roles: 8 levels',
        'Users: 500 assigned',
        'Territories: 15 regions',
        'Audit Log: Enabled',
      ],
      metrics: { roles: '8', users: '500', territories: '15', logging: 'Full' },
      compliance: ['Least Privilege', 'Separation of Duties', 'Audit Trails'],
    },
    {
      id: 5,
      title: 'Policy Engine Configuration',
      subtitle: 'Governance & approval workflows',
      icon: FileCheck,
      color: 'from-orange-500 to-red-500',
      phase: 'Governance',
      description:
        'Set company-wide policies, approval workflows for high-value accounts, content moderation',
      dataPoints: [
        'Policies: 24 configured',
        'Approval Workflows: 3 tiers',
        'Content Review: Required',
        'Auto-block: Competitors',
      ],
      metrics: { policies: '24', workflows: '3', approvals: '2-tier', autoBlock: 'Enabled' },
      compliance: ['Policy Enforcement', 'Approval Gates', 'Content Filtering'],
    },
    {
      id: 6,
      title: 'Multi-Region Orchestration',
      subtitle: 'Global team coordination',
      icon: GitMerge,
      color: 'from-blue-600 to-purple-600',
      phase: 'Execution',
      description: '500 users across 15 territories, coordinated campaigns, centralized analytics',
      dataPoints: [
        'Global Teams: 15',
        'Active Users: 500',
        'Daily Volume: 50,000',
        'Languages: 12',
      ],
      metrics: { teams: '15', users: '500', volume: '50K/day', languages: '12' },
      compliance: ['Timezone Optimization', 'Regional Compliance'],
    },
    {
      id: 7,
      title: 'Continuous Monitoring',
      subtitle: '24/7 SOC + compliance',
      icon: Eye,
      color: 'from-green-600 to-emerald-600',
      phase: 'Operations',
      description:
        'Real-time threat detection, anomaly detection, compliance monitoring, SLA tracking',
      dataPoints: [
        'Uptime: 99.99%',
        'Threats Blocked: 847',
        'SLA Compliance: 100%',
        'Incidents: 0 critical',
      ],
      metrics: { uptime: '99.99%', threats: '847', sla: '100%', incidents: '0' },
      compliance: ['24/7 SOC', 'Threat Intelligence', 'Incident Response'],
    },
    {
      id: 8,
      title: 'Executive Analytics',
      subtitle: 'Enterprise reporting',
      icon: BarChart3,
      color: 'from-indigo-600 to-purple-600',
      phase: 'Optimization',
      description:
        'Custom executive dashboards, attribution modeling, pipeline forecasting, ROI tracking',
      dataPoints: [
        'Pipeline: $47M generated',
        'ROI: 12.4x',
        'Meetings: 8,400/quarter',
        'Cost Savings: $1.2M/year',
      ],
      metrics: { pipeline: '$47M', roi: '12.4x', meetings: '8,400', savings: '$1.2M' },
      compliance: ['Data Export', 'Custom Reporting', 'BI Integration'],
    },
  ];

  return <BaseFlowOrchestration stages={stages} autoPlayInterval={4000} />;
};

export default EnterpriseFlowOrchestration;


import { PageScaffoldConfig } from '@/components/layout/OperatorShell';

export type PageChromeMode = 'shell' | 'plain';

interface PageChromeRule {
  paths: string[];
  config: PageScaffoldConfig;
  mode?: PageChromeMode;
}

const rules: PageChromeRule[] = [
  {
    paths: ['/home', '/'],
    config: {
      title: 'Overview',
      subtitle: 'Unified workspace home',
      badges: [{ label: 'Live', color: 'green' }],
    },
  },
  {
    paths: ['/dashboard'],
    config: {
      title: 'Dashboard',
      subtitle: 'Executive signal and KPI pulse',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/orchestration', '/orchestrator'],
    config: {
      title: 'AI Operator',
      subtitle: 'Multi-agent orchestration and control',
      badges: [{ label: 'Autonomous GTM', color: 'blue' }],
    },
  },
  {
    paths: ['/autonomy'],
    config: {
      title: 'Autonomy Dashboard',
      subtitle: 'Autonomous GTM operating layer',
      badges: [{ label: 'Beta', color: 'purple' }],
    },
  },
  {
    paths: ['/autopilot'],
    config: {
      title: 'Autopilot',
      subtitle: 'Self-driving revenue engine',
      badges: [
        { label: 'AI', color: 'cyan' },
        { label: 'Pro', color: 'blue' },
      ],
    },
  },
  {
    paths: ['/lead-hive'],
    config: {
      title: 'Lead Hive',
      subtitle: 'Autonomous prospect research hive',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/parliament'],
    config: {
      title: 'AI Parliament',
      subtitle: 'Debate-driven decisioning layer',
      badges: [{ label: 'AI', color: 'purple' }],
    },
  },
  {
    paths: ['/avatar'],
    config: {
      title: 'AI Avatar',
      subtitle: 'Persona-grade conversation control',
      badges: [{ label: 'Immersive', color: 'blue' }],
    },
  },
  {
    paths: ['/immersive'],
    config: {
      title: 'Immersive View',
      subtitle: 'Spatial command center',
      badges: [{ label: 'New', color: 'green' }],
    },
  },
  {
    paths: ['/forecasting', '/revenue-forecasting'],
    config: {
      title: 'Forecasting',
      subtitle: 'Predictive revenue forecasting',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/intelligence-graph', '/intelligence-grid'],
    config: {
      title: 'Intelligence Graph',
      subtitle: 'Signals, intent, and influence graph',
      badges: [{ label: 'Graph', color: 'purple' }],
    },
  },
  {
    paths: ['/influence-map'],
    config: {
      title: 'Influence Map',
      subtitle: 'Account power-map and paths to value',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  {
    paths: ['/boardroom'],
    config: {
      title: 'Boardroom',
      subtitle: 'Executive view for autonomous GTM',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  {
    paths: ['/simulate', '/simulate-next'],
    config: {
      title: 'Simulate',
      subtitle: 'Scenario simulation and sandboxes',
      badges: [{ label: 'Beta', color: 'purple' }],
    },
  },
  {
    paths: ['/ai-assistant', '/ai-assistant-advanced'],
    config: {
      title: 'AI Assistant',
      subtitle: 'Operator copilot and actions',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/ava'],
    config: {
      title: 'Ava AI BDR',
      subtitle: 'Autonomous BDR control surface',
      badges: [{ label: 'Pro', color: 'blue' }],
    },
  },
  {
    paths: ['/exceptional'],
    config: {
      title: 'Exceptional Hub',
      subtitle: 'Exceptional experiences command center',
      badges: [{ label: 'Pro', color: 'blue' }],
    },
  },
  {
    paths: ['/advanced'],
    config: {
      title: 'Advanced Hub',
      subtitle: 'Advanced capabilities and labs',
      badges: [{ label: 'New', color: 'green' }],
    },
  },
  {
    paths: ['/analytics'],
    config: {
      title: 'Analytics',
      subtitle: 'Full-funnel performance analytics',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/executive-dashboard'],
    config: {
      title: 'Executive Dashboard',
      subtitle: 'Executive health and readiness',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  {
    paths: ['/activity-feed'],
    config: {
      title: 'Activity Feed',
      subtitle: 'System and AI activity stream',
      badges: [{ label: 'Live', color: 'green' }],
    },
  },
  {
    paths: ['/campaigns'],
    config: {
      title: 'Campaigns',
      subtitle: 'Campaign builder and orchestration',
      badges: [{ label: 'Ops', color: 'blue' }],
    },
  },
  {
    paths: ['/leads'],
    config: {
      title: 'Leads',
      subtitle: 'Lead workbench and queues',
      badges: [{ label: 'Ops', color: 'blue' }],
    },
  },
  {
    paths: ['/lead-database', '/advanced-lead-database'],
    config: {
      title: 'Lead Database',
      subtitle: 'Unified lead intelligence',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/templates', '/email-templates'],
    config: {
      title: 'Templates',
      subtitle: 'Reusable assets and playbooks',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/sales-playbooks'],
    config: {
      title: 'Sales Playbooks',
      subtitle: 'Operational playbooks and runbooks',
      badges: [{ label: 'Pro', color: 'blue' }],
    },
  },
  {
    paths: ['/lead-scoring'],
    config: {
      title: 'Lead Scoring',
      subtitle: 'AI-scored intent and fit',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/data-enrichment', '/data-enrichment'],
    config: {
      title: 'Data Enrichment',
      subtitle: 'Signals, firmographics, and enrichment',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  {
    paths: ['/workflow-orchestrator'],
    config: {
      title: 'Ops & Control',
      subtitle: 'Workflow orchestration and guardrails',
      badges: [{ label: 'Control', color: 'purple' }],
    },
  },
  {
    paths: ['/integrations'],
    config: {
      title: 'Integrations',
      subtitle: 'Connected systems and sync status',
      badges: [{ label: 'Live', color: 'green' }],
    },
  },
  {
    paths: ['/settings'],
    config: {
      title: 'Settings',
      subtitle: 'Workspace configuration',
      badges: [{ label: 'Admin', color: 'purple' }],
    },
  },
  {
    paths: ['/settings/usage'],
    config: {
      title: 'Usage & Quotas',
      subtitle: 'Consumption by seats, agents, and tokens',
      badges: [{ label: 'Usage', color: 'orange' }],
    },
  },
  {
    paths: ['/admin'],
    config: {
      title: 'Enterprise Admin',
      subtitle: 'Access, audit, and controls',
      badges: [{ label: 'Enterprise', color: 'amber' }],
    },
  },
];

const defaultConfig: PageScaffoldConfig = {
  title: 'Workspace',
  subtitle: 'Unified operator console',
};

export function resolvePageChrome(pathname: string, fallbackTitle?: string) {
  const rule = rules.find(r => r.paths.some(p => pathname.startsWith(p)));
  const title = rule?.config.title || fallbackTitle || defaultConfig.title;
  const scaffold: PageScaffoldConfig = {
    ...defaultConfig,
    ...rule?.config,
    title,
  };

  return {
    scaffold,
    mode: rule?.mode || 'shell',
  } as const;
}

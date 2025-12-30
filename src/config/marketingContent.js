/**
 * Marketing Content Configuration
 * All copy, metrics, features, and testimonials for the marketing experience
 */

// Utility function to create feature objects
const createFeature = (icon, title, preview, description, capabilities, benefit) => ({
  id: title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  icon,
  title,
  preview,
  expanded: { description, capabilities, benefit },
});

export const marketingContent = {
  hero: {
    badge: 'AI-First Outbound OS',
    headline: 'Your AI-powered sales automation platform',
    subhead:
      'Transform your B2B outbound with intelligent multi-channel campaigns that scale. From prospecting to close, Artisan orchestrates every touchpoint.',
    cta: {
      primary: 'Start Free Trial',
      secondary: 'Book a Demo',
    },
    metrics: [
      { value: '10x', label: 'Response Rate' },
      { value: '3.5hr', label: 'Saved Per Rep/Day' },
      { value: '89%', label: 'Lead Quality Score' },
    ],
  },

  beforeAfter: {
    title: 'The old way vs. The Artisan way',
    subtitle: 'Stop cobbling together tools. Start orchestrating results.',
    before: {
      label: 'Before Artisan',
      pain: 'Fragmented Tools',
      points: [
        '5+ separate platforms to manage',
        'Manual data entry and list building',
        'Inconsistent messaging across channels',
        "No visibility into what's working",
        'Reps spending 60% of time on admin',
      ],
      metrics: [
        { label: 'Lead Response Time', value: '48 hours', negative: true },
        { label: 'Manual Tasks/Day', value: '120+', negative: true },
        { label: 'Tools in Stack', value: '8-12', negative: true },
      ],
    },
    after: {
      label: 'After Artisan',
      benefit: 'Unified Intelligence',
      points: [
        'One AI-powered operating system',
        'Automated enrichment and scoring',
        'Orchestrated multi-channel sequences',
        'Real-time insights and optimization',
        'Reps focused on selling, not clicking',
      ],
      metrics: [
        { label: 'Lead Response Time', value: '< 5 min', positive: true },
        { label: 'Manual Tasks/Day', value: '< 10', positive: true },
        { label: 'Tools in Stack', value: '1', positive: true },
      ],
    },
  },

  howItWorks: {
    title: 'How it works',
    subtitle: 'Built for revenue teams who demand results, not complexity',
    steps: [
      {
        id: 1,
        title: 'Define Your ICP',
        description:
          'Import, enrich, and score leads with AI-powered data intelligence. Our system automatically identifies your best-fit accounts.',
        visual: 'lead-database',
        features: ['Auto-enrichment', 'AI scoring', 'Custom filters', 'Real-time updates'],
      },
      {
        id: 2,
        title: 'Build Smart Sequences',
        description:
          'Design multi-channel campaigns that adapt to prospect behavior. Email, LinkedIn, calls, and SMS—orchestrated in perfect rhythm.',
        visual: 'campaign-builder',
        features: ['Multi-channel', 'A/B testing', 'Smart delays', 'Behavioral triggers'],
      },
      {
        id: 3,
        title: 'Let AI Execute',
        description:
          'Ava, your AI assistant, handles outreach with personalization at scale. Every message feels 1:1, but reaches thousands.',
        visual: 'ai-assistant',
        features: ['AI personalization', 'Tone control', 'Compliance checks', 'Auto-follow-ups'],
      },
      {
        id: 4,
        title: 'Monitor & Optimize',
        description:
          "Real-time analytics surface what's working. AI recommendations guide your next move. Continuous improvement, zero guesswork.",
        visual: 'analytics',
        features: ['Live dashboards', 'AI insights', 'Predictive models', 'ROI tracking'],
      },
      {
        id: 5,
        title: 'Close More Deals',
        description:
          'Focus on high-intent prospects while Artisan nurtures the rest. Your pipeline stays full, your calendar stays focused.',
        visual: 'dashboard',
        features: ['Intent signals', 'Smart routing', 'Meeting booking', 'CRM sync'],
      },
    ],
  },

  features: {
    title: 'Everything you need to dominate outbound',
    subtitle: 'Enterprise-grade capabilities, startup-friendly interface',
    grid: [
      createFeature(
        'MessageSquare',
        'Multi-Channel Orchestration',
        'Coordinate email, LinkedIn, calls, and SMS in perfect sequence',
        'Build campaigns that reach prospects where they are. Smart delays and behavior-based triggers ensure every touchpoint lands at the right moment.',
        ['Email sequences', 'LinkedIn automation', 'SMS cadences', 'Call scripts & tracking'],
        '3.5x higher response rates than single-channel outreach'
      ),
      createFeature(
        'Sparkles',
        'AI-Powered Assistant (Ava)',
        'Your 24/7 AI teammate that writes, sends, and optimizes every message',
        'Ava learns your voice, understands your ICP, and crafts personalized messages at scale. Professional, casual, or enthusiastic—she adapts to your brand.',
        ['Message generation', 'Personalization', 'Tone control', 'Auto-optimization'],
        'Save 15+ hours per week on copywriting and manual outreach'
      ),
      createFeature(
        'Database',
        'Automatic Lead Enrichment',
        'Every contact arrives complete with company data, intent signals, and fit scores',
        'No more hunting for emails or checking LinkedIn profiles. Our enrichment engine fills in missing data, validates contacts, and scores every lead.',
        ['Email finding', 'Company intelligence', 'Technology stack', 'Funding & signals'],
        '95%+ contact accuracy, zero manual data entry'
      ),
      createFeature(
        'LineChart',
        'Real-Time Analytics',
        "Surface insights, not just data. Know what's working and why.",
        'Dashboards that tell stories. Track opens, clicks, replies, and conversions across every channel. AI-powered recommendations guide optimization.',
        ['Campaign performance', 'A/B test results', 'Conversion funnels', 'Predictive insights'],
        'Make decisions in minutes, not days'
      ),
      createFeature(
        'ShieldCheck',
        'Enterprise Compliance',
        'SOC 2, GDPR, and approval workflows built in. Sleep well at night.',
        'Policy-driven sending with human-in-the-loop safeguards. DLP, PII scrubbing, and audit logs for every action. Governance without friction.',
        ['Approval workflows', 'DLP & PII detection', 'Audit trails', 'Role-based access'],
        'Enterprise-ready security with zero configuration'
      ),
      createFeature(
        'Plug',
        'Native Integrations',
        'Connect your CRM, calendar, and tools in seconds. Data flows automatically.',
        'Two-way sync with Salesforce, HubSpot, Outlook, and more. Leads, activities, and outcomes update in real-time across your stack.',
        ['CRM sync', 'Calendar booking', 'Slack alerts', 'Webhook API'],
        'One source of truth, zero manual data entry'
      ),
    ],
  },

  aiAgent: {
    title: 'Meet Ava',
    subtitle:
      'Your AI sales assistant that never sleeps, never misses a follow-up, and gets better every day',
    persona: {
      name: 'Ava',
      role: 'AI Sales Development Rep',
      avatar: '/assets/ava-avatar.png',
      quote: 'I handle the repetition. You handle the relationships.',
    },
    capabilities: [
      {
        title: 'Writes Like Your Best Rep',
        description:
          'Ava analyzes your top-performing messages and adapts her style to match. Every email feels personal, never robotic.',
        metric: '92% approval rate from human reviewers',
      },
      {
        title: 'Learns From Every Interaction',
        description:
          'Ava tracks which subject lines, CTAs, and personalizations drive replies. She continuously optimizes your campaigns.',
        metric: '18% average lift in response rates over 30 days',
      },
      {
        title: 'Handles Multi-Channel Coordination',
        description:
          "Email didn't get a reply? Ava follows up on LinkedIn. Still no response? She schedules a call attempt. All automatically.",
        metric: '3.5x more touchpoints without adding headcount',
      },
      {
        title: 'Respects Boundaries',
        description:
          'Ava never sends on weekends (unless you tell her to), pauses campaigns when prospects reply, and adheres to unsubscribe requests instantly.',
        metric: '< 0.1% spam complaint rate',
      },
    ],
    interactive: {
      title: 'See Ava in action',
      prompt:
        "Write a follow-up email for a SaaS founder who viewed our pricing page but didn't book a demo",
      response: `Subject: Quick question about your pricing page visit

Hi {{firstName}},

I noticed you checked out our pricing page yesterday. I'm guessing you're evaluating a few options (we've all been there).

Mind if I ask what stood out—or what questions you still have?

I'm happy to hop on a quick call to walk through how we'd fit your specific use case. Or if you prefer, I can send over a custom pricing breakdown based on your team size.

Let me know what works better for you.

Best,
{{senderName}}`,
    },
  },

  testimonials: {
    title: 'What our customers say',
    subtitle: 'Thousands of revenue teams trust Artisan to power their outbound',
    quotes: [
      {
        id: 1,
        quote:
          "Artisan turned our outbound from a necessary evil into our #1 revenue channel. We're booking 3x more meetings with the same team size.",
        author: 'Sarah Chen',
        role: 'VP Sales',
        company: 'Vertex AI',
        logo: '/assets/logos/vertex.svg',
        metrics: { meetings: '+215%', pipeline: '$2.4M' },
      },
      {
        id: 2,
        quote:
          'The AI assistant actually writes better emails than most of our reps. And it never takes a vacation.',
        author: 'Marcus Rodriguez',
        role: 'Head of Growth',
        company: 'DataFlow',
        logo: '/assets/logos/dataflow.svg',
        metrics: { responseRate: '12.3%', hours: '18hr/week saved' },
      },
      {
        id: 3,
        quote:
          'We replaced 4 tools with Artisan and increased our pipeline by 40%. The ROI was obvious in month one.',
        author: 'Emily Park',
        role: 'CRO',
        company: 'CloudScale',
        logo: '/assets/logos/cloudscale.svg',
        metrics: { toolsReplaced: '4', roi: '340%' },
      },
      {
        id: 4,
        quote:
          'Finally, a platform that understands enterprise compliance. SOC 2, approval workflows, and DLP out of the box.',
        author: 'David Thompson',
        role: 'Director of Sales Ops',
        company: 'SecureBank',
        logo: '/assets/logos/securebank.svg',
        metrics: { complianceScore: '100%', deployTime: '< 2 weeks' },
      },
    ],
    caseStudies: [
      {
        company: 'TechCorp',
        industry: 'SaaS',
        size: 'Series B',
        challenge: 'Stagnant pipeline despite growing sales team',
        solution: 'Implemented multi-channel sequences with AI personalization',
        results: [
          { metric: 'Response Rate', before: '2.1%', after: '8.7%' },
          { metric: 'Meetings Booked', before: '12/month', after: '48/month' },
          { metric: 'Pipeline Added', before: '$180K/mo', after: '$720K/mo' },
        ],
      },
      {
        company: 'GrowthLabs',
        industry: 'Marketing Agency',
        size: 'Mid-Market',
        challenge: 'Manual prospecting consuming 60% of rep time',
        solution: 'Deployed Ava for automated outreach and enrichment',
        results: [
          { metric: 'Manual Hours', before: '24hr/week', after: '6hr/week' },
          { metric: 'Outreach Volume', before: '50/week', after: '400/week' },
          { metric: 'Cost Per Lead', before: '$180', after: '$45' },
        ],
      },
    ],
  },

  logos: {
    title: 'Trusted by leading revenue teams',
    companies: [
      { name: 'Salesforce', logo: '/assets/logos/salesforce.svg' },
      { name: 'HubSpot', logo: '/assets/logos/hubspot.svg' },
      { name: 'Stripe', logo: '/assets/logos/stripe.svg' },
      { name: 'Atlassian', logo: '/assets/logos/atlassian.svg' },
      { name: 'Twilio', logo: '/assets/logos/twilio.svg' },
      { name: 'Slack', logo: '/assets/logos/slack.svg' },
      { name: 'Zoom', logo: '/assets/logos/zoom.svg' },
      { name: 'Notion', logo: '/assets/logos/notion.svg' },
    ],
  },

  finalCTA: {
    badge: 'Start Today',
    headline: 'Ready to transform your outbound?',
    subhead:
      "Join thousands of revenue teams who've replaced complexity with results. Free 14-day trial. No credit card required.",
    cta: {
      primary: 'Start Free Trial',
      secondary: 'Talk to Sales',
    },
    features: [
      'Free 14-day trial',
      'No credit card required',
      'Full platform access',
      'White-glove onboarding',
    ],
    trust: {
      security: ['SOC 2 Type II', 'GDPR Compliant', 'SSO/SCIM Ready'],
      support: ['24/7 Support', 'Dedicated CSM', 'Slack Connect'],
    },
  },
};

export default marketingContent;

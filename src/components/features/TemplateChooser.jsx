import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Target,
  ShieldCheck,
  Sparkles,
  Workflow,
  BarChart3,
  Building2,
  Users,
  Orbit,
  GitBranch,
  Gauge,
  Cable,
  Landmark,
  Sparkle
} from 'lucide-react';

const templates = [
  {
    id: 'meddic-enterprise-saas',
    name: 'MEDDIC Enterprise SaaS',
    methodology: 'MEDDIC',
    icp: 'Enterprise',
    industries: ['SaaS', 'Security'],
    persona: 'CRO, CFO, RevOps, champion',
    dealSize: 'ACV $150k+',
    motion: 'Email + LinkedIn + exec sponsor intros',
    strengths: 'Metric-backed validation, multi-threading, champion enablement',
    aiActions: [
      'Auto-draft exec summary for economic buyer with quantified ROI',
      'Generate champion enablement kit with objection handling',
      'Sequence stakeholders with policy-compliant sends and approvals'
    ],
    activationSignals: ['Active RFP or consolidation initiative', 'New CISO or CFO within 90 days', 'Low NPS for current tooling'],
    proofAssets: ['ROI one-pager', 'Security appendix', 'Exec sponsor note'],
    risks: ['No economic buyer access', 'Champion lacks budget influence'],
    plays: [
      'Discovery led with metrics, decision criteria, and pain quantification',
      'Economic buyer alignment with ROI one-pager and security appendix',
      'Mutual action plan with procurement and legal milestones'
    ],
    icon: Target,
    color: 'bg-purple-600'
  },
  {
    id: 'challenger-industrial',
    name: 'Challenger Industrial GTM',
    methodology: 'Challenger',
    icp: 'Mid-Market',
    industries: ['Manufacturing', 'Industrial', 'Logistics'],
    persona: 'Ops, plant managers, supply chain leaders',
    dealSize: 'ACV $60k-$120k',
    motion: 'Email + phone + field rep handoff',
    strengths: 'Teach-tailor-take control with provocative insights',
    aiActions: [
      'Draft commercial teaching deck with plant-specific benchmarks',
      'Generate phone talk-track highlighting downtime cost deltas',
      'Create follow-up recap with tailored cost savings'
    ],
    activationSignals: ['Production downtime trend > 3% MoM', 'Excessive scrap rate vs peers', 'Upcoming plant modernization'],
    proofAssets: ['Benchmark pack by sub-vertical', 'Downtime cost calculator', 'Reference story on throughput'],
    risks: ['Single-threaded with plant manager', 'Procurement-led before value established'],
    plays: [
      'Commercial teaching sequence that reframes hidden costs in downtime',
      'Segment-specific benchmarks for OEE, scrap, and throughput',
      'Objection handling paths for legacy vendor lock-in'
    ],
    icon: ShieldCheck,
    color: 'bg-emerald-600'
  },
  {
    id: 'spiced-plg-expansion',
    name: 'SPICED PLG Expansion',
    methodology: 'SPICED',
    icp: 'Mid-Market',
    industries: ['SaaS', 'Product-led'],
    persona: 'Product, growth, success, data',
    dealSize: 'Usage -> $25k-$80k uplift',
    motion: 'In-app + email + success-led workshops',
    strengths: 'Signals-driven prompts, in-app triggers, frictionless upsell',
    aiActions: [
      'Trigger in-app nudge to power users with tailored next feature',
      'Draft exec outcome recap from telemetry for QBR',
      'Auto-build upsell sequence segmented by usage cohorts'
    ],
    activationSignals: ['Power users >3 logins/week', 'Feature flags requested', 'Team invites > 5 per week'],
    proofAssets: ['Value recap from telemetry', 'Product roadmap alignment note', 'Usage-to-outcome dashboard'],
    risks: ['Success not aligned on outcome', 'No exec sponsor beyond champion'],
    plays: [
      'User cohort scoring (success potential, pain, impact) to target upsell',
      'Personalized activation cadences for power users and exec sponsors',
      'Value review deck auto-built from product telemetry'
    ],
    icon: Sparkles,
    color: 'bg-pink-600'
  },
  {
    id: 'sandler-finserv',
    name: 'Sandler Financial Services',
    methodology: 'Sandler',
    icp: 'Enterprise',
    industries: ['Financial Services', 'Banking', 'Insurance'],
    persona: 'Risk, compliance, IT, line-of-business',
    dealSize: 'ACV $200k+',
    motion: 'Email + analyst reports + steering committee',
    strengths: 'Up-front contract, budget clarity, next-step control',
    aiActions: [
      'Draft upfront contract email including compliance milestones',
      'Generate regulator mapping appendix tailored to buyer stack',
      'Build mutual action plan with owners and dates'
    ],
    activationSignals: ['Audit findings within 6 months', 'Regulator pressure or remediation plan', 'Core stack refresh'],
    proofAssets: ['Control mapping to regulators', 'Procurement-ready pack', 'Mutual action plan with signatories'],
    risks: ['Late entry after RFP freeze', 'InfoSec redlines not preempted'],
    plays: [
      'Mutual agenda with compliance checkpoints and RFP readiness',
      'Risk-reduction narrative with regulator mappings',
      'Success criteria agreed before proof of concept'
    ],
    icon: Workflow,
    color: 'bg-blue-700'
  },
  {
    id: 'consultative-healthcare',
    name: 'Consultative Healthcare',
    methodology: 'Consultative',
    icp: 'Enterprise',
    industries: ['Healthcare', 'Life Sciences'],
    persona: 'Clinical ops, IT, procurement, compliance',
    dealSize: 'ACV $120k-$300k',
    motion: 'Email + virtual workshops + reference loops',
    strengths: 'Outcome mapping, clinical governance, privacy-by-design',
    aiActions: [
      'Create clinical value pathway with throughput projections',
      'Draft HIPAA/GDPR stewardship note with data flows',
      'Generate reference request email matching EMR profile'
    ],
    activationSignals: ['EMR upgrade planned', 'Patient throughput KPI miss', 'Clinical trial expansion'],
    proofAssets: ['HIPAA/GDPR appendix', 'Clinical throughput model', 'Peer reference pack'],
    risks: ['No privacy officer alignment', 'Physician champions missing'],
    plays: [
      'Value pathway built around patient throughput and quality metrics',
      'Data stewardship appendix aligned to HIPAA/GDPR',
      'Reference pairing with similar bed size and EMR stack'
    ],
    icon: BarChart3,
    color: 'bg-cyan-600'
  },
  {
    id: 'value-selling-cyber',
    name: 'Value Selling Cybersecurity',
    methodology: 'Value Selling',
    icp: 'Enterprise',
    industries: ['Cybersecurity', 'Infrastructure'],
    persona: 'CISO, SecOps, architecture',
    dealSize: 'ACV $150k-$400k',
    motion: 'Email + security council + exec brief',
    strengths: 'Risk quantification, control coverage, compliance evidence',
    aiActions: [
      'Draft board-ready cyber risk brief with quantified exposure',
      'Generate control coverage map vs NIST with gaps highlighted',
      'Author security council agenda and follow-up actions'
    ],
    activationSignals: ['Pen test findings open', 'Board asks for cyber posture', 'Tool sprawl after M&A'],
    proofAssets: ['Attack surface assessment', 'Control coverage map', 'Board-ready heatmap'],
    risks: ['Security council not engaged', 'Budget tied to another program'],
    plays: [
      'Attack surface assessment summary with quantified exposure',
      'Control mapping to NIST/ISO/SOC2 with gaps and owners',
      'Board-ready risk reduction one-pager'
    ],
    icon: Building2,
    color: 'bg-slate-700'
  },
  {
    id: 'abm-strategic-accounts',
    name: 'ABM Strategic Accounts',
    methodology: 'ABM',
    icp: 'Strategic',
    industries: ['SaaS', 'Cloud', 'Telco'],
    persona: 'Buying committee and partners',
    dealSize: 'ACV $500k+',
    motion: '1:1 microsite + exec alignment + partner co-sell',
    strengths: 'Account plans, pod orchestration, partner influence',
    aiActions: [
      'Generate 1:1 microsite copy and value hypotheses',
      'Draft exec alignment email with clear asks and timeline',
      'Create partner co-brand brief and outreach sequence'
    ],
    activationSignals: ['Strategic account list named', 'C-level initiative announced', 'Renewal + expansion cycle'],
    proofAssets: ['1:1 microsite', 'Value hypothesis brief', 'Partner co-brand deck'],
    risks: ['No exec cover', 'Pod lacks marketing/partner resourcing'],
    plays: [
      'Account research pack with initiatives, org map, and budget moments',
      '1:1 digital room with live timeline and value hypotheses',
      'Partner-assisted motion with co-brand collateral'
    ],
    icon: Users,
    color: 'bg-amber-600'
  },
  {
    id: 'partner-cosell',
    name: 'Partner Co-sell Play',
    methodology: 'Co-Sell',
    icp: 'Enterprise',
    industries: ['Cloud', 'ISV', 'Marketplace'],
    persona: 'Alliances, sales, solution architects',
    dealSize: 'ACV $150k-$350k',
    motion: 'Co-sell registration + joint outreach + marketplace listing',
    strengths: 'Shared pipeline hygiene, MDF utilization, joint proof points',
    aiActions: [
      'Draft joint value prop email set referencing mutual customers',
      'Build co-sell brief with sourced vs influenced SLAs',
      'Generate marketplace private offer summary and next steps'
    ],
    activationSignals: ['Co-sell registration submitted', 'Marketplace private offer eligible', 'Mutual customer overlap > 15%'],
    proofAssets: ['Joint value prop email kit', 'Co-sell brief with SLAs', 'Marketplace offer template'],
    risks: ['Channel conflict unresolved', 'No clear sourced vs influenced rules'],
    plays: [
      'Sourced vs influenced routing with clear SLAs',
      'Joint value prop emails referencing mutual customers',
      'Marketplace private offer with success plan and QBR cadence'
    ],
    icon: Orbit,
    color: 'bg-indigo-600'
  },
  {
    id: 'partner-led-systems-integrator',
    name: 'Systems Integrator Lead',
    methodology: 'Consultative + ABM',
    icp: 'Enterprise',
    industries: ['Systems Integrator', 'Advisory'],
    persona: 'Practice leads, delivery, procurement',
    dealSize: 'ACV $250k-$600k',
    motion: 'Joint pursuit with SI plus exec steering',
    strengths: 'Program governance, delivery confidence, joint backlog',
    aiActions: [
      'Draft program charter with governance cadence',
      'Create joint delivery plan with milestones and owners',
      'Generate exec steering brief aligned to SI practice KPIs'
    ],
    activationSignals: ['SI-led transformation initiative', 'New practice launch', 'Backlog of change requests'],
    proofAssets: ['Program charter', 'Joint delivery plan', 'Exec steering cadence'],
    risks: ['SI revenue targets misaligned', 'Governance owners unclear'],
    plays: [
      'Value hypothesis built on SI reference architecture',
      'Program plan with staffing, governance, and risk log',
      'Exec brief that ties to SI practice growth KPIs'
    ],
    icon: GitBranch,
    color: 'bg-gray-700'
  },
  {
    id: 'velocity-smb-outbound',
    name: 'Velocity SMB Outbound',
    methodology: 'SPIN + Velocity',
    icp: 'SMB',
    industries: ['SaaS', 'Ecommerce', 'Services'],
    persona: 'Owner, founder-led sales, ops lead',
    dealSize: 'ACV $5k-$25k',
    motion: 'High-velocity email + SMS + lightweight calls',
    strengths: 'Fast cycles, constraint-focused messaging, AI fast-drafts',
    aiActions: [
      'Auto-draft 3-step outbound with SMS follow-up tailored to vertical',
      'Generate mini ROI blurb using public signals (tech stack, hiring)',
      'Create quick objection macros for price and timing'
    ],
    activationSignals: ['Recent funding or hiring', 'Tech stack match detected', 'Active job postings in sales/ops'],
    proofAssets: ['One-slide ROI snap', 'Customer logo strip', 'Mini onboarding plan'],
    risks: ['Inbox fatigue from high volume', 'Owner unavailable for calls'],
    plays: [
      'SPIN-lite openers that expose cost/time constraints',
      'Day-0 to Day-3 rapid follow-up with channel switching',
      'Calendly + SMS fallback to lock time quickly'
    ],
    icon: Sparkle,
    color: 'bg-teal-600'
  }
];

const TemplateChooser = ({ onTemplateSelect }) => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterIcp, setFilterIcp] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterMethodology, setFilterMethodology] = useState('all');

  const icps = ['all', ...new Set(templates.map((t) => t.icp))];
  const industries = ['all', ...new Set(templates.flatMap((t) => t.industries))];
  const methodologies = ['all', ...new Set(templates.map((t) => t.methodology))];

  const filteredTemplates = templates.filter((t) => {
    const matchesIcp = filterIcp === 'all' || t.icp === filterIcp;
    const matchesIndustry = filterIndustry === 'all' || t.industries.includes(filterIndustry);
    const matchesMethodology = filterMethodology === 'all' || t.methodology === filterMethodology;
    return matchesIcp && matchesIndustry && matchesMethodology;
  });

  const selectedTemplateObj = selectedTemplate ? templates.find((t) => t.id === selectedTemplate) : null;

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template.id);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Choose a sales methodology template</h2>
        <p className="text-gray-600">
          Deploy AI-led outbound that adapts to your ICP, industry, and deal type. Select a methodology and we will wire the agent messaging, sequencing, assets, and guardrails to the play.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">ICP</p>
          <div className="flex gap-2 flex-wrap">
            {icps.map((icp) => (
              <Button
                key={icp}
                variant={filterIcp === icp ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterIcp(icp)}
                className="capitalize"
              >
                {icp}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Industry</p>
          <div className="flex gap-2 flex-wrap">
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={filterIndustry === industry ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterIndustry(industry)}
                className="capitalize"
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Methodology</p>
          <div className="flex gap-2 flex-wrap">
            {methodologies.map((method) => (
              <Button
                key={method}
                variant={filterMethodology === method ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterMethodology(method)}
                className="capitalize"
              >
                {method}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } bg-white/90 border border-gray-200 shadow-sm`}
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent className="p-6 text-gray-900">
                <div className="space-y-4">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${template.color} p-3 rounded-lg text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.methodology} · {template.icp}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="success" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-800 leading-relaxed">{template.strengths}</p>

                  {/* Details */}
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-semibold text-gray-800">ICP:</span> {template.icp} ({template.dealSize})</p>
                    <p><span className="font-semibold text-gray-800">Industries:</span> {template.industries.join(', ')}</p>
                    <p><span className="font-semibold text-gray-800">Personas:</span> {template.persona}</p>
                    <p><span className="font-semibold text-gray-800">Motion:</span> {template.motion}</p>
                  </div>

                  {/* Plays */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">AI plays</p>
                    <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                      {template.plays.map((play) => (
                        <li key={play}>{play}</li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Actions */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2"><Sparkle className="w-4 h-4" /> AI actions</p>
                    <ul className="space-y-1 text-sm text-gray-800 list-disc list-inside">
                      {template.aiActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Signals and assets */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/95 border border-gray-200 shadow-sm">
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2"><Gauge className="w-4 h-4" /> Activation signals</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {template.activationSignals.map((signal) => (
                          <li key={signal}>{signal}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/95 border border-gray-200 shadow-sm">
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2"><Cable className="w-4 h-4" /> Proof assets</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {template.proofAssets.map((asset) => (
                          <li key={asset}>{asset}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/95 border border-gray-200 shadow-sm">
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2"><Landmark className="w-4 h-4" /> Risk guardrails</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {template.risks.map((risk) => (
                          <li key={risk}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{template.methodology}</Badge>
                    <Badge variant="secondary" className="text-xs">{template.icp}</Badge>
                    {template.industries.map((industry) => (
                      <Badge key={industry} variant="secondary" className="text-xs">{industry}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      {selectedTemplateObj && (
        <div className="space-y-4 pt-4">
          <Card className="bg-white/95 border border-gray-200 shadow-sm">
            <CardContent className="p-5 text-gray-900 space-y-3">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Configuration summary</p>
                  <h4 className="text-lg font-semibold">Configuring AI outbound with {selectedTemplateObj.name}</h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{selectedTemplateObj.methodology}</Badge>
                  <Badge variant="secondary" className="text-xs">{selectedTemplateObj.icp}</Badge>
                </div>
              </div>
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                <li>Drafts messaging bundles (openers, follow-ups, SMS) tuned to ICP, industry, and persona.</li>
                <li>Builds compliant sequences with guardrails, send windows, and approval flows.</li>
                <li>Generates proof assets and exec briefs from the play’s activation signals.</li>
                <li>Surfaces risks and inserts mitigation steps into the mutual action plan.</li>
                <li>Preps handoff notes for reps with AI-suggested next best actions.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => {
                if (onTemplateSelect) onTemplateSelect(selectedTemplateObj);
                navigate(`/ai-assistant?play=${selectedTemplateObj.id}&icp=${selectedTemplateObj.icp}` , { state: { template: selectedTemplateObj, role: 'rep' } });
              }}
            >
              Open in AI Assistant (Rep)
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (onTemplateSelect) onTemplateSelect(selectedTemplateObj);
                navigate(`/dashboard?play=${selectedTemplateObj.id}&icp=${selectedTemplateObj.icp}`, { state: { template: selectedTemplateObj, role: 'leader' } });
              }}
            >
              Review in Dashboard (Leader)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateChooser;

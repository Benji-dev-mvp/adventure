import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Eye,
  Copy,
  Play,
  Save,
  Undo,
  Bot,
  MessageSquare,
  Mail,
  Volume2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  FileText,
  Code,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock AI policies data
const MOCK_POLICIES = [
  {
    id: 'pol-001',
    name: 'Professional Tone',
    description: 'Ensure all AI-generated content maintains a professional, business-appropriate tone',
    category: 'tone',
    status: 'active',
    priority: 'high',
    rules: [
      { type: 'require', value: 'Use formal language in all communications' },
      { type: 'require', value: 'Address recipients by title and last name unless instructed otherwise' },
      { type: 'avoid', value: 'Slang, colloquialisms, or overly casual language' },
    ],
    appliesTo: ['email', 'linkedin', 'chat'],
    lastUpdated: '2024-01-20',
    updatedBy: 'Sarah Johnson',
  },
  {
    id: 'pol-002',
    name: 'Competitor Mentions',
    description: 'Restrict how AI handles mentions of competitors',
    category: 'content',
    status: 'active',
    priority: 'high',
    rules: [
      { type: 'avoid', value: 'Never directly disparage competitors' },
      { type: 'avoid', value: 'Do not make unverifiable comparison claims' },
      { type: 'require', value: 'Focus on our unique value proposition instead' },
    ],
    appliesTo: ['email', 'linkedin'],
    lastUpdated: '2024-01-18',
    updatedBy: 'Mike Chen',
  },
  {
    id: 'pol-003',
    name: 'Escalation Rules',
    description: 'Define when AI should escalate to human review',
    category: 'escalation',
    status: 'active',
    priority: 'critical',
    rules: [
      { type: 'escalate', value: 'Lead mentions legal concerns or compliance issues' },
      { type: 'escalate', value: 'Negative sentiment detected with high-value account' },
      { type: 'escalate', value: 'Request for pricing or contract negotiation' },
      { type: 'escalate', value: 'Lead expresses frustration or complaint' },
    ],
    appliesTo: ['email', 'linkedin', 'chat'],
    lastUpdated: '2024-01-22',
    updatedBy: 'Emily Davis',
  },
  {
    id: 'pol-004',
    name: 'Disallowed Phrases',
    description: 'Phrases that should never appear in AI-generated content',
    category: 'content',
    status: 'active',
    priority: 'high',
    rules: [
      { type: 'block', value: '"Guaranteed results"' },
      { type: 'block', value: '"Risk-free"' },
      { type: 'block', value: '"Best in class" (without substantiation)' },
      { type: 'block', value: '"Limited time offer" (unless actually limited)' },
      { type: 'block', value: 'Urgency language like "Act now"' },
    ],
    appliesTo: ['email', 'linkedin'],
    lastUpdated: '2024-01-15',
    updatedBy: 'Sarah Johnson',
  },
  {
    id: 'pol-005',
    name: 'Data Privacy',
    description: 'Ensure AI respects data privacy and GDPR compliance',
    category: 'compliance',
    status: 'active',
    priority: 'critical',
    rules: [
      { type: 'require', value: 'Include opt-out option in all automated emails' },
      { type: 'avoid', value: 'Referencing specific personal data without consent' },
      { type: 'require', value: 'Respect DND (Do Not Disturb) flags' },
    ],
    appliesTo: ['email', 'linkedin', 'chat'],
    lastUpdated: '2024-01-10',
    updatedBy: 'Legal Team',
  },
];

// Mock JSON policy for code editor
const POLICY_JSON = `{
  "policies": [
    {
      "id": "tone-professional",
      "name": "Professional Tone",
      "enabled": true,
      "rules": {
        "formalLanguage": true,
        "addressByTitle": true,
        "avoidSlang": true,
        "maxExclamations": 1
      }
    },
    {
      "id": "content-restrictions",
      "name": "Content Restrictions",
      "enabled": true,
      "blockedPhrases": [
        "guaranteed results",
        "risk-free",
        "act now",
        "limited time"
      ],
      "competitorHandling": "neutral"
    },
    {
      "id": "escalation-triggers",
      "name": "Escalation Triggers",
      "enabled": true,
      "triggers": [
        "legal_mention",
        "negative_sentiment",
        "pricing_request",
        "complaint"
      ],
      "notifyChannel": "slack",
      "notifyUsers": ["@sales-manager"]
    }
  ]
}`;

const categoryIcons = {
  tone: Volume2,
  content: FileText,
  escalation: AlertCircle,
  compliance: ShieldCheck,
};

const categoryColors = {
  tone: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  content: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  escalation: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  compliance: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const priorityColors = {
  critical: 'bg-red-500 text-white',
  high: 'bg-amber-500 text-white',
  medium: 'bg-blue-500 text-white',
  low: 'bg-gray-500 text-white',
};

const ruleTypeStyles = {
  require: { icon: Check, color: 'text-green-500 bg-green-500/10' },
  avoid: { icon: X, color: 'text-amber-500 bg-amber-500/10' },
  block: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  escalate: { icon: AlertCircle, color: 'text-purple-500 bg-purple-500/10' },
};

const channelIcons = {
  email: Mail,
  linkedin: MessageSquare,
  chat: Bot,
};

const PolicyCard = ({ policy, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CategoryIcon = categoryIcons[policy.category] || ShieldCheck;

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-xl", categoryColors[policy.category])}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{policy.name}</h3>
                <Badge className={priorityColors[policy.priority]} size="sm">
                  {policy.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{policy.description}</p>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {policy.appliesTo.map((channel) => {
                    const ChannelIcon = channelIcons[channel] || Mail;
                    return (
                      <div key={channel} className="p-1 bg-gray-100 dark:bg-white/10 rounded" title={channel}>
                        <ChannelIcon className="h-3 w-3 text-gray-500" />
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{policy.rules.length} rules</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">Updated {policy.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => onEdit(policy)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => onDelete(policy.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rules</p>
            <div className="space-y-2">
              {policy.rules.map((rule, index) => {
                const ruleStyle = ruleTypeStyles[rule.type];
                const RuleIcon = ruleStyle.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cn("p-1 rounded", ruleStyle.color)}>
                      <RuleIcon className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{rule.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const PreviewPanel = () => {
  const [originalText] = useState(
    "Hey! Just wanted to reach out about our AMAZING product that's guaranteed to 10x your revenue. " +
    "Act now - this is a limited time offer! We're way better than [competitor] and risk-free to try!!!"
  );
  
  const [correctedText] = useState(
    "Hello, I wanted to reach out regarding our sales engagement platform that has helped similar companies " +
    "significantly improve their outreach results. I'd be happy to share some relevant case studies and discuss " +
    "how we might be able to support your team's goals."
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-500" />
          Policy Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Original (Would be blocked)</p>
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{originalText}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="danger" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                "guaranteed"
              </Badge>
              <Badge variant="danger" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                "Act now"
              </Badge>
              <Badge variant="danger" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                "risk-free"
              </Badge>
              <Badge variant="warning" size="sm">
                <X className="h-3 w-3 mr-1" />
                Casual tone
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Corrected (Policy-compliant)</p>
          <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{correctedText}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="success" size="sm">
                <Check className="h-3 w-3 mr-1" />
                Professional tone
              </Badge>
              <Badge variant="success" size="sm">
                <Check className="h-3 w-3 mr-1" />
                No blocked phrases
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CodeEditor = ({ value, onChange }) => {
  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-white/10 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">policies.json</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full pt-14 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-500"
        spellCheck={false}
      />
    </div>
  );
};

const AIPolicies = () => {
  const [policies, setPolicies] = useState(MOCK_POLICIES);
  const [activeTab, setActiveTab] = useState('visual');
  const [policyJson, setPolicyJson] = useState(POLICY_JSON);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPolicies = categoryFilter === 'all'
    ? policies
    : policies.filter(p => p.category === categoryFilter);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent-500" />
              AI Policies & Guardrails
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Define rules and restrictions for AI-generated content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Test Policies
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('visual')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'visual'
                  ? "border-accent-500 text-accent-600 dark:text-accent-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Layers className="h-4 w-4 inline-block mr-2" />
              Visual Editor
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'code'
                  ? "border-accent-500 text-accent-600 dark:text-accent-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Code className="h-4 w-4 inline-block mr-2" />
              JSON/YAML
            </button>
          </div>
        </div>

        {activeTab === 'visual' ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Policies List */}
            <div className="col-span-2 space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-2">
                {['all', 'tone', 'content', 'escalation', 'compliance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg transition-colors capitalize",
                      categoryFilter === cat
                        ? "bg-accent-500 text-white"
                        : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Policy Cards */}
              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    onEdit={(p) => console.log('Edit policy:', p)}
                    onDelete={(id) => setPolicies(prev => prev.filter(p => p.id !== id))}
                  />
                ))}
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <PreviewPanel />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 h-[600px]">
            <CodeEditor value={policyJson} onChange={setPolicyJson} />
            <PreviewPanel />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {policies.length} policies configured • Last updated: Today at 2:30 PM
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Undo className="h-4 w-4 mr-2" />
              Discard Changes
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save All Policies
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIPolicies;

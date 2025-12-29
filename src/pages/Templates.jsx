import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  Filter,
  Search,
  Plus,
  ChevronDown,
  Wand2,
  Copy,
  Edit,
  Trash2,
  Play,
  Zap,
  Target,
  Mail,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  BarChart3,
} from 'lucide-react';
import {
  AnimatedCounter,
  LiveIndicator,
  FuturisticBackground,
} from '../components/ui/AnimatedComponents';

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedMethodology, setSelectedMethodology] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isAiAssistOpen, setIsAiAssistOpen] = useState(false);
  const [aiAction, setAiAction] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [liveStats, setLiveStats] = useState({
    totalTemplates: 247,
    activeTemplates: 89,
    avgPerformance: 31.2,
    templatesUsedToday: 12,
  });

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalTemplates: prev.totalTemplates + Math.floor(Math.random() * 3),
        activeTemplates: prev.activeTemplates + Math.floor(Math.random() * 2),
        avgPerformance: +(prev.avgPerformance + (Math.random() - 0.5) * 0.5).toFixed(1),
        templatesUsedToday: prev.templatesUsedToday + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const templates = [
    {
      id: 1,
      name: 'MEDDIC Enterprise SaaS',
      category: 'Enterprise',
      industry: 'SaaS',
      methodology: 'MEDDIC',
      performance: 34.2,
      uses: 156,
      lastUsed: '2 hours ago',
      description: 'Multi-threaded enterprise sales with economic buyer focus',
      status: 'active',
    },
    {
      id: 2,
      name: 'Challenger Industrial GTM',
      category: 'Mid-Market',
      industry: 'Manufacturing',
      methodology: 'Challenger',
      performance: 28.7,
      uses: 98,
      lastUsed: '4 hours ago',
      description: 'Provocative insights for manufacturing and industrial ops',
      status: 'active',
    },
    {
      id: 3,
      name: 'SPICED PLG Expansion',
      category: 'Growth',
      industry: 'SaaS',
      methodology: 'SPICED',
      performance: 42.1,
      uses: 203,
      lastUsed: '1 hour ago',
      description: 'Product-led growth expansion with usage signals',
      status: 'active',
    },
    {
      id: 4,
      name: 'Sandler Financial Services',
      category: 'Enterprise',
      industry: 'Financial',
      methodology: 'Sandler',
      performance: 31.5,
      uses: 124,
      lastUsed: '3 hours ago',
      description: 'Compliance-first approach for banking and insurance',
      status: 'active',
    },
    {
      id: 5,
      name: 'Value Selling Cybersecurity',
      category: 'Enterprise',
      industry: 'Security',
      methodology: 'Value Selling',
      performance: 39.8,
      uses: 187,
      lastUsed: '30 min ago',
      description: 'Risk quantification for CISO and security teams',
      status: 'active',
    },
    {
      id: 6,
      name: 'Velocity SMB Outbound',
      category: 'SMB',
      industry: 'SaaS',
      methodology: 'SPIN',
      performance: 26.3,
      uses: 312,
      lastUsed: '5 hours ago',
      description: 'High-velocity outbound for small business',
      status: 'active',
    },
  ];

  const categories = ['all', 'Enterprise', 'Mid-Market', 'Growth', 'SMB'];
  const industries = ['all', 'SaaS', 'Manufacturing', 'Financial', 'Security', 'Healthcare'];
  const methodologies = [
    'all',
    'MEDDIC',
    'Challenger',
    'SPICED',
    'Sandler',
    'Value Selling',
    'SPIN',
  ];

  const aiActions = [
    { id: 'generate', label: 'Generate new template from description', icon: Wand2 },
    { id: 'optimize', label: 'Optimize template for better performance', icon: TrendingUp },
    { id: 'personalize', label: 'Personalize template for specific prospect', icon: Target },
    { id: 'ab-test', label: 'Create A/B test variations', icon: BarChart3 },
    { id: 'translate', label: 'Translate template to multiple languages', icon: Mail },
    { id: 'schedule', label: 'Schedule automated sends', icon: Clock },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    const matchesMethodology =
      selectedMethodology === 'all' || template.methodology === selectedMethodology;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesIndustry && matchesMethodology && matchesSearch;
  });

  const handleAiAction = async actionId => {
    setIsProcessing(true);
    setAiAction(actionId);

    // Simulate AI processing
    setTimeout(() => {
      const responses = {
        generate:
          "Template generated successfully! I've created a personalized outbound sequence with 5 touchpoints optimized for your ICP.",
        optimize:
          'Template optimized! Performance score improved from 31% to 38% with enhanced subject lines and better CTAs.',
        personalize:
          'Personalized version created! Added company-specific insights and tailored value propositions.',
        'ab-test': 'Created 3 A/B test variations with different subject lines and opening hooks.',
        translate:
          'Template translated to 7 languages: Spanish, French, German, Italian, Portuguese, Japanese, and Chinese.',
        schedule:
          'Automated campaign scheduled! 150 prospects will receive personalized emails over the next 3 days.',
      };
      setAiResponse(responses[actionId] || 'Action completed successfully!');
      setIsProcessing(false);
    }, 2000);
  };

  const handleUseTemplate = template => {
    // Show success message
    const successMsg = `"${template.name}" is now active! Starting campaign with this template...`;
    setAiResponse(successMsg);
    setIsAiAssistOpen(true);
    setIsProcessing(false);

    // Simulate launching campaign
    setTimeout(() => {
      setAiResponse(`Campaign launched successfully with "${template.name}"! 
      
      • Target audience: ${template.category} ${template.industry} prospects
      • Methodology: ${template.methodology}
      • Expected performance: ${template.performance}% response rate
      • First emails will be sent in 5 minutes`);
    }, 1000);
  };

  const handleEditTemplate = template => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleCopyTemplate = template => {
    // Simulate copying template
    setAiResponse(`Template "${template.name}" copied successfully! 
    
    Created duplicate: "${template.name} (Copy)"
    You can now customize it for different audiences.`);
    setIsAiAssistOpen(true);
    setIsProcessing(false);
  };

  const handleDeleteTemplate = template => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      setAiResponse(`Template "${template.name}" has been deleted.`);
      setIsAiAssistOpen(true);
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <FuturisticBackground />

      <div className="relative z-10 max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              Sales Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered templates for every sales motion
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            onClick={() => setIsAiAssistOpen(true)}
          >
            <Sparkles size={16} className="mr-2" />
            AI Assistant
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <FileText size={20} className="text-purple-500" />
                <LiveIndicator />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={liveStats.totalTemplates} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Templates</p>
            </div>
          </Card>
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <LiveIndicator color="green" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={liveStats.activeTemplates} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Templates</p>
            </div>
          </Card>
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={20} className="text-blue-500" />
                <LiveIndicator color="blue" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={liveStats.avgPerformance} decimals={1} />%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg Performance</p>
            </div>
          </Card>
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap size={20} className="text-orange-500" />
                <LiveIndicator color="orange" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={liveStats.templatesUsedToday} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Used Today</p>
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedIndustry}
                onChange={e => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>
                    {ind === 'all' ? 'All Industries' : ind}
                  </option>
                ))}
              </select>

              <select
                value={selectedMethodology}
                onChange={e => setSelectedMethodology(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {methodologies.map(method => (
                  <option key={method} value={method}>
                    {method === 'all' ? 'All Methodologies' : method}
                  </option>
                ))}
              </select>

              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {template.description}
                    </p>
                  </div>
                  <Badge
                    variant={template.status === 'active' ? 'success' : 'default'}
                    className="ml-2"
                  >
                    {template.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {template.methodology}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.industry}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Performance</div>
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {template.performance}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Uses</div>
                    <div className="font-bold text-gray-900 dark:text-white">{template.uses}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Last Used</div>
                    <div className="font-bold text-gray-900 dark:text-white text-xs">
                      {template.lastUsed}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={e => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                  >
                    <Play size={14} className="mr-1" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleCopyTemplate(template);
                    }}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Template Editor Modal */}
        {showTemplateEditor && editingTemplate && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplateEditor(false)}
          >
            <Card
              className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-purple-500/50 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Edit Template
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Customize your template settings and content
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTemplateEditor(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <XCircle size={28} />
                  </button>
                </div>

                {/* Template Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Template Name
                      </label>
                      <input
                        type="text"
                        defaultValue={editingTemplate.name}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        defaultValue={editingTemplate.category}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {categories
                          .filter(c => c !== 'all')
                          .map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry
                      </label>
                      <select
                        defaultValue={editingTemplate.industry}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {industries
                          .filter(i => i !== 'all')
                          .map(ind => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Methodology
                      </label>
                      <select
                        defaultValue={editingTemplate.methodology}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {methodologies
                          .filter(m => m !== 'all')
                          .map(method => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      defaultValue={editingTemplate.description}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Template Content
                    </label>
                    <textarea
                      placeholder="Subject: {{subject}}

Hi {{firstName}},

I noticed that {{company}} is..."
                      rows={10}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Use variables: {{ firstName }}, {{ lastName }}, {{ company }}, {{ title }},{' '}
                      {{ industry }}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="primary"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => {
                        setShowTemplateEditor(false);
                        setAiResponse(`Template "${editingTemplate.name}" updated successfully!`);
                        setIsAiAssistOpen(true);
                      }}
                    >
                      <CheckCircle2 size={16} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleAiAction('optimize');
                        setShowTemplateEditor(false);
                      }}
                    >
                      <Wand2 size={16} className="mr-2" />
                      AI Optimize
                    </Button>
                    <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* AI Assistant Panel */}
        {isAiAssistOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => !isProcessing && setIsAiAssistOpen(false)}
          >
            <Card
              className="w-full max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-purple-500/50 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="text-white" size={28} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Ava Template Assistant
                        <Badge
                          variant="outline"
                          className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                        >
                          AI
                        </Badge>
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Select an action to automate your workflow
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAiAssistOpen(false);
                      setAiResponse('');
                      setAiAction('');
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    disabled={isProcessing}
                  >
                    <XCircle size={28} />
                  </button>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {aiActions.map(action => {
                    const Icon = action.icon;
                    const isActive = aiAction === action.id && isProcessing;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleAiAction(action.id)}
                        disabled={isProcessing}
                        className={`relative group p-5 rounded-xl border-2 transition-all text-left overflow-hidden ${
                          isActive
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 bg-white/70 dark:bg-gray-800/70 hover:shadow-md hover:scale-102'
                        } ${isProcessing && !isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              isActive
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                                : 'bg-gradient-to-br from-purple-400 to-pink-400 group-hover:scale-110 group-hover:shadow-md'
                            }`}
                          >
                            <Icon className="text-white" size={22} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm leading-tight">
                              {action.label}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {action.id === 'generate' && 'Create custom templates using AI'}
                              {action.id === 'optimize' && 'Improve open rates and responses'}
                              {action.id === 'personalize' && 'Add dynamic prospect data'}
                              {action.id === 'ab-test' && 'Test multiple variations'}
                              {action.id === 'translate' && 'Reach global markets'}
                              {action.id === 'schedule' && 'Automate your outreach'}
                            </p>
                          </div>

                          {isActive && (
                            <div className="absolute top-3 right-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Response Area */}
                {aiResponse && (
                  <div className="space-y-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 border-2 border-green-500/30 shadow-inner">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <CheckCircle2 className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                            Action Complete!
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {aiResponse}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Download size={14} className="mr-1" />
                              Export Result
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Play size={14} className="mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer hint */}
                {!aiResponse && !isProcessing && (
                  <div className="mt-6 p-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/50">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                      <Sparkles size={14} className="text-purple-500" />
                      Ava will process your request in seconds using advanced AI models
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Templates;

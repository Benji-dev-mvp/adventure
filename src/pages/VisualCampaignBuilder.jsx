import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import WorkflowCanvas from '../components/workflow/WorkflowCanvasEnhanced';
import PlaybookLibrary from '../components/workflow/PlaybookLibrary';
import AIWorkflowAssistant from '../components/workflow/AIWorkflowAssistant';
import { useToast } from '../components/Toast';
import { saveCampaignDraft, getCampaignDraft } from '../lib/storage';
import {
  BookOpen,
  Save,
  Play,
  Settings,
  ChevronDown,
  Users,
  Calendar,
  Target,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  Download,
  Upload,
  Zap,
} from 'lucide-react';

const VisualCampaignBuilder = () => {
  const { showToast } = useToast();
  const [campaignName, setCampaignName] = useState('Untitled Campaign');
  const [isEditing, setIsEditing] = useState(false);
  const [showPlaybooks, setShowPlaybooks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showMetrics, setShowMetrics] = useState(true);

  // Campaign settings
  const [settings, setSettings] = useState({
    targetAudience: 'All Leads',
    startDate: '',
    endDate: '',
    timezone: 'America/New_York',
    dailyLimit: 100,
    priority: 'normal',
    aiOptimization: true,
  });

  // Load saved workflow on mount
  useEffect(() => {
    const draft = getCampaignDraft();
    if (draft?.workflow) {
      setWorkflow(draft.workflow);
      setCampaignName(draft.campaignName || 'Untitled Campaign');
      setSettings(draft.settings || settings);
      showToast('📄 Draft loaded successfully', 'info');
    }
  }, []);

  // Handle workflow save
  const handleSave = useCallback(
    async workflowData => {
      setIsSaving(true);
      try {
        const draft = {
          campaignName,
          workflow: workflowData,
          settings,
          savedAt: new Date().toISOString(),
        };
        saveCampaignDraft(draft);
        setWorkflow(workflowData);
        setLastSaved(new Date());
        showToast('✓ Campaign saved successfully', 'success');
      } catch (error) {
        showToast('Failed to save campaign', 'error');
      } finally {
        setIsSaving(false);
      }
    },
    [campaignName, settings, showToast]
  );

  // Handle workflow execution
  const handleExecute = useCallback(
    result => {
      console.log('Execution result:', result);
      showToast(`✓ Campaign executed: ${result.nodes} steps processed`, 'success');
    },
    [showToast]
  );

  // Handle playbook selection
  const handleSelectPlaybook = useCallback(
    playbook => {
      setWorkflow(playbook.workflow);
      setCampaignName(`${playbook.name} Campaign`);
      setShowPlaybooks(false);
      showToast(`✓ Loaded "${playbook.name}" template`, 'success');
    },
    [showToast]
  );

  // Handle AI-generated workflow
  const handleAIWorkflow = useCallback(
    aiWorkflow => {
      setWorkflow(aiWorkflow);
      setCampaignName(aiWorkflow.name || 'AI Generated Campaign');
      showToast('✓ AI workflow applied to canvas!', 'success');
    },
    [showToast]
  );

  // Export workflow
  const handleExport = useCallback(() => {
    if (!workflow) {
      showToast('No workflow to export', 'warning');
      return;
    }
    const data = JSON.stringify({ campaignName, workflow, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignName.replace(/\s+/g, '-').toLowerCase()}-workflow.json`;
    a.click();
    showToast('Workflow exported', 'success');
  }, [workflow, campaignName, settings, showToast]);

  // Import workflow
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.workflow) {
            setWorkflow(data.workflow);
            setCampaignName(data.campaignName || 'Imported Campaign');
            setSettings(data.settings || settings);
            showToast('Workflow imported successfully', 'success');
          }
        } catch {
          showToast('Invalid workflow file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [settings, showToast]);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Campaign Name */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
                  autoFocus
                  className="text-lg font-semibold bg-transparent border-b-2 border-indigo-500 focus:outline-none text-gray-900 dark:text-white"
                />
              ) : (
                <h1
                  onClick={() => setIsEditing(true)}
                  className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {campaignName}
                </h1>
              )}
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Draft
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Last Saved */}
            {lastSaved && (
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}

            {/* Toggle Metrics */}
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showMetrics
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={showMetrics ? 'Hide Metrics' : 'Show Metrics'}
            >
              {showMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Import/Export */}
            <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
              <button
                onClick={handleImport}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Import Workflow"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Export Workflow"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Playbook Library */}
            <button
              onClick={() => setShowPlaybooks(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Playbooks</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Settings</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`}
              />
            </button>

            {/* AI Assistant */}
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Ask Ava</span>
            </button>
          </div>
        </div>

        {/* Settings Panel (Collapsible) */}
        {showSettings && (
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <Users className="w-3 h-3 inline mr-1" />
                  Target Audience
                </label>
                <select
                  value={settings.targetAudience}
                  onChange={e => setSettings({ ...settings, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option>All Leads</option>
                  <option>Enterprise Leads</option>
                  <option>SMB Leads</option>
                  <option>Warm Leads</option>
                  <option>Cold Leads</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={settings.startDate}
                  onChange={e => setSettings({ ...settings, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={settings.endDate}
                  onChange={e => setSettings({ ...settings, endDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Daily Limit */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <Target className="w-3 h-3 inline mr-1" />
                  Daily Limit
                </label>
                <input
                  type="number"
                  value={settings.dailyLimit}
                  onChange={e => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <BarChart3 className="w-3 h-3 inline mr-1" />
                  Priority
                </label>
                <select
                  value={settings.priority}
                  onChange={e => setSettings({ ...settings, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* AI Optimization */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI Optimization
                </label>
                <button
                  onClick={() =>
                    setSettings({ ...settings, aiOptimization: !settings.aiOptimization })
                  }
                  className={`w-full px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    settings.aiOptimization
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {settings.aiOptimization ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Canvas */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas
            campaignName={campaignName}
            initialWorkflow={workflow}
            onSave={handleSave}
            onExecute={handleExecute}
            onAIAssistantOpen={() => setShowAIAssistant(true)}
            showMetrics={showMetrics}
          />
        </div>

        {/* Playbook Library Modal */}
        <PlaybookLibrary
          isOpen={showPlaybooks}
          onClose={() => setShowPlaybooks(false)}
          onSelectPlaybook={handleSelectPlaybook}
        />

        {/* AI Workflow Assistant */}
        <AIWorkflowAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          onGenerateWorkflow={handleAIWorkflow}
        />
      </div>
    </DashboardLayout>
  );
};

export default VisualCampaignBuilder;

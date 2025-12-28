import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useToast } from '../components/Toast';
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  Save
} from 'lucide-react';

const AdminAIControl = () => {
  const toast = useToast();
  const [workspaceId, setWorkspaceId] = useState('default');
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    loadPolicy();
  }, [workspaceId]);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai-advanced/model-policy?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPolicy(data);
        setRules(data.rules || []);
      } else if (response.status === 404) {
        // No policy exists yet
        setPolicy(null);
        setRules([{
          segment: 'default',
          provider: 'openai',
          model: 'gpt-4',
          fallback: [],
          latency_budget_ms: null,
          priority: 100,
        }]);
      }
    } catch (error) {
      toast.error('Failed to load model policy');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const savePolicy = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/ai-advanced/model-policy/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          rules: rules,
          fallback_strategy: 'latency',
          auto_fallback_enabled: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPolicy(data);
        toast.success('Model policy saved successfully');
      } else {
        throw new Error('Failed to save policy');
      }
    } catch (error) {
      toast.error('Failed to save model policy');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => {
    setRules([...rules, {
      segment: 'default',
      provider: 'openai',
      model: 'gpt-4',
      fallback: [],
      latency_budget_ms: null,
      priority: 100,
    }]);
  };

  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const getSegmentBadge = (segment) => {
    const colors = {
      executives: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      bulk: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };
    return colors[segment] || colors.default;
  };

  if (loading) {
    return (
      <DashboardLayout title="AI Control" subtitle="Model orchestration and routing policies">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading AI Control settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="AI Control" 
      subtitle="Model orchestration and routing policies"
      action={
        <Button onClick={savePolicy} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Policy'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rules.length}</p>
                  <p className="text-sm text-gray-600">Active Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Auto</p>
                  <p className="text-sm text-gray-600">Fallback Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Latency</p>
                  <p className="text-sm text-gray-600">Routing Strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-gray-600">Health Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={workspaceId} onValueChange={setWorkspaceId}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Workspace</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Model Routing Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Model Routing Rules</CardTitle>
              <Button onClick={addRule} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getSegmentBadge(rule.segment)}>
                      {rule.segment}
                    </Badge>
                    <Button 
                      onClick={() => removeRule(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Segment */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Segment
                      </label>
                      <Select 
                        value={rule.segment}
                        onValueChange={(value) => updateRule(index, 'segment', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executives">Executives</SelectItem>
                          <SelectItem value="bulk">Bulk Operations</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="default">Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Provider */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Provider
                      </label>
                      <Select 
                        value={rule.provider}
                        onValueChange={(value) => updateRule(index, 'provider', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="azure_openai">Azure OpenAI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Model
                      </label>
                      <Select 
                        value={rule.model}
                        onValueChange={(value) => updateRule(index, 'model', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {rule.provider === 'openai' && (
                            <>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            </>
                          )}
                          {rule.provider === 'anthropic' && (
                            <>
                              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                              <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Latency Budget */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Latency Budget (ms)
                      </label>
                      <input
                        type="number"
                        value={rule.latency_budget_ms || ''}
                        onChange={(e) => updateRule(index, 'latency_budget_ms', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={rule.priority}
                        onChange={(e) => updateRule(index, 'priority', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Fallback Models */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Fallback Models (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={rule.fallback.join(', ')}
                      onChange={(e) => updateRule(
                        index, 
                        'fallback', 
                        e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      )}
                      placeholder="e.g., gpt-3.5-turbo, claude-3-sonnet"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}

              {rules.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No routing rules configured</p>
                  <Button onClick={addRule} variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Rule
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-medium mb-1">How Model Routing Works</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                  <li>Rules are matched by segment (executives, bulk, creative, default)</li>
                  <li>Primary model is used if healthy and within latency budget</li>
                  <li>Fallback models are tried in order if primary fails</li>
                  <li>Health checks run every 5 minutes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAIControl;

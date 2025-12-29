import React, { useState, useEffect, useCallback } from 'react';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/Toast';
import { InlineLoader } from '../components/Loading';
import { useFormValidation } from '../lib/validation';
import { saveCampaignDraft, getCampaignDraft } from '../lib/storage';
import { dataService } from '../lib/dataService';
import {
  Plus,
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  GripVertical,
  Trash2,
  Copy,
  Settings,
  Play,
  Save,
} from 'lucide-react';

const CampaignBuilder = () => {
  const { showToast } = useToast();
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [steps, setSteps] = useState([
    { id: 1, type: 'email', delay: 0, subject: '', content: '' },
  ]);

  // Form validation
  const { errors, validateAll, clearError } = useFormValidation();

  // Load draft on mount
  useEffect(() => {
    const draft = getCampaignDraft();
    if (draft) {
      setCampaignName(draft.campaignName || '');
      setTargetAudience(draft.targetAudience || '');
      setSteps(draft.steps || steps);
      showToast('Draft loaded', 'info');
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (campaignName || steps.some(s => s.subject || s.content)) {
        handleSaveDraft(true);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [campaignName, targetAudience, steps]);

  const handleSaveDraft = useCallback(
    (isAutoSave = false) => {
      const draft = { campaignName, targetAudience, steps, savedAt: new Date().toISOString() };
      saveCampaignDraft(draft);
      setLastSaved(new Date());
      if (!isAutoSave) {
        showToast('Draft saved successfully', 'success');
      }
    },
    [campaignName, targetAudience, steps, showToast]
  );

  const channelTypes = [
    { value: 'email', label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-600' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700 text-white' },
    { value: 'call', label: 'Call', icon: Phone, color: 'bg-green-100 text-green-600' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  ];

  const addStep = type => {
    setSteps([
      ...steps,
      {
        id: steps.length + 1,
        type,
        delay: 2,
        subject: '',
        content: '',
      },
    ]);
    showToast(`${type} step added`, 'success');
  };

  const removeStep = id => {
    if (steps.length === 1) {
      showToast('Campaign must have at least one step', 'error');
      return;
    }
    setSteps(steps.filter(step => step.id !== id));
    showToast('Step removed', 'success');
  };

  const handleGenerateContent = async stepId => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const step = steps.find(s => s.id === stepId);
      if (step?.type === 'email') {
        const updatedSteps = steps.map(s =>
          s.id === stepId
            ? {
                ...s,
                subject: `Personalized outreach for ${campaignName || 'your campaign'}`,
                content: `Hi {{firstName}},\n\nI noticed that {{company}} is growing rapidly in the {{industry}} space. I'd love to share how we've helped similar companies achieve their goals.\n\nWould you be open to a quick 15-minute call next week?\n\nBest,\n[Your Name]`,
              }
            : s
        );
        setSteps(updatedSteps);
        showToast('Content generated successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to generate content', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLaunchCampaign = async () => {
    setIsSaving(true);

    try {
      // Call Python backend for comprehensive validation
      const response = await dataService.post('/campaigns/validate', {
        campaign_name: campaignName,
        target_audience: targetAudience,
        steps: steps,
      });

      if (!response.can_launch) {
        // Show validation errors
        response.errors.forEach(error => {
          showToast(error.message, 'error');
        });

        // Show warnings
        response.warnings.forEach(warning => {
          showToast(warning.message, 'warning');
        });

        setIsSaving(false);
        return;
      }

      // Show cost estimate
      showToast(
        `Campaign validated! Estimated cost: ${response.estimated_cost} credits, ` +
          `reaching ${response.estimated_reach} leads over ${response.estimated_duration_days} days`,
        'info'
      );

      // Show recommendations
      if (response.recommendations && response.recommendations.length > 0) {
        response.recommendations.forEach(rec => {
          showToast(rec, 'info');
        });
      }

      // Proceed with launch
      showToast('Campaign launched successfully!', 'success');

      // Clear draft after launch
      saveCampaignDraft(null);

      setTimeout(() => {
        navigate('/campaigns');
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to validate campaign', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const isValid = validateAll(
      {
        campaignName: [value => (!value || !value.trim() ? 'Campaign name is required' : '')],
        targetAudience: [
          value => (!value || !value.trim() ? 'Please select a target audience' : ''),
        ],
      },
      { campaignName, targetAudience }
    );

    if (!isValid) {
      showToast('Please fix the required fields', 'error');
      return;
    }

    showToast('Campaign submitted successfully', 'success');
  };

  return (
    <PageScaffold
      config={{
        title: 'Campaign Builder',
        subtitle: 'Create multi-channel sequences with AI-powered personalization',
        badges: [{ label: 'Builder', color: 'cyan' }],
        showInspector: true,
        showActivityPanel: false,
      }}
    >
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-3">
        {/* Campaign Setup */}
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Basic information about your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  label="Campaign Name"
                  placeholder="e.g., Q1 Enterprise Outreach"
                  value={campaignName}
                  onChange={e => {
                    setCampaignName(e.target.value);
                    clearError('campaignName');
                  }}
                  error={errors.campaignName}
                />
                <Select
                  label="Target Audience"
                  value={targetAudience}
                  onChange={e => {
                    setTargetAudience(e.target.value);
                    clearError('targetAudience');
                  }}
                  error={errors.targetAudience}
                >
                  <option value="">Select audience...</option>
                  <option value="enterprise">Enterprise Decision Makers</option>
                  <option value="midmarket">Mid-Market CTOs</option>
                  <option value="startup">Startup Founders</option>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Daily Send Limit" type="number" defaultValue="100" />
                  <Select label="Sending Schedule">
                    <option>Business Hours Only</option>
                    <option>24/7</option>
                    <option>Custom</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sequence Builder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sequence Steps</CardTitle>
                  <CardDescription>Build your multi-channel outreach flow</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles size={16} />
                  AI Optimize
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const channel = channelTypes.find(c => c.value === step.type);
                  const Icon = channel.icon;

                  return (
                    <div
                      key={step.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-accent-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          <GripVertical size={20} className="text-gray-400 cursor-move" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${channel.color}`}>
                                <Icon size={18} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Step {index + 1}: {channel.label}
                                </h4>
                                {index > 0 && (
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    Wait {step.delay} days after previous step
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Copy size={16} className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => removeStep(step.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} className="text-red-600" />
                              </button>
                            </div>
                          </div>

                          {index > 0 && (
                            <Input
                              type="number"
                              label="Delay (days)"
                              defaultValue={step.delay}
                              className="max-w-32"
                            />
                          )}

                          {step.type === 'email' && (
                            <>
                              <Input
                                label="Subject Line"
                                placeholder="Quick question about {{company}}"
                              />
                              <Textarea
                                label="Email Body"
                                rows={6}
                                placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} is..."
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleGenerateContent(step.id)}
                                  disabled={isGenerating}
                                >
                                  {isGenerating ? (
                                    <InlineLoader size="sm" />
                                  ) : (
                                    <Sparkles size={14} />
                                  )}
                                  {isGenerating ? 'Generating...' : 'AI Generate'}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Insert Variable
                                </Button>
                                <Button variant="ghost" size="sm">
                                  A/B Test
                                </Button>
                              </div>
                            </>
                          )}

                          {step.type === 'linkedin' && (
                            <>
                              <Textarea
                                label="LinkedIn Message"
                                rows={4}
                                placeholder="Hi {{firstName}}, I saw your post about..."
                              />
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Sparkles size={14} />
                                  AI Generate
                                </Button>
                              </div>
                            </>
                          )}

                          {step.type === 'call' && (
                            <>
                              <Textarea
                                label="Call Script"
                                rows={6}
                                placeholder="Opening: Hi {{firstName}}, this is [Your Name] from..."
                              />
                            </>
                          )}

                          {step.type === 'sms' && (
                            <>
                              <Textarea
                                label="SMS Message"
                                rows={3}
                                placeholder="Hi {{firstName}}, quick follow-up..."
                              />
                              <p className="text-xs text-gray-500">160 characters recommended</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Step Buttons */}
                <div className="flex flex-wrap gap-2">
                  {channelTypes.map(channel => {
                    const Icon = channel.icon;
                    return (
                      <Button
                        key={channel.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addStep(channel.value)}
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Add {channel.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => handleSaveDraft(false)} disabled={isSaving}>
              {isSaving ? <InlineLoader size="sm" /> : <Save size={16} className="mr-2" />}
              Save as Draft
            </Button>
            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary">
                Submit
              </Button>
              <Button variant="outline">Preview</Button>
              <Button className="gap-2" onClick={handleLaunchCampaign} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <InlineLoader size="sm" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Assistant & Settings */}
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent-500" />
                AI Content Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {['Professional', 'Casual', 'Enthusiastic'].map(tone => (
                      <Badge key={tone} className="cursor-pointer hover:bg-accent-100">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <Select>
                    <option>Short (50-100 words)</option>
                    <option>Medium (100-150 words)</option>
                    <option>Long (150-200 words)</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus On</label>
                  <div className="flex flex-wrap gap-2">
                    {['Pain Points', 'Value Prop', 'Social Proof', 'Urgency'].map(focus => (
                      <Badge key={focus} className="cursor-pointer hover:bg-accent-100">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Sparkles size={16} />
                  Generate Content
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '{{firstName}}',
                      '{{lastName}}',
                      '{{company}}',
                      '{{title}}',
                      '{{industry}}',
                    ].map(variable => (
                      <code
                        key={variable}
                        className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                      >
                        {variable}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-accent-50 rounded-lg">
                  <p className="text-sm font-medium text-accent-700 mb-1">AI Personalization</p>
                  <p className="text-xs text-gray-600">
                    Ava will automatically personalize each email based on lead data, recent
                    activity, and company news.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto-pause on reply</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Track opens</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Track clicks</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">AI optimization</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </PageScaffold>
  );
};

export default CampaignBuilder;

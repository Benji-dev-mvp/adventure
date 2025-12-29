import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Rocket,
  Users,
  Brain,
  BarChart3,
  Mail,
  Download,
  Upload,
  FileText,
  Zap,
  Target,
  Clock,
  CheckCircle,
  Play,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast';

export const QuickActionsTab = ({ aiInsights = [] }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isExecuting, setIsExecuting] = useState(null);

  const handleAction = async (actionId, path, message) => {
    setIsExecuting(actionId);

    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 800));

    if (path) {
      navigate(path);
    }

    if (message) {
      toast.success(message);
    }

    setIsExecuting(null);
  };

  // Primary actions
  const primaryActions = [
    {
      id: 'new-campaign',
      title: 'Launch New Campaign',
      description: 'Start a multi-channel outreach campaign',
      icon: Rocket,
      gradient: 'from-cyan-500 to-blue-600',
      path: '/campaigns',
      enabled: true,
    },
    {
      id: 'find-leads',
      title: 'Find New Leads',
      description: 'Search 300M+ verified contacts',
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      path: '/lead-database',
      enabled: true,
    },
    {
      id: 'ask-ava',
      title: 'Ask Ava AI',
      description: 'Get AI-powered recommendations',
      icon: Brain,
      gradient: 'from-green-500 to-emerald-600',
      path: '/ai-assistant',
      enabled: true,
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Detailed performance reports',
      icon: BarChart3,
      gradient: 'from-orange-500 to-amber-600',
      path: '/analytics',
      enabled: true,
    },
  ];

  // Quick workflows
  const workflows = [
    {
      id: 'import-leads',
      title: 'Import Leads from CSV',
      icon: Upload,
      action: () => handleAction('import-leads', '/leads', 'Opening import tool...'),
      time: '< 1 min',
    },
    {
      id: 'export-data',
      title: 'Export Campaign Data',
      icon: Download,
      action: () => handleAction('export-data', null, 'Preparing export...'),
      time: '< 1 min',
    },
    {
      id: 'create-template',
      title: 'Create Email Template',
      icon: FileText,
      action: () => handleAction('create-template', '/templates', 'Opening template builder...'),
      time: '2-3 min',
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Team Meeting',
      icon: Clock,
      action: () => handleAction('schedule-meeting', null, 'Opening calendar...'),
      time: '< 1 min',
    },
  ];

  // AI-recommended actions based on insights
  const aiRecommendedActions = aiInsights.slice(0, 3).map((insight, idx) => ({
    id: `ai-action-${idx}`,
    title: insight.title,
    description: insight.description,
    impact: insight.impact,
    confidence: insight.confidence,
    action: insight.action,
  }));

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Accelerate your workflow with one-click actions
        </p>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {primaryActions.map(action => (
          <Card
            key={action.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br group overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
            onClick={() => handleAction(action.id, action.path)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-90`}
            ></div>
            <CardContent className="relative p-4 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <action.icon size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  disabled={isExecuting === action.id}
                >
                  {isExecuting === action.id ? (
                    <>
                      <Zap size={14} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Workflows */}
      <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            Quick Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {workflows.map(workflow => (
              <button
                key={workflow.id}
                onClick={workflow.action}
                disabled={isExecuting === workflow.id}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg">
                  <workflow.icon size={20} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {workflow.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={12} />
                    {workflow.time}
                  </p>
                </div>
                {isExecuting === workflow.id && (
                  <Zap size={16} className="text-yellow-500 animate-spin" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Recommended Actions */}
      {aiRecommendedActions.length > 0 && (
        <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl border-purple-200 dark:border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain size={18} className="text-purple-500" />
              AI-Recommended Actions
              <Badge className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                Based on your data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiRecommendedActions.map(action => (
                <div
                  key={action.id}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-500/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </h4>
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs">
                          {action.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Target size={12} />
                      <span>
                        Confidence:{' '}
                        <strong className="text-purple-600 dark:text-purple-400">
                          {Math.round(action.confidence * 100)}%
                        </strong>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      {action.action} →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Actions History */}
      <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Recently Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Mail size={14} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">Email campaign launched</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">5 minutes ago</p>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Success
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">320 leads imported</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
              </div>
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                Completed
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <FileText size={14} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">Template created</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Yesterday</p>
              </div>
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                Saved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

QuickActionsTab.propTypes = {
  aiInsights: PropTypes.array,
};

export default QuickActionsTab;

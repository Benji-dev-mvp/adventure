import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Play, Plus, Save, GitBranch, Zap } from 'lucide-react';

const WorkflowOrchestrator = () => {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', label: 'Lead Score > 80', x: 50, y: 50 },
    { id: 2, type: 'condition', label: 'Industry = Tech?', x: 50, y: 150 },
    { id: 3, type: 'action', label: 'Add to Hot Campaign', x: 30, y: 250 },
    { id: 4, type: 'action', label: 'Assign to Sales Rep', x: 70, y: 250 },
  ]);

  const workflows = [
    { name: 'Hot Lead Fast Track', triggers: 2, actions: 4, active: true },
    { name: 'Re-engagement Drip', triggers: 1, actions: 6, active: true },
    { name: 'Enterprise Nurture', triggers: 3, actions: 5, active: false },
  ];

  const getNodeIcon = type => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4" />;
      case 'condition':
        return <GitBranch className="w-4 h-4" />;
      case 'action':
        return <Play className="w-4 h-4" />;
    }
  };

  const getNodeColor = type => {
    switch (type) {
      case 'trigger':
        return 'bg-purple-100 border-purple-500 text-purple-700';
      case 'condition':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'action':
        return 'bg-green-100 border-green-500 text-green-700';
    }
  };

  return (
    <DashboardLayout
      title="Workflow Orchestrator"
      subtitle="Automate multi-step campaigns with visual workflows"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Workflow Canvas</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Node
                </Button>
                <Button size="sm" variant="gradient">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[500px]">
              {/* Simple visual representation */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute border-2 rounded-lg p-3 shadow-sm ${getNodeColor(node.type)} cursor-move`}
                  style={{ left: `${node.x}%`, top: `${node.y}px` }}
                >
                  <div className="flex items-center gap-2">
                    {getNodeIcon(node.type)}
                    <span className="text-sm font-medium">{node.label}</span>
                  </div>
                </div>
              ))}

              {/* Connection lines */}
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              >
                <line
                  x1="50%"
                  y1="90"
                  x2="50%"
                  y2="150"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="50%"
                  y1="190"
                  x2="35%"
                  y2="250"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="50%"
                  y1="190"
                  x2="70%"
                  y2="250"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <p className="text-sm font-medium">Active Workflow Statistics</p>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <p className="text-lg font-bold text-blue-600">1,234</p>
                  <p className="text-xs text-gray-600">Triggered today</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">987</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-600">45</p>
                  <p className="text-xs text-gray-600">In progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Node Library */}
          <Card>
            <CardHeader>
              <CardTitle>Node Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border-2 border-purple-200 dark:border-purple-500/30 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-500/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Trigger</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Start workflow on event</p>
              </div>
              <div className="p-3 border-2 border-blue-200 dark:border-blue-500/30 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/10">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Condition</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">If/then logic branch</p>
              </div>
              <div className="p-3 border-2 border-green-200 dark:border-green-500/30 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-500/10">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Action</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Execute task</p>
              </div>
            </CardContent>
          </Card>

          {/* Saved Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflows.map((wf, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-200 dark:border-white/10 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold">{wf.name}</p>
                      <Badge variant={wf.active ? 'success' : 'secondary'} size="sm">
                        {wf.active ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {wf.triggers} triggers • {wf.actions} actions
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowOrchestrator;

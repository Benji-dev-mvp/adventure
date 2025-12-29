import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Award,
  Zap,
  FileText,
  Play,
  Users,
} from 'lucide-react';

const SalesPlaybooks = () => {
  const [playbooks] = useState([
    {
      id: 1,
      name: 'Enterprise SaaS Outbound',
      industry: 'Technology',
      dealSize: '$50K - $200K',
      salesCycle: '3-6 months',
      winRate: 34,
      avgDealSize: '$125K',
      activeDeals: 23,
      steps: 8,
      color: 'blue',
    },
    {
      id: 2,
      name: 'SMB Quick Close',
      industry: 'General',
      dealSize: '$5K - $25K',
      salesCycle: '2-4 weeks',
      winRate: 47,
      avgDealSize: '$15K',
      activeDeals: 67,
      steps: 5,
      color: 'green',
    },
    {
      id: 3,
      name: 'Product-Led Growth',
      industry: 'SaaS',
      dealSize: '$10K - $50K',
      salesCycle: '1-2 months',
      winRate: 52,
      avgDealSize: '$28K',
      activeDeals: 41,
      steps: 6,
      color: 'purple',
    },
  ]);

  const [currentPlaybook] = useState({
    name: 'Enterprise SaaS Outbound',
    steps: [
      {
        step: 1,
        name: 'Initial Outreach',
        channels: ['Email', 'LinkedIn'],
        duration: '1 week',
        actions: [
          'Send personalized email highlighting pain point',
          'Connect on LinkedIn with custom note',
          'Research company tech stack and recent news',
        ],
        successCriteria: 'Positive reply or connection accepted',
        templates: 3,
        scripts: 2,
      },
      {
        step: 2,
        name: 'Discovery Call',
        channels: ['Phone', 'Video'],
        duration: '30-45 min',
        actions: [
          'Qualify budget and authority',
          'Understand current workflow and pain points',
          'Demo tailored use case',
          'Identify decision makers and timeline',
        ],
        successCriteria: 'Next meeting scheduled',
        templates: 1,
        scripts: 4,
      },
      {
        step: 3,
        name: 'Technical Demo',
        channels: ['Video'],
        duration: '1 hour',
        actions: [
          'Demonstrate key features matching their needs',
          'Show ROI calculator',
          'Answer technical questions',
          'Involve technical champion',
        ],
        successCriteria: 'Positive feedback from technical team',
        templates: 2,
        scripts: 3,
      },
      {
        step: 4,
        name: 'Proposal & Pricing',
        channels: ['Email', 'Video'],
        duration: '1 week',
        actions: [
          'Send custom proposal with pricing tiers',
          'Schedule pricing call',
          'Handle objections',
          'Negotiate terms',
        ],
        successCriteria: 'Budget approved',
        templates: 4,
        scripts: 5,
      },
      {
        step: 5,
        name: 'Close',
        channels: ['Email', 'Phone'],
        duration: '1-2 weeks',
        actions: [
          'Send contract for signature',
          'Answer final questions',
          'Coordinate with legal/procurement',
          'Schedule kickoff call',
        ],
        successCriteria: 'Contract signed',
        templates: 3,
        scripts: 2,
      },
    ],
  });

  const [objectionHandlers] = useState([
    {
      objection: '"We\'re happy with our current solution"',
      type: 'Status Quo',
      responses: [
        "That's great to hear! What specifically do you like about it?",
        'Many of our customers said the same thing before switching. What would make you consider a change?',
        'I understand. Can I show you one capability that our current customers say sets us apart?',
      ],
      successRate: 67,
      avgResponseTime: '2 hours',
    },
    {
      objection: '"It\'s too expensive"',
      type: 'Price',
      responses: [
        'I appreciate that concern. Can you help me understand what budget range you were expecting?',
        "Let's look at the ROI. Our customers typically see 3x return within 6 months. Would that change the equation?",
        'We have different pricing tiers. Let me understand your specific needs so we can find the right fit.',
      ],
      successRate: 54,
      avgResponseTime: '1 hour',
    },
    {
      objection: '"We need to think about it"',
      type: 'Stall',
      responses: [
        'Absolutely. What specific aspects do you need to think through?',
        "I understand. To help you think it through, what are the top 2-3 factors you're considering?",
        "That makes sense. When would be a good time to reconnect after you've had time to discuss?",
      ],
      successRate: 72,
      avgResponseTime: '30 minutes',
    },
  ]);

  const [valueProps] = useState([
    {
      category: 'Time Savings',
      headline: 'Save 20+ hours per week',
      stats: ['247 prospects researched/day', '89% email open rate', '12x faster than manual'],
      useCase: 'SDR teams spending too much time on research',
    },
    {
      category: 'Revenue Impact',
      headline: '3.5x increase in pipeline',
      stats: ['$2.4M average pipeline increase', '34% higher win rate', '2.3x more meetings'],
      useCase: 'Sales teams missing quota',
    },
    {
      category: 'Cost Reduction',
      headline: 'Replace 3 tools with 1',
      stats: ['Save $40K/year on tools', 'Reduce tech stack complexity', '90% less manual work'],
      useCase: 'Companies with fragmented sales tech',
    },
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sales Playbooks & Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Guided selling frameworks and battle cards
          </p>
        </div>

        {/* Playbooks Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {playbooks.map(playbook => (
            <Card key={playbook.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-${playbook.color}-500 to-${playbook.color}-600 rounded-xl flex items-center justify-center text-white`}
                  >
                    <BookOpen size={24} />
                  </div>
                  <Badge variant="outline">{playbook.steps} steps</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{playbook.name}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-semibold">{playbook.industry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deal Size:</span>
                    <span className="font-semibold">{playbook.dealSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sales Cycle:</span>
                    <span className="font-semibold">{playbook.salesCycle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">{playbook.winRate}%</p>
                    <p className="text-xs text-gray-600">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">{playbook.avgDealSize}</p>
                    <p className="text-xs text-gray-600">Avg Deal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">{playbook.activeDeals}</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>

                <Button className="w-full">
                  <Play size={16} className="mr-2" />
                  Use Playbook
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="steps" className="mb-6">
          <TabsList>
            <TabsTrigger value="steps">Playbook Steps</TabsTrigger>
            <TabsTrigger value="objections">Objection Handlers</TabsTrigger>
            <TabsTrigger value="value">Value Props</TabsTrigger>
            <TabsTrigger value="competitors">Battle Cards</TabsTrigger>
          </TabsList>

          {/* Playbook Steps */}
          <TabsContent value="steps">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{currentPlaybook.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      Edit Playbook
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {currentPlaybook.steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{step.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Clock size={10} className="mr-1" />
                                {step.duration}
                              </Badge>
                              {step.channels.map(channel => (
                                <Badge key={channel} variant="secondary" className="text-xs">
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-semibold mb-2">Actions:</p>
                          <ul className="space-y-1">
                            {step.actions.map((action, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle
                                  size={16}
                                  className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Target size={16} className="text-blue-500" />
                            <span className="text-sm">
                              <span className="text-gray-600">Success Criteria:</span>{' '}
                              <span className="font-semibold">{step.successCriteria}</span>
                            </span>
                          </div>
                          <div className="flex gap-2 text-sm">
                            <Badge variant="outline">{step.templates} templates</Badge>
                            <Badge variant="outline">{step.scripts} scripts</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Objection Handlers */}
          <TabsContent value="objections">
            <div className="grid gap-4">
              {objectionHandlers.map((handler, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="warning">{handler.type}</Badge>
                          <Badge variant="success">{handler.successRate}% success rate</Badge>
                          <span className="text-sm text-gray-600">
                            Avg response: {handler.avgResponseTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-4">{handler.objection}</h3>

                        <div>
                          <p className="text-sm font-semibold mb-2">Suggested Responses:</p>
                          <div className="space-y-2">
                            {handler.responses.map((response, i) => (
                              <div
                                key={i}
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500"
                              >
                                <p className="text-sm">{response}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Value Props */}
          <TabsContent value="value">
            <div className="grid gap-4">
              {valueProps.map((prop, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        <Award size={24} />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {prop.category}
                        </Badge>
                        <h3 className="text-2xl font-bold mb-3">{prop.headline}</h3>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {prop.stats.map((stat, i) => (
                            <div
                              key={i}
                              className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg text-center"
                            >
                              <p className="font-semibold text-sm">{stat}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Target size={16} className="text-blue-500" />
                          <span className="text-gray-600">Best for:</span>
                          <span className="font-semibold">{prop.useCase}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Battle Cards */}
          <TabsContent value="competitors">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto mb-3 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Competitor Battle Cards</h3>
                <p className="text-gray-600 mb-4">Head-to-head comparisons with key competitors</p>
                <Button>View Battle Cards</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SalesPlaybooks;

import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Sword, Shield, Target, TrendingUp, AlertCircle, CheckCircle, Copy } from 'lucide-react';

const BattleCards = () => {
  const [selectedCard, setSelectedCard] = useState('competitors');

  const competitors = [
    {
      name: 'Outreach.io',
      strengths: ['Market leader', 'Enterprise features', 'Large integrations ecosystem'],
      weaknesses: ['Expensive ($100+/user/mo)', 'Complex setup', 'Steep learning curve'],
      ourAdvantage: 'AI-powered Ava automates what Outreach requires manual work for',
      pricing: 'We\'re 50% cheaper with better AI',
      keyDifferentiator: 'True AI assistant vs. manual sequences'
    },
    {
      name: 'SalesLoft',
      strengths: ['Strong analytics', 'Cadence builder', 'Good mobile app'],
      weaknesses: ['No AI assistant', 'Limited personalization', 'High cost'],
      ourAdvantage: 'Ava writes personalized messages at scale - they can\'t',
      pricing: '$75-125/user vs our $49-99/user',
      keyDifferentiator: 'AI-first platform vs. traditional automation'
    },
    {
      name: 'Apollo.io',
      strengths: ['Good database', 'Affordable', 'Easy to use'],
      weaknesses: ['Basic automation', 'No AI writing', 'Limited intelligence'],
      ourAdvantage: 'We combine their database with true AI intelligence',
      pricing: 'Similar price, 10x the intelligence',
      keyDifferentiator: 'AI agent vs. simple automation tool'
    }
  ];

  const objections = [
    {
      objection: '"We already use [Competitor]"',
      response: 'Great! Many of our customers came from [Competitor]. The main reason they switched was our AI assistant Ava, who writes personalized emails at scale - something [Competitor] requires manual work for. Can I show you a quick comparison?',
      winRate: '68%',
      bestPractice: 'Acknowledge their current tool, then focus on AI differentiation'
    },
    {
      objection: '"Your pricing seems high"',
      response: 'I understand budget is important. Let me show you the ROI: Our customers see 3-5x better reply rates within 30 days. If you\'re currently getting 10% replies, that jumps to 30-50%. At your volume, that\'s X more meetings per month. What\'s a qualified meeting worth to you?',
      winRate: '74%',
      bestPractice: 'Shift from cost to ROI. Use their numbers.'
    },
    {
      objection: '"We need to think about it"',
      response: 'Absolutely, this is an important decision. To help your evaluation, what specific concerns do you have? Is it about [pricing/implementation/ROI]? I can address those right now and even set up a pilot for your team to see results firsthand.',
      winRate: '45%',
      bestPractice: 'Uncover the real objection with open-ended questions'
    },
    {
      objection: '"We don\'t have time to implement"',
      response: 'I hear you - time is precious. Good news: most teams are sending their first AI-powered campaign within 24 hours. We handle the heavy lifting: data migration, template setup, and team training. Your team invests about 2 hours total. Is that feasible?',
      winRate: '82%',
      bestPractice: 'Give specific time commitment, emphasize quick time-to-value'
    }
  ];

  const features = [
    {
      feature: 'AI-Powered Email Writing',
      benefit: '3-5x better reply rates',
      useCase: 'When prospects need personalized outreach at scale',
      proof: 'Customer case study: TechCorp increased replies from 12% to 38%'
    },
    {
      feature: 'Multi-Channel Campaigns',
      benefit: 'Reach prospects where they engage',
      useCase: 'When single-channel outreach isn\'t working',
      proof: 'Customers see 60% lift when adding LinkedIn to email'
    },
    {
      feature: 'Advanced Lead Scoring',
      benefit: 'Focus reps on highest-value leads',
      useCase: 'When sales teams waste time on low-intent leads',
      proof: 'Customers cut prospecting time by 40%, double conversion rates'
    }
  ];

  const stories = [
    {
      customer: 'TechCorp (500 employees)',
      challenge: 'Reply rates dropped to 8%, needed to scale outbound',
      solution: 'Implemented Ava for personalized email campaigns',
      results: ['Reply rate: 8% → 34%', 'Meetings booked: 2x', 'Sales cycle: -30%'],
      quote: '"Ava is like having 10 SDRs who never sleep"',
      industry: 'SaaS'
    },
    {
      customer: 'Growth Inc (200 employees)',
      challenge: 'Manual prospecting taking 80% of SDR time',
      solution: 'Automated multi-channel sequences with Ava',
      results: ['SDR productivity: 3x', 'Cost per meeting: -60%', 'Pipeline: +$2M'],
      quote: '"We went from 5 meetings/week to 15 with the same team"',
      industry: 'FinTech'
    }
  ];

  return (
    <DashboardLayout title="Battle Cards" subtitle="Competitive intel, objection handlers, and success stories">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'competitors', label: 'Competitors', icon: Sword },
            { id: 'objections', label: 'Objections', icon: Shield },
            { id: 'features', label: 'Feature-Benefit', icon: Target },
            { id: 'stories', label: 'Success Stories', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCard(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCard === tab.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Competitor Cards */}
        {selectedCard === 'competitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitors.map((comp, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Sword className="w-5 h-5 text-red-600" />
                      {comp.name}
                    </CardTitle>
                    <button className="text-gray-400 hover:text-accent-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Their Strengths:</p>
                    <ul className="space-y-1">
                      {comp.strengths.map((s, j) => (
                        <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Their Weaknesses:</p>
                    <ul className="space-y-1">
                      {comp.weaknesses.map((w, j) => (
                        <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-accent-50 dark:bg-accent-500/10 rounded-lg">
                    <p className="text-sm font-semibold text-accent-700 dark:text-accent-300 mb-1">🎯 Our Advantage:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comp.ourAdvantage}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">{comp.pricing}</Badge>
                    <Badge variant="secondary">{comp.keyDifferentiator}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Objection Handlers */}
        {selectedCard === 'objections' && (
          <div className="grid grid-cols-1 gap-6">
            {objections.map((obj, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{obj.objection}</h3>
                        <Badge variant="success">Win Rate: {obj.winRate}</Badge>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">✅ Recommended Response:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{obj.response}</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Best Practice:</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{obj.bestPractice}</p>
                      </div>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-accent-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Feature-Benefit Matrix */}
        {selectedCard === 'features' && (
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.feature}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Benefit:</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{feature.benefit}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">When to Use:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{feature.useCase}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Proof Point:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{feature.proof}</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-accent-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Success Stories */}
        {selectedCard === 'stories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stories.map((story, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        {story.customer}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">{story.industry}</Badge>
                    </div>
                    <button className="text-gray-400 hover:text-accent-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Challenge:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Solution:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Results:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {story.results.map((result, j) => (
                        <div key={j} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-500/10 rounded">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-accent-500">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">{story.quote}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BattleCards;

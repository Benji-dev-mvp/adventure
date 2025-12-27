// Sales Playbooks - Playbooks, Battle Cards, Objection Handlers, ROI Calculator
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Book, Shield, MessageSquare, Calculator, ChevronRight, CheckCircle, Target, TrendingUp } from 'lucide-react';

// SALES PLAYBOOKS
export const SalesPlaybooks = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [playbooks] = useState([
    { 
      id: 1, 
      name: 'Discovery Call Playbook', 
      stage: 'Discovery',
      steps: [
        { step: 1, title: 'Build Rapport', duration: '5 min', talking_points: ['Personal connection', 'Company background'] },
        { step: 2, title: 'Understand Pain Points', duration: '10 min', talking_points: ['Current process', 'Challenges', 'Impact'] },
        { step: 3, title: 'Present Solution', duration: '15 min', talking_points: ['Feature match', 'ROI discussion'] },
        { step: 4, title: 'Next Steps', duration: '5 min', talking_points: ['Timeline', 'Decision makers', 'Follow-up'] }
      ]
    },
    { 
      id: 2, 
      name: 'Demo Playbook', 
      stage: 'Demo',
      steps: [
        { step: 1, title: 'Agenda Setting', duration: '3 min', talking_points: ['Objectives', 'Time allocation'] },
        { step: 2, title: 'Feature Walkthrough', duration: '20 min', talking_points: ['Key features', 'Use cases', 'Q&A'] },
        { step: 3, title: 'ROI Discussion', duration: '10 min', talking_points: ['Value proposition', 'Cost savings'] },
        { step: 4, title: 'Close', duration: '7 min', talking_points: ['Trial offer', 'Next meeting'] }
      ]
    },
    { 
      id: 3, 
      name: 'Negotiation Playbook', 
      stage: 'Negotiation',
      steps: [
        { step: 1, title: 'Anchor High', duration: '5 min', talking_points: ['Full price value', 'Premium features'] },
        { step: 2, title: 'Handle Objections', duration: '15 min', talking_points: ['Budget concerns', 'Competitor comparison'] },
        { step: 3, title: 'Offer Concessions', duration: '10 min', talking_points: ['Volume discounts', 'Payment terms'] },
        { step: 4, title: 'Close Deal', duration: '10 min', talking_points: ['Sign contract', 'Kick-off date'] }
      ]
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Book className="text-primary-500" size={20} />
          <CardTitle>Sales Playbooks</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step guides for every deal stage</p>
      </CardHeader>
      <CardContent>
        {!selectedPlaybook ? (
          <div className="grid grid-cols-3 gap-4">
            {playbooks.map((playbook) => (
              <div 
                key={playbook.id}
                onClick={() => setSelectedPlaybook(playbook)}
                className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 cursor-pointer transition-all"
              >
                <div className="text-4xl mb-3">📖</div>
                <p className="font-bold text-sm mb-1">{playbook.name}</p>
                <Badge variant="secondary" className="text-xs">{playbook.stage}</Badge>
                <p className="text-xs text-gray-600 mt-2">{playbook.steps.length} steps</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{selectedPlaybook.name}</h3>
              <Button size="sm" variant="outline" onClick={() => setSelectedPlaybook(null)}>
                Back
              </Button>
            </div>
            
            <div className="space-y-3">
              {selectedPlaybook.steps.map((step) => (
                <div key={step.step} className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Step {step.step}</p>
                      <p className="font-bold">{step.title}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{step.duration}</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">Talking Points:</p>
                  <ul className="text-sm space-y-1">
                    {step.talking_points.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// BATTLE CARDS
export const BattleCards = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [competitors] = useState([
    {
      id: 1,
      name: 'Outreach',
      logo: '🎯',
      strengths: ['Market leader', 'Enterprise features', 'Large customer base'],
      weaknesses: ['Expensive', 'Complex setup', 'Poor deliverability'],
      how_to_win: [
        'Emphasize our AI-powered personalization (Ava)',
        'Highlight 10x faster setup time',
        'Show deliverability comparison (98% vs 78%)',
        'Mention 60% lower cost'
      ],
      pricing: '$100/user/month',
      our_advantage: 'AI BDR + Better Deliverability + Lower Cost'
    },
    {
      id: 2,
      name: 'Apollo',
      logo: '🚀',
      strengths: ['Large database', 'All-in-one platform', 'Good pricing'],
      weaknesses: ['Limited AI', 'Manual workflows', 'Basic email features'],
      how_to_win: [
        'Demo Ava\'s AI capabilities vs their manual process',
        'Show personalization waterfall',
        'Highlight our deliverability tools',
        'Compare time savings (80% automation)'
      ],
      pricing: '$49/user/month',
      our_advantage: 'Advanced AI Automation + Deliverability Management'
    },
    {
      id: 3,
      name: 'SalesLoft',
      logo: '📊',
      strengths: ['Sales engagement leader', 'Good analytics', 'Coaching features'],
      weaknesses: ['Very expensive', 'Requires training', 'No AI BDR'],
      how_to_win: [
        'Position Ava as their virtual SDR team',
        'Show ROI: 1 Ava = 5 SDRs at 1/10th cost',
        'Demo self-optimization features',
        'Faster time to value (days vs months)'
      ],
      pricing: '$125/user/month',
      our_advantage: 'AI BDR Replaces SDR Headcount'
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          <CardTitle>Competitor Battle Cards</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">How to beat the competition</p>
      </CardHeader>
      <CardContent>
        {!selectedCompetitor ? (
          <div className="grid grid-cols-3 gap-4">
            {competitors.map((competitor) => (
              <div 
                key={competitor.id}
                onClick={() => setSelectedCompetitor(competitor)}
                className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-500 cursor-pointer transition-all"
              >
                <div className="text-5xl mb-3">{competitor.logo}</div>
                <p className="font-bold mb-2">{competitor.name}</p>
                <Badge variant="secondary" className="text-xs">{competitor.pricing}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCompetitor.logo}</span>
                <h3 className="text-xl font-bold">{selectedCompetitor.name}</h3>
              </div>
              <Button size="sm" variant="outline" onClick={() => setSelectedCompetitor(null)}>
                Back
              </Button>
            </div>

            <div className="space-y-4">
              {/* Our Advantage */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">🏆 OUR ADVANTAGE</p>
                <p className="font-bold">{selectedCompetitor.our_advantage}</p>
              </div>

              {/* Strengths */}
              <div>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  Their Strengths
                </p>
                <div className="space-y-1">
                  {selectedCompetitor.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <CheckCircle size={14} className="text-blue-600" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Target size={16} className="text-red-600" />
                  Their Weaknesses (Attack Here!)
                </p>
                <div className="space-y-1">
                  {selectedCompetitor.weaknesses.map((weakness, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <XCircle size={14} className="text-red-600" />
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Win */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <p className="font-bold mb-3">🎯 How to Win This Deal</p>
                <ol className="space-y-2">
                  {selectedCompetitor.how_to_win.map((tactic, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="font-bold text-purple-600">{idx + 1}.</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// OBJECTION HANDLERS
export const ObjectionHandlers = () => {
  const [objections] = useState([
    {
      objection: "It's too expensive",
      category: 'Price',
      responses: [
        { approach: 'ROI Focus', response: 'I understand budget is important. Our customers typically see 10x ROI in the first quarter. Let me show you how Ava replaces 5 SDRs at 1/10th the cost.' },
        { approach: 'Value Comparison', response: 'Compared to hiring an SDR ($60K salary + benefits), Ava costs less than $10K/year and works 24/7 without vacation.' },
        { approach: 'Cost of Inaction', response: 'What\'s the cost of your sales team spending 80% of their time on manual outreach instead of closing deals?' }
      ]
    },
    {
      objection: "We're already using [competitor]",
      category: 'Competition',
      responses: [
        { approach: 'Add-On Value', response: 'Great! Many customers use us alongside [competitor]. Ava handles the entire top-of-funnel while your team focuses on closing. Would you like to see a side-by-side comparison?' },
        { approach: 'Pain Point', response: 'What made you choose them initially? Are there any areas where they\'re falling short? I\'d love to show you how Ava specifically addresses those gaps.' },
        { approach: 'Migration Ease', response: 'We make migration seamless - most customers are up and running in 2 days with better results than their previous tool.' }
      ]
    },
    {
      objection: "We need to think about it",
      category: 'Timing',
      responses: [
        { approach: 'Uncover Real Objection', response: 'Absolutely, this is an important decision. To help you think through it, what specific areas do you need more clarity on?' },
        { approach: 'Create Urgency', response: 'I completely understand. Just so you know, we have 50 spots left for our onboarding this quarter. After that, there\'s a 6-week waitlist. When were you hoping to see results?' },
        { approach: 'Next Steps', response: 'Makes sense. How about we schedule a quick 15-min call next week after you\'ve had time to discuss internally? I can answer any questions that come up.' }
      ]
    },
    {
      objection: "AI can't do human work",
      category: 'Product Doubt',
      responses: [
        { approach: 'Show Results', response: 'I hear you - skepticism about AI is valid. That\'s why we offer a 2-week trial. Our customers see 31% response rates vs 8% industry average. Ava handles research and personalization; humans close deals.' },
        { approach: 'Hybrid Approach', response: 'You\'re right - AI shouldn\'t replace humans entirely. Ava handles the repetitive 80% (research, email writing, follow-ups) so your team focuses on the high-value 20% (calls, demos, closing).' },
        { approach: 'Social Proof', response: 'I understand the concern. That\'s what [Customer Name] said before trying Ava. Now they\'ve 3x\'d their pipeline with the same team size. Want to see their case study?' }
      ]
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>Objection Handlers</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">When they say X, respond with Y</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {objections.map((obj, idx) => (
            <div key={idx} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="warning" className="text-xs mb-2">{obj.category}</Badge>
                  <p className="font-bold text-lg">"{obj.objection}"</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {obj.responses.map((response, ridx) => (
                  <div key={ridx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                      {response.approach}
                    </p>
                    <p className="text-sm">{response.response}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ROI CALCULATOR
export const ROICalculator = () => {
  const [inputs, setInputs] = useState({
    sdrs: 5,
    sdrSalary: 60000,
    artisanCost: 10000,
    responseRateIncrease: 3,
    timeSavings: 80
  });

  const calculations = {
    currentSDRCost: inputs.sdrs * inputs.sdrSalary,
    artisanTotalCost: inputs.artisanCost,
    savings: (inputs.sdrs * inputs.sdrSalary) - inputs.artisanCost,
    roi: Math.round(((inputs.sdrs * inputs.sdrSalary - inputs.artisanCost) / inputs.artisanCost) * 100),
    additionalRevenue: inputs.responseRateIncrease * 50000,
    timeRecovered: Math.round((inputs.timeSavings / 100) * 40 * 52 * inputs.sdrs)
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="text-primary-500" size={20} />
          <CardTitle>ROI Calculator</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Show prospects their ROI in real-time</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Number of SDRs</label>
              <Input 
                type="number" 
                value={inputs.sdrs}
                onChange={(e) => setInputs({...inputs, sdrs: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Avg SDR Salary</label>
              <Input 
                type="number" 
                value={inputs.sdrSalary}
                onChange={(e) => setInputs({...inputs, sdrSalary: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Artisan Annual Cost</label>
              <Input 
                type="number" 
                value={inputs.artisanCost}
                onChange={(e) => setInputs({...inputs, artisanCost: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Response Rate Increase (x)</label>
              <Input 
                type="number" 
                value={inputs.responseRateIncrease}
                onChange={(e) => setInputs({...inputs, responseRateIncrease: parseInt(e.target.value)})}
              />
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white mb-4">
              <p className="text-sm opacity-90 mb-1">Total Annual Savings</p>
              <p className="text-5xl font-bold">${(calculations.savings / 1000).toFixed(0)}K</p>
              <p className="text-sm opacity-90 mt-2">ROI: {calculations.roi}%</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Current SDR Cost</p>
                <p className="text-2xl font-bold text-blue-600">${(calculations.currentSDRCost / 1000).toFixed(0)}K/yr</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Artisan Cost</p>
                <p className="text-2xl font-bold text-purple-600">${(calculations.artisanTotalCost / 1000).toFixed(0)}K/yr</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Additional Revenue (Pipeline)</p>
                <p className="text-2xl font-bold text-green-600">${(calculations.additionalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Time Recovered (hours/year)</p>
                <p className="text-2xl font-bold text-orange-600">{calculations.timeRecovered.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Autonomous BDR Features - Advanced Ava Capabilities
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Bot,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

// AUTONOMOUS PROSPECT RESEARCHER
export const AutonomousProspectResearcher = () => {
  const [researching] = useState(true);
  const [researchQueue] = useState([
    {
      company: 'Acme Corp',
      prospect: 'John Doe, VP Sales',
      status: 'researching',
      progress: 75,
      dataPoints: 12,
      intent: 'high',
    },
    {
      company: 'Tech Innovations',
      prospect: 'Sarah Chen, CRO',
      status: 'completed',
      progress: 100,
      dataPoints: 18,
      intent: 'very-high',
    },
    {
      company: 'StartupXYZ',
      prospect: 'Mike Johnson, CEO',
      status: 'queued',
      progress: 0,
      dataPoints: 0,
      intent: 'unknown',
    },
  ]);

  const [insights] = useState({
    totalResearched: 247,
    avgDataPoints: 15,
    highIntentFound: 89,
    autoEmailsGenerated: 247,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-purple-500" size={20} />
            <CardTitle>Autonomous Research Engine</CardTitle>
          </div>
          <Badge variant={researching ? 'success' : 'secondary'} className="gap-1">
            {researching && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            {researching ? 'Researching' : 'Idle'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava researches prospects 24/7 without human input
        </p>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-600">{insights.totalResearched}</p>
            <p className="text-xs text-gray-600">Researched Today</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-600">{insights.avgDataPoints}</p>
            <p className="text-xs text-gray-600">Avg Data Points</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">{insights.highIntentFound}</p>
            <p className="text-xs text-gray-600">High Intent</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-orange-600">{insights.autoEmailsGenerated}</p>
            <p className="text-xs text-gray-600">Emails Generated</p>
          </div>
        </div>

        {/* Research Queue */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Active Research Queue
          </h4>
          {researchQueue.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{item.prospect}</p>
                  <p className="text-xs text-gray-600">{item.company}</p>
                </div>
                <Badge
                  variant={
                    item.status === 'completed'
                      ? 'success'
                      : item.status === 'researching'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {item.status === 'completed' ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : item.status === 'researching' ? (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-1" />
                  ) : (
                    <Clock size={12} className="mr-1" />
                  )}
                  {item.status}
                </Badge>
              </div>

              {/* Progress Bar */}
              {item.progress > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Research Progress</span>
                    <span className="font-semibold">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Data Points & Intent */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">📊 {item.dataPoints} data points collected</span>
                {item.intent !== 'unknown' && (
                  <Badge
                    variant={
                      item.intent === 'very-high' || item.intent === 'high' ? 'danger' : 'secondary'
                    }
                    className="text-xs"
                  >
                    🔥 {item.intent} intent
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Auto-Research Settings */}
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            Research Sources (Auto-Enabled)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>LinkedIn Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Twitter/X Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Funding News</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Job Changes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Company Hiring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Tech Stack</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// OBJECTION HANDLER
export const ObjectionHandler = () => {
  const [objections] = useState([
    {
      from: 'john@acme.com',
      objection: "We're happy with our current solution",
      category: 'status-quo',
      avaResponse:
        'I completely understand - many of our best customers felt the same way before seeing how we complement existing tools. Would you be open to a 10-minute call to discuss how we integrate with [current solution]?',
      status: 'auto-sent',
      confidence: 92,
      result: 'positive-reply',
    },
    {
      from: 'sarah@tech.co',
      objection: 'Too expensive for us right now',
      category: 'pricing',
      avaResponse:
        'I hear you on budget concerns. Many teams start with our Starter plan at $49/user to prove ROI first. Would it help to see a breakdown of typical payback periods for teams your size?',
      status: 'auto-sent',
      confidence: 88,
      result: 'pending',
    },
    {
      from: 'mike@startup.io',
      objection: 'Send me more information',
      category: 'stalling',
      avaResponse:
        'Absolutely! Rather than overwhelming your inbox, I can walk you through the 3 features most relevant to [specific pain point] in a quick 15-min demo. Does Tuesday or Wednesday work better?',
      status: 'awaiting-approval',
      confidence: 76,
      result: 'pending',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-blue-500" size={20} />
          <CardTitle>Autonomous Objection Handling</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava automatically responds to common objections
        </p>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-600">42</p>
            <p className="text-xs text-gray-600">Handled Today</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">31</p>
            <p className="text-xs text-gray-600">Auto-Resolved</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-600">74%</p>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>
        </div>

        {/* Objections List */}
        <div className="space-y-3">
          {objections.map((obj, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{obj.from}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {obj.category}
                  </Badge>
                </div>
                <Badge
                  variant={
                    obj.status === 'auto-sent'
                      ? 'success'
                      : obj.status === 'awaiting-approval'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {obj.status}
                </Badge>
              </div>

              {/* Original Objection */}
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                  ❌ Objection:
                </p>
                <p className="text-sm">"{obj.objection}"</p>
              </div>

              {/* Ava's Response */}
              <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                    ✅ Ava's Response:
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {obj.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm">"{obj.avaResponse}"</p>
              </div>

              {/* Actions */}
              {obj.status === 'awaiting-approval' ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="success" className="flex-1">
                    Approve & Send
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              ) : obj.result === 'positive-reply' ? (
                <Badge variant="success" className="w-full justify-center">
                  <CheckCircle size={14} className="mr-1" />
                  Got positive reply!
                </Badge>
              ) : (
                <Badge variant="secondary" className="w-full justify-center">
                  <Clock size={14} className="mr-1" />
                  Awaiting response...
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Learning Notice */}
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
            🧠 Ava learns from your feedback
          </p>
          <p className="text-xs text-gray-600">
            Every approved/rejected response trains Ava to handle objections better. Current success
            rate: 74%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// AUTONOMOUS MEETING BOOKER
export const AutonomousMeetingBooker = () => {
  const [meetings] = useState([
    {
      prospect: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      status: 'meeting-booked',
      scheduledFor: '2024-01-20 at 2:00 PM EST',
      conversationSteps: 5,
      avaHandled: true,
    },
    {
      prospect: 'Sarah Chen',
      company: 'Tech Co',
      email: 'sarah@tech.co',
      status: 'proposing-times',
      conversationSteps: 3,
      avaHandled: true,
    },
    {
      prospect: 'Mike Johnson',
      company: 'Startup Inc',
      email: 'mike@startup.io',
      status: 'confirmed',
      scheduledFor: '2024-01-22 at 10:00 AM EST',
      conversationSteps: 4,
      avaHandled: true,
      handedOff: true,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-green-500" size={20} />
          <CardTitle>Autonomous Meeting Booking</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava handles scheduling back-and-forth automatically
        </p>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">12</p>
            <p className="text-xs text-gray-600">Booked This Week</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-600">5</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-600">0</p>
            <p className="text-xs text-gray-600">Human Input Needed</p>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-3">
          {meetings.map((meeting, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{meeting.prospect}</p>
                  <p className="text-xs text-gray-600">
                    {meeting.company} • {meeting.email}
                  </p>
                </div>
                <Badge
                  variant={
                    meeting.status === 'meeting-booked' || meeting.status === 'confirmed'
                      ? 'success'
                      : meeting.status === 'proposing-times'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {meeting.status === 'meeting-booked' ? (
                    <Calendar size={12} className="mr-1" />
                  ) : meeting.status === 'confirmed' ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <Clock size={12} className="mr-1" />
                  )}
                  {meeting.status.replace('-', ' ')}
                </Badge>
              </div>

              {meeting.scheduledFor && (
                <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-800">
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                    📅 {meeting.scheduledFor}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {meeting.conversationSteps} exchange{meeting.conversationSteps > 1 ? 's' : ''}
                  </Badge>
                  {meeting.avaHandled && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Bot size={10} />
                      100% Auto
                    </Badge>
                  )}
                </div>
                {meeting.handedOff && (
                  <Badge variant="success" className="text-xs">
                    ✓ Handed to sales
                  </Badge>
                )}
              </div>

              {!meeting.handedOff && meeting.status === 'confirmed' && (
                <Button size="sm" className="w-full mt-3">
                  View Meeting Details
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Calendar Sync Info */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            Calendar Integration
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Connected to Google Calendar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Availability automatically checked</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Meeting reminders sent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// AUTONOMOUS FOLLOW-UP ENGINE
export const AutonomousFollowUpEngine = () => {
  const [followUps] = useState([
    {
      prospect: 'John Doe',
      company: 'Acme Corp',
      lastTouch: '3 days ago',
      nextAction: 'Send follow-up #2',
      scheduledFor: 'Tomorrow at 9:00 AM',
      reason: 'No reply to first email',
      avaStrategy: 'Different angle: mention recent funding',
    },
    {
      prospect: 'Sarah Chen',
      company: 'Tech Co',
      lastTouch: '1 week ago',
      nextAction: 'LinkedIn connection + InMail',
      scheduledFor: 'Today at 2:00 PM',
      reason: 'Email opened but no reply',
      avaStrategy: 'Multi-channel: try LinkedIn',
    },
    {
      prospect: 'Mike Johnson',
      company: 'Startup Inc',
      lastTouch: '2 days ago',
      nextAction: 'Value-add touchpoint',
      scheduledFor: 'Tomorrow at 11:00 AM',
      reason: 'Positive reply, nurturing',
      avaStrategy: 'Share relevant case study',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-orange-500" size={20} />
          <CardTitle>Autonomous Follow-Up Engine</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Ava never lets leads go cold</p>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-orange-600">89</p>
            <p className="text-xs text-gray-600">Active Follow-Ups</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">34</p>
            <p className="text-xs text-gray-600">Reactivated</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-600">Scheduled Today</p>
          </div>
        </div>

        {/* Follow-Ups List */}
        <div className="space-y-3">
          {followUps.map((followUp, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{followUp.prospect}</p>
                  <p className="text-xs text-gray-600">{followUp.company}</p>
                </div>
                <Badge variant="warning" className="text-xs">
                  <Clock size={12} className="mr-1" />
                  {followUp.scheduledFor}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Last touch:</span>
                  <span className="font-semibold">{followUp.lastTouch}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-semibold">{followUp.reason}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                  🎯 Ava's Strategy:
                </p>
                <p className="text-xs text-gray-600">{followUp.avaStrategy}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Bot size={10} />
                  Auto-sending
                </Badge>
                <Button size="sm" variant="outline">
                  Review Draft
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Strategy Info */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            Ava's Follow-Up Intelligence
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ Varies timing based on prospect behavior</li>
            <li>✓ Changes channel if email isn't working</li>
            <li>✓ Adjusts messaging angle for each follow-up</li>
            <li>✓ Knows when to pause and when to persist</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  AutonomousProspectResearcher,
  ObjectionHandler,
  AutonomousMeetingBooker,
  AutonomousFollowUpEngine,
};

import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  Settings,
  Plus,
  Play,
  CheckCircle,
} from 'lucide-react';

const MultiChannelCampaigns = () => {
  const [activeChannel, setActiveChannel] = useState('email');
  const [campaignSteps, setCampaignSteps] = useState([
    {
      id: 1,
      channel: 'email',
      delay: 0,
      subject: 'Introduction',
      content: 'Hi {{firstName}}...',
      status: 'active',
    },
    {
      id: 2,
      channel: 'linkedin',
      delay: 3,
      content: 'Connect request with note',
      status: 'active',
    },
    {
      id: 3,
      channel: 'email',
      delay: 5,
      subject: 'Follow-up',
      content: 'Checking back...',
      status: 'active',
    },
    { id: 4, channel: 'phone', delay: 7, script: 'Cold call script', status: 'active' },
    { id: 5, channel: 'sms', delay: 10, content: 'Quick text follow-up', status: 'fallback' },
  ]);

  const channels = [
    { id: 'email', name: 'Email', icon: <Mail size={20} />, color: 'blue', active: 1247 },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'blue', active: 389 },
    { id: 'sms', name: 'SMS', icon: <MessageSquare size={20} />, color: 'green', active: 156 },
    { id: 'phone', name: 'Phone', icon: <Phone size={20} />, color: 'purple', active: 89 },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageSquare size={20} />,
      color: 'green',
      active: 42,
    },
  ];

  const channelStats = {
    email: { sent: 12847, opened: 3156, replied: 428, booked: 47 },
    linkedin: { sent: 3891, connected: 1247, replied: 189, booked: 23 },
    sms: { sent: 1567, replied: 234, booked: 12 },
    phone: { calls: 892, connected: 267, meetings: 34 },
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Multi-Channel Campaigns
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Orchestrate email, LinkedIn, SMS, and calls in intelligent sequences
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            Create Campaign
          </Button>
        </div>

        {/* Channel Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {channels.map(channel => (
            <Card key={channel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 bg-${channel.color}-50 dark:bg-${channel.color}-900/20 rounded-xl flex items-center justify-center mb-3`}
                >
                  {channel.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{channel.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{channel.active}</p>
                <p className="text-xs text-gray-600">active sequences</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaign Builder */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sequence Steps */}
          <div className="col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Campaign Sequence</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus size={14} className="mr-1" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignSteps.map((step, idx) => (
                    <div key={step.id} className="relative">
                      {/* Connection Line */}
                      {idx < campaignSteps.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300 dark:bg-gray-700"></div>
                      )}

                      <div className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50">
                        {/* Step Number */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="gap-1">
                              {step.channel === 'email' && <Mail size={12} />}
                              {step.channel === 'linkedin' && <Linkedin size={12} />}
                              {step.channel === 'phone' && <Phone size={12} />}
                              {step.channel === 'sms' && <MessageSquare size={12} />}
                              {step.channel.toUpperCase()}
                            </Badge>
                            {step.delay > 0 && (
                              <Badge variant="outline" className="gap-1">
                                <Clock size={12} />
                                Wait {step.delay} days
                              </Badge>
                            )}
                            {step.status === 'fallback' && (
                              <Badge variant="warning">Fallback if no reply</Badge>
                            )}
                          </div>

                          {step.channel === 'email' && (
                            <>
                              <p className="font-semibold text-sm mb-1">Subject: {step.subject}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {step.content}
                              </p>
                            </>
                          )}
                          {step.channel === 'linkedin' && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {step.content}
                            </p>
                          )}
                          {step.channel === 'phone' && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              📞 {step.script}
                            </p>
                          )}
                          {step.channel === 'sms' && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              💬 {step.content}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Smart Routing */}
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Zap size={16} className="text-purple-500" />
                    Smart Channel Routing
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>If no email reply in 3 days → try LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>If LinkedIn not connected → fallback to SMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Phone calls scheduled for best time per prospect timezone</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Performance */}
          <div className="col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Email Stats */}
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-blue-500" />
                      <span className="font-semibold text-sm">Email</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Sent:</span>{' '}
                        <span className="font-bold">{channelStats.email.sent}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Opened:</span>{' '}
                        <span className="font-bold">{channelStats.email.opened}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Replied:</span>{' '}
                        <span className="font-bold text-green-600">
                          {channelStats.email.replied}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Booked:</span>{' '}
                        <span className="font-bold text-purple-600">
                          {channelStats.email.booked}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Stats */}
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Linkedin size={16} className="text-blue-600" />
                      <span className="font-semibold text-sm">LinkedIn</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Sent:</span>{' '}
                        <span className="font-bold">{channelStats.linkedin.sent}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Connected:</span>{' '}
                        <span className="font-bold">{channelStats.linkedin.connected}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Replied:</span>{' '}
                        <span className="font-bold text-green-600">
                          {channelStats.linkedin.replied}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Booked:</span>{' '}
                        <span className="font-bold text-purple-600">
                          {channelStats.linkedin.booked}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SMS Stats */}
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-green-500" />
                      <span className="font-semibold text-sm">SMS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Sent:</span>{' '}
                        <span className="font-bold">{channelStats.sms.sent}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Replied:</span>{' '}
                        <span className="font-bold text-green-600">{channelStats.sms.replied}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Booked:</span>{' '}
                        <span className="font-bold text-purple-600">{channelStats.sms.booked}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Stats */}
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={16} className="text-purple-500" />
                      <span className="font-semibold text-sm">Phone</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Calls:</span>{' '}
                        <span className="font-bold">{channelStats.phone.calls}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Connected:</span>{' '}
                        <span className="font-bold">{channelStats.phone.connected}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Meetings:</span>{' '}
                        <span className="font-bold text-purple-600">
                          {channelStats.phone.meetings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimal Timing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp size={16} />
                  Optimal Send Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">Tues-Thurs, 9-11 AM EST</p>
                  </div>
                  <div>
                    <p className="font-semibold">LinkedIn</p>
                    <p className="text-gray-600">Mon-Wed, 7-9 AM EST</p>
                  </div>
                  <div>
                    <p className="font-semibold">SMS</p>
                    <p className="text-gray-600">Any day, 10 AM - 5 PM local</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">Wed-Fri, 2-4 PM prospect time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MultiChannelCampaigns;

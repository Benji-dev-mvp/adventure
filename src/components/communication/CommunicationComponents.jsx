// Communication Channels Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Linkedin,
  MessageSquare,
  Phone,
  Mail as MailIcon,
  Video,
  Bot,
  TrendingUp,
} from 'lucide-react';

export const LinkedInAutomation = () => {
  const [campaigns, setCampaigns] = useState([
    { name: 'CTOs Outreach', connections: 45, messages: 38, replies: 12, status: 'active' },
    { name: 'Enterprise VPs', connections: 28, messages: 24, replies: 8, status: 'active' },
    { name: 'Tech Leads', connections: 67, messages: 52, replies: 15, status: 'paused' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Linkedin className="text-primary-500" size={20} />
          <CardTitle>LinkedIn Automation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{campaign.name}</h4>
                <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Connections</p>
                  <p className="font-bold">{campaign.connections}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Messages</p>
                  <p className="font-bold">{campaign.messages}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Replies</p>
                  <p className="font-bold text-green-600">{campaign.replies}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create LinkedIn Campaign</Button>
      </CardContent>
    </Card>
  );
};

export const SMSCampaigns = () => {
  const [campaigns, setCampaigns] = useState([
    { name: 'Event Reminders', sent: 234, delivered: 229, replies: 45, cost: '$23.40' },
    { name: 'Follow-up Texts', sent: 156, delivered: 152, replies: 28, cost: '$15.60' },
    { name: 'Demo Confirmations', sent: 89, delivered: 87, replies: 34, cost: '$8.90' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>SMS Campaigns</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-sm">{campaign.name}</h4>
                <span className="text-sm font-bold text-primary-600">{campaign.cost}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-600">Sent</p>
                  <p className="font-bold">{campaign.sent}</p>
                </div>
                <div>
                  <p className="text-gray-600">Delivered</p>
                  <p className="font-bold">{campaign.delivered}</p>
                </div>
                <div>
                  <p className="text-gray-600">Replies</p>
                  <p className="font-bold text-green-600">{campaign.replies}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create SMS Campaign</Button>
      </CardContent>
    </Card>
  );
};

export const WhatsAppIntegration = () => {
  const [stats, setStats] = useState({
    connected: true,
    conversations: 45,
    messagesThisWeek: 234,
    responseRate: 82,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>WhatsApp Business Integration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="success">✓ Connected</Badge>
              <span className="text-sm">WhatsApp Business API</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-2xl font-bold">{stats.conversations}</p>
              <p className="text-xs text-gray-600">Active Chats</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-2xl font-bold">{stats.messagesThisWeek}</p>
              <p className="text-xs text-gray-600">This Week</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.responseRate}%</p>
              <p className="text-xs text-gray-600">Response Rate</p>
            </div>
          </div>

          <Button className="w-full">Open WhatsApp Inbox</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const DirectMailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([
    { name: 'Holiday Cards', sent: 150, delivered: 145, cost: '$450', status: 'delivered' },
    { name: 'Product Brochures', sent: 75, delivered: 72, cost: '$375', status: 'in-transit' },
    { name: 'Gift Packages', sent: 25, delivered: 0, cost: '$625', status: 'processing' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MailIcon className="text-primary-500" size={20} />
          <CardTitle>Direct Mail Campaigns</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{campaign.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {campaign.sent} sent • {campaign.delivered} delivered
                  </p>
                </div>
                <Badge
                  variant={
                    campaign.status === 'delivered'
                      ? 'success'
                      : campaign.status === 'in-transit'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary-600">{campaign.cost}</span>
                <Button size="sm" variant="outline">
                  Track
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create Mail Campaign</Button>
      </CardContent>
    </Card>
  );
};

export const VoicemailDrops = () => {
  const [templates, setTemplates] = useState([
    { name: 'Introduction', duration: '32s', used: 245, responseRate: 8 },
    { name: 'Follow-up', duration: '28s', used: 189, responseRate: 12 },
    { name: 'Event Invite', duration: '40s', used: 78, responseRate: 15 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Phone className="text-primary-500" size={20} />
          <CardTitle>Voicemail Drops</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">Duration: {template.duration}</p>
                </div>
                <Badge variant="secondary">{template.used} drops</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  Response: <strong className="text-green-600">{template.responseRate}%</strong>
                </span>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Record New Template</Button>
      </CardContent>
    </Card>
  );
};

export const VideoMessages = () => {
  const [videos, setVideos] = useState([
    { name: 'Personal Intro', views: 34, clickRate: 78, avgWatch: '85%' },
    { name: 'Product Demo', views: 56, clickRate: 92, avgWatch: '72%' },
    { name: 'Thank You', views: 23, clickRate: 100, avgWatch: '95%' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="text-primary-500" size={20} />
          <CardTitle>Personalized Video Messages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos.map((video, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm mb-3">{video.name}</h4>
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p className="text-gray-600">Views</p>
                  <p className="font-bold">{video.views}</p>
                </div>
                <div>
                  <p className="text-gray-600">Click Rate</p>
                  <p className="font-bold text-blue-600">{video.clickRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Watch</p>
                  <p className="font-bold text-green-600">{video.avgWatch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Record Video</Button>
      </CardContent>
    </Card>
  );
};

export const ChatbotBuilder = () => {
  const [bots, setBots] = useState([
    { name: 'Lead Qualifier', conversations: 234, qualified: 67, active: true },
    { name: 'FAQ Bot', conversations: 456, qualified: 0, active: true },
    { name: 'Demo Scheduler', conversations: 89, qualified: 34, active: false },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="text-primary-500" size={20} />
          <CardTitle>Chatbot Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bots.map((bot, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{bot.name}</h4>
                <Badge variant={bot.active ? 'success' : 'secondary'}>
                  {bot.active ? 'Live' : 'Paused'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Conversations</p>
                  <p className="font-bold">{bot.conversations}</p>
                </div>
                {bot.qualified > 0 && (
                  <div>
                    <p className="text-gray-600 text-xs">Qualified</p>
                    <p className="font-bold text-green-600">{bot.qualified}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create Chatbot</Button>
      </CardContent>
    </Card>
  );
};

export const SocialMediaMonitor = () => {
  const [mentions, setMentions] = useState([
    { platform: 'Twitter', mentions: 45, sentiment: 'positive', engagement: 234 },
    { platform: 'LinkedIn', mentions: 78, sentiment: 'positive', engagement: 567 },
    { platform: 'Reddit', mentions: 23, sentiment: 'neutral', engagement: 89 },
    { platform: 'Facebook', mentions: 34, sentiment: 'positive', engagement: 156 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Social Media Monitor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mentions.map((mention, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{mention.platform}</h4>
                <Badge
                  variant={
                    mention.sentiment === 'positive'
                      ? 'success'
                      : mention.sentiment === 'neutral'
                        ? 'warning'
                        : 'error'
                  }
                >
                  {mention.sentiment}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="text-gray-600">Mentions</p>
                  <p className="font-bold">{mention.mentions}</p>
                </div>
                <div>
                  <p className="text-gray-600">Engagement</p>
                  <p className="font-bold">{mention.engagement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          View All Mentions
        </Button>
      </CardContent>
    </Card>
  );
};

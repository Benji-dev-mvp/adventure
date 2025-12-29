import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import {
  Search,
  Book,
  Video,
  MessageCircle,
  FileText,
  Zap,
  Mail,
  Users,
  Settings,
  BarChart,
  Bot,
  ChevronRight,
  ExternalLink,
  Play,
  CheckCircle,
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: <Book size={16} /> },
    { id: 'getting-started', label: 'Getting Started', icon: <Zap size={16} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Mail size={16} /> },
    { id: 'ava', label: 'Ava AI', icon: <Bot size={16} /> },
    { id: 'leads', label: 'Leads & Data', icon: <Users size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Settings size={16} /> },
  ];

  const articles = [
    {
      category: 'getting-started',
      title: 'Welcome to Artisan - Quick Start Guide',
      description: 'Get up and running in 5 minutes with Ava, your AI BDR',
      views: 12543,
      readTime: '5 min',
      featured: true,
      icon: <Zap />,
    },
    {
      category: 'getting-started',
      title: 'Connecting Your First Mailbox',
      description: 'Step-by-step guide to connect Gmail, Outlook, or custom SMTP',
      views: 8921,
      readTime: '3 min',
      featured: true,
      icon: <Mail />,
    },
    {
      category: 'getting-started',
      title: 'Defining Your Ideal Customer Profile (ICP)',
      description: 'Help Ava understand your target audience for better prospecting',
      views: 7654,
      readTime: '4 min',
      featured: true,
      icon: <Users />,
    },
    {
      category: 'ava',
      title: 'How Ava Finds & Researches Prospects Automatically',
      description: 'Learn how Ava uses 300+ data sources to build hyper-personalized outreach',
      views: 9876,
      readTime: '6 min',
      featured: true,
      icon: <Bot />,
    },
    {
      category: 'ava',
      title: "Understanding Ava's Personalization Waterfall",
      description: 'Job changes, funding, social activity - how Ava prioritizes personalization',
      views: 6543,
      readTime: '5 min',
      icon: <Bot />,
    },
    {
      category: 'ava',
      title: 'Training Ava to Match Your Brand Voice',
      description: 'Customize tone, style, and messaging to sound like your team',
      views: 5432,
      readTime: '4 min',
      icon: <Bot />,
    },
    {
      category: 'campaigns',
      title: 'Creating Your First Multi-Channel Campaign',
      description: 'Email, LinkedIn, SMS, calls - orchestrate across all channels',
      views: 11234,
      readTime: '7 min',
      icon: <Mail />,
    },
    {
      category: 'campaigns',
      title: 'Email Deliverability & Warmup Best Practices',
      description: "Ensure your emails land in inboxes, not spam. Ava's automatic warmup explained",
      views: 8765,
      readTime: '6 min',
      icon: <Mail />,
    },
    {
      category: 'campaigns',
      title: 'A/B Testing Subject Lines & Content',
      description: 'Let Ava automatically test variations and optimize for replies',
      views: 7234,
      readTime: '5 min',
      icon: <BarChart />,
    },
    {
      category: 'campaigns',
      title: 'Optimal Send Times & Frequency Settings',
      description: 'When and how often should you reach out? Data-driven recommendations',
      views: 6123,
      readTime: '4 min',
      icon: <Settings />,
    },
    {
      category: 'leads',
      title: 'Searching the 300M+ B2B Contact Database',
      description: 'Advanced filters: firmographics, technographics, intent signals',
      views: 9543,
      readTime: '6 min',
      icon: <Users />,
    },
    {
      category: 'leads',
      title: 'Understanding Lead Scoring & Intent Signals',
      description: 'How Ava identifies high-intent prospects ready to buy',
      views: 7876,
      readTime: '5 min',
      icon: <Users />,
    },
    {
      category: 'leads',
      title: 'Importing & Enriching Your Existing Contacts',
      description: 'Upload CSVs and let Ava automatically enrich with fresh data',
      views: 6789,
      readTime: '4 min',
      icon: <FileText />,
    },
    {
      category: 'analytics',
      title: 'Reading Your Campaign Analytics Dashboard',
      description: 'Open rates, reply rates, meetings booked - what metrics matter',
      views: 8234,
      readTime: '5 min',
      icon: <BarChart />,
    },
    {
      category: 'analytics',
      title: 'Attribution & Conversion Tracking',
      description: 'Track which touchpoints drive meetings and deals',
      views: 5678,
      readTime: '6 min',
      icon: <BarChart />,
    },
    {
      category: 'integrations',
      title: 'CRM Integration: Salesforce, HubSpot, Pipedrive',
      description: 'Two-way sync to keep your CRM and Artisan in perfect harmony',
      views: 10234,
      readTime: '7 min',
      icon: <Settings />,
    },
    {
      category: 'integrations',
      title: 'Calendar Sync for Automated Meeting Booking',
      description: 'Let prospects book meetings directly from your emails',
      views: 7543,
      readTime: '4 min',
      icon: <Settings />,
    },
    {
      category: 'integrations',
      title: 'LinkedIn Sales Navigator Integration',
      description: 'Enrich leads and trigger campaigns based on LinkedIn activity',
      views: 6432,
      readTime: '5 min',
      icon: <Settings />,
    },
  ];

  const videoTutorials = [
    {
      title: 'Artisan Platform Overview (3:24)',
      description: 'Complete walkthrough of Artisan and Ava capabilities',
      thumbnail: '🎥',
      duration: '3:24',
      views: 15234,
    },
    {
      title: 'Setting Up Your First Campaign (5:12)',
      description: 'Watch how to create, personalize, and launch a campaign',
      thumbnail: '🎬',
      duration: '5:12',
      views: 12876,
    },
    {
      title: "How Ava's AI Research Works (4:45)",
      description: 'Behind the scenes: data mining, personalization, intent signals',
      thumbnail: '🤖',
      duration: '4:45',
      views: 11543,
    },
    {
      title: 'Advanced Features: Waterfall Personalization (6:32)',
      description: "Master Ava's multi-layer personalization engine",
      thumbnail: '✨',
      duration: '6:32',
      views: 8765,
    },
  ];

  const commonQuestions = [
    {
      question: 'How does Ava automatically warm up mailboxes?',
      answer:
        'Ava gradually increases sending volume over 2-4 weeks while monitoring deliverability metrics. She adjusts daily limits based on mailbox health to ensure optimal inbox placement.',
    },
    {
      question: 'Can I use my own email copy or must I use AI-generated content?',
      answer:
        'Both! You can write your own emails or let Ava generate them. Most users blend: Ava researches prospects and suggests personalization, you control the core message.',
    },
    {
      question: 'What data sources does Ava use for personalization?',
      answer:
        'Ava monitors 300+ sources including LinkedIn, Twitter/X, Crunchbase, job postings, press releases, company news, funding databases, and tech stack data. She prioritizes the most relevant signals for each prospect.',
    },
    {
      question: 'How does multi-channel orchestration work?',
      answer:
        "Ava coordinates email, LinkedIn, SMS, and calls in intelligent sequences. If a prospect doesn't respond via email, she can automatically try LinkedIn. You set the rules, Ava executes.",
    },
    {
      question: 'Is my data secure and GDPR compliant?',
      answer:
        'Yes. Artisan is SOC 2 Type II certified, GDPR and CCPA compliant. All data is encrypted at rest and in transit. You control data retention and can delete any contact information instantly.',
    },
    {
      question: "What's the difference between Ava and other email automation tools?",
      answer:
        'Traditional tools require manual template writing and prospect research. Ava autonomously finds prospects, researches them, writes personalized emails, handles objections, and books meetings - like having an AI BDR on your team.',
    },
  ];

  const filteredArticles = articles.filter(
    article =>
      (activeCategory === 'all' || article.category === activeCategory) &&
      (searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">👋 How can we help you?</h1>
            <p className="text-lg opacity-90 mb-6">
              Search our help center or browse by topic to get started with Artisan and Ava
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search for articles, features, or how-tos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Book className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Documentation</h3>
                  <p className="text-sm text-gray-600">Complete guides</p>
                </div>
              </div>
              <ChevronRight className="ml-auto text-gray-400" size={20} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Video className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Video Tutorials</h3>
                  <p className="text-sm text-gray-600">Watch & learn</p>
                </div>
              </div>
              <ChevronRight className="ml-auto text-gray-400" size={20} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Live Support</h3>
                  <p className="text-sm text-gray-600">Chat with us</p>
                </div>
              </div>
              <ChevronRight className="ml-auto text-gray-400" size={20} />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Categories */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                          : ''
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="mt-4">
              <CardContent className="p-6">
                <MessageCircle className="text-primary-500 mb-2" size={32} />
                <h3 className="font-bold mb-2">Need more help?</h3>
                <p className="text-sm text-gray-600 mb-4">Our team is here to help you succeed</p>
                <Button variant="primary" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Articles Grid */}
          <div className="col-span-9">
            {/* Featured Articles */}
            {activeCategory === 'all' && searchQuery === '' && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">🔥 Featured Articles</h2>
                <div className="grid grid-cols-2 gap-4">
                  {articles
                    .filter(a => a.featured)
                    .slice(0, 4)
                    .map((article, idx) => (
                      <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              {React.cloneElement(article.icon, {
                                className: 'text-white',
                                size: 20,
                              })}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold mb-1">{article.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {article.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>👁️ {article.views.toLocaleString()} views</span>
                            <span>📖 {article.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">
                {activeCategory === 'all'
                  ? '📚 All Articles'
                  : `📚 ${categories.find(c => c.id === activeCategory)?.label} Articles`}
              </h2>
              <div className="space-y-3">
                {filteredArticles.map((article, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="text-gray-400" size={20} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {article.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-4">
                          <span>{article.readTime}</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            {activeCategory === 'all' && searchQuery === '' && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">🎥 Video Tutorials</h2>
                <div className="grid grid-cols-2 gap-4">
                  {videoTutorials.map((video, idx) => (
                    <Card
                      key={idx}
                      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 h-40 flex items-center justify-center">
                        <span className="text-6xl">{video.thumbnail}</span>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <Play className="text-white" size={48} />
                        </div>
                        <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-sm mb-1">{video.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {video.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          👁️ {video.views.toLocaleString()} views
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Common Questions */}
            {activeCategory === 'all' && searchQuery === '' && (
              <div>
                <h2 className="text-xl font-bold mb-4">❓ Common Questions</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {commonQuestions.map((qa, idx) => (
                        <div key={idx} className="pb-6 border-b last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                            <div>
                              <h3 className="font-bold mb-2">{qa.question}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {qa.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;

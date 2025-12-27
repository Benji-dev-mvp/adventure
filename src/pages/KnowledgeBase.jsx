import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Book, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle,
  Lightbulb,
  Settings,
  Users,
  BarChart,
  Zap,
  Mail,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

/**
 * Knowledge Base / Help Center
 * Implements foundation layer requirement: "Knowledge base engine"
 */
const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: Lightbulb,
      description: 'Learn the basics and set up your account',
      articleCount: 12,
      color: 'purple',
    },
    {
      id: 'campaigns',
      name: 'Campaign Builder',
      icon: Zap,
      description: 'Create and manage your outreach campaigns',
      articleCount: 18,
      color: 'blue',
    },
    {
      id: 'leads',
      name: 'Lead Management',
      icon: Users,
      description: 'Import, enrich, and segment your leads',
      articleCount: 15,
      color: 'green',
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant (Ava)',
      icon: Sparkles,
      description: 'Using AI to personalize your outreach',
      articleCount: 10,
      color: 'pink',
    },
    {
      id: 'analytics',
      name: 'Analytics & Reporting',
      icon: BarChart,
      description: 'Track performance and optimize campaigns',
      articleCount: 14,
      color: 'orange',
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Settings,
      description: 'Connect your CRM and other tools',
      articleCount: 20,
      color: 'indigo',
    },
    {
      id: 'email',
      name: 'Email Outreach',
      icon: Mail,
      description: 'Best practices for email campaigns',
      articleCount: 16,
      color: 'red',
    },
    {
      id: 'multichannel',
      name: 'Multi-channel Campaigns',
      icon: MessageSquare,
      description: 'LinkedIn, SMS, and call sequences',
      articleCount: 11,
      color: 'teal',
    },
  ];

  const articles = [
    // Getting Started
    {
      id: 1,
      category: 'getting-started',
      title: 'Quick Start Guide: Your First Campaign in 10 Minutes',
      description: 'Learn how to create your first campaign from scratch',
      readTime: '10 min',
      type: 'guide',
      popular: true,
      content: `This guide will walk you through creating your first campaign...`,
    },
    {
      id: 2,
      category: 'getting-started',
      title: 'Setting Up Your Account',
      description: 'Complete your profile and configure initial settings',
      readTime: '5 min',
      type: 'article',
      popular: true,
    },
    {
      id: 3,
      category: 'getting-started',
      title: 'Understanding the Dashboard',
      description: 'Navigate the main dashboard and key metrics',
      readTime: '7 min',
      type: 'article',
      popular: false,
    },
    {
      id: 4,
      category: 'getting-started',
      title: 'Connecting Your Email Account',
      description: 'Link Gmail, Outlook, or custom SMTP',
      readTime: '5 min',
      type: 'guide',
      popular: true,
    },

    // Campaigns
    {
      id: 5,
      category: 'campaigns',
      title: 'How to Create a Multi-Touch Campaign',
      description: 'Build sequences with delays and conditions',
      readTime: '12 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 6,
      category: 'campaigns',
      title: 'Using AI to Generate Email Content',
      description: 'Leverage Ava to write personalized emails',
      readTime: '8 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 7,
      category: 'campaigns',
      title: 'A/B Testing Your Campaigns',
      description: 'Test subject lines and content variations',
      readTime: '10 min',
      type: 'article',
      popular: false,
    },
    {
      id: 8,
      category: 'campaigns',
      title: 'Campaign Scheduling and Timing',
      description: 'Optimize send times for better engagement',
      readTime: '6 min',
      type: 'article',
      popular: false,
    },

    // Leads
    {
      id: 9,
      category: 'leads',
      title: 'Importing Leads from CSV',
      description: 'Upload and map your lead database',
      readTime: '5 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 10,
      category: 'leads',
      title: 'Lead Enrichment with Clearbit',
      description: 'Automatically enrich lead data',
      readTime: '7 min',
      type: 'article',
      popular: false,
    },
    {
      id: 11,
      category: 'leads',
      title: 'Lead Scoring and Prioritization',
      description: 'Focus on your hottest prospects',
      readTime: '9 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 12,
      category: 'leads',
      title: 'Segmenting Your Lead List',
      description: 'Create targeted lists based on criteria',
      readTime: '8 min',
      type: 'article',
      popular: false,
    },

    // AI Assistant
    {
      id: 13,
      category: 'ai-assistant',
      title: 'Getting Started with Ava',
      description: 'Introduction to your AI BDR assistant',
      readTime: '6 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 14,
      category: 'ai-assistant',
      title: 'Customizing AI Tone and Style',
      description: 'Adjust Ava\'s writing style to match your brand',
      readTime: '5 min',
      type: 'article',
      popular: false,
    },
    {
      id: 15,
      category: 'ai-assistant',
      title: 'Using Prompt Templates',
      description: 'Pre-built prompts for common tasks',
      readTime: '7 min',
      type: 'guide',
      popular: true,
    },

    // Analytics
    {
      id: 16,
      category: 'analytics',
      title: 'Understanding Campaign Metrics',
      description: 'Open rates, click rates, and reply rates explained',
      readTime: '10 min',
      type: 'article',
      popular: true,
    },
    {
      id: 17,
      category: 'analytics',
      title: 'Creating Custom Reports',
      description: 'Build reports for your specific needs',
      readTime: '12 min',
      type: 'guide',
      popular: false,
    },
    {
      id: 18,
      category: 'analytics',
      title: 'ROI Tracking and Attribution',
      description: 'Measure the impact of your campaigns',
      readTime: '15 min',
      type: 'article',
      popular: true,
    },

    // Integrations
    {
      id: 19,
      category: 'integrations',
      title: 'Connecting Salesforce CRM',
      description: 'Step-by-step Salesforce integration',
      readTime: '8 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 20,
      category: 'integrations',
      title: 'HubSpot Integration Guide',
      description: 'Sync contacts and deals with HubSpot',
      readTime: '7 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 21,
      category: 'integrations',
      title: 'Using Zapier for Custom Workflows',
      description: 'Connect to 5,000+ apps with Zapier',
      readTime: '10 min',
      type: 'article',
      popular: false,
    },

    // Email
    {
      id: 22,
      category: 'email',
      title: 'Email Deliverability Best Practices',
      description: 'Avoid spam and improve inbox placement',
      readTime: '12 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 23,
      category: 'email',
      title: 'Writing Effective Subject Lines',
      description: 'Increase open rates with better subjects',
      readTime: '8 min',
      type: 'article',
      popular: true,
    },
    {
      id: 24,
      category: 'email',
      title: 'Email Template Best Practices',
      description: 'Design emails that get responses',
      readTime: '10 min',
      type: 'guide',
      popular: false,
    },

    // Multi-channel
    {
      id: 25,
      category: 'multichannel',
      title: 'LinkedIn Outreach Strategies',
      description: 'Connect and engage on LinkedIn',
      readTime: '11 min',
      type: 'guide',
      popular: true,
    },
    {
      id: 26,
      category: 'multichannel',
      title: 'SMS Campaign Guidelines',
      description: 'Best practices for text message outreach',
      readTime: '6 min',
      type: 'article',
      popular: false,
    },
    {
      id: 27,
      category: 'multichannel',
      title: 'Coordinating Multi-Channel Sequences',
      description: 'Create cohesive cross-channel campaigns',
      readTime: '14 min',
      type: 'guide',
      popular: true,
    },
  ];

  const popularArticles = articles.filter(a => a.popular).slice(0, 6);

  const filteredArticles = searchTerm
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : [];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Artisan</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/contact">
                <Button variant="primary">Contact Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Book className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help?
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Search our knowledge base for articles, guides, and tutorials
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search for articles, guides, tutorials..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory(null);
                }}
                className="pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show categories if no search/category selected */}
        {!searchTerm && !selectedCategory && (
          <>
            {/* Popular Articles */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Popular Articles
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getTypeIcon(article.type)}
                        <Badge variant="blue" className="text-xs">
                          {article.readTime}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {article.description}
                      </p>
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                        Read More <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Browse by Category
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className={`w-16 h-16 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 text-${category.color}-600`} />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {category.description}
                        </p>
                        <Badge variant="gray">
                          {category.articleCount} articles
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Show filtered articles */}
        {(searchTerm || selectedCategory) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? `Search results for "${searchTerm}"` : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {selectedCategory && (
                <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                  ← Back to Categories
                </Button>
              )}
            </div>

            {filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getTypeIcon(article.type)}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {article.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {article.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <Badge variant="blue" className="text-xs">
                              {article.readTime}
                            </Badge>
                            {article.popular && (
                              <Badge variant="purple" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try a different search term or browse our categories
                  </p>
                  <Button variant="primary" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>
                    Browse All Categories
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Still Need Help Section */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button variant="primary" onClick={() => window.location.href = 'mailto:support@artisan.co'}>
                Contact Support
              </Button>
              <Button variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeBase;

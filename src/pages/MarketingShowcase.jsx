import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowRight } from 'lucide-react';

const MarketingShowcase = () => {
  const pages = [
    { title: 'Home Page', path: '/home', description: 'Main landing page with hero, features, and CTAs' },
    { title: 'Product Page', path: '/product', description: 'Detailed product features and comparisons' },
    { title: 'How It Works', path: '/how-it-works', description: 'Step-by-step process explanation' },
    { title: 'Pricing', path: '/pricing', description: 'Pricing tiers and plans' },
    { title: 'Solutions Hub', path: '/solutions', description: 'Overview of all solutions' },
    { title: 'Sales Leaders Solution', path: '/solutions/sales-leaders', description: 'For sales teams' },
    { title: 'RevOps Solution', path: '/solutions/rev-ops', description: 'For revenue operations' },
    { title: 'Startups Solution', path: '/solutions/startups', description: 'For startups' },
    { title: 'Resources Hub', path: '/resources', description: 'All resources and content' },
    { title: 'Case Studies', path: '/resources/case-studies', description: 'Customer success stories' },
    { title: 'Blog', path: '/resources/blog', description: 'Blog articles and insights' },
    { title: 'About Us', path: '/company/about', description: 'Company information' },
    { title: 'Customers', path: '/company/customers', description: 'Customer testimonials' },
    { title: 'Security', path: '/company/security', description: 'Security and compliance' },
    { title: 'Login', path: '/login', description: 'Authentication page' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            New Marketing Pages Showcase
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Click any page below to explore the new marketing-focused frontend structure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-50 mb-2">
                  {page.title}
                </h3>
                <p className="text-slate-400 mb-4 text-sm">
                  {page.description}
                </p>
                <Link
                  to={page.path}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Page
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-slate-900 border-slate-800 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-50 mb-4">
                Structure Overview
              </h2>
              <div className="text-left text-slate-300 space-y-2">
                <p><strong>src/app/</strong> - Router and AppShell (nav + footer wrapper)</p>
                <p><strong>src/pages/</strong> - All marketing pages organized by category</p>
                <p><strong>src/components/layout/</strong> - Navbar, Footer, PageSection, PageHeader</p>
                <p><strong>src/components/marketing/</strong> - Hero, LogoCloud, StatBand, Timeline, FAQ, CTA</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-300 text-sm"
          >
            ← Back to Main Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketingShowcase;

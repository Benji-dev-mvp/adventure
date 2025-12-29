import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import {
  Building2,
  TrendingUp,
  Users,
  Target,
  Quote,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const CustomerShowcase = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const customers = [
    {
      name: 'TechCorp',
      logo: 'TC',
      industry: 'Enterprise SaaS',
      employees: '5,000+',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Growth Industries',
      logo: 'GI',
      industry: 'Marketing Tech',
      employees: '2,500+',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Velocity Partners',
      logo: 'VP',
      industry: 'Consulting',
      employees: '1,200+',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'DataFlow Systems',
      logo: 'DF',
      industry: 'Data Analytics',
      employees: '3,800+',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'CloudScale',
      logo: 'CS',
      industry: 'Infrastructure',
      employees: '7,500+',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'InnovateLabs',
      logo: 'IL',
      industry: 'AI/ML',
      employees: '900+',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const testimonials = [
    {
      quote:
        "Artisan's Ava has transformed our outbound motion. We've 3x'd our pipeline in 6 months while cutting SDR costs by 60%. The AI personalization is remarkably accurate.",
      author: 'Sarah Chen',
      title: 'VP of Sales',
      company: 'TechCorp Solutions',
      avatar: 'SC',
      metrics: { pipeline: '+312%', cost: '-60%', time: '6 months' },
    },
    {
      quote:
        'The governance controls give our security team peace of mind while empowering our reps to move fast. SOC 2 compliance out of the box was a game-changer.',
      author: 'Michael Rodriguez',
      title: 'CISO',
      company: 'Enterprise Systems',
      avatar: 'MR',
      metrics: { compliance: '100%', deployment: '2 weeks', adoption: '98%' },
    },
    {
      quote:
        "We went from 50 qualified meetings per month to 180. Ava doesn't just send emails—it orchestrates intelligent, multi-channel campaigns that actually convert.",
      author: 'Emily Watson',
      title: 'Chief Revenue Officer',
      company: 'Growth Industries',
      avatar: 'EW',
      metrics: { meetings: '+260%', conversion: '+145%', roi: '8.5x' },
    },
  ];

  const useCases = [
    {
      icon: Building2,
      title: 'Enterprise Sales Teams',
      description: 'Scale your SDR team 10x without adding headcount',
      results: 'Average 3.2x pipeline growth in Q1',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Growth-Stage Startups',
      description: 'Build predictable pipeline without burning VC dollars',
      results: '42% reduction in CAC on average',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Marketing Operations',
      description: 'Convert intent signals into sales conversations',
      results: '18% higher MQL→SQL conversion',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Target,
      title: 'Demand Generation',
      description: 'Multi-channel campaigns that drive real pipeline',
      results: '2.1x faster deal velocity',
      color: 'from-green-500 to-green-600',
    },
  ];

  const impactMetrics = [
    { value: '2,847', label: 'Enterprise Customers', icon: Building2 },
    { value: '$48M', label: 'Pipeline Generated (30d)', icon: TrendingUp },
    { value: '14.2M', label: 'Leads Enriched', icon: Users },
    { value: '98.4%', label: 'Customer Satisfaction', icon: Star },
  ];

  return (
    <div
      id="customers"
      className="w-full py-20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Trusted by Industry Leaders
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-space-grotesk">
            Join 2,800+ Companies Scaling with Ava
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From fast-growing startups to Fortune 500 enterprises, teams trust Artisan to drive
            predictable revenue growth
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {impactMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card
                key={idx}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-4">
                  <Icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customer Logos */}
        <div className="mb-12">
          <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {customers.map((customer, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br ${customer.color} flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg`}
                      >
                        {customer.logo}
                      </div>
                      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {customer.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {customer.industry}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Testimonial */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 mb-12">
          <CardContent className="p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
              <Quote className="w-12 h-9 text-purple-500 mb-6" />

              <p className="text-lg font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
                {testimonials[activeTestimonial].quote}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {testimonials[activeTestimonial].author}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonials[activeTestimonial].title},{' '}
                      {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>

                {/* Testimonial Metrics */}
                <div className="flex gap-3">
                  {Object.entries(testimonials[activeTestimonial].metrics).map(([key, value]) => (
                    <div
                      key={key}
                      className="text-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {value}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeTestimonial === idx
                        ? 'w-8 bg-purple-500'
                        : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-3 mb-12">
          {useCases.map((useCase, idx) => {
            const Icon = useCase.icon;
            return (
              <Card
                key={idx}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group"
              >
                <CardContent className="p-4">
                  <div
                    className={`w-12 h-9 rounded-lg bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{useCase.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {useCase.results}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Case Study CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold mb-2">
                  See How TechCorp 3x'd Pipeline in 6 Months
                </h3>
                <p className="text-blue-100">
                  Download the full case study with implementation details and ROI breakdown
                </p>
              </div>
              <button className="px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 group">
                Download Case Study
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerShowcase;

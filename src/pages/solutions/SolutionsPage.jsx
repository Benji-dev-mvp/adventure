import React from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Target, Cog, Rocket } from 'lucide-react';

export function SolutionsPage() {
  const solutions = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Sales Leaders",
      description: "Scale your team's output without sacrificing quality. Get full visibility into pipeline health and rep performance.",
      href: "/solutions/sales-leaders",
      metrics: [
        { label: "Pipeline growth", value: "2.5x" },
        { label: "Time to ramp", value: "-60%" },
      ]
    },
    {
      icon: <Cog className="w-8 h-8 text-blue-400" />,
      title: "RevOps",
      description: "Unify your GTM stack and get the data quality you need for accurate forecasting and reporting.",
      href: "/solutions/rev-ops",
      metrics: [
        { label: "Data accuracy", value: "95%+" },
        { label: "Tool consolidation", value: "5→1" },
      ]
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-400" />,
      title: "Startups",
      description: "Launch your GTM motion fast with enterprise-grade tools built for agility and rapid experimentation.",
      href: "/solutions/startups",
      metrics: [
        { label: "Setup time", value: "< 1 week" },
        { label: "Cost savings", value: "70%" },
      ]
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Solutions"
          title="Built for every revenue team"
          description="Whether you're scaling a sales org, optimizing operations, or launching your first GTM motion, Artisan has the solution."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-8">
                <div className="mb-6">{solution.icon}</div>
                <h3 className="text-2xl font-bold text-slate-50 mb-4">
                  {solution.title}
                </h3>
                <p className="text-slate-400 mb-6">
                  {solution.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {solution.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex}>
                      <div className="text-2xl font-bold text-blue-400">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={solution.href}>
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="default">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            One platform, infinite possibilities
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            No matter your use case, Artisan adapts to your workflow with flexible integrations, custom fields, and AI that learns your business.
          </p>
          <Link to="/product">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Explore the Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </PageSection>
    </>
  );
}

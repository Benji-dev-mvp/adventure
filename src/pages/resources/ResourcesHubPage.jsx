import React from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, FileText, Newspaper, ArrowRight } from 'lucide-react';

export function ResourcesHubPage() {
  const resources = [
    {
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      title: "Case Studies",
      description: "See how leading companies use Artisan to transform their revenue operations.",
      href: "/resources/case-studies",
      count: "12 stories"
    },
    {
      icon: <Newspaper className="w-8 h-8 text-blue-400" />,
      title: "Blog",
      description: "Insights on AI, sales automation, and modern GTM strategies.",
      href: "/resources/blog",
      count: "50+ articles"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      title: "Documentation",
      description: "Complete guides, API references, and best practices.",
      href: "/help",
      count: "100+ guides"
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Resources"
          title="Learn, explore, and get inspired"
          description="Everything you need to master revenue automation with Artisan."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-8">
                <div className="mb-6">{resource.icon}</div>
                <h3 className="text-2xl font-bold text-slate-50 mb-4">
                  {resource.title}
                </h3>
                <p className="text-slate-400 mb-4">
                  {resource.description}
                </p>
                <div className="text-sm text-blue-400 mb-6">
                  {resource.count}
                </div>
                <Link to={resource.href}>
                  <Button variant="outline" className="w-full">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </>
  );
}

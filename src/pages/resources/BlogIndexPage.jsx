import React from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

export function BlogIndexPage() {
  const posts = [
    {
      title: "The future of AI-powered sales automation",
      excerpt: "How AI is transforming the way revenue teams approach outbound.",
      category: "AI & Automation",
      date: "Dec 15, 2024",
      slug: "future-of-ai-sales"
    },
    {
      title: "5 metrics every RevOps leader should track",
      excerpt: "The key indicators that predict revenue success.",
      category: "RevOps",
      date: "Dec 10, 2024",
      slug: "revops-metrics"
    },
    {
      title: "Multi-channel campaigns: A complete guide",
      excerpt: "How to orchestrate email, LinkedIn, and more for maximum impact.",
      category: "Strategy",
      date: "Dec 5, 2024",
      slug: "multi-channel-guide"
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Blog"
          title="Insights on modern GTM"
          description="Learn from the latest trends, strategies, and best practices in revenue automation."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((post, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </div>
                <Link to={`/resources/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-slate-50 mb-2 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-slate-400">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </>
  );
}

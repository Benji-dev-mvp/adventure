import React from 'react';
import { useParams } from 'react-router-dom';
import { PageSection } from '@/components/layout/PageSection';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock } from 'lucide-react';

export function BlogPostPage() {
  const { slug } = useParams();

  return (
    <>
      <PageSection variant="default">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">AI & Automation</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
            The future of AI-powered sales automation
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-400 mb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Dec 15, 2024
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              5 min read
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            The landscape of sales automation is undergoing a fundamental transformation. 
            What started as simple email sequencing has evolved into sophisticated AI systems 
            that can research prospects, personalize messaging, and optimize campaign performance in real-time.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-50 mt-8 mb-4">
            The Evolution of Sales Automation
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Traditional sales automation tools were built for a different era. They could send emails 
            and track opens, but they couldn't think, learn, or adapt. Today's AI-powered platforms 
            represent a quantum leap forward.
          </p>

          <h2 className="text-2xl font-bold text-slate-50 mt-8 mb-4">
            What's Different Now
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Modern AI doesn't just automate tasks—it automates decision-making. It can analyze 
            thousands of data points to determine the best time to send a message, the optimal 
            channel to use, and the most effective messaging strategy for each individual prospect.
          </p>

          <p className="text-slate-300 leading-relaxed">
            This is just the beginning. As AI continues to evolve, we'll see even more sophisticated 
            capabilities emerge, from predictive analytics that can forecast deal outcomes to 
            conversational AI that can handle complex sales discussions.
          </p>
        </div>
      </PageSection>
    </>
  );
}

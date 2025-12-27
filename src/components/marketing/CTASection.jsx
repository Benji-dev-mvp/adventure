import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export function CTASection({ 
  title = "Ready to transform your outbound?",
  description = "Join leading revenue teams using AI to scale their GTM motion.",
  ctaLabel = "Get Started",
  ctaHref = "/pricing"
}) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-8">
          {description}
        </p>
        <Link to={ctaHref}>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

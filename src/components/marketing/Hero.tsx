import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  pill?: string;
  children?: React.ReactNode;
};

export function Hero({ 
  eyebrow, 
  title, 
  subtitle, 
  primaryCta, 
  secondaryCta,
  pill,
  children 
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {pill && (
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                {pill}
              </Badge>
            )}
            {eyebrow && (
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    {primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.href}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column - Media Slot */}
          {children && (
            <div className="relative">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

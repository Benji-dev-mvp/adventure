import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollAnimation';

/**
 * HeroScene Component
 * Implements artisan.co-style hero with scroll-driven compression
 * Left: Headline + CTA | Right: Product frame that shrinks on scroll
 */
const HeroScene = ({ content }) => {
  const { ref, progress } = useScrollProgress({ start: 0, end: 0.3 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsScrolled(progress > 0.15);
  }, [progress]);

  // Calculate dynamic styles based on scroll progress
  const heroScale = Math.max(0.85, 1 - progress * 0.5);
  const heroOpacity = Math.max(0.7, 1 - progress * 1.5);
  const productFrameScale = Math.max(0.7, 1 - progress * 1);
  const productFrameY = progress * 100;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-900 dark:via-gray-900 dark:to-accent-900"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-300/20 dark:bg-accent-500/10 rounded-full blur-3xl"
          style={{
            transform: `translate3d(${progress * -100}px, ${progress * 50}px, 0)`,
            willChange: 'transform',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-300/20 dark:bg-primary-500/10 rounded-full blur-3xl"
          style={{
            transform: `translate3d(${progress * 100}px, ${progress * -50}px, 0)`,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Copy + CTA */}
          <div
            className="space-y-8"
            style={{
              opacity: heroOpacity,
              transform: `scale(${heroScale})`,
              transformOrigin: 'left center',
              transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
              willChange: 'transform, opacity',
            }}
          >
            {/* Badge */}
            <div className="inline-flex">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-300 dark:border-accent-700"
              >
                <Sparkles className="w-4 h-4" />
                {content.badge}
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary dark:text-white leading-[1.1]">
              {content.headline}
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              {content.subhead}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-accent hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                asChild
              >
                <Link to="/onboarding">
                  {content.cta.primary}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary hover:text-white dark:border-accent dark:hover:bg-accent transition-all duration-200"
                asChild
              >
                <Link to="/dashboard">{content.cta.secondary}</Link>
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-8 border-t border-gray-200 dark:border-gray-700">
              {content.metrics.map((metric, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-lg md:text-4xl font-bold text-accent dark:text-accent-400">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Frame */}
          <div
            className="relative"
            style={{
              transform: `scale(${productFrameScale}) translate3d(0, ${productFrameY}px, 0)`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease-out',
              willChange: 'transform',
            }}
          >
            <ProductFrame isScrolled={isScrolled} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isScrolled && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 animate-bounce">
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-9 border-2 border-current rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-current rounded-full" />
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * ProductFrame Component
 * Shows live product UI state
 */
const ProductFrame = ({ isScrolled }) => {
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveView(prev => {
        const views = ['dashboard', 'campaigns', 'analytics'];
        const currentIndex = views.indexOf(prev);
        return views[(currentIndex + 1) % views.length];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      {/* Frame Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:shadow-3xl">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 mx-4 bg-white dark:bg-gray-900 rounded px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
            app.artisan.co/{activeView}
          </div>
        </div>

        {/* Product Screenshot/UI */}
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
          {activeView === 'dashboard' && <DashboardPreview />}
          {activeView === 'campaigns' && <CampaignsPreview />}
          {activeView === 'analytics' && <AnalyticsPreview />}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/0 via-accent-500/5 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Floating Elements */}
      <FloatingMetric
        icon={TrendingUp}
        label="Response Rate"
        value="+127%"
        className="absolute -top-6 -right-6"
      />
      <FloatingMetric
        icon={Users}
        label="Active Campaigns"
        value="12"
        className="absolute -bottom-6 -left-6"
      />
    </div>
  );
};

/**
 * Mini Preview Components
 */
const DashboardPreview = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-8 w-48 bg-primary dark:bg-primary-600 rounded" />
      <div className="h-8 w-24 bg-accent dark:bg-accent-600 rounded" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-2">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-8 w-16 bg-accent-200 dark:bg-accent-700 rounded" />
        </div>
      ))}
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-32" />
  </div>
);

const CampaignsPreview = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center gap-3"
      >
        <div className="w-12 h-9 bg-accent-200 dark:bg-accent-700 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-8 w-8 bg-primary dark:bg-primary-600 rounded" />
      </div>
    ))}
  </div>
);

const AnalyticsPreview = () => (
  <div className="space-y-3">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-40 flex items-end gap-2">
      {[40, 65, 45, 80, 60, 90, 70].map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-accent-300 dark:bg-accent-600 rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-2">
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-6 w-20 bg-accent-200 dark:bg-accent-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * FloatingMetric Component
 */
const FloatingMetric = ({ icon: Icon, label, value, className = '' }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 animate-float ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-9 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-lg font-bold text-primary dark:text-white">{value}</div>
      </div>
    </div>
  </div>
);

export default HeroScene;

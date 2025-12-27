import React, { useEffect } from 'react';
import HeroScene from '../components/marketing/HeroScene';
import BeforeAfterCompare from '../components/marketing/BeforeAfterCompare';
import HowItWorksStepper from '../components/marketing/HowItWorksStepper';
import FeatureGrid from '../components/marketing/FeatureGrid';
import AIAgentShowcase from '../components/marketing/AIAgentShowcase';
import TestimonialsCarousel, { LogoWall } from '../components/marketing/TestimonialsCarousel';
import FinalCTA from '../components/marketing/FinalCTA';
import marketingContent from '../config/marketingContent';

/**
 * Marketing Page
 * Single scroll-driven experience inspired by artisan.co
 * All sections choreographed with smooth transitions
 */
const Marketing = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Reset scroll position on mount
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroScene content={marketingContent.hero} />

      {/* Before/After Comparison */}
      <BeforeAfterCompare content={marketingContent.beforeAfter} />

      {/* How It Works Stepper */}
      <HowItWorksStepper content={marketingContent.howItWorks} />

      {/* Feature Grid */}
      <FeatureGrid content={marketingContent.features} />

      {/* AI Agent Showcase */}
      <AIAgentShowcase content={marketingContent.aiAgent} />

      {/* Testimonials */}
      <TestimonialsCarousel content={marketingContent.testimonials} />

      {/* Logo Wall */}
      <LogoWall content={marketingContent.logos} />

      {/* Final CTA */}
      <FinalCTA content={marketingContent.finalCTA} />
    </div>
  );
};

export default Marketing;

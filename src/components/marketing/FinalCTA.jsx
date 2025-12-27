import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Check, Shield, Clock, Users } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * FinalCTA Component
 * Compelling call-to-action band with strong visual hierarchy
 * Inspired by artisan.co's closing CTA sections
 */
const FinalCTA = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });

  return (
    <section 
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary-600 to-accent dark:from-primary-900 dark:via-gray-900 dark:to-accent-900 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Main Content */}
        <div 
          className={`text-center space-y-8 mb-16 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 text-sm font-medium">
              {content.badge}
            </Badge>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
            {content.headline}
          </h2>

          {/* Subhead */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {content.subhead}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-200 group"
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
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 transition-all duration-200"
              asChild
            >
              <Link to="/dashboard">
                {content.cta.secondary}
              </Link>
            </Button>
          </div>

          {/* Feature List */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 text-white/90 transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              >
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm md:text-base font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div 
          className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Security */}
          <TrustCard
            icon={Shield}
            title="Enterprise Security"
            items={content.trust.security}
          />

          {/* Support */}
          <TrustCard
            icon={Users}
            title="World-Class Support"
            items={content.trust.support}
          />
        </div>

        {/* Social Proof */}
        <div 
          className={`text-center mt-16 pt-16 border-t border-white/20 transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <SocialProofMetric 
              icon={Users}
              value="10,000+"
              label="Active Users"
            />
            <SocialProofMetric 
              icon={Clock}
              value="99.95%"
              label="Uptime SLA"
            />
            <SocialProofMetric 
              icon={Shield}
              value="SOC 2"
              label="Type II Certified"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * TrustCard Component
 */
const TrustCard = ({ icon: Icon, title, items }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-4 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-white/90">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * SocialProofMetric Component
 */
const SocialProofMetric = ({ icon: Icon, value, label }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-white/70">{label}</div>
      </div>
    </div>
  );
};

export default FinalCTA;

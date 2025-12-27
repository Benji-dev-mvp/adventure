import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  MessageSquare, 
  Sparkles, 
  Database, 
  LineChart, 
  ShieldCheck, 
  Plug,
  ArrowRight,
  Check
} from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Icon mapping for dynamic icon rendering
 */
const iconMap = {
  MessageSquare,
  Sparkles,
  Database,
  LineChart,
  ShieldCheck,
  Plug
};

/**
 * FeatureGrid Component
 * Expandable feature tiles with hover interactions
 * Inspired by artisan.co's feature cards
 */
const FeatureGrid = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [expandedFeature, setExpandedFeature] = useState(null);

  return (
    <section 
      ref={ref}
      className="relative py-24 md:py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary dark:text-white">
            {content.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.grid.map((feature, index) => (
            <FeatureTile
              key={feature.id}
              feature={feature}
              index={index}
              isExpanded={expandedFeature === feature.id}
              onToggle={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Expanded Feature Detail Modal */}
        {expandedFeature && (
          <ExpandedFeatureModal
            feature={content.grid.find(f => f.id === expandedFeature)}
            onClose={() => setExpandedFeature(null)}
          />
        )}
      </div>
    </section>
  );
};

/**
 * FeatureTile Component
 */
const FeatureTile = ({ feature, index, isExpanded, onToggle, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[feature.icon] || Sparkles;

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-500 border-2 ${
        isHovered 
          ? 'border-accent shadow-2xl shadow-accent/20 scale-105 -translate-y-2' 
          : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
      } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
    >
      <CardContent className="p-8 space-y-4">
        
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isHovered 
            ? 'bg-accent text-white shadow-lg scale-110' 
            : 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
        }`}>
          <Icon className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary dark:text-white group-hover:text-accent transition-colors">
          {feature.title}
        </h3>

        {/* Preview Text */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.preview}
        </p>

        {/* Hover State: Show "Learn More" */}
        <div className={`flex items-center gap-2 text-accent font-medium transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}>
          <span className="text-sm">Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Benefit Badge */}
        {isHovered && feature.expanded && (
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
              {feature.expanded.benefit}
            </Badge>
          </div>
        )}
      </CardContent>

      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/10 transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Corner Accent */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </Card>
  );
};

/**
 * ExpandedFeatureModal Component
 */
const ExpandedFeatureModal = ({ feature, onClose }) => {
  const Icon = iconMap[feature.icon] || Sparkles;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-3xl md:w-full z-50 animate-scale-in">
        <Card className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-accent overflow-hidden max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8 md:p-12 space-y-8">
            
            {/* Header */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-primary dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {feature.expanded.description}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Capabilities */}
            <div>
              <h4 className="text-lg font-semibold text-primary dark:text-white mb-4">
                Capabilities
              </h4>
              <ul className="grid md:grid-cols-2 gap-3">
                {feature.expanded.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent-600 dark:text-accent-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefit */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Key Benefit
                  </h4>
                  <p className="text-green-700 dark:text-green-300">
                    {feature.expanded.benefit}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
              >
                Got it
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FeatureGrid;

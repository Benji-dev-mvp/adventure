import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { Check, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '../../hooks/useScrollAnimation';

/**
 * BeforeAfterCompare Component
 * Side-by-side comparison with animated metrics
 * Mirrors artisan.co's "Before/After" pattern
 */
const BeforeAfterCompare = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowComparison(true), 200);
    }
  }, [isVisible]);

  return (
    <section 
      ref={ref}
      className="relative py-24 md:py-32 bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

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

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Before Column */}
          <ComparisonCard
            data={content.before}
            variant="before"
            isVisible={showComparison}
            delay={0}
          />

          {/* After Column */}
          <ComparisonCard
            data={content.after}
            variant="after"
            isVisible={showComparison}
            delay={0.2}
          />
        </div>

        {/* VS Divider (Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-2xl">
            VS
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * ComparisonCard Component
 */
const ComparisonCard = ({ data, variant, isVisible, delay }) => {
  const isBefore = variant === 'before';
  
  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <Card className={`relative overflow-hidden border-2 ${
        isBefore 
          ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' 
          : 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
      }`}>
        <CardContent className="p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-3">
            <Badge 
              className={`text-sm font-semibold ${
                isBefore 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              {data.label}
            </Badge>
            <h3 className={`text-2xl md:text-3xl font-bold ${
              isBefore ? 'text-red-900 dark:text-red-200' : 'text-green-900 dark:text-green-200'
            }`}>
              {isBefore ? data.pain : data.benefit}
            </h3>
          </div>

          {/* Points List */}
          <ul className="space-y-4">
            {data.points.map((point, index) => (
              <li 
                key={index}
                className={`flex items-start gap-3 transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${delay + 0.1 * (index + 1)}s` }}
              >
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  isBefore 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {isBefore ? (
                    <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                  ) : (
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Metrics */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-4">
              {data.metrics.map((metric, index) => (
                <MetricDisplay
                  key={index}
                  metric={metric}
                  isNegative={metric.negative}
                  isPositive={metric.positive}
                  isVisible={isVisible}
                  delay={delay + 0.5 + index * 0.1}
                />
              ))}
            </div>
          </div>
        </CardContent>

        {/* Decorative Corner */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${
          isBefore ? 'bg-red-500/10' : 'bg-green-500/10'
        } blur-3xl`} />
      </Card>
    </div>
  );
};

/**
 * MetricDisplay Component with Animation
 */
const MetricDisplay = ({ metric, isNegative, isPositive, isVisible, delay }) => {
  const { count: animatedValue, animate } = useCountUp(0, 1000, {
    start: 0,
    decimals: 0,
    prefix: '',
    suffix: ''
  });

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => animate(), delay * 1000);
    }
  }, [isVisible, animate, delay]);

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-500 ${
        isNegative 
          ? 'bg-red-100/50 dark:bg-red-900/20' 
          : isPositive 
            ? 'bg-green-100/50 dark:bg-green-900/20'
            : 'bg-gray-100 dark:bg-gray-800'
      } ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3">
        {isNegative && <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />}
        {isPositive && <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {metric.label}
        </span>
      </div>
      <span className={`text-lg font-bold ${
        isNegative 
          ? 'text-red-700 dark:text-red-300' 
          : isPositive 
            ? 'text-green-700 dark:text-green-300'
            : 'text-gray-900 dark:text-gray-100'
      }`}>
        {metric.value}
      </span>
    </div>
  );
};

export default BeforeAfterCompare;

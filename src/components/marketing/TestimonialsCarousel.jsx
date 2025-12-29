import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Star, Quote, TrendingUp, Clock } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * TestimonialsCarousel Component
 * Card-based testimonials with company logos
 * Similar to artisan.co's customer testimonials
 */
const TestimonialsCarousel = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % content.quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [content.quotes.length]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="testimonial-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-pattern)" />
        </svg>
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

        {/* Featured Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {content.quotes.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={index === activeIndex}
              isVisible={isVisible}
            />
          ))}

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {content.quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-12 bg-accent'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-accent/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        {content.caseStudies && (
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {content.caseStudies.map((caseStudy, index) => (
              <CaseStudyCard
                key={index}
                caseStudy={caseStudy}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * TestimonialCard Component
 */
const TestimonialCard = ({ testimonial, isActive, isVisible }) => {
  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ${
        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      } ${isVisible ? '' : 'translate-y-8'}`}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-8 md:p-12 space-y-6">
          {/* Quote Icon */}
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>

          {/* Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
            "{testimonial.quote}"
          </blockquote>

          {/* Author + Metrics */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary text-white flex items-center justify-center font-bold text-xl">
                {testimonial.author[0]}
              </div>
              <div>
                <div className="font-bold text-primary dark:text-white">{testimonial.author}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>

            {/* Metrics */}
            {testimonial.metrics && (
              <div className="flex gap-6">
                {Object.entries(testimonial.metrics).map(([key, value], idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-accent">{value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * CaseStudyCard Component
 */
const CaseStudyCard = ({ caseStudy, index, isVisible }) => {
  return (
    <Card
      className={`border-2 border-gray-200 dark:border-gray-700 hover:border-accent hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 0.2}s` }}
    >
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white">{caseStudy.company}</h3>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {caseStudy.industry}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {caseStudy.size}
              </Badge>
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>

        {/* Challenge */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Challenge</h4>
          <p className="text-gray-700 dark:text-gray-300">{caseStudy.challenge}</p>
        </div>

        {/* Solution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Solution</h4>
          <p className="text-gray-700 dark:text-gray-300">{caseStudy.solution}</p>
        </div>

        {/* Results */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Results</h4>
          <div className="space-y-3">
            {caseStudy.results.map((result, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{result.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{result.before}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {result.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * LogoWall Component
 */
export const LogoWall = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{content.title}</h3>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {content.companies.map((company, index) => (
            <div
              key={index}
              className={`flex items-center justify-center transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <div className="w-full h-12 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm grayscale hover:grayscale-0 transition-all">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

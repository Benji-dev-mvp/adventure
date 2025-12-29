import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sparkles, Brain, Zap, Check, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * AIAgentShowcase Component
 * AI agent narrative modeled after "Meet Ava"
 * Persona card + capabilities + optional interactive element
 */
const AIAgentShowcase = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });
  const [showInteractive, setShowInteractive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTryIt = () => {
    setShowInteractive(true);
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary-600 to-accent dark:from-primary-900 dark:via-gray-900 dark:to-accent-900 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{content.title}</h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Persona Card */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <PersonaCard persona={content.persona} />
          </div>

          {/* Right: Capabilities */}
          <div
            className={`space-y-6 transition-all duration-700 delay-200 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            {content.capabilities.map((capability, index) => (
              <CapabilityCard
                key={index}
                capability={capability}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mt-16">
          <InteractiveDemo
            content={content.interactive}
            showInteractive={showInteractive}
            isGenerating={isGenerating}
            onTryIt={handleTryIt}
          />
        </div>
      </div>
    </section>
  );
};

/**
 * PersonaCard Component
 */
const PersonaCard = ({ persona }) => {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-white/20 overflow-hidden sticky top-24">
      <CardContent className="p-8 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {persona.name[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white">{persona.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{persona.role}</p>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="relative">
          <div className="absolute -top-2 -left-2 text-6xl text-accent/20 font-serif">"</div>
          <p className="text-xl italic text-gray-700 dark:text-gray-300 pl-8">{persona.quote}</p>
        </blockquote>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Always On</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">∞</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Scalability</div>
          </div>
        </div>

        {/* Badge */}
        <Badge className="w-full justify-center bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
          Powered by Advanced AI
        </Badge>
      </CardContent>
    </Card>
  );
};

/**
 * CapabilityCard Component
 */
const CapabilityCard = ({ capability, index, isVisible }) => {
  return (
    <Card
      className={`bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 0.1 + 0.3}s` }}
    >
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2">{capability.title}</h4>
            <p className="text-white/80 leading-relaxed">{capability.description}</p>
          </div>
          <Brain className="w-8 h-8 text-accent flex-shrink-0" />
        </div>

        {/* Metric */}
        <div className="pt-3 border-t border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">{capability.metric}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * InteractiveDemo Component
 */
const InteractiveDemo = ({ content, showInteractive, isGenerating, onTryIt }) => {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-white/20 overflow-hidden">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-primary dark:text-white">{content.title}</h4>
          {!showInteractive && (
            <Button onClick={onTryIt} className="bg-accent hover:bg-accent-600 text-white">
              Try it now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>

        {showInteractive && (
          <>
            {/* Prompt */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-accent">
              <div className="text-sm font-medium text-accent mb-2">Prompt:</div>
              <p className="text-gray-700 dark:text-gray-300">{content.prompt}</p>
            </div>

            {/* Response */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-inner">
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Ava is writing...</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                        style={{ width: `${100 - i * 15}%` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Generated in 1.3s</span>
                  </div>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {content.response}
                  </pre>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                    <Button size="sm" className="bg-accent text-white">
                      Use in Campaign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAgentShowcase;

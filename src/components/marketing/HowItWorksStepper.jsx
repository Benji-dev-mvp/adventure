import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Check } from 'lucide-react';
import { useStepProgress } from '../../hooks/useScrollAnimation';

/**
 * HowItWorksStepper Component
 * Multi-step walkthrough with Intersection Observer
 * Visual frame changes as user scrolls through steps
 */
const HowItWorksStepper = ({ content }) => {
  const { activeStep, setStepRef } = useStepProgress(content.steps);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (activeStep >= 0) {
      setHasStarted(true);
    }
  }, [activeStep]);

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary dark:text-white mb-6">
          {content.title}
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {content.subtitle}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Steps Column (Left) */}
          <div className="space-y-8">
            {content.steps.map((step, index) => (
              <div key={step.id} ref={setStepRef(index)} className="scroll-mt-32">
                <StepCard
                  step={step}
                  index={index}
                  isActive={index === activeStep}
                  isPast={index < activeStep}
                  hasStarted={hasStarted}
                />
              </div>
            ))}
          </div>

          {/* Visual Preview Column (Right) - Sticky */}
          <div className="lg:sticky lg:top-24 lg:h-[600px]">
            <VisualPreview activeStep={activeStep} steps={content.steps} hasStarted={hasStarted} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-300 ease-out"
          style={{
            width: hasStarted ? `${((activeStep + 1) / content.steps.length) * 100}%` : '0%',
          }}
        />
      </div>
    </section>
  );
};

/**
 * StepCard Component
 */
const StepCard = ({ step, index, isActive, isPast, hasStarted }) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-500 border-2 ${
        isActive
          ? 'border-accent shadow-2xl shadow-accent/20 scale-105'
          : isPast
            ? 'border-green-300 dark:border-green-700 opacity-70'
            : 'border-gray-200 dark:border-gray-700 opacity-50'
      } ${hasStarted ? 'translate-x-0' : '-translate-x-8 opacity-0'}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-8">
        {/* Step Number Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              isPast
                ? 'bg-green-500 text-white'
                : isActive
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {isPast ? <Check className="w-6 h-6" /> : step.id}
          </div>

          {isActive && (
            <Badge className="bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 animate-pulse">
              In View
            </Badge>
          )}
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
            {step.title}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>

          {/* Features List */}
          <div className="flex flex-wrap gap-2 pt-4">
            {step.features.map((feature, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  isActive || isPast
                    ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Check className="w-3 h-3" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-transparent pointer-events-none" />
      )}
    </Card>
  );
};

/**
 * VisualPreview Component
 * Shows Figma prototypes or fallback mockups based on active step
 */
const VisualPreview = ({ activeStep, steps, hasStarted }) => {
  const currentStep = steps[activeStep] || steps[0];
  const visualType = currentStep?.visual || 'dashboard';
  const figmaUrl = currentStep?.figmaUrl; // Figma embed URL (optional per step)

  return (
    <div
      className={`relative transition-opacity duration-500 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Frame Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 mx-4 bg-white dark:bg-gray-900 rounded px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
            {figmaUrl ? 'figma.com/prototype' : `app.artisan.co/${visualType}`}
          </div>
          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Step {activeStep + 1}
          </Badge>
        </div>

        {/* Visual Content - Figma Embed or Fallback */}
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative">
          {figmaUrl ? (
            <iframe
              key={figmaUrl}
              src={figmaUrl}
              className="w-full h-full transition-opacity duration-500"
              allowFullScreen
              title={`Figma prototype - ${currentStep.title}`}
            />
          ) : (
            <div className="p-6">
              <div className="transition-all duration-500" key={visualType}>
                {visualType === 'lead-database' && <LeadDatabaseVisual />}
                {visualType === 'campaign-builder' && <CampaignBuilderVisual />}
                {visualType === 'ai-assistant' && <AIAssistantVisual />}
                {visualType === 'analytics' && <AnalyticsVisual />}
                {visualType === 'dashboard' && <DashboardVisual />}
              </div>
            </div>
          )}

          {/* Step Indicator Overlay - only show for fallback visuals */}
          {!figmaUrl && (
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {currentStep.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Feature Badges */}
      <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-700 animate-bounce-slow">
        <div className="text-xs text-gray-500 dark:text-gray-400">Active Features</div>
        <div className="text-xl font-bold text-accent dark:text-accent-400">
          {currentStep.features.length}
        </div>
      </div>
    </div>
  );
};

/**
 * Visual Mockups for Each Step
 */
const LeadDatabaseVisual = () => (
  <div className="space-y-3 animate-fade-in">
    {[1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-accent-200 dark:bg-accent-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="text-sm font-semibold text-accent">95</div>
      </div>
    ))}
  </div>
);

const CampaignBuilderVisual = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-20" />
      ))}
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-32">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded bg-accent-300 dark:bg-accent-600" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <div className="w-8 h-8 rounded bg-primary-300 dark:bg-primary-600" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <div className="w-8 h-8 rounded bg-green-300 dark:bg-green-600" />
      </div>
    </div>
  </div>
);

const AIAssistantVisual = () => (
  <div className="space-y-3 animate-fade-in">
    {[
      { align: 'left', width: 'w-3/4' },
      { align: 'right', width: 'w-2/3' },
      { align: 'left', width: 'w-4/5' },
      { align: 'right', width: 'w-1/2' },
    ].map((msg, i) => (
      <div key={i} className={`flex ${msg.align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`${msg.width} bg-${msg.align === 'right' ? 'accent' : 'white dark:bg-gray-800'} ${msg.align === 'right' ? 'text-white' : ''} rounded-lg p-3 shadow-sm`}
        >
          <div className="h-2 bg-current opacity-20 rounded mb-2" />
          <div className="h-2 bg-current opacity-20 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsVisual = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-32 flex items-end gap-2">
      {[40, 65, 45, 80, 60, 90, 70, 55].map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-accent-500 to-accent-300 dark:from-accent-600 dark:to-accent-400 rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-accent">+{i * 15}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Metric {i}</div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardVisual = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Metric {i}</div>
          <div className="text-2xl font-bold text-primary dark:text-accent">{i * 127}%</div>
        </div>
      ))}
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-24" />
  </div>
);

export default HowItWorksStepper;

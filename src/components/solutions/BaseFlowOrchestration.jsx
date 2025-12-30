import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Base Flow Orchestration Component
 * Reusable stage-based flow visualization for Solution pages
 * Eliminates 25-35% duplication across Startup/Midmarket/Enterprise variants
 */
const BaseFlowOrchestration = ({ stages, autoPlayInterval = 3000 }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance through stages
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, stages.length, autoPlayInterval]);

  const handleStageClick = index => {
    setActiveStage(index);
    setIsPlaying(false);
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            See how Ava takes you from setup to results
          </p>
        </div>

        {/* Stage Progress */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === activeStage;
            const isComplete = index < activeStage;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r ' + stage.color + ' text-white shadow-lg scale-105'
                    : isComplete
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {isComplete ? (
                  <CheckCircle size={16} />
                ) : (
                  <Icon size={16} />
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {stage.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details */}
        <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            if (index !== activeStage) return null;

            return (
              <div key={stage.id} className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${stage.color}`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {stage.phase || stage.duration}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-sm text-gray-400">{stage.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-gray-300"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg">{stage.description}</p>

                {/* Data Points */}
                <div className="grid md:grid-cols-3 gap-3">
                  {stage.dataPoints?.map((point, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-sm text-gray-300">{point}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                {stage.metrics && (
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                    {Object.entries(stage.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-white mb-1">
                          {value}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compliance Badges (Enterprise) */}
                {stage.compliance && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {stage.compliance.map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Next Stage CTA */}
                {index < stages.length - 1 && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveStage(prev => prev + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Next: {stages[index + 1].title}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

BaseFlowOrchestration.propTypes = {
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired,
      phase: PropTypes.string,
      duration: PropTypes.string,
      description: PropTypes.string.isRequired,
      dataPoints: PropTypes.arrayOf(PropTypes.string),
      metrics: PropTypes.object,
      compliance: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  autoPlayInterval: PropTypes.number,
};

export default BaseFlowOrchestration;

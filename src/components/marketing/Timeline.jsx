import React from 'react';
import { Check } from 'lucide-react';

export function Timeline({ steps, orientation = 'vertical' }) {
  if (orientation === 'horizontal') {
    return (
      <div className="relative">
        <div className="flex justify-between items-start">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-slate-700" />
                )}
                
                {/* Step Circle */}
                <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                  {step.icon || <Check className="w-6 h-6 text-white" />}
                </div>

                {/* Step Content */}
                <h3 className="text-lg font-semibold text-slate-50 mb-2">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-slate-400">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical Timeline
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          {/* Step Circle */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              {step.icon || <Check className="w-6 h-6 text-white" />}
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-12 left-6 w-0.5 h-8 bg-slate-700" />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pt-2">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              {step.title}
            </h3>
            {step.description && (
              <p className="text-sm text-slate-400">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

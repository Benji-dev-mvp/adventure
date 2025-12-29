import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GlassCard, GlassCardContent, GradientText } from '../../components/futuristic';
import { FlaskConical, Play, RefreshCw, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { StrategySelector } from './components/StrategySelector';
import { SimulationPanels } from './components/SimulationPanels';
import { RiskBreakdown } from './components/RiskBreakdown';
import { SimulationControls } from './components/SimulationControls';
import { useSimulation } from './hooks/useSimulation';

export function SimulationPage() {
  const {
    strategies,
    activeStrategy,
    setActiveStrategy,
    params,
    updateParam,
    projections,
    activeStrategyData,
    recommendation,
    loading,
  } = useSimulation();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <FlaskConical className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText gradient="cyber">MarketVerse Simulation</GradientText>
              </h1>
              <p className="text-slate-400 mt-1">
                Model and compare growth strategies with predictive analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
          </div>
        </div>

        {/* Strategy Selector */}
        <StrategySelector
          strategies={strategies}
          activeStrategy={activeStrategy}
          onSelect={setActiveStrategy}
          recommendation={recommendation}
        />

        {/* Main content */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left: Controls */}
          <div className="col-span-12 lg:col-span-3">
            <SimulationControls params={params} updateParam={updateParam} />
          </div>

          {/* Center: Simulation Panels */}
          <div className="col-span-12 lg:col-span-6">
            <SimulationPanels
              strategies={strategies}
              projections={projections}
              activeStrategy={activeStrategy}
            />
          </div>

          {/* Right: Risk Breakdown */}
          <div className="col-span-12 lg:col-span-3">
            <RiskBreakdown
              risks={activeStrategyData?.risks}
              recommendation={recommendation}
              activeStrategyData={activeStrategyData}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SimulationPage;

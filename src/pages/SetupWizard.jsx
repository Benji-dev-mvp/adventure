import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Users,
  Target,
  Bot,
  Plug,
  Sparkles,
  Rocket,
  CheckCircle2,
  CircleDot,
  Circle,
  Database,
  Mail,
  Linkedin,
  Phone,
  Calendar,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const STORAGE_KEY = 'artisan_setup_complete';

const STEPS = [
  { id: 1, title: 'Connect CRM', icon: Database },
  { id: 2, title: 'Define ICP', icon: Target },
  { id: 3, title: 'Choose Solution', icon: Building2 },
  { id: 4, title: 'Enable Ava', icon: Bot },
];

const CRM_OPTIONS = [
  { id: 'salesforce', name: 'Salesforce', logo: '🔵', popular: true },
  { id: 'hubspot', name: 'HubSpot', logo: '🟠', popular: true },
  { id: 'pipedrive', name: 'Pipedrive', logo: '🟢', popular: false },
  { id: 'zoho', name: 'Zoho CRM', logo: '🔴', popular: false },
  { id: 'dynamics', name: 'Microsoft Dynamics', logo: '🟣', popular: false },
  { id: 'none', name: 'Skip for now', logo: '⏭️', popular: false },
];

const ICP_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Professional Services',
  'Other',
];

const ICP_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const SOLUTION_OPTIONS = [
  {
    id: 'startup',
    name: 'Startup',
    description: 'Perfect for small teams getting started with outbound',
    features: ['Basic lead scoring', 'Email sequences', 'Simple analytics'],
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'midmarket',
    name: 'Midmarket',
    description: 'For growing teams that need more power',
    features: ['Advanced scoring', 'Multi-channel sequences', 'A/B testing', 'Team collaboration'],
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full platform for large sales organizations',
    features: [
      'AI-powered everything',
      'Custom integrations',
      'Advanced analytics',
      'Dedicated support',
      'Custom playbooks',
    ],
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    recommended: true,
  },
];

const PLAYBOOK_OPTIONS = [
  {
    id: 'outbound-startup',
    name: 'Outbound for Startups',
    description: 'Quick, scrappy outreach for early-stage',
    channels: ['email', 'linkedin'],
  },
  {
    id: 'enterprise-sale',
    name: 'Enterprise Sales Motion',
    description: 'Multi-touch, high-value approach',
    channels: ['email', 'linkedin', 'call'],
  },
  {
    id: 'reactivate',
    name: 'Re-activate Stale Pipeline',
    description: 'Win back cold leads',
    channels: ['email'],
  },
  {
    id: 'inbound-followup',
    name: 'Inbound Lead Follow-up',
    description: 'Strike while the iron is hot',
    channels: ['email', 'call'],
  },
];

const StepIndicator = ({ steps, currentStep, completedSteps }) => (
  <div className="flex items-center justify-center gap-3">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              completedSteps.includes(step.id)
                ? 'bg-green-500 text-white'
                : currentStep === step.id
                  ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-400'
            )}
          >
            {completedSteps.includes(step.id) ? (
              <Check className="h-5 w-5" />
            ) : (
              <step.icon className="h-5 w-5" />
            )}
          </div>
          <span
            className={cn(
              'text-sm font-medium hidden md:block',
              currentStep === step.id
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {step.title}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className={cn(
              'w-12 h-0.5',
              completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10'
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const Step1CRM = ({ selectedCRM, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-2xl mx-auto"
  >
    <div className="text-center mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Connect Your CRM</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Sync your contacts and keep everything in one place
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CRM_OPTIONS.map(crm => (
        <button
          key={crm.id}
          onClick={() => onSelect(crm.id)}
          className={cn(
            'relative p-6 rounded-xl border-2 transition-all text-center',
            selectedCRM === crm.id
              ? 'border-accent-500 bg-accent-500/10 shadow-lg'
              : 'border-gray-200 dark:border-white/10 hover:border-accent-500/50'
          )}
        >
          {crm.popular && (
            <Badge variant="primary" size="sm" className="absolute -top-2 -right-2">
              Popular
            </Badge>
          )}
          <div className="text-4xl mb-3">{crm.logo}</div>
          <p className="font-medium text-gray-900 dark:text-white">{crm.name}</p>
          {selectedCRM === crm.id && (
            <CheckCircle2 className="absolute top-3 left-3 h-5 w-5 text-accent-500" />
          )}
        </button>
      ))}
    </div>
  </motion.div>
);

const Step2ICP = ({ icpData, onUpdate }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-2xl mx-auto"
  >
    <div className="text-center mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Define Your Ideal Customer
      </h2>
      <p className="text-gray-500 dark:text-gray-400">Help Ava understand who you're targeting</p>
    </div>

    <div className="space-y-3">
      {/* Industries */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Target Industries
        </label>
        <div className="flex flex-wrap gap-2">
          {ICP_INDUSTRIES.map(industry => (
            <button
              key={industry}
              onClick={() => {
                const industries = icpData.industries || [];
                const updated = industries.includes(industry)
                  ? industries.filter(i => i !== industry)
                  : [...industries, industry];
                onUpdate({ ...icpData, industries: updated });
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                (icpData.industries || []).includes(industry)
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
              )}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Company Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Company Size (Employees)
        </label>
        <div className="flex flex-wrap gap-2">
          {ICP_SIZES.map(size => (
            <button
              key={size}
              onClick={() => {
                const sizes = icpData.sizes || [];
                const updated = sizes.includes(size)
                  ? sizes.filter(s => s !== size)
                  : [...sizes, size];
                onUpdate({ ...icpData, sizes: updated });
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                (icpData.sizes || []).includes(size)
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Job Titles */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Target Job Titles
        </label>
        <input
          type="text"
          placeholder="e.g., VP Sales, CRO, Head of Growth"
          value={icpData.titles || ''}
          onChange={e => onUpdate({ ...icpData, titles: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>
    </div>
  </motion.div>
);

const Step3Solution = ({ selectedSolution, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-4xl mx-auto"
  >
    <div className="text-center mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Choose Your Solution
      </h2>
      <p className="text-gray-500 dark:text-gray-400">Select the plan that best fits your team</p>
    </div>

    <div className="grid md:grid-cols-3 gap-3">
      {SOLUTION_OPTIONS.map(solution => (
        <button
          key={solution.id}
          onClick={() => onSelect(solution.id)}
          className={cn(
            'relative p-6 rounded-2xl border-2 text-left transition-all',
            selectedSolution === solution.id
              ? 'border-accent-500 shadow-xl'
              : 'border-gray-200 dark:border-white/10 hover:border-accent-500/50'
          )}
        >
          {solution.recommended && (
            <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
              Recommended
            </Badge>
          )}

          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br',
              solution.color
            )}
          >
            <solution.icon className="h-7 w-7" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{solution.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{solution.description}</p>

          <ul className="space-y-2">
            {solution.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <Check className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>

          {selectedSolution === solution.id && (
            <div className="absolute inset-0 rounded-lg ring-2 ring-accent-500" />
          )}
        </button>
      ))}
    </div>
  </motion.div>
);

const Step4Ava = ({ selectedPlaybooks, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-2xl mx-auto"
  >
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/30">
        <Bot className="h-9 w-10 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Meet Ava, Your AI SDR
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Select playbooks for Ava to run automatically
      </p>
    </div>

    <div className="space-y-3">
      {PLAYBOOK_OPTIONS.map(playbook => (
        <button
          key={playbook.id}
          onClick={() => onToggle(playbook.id)}
          className={cn(
            'w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4',
            selectedPlaybooks.includes(playbook.id)
              ? 'border-accent-500 bg-accent-500/10'
              : 'border-gray-200 dark:border-white/10 hover:border-accent-500/50'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              selectedPlaybooks.includes(playbook.id)
                ? 'bg-accent-500 text-white'
                : 'bg-gray-100 dark:bg-white/10 text-gray-400'
            )}
          >
            {selectedPlaybooks.includes(playbook.id) ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{playbook.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {playbook.description}
            </p>
            <div className="flex gap-2 mt-2">
              {playbook.channels.map(channel => (
                <Badge key={channel} variant="secondary" size="sm">
                  {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                  {channel === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                  {channel === 'call' && <Phone className="h-3 w-3 mr-1" />}
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Form state
  const [selectedCRM, setSelectedCRM] = useState(null);
  const [icpData, setICPData] = useState({ industries: [], sizes: [], titles: '' });
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedPlaybooks, setSelectedPlaybooks] = useState([]);

  // Check if already completed
  useEffect(() => {
    const isComplete = localStorage.getItem(STORAGE_KEY);
    // Don't redirect - allow revisiting setup
  }, [navigate]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedCRM !== null;
      case 2:
        return icpData.industries?.length > 0 || icpData.sizes?.length > 0;
      case 3:
        return selectedSolution !== null;
      case 4:
        return true; // Playbooks are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save setup data
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(
      'artisan_setup_data',
      JSON.stringify({
        crm: selectedCRM,
        icp: icpData,
        solution: selectedSolution,
        playbooks: selectedPlaybooks,
      })
    );

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const togglePlaybook = id => {
    setSelectedPlaybooks(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-9 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Artisan Setup</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent-500"
        >
          Skip for now →
        </button>
      </header>

      {/* Progress */}
      <div className="px-4 py-3">
        <StepIndicator steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1CRM key="step1" selectedCRM={selectedCRM} onSelect={setSelectedCRM} />
          )}
          {currentStep === 2 && <Step2ICP key="step2" icpData={icpData} onUpdate={setICPData} />}
          {currentStep === 3 && (
            <Step3Solution
              key="step3"
              selectedSolution={selectedSolution}
              onSelect={setSelectedSolution}
            />
          )}
          {currentStep === 4 && (
            <Step4Ava key="step4" selectedPlaybooks={selectedPlaybooks} onToggle={togglePlaybook} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-accent-500 to-primary-500"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Launch Artisan
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default SetupWizard;

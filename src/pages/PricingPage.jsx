import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  CheckCircle2,
  Calculator,
  MessageSquare,
  Mail,
  Phone,
  Building,
  User,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Shield,
  Globe,
  Info,
  Calendar,
  Play,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import UnifiedCTA from '../components/features/UnifiedCTA';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
} from '../components/futuristic';

// ============================================================================
// DATA LAYER - Centralized configuration
// ============================================================================

const PLAN_CONFIG = {
  starter: {
    name: 'Starter',
    price: 99,
    displayPrice: '$99',
    period: '/month',
    annual: { price: 79, displayPrice: '$79', savings: 20 },
    description: 'Perfect for solo founders and small teams',
    targetAudience: '1-10 employees',
    highlights: ['Quick setup', 'No credit card', 'Cancel anytime'],
    limits: { leads: 1000, emails: 5000, seats: 2 },
    features: [
      { text: '1,000 leads per month', icon: Users },
      { text: '5,000 emails per month', icon: Mail },
      { text: 'Basic AI personalization', icon: Sparkles },
      { text: 'Email sequences', icon: TrendingUp },
      { text: 'Basic analytics', icon: Calculator },
      { text: 'Email support', icon: MessageSquare },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/onboarding',
    popular: false,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  professional: {
    name: 'Professional',
    price: 299,
    displayPrice: '$299',
    period: '/month',
    annual: { price: 239, displayPrice: '$239', savings: 20 },
    description: 'For growing sales teams',
    targetAudience: '10-100 employees',
    highlights: ['Most popular', '3x more meetings', 'Priority support'],
    limits: { leads: 10000, emails: 50000, seats: 10 },
    features: [
      { text: '10,000 leads per month', icon: Users },
      { text: '50,000 emails per month', icon: Mail },
      { text: 'Advanced AI personalization', icon: Sparkles },
      { text: 'Multi-channel sequences', icon: TrendingUp },
      { text: 'Advanced analytics & insights', icon: Calculator },
      { text: 'Team collaboration tools', icon: Users },
      { text: 'CRM integrations (Salesforce, HubSpot)', icon: Zap },
      { text: 'Priority support', icon: MessageSquare },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/onboarding',
    popular: true,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    displayPrice: 'Custom',
    period: '',
    annual: null,
    description: 'For large organizations at scale',
    targetAudience: '100+ employees',
    highlights: ['Unlimited scale', 'Dedicated CSM', '99.9% SLA'],
    limits: { leads: null, emails: null, seats: null },
    features: [
      { text: 'Unlimited leads & emails', icon: Users },
      { text: 'Custom AI training & fine-tuning', icon: Sparkles },
      { text: 'Dedicated success manager', icon: User },
      { text: 'Custom integrations & API access', icon: Zap },
      { text: 'SSO/SAML + SCIM provisioning', icon: Shield },
      { text: '99.9% SLA guarantee', icon: CheckCircle2 },
      { text: 'Advanced security & compliance', icon: Shield },
      { text: 'Data residency options', icon: Globe },
      { text: 'White-glove onboarding', icon: Users },
    ],
    cta: 'Contact Sales',
    ctaLink: '#contact-sales',
    popular: false,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
};

const FAQ_DATA = [
  {
    question: 'How long is the free trial?',
    answer: '14 days with full access to all features. No credit card required.',
    category: 'trial',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no penalties or hidden fees.',
    category: 'billing',
  },
  {
    question: "What's included in Enterprise?",
    answer:
      'Custom AI training, SSO/SAML, dedicated success manager, 99.9% SLA, data residency options, white-glove onboarding, and custom integrations.',
    category: 'enterprise',
  },
  {
    question: 'Do you offer annual discounts?',
    answer: 'Yes, annual plans receive a 20% discount compared to monthly billing.',
    category: 'billing',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, Amex, Discover) and ACH for annual plans.',
    category: 'billing',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we use bank-level encryption (AES-256), SOC 2 Type II certified, and GDPR compliant.',
    category: 'security',
  },
];

const ROI_DEFAULTS = {
  sdrs: 5,
  costPerSdr: 75000,
  meetingsPerSdr: 10,
};

// ============================================================================
// COMPONENT LAYER - Reusable UI components
// ============================================================================

/**
 * PricingCard - Reusable pricing plan card
 */
const PricingCard = ({ plan, billing, index }) => {
  const isAnnual = billing === 'annual';
  const displayPrice = isAnnual && plan.annual ? plan.annual.displayPrice : plan.displayPrice;
  const savings = isAnnual && plan.annual ? plan.annual.savings : 0;

  return (
    <RevealText delay={index * 100}>
      <GlassCard
        variant={plan.popular ? 'gradient' : 'default'}
        hover
        glow={plan.popular}
        glowColor="purple"
        className={`h-full ${plan.popular ? 'scale-105 border-2 border-purple-500/50 relative' : ''}`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <GlassCard variant="neon" padding="px-3 py-1" radius="full" glow glowColor="purple">
              <span className="text-xs font-bold text-white">MOST POPULAR</span>
            </GlassCard>
          </div>
        )}
        <GlassCardContent className="p-4">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 font-space-grotesk">{plan.name}</h3>
            <p className="text-sm text-gray-400">{plan.targetAudience}</p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                <GradientText gradient="cyber">{displayPrice}</GradientText>
              </span>
              {plan.period && <span className="text-gray-400">{plan.period}</span>}
            </div>
            {savings > 0 && (
              <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} />
                Save {savings}% annually
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-4">{plan.description}</p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {plan.highlights.map(highlight => (
              <span
                key={`${plan.name}-highlight-${highlight}`}
                className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
              >
                {highlight}
              </span>
            ))}
          </div>

          {/* CTA */}
          {plan.name === 'Enterprise' ? (
            <a href={plan.ctaLink}>
              <GlowButtonOutline variant="primary" size="lg" className="w-full mb-6">
                {plan.cta}
              </GlowButtonOutline>
            </a>
          ) : (
            <Link to={plan.ctaLink}>
              {plan.popular ? (
                <GlowButton variant="primary" size="lg" className="w-full mb-6" glow>
                  {plan.cta}
                </GlowButton>
              ) : (
                <GlowButtonOutline variant="primary" size="lg" className="w-full mb-6">
                  {plan.cta}
                </GlowButtonOutline>
              )}
            </Link>
          )}

          {/* Features */}
          <ul className="space-y-2">
            {plan.features.map(feature => {
              const Icon = feature.icon;
              return (
                <li key={`${plan.name}-${feature.text}`} className="flex items-start gap-2">
                  <Icon size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">{feature.text}</span>
                </li>
              );
            })}
          </ul>
        </GlassCardContent>
      </GlassCard>
    </RevealText>
  );
};

PricingCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayPrice: PropTypes.string.isRequired,
    period: PropTypes.string,
    annual: PropTypes.shape({
      displayPrice: PropTypes.string.isRequired,
      savings: PropTypes.number.isRequired,
    }),
    description: PropTypes.string.isRequired,
    targetAudience: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
      })
    ).isRequired,
    cta: PropTypes.string.isRequired,
    ctaLink: PropTypes.string.isRequired,
    popular: PropTypes.bool,
  }).isRequired,
  billing: PropTypes.oneOf(['monthly', 'annual']).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * ROIResultCard - Reusable ROI result display
 */
const ROIResultCard = ({ label, value, gradient, icon: Icon, suffix = '', prefix = '' }) => (
  <GlassCard variant="default" glow glowColor="cyan">
    <GlassCardContent className="p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
        <Icon size={16} />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold font-space-grotesk">
        <GradientText gradient={gradient}>
          <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
        </GradientText>
      </div>
    </GlassCardContent>
  </GlassCard>
);

ROIResultCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  gradient: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
};

/**
 * FAQItem - Reusable FAQ accordion item
 */
const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RevealText delay={index * 50}>
      <GlassCard variant="default" hover>
        <GlassCardContent className="p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left flex items-start justify-between gap-3"
          >
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1 font-space-grotesk">
                {faq.question}
              </h3>
              {isOpen && <p className="text-sm text-gray-400 mt-2">{faq.answer}</p>}
            </div>
            <div
              className={`flex-shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <Info size={18} className="text-gray-400" />
            </div>
          </button>
        </GlassCardContent>
      </GlassCard>
    </RevealText>
  );
};

FAQItem.propTypes = {
  faq: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PricingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [roiInputs, setRoiInputs] = useState(ROI_DEFAULTS);

  // Scroll to section based on hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Calculate ROI (memoized for performance)
  const roi = useMemo(() => {
    const currentCost = roiInputs.sdrs * roiInputs.costPerSdr;
    const currentMeetings = roiInputs.sdrs * roiInputs.meetingsPerSdr * 12;
    const withAva = {
      cost: currentCost * 0.3 + 299 * 12, // 70% reduction + Ava cost
      meetings: currentMeetings * 3, // 3x meetings
    };
    return {
      costSavings: Math.round(currentCost - withAva.cost),
      meetingsIncrease: Math.round(withAva.meetings - currentMeetings),
      roi: Math.round(((currentCost - withAva.cost) / (299 * 12)) * 100),
    };
  }, [roiInputs]);

  // Handle input changes (debounced for performance)
  const handleInputChange = useCallback((field, value) => {
    setRoiInputs(prev => ({
      ...prev,
      [field]: Number.parseInt(value, 10) || 0,
    }));
  }, []);

  // Helper function to render table cell values
  const renderTableCell = value => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 size={18} className="text-emerald-400 inline" />
      ) : (
        <span className="text-gray-600">—</span>
      );
    }
    return value;
  };

  return (
    <AppShell showBanner={false}>
      {/* Hero Section - Enhanced */}
      <section id="start" className="relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <RevealText>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm mb-6">
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">Simple, Transparent Pricing</span>
              </div>
            </RevealText>

            <RevealText delay={100}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-space-grotesk leading-tight">
                <GradientText gradient="aurora" animate>
                  Start Free, Scale
                  <br />
                  as You Grow
                </GradientText>
              </h1>
            </RevealText>

            <RevealText delay={200}>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join 500+ companies automating their outbound with AI. No credit card required.
              </p>
            </RevealText>

            <RevealText delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to="/onboarding">
                  <GlowButton variant="primary" size="lg" glow className="gap-2 min-w-[200px]">
                    <Zap size={20} />
                    Start Free Trial
                  </GlowButton>
                </Link>
                <a href="#contact-sales">
                  <GlowButtonOutline variant="secondary" size="lg" className="gap-2 min-w-[200px]">
                    <MessageSquare size={20} />
                    Talk to Sales
                  </GlowButtonOutline>
                </a>
              </div>
            </RevealText>

            {/* Trust Indicators */}
            <RevealText delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </RevealText>
          </div>

          {/* Billing Toggle - Enhanced */}
          <RevealText delay={500}>
            <div className="flex items-center justify-center gap-3 mb-12">
              <GlassCard variant="default">
                <GlassCardContent className="p-1.5 flex items-center gap-2">
                  <button
                    onClick={() => setBilling('monthly')}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      billing === 'monthly'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBilling('annual')}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      billing === 'annual'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Annual
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                      Save 20%
                    </span>
                  </button>
                </GlassCardContent>
              </GlassCard>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Pricing Cards - Enhanced Layout */}
      <section className="px-4 pb-20 relative overflow-hidden -mt-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.values(PLAN_CONFIG).map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} billing={billing} index={index} />
            ))}
          </div>

          {/* Additional CTA Below Cards */}
          <RevealText delay={600}>
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">Not sure which plan is right for you?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#roi">
                  <GlowButtonOutline variant="primary" size="md" className="gap-2">
                    <Calculator size={18} />
                    Calculate Your ROI
                  </GlowButtonOutline>
                </a>
                <a href="#contact-sales">
                  <GlowButtonOutline variant="secondary" size="md" className="gap-2">
                    <MessageSquare size={18} />
                    Schedule a Demo
                  </GlowButtonOutline>
                </a>
              </div>
            </div>
          </RevealText>
        </div>
      </section>

      {/* ROI Calculator - Enhanced Section */}
      <section
        id="roi"
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-cyan-950/10 to-transparent" />
        <ParticleBackground variant="minimal" className="absolute inset-0 opacity-30" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm mb-6">
                <Calculator size={16} className="text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">ROI Calculator</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">See Your Potential Savings</GradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Calculate exactly how much Artisan can save your team
              </p>
            </div>
          </RevealText>

          <GlassCard variant="gradient" glow glowColor="cyan">
            <GlassCardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-cyan-500/20">
                      <Users size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-space-grotesk">
                        Your Current Setup
                      </h3>
                      <p className="text-sm text-gray-400">Enter your team details</p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                      <Users size={16} className="text-cyan-400" />
                      Number of SDRs
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={roiInputs.sdrs}
                      onChange={e => handleInputChange('sdrs', e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                      <DollarSign size={16} className="text-cyan-400" />
                      Average SDR Cost ($/year)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={roiInputs.costPerSdr}
                      onChange={e => handleInputChange('costPerSdr', e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                      <TrendingUp size={16} className="text-cyan-400" />
                      Meetings per SDR (monthly)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={roiInputs.meetingsPerSdr}
                      onChange={e => handleInputChange('meetingsPerSdr', e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Sparkles size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-space-grotesk">
                        With Artisan AI
                      </h3>
                      <p className="text-sm text-gray-400">Projected impact</p>
                    </div>
                  </div>

                  <ROIResultCard
                    label="Annual Cost Savings"
                    value={roi.costSavings}
                    gradient="cyber"
                    icon={DollarSign}
                    prefix="$"
                  />

                  <ROIResultCard
                    label="Additional Meetings/Year"
                    value={roi.meetingsIncrease}
                    gradient="aurora"
                    icon={TrendingUp}
                    prefix="+"
                  />

                  <ROIResultCard
                    label="Return on Investment"
                    value={roi.roi}
                    gradient="cyber"
                    icon={Calculator}
                    suffix="%"
                  />

                  <div className="mt-6 p-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <Sparkles size={20} className="text-emerald-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-400 mb-1">
                          Estimated Annual Savings
                        </p>
                        <p className="text-2xl font-bold text-white font-space-grotesk">
                          ${roi.costSavings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to="/onboarding" className="block">
                    <GlowButton variant="primary" size="lg" glow className="w-full gap-2">
                      <Zap size={20} />
                      Start Saving Today
                    </GlowButton>
                  </Link>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Comparison Table - Enhanced */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Feature Comparison</GradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Find the perfect fit for your team's needs
              </p>
            </div>
          </RevealText>

          <GlassCard variant="gradient" glow glowColor="purple">
            <GlassCardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                      <th className="text-left p-5 text-white font-bold text-base font-space-grotesk">
                        Feature
                      </th>
                      <th className="text-center p-5 text-white font-bold text-base font-space-grotesk">
                        Starter
                      </th>
                      <th className="text-center p-5 text-white font-bold text-base font-space-grotesk">
                        <div className="flex items-center justify-center gap-2">
                          Professional
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                            Popular
                          </span>
                        </div>
                      </th>
                      <th className="text-center p-5 text-white font-bold text-base font-space-grotesk">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      {
                        feature: 'Leads per month',
                        starter: '1,000',
                        pro: '10,000',
                        enterprise: 'Unlimited',
                      },
                      {
                        feature: 'Emails per month',
                        starter: '5,000',
                        pro: '50,000',
                        enterprise: 'Unlimited',
                      },
                      {
                        feature: 'AI personalization',
                        starter: 'Basic',
                        pro: 'Advanced',
                        enterprise: 'Custom + Training',
                      },
                      { feature: 'Multi-channel sequences', starter: false, pro: true, enterprise: true },
                      { feature: 'Team collaboration', starter: false, pro: true, enterprise: true },
                      { feature: 'CRM integrations', starter: false, pro: true, enterprise: true },
                      { feature: 'Advanced analytics', starter: false, pro: true, enterprise: true },
                      { feature: 'Custom AI training', starter: false, pro: false, enterprise: true },
                      { feature: 'SSO/SAML authentication', starter: false, pro: false, enterprise: true },
                      { feature: 'Dedicated success manager', starter: false, pro: false, enterprise: true },
                      { feature: 'SLA guarantee', starter: false, pro: false, enterprise: '99.9%' },
                      { feature: 'Data residency options', starter: false, pro: false, enterprise: true },
                    ].map((row, i) => (
                      <tr
                        key={`feature-${row.feature}`}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-5 text-gray-200 font-medium">{row.feature}</td>
                        <td className="p-5 text-center text-gray-300">
                          {renderTableCell(row.starter)}
                        </td>
                        <td className="p-5 text-center text-gray-300 bg-purple-500/5">
                          {renderTableCell(row.pro)}
                        </td>
                        <td className="p-5 text-center text-gray-300">
                          {renderTableCell(row.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* CTA Row in Table */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-white/5 border-t border-white/10">
                <div></div>
                <div className="text-center">
                  <Link to="/onboarding">
                    <GlowButtonOutline variant="primary" size="md" className="w-full">
                      Start Free
                    </GlowButtonOutline>
                  </Link>
                </div>
                <div className="text-center">
                  <Link to="/onboarding">
                    <GlowButton variant="primary" size="md" className="w-full" glow>
                      Start Free
                    </GlowButton>
                  </Link>
                </div>
                <div className="text-center">
                  <a href="#contact-sales">
                    <GlowButtonOutline variant="secondary" size="md" className="w-full">
                      Contact Sales
                    </GlowButtonOutline>
                  </a>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Contact Sales Form */}
      <section id="contact-sales" className="py-20 px-4 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />

        <div className="max-w-3xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                <MessageSquare size={16} className="text-purple-400" />
                <span className="text-sm text-purple-300">Enterprise Inquiries</span>
              </div>
              <h2 className="text-lg md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Talk to Our Sales Team</GradientText>
              </h2>
              <p className="text-gray-300">
                Get a personalized demo and custom pricing for your organization
              </p>
            </div>
          </RevealText>

          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <form className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-400 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-400 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="workEmail" className="block text-sm text-gray-400 mb-2">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      id="workEmail"
                      type="email"
                      placeholder="john@company.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm text-gray-400 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        id="company"
                        type="text"
                        placeholder="Acme Inc"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="teamSize" className="block text-sm text-gray-400 mb-2">
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select team size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your outbound goals..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <GlowButton variant="primary" size="lg" glow className="w-full gap-2">
                  <MessageSquare size={18} />
                  Request Demo
                </GlowButton>

                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA */}
      <UnifiedCTA variant="compact" />

      {/* FAQ Section - Enhanced */}
      <section id="faq" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-6">
                <Info size={16} />
                Help Center
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Frequently Asked Questions</GradientText>
              </h2>
              <p className="text-xl text-gray-300">
                Everything you need to know about Artisan AI
              </p>
            </div>
          </RevealText>

          {/* FAQ Grid - Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <GlassCard variant="gradient" glow glowColor="cyan">
            <GlassCardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
                  <MessageSquare className="text-cyan-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-space-grotesk">
                  Still Have Questions?
                </h3>
                <p className="text-gray-300 mb-6">
                  Our team is here to help you find the perfect solution for your needs.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <GlowButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/help')}
                    className="gap-2"
                    glow
                  >
                    <MessageSquare size={18} />
                    Contact Support
                  </GlowButton>
                  <GlowButtonOutline
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/ai-tour')}
                    className="gap-2"
                  >
                    <Play size={18} />
                    Watch Demo
                  </GlowButtonOutline>
                  <GlowButtonOutline
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      const url = 'https://calendly.com/artisan';
                      window.open(url, '_blank');
                    }}
                    className="gap-2"
                  >
                    <Calendar size={18} />
                    Book a Call
                  </GlowButtonOutline>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>
    </AppShell>
  );
};

PricingPage.propTypes = {
  // No props needed - component is self-contained
};

export default PricingPage;

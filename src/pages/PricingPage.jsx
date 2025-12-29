import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  Calculator,
  MessageSquare,
  Mail,
  Phone,
  Building,
  User,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import UnifiedCTA from '../components/features/UnifiedCTA';
import { 
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowButton,
  GlowButtonOutline,
  RevealText,
  ParticleBackground,
  CountUpText,
} from '../components/futuristic';

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for solo founders and small teams',
    features: [
      '1,000 leads per month',
      '5,000 emails per month',
      'Basic AI personalization',
      'Email sequences',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing sales teams',
    features: [
      '10,000 leads per month',
      '50,000 emails per month',
      'Advanced AI personalization',
      'Multi-channel sequences',
      'Advanced analytics',
      'Team collaboration',
      'CRM integrations',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited leads',
      'Unlimited emails',
      'Custom AI training',
      'Dedicated success manager',
      'Custom integrations',
      'SSO/SAML + SCIM',
      'SLA guarantee',
      'Advanced security',
      'Data residency options',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const ROI_DEFAULTS = {
  sdrs: 5,
  costPerSdr: 75000,
  meetingsPerSdr: 10,
};

const PricingPage = () => {
  const location = useLocation();
  const [roiInputs, setRoiInputs] = useState(ROI_DEFAULTS);
  const [showContactForm, setShowContactForm] = useState(false);

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

  // Calculate ROI
  const calculateROI = () => {
    const currentCost = roiInputs.sdrs * roiInputs.costPerSdr;
    const currentMeetings = roiInputs.sdrs * roiInputs.meetingsPerSdr * 12;
    const withAva = {
      cost: currentCost * 0.3 + (299 * 12), // 70% reduction + Ava cost
      meetings: currentMeetings * 3, // 3x meetings
    };
    return {
      costSavings: Math.round(currentCost - withAva.cost),
      meetingsIncrease: Math.round(withAva.meetings - currentMeetings),
      roi: Math.round(((currentCost - withAva.cost) / (299 * 12)) * 100),
    };
  };

  const roi = calculateROI();

  return (
    <AppShell showBanner={false}>
      {/* Hero */}
      <section id="start" className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="default" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
              <CreditCard size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300">Simple, Transparent Pricing</span>
            </div>
          </RevealText>
          
          <RevealText delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Start Free, Scale as You Grow
              </GradientText>
            </h1>
          </RevealText>
          
          <RevealText delay={200}>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
              14-day free trial, no credit card required. 
              Cancel anytime.
            </p>
          </RevealText>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, index) => (
              <RevealText key={plan.name} delay={index * 150}>
                <GlassCard 
                  variant={plan.popular ? 'gradient' : 'default'}
                  hover
                  glow={plan.popular}
                  glowColor="purple"
                  className={`h-full ${plan.popular ? 'scale-105 border-2 border-purple-500/50 relative' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <GlassCard 
                        variant="neon" 
                        padding="px-4 py-1.5" 
                        radius="full"
                        glow
                        glowColor="purple"
                      >
                        <span className="text-sm font-semibold text-white">Most Popular</span>
                      </GlassCard>
                    </div>
                  )}
                  <GlassCardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        <GradientText gradient="cyber">{plan.price}</GradientText>
                      </span>
                      {plan.period && <span className="text-gray-400">{plan.period}</span>}
                    </div>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    
                    {plan.name === 'Enterprise' ? (
                      <a href="#contact-sales">
                        <GlowButtonOutline variant="primary" size="lg" className="w-full mb-6">
                          {plan.cta}
                        </GlowButtonOutline>
                      </a>
                    ) : (
                      <Link to="/onboarding">
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
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          <span className="text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi" className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
        <div className="max-w-5xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
                <Calculator size={16} className="text-cyan-400" />
                <span className="text-sm text-cyan-300">ROI Calculator</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Calculate Your Savings</GradientText>
              </h2>
              <p className="text-gray-300">
                See how much Artisan can save your team
              </p>
            </div>
          </RevealText>

          <GlassCard variant="gradient">
            <GlassCardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white font-space-grotesk mb-4">Your Current Setup</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Number of SDRs</label>
                    <input
                      type="number"
                      value={roiInputs.sdrs}
                      onChange={(e) => setRoiInputs({ ...roiInputs, sdrs: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Average SDR Cost ($/year)</label>
                    <input
                      type="number"
                      value={roiInputs.costPerSdr}
                      onChange={(e) => setRoiInputs({ ...roiInputs, costPerSdr: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Meetings per SDR (monthly)</label>
                    <input
                      type="number"
                      value={roiInputs.meetingsPerSdr}
                      onChange={(e) => setRoiInputs({ ...roiInputs, meetingsPerSdr: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white font-space-grotesk mb-4">With Artisan</h3>
                  
                  <GlassCard variant="default" glow glowColor="cyan">
                    <GlassCardContent className="p-6 text-center">
                      <div className="text-sm text-gray-400 mb-2">Annual Cost Savings</div>
                      <div className="text-4xl font-bold font-space-grotesk">
                        <GradientText gradient="cyber">
                          ${roi.costSavings.toLocaleString()}
                        </GradientText>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                  
                  <GlassCard variant="default" glow glowColor="purple">
                    <GlassCardContent className="p-6 text-center">
                      <div className="text-sm text-gray-400 mb-2">Additional Meetings/Year</div>
                      <div className="text-4xl font-bold font-space-grotesk">
                        <GradientText gradient="aurora">
                          +{roi.meetingsIncrease.toLocaleString()}
                        </GradientText>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                  
                  <GlassCard variant="gradient" glow glowColor="emerald">
                    <GlassCardContent className="p-6 text-center">
                      <div className="text-sm text-gray-400 mb-2">ROI</div>
                      <div className="text-4xl font-bold font-space-grotesk">
                        <GradientText gradient="cyber">
                          {roi.roi}%
                        </GradientText>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Contact Sales Form */}
      <section id="contact-sales" className="py-20 px-6 relative overflow-hidden">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                <MessageSquare size={16} className="text-purple-400" />
                <span className="text-sm text-purple-300">Enterprise Inquiries</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="aurora">Talk to Our Sales Team</GradientText>
              </h2>
              <p className="text-gray-300">
                Get a personalized demo and custom pricing for your organization
              </p>
            </div>
          </RevealText>

          <GlassCard variant="gradient">
            <GlassCardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Work Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      placeholder="john@company.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company</label>
                    <div className="relative">
                      <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Acme Inc"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Team Size</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500">
                    <option value="">Select team size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">How can we help?</label>
                  <textarea
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

      {/* FAQ Preview */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <RevealText>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
                <GradientText gradient="cyber">Common Questions</GradientText>
              </h2>
            </div>
          </RevealText>

          <div className="space-y-4">
            {[
              { q: 'How long is the free trial?', a: '14 days with full access to all features. No credit card required.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time with no penalties.' },
              { q: 'What\'s included in Enterprise?', a: 'Custom AI training, SSO/SAML, dedicated success manager, SLA, and data residency options.' },
              { q: 'Do you offer annual discounts?', a: 'Yes, annual plans receive a 20% discount compared to monthly billing.' },
            ].map((faq, index) => (
              <RevealText key={index} delay={index * 100}>
                <GlassCard variant="default" hover>
                  <GlassCardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 font-space-grotesk">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </GlassCardContent>
                </GlassCard>
              </RevealText>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default PricingPage;

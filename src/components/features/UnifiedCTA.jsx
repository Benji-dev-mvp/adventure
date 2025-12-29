/**
 * UnifiedCTA.jsx
 *
 * A streamlined, data-driven call-to-action component with
 * autonomous animations and interactive elements.
 *
 * CTO Design Principles:
 * - Clear value proposition
 * - Social proof integrated
 * - Minimal friction signup
 * - Visual engagement without distraction
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Shield,
  Zap,
  Clock,
  Users,
  Calendar,
  Play,
} from 'lucide-react';
import {
  GlassCard,
  GradientText,
  GlowText,
  RevealText,
  CountUpText,
  GlowButton,
  GlowButtonOutline,
  FloatingParticles,
  ParticleBackground,
} from '../futuristic';

// ============================================================================
// DATA
// ============================================================================

const TRUST_SIGNALS = [
  { icon: Shield, label: 'SOC 2 Type II' },
  { icon: Zap, label: 'SSO/SCIM Ready' },
  { icon: Clock, label: '24/7 Support' },
  { icon: Users, label: '2,500+ Teams' },
];

const QUICK_STATS = [
  { value: 847, suffix: 'K+', label: 'Meetings Booked' },
  { value: 4.9, suffix: '/5', label: 'G2 Rating' },
  { value: 34, suffix: 'x', label: 'Avg ROI' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UnifiedCTA = ({
  variant = 'full', // 'full' | 'compact' | 'inline'
  headline = 'Ready to Transform Your Pipeline?',
  subheadline = 'Join 2,500+ revenue teams using Ava to book 3x more qualified meetings.',
  showStats = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        ref={containerRef}
        className="py-12 px-4 lg:px-6 relative overflow-hidden bg-gradient-to-r from-purple-900/20 via-[#030712] to-cyan-900/20"
      >
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-6 lg:p-8" variant="gradient" glow glowColor="purple">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                  <GradientText gradient="cyber">{headline}</GradientText>
                </h3>
                <p className="text-gray-400">{subheadline}</p>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/onboarding">
                  <GlowButton
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                  >
                    Start Free Trial
                  </GlowButton>
                </Link>
                <a
                  href="#demo"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Play size={14} />
                  Watch Demo
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div
        ref={containerRef}
        className="py-8 px-4 lg:px-6 border-y border-white/10 bg-white/[0.02]"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <Sparkles size={24} className="text-cyan-400 animate-pulse" />
          <span className="text-gray-300">{subheadline}</span>
          <Link to="/onboarding">
            <GlowButton variant="primary" size="md">
              Get Started
            </GlowButton>
          </Link>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <section
      ref={containerRef}
      id="unified-cta"
      className="py-20 lg:py-28 px-4 lg:px-6 relative overflow-hidden bg-[#030712]"
    >
      {/* Background */}
      <ParticleBackground variant="aurora" className="absolute inset-0 opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-900/30 via-purple-900/10 to-transparent blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA Card */}
        <RevealText>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated border */}
            <div
              className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
            />

            <GlassCard
              variant="gradient"
              blur="2xl"
              radius="3xl"
              className="relative p-8 lg:p-12 xl:p-16 overflow-hidden"
            >
              {/* Floating particles */}
              <FloatingParticles count={15} color="mixed" />

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 mb-8">
                  <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                  <span className="text-sm font-medium text-white">
                    Limited: 2 months free on annual plans
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-6 font-space-grotesk">
                  <GradientText gradient="aurora" animate>
                    {headline}
                  </GradientText>
                </h2>

                {/* Subheadline */}
                <p className="text-lg lg:text-xl text-gray-300 mb-10">{subheadline}</p>

                {/* CTA Form */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <div className="relative w-full max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your work email"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                  <Link to="/onboarding">
                    <GlowButton
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight size={20} />}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                      glow
                    >
                      Start Free Trial
                    </GlowButton>
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {TRUST_SIGNALS.map((signal, index) => {
                    const Icon = signal.icon;
                    return (
                      <div
                        key={signal.label}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Icon size={14} className="text-cyan-400" />
                        {signal.label}
                      </div>
                    );
                  })}
                </div>

                {/* No credit card */}
                <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  No credit card required • 14-day free trial
                </p>
              </div>
            </GlassCard>
          </div>
        </RevealText>

        {/* Stats row */}
        {showStats && (
          <RevealText delay={200}>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {QUICK_STATS.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    <CountUpText
                      end={isVisible ? stat.value : 0}
                      duration={1500}
                      delay={index * 200}
                      decimals={stat.value < 10 ? 1 : 0}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealText>
        )}

        {/* Social proof */}
        <RevealText delay={400}>
          <div className="mt-12 flex flex-col items-center">
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#030712] flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCodePoint(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#030712] flex items-center justify-center text-white text-xs">
                +2.5K
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <p className="text-sm text-gray-400">
              Trusted by <span className="text-white font-medium">2,500+ revenue teams</span>{' '}
              worldwide
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
};

UnifiedCTA.propTypes = {
  variant: PropTypes.oneOf(['full', 'compact', 'inline']),
  headline: PropTypes.string,
  subheadline: PropTypes.string,
  showStats: PropTypes.bool,
};

export default UnifiedCTA;

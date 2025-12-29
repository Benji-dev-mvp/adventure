import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ParticleBackground, FloatingParticles, MouseFollowGlow } from '../futuristic';
import { GradientText, GlowText, RevealText, TypewriterText } from '../futuristic/AnimatedText';
import { GlowButton } from '../futuristic/GlowButton';
import { GlassCard } from '../futuristic/GlassCard';
import { useIntersectionAnimation } from '../../hooks/useAnimations';

const HeroSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    jobTitle: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.1 });

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailFocus = () => {
    setIsExpanded(true);
  };

  const trustBadges = ['SOC 2 Type II', 'SSO & SCIM', 'GDPR Ready', '99.95% Uptime'];

  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-6 tablet:px-10">
      {/* Futuristic Particle Background */}
      <ParticleBackground variant="aurora" className="absolute inset-0" />

      {/* Mouse-following glow effect */}
      <MouseFollowGlow size={500} color="purple" opacity={0.12} />

      {/* Floating particles */}
      <FloatingParticles count={40} color="mixed" />

      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div
        ref={ref}
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left column: messaging + form */}
        <div className="space-y-6 text-left">
          <RevealText delay={0}>
            <GlassCard
              variant="neon"
              padding="px-4 py-2"
              radius="full"
              className="inline-flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-white">Enterprise-grade outbound OS</span>
            </GlassCard>
          </RevealText>

          <RevealText delay={100}>
            <div className="text-4xl tablet:text-5xl lg:text-6xl font-bold leading-tight tracking-tight space-y-2">
              <h1 className="font-space-grotesk">
                <GradientText gradient="cyber" animate>
                  Pipeline that is governed, compliant, and on autopilot.
                </GradientText>
              </h1>
              <h2 className="font-space-grotesk">
                <GlowText color="purple" intensity={1.2}>
                  Built for global enterprise sales teams.
                </GlowText>
              </h2>
            </div>
          </RevealText>

          <RevealText delay={200}>
            <p className="text-lg tablet:text-xl text-gray-300 max-w-2xl">
              <TypewriterText
                text="Ava, your AI BDR, runs outbound with the controls enterprises require: policy-driven sending, rigorous security, and executive-level reporting."
                speed={20}
                delay={500}
              />
            </p>
          </RevealText>

          <RevealText delay={300}>
            <div className="flex flex-wrap items-center gap-3">
              {trustBadges.map((badge, index) => (
                <GlassCard
                  key={badge}
                  variant="default"
                  padding="px-4 py-2"
                  radius="full"
                  hover
                  className="text-sm font-semibold text-white"
                >
                  {badge}
                </GlassCard>
              ))}
            </div>
          </RevealText>

          <RevealText delay={400}>
            <div className="w-full max-w-xl mt-2">
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleEmailFocus}
                    placeholder="vp.revenue@enterprise.com"
                    required
                    className="relative w-full bg-white/5 backdrop-blur-xl text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-2xl transition duration-300 border border-white/20"
                  />
                </div>

                {isExpanded && (
                  <>
                    <div className="relative group animate-fadeIn">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Alex Morgan"
                        required
                        className="relative w-full bg-white/5 backdrop-blur-xl text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-2xl transition duration-300 border border-white/20"
                      />
                    </div>

                    <div className="relative group animate-fadeIn">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md" />
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="VP of Sales"
                        required
                        className="relative w-full bg-white/5 backdrop-blur-xl text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-2xl transition duration-300 border border-white/20"
                      />
                    </div>

                    <GlowButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="w-5 h-5" />}
                      iconPosition="right"
                      onClick={handleSubmit}
                      className="animate-fadeIn"
                    >
                      Book Enterprise Demo
                    </GlowButton>
                  </>
                )}

                {!isExpanded && (
                  <p className="text-sm text-gray-400">
                    Trusted by global revenue teams to govern AI-driven outbound
                  </p>
                )}
              </form>
            </div>
          </RevealText>

          <RevealText delay={500}>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span>Live deliverability safeguards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                <span>Role-based access and approvals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <span>Executive-grade reporting</span>
              </div>
            </div>
          </RevealText>
        </div>

        {/* Right column: enterprise control card */}
        <RevealText delay={300} direction="scale">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
            <GlassCard
              variant="gradient"
              blur="2xl"
              radius="xl"
              tilt
              glow
              glowColor="purple"
              className="relative shadow-2xl p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                    Enterprise control center
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1 font-space-grotesk">
                    Realtime governance dashboard
                  </h3>
                </div>
                <GlassCard
                  variant="neon"
                  padding="px-3 py-1"
                  radius="full"
                  className="flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="text-green-400 text-xs font-semibold">Live</span>
                </GlassCard>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Deliverability health',
                    value: '98.8%',
                    color: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
                  },
                  {
                    label: 'Sequence coverage',
                    value: '4.2M',
                    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
                  },
                  {
                    label: 'Data residency',
                    value: 'US / EU',
                    color:
                      'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
                  },
                  {
                    label: 'Uptime (90d)',
                    value: '99.96%',
                    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
                  },
                ].map(metric => (
                  <div
                    key={metric.label}
                    className={`rounded-2xl border p-4 bg-gradient-to-br backdrop-blur-sm ${metric.color} hover:scale-105 transition-transform duration-300`}
                  >
                    <p className="text-sm text-gray-300 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-purple-500/30 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-white">Guardrails enabled</p>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/20 border border-green-500/50 px-2 py-1 rounded-full">
                    Compliant
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span>SOC 2 controls enforced across mailboxes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    <span>SSO, SCIM, and RBAC with audit trails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                    <span>Consent, geo, and sending policy automation</span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>
        </RevealText>
      </div>
    </section>
  );
};

export default HeroSection;

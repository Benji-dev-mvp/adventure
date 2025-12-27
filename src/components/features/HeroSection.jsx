import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const HeroSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    jobTitle: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e) => {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-32 pb-24 px-6 tablet:px-10">
      {/* Animated gradient orbs */}
      <div className="absolute -left-10 -top-10 w-96 h-96 bg-gradient-purple-coral opacity-30 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-gradient-magenta opacity-20 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-3xl animate-float" />
      
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left column: messaging + form */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full glass-dark border border-white/20 px-4 py-2 text-sm font-semibold text-white shine">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Enterprise-grade outbound OS
          </div>

          <div className="text-4xl tablet:text-5xl lg:text-6xl font-bold leading-tight tracking-tight space-y-2">
            <h1 className="text-white font-space-grotesk">Pipeline that is governed, compliant, and on autopilot.</h1>
            <h2 className="gradient-text-alt font-space-grotesk glow-magenta">Built for global enterprise sales teams.</h2>
          </div>

          <p className="text-lg tablet:text-xl text-gray-300 max-w-2xl">
            Ava, your AI BDR, runs outbound with the controls enterprises require: policy-driven sending, rigorous security, and executive-level reporting.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {trustBadges.map((badge) => (
              <div key={badge} className="px-4 py-2 rounded-full glass-dark border border-white/10 text-sm font-semibold text-white hover-lift">
                {badge}
              </div>
            ))}
          </div>

          <div className="w-full max-w-xl mt-2">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md glow"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleEmailFocus}
                  placeholder="vp.revenue@enterprise.com"
                  required
                  className="relative w-full glass-dark text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xl transition duration-300 border border-white/20"
                />
              </div>

              {isExpanded && (
                <>
                  <div className="relative group animate-fadeIn">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md glow"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Alex Morgan"
                      required
                      className="relative w-full glass-dark text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xl transition duration-300 border border-white/20"
                    />
                  </div>

                  <div className="relative group animate-fadeIn">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-75 transition-opacity duration-300 blur-md glow"
                    />
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="VP of Sales"
                      required
                      className="relative w-full glass-dark text-white rounded-3xl px-6 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xl transition duration-300 border border-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative flex items-center justify-center gap-3 w-full gradient-mesh text-white font-bold rounded-full py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] animate-fadeIn glow shine"
                  >
                    <span>Book Enterprise Demo</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </>
              )}

              {!isExpanded && (
                <p className="text-sm text-gray-400">
                  Trusted by global revenue teams to govern AI-driven outbound
                </p>
              )}
            </form>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span>Live deliverability safeguards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Role-based access and approvals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span>Executive-grade reporting</span>
            </div>
          </div>
        </div>

        {/* Right column: enterprise control card */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-blue-600/30 blur-3xl animate-pulse-slow" />
          <div className="relative futuristic-card rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Enterprise control center</p>
                <h3 className="text-2xl font-bold text-white mt-1 font-space-grotesk">Realtime governance dashboard</h3>
              </div>
              <div className="px-3 py-1 rounded-full glass border border-green-500/50 text-green-400 text-xs font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Deliverability health', value: '98.8%', tone: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400' }, { label: 'Sequence coverage', value: '4.2M', tone: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400' }, { label: 'Data residency', value: 'US / EU', tone: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400' }, { label: 'Uptime (90d)', value: '99.96%', tone: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400' }].map((metric) => (
                <div key={metric.label} className={`rounded-2xl border p-4 glass bg-gradient-to-br ${metric.tone} hover-lift`}>
                  <p className="text-sm text-gray-300 mb-1">{metric.label}</p>
                  <p className={`text-xl font-bold`}>{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-purple-500/30 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 glass">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">Guardrails enabled</p>
                <span className="text-xs font-semibold text-green-400 glass border border-green-500/50 px-2 py-1 rounded-full">Compliant</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500 glow" /> SOC 2 controls enforced across mailboxes</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500 glow" /> SSO, SCIM, and RBAC with audit trails</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500 glow" /> Consent, geo, and sending policy automation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

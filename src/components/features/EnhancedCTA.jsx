import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  CheckCircle2,
  Play,
  Star,
  Globe,
  Lock,
  Headphones,
} from 'lucide-react';
import {
  GlassCard,
  GlassCardContent,
  GradientText,
  GlowText,
  RevealText,
  CountUpText,
  ParticleBackground,
  FloatingParticles,
  GlowButton,
  GlowButtonOutline,
  TypewriterText,
} from '../futuristic';

// Animated benefit card
const BenefitCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="w-10 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
          <Icon size={20} className="text-cyan-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Animated trust badge
const TrustBadge = ({ icon: Icon, label, value, delay = 0 }) => {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon size={16} className="text-cyan-400" />
      <span className="text-sm text-gray-300">
        <span className="font-semibold text-white">{value}</span> {label}
      </span>
    </div>
  );
};

TrustBadge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  delay: PropTypes.number,
};

// Floating testimonial bubble
const TestimonialBubble = ({ quote, author, role, company, avatar, position, delay = 0 }) => {
  return (
    <div
      className={`absolute ${position} max-w-xs animate-float opacity-0`}
      style={{
        animationDelay: `${delay}ms`,
        animation: `fadeIn 0.5s ease-out ${delay}ms forwards, float 6s ease-in-out infinite ${delay}ms`,
      }}
    >
      <GlassCard variant="default" className="p-4" blur="xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {avatar || author[0]}
          </div>
          <div>
            <p className="text-sm text-gray-300 italic mb-2">"{quote}"</p>
            <div className="text-xs">
              <span className="text-white font-medium">{author}</span>
              <span className="text-gray-500">
                {' '}
                • {role} at {company}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

TestimonialBubble.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  position: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

TestimonialBubble.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  position: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

// Main CTA component
const EnhancedCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Go live in under 5 minutes with our guided onboarding',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II, GDPR, and CCPA compliant out of the box',
    },
    {
      icon: Users,
      title: 'Dedicated Success',
      description: 'Personal CSM for teams over 10 seats',
    },
    {
      icon: Clock,
      title: 'Time Savings',
      description: 'Save 20+ hours per SDR per week on prospecting',
    },
  ];

  const trustBadges = [
    { icon: Shield, label: 'Type II Certified', value: 'SOC 2' },
    { icon: Lock, label: 'Single Sign-On', value: 'SSO/SCIM' },
    { icon: Headphones, label: 'Support', value: '24/7' },
    { icon: Globe, label: 'Uptime SLA', value: '99.9%' },
  ];

  const testimonials = [
    {
      quote: 'Ava booked 47 meetings in our first month. Game changer.',
      author: 'Sarah Chen',
      role: 'VP Sales',
      company: 'TechCorp',
      position: 'top-0 left-0 -translate-x-1/2 -translate-y-1/4',
    },
    {
      quote: 'Finally, enterprise-grade AI that our security team approves.',
      author: 'Michael Ross',
      role: 'CISO',
      company: 'FinanceHub',
      position: 'top-1/4 right-0 translate-x-1/3',
    },
    {
      quote: 'Cut our CAC by 60% while tripling qualified pipeline.',
      author: 'Emma Watson',
      role: 'CRO',
      company: 'ScaleUp',
      position: 'bottom-0 left-1/4 translate-y-1/4',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="enhanced-cta"
      className="py-24 px-4 relative overflow-hidden bg-[#030712]"
    >
      {/* Background effects */}
      <ParticleBackground variant="aurora" className="absolute inset-0" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-purple-900/30 via-purple-900/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/20 to-transparent blur-3xl" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-radial from-pink-900/20 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Floating testimonials - desktop only */}
        <div className="hidden xl:block">
          {testimonials.map((testimonial, index) => (
            <TestimonialBubble key={index} {...testimonial} delay={1000 + index * 500} />
          ))}
        </div>

        {/* Main CTA card */}
        <RevealText>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            role="region"
            aria-label="Call to action"
          >
            {/* Animated border */}
            <div
              className={`absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`}
            />
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl animate-pulse opacity-30" />

            <GlassCard
              variant="gradient"
              blur="2xl"
              radius="3xl"
              className="relative p-12 md:p-16 lg:p-20 overflow-hidden"
            >
              {/* Floating particles inside */}
              <FloatingParticles count={25} color="mixed" />

              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-20 border border-cyan-500/20 rounded-full animate-ping-slow" />
              <div className="absolute bottom-10 right-10 w-32 h-32 border border-purple-500/20 rounded-full animate-ping-slow animation-delay-1000" />
              <div className="absolute top-1/2 left-5 w-2 h-20 bg-gradient-to-b from-cyan-500/50 to-transparent rounded-full" />
              <div className="absolute top-1/4 right-5 w-2 h-16 bg-gradient-to-b from-purple-500/50 to-transparent rounded-full" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 mb-8">
                    <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                    <span className="text-sm font-medium">
                      <GlowText color="cyan">Limited time: 2 months free on annual plans</GlowText>
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space-grotesk leading-tight">
                    <GradientText gradient="aurora" animate>
                      Ready to Transform
                    </GradientText>
                    <br />
                    <span className="text-white">Your Outbound?</span>
                  </h2>

                  {/* Subheadline with typewriter effect */}
                  <div className="text-lg text-gray-300 mb-8 h-16">
                    {isVisible && (
                      <TypewriterText
                        text="Join 2,500+ revenue teams using Ava to book 3x more qualified meetings with 80% less effort."
                        speed={30}
                        className="text-gray-300"
                      />
                    )}
                  </div>

                  {/* CTA Form */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your work email"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 pointer-events-none" />
                    </div>
                    <Link to="/onboarding">
                      <GlowButton
                        variant="primary"
                        size="lg"
                        icon={<ArrowRight size={20} />}
                        iconPosition="right"
                        className="w-full sm:w-auto whitespace-nowrap"
                        glow
                      >
                        Start Free Trial
                      </GlowButton>
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {trustBadges.map((badge, index) => (
                      <TrustBadge key={index} {...badge} delay={index * 100} />
                    ))}
                  </div>

                  {/* No credit card */}
                  <p className="mt-6 text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    No credit card required • 14-day free trial • Cancel anytime
                  </p>
                </div>

                {/* Right: Benefits */}
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <BenefitCard
                      key={index}
                      {...benefit}
                      delay={isVisible ? 300 + index * 150 : 0}
                    />
                  ))}

                  {/* Social proof */}
                  <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className="w-10 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0f0f23] flex items-center justify-center text-white text-xs font-bold"
                          >
                            {String.fromCodePoint(64 + i)}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">2,500+ teams</span> trust Ava to
                      power their outbound. Rated{' '}
                      <span className="font-semibold text-white">4.9/5</span> on G2.
                    </p>
                  </div>

                  {/* Demo button */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <GlowButtonOutline variant="secondary" size="md">
                      <Play size={16} className="mr-2" />
                      Watch 2-min Demo
                    </GlowButtonOutline>
                    <a
                      href="#security"
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      Talk to Sales <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </RevealText>

        {/* Bottom stats bar */}
        <RevealText delay={500}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Meetings Booked', value: 847000, suffix: '+' },
              { label: 'Pipeline Generated', value: 2.4, prefix: '$', suffix: 'B+' },
              { label: 'Hours Saved', value: 12, suffix: 'M+' },
              { label: 'Enterprise Customers', value: 450, suffix: '+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg md:text-4xl font-bold mb-2 font-space-grotesk">
                  <GradientText gradient="cyber">
                    {stat.prefix}
                    <CountUpText
                      end={isVisible ? stat.value : 0}
                      duration={2000}
                      delay={index * 200}
                      decimals={stat.value < 100 ? 1 : 0}
                    />
                    {stat.suffix}
                  </GradientText>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealText>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default EnhancedCTA;

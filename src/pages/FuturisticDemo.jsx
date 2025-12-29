/**
 * Futuristic Components Demo Page
 */
import React from 'react';
import {
  HeroSection,
  HeroWithCards,
  GlassCard,
  FeatureCard,
  StatCard,
  GlowButton,
  GlowButtonOutline,
  GradientText,
  GlowText,
  TypewriterText,
  RevealText,
  CountUpText,
  ParticleBackground,
  FloatingParticles,
} from '../components/futuristic';
import { Zap, Shield, Rocket, Star, TrendingUp, Users } from 'lucide-react';

export default function FuturisticDemo() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero Section */}
      <HeroSection
        badge="✨ New Futuristic Components"
        title="The Future is Here"
        subtitle="Experience next-generation UI components"
        description="Beautiful glassmorphism, stunning animations, and immersive visual effects for your modern web applications."
        primaryCTA={{ label: 'Get Started', onClick: () => alert('Get Started clicked!') }}
        secondaryCTA={{ label: 'Watch Demo', onClick: () => alert('Demo clicked!') }}
        backgroundVariant="aurora"
      />

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <ParticleBackground variant="minimal" className="absolute inset-0" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <RevealText>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <GradientText gradient="cyber">Stunning Features</GradientText>
              </h2>
            </RevealText>
            <RevealText delay={200}>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Everything you need to build beautiful, futuristic interfaces
              </p>
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealText delay={300}>
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="Optimized animations with GPU acceleration and reduced motion support"
              />
            </RevealText>
            <RevealText delay={400}>
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Accessible"
                description="Full accessibility support with prefers-reduced-motion detection"
              />
            </RevealText>
            <RevealText delay={500}>
              <FeatureCard
                icon={<Rocket className="w-6 h-6" />}
                title="Modern Design"
                description="Glassmorphism, gradients, and glow effects for stunning visuals"
              />
            </RevealText>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              value={<CountUpText end={10000} suffix="+" />}
              label="Happy Users"
              trend="+25%"
              trendDirection="up"
            />
            <StatCard
              icon={<Star className="w-5 h-5" />}
              value={<CountUpText end={4.9} decimals={1} />}
              label="Rating"
            />
            <StatCard
              icon={<Rocket className="w-5 h-5" />}
              value={<CountUpText end={50} suffix="+" />}
              label="Components"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              value={<CountUpText end={99} suffix="%" />}
              label="Satisfaction"
              trend="+12%"
              trendDirection="up"
            />
          </div>
        </div>
      </section>

      {/* Buttons Showcase */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            <GlowText color="cyan">Button Variants</GlowText>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <GlowButton variant="primary">Primary</GlowButton>
            <GlowButton variant="secondary">Secondary</GlowButton>
            <GlowButton variant="success">Success</GlowButton>
            <GlowButton variant="ghost">Ghost</GlowButton>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <GlowButtonOutline variant="primary">Outline Primary</GlowButtonOutline>
            <GlowButtonOutline variant="secondary">Outline Secondary</GlowButtonOutline>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <GlowButton size="sm">Small</GlowButton>
            <GlowButton size="md">Medium</GlowButton>
            <GlowButton size="lg">Large</GlowButton>
            <GlowButton size="xl">Extra Large</GlowButton>
          </div>
        </div>
      </section>

      {/* Glass Cards Showcase */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            <GradientText gradient="aurora">Glass Card Variants</GradientText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" hover glow>
              <h3 className="text-xl font-semibold text-white mb-2">Default</h3>
              <p className="text-white/60">Standard glass effect with hover and glow</p>
            </GlassCard>
            
            <GlassCard variant="neon" hover glow glowColor="cyan">
              <h3 className="text-xl font-semibold text-white mb-2">Neon</h3>
              <p className="text-white/60">Neon variant with cyan glow effect</p>
            </GlassCard>
            
            <GlassCard variant="gradient" tilt>
              <h3 className="text-xl font-semibold text-white mb-2">With Tilt</h3>
              <p className="text-white/60">Gradient variant with 3D tilt on hover</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Text Effects */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-white mb-12">Text Effects</h2>
          
          <div className="space-y-6">
            <p className="text-2xl">
              <TypewriterText text="This text types itself letter by letter..." speed={50} />
            </p>
            
            <p className="text-3xl font-bold">
              <GradientText gradient="cyber">Animated Gradient Text</GradientText>
            </p>
            
            <p className="text-3xl font-bold">
              <GlowText color="cyan" pulse>Pulsing Neon Glow</GlowText>
            </p>
            
            <p className="text-3xl font-bold">
              <GlowText color="purple">Purple Glow Effect</GlowText>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center">
        <p className="text-white/40">
          Built with ❤️ using Futuristic Components
        </p>
      </footer>
    </div>
  );
}

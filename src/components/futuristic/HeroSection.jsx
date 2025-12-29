/**
 * HeroSection - Futuristic hero component with all effects combined
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ParticleBackground, FloatingParticles, MouseFollowGlow } from './ParticleBackground';
import { GlowButton, GlowButtonOutline } from './GlowButton';
import { GlassCard } from './GlassCard';
import { TypewriterText, GradientText, SplitText, RevealText } from './AnimatedText';
import { useIntersectionAnimation, usePrefersReducedMotion } from '../../hooks/useAnimations';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

/**
 * HeroSection - Main hero component
 */
export function HeroSection({
  title = 'The Future is Here',
  subtitle = 'Experience the next generation of innovation',
  description = 'Build something extraordinary with cutting-edge technology and beautiful design.',
  primaryCTA = { label: 'Get Started', onClick: () => {} },
  secondaryCTA = { label: 'Learn More', onClick: () => {} },
  badge,
  backgroundVariant = 'default',
  showFloatingParticles = true,
  showMouseGlow = true,
  className='',
  children,
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <ParticleBackground variant={backgroundVariant} className={`min-h-screen ${className}`}>
      {/* Mouse follow glow */}
      {showMouseGlow && <MouseFollowGlow size={600} opacity={0.1} />}

      {/* Floating particles */}
      {showFloatingParticles && <FloatingParticles count={30} color="mixed" />}

      {/* Content container */}
      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20"
      >
        {/* Badge */}
        {badge && (
          <RevealText delay={0} className="mb-8">
            <GlassCard
              variant="neon"
              padding="px-4 py-2"
              radius="full"
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white/90">{badge}</span>
            </GlassCard>
          </RevealText>
        )}

        {/* Main heading */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            {prefersReducedMotion ? (
              <GradientText gradient="cyber">{title}</GradientText>
            ) : (
              <SplitText
                text={title}
                staggerDelay={80}
                delay={200}
                className="block"
                wordClassName="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              />
            )}
          </h1>

          {/* Subtitle */}
          <RevealText delay={400} duration={600}>
            <p className="text-lg sm:text-lg md:text-lg text-white/80 font-light mb-8">
              {prefersReducedMotion ? (
                subtitle
              ) : (
                <TypewriterText text={subtitle} speed={30} delay={800} />
              )}
            </p>
          </RevealText>

          {/* Description */}
          <RevealText delay={600}>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">{description}</p>
          </RevealText>

          {/* CTA Buttons */}
          <RevealText delay={800}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <GlowButton
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                onClick={primaryCTA.onClick}
              >
                {primaryCTA.label}
              </GlowButton>

              <GlowButtonOutline variant="secondary" size="lg" onClick={secondaryCTA.onClick}>
                <Play className="w-5 h-5 mr-2" />
                {secondaryCTA.label}
              </GlowButtonOutline>
            </div>
          </RevealText>
        </div>

        {/* Optional children for additional content */}
        {children && <div className="mt-16 w-full max-w-6xl mx-auto">{children}</div>}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </ParticleBackground>
  );
}

HeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  primaryCTA: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  secondaryCTA: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  badge: PropTypes.string,
  backgroundVariant: PropTypes.string,
  showFloatingParticles: PropTypes.bool,
  showMouseGlow: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * HeroWithCards - Hero section with feature cards
 */
export function HeroWithCards({ title, subtitle, description, features = [], ...heroProps }) {
  return (
    <HeroSection title={title} subtitle={subtitle} description={description} {...heroProps}>
      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-12">
          {features.map((feature, index) => (
            <RevealText key={index} delay={1000 + index * 100} direction="up">
              <GlassCard hover glow tilt className="h-full">
                {feature.icon && (
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </GlassCard>
            </RevealText>
          ))}
        </div>
      )}
    </HeroSection>
  );
}

HeroWithCards.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

/**
 * HeroMinimal - Minimal hero for landing pages
 */
export function HeroMinimal({ title, subtitle, cta, className='' }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#030712] ${className}`}
    >
      {/* Background glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,245,255,0.1) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <RevealText delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <GradientText gradient="cyber">{title}</GradientText>
          </h1>
        </RevealText>

        <RevealText delay={300}>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">{subtitle}</p>
        </RevealText>

        {cta && (
          <RevealText delay={500}>
            <GlowButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={cta.onClick}
            >
              {cta.label}
            </GlowButton>
          </RevealText>
        )}
      </div>
    </div>
  );
}

HeroMinimal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  className: PropTypes.string,
};

/**
 * HeroSplit - Split layout hero with image/visual on one side
 */
export function HeroSplit({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  visual,
  reversed = false,
  className='',
}) {
  return (
    <ParticleBackground variant="minimal" className={`min-h-screen ${className}`}>
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* Text content */}
          <div className={`space-y-8 ${reversed ? 'lg:order-2' : ''}`}>
            <RevealText delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <GradientText gradient="cyber">{title}</GradientText>
              </h1>
            </RevealText>

            <RevealText delay={300}>
              <p className="text-lg text-white/80">{subtitle}</p>
            </RevealText>

            <RevealText delay={500}>
              <p className="text-lg text-white/60">{description}</p>
            </RevealText>

            <RevealText delay={700}>
              <div className="flex flex-col sm:flex-row gap-3">
                {primaryCTA && (
                  <GlowButton
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                    onClick={primaryCTA.onClick}
                  >
                    {primaryCTA.label}
                  </GlowButton>
                )}
                {secondaryCTA && (
                  <GlowButton variant="ghost" size="lg" onClick={secondaryCTA.onClick}>
                    {secondaryCTA.label}
                  </GlowButton>
                )}
              </div>
            </RevealText>
          </div>

          {/* Visual content */}
          <div className={`${reversed ? 'lg:order-1' : ''}`}>
            <RevealText delay={400} direction="scale">
              {visual || (
                <GlassCard
                  variant="gradient"
                  className="aspect-square flex items-center justify-center"
                  tilt
                >
                  <div className="text-6xl">🚀</div>
                </GlassCard>
              )}
            </RevealText>
          </div>
        </div>
      </div>
    </ParticleBackground>
  );
}

HeroSplit.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string,
  primaryCTA: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  secondaryCTA: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  visual: PropTypes.node,
  reversed: PropTypes.bool,
  className: PropTypes.string,
};

export default HeroSection;

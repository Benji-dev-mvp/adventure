import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import {
  ParticleBackground,
  GlassCard,
  GradientText,
  GlowButton,
  GlowButtonOutline,
} from '../futuristic';
import { useReducedMotion, getMotionConfig } from '../../hooks/useMotion';
import PropTypes from 'prop-types';

/**
 * Shared hero section for Solution pages
 * Eliminates 35% duplication across Startup/Midmarket/Enterprise pages
 */
const SolutionHero = ({ icon: Icon, segment, title, subtitle, description, stats }) => {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = getMotionConfig('fadeIn', prefersReducedMotion);
  const staggerContainer = getMotionConfig('staggerContainer', prefersReducedMotion);
  const staggerItem = getMotionConfig('staggerItem', prefersReducedMotion);

  return (
    <section className="relative pt-20 pb-24 px-4 overflow-hidden">
      <ParticleBackground variant="default" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div {...fadeIn} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
            <Icon className="w-4 h-4" />
            {segment}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
            <GradientText gradient="aurora">{title}</GradientText>
          </h1>
          <p className="text-lg text-gray-300 mb-4 font-space-grotesk">{subtitle}</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">{description}</p>

          {/* Quick Stats */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} {...staggerItem}>
                <GlassCard variant="default" hover className="text-center">
                  <div className="text-lg font-bold font-space-grotesk mb-1">
                    <GradientText gradient="cyber">
                      {stat.value}
                      {stat.suffix || ''}
                    </GradientText>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/pricing#start">
              <GlowButton variant="primary" size="lg" glow className="gap-2">
                <Sparkles size={18} />
                Start Free Trial
              </GlowButton>
            </Link>
            <Link to="/ai-tour">
              <GlowButtonOutline variant="secondary" size="lg" className="gap-2">
                <Play size={18} />
                Watch Ava in Action
              </GlowButtonOutline>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

SolutionHero.propTypes = {
  icon: PropTypes.elementType.isRequired,
  segment: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      suffix: PropTypes.string,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SolutionHero;

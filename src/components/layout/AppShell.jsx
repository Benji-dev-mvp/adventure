import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Play,
  Workflow,
  Server,
  Shield,
  Users,
  CreditCard,
  LogIn,
  MessageSquare,
  Rocket,
  Building2,
  Building,
} from 'lucide-react';
import AnnouncementBanner from '../features/AnnouncementBanner';
import { useReducedMotion } from '../../hooks/useMotion';
import { GlassCard, GradientText, GlowButton, GlowButtonOutline } from '../futuristic';

// Solutions dropdown items
const SOLUTIONS = [
  {
    path: '/solutions/startups',
    label: 'Startups',
    icon: Rocket,
    description: 'Hire Ava to manage your entire outbound operation',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    path: '/solutions/midmarket',
    label: 'Midmarket',
    icon: Building2,
    description: 'Automate 80% of manual outbound tasks',
    color: 'from-purple-500 to-pink-500',
  },
  {
    path: '/solutions/enterprise',
    label: 'Enterprise',
    icon: Building,
    description: 'Top-tier tools for every outbound stage',
    color: 'from-orange-500 to-red-500',
  },
];

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Sparkles },
  { path: '/ai-tour', label: 'AI Tour', icon: Play },
  { path: '/flow', label: 'Flow', icon: Workflow },
  { path: '/platform', label: 'Platform', icon: Server },
  { path: '/security', label: 'Security', icon: Shield },
  { type: 'dropdown', label: 'Solutions', icon: Users, items: SOLUTIONS },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
];

// Solutions Dropdown Component
const SolutionsDropdown = ({ isOpen, onClose, prefersReducedMotion }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 z-50"
        >
          <GlassCard
            variant="default"
            className="border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-2">
              {SOLUTIONS.map((solution, index) => {
                const Icon = solution.icon;
                return (
                  <Link
                    key={solution.path}
                    to={solution.path}
                    onClick={onClose}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${solution.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {solution.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{solution.description}</div>
                    </div>
                  </Link>
                );
              })}
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  to="/customers"
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Users size={16} />
                  View Customer Stories →
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppShell = ({ children, showBanner = true }) => {
  const [bannerVisible, setBannerVisible] = useState(showBanner);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Close dropdowns on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setMobileMenuOpen(false);
    setMobileSolutionsOpen(false);
  }, [location.pathname]);

  const isSolutionsActive = location.pathname.startsWith('/solutions');

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      {/* Announcement Banner */}
      {bannerVisible && <AnnouncementBanner onClose={() => setBannerVisible(false)} />}

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <GlassCard
                variant="neon"
                padding="p-2"
                radius="lg"
                glow
                glowColor="purple"
                className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-lg">A</span>
              </GlassCard>
              <span className="font-bold text-xl font-space-grotesk hidden sm:block">
                <GradientText gradient="aurora">Artisan</GradientText>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                if (item.type === 'dropdown') {
                  return (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => setSolutionsOpen(!solutionsOpen)}
                        onMouseEnter={() => setSolutionsOpen(true)}
                        className={`
                          relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          flex items-center gap-1
                          ${
                            isSolutionsActive
                              ? 'text-cyan-400 bg-cyan-400/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${solutionsOpen ? 'rotate-180' : ''}`}
                        />
                        {isSolutionsActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                        )}
                      </button>
                      <div onMouseLeave={() => setSolutionsOpen(false)}>
                        <SolutionsDropdown
                          isOpen={solutionsOpen}
                          onClose={() => setSolutionsOpen(false)}
                          prefersReducedMotion={prefersReducedMotion}
                        />
                      </div>
                    </div>
                  );
                }

                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? 'text-cyan-400 bg-cyan-400/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden sm:block">
                <GlowButtonOutline variant="ghost" size="sm" className="gap-2">
                  <LogIn size={16} />
                  Login
                </GlowButtonOutline>
              </Link>
              <Link to="/pricing#contact-sales" className="hidden md:block">
                <GlowButtonOutline variant="secondary" size="sm" className="gap-2">
                  <MessageSquare size={16} />
                  Talk to Sales
                </GlowButtonOutline>
              </Link>
              <Link to="/pricing#start">
                <GlowButton variant="primary" size="sm" glow className="hidden sm:flex">
                  Start Free
                </GlowButton>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 bg-[#030712]/95 backdrop-blur-xl overflow-hidden"
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {NAV_ITEMS.map(item => {
                  if (item.type === 'dropdown') {
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                            ${
                              isSolutionsActive
                                ? 'text-cyan-400 bg-cyan-400/10'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            {item.label}
                          </div>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileSolutionsOpen && (
                            <motion.div
                              initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                              className="pl-8 space-y-1 overflow-hidden"
                            >
                              {SOLUTIONS.map(solution => {
                                const Icon = solution.icon;
                                const isActive = location.pathname === solution.path;
                                return (
                                  <NavLink
                                    key={solution.path}
                                    to={solution.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                      flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                                      ${
                                        isActive
                                          ? 'text-cyan-400 bg-cyan-400/10'
                                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                                      }
                                    `}
                                  >
                                    <Icon size={16} />
                                    {solution.label}
                                  </NavLink>
                                );
                              })}
                              <NavLink
                                to="/customers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white"
                              >
                                <Users size={16} />
                                Customer Stories
                              </NavLink>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${
                          isActive
                            ? 'text-cyan-400 bg-cyan-400/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <GlowButtonOutline
                      variant="ghost"
                      size="md"
                      className="w-full justify-center gap-2"
                    >
                      <LogIn size={16} />
                      Login
                    </GlowButtonOutline>
                  </Link>
                  <Link to="/pricing#start" onClick={() => setMobileMenuOpen(false)}>
                    <GlowButton variant="primary" size="md" glow className="w-full justify-center">
                      Start Free Trial
                    </GlowButton>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#030712] text-white py-16 px-6 border-t border-white/10 relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-cyan-900/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <GlassCard
                  variant="neon"
                  padding="p-2"
                  radius="lg"
                  glow
                  glowColor="purple"
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">A</span>
                </GlassCard>
                <span className="font-bold text-xl font-space-grotesk">
                  <GradientText gradient="aurora">Artisan</GradientText>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                AI-powered outbound sales automation for modern teams. Automate 80% of your outbound
                workflow with Ava, your AI BDR.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <GlassCard
                    key={social}
                    as="a"
                    href="#"
                    variant="default"
                    hover
                    padding="p-0"
                    radius="lg"
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 group"
                  >
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-cyan-400 transition-colors">
                      {social[0]}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Product</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/platform" className="hover:text-cyan-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-cyan-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/flow" className="hover:text-cyan-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/ai-tour" className="hover:text-cyan-400 transition-colors">
                    AI Tour
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="hover:text-cyan-400 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Solutions</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/solutions/startups" className="hover:text-cyan-400 transition-colors">
                    Startups
                  </Link>
                </li>
                <li>
                  <Link to="/solutions/midmarket" className="hover:text-cyan-400 transition-colors">
                    Midmarket
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions/enterprise"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link to="/customers" className="hover:text-cyan-400 transition-colors">
                    Customer Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg font-space-grotesk">
                <GradientText gradient="cyber">Legal</GradientText>
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <Link to="/security" className="hover:text-cyan-400 transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    GDPR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">© 2025 Artisan. All rights reserved.</div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/security" className="hover:text-cyan-400 transition-colors">
                Status
              </Link>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Sitemap
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;

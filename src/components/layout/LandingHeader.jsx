import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Rocket, Building2, Building } from 'lucide-react';

const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 p-4 mx-auto w-full transition z-50 max-w-7xl px-10 ${
        hasScrolled
          ? 'bg-slate-950/80 border-b border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="flex relative gap-3 justify-between items-center w-full">
        {/* Logo */}
        <div className="flex items-center p-3 pr-6 rounded-full gap-7 glass-dark border border-white/20 backdrop-blur-lg hover-lift">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-mesh rounded-lg flex items-center justify-center glow">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold text-white font-space-grotesk">Artisan</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live status: All systems
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center p-2 px-4 rounded-full gap-3 glass-dark border border-white/20 backdrop-blur-lg">
          <Link
            to="/dashboard"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine"
          >
            Login
          </Link>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine flex items-center gap-1">
              Solutions
              <ChevronDown
                className={`w-3 h-3 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-lg glass-dark border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden animate-fadeIn">
                <Link
                  to="/solutions/startups"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Startups</div>
                    <div className="text-xs text-gray-400">Quick & affordable</div>
                  </div>
                </Link>
                <Link
                  to="/solutions/midmarket"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Building className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Mid-Market</div>
                    <div className="text-xs text-gray-400">Scale efficiently</div>
                  </div>
                </Link>
                <Link
                  to="/solutions/enterprise"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Enterprise</div>
                    <div className="text-xs text-gray-400">Security & scale</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <a
            href="#ai-tour"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine scroll-smooth"
          >
            AI Tour
          </a>
          <a
            href="#flow"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine scroll-smooth"
          >
            Flow
          </a>
          <a
            href="#platform"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine scroll-smooth"
          >
            Platform
          </a>
          <a
            href="#security"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine scroll-smooth"
          >
            Security
          </a>
          <a
            href="#customers"
            className="px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors shine scroll-smooth"
          >
            Customers
          </a>

          <div className="w-[1px] h-5 rounded-full bg-white/20"></div>

          <a
            href="#enterprise-cta"
            className="group relative flex items-center justify-between overflow-hidden duration-300 transition-transform rounded-full p-3 pl-4 gap-3 whitespace-nowrap text-sm gradient-mesh hover:shadow-xl transform hover:scale-105 glow shine"
          >
            <div className="font-bold leading-5 text-white">Talk to Sales</div>
            <div className="relative flex items-center w-8 h-8 p-2 overflow-hidden rounded-full bg-white/20">
              <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          <Link
            to="/onboarding"
            className="px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors shine"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center p-2 px-4 rounded-full gap-2 glass-dark border border-white/20 backdrop-blur-lg">
          <button className="group relative flex items-center justify-between overflow-hidden duration-300 rounded-full p-2 pl-3 gap-2 text-sm gradient-mesh glow">
            <div className="font-bold text-white text-sm">Sales</div>
            <div className="flex items-center w-7 h-7 rounded-full bg-white/20">
              <ArrowRight className="w-3 h-3 text-white ml-2" />
            </div>
          </button>

          <div className="w-[2px] h-5 rounded-full bg-white/20"></div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 glass-dark backdrop-blur-xl animate-fadeIn"
          style={{
            clipPath: mobileMenuOpen ? 'circle(150% at 100% 0)' : 'circle(0px at 100% 0)',
            transition: 'clip-path 0.4s ease-in-out',
          }}
        >
          <div className="flex flex-col gap-3 p-4 w-full h-full">
            {/* Mobile Menu Header */}
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-2 items-center">
                <Link
                  to="/login"
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 glass border border-white/10 text-white hover:bg-white/10"
                >
                  Login
                </Link>
                <button className="group flex items-center gap-2 gradient-mesh text-white font-bold rounded-full p-2 pl-4 pr-3 glow shine">
                  <span>Talk to Sales</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="grid place-items-center w-10 h-9 rounded-full glass border border-white/10 text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-b border-white/10"></div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">Login</p>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Solutions Section */}
              <div className="flex flex-col gap-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Solutions
                </p>
                <Link
                  to="/solutions/startups"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Startups</p>
                    <p className="text-xs text-gray-400">Quick & affordable</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/solutions/midmarket"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Building className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Mid-Market</p>
                    <p className="text-xs text-gray-400">Scale efficiently</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/solutions/enterprise"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Enterprise</p>
                    <p className="text-xs text-gray-400">Security & scale</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <a
                href="#ai-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">AI Tour</p>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#flow"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">Flow</p>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#platform"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">Platform</p>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">Security</p>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#customers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex gap-2 justify-between p-3 px-4 rounded-lg glass border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <p className="font-medium">Customers</p>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;

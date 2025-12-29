/**
 * EnterpriseSecurityHub.jsx
 *
 * Unified security, compliance, and platform status visualization.
 * Data-driven with real-time animations and hover interactions.
 *
 * CTO Design Principles:
 * - Security is visible, not hidden
 * - Real-time status builds trust
 * - Compliance at a glance
 * - Interactive exploration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Eye,
  EyeOff,
  Server,
  Database,
  Globe,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Fingerprint,
  FileCheck,
  Building2,
  Cpu,
  Zap,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { GlassCard, GradientText, GlowText, RevealText, CountUpText } from '../futuristic';

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

const SECURITY_METRICS = [
  {
    id: 'soc2',
    label: 'SOC 2 Type II',
    value: 'Certified',
    status: 'active',
    icon: ShieldCheck,
    color: 'emerald',
    description: 'Annual audit completed Dec 2024',
  },
  {
    id: 'uptime',
    label: 'Platform Uptime',
    value: 99.97,
    unit: '%',
    status: 'active',
    icon: Activity,
    color: 'cyan',
    description: 'Last 90 days',
  },
  {
    id: 'encryption',
    label: 'Data Encryption',
    value: 'AES-256',
    status: 'active',
    icon: Lock,
    color: 'purple',
    description: 'At rest & in transit',
  },
  {
    id: 'threats',
    label: 'Active Threats',
    value: 0,
    status: 'secure',
    icon: Shield,
    color: 'emerald',
    description: 'Last scan: 2 min ago',
  },
];

const COMPLIANCE_BADGES = [
  { id: 'gdpr', label: 'GDPR', status: 'compliant', region: 'EU' },
  { id: 'ccpa', label: 'CCPA', status: 'compliant', region: 'California' },
  { id: 'hipaa', label: 'HIPAA', status: 'compliant', region: 'Healthcare' },
  { id: 'iso27001', label: 'ISO 27001', status: 'compliant', region: 'Global' },
  { id: 'soc2', label: 'SOC 2', status: 'compliant', region: 'Global' },
  { id: 'pentest', label: 'Pen Tested', status: 'compliant', region: 'Q4 2024' },
];

const SERVICES = [
  { name: 'API Gateway', status: 'operational', latency: 45, uptime: 99.99 },
  { name: 'AI Engine', status: 'operational', latency: 120, uptime: 99.98 },
  { name: 'Email Service', status: 'operational', latency: 89, uptime: 99.97 },
  { name: 'Database Cluster', status: 'operational', latency: 12, uptime: 99.99 },
  { name: 'LinkedIn Integration', status: 'operational', latency: 234, uptime: 99.95 },
  { name: 'Analytics Engine', status: 'operational', latency: 67, uptime: 99.98 },
];

const DATA_REGIONS = [
  { id: 'us-east', label: 'US East', location: 'Virginia', latency: 12, status: 'active' },
  { id: 'eu-west', label: 'EU West', location: 'Ireland', latency: 18, status: 'active' },
  { id: 'us-west', label: 'US West', location: 'Oregon', latency: 45, status: 'active' },
  { id: 'apac', label: 'Asia Pacific', location: 'Singapore', latency: 89, status: 'coming' },
];

const ACCESS_CONTROLS = [
  { id: 'sso', label: 'SSO', description: 'SAML 2.0 / OIDC', icon: Key, enabled: true },
  { id: 'scim', label: 'SCIM', description: 'Auto-provisioning', icon: Users, enabled: true },
  { id: 'rbac', label: 'RBAC', description: 'Role-based access', icon: Shield, enabled: true },
  { id: 'mfa', label: 'MFA', description: 'TOTP / WebAuthn', icon: Fingerprint, enabled: true },
  { id: 'audit', label: 'Audit Logs', description: 'Full trail', icon: FileCheck, enabled: true },
  { id: 'ip', label: 'IP Allowlist', description: 'Network control', icon: Globe, enabled: true },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Security metric card with live indicator
const SecurityMetricCard = ({ metric, isHovered, onHover }) => {
  const Icon = metric.icon;
  const isLiveValue = typeof metric.value === 'number';

  return (
    <div className="relative group" onMouseEnter={onHover} onMouseLeave={() => {}}>
      {/* Glow effect */}
      <div
        className={`absolute -inset-1 rounded-xl bg-${metric.color}-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <GlassCard
        className={`relative p-5 transition-all duration-300 ${
          isHovered ? 'scale-105 border-white/30' : ''
        }`}
        variant="default"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}
          >
            <Icon size={20} className={`text-${metric.color}-400`} />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                metric.status === 'active' || metric.status === 'secure'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs text-gray-400 capitalize">{metric.status}</span>
          </div>
        </div>

        <div className="text-2xl font-bold text-white mb-1">
          {isLiveValue ? (
            <>
              <CountUpText
                end={metric.value}
                duration={1500}
                decimals={metric.unit === '%' ? 2 : 0}
              />
              {metric.unit}
            </>
          ) : (
            metric.value
          )}
        </div>

        <div className="text-sm text-gray-400 mb-2">{metric.label}</div>

        {isHovered && (
          <div className="text-xs text-gray-500 animate-fadeIn">{metric.description}</div>
        )}
      </GlassCard>
    </div>
  );
};

SecurityMetricCard.propTypes = {
  metric: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    unit: PropTypes.string,
    color: PropTypes.string.isRequired,
    status: PropTypes.string,
    trend: PropTypes.shape({
      direction: PropTypes.string,
      value: PropTypes.number,
    }),
  }).isRequired,
  isHovered: PropTypes.bool.isRequired,
  onHover: PropTypes.func.isRequired,
};

// Service status row
const ServiceRow = ({ service, index }) => {
  const statusColors = {
    operational: 'bg-emerald-400',
    degraded: 'bg-amber-400',
    down: 'bg-red-400',
  };

  return (
    <div
      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group hover:bg-white/5 px-3 -mx-3 rounded-lg transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${statusColors[service.status]} animate-pulse`} />
        <span className="text-sm text-white">{service.name}</span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-gray-400">{service.latency}ms</span>
        <span className="text-emerald-400">{service.uptime}%</span>
      </div>
    </div>
  );
};

// Compliance badge
const ComplianceBadge = ({ badge, index }) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-400" />
        <span className="text-sm font-medium text-white">{badge.label}</span>
      </div>
      <span className="text-xs text-gray-400 group-hover:text-emerald-400 transition-colors">
        {badge.region}
      </span>
    </div>
  );
};

// Data region card
const RegionCard = ({ region, isActive }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 ${
        region.status === 'active'
          ? 'bg-white/5 border-white/10 hover:border-cyan-500/30'
          : 'bg-white/[0.02] border-white/5 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe
            size={16}
            className={region.status === 'active' ? 'text-cyan-400' : 'text-gray-500'}
          />
          <span className="text-sm font-medium text-white">{region.label}</span>
        </div>
        {region.status === 'active' ? (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        ) : (
          <span className="text-xs text-gray-500">Coming Soon</span>
        )}
      </div>

      <div className="text-xs text-gray-400">{region.location}</div>

      {region.status === 'active' && (
        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
          <Zap size={12} />
          {region.latency}ms latency
        </div>
      )}
    </div>
  );
};

// Access control item
const AccessControlItem = ({ control, index }) => {
  const Icon = control.icon;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
        <Icon size={16} className="text-purple-400" />
      </div>

      <div className="flex-1">
        <div className="text-sm font-medium text-white">{control.label}</div>
        <div className="text-xs text-gray-400">{control.description}</div>
      </div>

      <div className="w-2 h-2 rounded-full bg-emerald-400" />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EnterpriseSecurityHub = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [lastScan, setLastScan] = useState(new Date());
  const containerRef = useRef(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Simulated real-time scan updates
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setLastScan(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={containerRef}
      id="security-hub"
      className="py-20 lg:py-28 px-4 lg:px-6 relative overflow-hidden bg-[#030712]"
    >
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-900/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-purple-900/10 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Enterprise Security</span>
            </div>

            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Security-First Architecture
              </GradientText>
            </h2>

            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              Built for the security and compliance requirements of global enterprises
            </p>
          </div>
        </RevealText>

        {/* Security metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {SECURITY_METRICS.map((metric, index) => (
            <SecurityMetricCard
              key={metric.id}
              metric={metric}
              isHovered={hoveredMetric === index}
              onHover={() => setHoveredMetric(index)}
              onLeave={() => setHoveredMetric(null)}
            />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Service Status */}
          <RevealText delay={100}>
            <GlassCard className="p-6 h-full" variant="default">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Server size={18} className="text-cyan-400" />
                  Platform Status
                </h3>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
                </div>
              </div>

              <div className="space-y-1">
                {SERVICES.map((service, index) => (
                  <ServiceRow key={service.name} service={service} index={index} />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Last updated: {lastScan.toLocaleTimeString()}</span>
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>
            </GlassCard>
          </RevealText>

          {/* Compliance & Access */}
          <RevealText delay={200}>
            <div className="space-y-6">
              {/* Compliance badges */}
              <GlassCard className="p-6" variant="default">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <FileCheck size={18} className="text-emerald-400" />
                  Compliance
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {COMPLIANCE_BADGES.map((badge, index) => (
                    <ComplianceBadge key={badge.id} badge={badge} index={index} />
                  ))}
                </div>
              </GlassCard>

              {/* Data Regions */}
              <GlassCard className="p-6" variant="default">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <Globe size={18} className="text-cyan-400" />
                  Data Residency
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {DATA_REGIONS.map(region => (
                    <RegionCard key={region.id} region={region} />
                  ))}
                </div>
              </GlassCard>
            </div>
          </RevealText>

          {/* Access Controls */}
          <RevealText delay={300}>
            <GlassCard className="p-6 h-full" variant="default">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
                <Key size={18} className="text-purple-400" />
                Identity & Access
              </h3>

              <div className="space-y-3">
                {ACCESS_CONTROLS.map((control, index) => (
                  <AccessControlItem key={control.id} control={control} index={index} />
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-sm font-medium text-white">Zero Trust Ready</span>
                </div>
                <p className="text-xs text-gray-400">
                  All access is verified, validated, and logged with full audit trail.
                </p>
              </div>
            </GlassCard>
          </RevealText>
        </div>

        {/* Bottom CTA */}
        <RevealText delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-emerald-400" />
                <span className="text-sm text-gray-300">Questions about security?</span>
              </div>
              <a
                href="#"
                className="flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Security Whitepaper
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  );
};

export default EnterpriseSecurityHub;

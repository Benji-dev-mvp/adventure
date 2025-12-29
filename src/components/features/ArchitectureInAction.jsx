import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Brain, 
  Mail, 
  MessageSquare, 
  Phone, 
  Linkedin, 
  Calendar, 
  TrendingUp,
  Zap,
  Target,
  Search,
  Database,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Send,
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
} from '../futuristic';

// Animated connection line between nodes
const AnimatedPath = ({ isActive, delay = 0 }) => {
  return (
    <div 
      className={`absolute h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ${
        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        transformOrigin: 'left',
      }}
    />
  );
};

// Pulsing data packet animation
const DataPacket = ({ isActive, delay = 0, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-cyan-400 shadow-cyan-400/50',
    purple: 'bg-purple-400 shadow-purple-400/50',
    pink: 'bg-pink-400 shadow-pink-400/50',
    green: 'bg-emerald-400 shadow-emerald-400/50',
  };
  
  return (
    <div 
      className={`absolute w-3 h-3 rounded-full ${colors[color]} shadow-lg transition-all duration-500 ${
        isActive ? 'opacity-100 animate-pulse' : 'opacity-0'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        animation: isActive ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
      }}
    />
  );
};

// Workflow step node
const WorkflowNode = ({ 
  icon: Icon, 
  title, 
  description, 
  isActive, 
  isComplete, 
  stats,
  delay = 0 
}) => {
  return (
    <div 
      className={`relative transition-all duration-700 ${
        isActive ? 'scale-105' : isComplete ? 'scale-100 opacity-80' : 'scale-95 opacity-40'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse" />
      )}
      
      <GlassCard 
        variant={isActive ? 'neon' : 'default'}
        glow={isActive}
        glowColor="cyan"
        className="relative p-6 min-h-[200px]"
      >
        {/* Completion checkmark */}
        {isComplete && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-bounceIn">
            <CheckCircle2 size={20} className="text-white" />
          </div>
        )}
        
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
          isActive 
            ? 'bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30' 
            : 'bg-white/5 border border-white/10'
        }`}>
          <Icon size={28} className={isActive ? 'text-white' : 'text-gray-400'} />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-2 font-space-grotesk">
          {isActive ? (
            <GradientText gradient="cyber">{title}</GradientText>
          ) : (
            <span className="text-white">{title}</span>
          )}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        
        {/* Live stats when active */}
        {isActive && stats && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 animate-fadeIn">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{stat.label}</span>
                <span className="font-semibold">
                  <GlowText color="cyan">{stat.value}</GlowText>
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Main component
const ArchitectureInAction = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Workflow steps data
  const workflowSteps = [
    {
      icon: Target,
      title: 'Define Your ICP',
      description: 'Ava learns your ideal customer profile through natural conversation',
      stats: [
        { label: 'Industries', value: '47 selected' },
        { label: 'Company size', value: '50-500 employees' },
        { label: 'Revenue', value: '$5M-$100M' },
      ],
    },
    {
      icon: Search,
      title: 'AI Prospecting',
      description: 'Scans 300M+ contacts with real-time intent signals',
      stats: [
        { label: 'Contacts found', value: '12,847' },
        { label: 'High intent', value: '2,341' },
        { label: 'Email verified', value: '98.7%' },
      ],
    },
    {
      icon: Brain,
      title: 'Personalization Engine',
      description: 'Crafts hyper-personalized messages at scale',
      stats: [
        { label: 'Personalization depth', value: 'Deep' },
        { label: 'Tone', value: 'Professional' },
        { label: 'Variables', value: '12 per email' },
      ],
    },
    {
      icon: Send,
      title: 'Multi-Channel Outreach',
      description: 'Coordinates email, LinkedIn, and calls automatically',
      stats: [
        { label: 'Emails sent', value: '847/day' },
        { label: 'LinkedIn touches', value: '234/day' },
        { label: 'Deliverability', value: '99.2%' },
      ],
    },
    {
      icon: Calendar,
      title: 'Meeting Booked',
      description: 'Qualified leads land directly in your calendar',
      stats: [
        { label: 'Meetings this week', value: '23' },
        { label: 'Conversion rate', value: '4.7%' },
        { label: 'Pipeline value', value: '$847K' },
      ],
    },
  ];

  // Intersection observer for visibility
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

  // Auto-play animation
  useEffect(() => {
    if (!isVisible || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= workflowSteps.length) {
          // Reset after completing all steps
          setCompletedSteps([]);
          return 0;
        }
        setCompletedSteps((prevCompleted) => [...prevCompleted, prev]);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, isAutoPlaying, workflowSteps.length]);

  // Channel icons for outreach visualization
  const channels = [
    { icon: Mail, label: 'Email', color: 'cyan', count: 847 },
    { icon: Linkedin, label: 'LinkedIn', color: 'blue', count: 234 },
    { icon: Phone, label: 'Calls', color: 'purple', count: 56 },
    { icon: MessageSquare, label: 'SMS', color: 'pink', count: 128 },
  ];

  return (
    <section 
      ref={containerRef}
      id="architecture-in-action" 
      className="py-24 px-6 relative overflow-hidden bg-[#030712]"
    >
      {/* Background effects */}
      <ParticleBackground variant="aurora" className="absolute inset-0 opacity-30" />
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/20 to-transparent blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">See it in action</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Architecture in Action
              </GradientText>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch how Ava orchestrates your entire outbound pipeline—from prospect discovery to booked meetings—in real-time.
            </p>
          </div>
        </RevealText>

        {/* Progress bar */}
        <div className="relative mb-16">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((activeStep + 1) / workflowSteps.length) * 100}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="absolute inset-0 flex justify-between items-center px-0">
            {workflowSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveStep(index);
                  setIsAutoPlaying(false);
                  setCompletedSteps(Array.from({ length: index }, (_, i) => i));
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index === activeStep 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 scale-125 shadow-lg shadow-cyan-500/30' 
                    : completedSteps.includes(index)
                    ? 'bg-emerald-500 shadow-emerald-500/30'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : (
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow visualization */}
        <div className="grid lg:grid-cols-5 gap-6 mb-16">
          {workflowSteps.map((step, index) => (
            <WorkflowNode
              key={index}
              {...step}
              isActive={index === activeStep}
              isComplete={completedSteps.includes(index)}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Live activity feed */}
        <RevealText delay={300}>
          <GlassCard 
            variant="gradient" 
            className="p-8 mt-8"
            glow
            glowColor="purple"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left: Live stats */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6 font-space-grotesk">
                  <GradientText gradient="cyber">Live Activity Feed</GradientText>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {channels.map((channel, index) => {
                    const Icon = channel.icon;
                    return (
                      <div 
                        key={index}
                        className={`relative p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-500 ${
                          activeStep === 3 ? 'animate-pulse border-cyan-500/50' : ''
                        }`}
                      >
                        <Icon size={24} className={`text-${channel.color}-400 mb-2`} />
                        <div className="text-2xl font-bold text-white">
                          <CountUpText 
                            end={activeStep >= 3 ? channel.count : 0} 
                            duration={1500}
                            delay={index * 200}
                          />
                        </div>
                        <div className="text-sm text-gray-400">{channel.label}/day</div>
                        
                        {/* Activity indicator */}
                        {activeStep === 3 && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: AI status */}
              <div className="lg:w-80">
                <GlassCard variant="neon" className="p-6" glow glowColor="cyan">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Brain size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Ava AI</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Processing</span>
                      <span className="text-white font-medium">
                        {workflowSteps[activeStep]?.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Efficiency</span>
                      <span className="text-emerald-400 font-medium">98.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Time saved</span>
                      <span className="text-cyan-400 font-medium">127 hrs/week</span>
                    </div>
                  </div>
                  
                  {/* Progress animation */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock size={14} />
                      <span>Next action in 2.4s</span>
                    </div>
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-progress"
                        style={{ animationDuration: '3s' }}
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </RevealText>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <GlowButtonOutline
            variant="secondary"
            size="md"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? 'Pause Demo' : 'Resume Demo'}
          </GlowButtonOutline>
          
          <GlowButton
            variant="primary"
            size="md"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            onClick={() => {
              setActiveStep(0);
              setCompletedSteps([]);
              setIsAutoPlaying(true);
            }}
          >
            Restart Tour
          </GlowButton>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ArchitectureInAction;

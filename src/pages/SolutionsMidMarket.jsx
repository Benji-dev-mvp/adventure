import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowRight, 
  Users, 
  Target, 
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Brain,
  Sparkles,
  CheckCircle,
  Database,
  BarChart3,
  Building2,
  Phone,
  Activity,
  UserCheck,
  Send
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import MidMarketFlowOrchestration from '../components/solutions/MidMarketFlowOrchestration';

const SolutionsMidMarket = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: 'John Smith',
    title: 'VP of Sales',
    phone: '+1'
  });

  const features = [
    {
      icon: Globe,
      title: "Billions of B2B Data Points Across 200+ Countries",
      description: "Easily expand into global markets and make your outbound motion more targeted and intent-driven without ballooning your stack of sales enablement tools.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "Scale Your Success With AI Playbooks",
      description: "Replicate your top-performing outbound strategies across your entire team with our AI-engineered Playbooks.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Deliverability Optimization For Any Email Volume",
      description: "Scale your outbound efforts without risking your domain reputation with our armory of built-in deliverability protection products and secondary domain management service.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Organize Your Outbound Strategy Across Your Team",
      description: "Have your entire team manage and automate their outbound efforts from within the Artisan platform, and assign reps different accounts and territories as required.",
      color: "from-green-500 to-teal-500"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Save On Headcount",
      description: "With Artisan Sales, 80% of your outbound team's tasks are automated, so you can reach more people without growing your team.",
      color: "blue"
    },
    {
      icon: Brain,
      title: "An AI BDR That Self-Optimizes",
      description: "Ava isn't your average AI sales assistant. Not only does she automate tasks, she also learns from your feedback over time, just like a real human would.",
      color: "purple"
    },
    {
      icon: Clock,
      title: "Get Up and Running Within A Week",
      description: "Learning to use Artisan Sales takes minutes - and with our dedicated support team's help, you'll be onboarded and live within days!",
      color: "green"
    },
    {
      icon: Target,
      title: "Replicate Your Top Performers",
      description: "Using our AI Playbooks, we can work with you to automate your top-performing outbound research & writing workflows.",
      color: "orange"
    },
    {
      icon: Zap,
      title: "All-In-One Subscription",
      description: "From email deliverability to B2B data, we've got it all. We've built best-in-class products for the entire outbound cycle, all in one place.",
      color: "indigo"
    },
    {
      icon: Activity,
      title: "Intent-Driven Outbound",
      description: "Harness the power of behavioral, firmographic, technographic, search term, social media keyword, review site and competitor user intent data.",
      color: "pink"
    }
  ];

  const domainBenefits = [
    {
      type: "Main Domain",
      number: "1",
      benefit: "Enhances Brand Recognition",
      description: "People who are familiar with your domain will be more receptive to cold emails sent from it."
    },
    {
      type: "Main Domain",
      number: "2",
      benefit: "Builds Trust With Recipients",
      description: ""
    },
    {
      type: "Main Domain",
      number: "3",
      benefit: "Drives Traffic Directly To Your Website",
      description: ""
    }
  ];

  const secondaryBenefits = [
    {
      number: "1",
      benefit: "Protect Primary Domain Reputation",
      description: "A secondary domain shields your main domain from potential spam complaints."
    },
    {
      number: "2",
      benefit: "Minimize Risk of Blacklisting",
      description: ""
    },
    {
      number: "3",
      benefit: "Test and Optimize Campaigns Worry-Free",
      description: ""
    },
    {
      number: "4",
      benefit: "Keep Your Work Email Clutter-Free",
      description: ""
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              For Mid-Market
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              Consolidate Your Outbound Sales Stack Into Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                AI-First Platform
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Put an end to context switching and save on multiple software license fees. We offer the best tools for every stage of outbound, from lead discovery and enrichment to deliverability optimization, with an AI Sales Agent to manage it all.
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Enter Work Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Productivity Boost */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-blue-500/30">
                <TrendingUp className="w-32 h-32 text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Boost The Productivity of Your Sales Reps Without Increasing Headcount
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Ava, our AI BDR, is there to support your sales team by automating the entire lead discovery, research, email strategy and writing process, so they can focus on high leverage activities like calling prospects and building personal networks.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2">
                Talk To Sales
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Orchestration */}
      <MidMarketFlowOrchestration />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Grow Your Sales Team Seamlessly With
            </h2>
            <p className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Software That's Built to Scale
            </p>
            <p className="text-xl text-gray-300 mt-4 max-w-4xl mx-auto">
              Whether you're entering new markets, expanding your sales force, or optimizing your outreach tactics, our platform provides the flexibility and volume needed to support your growth.
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 border border-white/20 text-white text-sm font-semibold mb-4`}>
                    <feature.icon className="w-4 h-4" />
                    Feature {idx + 1}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 flex items-center justify-center border-2 border-white/20`}>
                    <feature.icon className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Ava */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
                <Brain className="w-4 h-4" />
                AI BDR
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet Ava
              </h2>
              <h3 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Increase Opportunity Volume With Your Sales AI Sidekick, Ava
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Ava takes care of finding & engaging leads, so your team can focus on building a network, handling objections and closing deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2">
                  Meet Ava
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-purple-500/30">
                <Brain className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Strategy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choosing the Right Domain For Email Outreach
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Deciding whether to use your main domain or a secondary domain for cold email outreach is crucial for maintaining your brand's reputation and deliverability rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Main Domain */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Main Domain</h3>
                <div className="space-y-4">
                  {domainBenefits.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 font-bold">{item.number}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{item.benefit}</h4>
                          {item.description && (
                            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Secondary Domain */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Secondary Domain</h3>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                    <Sparkles className="w-3 h-3" />
                    Recommended
                  </div>
                </div>
                <div className="space-y-4">
                  {secondaryBenefits.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 font-bold">{item.number}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{item.benefit}</h4>
                          {item.description && (
                            <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-purple-300 font-semibold mb-6">
              For large-scale cold email outreach, we recommend using a well-configured secondary domain alongside your main domain.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2">
              Talk To Sales
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Artisan Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold mb-4">
              <DollarSign className="w-4 h-4" />
              Save Time & Money
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why You Should Go With
            </h2>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Artisan Sales
            </p>
            <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
              Consolidate your sales enablement stack, achieve a lower cost per meeting booked, and scale seamlessly with Artisan Sales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-${benefit.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className={`w-6 h-6 text-${benefit.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-12 rounded-lg transition-all inline-flex items-center gap-2 text-lg">
              Talk to Sales
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Outbound?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join leading mid-market companies already winning with Artisan Sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2">
              Schedule Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              to="/pricing"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2"
            >
              View Pricing
              <DollarSign className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsMidMarket;

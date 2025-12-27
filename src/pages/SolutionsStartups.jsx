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
  Rocket,
  Phone
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import StartupsFlowOrchestration from '../components/solutions/StartupsFlowOrchestration';

const SolutionsStartups = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: 'John Smith',
    title: 'VP of Sales',
    phone: '+1'
  });

  const features = [
    {
      icon: Database,
      title: "Over 300M B2B Data Contacts Across 200+ Countries",
      description: "Finding the right people to reach out to as a startup can be daunting. Once you've defined your ICP, Ava will automatically prospect, research and enrich leads for you.",
      image: "data-coverage",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Set Campaigns To A/B Test Your ICP and Messaging",
      description: "Our platform provides a robust testing ground to hone in on your ICP and messaging. Set up multiple campaigns to A/B test different strategies and analyze the results to fine-tune your approach.",
      image: "ab-testing",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Become An Instant Outbound Expert With Our AI Playbooks",
      description: "Save yourself the stress of countless hours on Google. Replicate and automate top-performing outbound strategies without any expertise or industry knowledge with our AI playbooks.",
      image: "ai-playbooks",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Free Up Time Spent on Manual Tasks",
      description: "Concentrate on growth and customer relationships without getting bogged down by the repetitive tasks of outbound sales. Ava automates 80% of the lead gen process, from finding leads and researching them to writing emails and following up.",
      image: "automation",
      color: "from-green-500 to-teal-500"
    }
  ];

  const benefits = [
    {
      icon: Users,
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
      icon: Rocket,
      title: "Get Up and Running Within A Week",
      description: "Learning to use Artisan Sales takes minutes - and with our dedicated support team's help, you'll be onboarded and live within days!",
      color: "green"
    },
    {
      icon: Sparkles,
      title: "Replicate Your Top Performers",
      description: "Using our AI Playbooks, we can work with you to automate your top-performing outbound research & writing workflows.",
      color: "orange"
    },
    {
      icon: DollarSign,
      title: "All-In-One Subscription",
      description: "From email deliverability to B2B data, we've got it all. We've built best-in-class products for the entire outbound cycle, all in one place.",
      color: "indigo"
    },
    {
      icon: Target,
      title: "Intent-Driven Outbound",
      description: "Harness the power of behavioral, firmographic, technographic, search term, social media keyword, review site and competitor user intent data.",
      color: "pink"
    }
  ];

  const languages = [
    { flag: "🇺🇸", name: "English" },
    { flag: "🇪🇸", name: "Spanish" },
    { flag: "🇫🇷", name: "French" },
    { flag: "🇩🇪", name: "German" },
    { flag: "🇮🇹", name: "Italian" },
    { flag: "🌍", name: "+35 more" }
  ];

  const domainComparison = [
    {
      type: "Main Domain",
      pros: [
        "Enhances Brand Recognition - People who are familiar with your domain will be more receptive to cold emails sent from it.",
        "Builds Trust With Recipients",
        "Drives Traffic Directly To Your Website"
      ],
      recommended: false
    },
    {
      type: "Secondary Domain",
      pros: [
        "Protect Primary Domain Reputation - A secondary domain shields your main domain from potential spam complaints.",
        "Minimize Risk of Blacklisting",
        "Test and Optimize Campaigns Worry-Free",
        "Keep Your Work Email Clutter-Free"
      ],
      recommended: true
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4" />
              For Startups
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-space-grotesk">
              Your Outbound <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Done For You</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-4">
              Quick, Affordable & Easy
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              You can get fully set up on our platform in just three days and we offer on-hand support to ensure you'll get maximum value out of outbound.
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
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trusted By Logos */}
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="text-slate-400 text-sm">Trusted by startups worldwide</div>
          </div>
        </div>
      </section>

      {/* Flow Orchestration */}
      <StartupsFlowOrchestration />

      {/* Don't Have PMF Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Don't Have Product Market Fit Yet?
            </h2>
            <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Use Our Platform To Find Your ICP
            </p>
          </div>

          {/* Features Grid */}
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
                  <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 flex items-center justify-center`}>
                    <feature.icon className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverability Protection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              We Have Every Measure To Protect Your Domain
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              As a startup, your domain is new and vulnerable to damage if you use it for cold outbound. We can set up a secondary one for you with the proper protective measures, warm it up, and get you sending emails in no time.
            </p>
            <Link 
              to="/deliverability" 
              className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-purple-300 font-semibold group"
            >
              Explore Deliverability
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Domain Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {domainComparison.map((domain, idx) => (
              <Card 
                key={idx}
                className={`${
                  domain.recommended 
                    ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-900/20 to-pink-900/20' 
                    : 'border border-slate-700 bg-slate-800/50'
                }`}
              >
                <CardContent className="p-6">
                  {domain.recommended && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold mb-4">
                      <Sparkles className="w-3 h-3" />
                      Recommended
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-6">{domain.type}</h3>
                  <div className="space-y-3">
                    {domain.pros.map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <p className="text-gray-300 text-sm">{pro}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-purple-300 font-semibold">
              For large-scale cold email outreach, we recommend using a well-configured secondary domain alongside your main domain.
            </p>
          </div>
        </div>
      </section>

      {/* B2B Data Coverage */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <Globe className="w-12 h-12 text-blue-400" />
              <div className="text-left">
                <div className="text-6xl font-bold text-white">200+</div>
                <div className="text-xl text-gray-400">Countries</div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              B2B Data Coverage in Over 200 Countries
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Ava has data coverage globally, to complement her ability to research and write emails in over 40 languages.
            </p>

            {/* Language Flags */}
            <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl">
                    {lang.flag}
                  </div>
                  <span className="text-sm text-gray-400">{lang.name}</span>
                </div>
              ))}
            </div>

            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2">
              Talk to Sales
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Artisan */}
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
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Artisan Sales
            </p>
            <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
              Consolidate your sales enablement stack, achieve a lower cost per meeting booked, and scale seamlessly with Artisan Sales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all group">
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
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-lg transition-all inline-flex items-center gap-2 text-lg">
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
            Ready to Transform Your Outbound?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of startups already scaling with Artisan Sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              to="/demo"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2"
            >
              Book a Demo
              <Phone className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsStartups;

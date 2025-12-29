import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'VP of Sales at TechCorp',
      avatar: '👩‍💼',
      quote:
        'Artisan helped us scale from 50 to 500 qualified leads per month without adding headcount. The AI personalization is mind-blowing.',
      rating: 5,
      company: 'TechCorp',
      metric: '10x lead growth',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Founder at GrowthLabs',
      avatar: '👨‍💼',
      quote:
        'The AI personalization is incredible. Our reply rates went from 2% to 8% in the first month. ROI was immediate.',
      rating: 5,
      company: 'GrowthLabs',
      metric: '4x reply rate',
    },
    {
      name: 'Emily Watson',
      role: 'SDR Manager at CloudScale',
      avatar: '👩',
      quote:
        'Finally, one platform that does it all. No more juggling 10 different tools for outbound. Our team is so much more productive.',
      rating: 5,
      company: 'CloudScale',
      metric: '80% time saved',
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk text-white">
            Loved by Sales Teams
          </h2>
          <p className="text-xl text-gray-200">
            Join thousands of companies scaling their outbound with Artisan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative futuristic-card rounded-2xl p-8 border border-white/15 hover:border-purple-400/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...new Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote Icon */}
              <Quote className="text-white/80 mb-4" size={32} />

              {/* Testimonial Text */}
              <p className="text-white mb-6 leading-relaxed font-medium">"{testimonial.quote}"</p>

              {/* Metric Badge */}
              <div className="inline-block bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-full px-4 py-1 mb-6">
                <span className="text-sm font-bold text-white">{testimonial.metric}</span>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-200">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-gray-200 mb-6">TRUSTED BY 10,000+ COMPANIES</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Salesforce', 'HubSpot', 'Zendesk', 'Stripe', 'Shopify', 'Slack'].map(company => (
              <div key={company} className="text-2xl font-bold text-white opacity-90">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

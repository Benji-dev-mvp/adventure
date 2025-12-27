import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQAccordion({ faqs, title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-lg font-medium text-slate-50">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-slate-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

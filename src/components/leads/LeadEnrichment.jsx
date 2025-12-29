import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  Building2,
  Users,
  DollarSign,
  Linkedin,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const LeadEnrichment = ({ lead, onEnrich }) => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);

  const enrichLead = async () => {
    setIsEnriching(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const enriched = {
      company: {
        revenue: '$50M - $100M',
        employees: '250-500',
        industry: 'Enterprise Software',
        founded: '2015',
        description: 'Leading provider of cloud-based business solutions',
        technologies: ['Salesforce', 'HubSpot', 'AWS', 'React'],
      },
      contact: {
        email_verified: true,
        phone: '+1 (555) 123-4567',
        mobile: '+1 (555) 987-6543',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: '@johndoe',
      },
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        timezone: 'PST',
      },
      signals: {
        hiring: true,
        funding: 'Series B - $25M',
        recent_news: ['Product launch', 'Expansion to EMEA'],
      },
    };

    setEnrichedData(enriched);
    setIsEnriching(false);
    onEnrich?.(enriched);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary-500" size={20} />
            <CardTitle>Lead Enrichment</CardTitle>
          </div>
          {enrichedData && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 size={12} />
              Enriched
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Auto-fill missing data from 50+ premium sources
        </p>
      </CardHeader>
      <CardContent>
        {!enrichedData ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-primary-600 dark:text-primary-400" size={28} />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enrich this lead</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Get company info, verified contact details, social profiles, and intent signals
            </p>
            <Button onClick={enrichLead} disabled={isEnriching} className="gap-2">
              {isEnriching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enriching...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Enrich Lead
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              1 credit • Data from ZoomInfo, Clearbit, Hunter.io
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Company Info */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Building2 size={16} />
                Company Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={14} className="text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Revenue</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {enrichedData.company.revenue}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-blue-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Employees</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {enrichedData.company.employees}
                  </p>
                </div>
              </div>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {enrichedData.company.description}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {enrichedData.company.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Mail size={16} />
                Contact Details
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Email verified</span>
                  </div>
                  <CheckCircle2 className="text-green-600" size={16} />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <Phone size={14} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {enrichedData.contact.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <Linkedin size={14} className="text-blue-600" />
                  <a
                    href={enrichedData.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Intent Signals */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-500" />
                Intent Signals
              </h4>
              <div className="space-y-2">
                {enrichedData.signals.hiring && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Badge variant="success">Hot Signal</Badge>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Company is actively hiring
                    </span>
                  </div>
                )}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Recent Funding:</strong> {enrichedData.signals.funding}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Recent News:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {enrichedData.signals.recent_news.map((news, i) => (
                      <li key={i}>{news}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

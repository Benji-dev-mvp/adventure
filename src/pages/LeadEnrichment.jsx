import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Sparkles, CheckCircle2, Loader2, Download } from 'lucide-react';

const LeadEnrichment = () => {
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState('');
  const [enriching, setEnriching] = useState(false);
  const [progress, setProgress] = useState(0);

  const sources = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      fields: ['Title', 'Company', 'Location', 'Experience'],
      cost: '$0.50/lead',
    },
    {
      id: 'clearbit',
      name: 'Clearbit',
      fields: ['Company Size', 'Industry', 'Revenue', 'Tech Stack'],
      cost: '$0.75/lead',
    },
    {
      id: 'hunter',
      name: 'Hunter.io',
      fields: ['Email', 'Phone', 'Social Profiles'],
      cost: '$0.25/lead',
    },
  ];

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      company: 'TechCorp',
      email: 's.chen@techcorp.com',
      enriched: false,
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      company: 'Growth Inc',
      email: 'm.rodriguez@growth.com',
      enriched: false,
    },
    {
      id: 3,
      name: 'Emily Watson',
      company: 'Enterprise Systems',
      email: 'e.watson@enterprise.com',
      enriched: false,
    },
  ]);

  const handleEnrich = () => {
    setEnriching(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setEnriching(false);
          setLeads(prev => prev.map(l => ({ ...l, enriched: true })));
          return 100;
        }
        return p + 10;
      });
    }, 300);
  };

  return (
    <DashboardLayout
      title="AI Lead Enrichment"
      subtitle="Enrich leads with data from multiple sources"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enrichment Wizard</CardTitle>
            <CardDescription>Step {step} of 3</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Select Data Source</h3>
                <div className="grid gap-3">
                  {sources.map(source => (
                    <div
                      key={source.id}
                      onClick={() => setSelectedSource(source.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSource === source.id
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10'
                          : 'border-gray-200 dark:border-white/10 hover:border-accent-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{source.name}</h4>
                        <Badge variant="secondary">{source.cost}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {source.fields.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setStep(2)} disabled={!selectedSource} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Preview Enrichment</h3>
                <div className="space-y-2">
                  {leads.map(lead => (
                    <div key={lead.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-sm text-gray-600">
                        {lead.company} • {lead.email}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Preview Data
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Confirm & Enrich</h3>
                {!enriching && progress === 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <p className="text-sm">
                      Ready to enrich {leads.length} leads using {selectedSource}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Estimated cost: ${(leads.length * 0.5).toFixed(2)}
                    </p>
                  </div>
                )}
                {enriching && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enriching {leads.length} leads...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {progress === 100 && (
                  <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Enrichment complete!</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {!enriching && progress === 0 && (
                    <>
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button onClick={handleEnrich} variant="gradient" className="flex-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Enrichment
                      </Button>
                    </>
                  )}
                  {progress === 100 && (
                    <Button variant="gradient" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Enriched Leads
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeadEnrichment;

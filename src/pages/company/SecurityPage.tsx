import React from 'react';
import { PageSection } from '@/components/layout/PageSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Lock, Key, FileCheck, Server, Eye } from 'lucide-react';

export function SecurityPage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "SOC 2 Type II",
      description: "Independently audited and certified for security controls."
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-400" />,
      title: "Data Encryption",
      description: "AES-256 encryption at rest and TLS 1.3 in transit."
    },
    {
      icon: <Key className="w-8 h-8 text-blue-400" />,
      title: "SSO/SAML",
      description: "Enterprise identity integration with role-based access."
    },
    {
      icon: <FileCheck className="w-8 h-8 text-blue-400" />,
      title: "GDPR & CCPA",
      description: "Full compliance with global data protection regulations."
    },
    {
      icon: <Server className="w-8 h-8 text-blue-400" />,
      title: "Infrastructure",
      description: "Multi-region deployment with 99.95% uptime SLA."
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-400" />,
      title: "Audit Logs",
      description: "Complete visibility into all system access and changes."
    },
  ];

  return (
    <>
      <PageSection variant="default">
        <PageHeader
          eyebrow="Security & Compliance"
          title="Enterprise-grade security, by default"
          description="Your data security is our top priority. We're built on industry-leading practices and regularly audited by third parties."
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="default">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6 text-center">
            Data Residency & Privacy
          </h2>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8">
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Data stored in US and EU regions with customer choice</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>No data sharing with third parties without explicit consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Data retention policies configurable per customer requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Regular penetration testing and security audits</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>24/7 security monitoring and incident response</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection variant="surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Questions about security?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Our security team is here to answer any questions and provide additional documentation.
          </p>
          <a
            href="mailto:security@artisan.com"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-block"
          >
            Contact Security Team
          </a>
        </div>
      </PageSection>
    </>
  );
}

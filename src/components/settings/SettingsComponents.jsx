// Settings Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Mail, Shield, Clock, Globe, Key } from 'lucide-react';

export const EmailWarmup = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="text-primary-500" size={20} />
          <CardTitle>Email Warmup Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Daily Send Limit</label>
            <Input type="number" placeholder="50" className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Gradually increase to protect sender reputation</p>
          </div>
          <div>
            <label className="text-sm font-medium">Warmup Duration</label>
            <select className="w-full mt-1 px-3 py-2 border rounded-lg">
              <option>2 weeks</option>
              <option>4 weeks</option>
              <option>6 weeks</option>
            </select>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm"><strong>Current Status:</strong> Day 14 of 28 (78% complete)</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DomainSetup = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="text-primary-500" size={20} />
          <CardTitle>Domain Setup Validator</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold">SPF Record</h4>
              <p className="text-xs text-gray-600">Sender Policy Framework</p>
            </div>
            <Badge variant="success">Valid</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold">DKIM</h4>
              <p className="text-xs text-gray-600">DomainKeys Identified Mail</p>
            </div>
            <Badge variant="success">Valid</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold">DMARC</h4>
              <p className="text-xs text-gray-600">Domain-based Message Authentication</p>
            </div>
            <Badge variant="warning">Missing</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TwoFactorAuth = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          <CardTitle>Two-Factor Authentication</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-green-600" size={32} />
          </div>
          <h4 className="font-semibold mb-2">2FA is Enabled</h4>
          <p className="text-sm text-gray-600 mb-4">Your account is protected with two-factor authentication</p>
          <Button variant="outline" size="sm">Generate Backup Codes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const RateLimiting = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Rate Limiting</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Emails per hour</label>
            <Input type="number" placeholder="100" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Emails per domain per day</label>
            <Input type="number" placeholder="5" className="mt-1" />
          </div>
          <Button className="w-full">Save Limits</Button>
        </div>
      </CardContent>
    </Card>
  );
};

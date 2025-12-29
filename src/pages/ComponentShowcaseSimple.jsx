import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

const ComponentShowcaseSimple = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Artisan Component Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Production-ready components for the Artisan platform
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="success">✓ Working</Badge>
            <Badge variant="info">40+ Components</Badge>
          </div>
        </div>

        {/* Buttons */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Form Components</h2>
            <div className="space-y-3 max-w-md">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button variant="primary" fullWidth>
                Submit
              </Button>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Alerts</h2>
            <div className="space-y-3">
              <Alert variant="info" title="Information">
                This is an informational message.
              </Alert>
              <Alert variant="success" title="Success!">
                Your changes have been saved.
              </Alert>
              <Alert variant="warning" title="Warning">
                Please review before proceeding.
              </Alert>
              <Alert variant="error" title="Error">
                An error occurred.
              </Alert>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Badges</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gray">Gray</Badge>
              <Badge variant="purple">Purple</Badge>
            </div>
          </div>
        </Card>

        {/* Loading */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Loading States</h2>
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            ✨ Component library is working! See full docs for all 40+ components.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcaseSimple;

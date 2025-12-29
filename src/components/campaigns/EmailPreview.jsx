import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Monitor, Smartphone, Moon, Sun, Eye } from 'lucide-react';

export const EmailPreview = ({ subject, content, from }) => {
  const [device, setDevice] = useState('desktop');
  const [theme, setTheme] = useState('light');

  const devices = [
    { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px' },
  ];

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const processContent = text => {
    if (!text) return '';
    // Replace merge tags with sample data
    return text
      .replaceAll('{{firstName}}', 'John')
      .replaceAll('{{lastName}}', 'Doe')
      .replaceAll('{{company}}', 'Acme Corp')
      .replaceAll('{{title}}', 'VP of Sales')
      .replaceAll('{{industry}}', 'Technology');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="text-primary-500" size={20} />
            <CardTitle>Email Preview</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {devices.map(d => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id)}
                    className={`p-2 rounded transition-colors ${
                      device === d.id
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={d.label}
                  >
                    <Icon size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {themes.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2 rounded transition-colors ${
                      theme === t.id
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={t.label}
                  >
                    <Icon size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div
            className={`transition-all duration-300 rounded-lg shadow-xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            style={{
              width: devices.find(d => d.id === device)?.width || '100%',
              maxWidth: '800px',
            }}
          >
            {/* Email Header */}
            <div
              className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  From:
                </span>
                <Badge variant="secondary" className="text-xs">
                  Inbox
                </Badge>
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {from || 'you@company.com'}
              </div>
            </div>

            {/* Subject Line */}
            <div
              className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div
                className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {processContent(subject) || 'Your Subject Line Here'}
              </div>
            </div>

            {/* Email Body */}
            <div className={`p-4 ${device === 'mobile' ? 'p-4' : ''}`}>
              <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                {processContent(content)
                  ?.split('\n')
                  .map((line, i) => (
                    <p
                      key={i}
                      className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {line || <br />}
                    </p>
                  )) || (
                  <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                    Email content will appear here...
                  </p>
                )}
              </div>
            </div>

            {/* Email Footer */}
            <div
              className={`p-4 border-t text-center ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Unsubscribe | Update Preferences
              </p>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Preview mode:</strong> Merge tags like {`{{firstName}}`} are replaced with
              sample data. Actual emails will use real lead information.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EmailPreview.propTypes = {
  subject: PropTypes.string,
  content: PropTypes.string,
  from: PropTypes.string,
};

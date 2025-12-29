import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Mail, Eye } from 'lucide-react';

export const EmailPreview = ({ subject, content, variables = [] }) => {
  const renderContentWithVariables = text => {
    if (!text) return '';

    return text.split(/(\{\{.*?\}\})/g).map((part, index) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span key={index} className="bg-accent-100 text-accent-700 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Email Preview
          </CardTitle>
          <Badge variant="outline">Live Preview</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Email Header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Mail size={16} />
              <span className="font-medium">From:</span>
              <span>you@company.com</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">To:</span>
              <span className="ml-2 text-accent-600">{{ email }}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-600">Subject:</span>
              <span className="ml-2 text-gray-900 font-medium">
                {renderContentWithVariables(subject || 'Your subject line')}
              </span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-4 bg-white">
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {renderContentWithVariables(content || 'Your email content will appear here...')}
            </div>
          </div>
        </div>

        {/* Variables Guide */}
        {variables.length > 0 && (
          <div className="mt-4 p-4 bg-accent-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Variables:</h4>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

EmailPreview.propTypes = {
  subject: PropTypes.string,
  content: PropTypes.string,
  variables: PropTypes.arrayOf(PropTypes.string),
};

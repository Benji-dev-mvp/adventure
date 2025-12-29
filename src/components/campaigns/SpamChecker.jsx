import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertCircle, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { dataService } from '../../lib/dataService';

export const SpamChecker = ({ subject, content }) => {
  const [score, setScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [safeToSend, setSafeToSend] = useState(true);
  const [deliverability, setDeliverability] = useState(100);

  useEffect(() => {
    if (subject || content) {
      checkSpam();
    }
  }, [subject, content]);

  const checkSpam = async () => {
    setLoading(true);

    try {
      // Call Python backend for spam analysis
      const response = await dataService.post('/campaigns/check-spam', {
        subject: subject || '',
        content: content || '',
      });

      setScore(response.score);
      setRiskLevel(response.risk_level);
      setIssues(response.issues);
      setSafeToSend(response.safe_to_send);
      setDeliverability(response.estimated_deliverability);
    } catch (error) {
      console.error('Spam check failed:', error);
      setIssues([
        {
          type: 'error',
          message: 'Failed to analyze content',
          impact: 'High',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (score === 0) return 'text-gray-400';
    if (riskLevel === 'Low') return 'text-green-600';
    if (riskLevel === 'Medium') return 'text-yellow-600';
    if (riskLevel === 'High') return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score === 0) return 'Not analyzed';
    return riskLevel;
  };

  const getIcon = type => {
    switch (type) {
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      default:
        return <CheckCircle2 className="text-blue-500" size={16} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          <CardTitle>Spam Score Checker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Score Display */}
          <div className="text-center p-6 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {loading ? '...' : score}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Spam Score</p>
            <Badge variant={score < 30 ? 'success' : score < 60 ? 'warning' : 'danger'}>
              {getScoreLabel()}
            </Badge>
          </div>

          {/* Issues List */}
          {issues.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Issues Found</h4>
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5"
                >
                  {getIcon(issue.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {issue.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Impact: {issue.impact}
                    </p>
                    {issue.recommendation && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        → {issue.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {issues.length === 0 && !loading && score === 0 && (
            <div className="text-center py-6 text-gray-600 dark:text-gray-400">
              <p className="text-sm">Add subject and content to check spam score</p>
            </div>
          )}

          {issues.length === 0 && score > 0 && (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-4">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">Excellent! No spam triggers detected.</p>
            </div>
          )}

          {/* Deliverability Score */}
          {score > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated Deliverability:
                </span>
                <span
                  className={`text-sm font-semibold ${deliverability >= 80 ? 'text-green-600' : deliverability >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
                >
                  {deliverability}%
                </span>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Tip:</strong>{' '}
              {safeToSend ? 'Content looks safe to send!' : 'Review and fix issues before sending'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

SpamChecker.propTypes = {
  subject: PropTypes.string,
  content: PropTypes.string,
};

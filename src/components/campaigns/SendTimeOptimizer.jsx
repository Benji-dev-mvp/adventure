import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, Sparkles, Calendar } from 'lucide-react';
import { dataService } from '../../lib/dataService';

export const SendTimeOptimizer = ({ leads = [], industry = null }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [optimalTimes, setOptimalTimes] = useState([]);
  const [timezoneDistribution, setTimezoneDistribution] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptimalTimes();
  }, [leads.length, industry]);

  const fetchOptimalTimes = async () => {
    setLoading(true);

    try {
      // Call Python backend for send time optimization
      const response = await dataService.post('/campaigns/optimize-send-time', {
        lead_count: leads.length,
        lead_timezones: null, // Would extract from leads in production
        industry: industry,
        campaign_id: null,
      });

      setOptimalTimes(response.optimal_slots);
      setTimezoneDistribution(response.timezone_distribution);
      setRecommendation(response.personalized_recommendation);
    } catch (error) {
      console.error('Send time optimization failed:', error);
      // Fallback to default data
      setOptimalTimes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Send Time Optimization</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          AI predicts optimal send times based on your audience
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Optimal Times List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="animate-spin mx-auto mb-2" size={24} />
              <p className="text-sm">Analyzing optimal send times...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {optimalTimes.map((slot, index) => (
                <button
                  key={slot.day}
                  type="button"
                  className={`p-4 rounded-lg border transition-all cursor-pointer w-full text-left ${
                    slot.recommended
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                      : selectedDay === slot.day
                        ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                  onClick={() => setSelectedDay(slot.day)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDay(slot.day);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {slot.day}
                          </span>
                          {slot.recommended && (
                            <Badge variant="success" className="text-xs gap-1">
                              <Sparkles size={10} />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {slot.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {slot.reply_rate}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">reply rate</div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {slot.reasoning}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Expected: {slot.expected_replies} replies from {slot.expected_opens} opens
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {slot.confidence}% confidence
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {slot.volume} volume
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Timezone Distribution */}
          {!loading && timezoneDistribution.length > 0 && (
            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar size={16} />
                Timezone Distribution
              </h4>
              <div className="space-y-2">
                {timezoneDistribution.map(tz => (
                  <div key={tz.zone} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                      {tz.zone}
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${tz.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20 text-right">
                      {tz.lead_count} leads
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insight */}
          {!loading && recommendation && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="text-purple-600 dark:text-purple-400 mt-0.5" size={18} />
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                    AI Recommendation
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

SendTimeOptimizer.propTypes = {
  leads: PropTypes.array,
  industry: PropTypes.string,
};

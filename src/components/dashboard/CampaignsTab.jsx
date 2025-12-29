import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Rocket,
  Play,
  Pause,
  Settings,
  Eye,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Target,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';

export const CampaignsTab = ({ onNavigateToCampaign }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'SaaS Outreach Q4',
      status: 'active',
      leads: 450,
      sent: 320,
      opened: 256,
      replied: 28,
      meetings: 12,
      replyRate: 8.8,
      openRate: 80.0,
      startDate: '2025-12-01',
      performance: [
        { day: 'Mon', sent: 45, replies: 4 },
        { day: 'Tue', sent: 52, replies: 5 },
        { day: 'Wed', sent: 48, replies: 4 },
        { day: 'Thu', sent: 55, replies: 6 },
        { day: 'Fri', sent: 50, replies: 5 },
        { day: 'Sat', sent: 35, replies: 2 },
        { day: 'Sun', sent: 35, replies: 2 },
      ],
    },
    {
      id: 2,
      name: 'Enterprise Follow-up',
      status: 'active',
      leads: 180,
      sent: 156,
      opened: 140,
      replied: 15,
      meetings: 8,
      replyRate: 9.6,
      openRate: 89.7,
      startDate: '2025-12-10',
      performance: [
        { day: 'Mon', sent: 22, replies: 2 },
        { day: 'Tue', sent: 25, replies: 3 },
        { day: 'Wed', sent: 23, replies: 2 },
        { day: 'Thu', sent: 26, replies: 3 },
        { day: 'Fri', sent: 24, replies: 2 },
        { day: 'Sat', sent: 18, replies: 2 },
        { day: 'Sun', sent: 18, replies: 1 },
      ],
    },
    {
      id: 3,
      name: 'Product Launch Announcement',
      status: 'paused',
      leads: 290,
      sent: 180,
      opened: 126,
      replied: 12,
      meetings: 4,
      replyRate: 6.7,
      openRate: 70.0,
      startDate: '2025-11-28',
      performance: [
        { day: 'Mon', sent: 30, replies: 2 },
        { day: 'Tue', sent: 28, replies: 2 },
        { day: 'Wed', sent: 32, replies: 2 },
        { day: 'Thu', sent: 0, replies: 0 },
        { day: 'Fri', sent: 0, replies: 0 },
        { day: 'Sat', sent: 0, replies: 0 },
        { day: 'Sun', sent: 0, replies: 0 },
      ],
    },
    {
      id: 4,
      name: 'Re-engagement Campaign',
      status: 'draft',
      leads: 320,
      sent: 0,
      opened: 0,
      replied: 0,
      meetings: 0,
      replyRate: 0,
      openRate: 0,
      startDate: null,
      performance: [],
    },
  ]);

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    }
  };

  const handleToggleStatus = id => {
    setCampaigns(
      campaigns.map(c => {
        if (c.id === id) {
          const newStatus = c.status === 'active' ? 'paused' : 'active';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-3">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Campaigns</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and monitor your outreach campaigns
          </p>
        </div>
        <Button
          onClick={() => navigate('/campaigns')}
          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Rocket size={16} />
          New Campaign
        </Button>
      </div>

      {/* Campaign Cards */}
      <div className="grid gap-3">
        {campaigns.map(campaign => (
          <Card
            key={campaign.id}
            className="dark:bg-slate-900/50 dark:backdrop-blur-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.name}
                    </h4>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </div>
                  {campaign.startDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar size={14} />
                      Started {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {campaign.status !== 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(campaign.id)}
                      className="gap-2"
                    >
                      {campaign.status === 'active' ? (
                        <>
                          <Pause size={14} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={14} />
                          Resume
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye size={14} />
                    View
                  </Button>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {campaign.leads}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sent</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {campaign.sent}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Open Rate</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {campaign.openRate.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Reply Rate</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {campaign.replyRate.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Meetings</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {campaign.meetings}
                  </p>
                </div>
              </div>

              {/* Performance Chart */}
              {campaign.performance.length > 0 && (
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={campaign.performance}>
                      <defs>
                        <linearGradient id={`gradient-${campaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="replies"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fill={`url(#gradient-${campaign.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

CampaignsTab.propTypes = {
  onNavigateToCampaign: PropTypes.func,
};

export default CampaignsTab;

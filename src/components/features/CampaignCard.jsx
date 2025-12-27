import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Play, Pause, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';

export const CampaignCard = ({ campaign }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'draft':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {campaign.name}
            </h3>
            <Badge variant={getStatusColor(campaign.status)} className="capitalize">
              {campaign.status}
            </Badge>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Leads</p>
            <p className="text-2xl font-bold text-gray-900">{campaign.leads}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-2xl font-bold text-gray-900">{campaign.sent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Replies</p>
            <p className="text-2xl font-bold text-gray-900">{campaign.replies}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reply Rate</p>
            <p className="text-2xl font-bold text-green-600">{campaign.replyRate}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            {campaign.status === 'active' ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Resume
              </>
            )}
          </Button>
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

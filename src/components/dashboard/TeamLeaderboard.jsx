import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Trophy, TrendingUp, Award, Medal } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const TeamLeaderboard = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      meetingsBooked: 23,
      replyRate: 12.4,
      trend: 'up',
      change: '+5%',
      rank: 1,
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: '👨‍💼',
      meetingsBooked: 19,
      replyRate: 10.8,
      trend: 'up',
      change: '+3%',
      rank: 2,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '👩',
      meetingsBooked: 17,
      replyRate: 9.6,
      trend: 'down',
      change: '-1%',
      rank: 3,
    },
    {
      id: 4,
      name: 'David Park',
      avatar: '👨',
      meetingsBooked: 15,
      replyRate: 8.9,
      trend: 'up',
      change: '+2%',
      rank: 4,
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      avatar: '👩‍🦰',
      meetingsBooked: 14,
      replyRate: 8.2,
      trend: 'up',
      change: '+1%',
      rank: 5,
    },
  ];

  const getRankIcon = rank => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-orange-600" size={20} />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          <CardTitle>Team Leaderboard</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month's performance</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                member.rank === 1
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700'
                  : 'bg-gray-50 dark:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center w-8">{getRankIcon(member.rank)}</div>

              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.meetingsBooked} meetings
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.replyRate}% reply rate
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant={member.trend === 'up' ? 'success' : 'danger'} className="gap-1">
                <TrendingUp size={12} className={member.trend === 'down' ? 'rotate-180' : ''} />
                {member.change}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

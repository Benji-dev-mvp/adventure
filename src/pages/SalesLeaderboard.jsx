import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Flame, Target, Users, Star } from 'lucide-react';

const SalesLeaderboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  const leaderboard = [
    {
      rank: 1,
      name: 'Michael Rodriguez',
      avatar: 'MR',
      replies: 245,
      meetings: 42,
      deals: 12,
      points: 2890,
    },
    {
      rank: 2,
      name: 'Sarah Chen',
      avatar: 'SC',
      replies: 238,
      meetings: 38,
      deals: 11,
      points: 2750,
    },
    {
      rank: 3,
      name: 'Emily Watson',
      avatar: 'EW',
      replies: 221,
      meetings: 35,
      deals: 10,
      points: 2580,
    },
    {
      rank: 4,
      name: 'James Kim',
      avatar: 'JK',
      replies: 198,
      meetings: 30,
      deals: 8,
      points: 2210,
    },
    {
      rank: 5,
      name: 'Lisa Anderson',
      avatar: 'LA',
      replies: 187,
      meetings: 28,
      deals: 7,
      points: 2050,
    },
  ];

  const achievements = [
    {
      icon: Flame,
      title: 'Hot Streak',
      description: '10 days of consistent activity',
      color: 'text-orange-500',
      earned: true,
    },
    {
      icon: Target,
      title: 'First Reply',
      description: 'Get your first lead response',
      color: 'text-blue-500',
      earned: true,
    },
    {
      icon: Star,
      title: 'Deal Closer',
      description: 'Close 5 deals in a month',
      color: 'text-yellow-500',
      earned: true,
    },
    {
      icon: Users,
      title: 'Meeting Master',
      description: 'Book 25 meetings in a month',
      color: 'text-green-500',
      earned: false,
    },
  ];

  const teams = [
    { name: 'Team Alpha', members: 8, points: 18450, deals: 45 },
    { name: 'Team Beta', members: 7, points: 16230, deals: 38 },
  ];

  const rewards = [
    { tier: 'Bronze', points: 1000, reward: '$100 Amazon Gift Card', progress: 100 },
    { tier: 'Silver', points: 2500, reward: 'Extra PTO Day', progress: 100 },
    { tier: 'Gold', points: 5000, reward: 'Dinner for Two', progress: 58 },
    { tier: 'Platinum', points: 10000, reward: 'Team Outing', progress: 29 },
  ];

  return (
    <DashboardLayout
      title="Sales Leaderboard"
      subtitle="Track performance and compete with your team"
    >
      <div className="space-y-3">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                timeRange === range
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map(person => (
                  <div
                    key={person.rank}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      person.rank <= 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 border-yellow-400'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        {person.rank <= 3 ? (
                          <Trophy
                            className={`w-6 h-6 ${person.rank === 1 ? 'text-yellow-500' : person.rank === 2 ? 'text-gray-400' : 'text-amber-600'}`}
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-400 w-6 text-center">
                            {person.rank}
                          </span>
                        )}
                        <div className="w-10 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {person.avatar}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{person.name}</p>
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{person.replies} replies</span>
                          <span>{person.meetings} meetings</span>
                          <span>{person.deals} deals</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent-600">{person.points}</p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        achievement.earned
                          ? 'bg-green-50 dark:bg-green-500/10'
                          : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                      }`}
                    >
                      <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{achievement.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Badge variant="success" size="sm">
                          Earned
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Competition */}
            <Card>
              <CardHeader>
                <CardTitle>Team Battle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams.map((team, i) => (
                    <div
                      key={i}
                      className="p-3 border border-gray-200 dark:border-white/10 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{team.name}</p>
                          <p className="text-xs text-gray-600">{team.members} members</p>
                        </div>
                        {i === 0 && <Badge variant="success">Leading</Badge>}
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">
                          Points: {team.points.toLocaleString()}
                        </span>
                        <span className="font-semibold">{team.deals} deals</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards Track */}
        <Card>
          <CardHeader>
            <CardTitle>Rewards Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {rewards.map((reward, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={reward.progress === 100 ? 'success' : 'secondary'}>
                      {reward.tier}
                    </Badge>
                    <span className="text-sm font-semibold">{reward.points}</span>
                  </div>
                  <p className="text-sm mt-2 mb-3">{reward.reward}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${reward.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{reward.progress}% complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesLeaderboard;

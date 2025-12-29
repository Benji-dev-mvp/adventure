// Gamification Components - Leaderboards, Badges, Competitions, Points & Rewards
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Trophy, Star, Target, Award, Flame } from 'lucide-react';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';

// TEAM LEADERBOARD
export const TeamLeaderboard = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [leaderboard] = useState([
    {
      rank: 1,
      name: 'Sarah Johnson',
      avatar: '👩',
      points: 2847,
      metrics: { emails: 342, meetings: 28, deals: 5 },
      streak: 12,
      badge: '🏆',
    },
    {
      rank: 2,
      name: 'Mike Chen',
      avatar: '👨',
      points: 2654,
      metrics: { emails: 298, meetings: 24, deals: 4 },
      streak: 8,
      badge: '🥈',
    },
    {
      rank: 3,
      name: 'Emily Davis',
      avatar: '👩',
      points: 2431,
      metrics: { emails: 276, meetings: 22, deals: 4 },
      streak: 6,
      badge: '🥉',
    },
    {
      rank: 4,
      name: 'John Smith',
      avatar: '👨',
      points: 2198,
      metrics: { emails: 254, meetings: 19, deals: 3 },
      streak: 5,
      badge: '',
    },
    {
      rank: 5,
      name: 'Lisa Wong',
      avatar: '👩',
      points: 2087,
      metrics: { emails: 241, meetings: 17, deals: 3 },
      streak: 4,
      badge: '',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary-500" size={20} />
            <CardTitle>Team Leaderboard</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
            >
              This Week
            </Button>
            <Button
              size="sm"
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
            >
              This Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map(person => (
            <div
              key={person.rank}
              className={`p-4 rounded-lg border-2 transition-all ${
                person.rank === 1
                  ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                  : person.rank === 2
                    ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30'
                    : person.rank === 3
                      ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="text-center w-12">
                  <div className="text-lg font-bold">{person.rank}</div>
                  {person.badge && <div className="text-lg">{person.badge}</div>}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-4xl">{person.avatar}</div>
                  <div>
                    <p className="font-bold text-lg">{person.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {person.points} pts
                      </Badge>
                      {person.streak > 0 && (
                        <Badge variant="warning" className="text-xs gap-1">
                          <Flame size={12} />
                          {person.streak} day streak
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Emails</p>
                      <p className="font-bold">{person.metrics.emails}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Meetings</p>
                      <p className="font-bold text-green-600">{person.metrics.meetings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Deals</p>
                      <p className="font-bold text-purple-600">{person.metrics.deals}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ACHIEVEMENT BADGES
export const AchievementBadges = () => {
  const [achievements] = useState([
    {
      id: 1,
      name: 'First Blood',
      icon: '🎯',
      description: 'Booked your first meeting',
      earned: true,
      date: 'Dec 10',
    },
    {
      id: 2,
      name: 'Speed Demon',
      icon: '⚡',
      description: 'Sent 100 emails in one day',
      earned: true,
      date: 'Dec 15',
    },
    {
      id: 3,
      name: 'Closer',
      icon: '💰',
      description: 'Closed 5 deals',
      earned: true,
      date: 'Dec 20',
    },
    {
      id: 4,
      name: 'Streak Master',
      icon: '🔥',
      description: '10-day activity streak',
      earned: true,
      date: 'Dec 22',
    },
    {
      id: 5,
      name: 'Social Butterfly',
      icon: '🦋',
      description: 'Connect with 50 prospects on LinkedIn',
      earned: false,
      progress: 38,
    },
    {
      id: 6,
      name: 'Unicorn Hunter',
      icon: '🦄',
      description: 'Land a $100K+ deal',
      earned: false,
      progress: 0,
    },
  ]);

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-primary-500" size={20} />
            <CardTitle>Achievement Badges</CardTitle>
          </div>
          <Badge variant="secondary">
            {earnedCount}/{achievements.length} Unlocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`text-center p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                  : 'border-gray-300 dark:border-gray-600 opacity-60'
              }`}
            >
              <div className="text-5xl mb-2">{achievement.icon}</div>
              <p className="font-bold text-sm mb-1">{achievement.name}</p>
              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>

              {achievement.earned ? (
                <Badge variant="success" className="text-xs">
                  Earned {achievement.date}
                </Badge>
              ) : achievement.progress !== undefined ? (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(achievement.progress / 50) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">{achievement.progress}/50</p>
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Locked
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// TEAM COMPETITIONS
export const TeamCompetitions = () => {
  const [competitions] = useState([
    {
      id: 1,
      name: 'West Coast vs East Coast',
      type: 'Regional Battle',
      metric: 'Most Meetings Booked',
      endDate: 'Dec 31',
      teams: [
        { name: 'West Coast', score: 142, members: 8, avatar: '🌴', winning: true },
        { name: 'East Coast', score: 138, members: 9, avatar: '🗽', winning: false },
      ],
      prize: '$500 team dinner',
    },
    {
      id: 2,
      name: 'December Dash',
      type: 'Individual Sprint',
      metric: 'Highest Response Rate',
      endDate: 'Dec 31',
      leader: { name: 'Sarah Johnson', score: '34%', avatar: '👩' },
      prize: '$200 gift card',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-primary-500" size={20} />
            <CardTitle>Active Competitions</CardTitle>
          </div>
          <Button size="sm">
            <Plus size={14} className="mr-1" />
            Create Contest
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitions.map(comp => (
            <div
              key={comp.id}
              className="p-4 rounded-lg border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{comp.name}</h3>
                  <p className="text-sm text-gray-600">
                    {comp.type} • {comp.metric}
                  </p>
                  <Badge variant="warning" className="text-xs mt-2">
                    <Clock size={12} className="mr-1" />
                    Ends {comp.endDate}
                  </Badge>
                </div>
                <Badge variant="secondary" className="text-xs">
                  🏆 {comp.prize}
                </Badge>
              </div>

              {comp.teams ? (
                <div className="space-y-2">
                  {comp.teams.map((team, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded ${
                        team.winning
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{team.avatar}</span>
                        <div>
                          <p className="font-semibold">{team.name}</p>
                          <p className="text-xs text-gray-600">{team.members} members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{team.score}</p>
                        {team.winning && (
                          <Badge variant="success" className="text-xs">
                            LEADING
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                  <span className="text-lg">{comp.leader.avatar}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{comp.leader.name}</p>
                    <p className="text-xs text-gray-600">Current Leader</p>
                  </div>
                  <div className="text-lg font-bold text-green-600">{comp.leader.score}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// POINTS & REWARDS SYSTEM
export const PointsRewardsSystem = () => {
  const [userPoints] = useState({
    total: 2847,
    thisWeek: 487,
    rank: 1,
    nextReward: 3000,
    history: [
      { action: 'Booked meeting with Acme Corp', points: 50, time: '2 hours ago' },
      { action: 'Sent 100 emails', points: 25, time: '5 hours ago' },
      { action: 'LinkedIn connection accepted', points: 10, time: '1 day ago' },
      { action: 'Positive response received', points: 30, time: '1 day ago' },
    ],
  });

  const rewards = [
    { tier: 'Bronze', points: 1000, reward: '$50 Amazon Gift Card', unlocked: true },
    { tier: 'Silver', points: 2500, reward: 'Extra PTO Day', unlocked: true },
    { tier: 'Gold', points: 5000, reward: 'Team Outing', unlocked: false },
    { tier: 'Platinum', points: 10000, reward: 'Weekend Getaway', unlocked: false },
  ];

  const pointsToNext = userPoints.nextReward - userPoints.total;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="text-primary-500" size={20} />
          <CardTitle>Points & Rewards</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Points */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-90">Your Points</p>
              <p className="text-5xl font-bold">{userPoints.total}</p>
              <p className="text-sm opacity-90 mt-1">+{userPoints.thisWeek} this week</p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">👑</div>
              <Badge variant="warning" className="text-xs">
                #{userPoints.rank} Rank
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Next reward</span>
              <span>{pointsToNext} points to go</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${(userPoints.total / userPoints.nextReward) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Rewards Tiers */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-3">Reward Tiers</p>
          <div className="space-y-2">
            {rewards.map((reward, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  reward.unlocked
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {reward.unlocked ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{reward.tier}</p>
                    <p className="text-xs text-gray-600">{reward.reward}</p>
                  </div>
                </div>
                <Badge variant={reward.unlocked ? 'success' : 'secondary'} className="text-xs">
                  {reward.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <p className="text-sm font-semibold mb-3">Recent Point Activity</p>
          <div className="space-y-2">
            {userPoints.history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 border-l-2 border-blue-500 pl-3"
              >
                <div>
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-gray-600">{item.time}</p>
                </div>
                <Badge variant="success" className="text-xs">
                  +{item.points}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

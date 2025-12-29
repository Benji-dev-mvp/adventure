import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Users,
  UserPlus,
  MessageSquare,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Mail,
  Phone,
  Award,
  Zap,
  Settings,
  Bell,
} from 'lucide-react';

const TeamCollaboration = () => {
  const [workspaces] = useState([
    {
      id: 1,
      name: 'Enterprise Sales Team',
      members: 12,
      activeLeads: 847,
      campaigns: 8,
      thisMonth: { leads: 342, meetings: 47, closed: 12 },
      color: 'blue',
    },
    {
      id: 2,
      name: 'SMB Outbound',
      members: 8,
      activeLeads: 1203,
      campaigns: 12,
      thisMonth: { leads: 589, meetings: 78, closed: 23 },
      color: 'green',
    },
    {
      id: 3,
      name: 'EMEA Team',
      members: 6,
      activeLeads: 421,
      campaigns: 5,
      thisMonth: { leads: 178, meetings: 29, closed: 8 },
      color: 'purple',
    },
  ]);

  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Sales Manager',
      workspace: 'Enterprise Sales Team',
      avatar: '👩‍💼',
      status: 'online',
      stats: {
        leads: 124,
        meetings: 18,
        replied: 47,
        booked: 12,
      },
      recentActivity: 'Booked meeting with Acme Corp',
      lastActive: 'Active now',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'SDR',
      workspace: 'Enterprise Sales Team',
      avatar: '👨‍💻',
      status: 'online',
      stats: {
        leads: 89,
        meetings: 14,
        replied: 38,
        booked: 9,
      },
      recentActivity: 'Sent follow-up sequence',
      lastActive: '5 min ago',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'AE',
      workspace: 'SMB Outbound',
      avatar: '👩‍🎨',
      status: 'away',
      stats: {
        leads: 156,
        meetings: 24,
        replied: 61,
        booked: 18,
      },
      recentActivity: 'Closed deal with TechCo',
      lastActive: '1 hour ago',
    },
    {
      id: 4,
      name: 'David Park',
      role: 'SDR',
      workspace: 'EMEA Team',
      avatar: '👨‍🚀',
      status: 'offline',
      stats: {
        leads: 67,
        meetings: 9,
        replied: 23,
        booked: 6,
      },
      recentActivity: 'Updated lead scoring',
      lastActive: '3 hours ago',
    },
  ]);

  const [assignmentQueue] = useState([
    {
      id: 1,
      type: 'hot_lead',
      contact: 'John Doe - TechStartup Inc',
      reason: 'Replied with buying signals',
      priority: 'high',
      suggestedAssignee: 'Sarah Johnson',
      timestamp: '2 minutes ago',
    },
    {
      id: 2,
      type: 'meeting_request',
      contact: 'Lisa Anderson - Enterprise Corp',
      reason: 'Requested demo next week',
      priority: 'high',
      suggestedAssignee: 'Michael Chen',
      timestamp: '15 minutes ago',
    },
    {
      id: 3,
      type: 'objection',
      contact: 'Mike Wilson - SmallBiz Co',
      reason: 'Price objection detected',
      priority: 'medium',
      suggestedAssignee: 'Emma Wilson',
      timestamp: '1 hour ago',
    },
  ]);

  const [handoffHistory] = useState([
    {
      from: 'Ava (AI BDR)',
      to: 'Sarah Johnson (SDR)',
      lead: 'Acme Corp - John Smith',
      reason: 'Meeting booked',
      timestamp: '2024-01-15 14:30',
      status: 'completed',
    },
    {
      from: 'Michael Chen (SDR)',
      to: 'Emma Wilson (AE)',
      lead: 'TechCo - Lisa Chen',
      reason: 'Qualified - Budget confirmed',
      timestamp: '2024-01-15 11:20',
      status: 'completed',
    },
    {
      from: 'Ava (AI BDR)',
      to: 'David Park (SDR)',
      lead: 'StartupXYZ - Mike Johnson',
      reason: 'Positive reply with questions',
      timestamp: '2024-01-15 09:45',
      status: 'pending',
    },
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Team Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage workspaces, assignments, and handoffs
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-blue-500" />
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-lg font-bold">{teamMembers.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target size={20} className="text-green-500" />
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-lg font-bold">2,471</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar size={20} className="text-purple-500" />
                <Badge variant="success">+34%</Badge>
              </div>
              <p className="text-lg font-bold">154</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meetings Booked</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap size={20} className="text-orange-500" />
                <Badge variant="warning">{assignmentQueue.length}</Badge>
              </div>
              <p className="text-lg font-bold">{assignmentQueue.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Assignments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="workspaces" className="mb-6">
          <TabsList>
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments
              {assignmentQueue.length > 0 && (
                <Badge variant="warning" className="ml-2">
                  {assignmentQueue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="handoffs">Handoff History</TabsTrigger>
          </TabsList>

          {/* Workspaces */}
          <TabsContent value="workspaces">
            <div className="grid gap-3">
              {workspaces.map(workspace => (
                <Card key={workspace.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br from-${workspace.color}-500 to-${workspace.color}-600 rounded-lg flex items-center justify-center text-white text-lg font-bold`}
                        >
                          {workspace.name.substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{workspace.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {workspace.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Target size={14} />
                              {workspace.activeLeads} active leads
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {workspace.campaigns} campaigns
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings size={16} className="mr-2" />
                        Manage
                      </Button>
                    </div>

                    {/* This Month Stats */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">
                          {workspace.thisMonth.leads}
                        </p>
                        <p className="text-xs text-gray-600">Leads Added</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                          {workspace.thisMonth.meetings}
                        </p>
                        <p className="text-xs text-gray-600">Meetings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">
                          {workspace.thisMonth.closed}
                        </p>
                        <p className="text-xs text-gray-600">Deals Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2">
                <CardContent className="p-4 text-center">
                  <UserPlus className="mx-auto mb-3 text-gray-400" size={32} />
                  <h3 className="text-lg font-semibold mb-2">Create New Workspace</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Organize your team with dedicated workspaces
                  </p>
                  <Button>Create Workspace</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Members */}
          <TabsContent value="team">
            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map(member => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-lg">
                            {member.avatar}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'online'
                                ? 'bg-green-500'
                                : member.status === 'away'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                            }`}
                          ></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {member.workspace}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare size={14} />
                      </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-lg font-bold">{member.stats.leads}</p>
                        <p className="text-xs text-gray-600">Leads</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-lg font-bold">{member.stats.meetings}</p>
                        <p className="text-xs text-gray-600">Meetings</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-lg font-bold">{member.stats.replied}</p>
                        <p className="text-xs text-gray-600">Replied</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-lg font-bold">{member.stats.booked}</p>
                        <p className="text-xs text-gray-600">Booked</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600 mb-1">Recent Activity</p>
                      <p className="text-sm font-medium">{member.recentActivity}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.lastActive}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <UserPlus className="mx-auto mb-3 text-gray-400" size={32} />
                  <h3 className="text-lg font-semibold mb-2">Invite Team Member</h3>
                  <Button>Send Invitation</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignment Queue */}
          <TabsContent value="assignments">
            <div className="space-y-3">
              {assignmentQueue.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="mx-auto mb-3 text-green-500" size={48} />
                    <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                    <p className="text-gray-600">No pending assignments</p>
                  </CardContent>
                </Card>
              ) : (
                assignmentQueue.map(assignment => (
                  <Card key={assignment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={assignment.priority === 'high' ? 'danger' : 'warning'}>
                              {assignment.priority} priority
                            </Badge>
                            <Badge variant="outline">{assignment.type.replace('_', ' ')}</Badge>
                            <span className="text-xs text-gray-600">{assignment.timestamp}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{assignment.contact}</h3>
                          <p className="text-sm text-gray-600">{assignment.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-blue-500" />
                          <span className="text-sm">
                            <span className="text-gray-600">Suggested assignee:</span>{' '}
                            <span className="font-semibold">{assignment.suggestedAssignee}</span>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="success">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            Reassign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Handoff History */}
          <TabsContent value="handoffs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Handoffs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {handoffHistory.map((handoff, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">{handoff.from}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold text-sm">{handoff.to}</span>
                          {handoff.status === 'completed' ? (
                            <Badge variant="success" className="text-xs">
                              <CheckCircle size={10} className="mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="warning" className="text-xs">
                              <Clock size={10} className="mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-1">{handoff.lead}</p>
                        <p className="text-xs text-gray-600">Reason: {handoff.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">{handoff.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamCollaboration;

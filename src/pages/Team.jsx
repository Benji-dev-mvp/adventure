import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  MoreVertical,
  CheckCircle2,
  Clock,
  Crown,
} from 'lucide-react';

const Team = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@company.com',
      role: 'Owner',
      status: 'active',
      joinedDate: 'Jan 2024',
      avatar: 'AJ',
      campaignsCreated: 12,
      leadsManaged: 3420,
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      email: 'sarah@company.com',
      role: 'Admin',
      status: 'active',
      joinedDate: 'Feb 2024',
      avatar: 'SM',
      campaignsCreated: 8,
      leadsManaged: 2150,
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@company.com',
      role: 'Member',
      status: 'active',
      joinedDate: 'Mar 2024',
      avatar: 'MC',
      campaignsCreated: 5,
      leadsManaged: 1280,
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@company.com',
      role: 'Member',
      status: 'pending',
      joinedDate: 'Invited 2 days ago',
      avatar: 'ER',
      campaignsCreated: 0,
      leadsManaged: 0,
    },
  ];

  const roles = [
    {
      name: 'Owner',
      description: 'Full access to all features and billing',
      permissions: ['All permissions', 'Billing access', 'Delete workspace'],
      icon: Crown,
      color: 'text-yellow-600',
    },
    {
      name: 'Admin',
      description: 'Manage team members and all campaigns',
      permissions: ['Manage team', 'Create campaigns', 'View analytics', 'Manage integrations'],
      icon: Shield,
      color: 'text-purple-600',
    },
    {
      name: 'Member',
      description: 'Create campaigns and manage own leads',
      permissions: ['Create campaigns', 'Manage own leads', 'View analytics'],
      icon: Users,
      color: 'text-blue-600',
    },
  ];

  return (
    <DashboardLayout title="Team Management" subtitle="Manage your team members and permissions">
      {/* Team Stats */}
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-lg font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="w-12 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-lg font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-lg font-bold text-orange-600">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Seats Available</p>
                <p className="text-lg font-bold text-purple-600">6</p>
              </div>
              <div className="w-12 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserPlus size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Team Members List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and their roles</CardDescription>
                </div>
                <Button onClick={() => setShowInviteModal(true)} className="gap-2">
                  <UserPlus size={18} />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-9">
                          <AvatarFallback className="text-base">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            {member.role === 'Owner' && (
                              <Crown size={16} className="text-yellow-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={member.status === 'active' ? 'success' : 'warning'}
                          className="capitalize"
                        >
                          {member.status}
                        </Badge>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium text-accent-600">{member.role}</span>
                        <span>•</span>
                        <span>Joined {member.joinedDate}</span>
                      </div>
                      {member.status === 'active' && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{member.campaignsCreated} campaigns</span>
                          <span>•</span>
                          <span>{member.leadsManaged.toLocaleString()} leads</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles & Permissions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Different access levels for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-9 bg-gray-100 rounded-lg flex items-center justify-center ${role.color}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{role.name}</h4>
                          <p className="text-xs text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {role.permissions.map((permission, pIndex) => (
                          <div
                            key={pIndex}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <CheckCircle2 size={12} className="text-green-600" />
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <Modal onClose={() => setShowInviteModal(false)}>
          <ModalHeader>
            <ModalTitle>Invite Team Member</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <div className="space-y-3">
              <Input label="Email Address" type="email" placeholder="colleague@company.com" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500">
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The invited member will receive an email with instructions
                  to join your workspace.
                </p>
              </div>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Mail size={16} />
              Send Invitation
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Team;

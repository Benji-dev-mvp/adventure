/**
 * Access Control Page
 *
 * Full RBAC surface for enterprise administration.
 * - Role management with Owner, Admin, Manager, Contributor, Read-only
 * - Resource scopes: Playbooks, Campaigns, Leads, Analytics, Settings, Admin
 * - Permission matrix with toggles
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AccessMatrix, SecurityStatusCard } from '../components/enterprise';
import { useRBAC, useSecurityStatus } from '../hooks/useEnterprise';
import { useTenant } from '../contexts/TenantContext';
import { useReducedMotion } from '../hooks/useMotion';
import {
  Shield,
  Users,
  Plus,
  Download,
  Upload,
  Settings,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../components/futuristic';

const AccessControl = () => {
  const { isEnterprise, isAdmin } = useTenant();
  const { roles, scopes, capabilities, currentRole, getPermissionMatrix } = useRBAC();
  const { status: securityStatus, securityScore } = useSecurityStatus();
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock team members
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'admin',
      avatar: 'SC',
      lastActive: '2 min ago',
    },
    {
      id: 2,
      name: 'Michael Torres',
      email: 'michael@company.com',
      role: 'manager',
      avatar: 'MT',
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Emily Watson',
      email: 'emily@company.com',
      role: 'contributor',
      avatar: 'EW',
      lastActive: '3 hours ago',
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@company.com',
      role: 'readonly',
      avatar: 'DK',
      lastActive: '1 day ago',
    },
    {
      id: 5,
      name: 'Jessica Park',
      email: 'jessica@company.com',
      role: 'manager',
      avatar: 'JP',
      lastActive: '5 min ago',
    },
  ];

  const tabs = [
    { id: 'matrix', label: 'Permission Matrix', icon: Shield },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'roles', label: 'Role Settings', icon: Settings },
  ];

  const handlePermissionChange = async (roleId, scope, capability, enabled) => {
    console.log('Permission change:', { roleId, scope, capability, enabled });

    try {
      const response = await fetch('/api/admin/access-control/permissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          roleId,
          scope,
          capability,
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update permission');
      }

      const result = await response.json();
      console.log('Permission updated:', result);
      // Optionally show success toast here
    } catch (error) {
      console.error('Error updating permission:', error);
      // Optionally show error toast here
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-3">
              <Shield className="h-7 w-7 text-cyan-400" />
              <GradientText gradient="cyber">Access Control</GradientText>
            </h1>
            <p className="text-slate-400 mt-1">
              Manage roles, permissions, and team access to your workspace
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Config
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </motion.div>

        {/* Security Status (Enterprise only) */}
        {isEnterprise && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SecurityStatusCard status={securityStatus} securityScore={securityScore} />
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Permission Matrix Tab */}
          {activeTab === 'matrix' && (
            <GlassCard variant="gradient">
              <GlassCardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-6">Role Permission Matrix</h3>
                <AccessMatrix
                  roles={roles}
                  scopes={scopes}
                  capabilities={capabilities}
                  getPermissionMatrix={getPermissionMatrix}
                  onPermissionChange={handlePermissionChange}
                  readOnly={!isAdmin}
                />
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Team Members Tab */}
          {activeTab === 'members' && (
            <GlassCard variant="gradient">
              <GlassCardContent className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {teamMembers
                    .filter(
                      m =>
                        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(member => {
                      const role = roles.find(r => r.id === member.role);
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                              style={{ backgroundColor: role?.color || '#6b7280' }}
                            >
                              {member.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-white">{member.name}</div>
                              <div className="text-sm text-slate-400">{member.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                style={{ borderColor: `${role?.color}50`, color: role?.color }}
                              >
                                {role?.name}
                              </Badge>
                              <div className="text-xs text-slate-500 mt-1">{member.lastActive}</div>
                            </div>
                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Role Settings Tab */}
          {activeTab === 'roles' && (
            <div className="grid gap-3">
              {roles.map(role => (
                <GlassCard key={role.id} variant="gradient">
                  <GlassCardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${role.color}20` }}
                        >
                          <Shield className="h-6 w-6" style={{ color: role.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{role.name}</h4>
                          <p className="text-sm text-slate-400">{role.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {role.id !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((perm, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300"
                        >
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-400">
                          +{role.permissions.length - 5} more
                        </span>
                      )}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}

              <Button variant="outline" className="w-full gap-2 border-dashed border-slate-600">
                <Plus className="h-4 w-4" />
                Create Custom Role
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AccessControl;

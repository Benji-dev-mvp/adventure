import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, Check, Plus, Users, Crown, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaces } from '@/hooks/useWorkspaces';

const planColors = {
  starter: 'bg-gray-500',
  professional: 'bg-blue-500',
  enterprise: 'bg-purple-500',
};

const planLabels = {
  starter: 'Starter',
  professional: 'Pro',
  enterprise: 'Enterprise',
};

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
};

const WorkspaceSwitcher = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { workspaces, activeWorkspace, switchWorkspace, isSwitching } = useWorkspaces();

  const handleSwitch = async workspaceId => {
    if (workspaceId === activeWorkspace?.id) {
      setIsOpen(false);
      return;
    }
    await switchWorkspace(workspaceId);
    setIsOpen(false);
    // In a real app, you might refresh data here
  };

  if (!activeWorkspace) return null;

  return (
    <div className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-xl transition-colors',
          'hover:bg-gray-100 dark:hover:bg-white/10',
          isOpen && 'bg-gray-100 dark:bg-white/10'
        )}
        disabled={isSwitching}
      >
        {/* Workspace Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white font-semibold text-sm">
          {activeWorkspace.name.charAt(0)}
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
            {activeWorkspace.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className={cn('w-1.5 h-1.5 rounded-full', planColors[activeWorkspace.plan])} />
            {planLabels[activeWorkspace.plan]}
          </p>
        </div>

        <ChevronDown
          className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-100 dark:border-white/10">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Switch Workspace
                </p>
              </div>

              {/* Workspace List */}
              <div className="py-2 max-h-[300px] overflow-y-auto">
                {workspaces.map(workspace => {
                  const RoleIcon = roleIcons[workspace.role] || Users;
                  const isActive = workspace.id === activeWorkspace.id;

                  return (
                    <button
                      key={workspace.id}
                      onClick={() => handleSwitch(workspace.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                        isActive
                          ? 'bg-accent-50 dark:bg-accent-500/10'
                          : 'hover:bg-gray-50 dark:hover:bg-white/5'
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold',
                          isActive
                            ? 'bg-gradient-to-br from-accent-500 to-primary-500'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        )}
                      >
                        {workspace.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isActive
                              ? 'text-accent-600 dark:text-accent-400'
                              : 'text-gray-900 dark:text-white'
                          )}
                        >
                          {workspace.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={cn(
                              'text-xs px-1.5 py-0.5 rounded',
                              planColors[workspace.plan],
                              'text-white'
                            )}
                          >
                            {planLabels[workspace.plan]}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <RoleIcon className="h-3 w-3" />
                            {workspace.role}
                          </span>
                          <span className="text-xs text-gray-400">{workspace.members} members</span>
                        </div>
                      </div>

                      {/* Active Check */}
                      {isActive && <Check className="h-5 w-5 text-accent-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to workspace creation
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create new workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceSwitcher;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Star,
  Plus,
  ChevronRight,
  Trash2,
  Flag,
  User,
  Mail,
  Phone,
  Bot,
  MoreHorizontal,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock tasks data
const MOCK_TASKS = [
  {
    id: 'task-1',
    title: 'Follow up with Sarah Chen',
    type: 'follow-up',
    priority: 'high',
    dueDate: 'today',
    dueTime: '2:00 PM',
    completed: false,
    lead: { name: 'Sarah Chen', company: 'Acme Corp' },
    channel: 'email',
    aiSuggested: true,
  },
  {
    id: 'task-2',
    title: 'Review AI-generated email sequence',
    type: 'review',
    priority: 'medium',
    dueDate: 'today',
    dueTime: '4:00 PM',
    completed: false,
    campaign: 'Q1 Enterprise Outreach',
    aiSuggested: true,
  },
  {
    id: 'task-3',
    title: 'Call back Marcus Thompson',
    type: 'call',
    priority: 'high',
    dueDate: 'today',
    dueTime: '11:30 AM',
    completed: true,
    lead: { name: 'Marcus Thompson', company: 'TechFlow' },
    channel: 'phone',
  },
  {
    id: 'task-4',
    title: 'Send proposal to Jennifer Lee',
    type: 'email',
    priority: 'high',
    dueDate: 'today',
    dueTime: '5:00 PM',
    completed: false,
    lead: { name: 'Jennifer Lee', company: 'DataSync' },
    channel: 'email',
  },
  {
    id: 'task-5',
    title: 'Prepare demo for GlobalTech',
    type: 'meeting',
    priority: 'high',
    dueDate: 'tomorrow',
    dueTime: '10:00 AM',
    completed: false,
    lead: { name: 'John Smith', company: 'GlobalTech' },
  },
  {
    id: 'task-6',
    title: 'Review campaign analytics',
    type: 'review',
    priority: 'low',
    dueDate: 'this-week',
    dueTime: null,
    completed: false,
    campaign: 'Product Launch 2024',
  },
  {
    id: 'task-7',
    title: 'Update lead scoring model',
    type: 'admin',
    priority: 'medium',
    dueDate: 'this-week',
    dueTime: null,
    completed: false,
    aiSuggested: true,
  },
  {
    id: 'task-8',
    title: 'Approve Ava playbook changes',
    type: 'review',
    priority: 'medium',
    dueDate: 'this-week',
    dueTime: null,
    completed: false,
    aiSuggested: true,
  },
];

const priorityColors = {
  high: 'text-red-500 bg-red-500/10',
  medium: 'text-amber-500 bg-amber-500/10',
  low: 'text-gray-500 bg-gray-500/10',
};

const channelIcons = {
  email: Mail,
  phone: Phone,
};

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ChannelIcon = task.channel ? channelIcons[task.channel] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer',
        'hover:bg-gray-50 dark:hover:bg-white/5',
        task.completed && 'opacity-60'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={() => onToggle(task.id)} className="mt-0.5 flex-shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className={cn('h-5 w-5', priorityColors[task.priority].split(' ')[0])} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'text-sm font-medium text-gray-900 dark:text-white truncate',
              task.completed && 'line-through'
            )}
          >
            {task.title}
          </p>
          {task.aiSuggested && (
            <Bot className="h-3.5 w-3.5 text-accent-500 flex-shrink-0" title="AI Suggested" />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {task.lead && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <User className="h-3 w-3" />
              {task.lead.name}
            </span>
          )}
          {task.campaign && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {task.campaign}
            </span>
          )}
          {task.dueTime && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.dueTime}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isHovered && !task.completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1"
          >
            {ChannelIcon && (
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                <ChannelIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
            >
              <Trash2 className="h-4 w-4 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TaskGroup = ({ title, tasks, icon: Icon, onToggle, onDelete, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-2 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn('h-4 w-4 text-gray-400 transition-transform', isExpanded && 'rotate-90')}
          />
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
          <Badge variant="secondary" size="sm">
            {completedCount}/{tasks.length}
          </Badge>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-2">
              <AnimatePresence mode="popLayout">
                {tasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TaskSidebar = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState('all'); // all, ai-suggested, high-priority

  const toggleTask = taskId => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = taskId => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ai-suggested') return task.aiSuggested;
    if (filter === 'high-priority') return task.priority === 'high';
    return true;
  });

  const todayTasks = filteredTasks.filter(t => t.dueDate === 'today');
  const tomorrowTasks = filteredTasks.filter(t => t.dueDate === 'tomorrow');
  const thisWeekTasks = filteredTasks.filter(t => t.dueDate === 'this-week');

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h2>
                <p className="text-sm text-gray-500">
                  {totalCompleted}/{totalTasks} completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
              <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-500 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalCompleted / totalTasks) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/10">
              {[
                { id: 'all', label: 'All' },
                { id: 'ai-suggested', label: 'AI Suggested', icon: Bot },
                { id: 'high-priority', label: 'High Priority', icon: Flag },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    filter === f.id
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  )}
                >
                  {f.icon && <f.icon className="h-3 w-3" />}
                  {f.label}
                </button>
              ))}
            </div>

            {/* Task Groups */}
            <div className="flex-1 overflow-y-auto p-4">
              {todayTasks.length > 0 && (
                <TaskGroup
                  title="Today"
                  tasks={todayTasks}
                  icon={Clock}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              )}
              {tomorrowTasks.length > 0 && (
                <TaskGroup
                  title="Tomorrow"
                  tasks={tomorrowTasks}
                  icon={Calendar}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              )}
              {thisWeekTasks.length > 0 && (
                <TaskGroup
                  title="This Week"
                  tasks={thisWeekTasks}
                  icon={Calendar}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  defaultExpanded={false}
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Compact trigger button for header
export const TaskTrigger = ({ onClick, count = 0 }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
    >
      <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs font-bold text-white bg-accent-500 rounded-full">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default TaskSidebar;

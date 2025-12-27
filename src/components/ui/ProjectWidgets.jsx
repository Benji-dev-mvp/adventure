import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  CheckCircle, Circle, Calendar, Clock, Users, Tag,
  MoreVertical, Plus, Trash2, Edit, Star, Folder
} from 'lucide-react';

/**
 * Project Management Widgets - Task Lists, Project Cards, Activity Logs
 */

// Task List with drag and drop
export const TaskList = ({ tasks = [], onUpdate, onDelete, onAdd, className }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAdd?.({ title: newTask, completed: false, createdAt: new Date() });
      setNewTask('');
    }
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    onUpdate?.(updated);
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks
        </h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {tasks.filter(t => t.completed).length} / {tasks.length}
        </span>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a new task..."
          className={cn(
            'flex-1 px-3 py-2 text-sm',
            'border border-gray-300 dark:border-gray-600',
            'rounded-lg',
            'bg-white dark:bg-gray-900',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          )}
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task Items */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg',
              'border border-gray-200 dark:border-gray-700',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              'transition-all',
              task.completed && 'opacity-60'
            )}
          >
            <button
              onClick={() => toggleTask(index)}
              className="flex-shrink-0 mt-0.5"
            >
              {task.completed ? (
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              ) : (
                <Circle size={20} className="text-gray-400" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm text-gray-900 dark:text-white',
                task.completed && 'line-through'
              )}>
                {task.title}
              </p>
              {task.dueDate && (
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>{task.dueDate}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onDelete?.(index)}
              className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <Trash2 size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Project Card
export const ProjectCard = ({ 
  project,
  onView,
  onEdit,
  onDelete,
  className 
}) => {
  const progress = project.totalTasks > 0
    ? (project.completedTasks / project.totalTasks) * 100
    : 0;

  return (
    <div
      className={cn(
        'group relative',
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        'hover:shadow-lg transition-all',
        'cursor-pointer',
        className
      )}
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg',
            'flex items-center justify-center',
            project.color || 'bg-blue-100 dark:bg-blue-900'
          )}>
            <Folder size={20} className={project.iconColor || 'text-blue-600 dark:text-blue-400'} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {project.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {project.category}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-opacity"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {project.members && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users size={14} />
              <span>{project.members}</span>
            </div>
          )}
          {project.dueDate && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock size={14} />
              <span>{project.dueDate}</span>
            </div>
          )}
        </div>

        {project.priority && (
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              project.priority === 'high' && 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
              project.priority === 'medium' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
              project.priority === 'low' && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            )}
          >
            {project.priority}
          </span>
        )}
      </div>
    </div>
  );
};

// Calendar Widget
export const CalendarWidget = ({ events = [], className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();
          
          const hasEvent = events.some(event => 
            new Date(event.date).getDate() === day
          );

          return (
            <div
              key={day}
              className={cn(
                'aspect-square flex items-center justify-center rounded-lg text-sm',
                'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
                isToday && 'bg-blue-600 text-white hover:bg-blue-700',
                !isToday && 'text-gray-900 dark:text-white',
                hasEvent && !isToday && 'font-bold'
              )}
            >
              {day}
              {hasEvent && !isToday && (
                <div className="absolute w-1 h-1 bg-blue-600 rounded-full mt-5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Upcoming Events
          </h4>
          <div className="space-y-2">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  event.color || 'bg-blue-600'
                )} />
                <span className="text-gray-900 dark:text-white">{event.title}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-auto">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Activity Log
export const ActivityLog = ({ activities = [], className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activity Log
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="relative flex gap-4">
              {/* Timeline Dot */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'border-4 border-white dark:border-gray-800',
                'z-10',
                activity.color || 'bg-blue-600'
              )}>
                {activity.icon && <activity.icon size={14} className="text-white" />}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Status Indicators
export const StatusBadge = ({ status, size = 'md', className }) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const statuses = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    warning: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizes[size],
        statuses[status] || statuses.inactive,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

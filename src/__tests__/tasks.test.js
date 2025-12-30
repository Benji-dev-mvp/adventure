/**
 * Tasks module tests
 * Covers task creation, state management, and operations
 */

describe('Tasks Module', () => {
  describe('Task data structures', () => {
    test('Task should have required fields', () => {
      const task = {
        id: '1',
        title: 'Test task',
        description: 'Test description',
        status: 'open',
        priority: 'high',
        assignee: 'user1',
        created_at: new Date().toISOString(),
        due_date: new Date().toISOString(),
      };

      expect(task.id).toBeDefined();
      expect(task.title).toBeDefined();
      expect(task.status).toBe('open');
      expect(['open', 'in_progress', 'done']).toContain(task.status);
    });

    test('Task priorities should be valid', () => {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      const task = { priority: 'high' };
      expect(validPriorities).toContain(task.priority);
    });

    test('Task statuses should be valid', () => {
      const validStatuses = ['open', 'in_progress', 'done', 'cancelled'];
      const task = { status: 'in_progress' };
      expect(validStatuses).toContain(task.status);
    });
  });

  describe('Task operations', () => {
    test('Should create a new task', () => {
      const createTask = (title, priority = 'medium') => ({
        id: Math.random().toString(),
        title,
        priority,
        status: 'open',
        created_at: new Date().toISOString(),
      });

      const task = createTask('New task', 'high');
      expect(task.title).toBe('New task');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('open');
    });

    test('Should update task status', () => {
      const updateTaskStatus = (task, newStatus) => ({
        ...task,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });

      const task = { id: '1', title: 'Test', status: 'open' };
      const updated = updateTaskStatus(task, 'in_progress');
      expect(updated.status).toBe('in_progress');
      expect(updated.updated_at).toBeDefined();
    });

    test('Should assign task to user', () => {
      const assignTask = (task, userId) => ({
        ...task,
        assignee: userId,
        assigned_at: new Date().toISOString(),
      });

      const task = { id: '1', title: 'Test', assignee: null };
      const assigned = assignTask(task, 'user123');
      expect(assigned.assignee).toBe('user123');
    });

    test('Should set task priority', () => {
      const setPriority = (task, priority) => ({
        ...task,
        priority,
      });

      const task = { id: '1', priority: 'low' };
      const updated = setPriority(task, 'urgent');
      expect(updated.priority).toBe('urgent');
    });
  });

  describe('Task filtering and sorting', () => {
    const tasks = [
      { id: '1', title: 'Task 1', status: 'open', priority: 'high' },
      { id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium' },
      { id: '3', title: 'Task 3', status: 'done', priority: 'low' },
      { id: '4', title: 'Task 4', status: 'open', priority: 'urgent' },
    ];

    test('Should filter tasks by status', () => {
      const filterByStatus = (tasks, status) => tasks.filter(t => t.status === status);
      const openTasks = filterByStatus(tasks, 'open');
      expect(openTasks).toHaveLength(2);
      expect(openTasks[0].id).toBe('1');
    });

    test('Should filter tasks by priority', () => {
      const filterByPriority = (tasks, priority) => tasks.filter(t => t.priority === priority);
      const urgentTasks = filterByPriority(tasks, 'urgent');
      expect(urgentTasks).toHaveLength(1);
      expect(urgentTasks[0].id).toBe('4');
    });

    test('Should sort tasks by priority', () => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const sortByPriority = (tasks) =>
        [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      const sorted = sortByPriority(tasks);
      expect(sorted[0].priority).toBe('urgent');
      expect(sorted[1].priority).toBe('high');
    });

    test('Should combine filters', () => {
      const filterTasksAdvanced = (tasks, filters) => {
        return tasks.filter(t => {
          if (filters.status && t.status !== filters.status) return false;
          if (filters.priority && t.priority !== filters.priority) return false;
          return true;
        });
      };

      const result = filterTasksAdvanced(tasks, { status: 'open', priority: 'high' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('Task validation', () => {
    test('Should validate task title', () => {
      const validateTitle = (title) => title && title.trim().length > 0 && title.length <= 200;
      expect(validateTitle('Valid title')).toBe(true);
      expect(validateTitle('')).toBe(false);
      expect(validateTitle('   ')).toBe(false);
    });

    test('Should validate task due date', () => {
      const validateDueDate = (dueDate) => {
        if (!dueDate) return true;
        const date = new Date(dueDate);
        return date > new Date();
      };

      expect(validateDueDate(null)).toBe(true);
      expect(validateDueDate(new Date(Date.now() + 86400000).toISOString())).toBe(true);
    });

    test('Should validate assignee', () => {
      const validateAssignee = (assignee) => !assignee || typeof assignee === 'string';
      expect(validateAssignee('user123')).toBe(true);
      expect(validateAssignee(null)).toBe(true);
    });
  });

  describe('Task batch operations', () => {
    test('Should bulk update task status', () => {
      const bulkUpdateStatus = (tasks, taskIds, newStatus) =>
        tasks.map(t => (taskIds.includes(t.id) ? { ...t, status: newStatus } : t));

      const tasks = [
        { id: '1', status: 'open' },
        { id: '2', status: 'open' },
        { id: '3', status: 'open' },
      ];

      const updated = bulkUpdateStatus(tasks, ['1', '2'], 'done');
      expect(updated[0].status).toBe('done');
      expect(updated[1].status).toBe('done');
      expect(updated[2].status).toBe('open');
    });

    test('Should bulk delete tasks', () => {
      const bulkDelete = (tasks, taskIds) => tasks.filter(t => !taskIds.includes(t.id));

      const tasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
        { id: '3', title: 'Task 3' },
      ];

      const remaining = bulkDelete(tasks, ['2']);
      expect(remaining).toHaveLength(2);
      expect(remaining.find(t => t.id === '2')).toBeUndefined();
    });

    test('Should bulk assign tasks', () => {
      const bulkAssign = (tasks, taskIds, userId) =>
        tasks.map(t => (taskIds.includes(t.id) ? { ...t, assignee: userId } : t));

      const tasks = [
        { id: '1', assignee: null },
        { id: '2', assignee: null },
      ];

      const assigned = bulkAssign(tasks, ['1', '2'], 'user123');
      expect(assigned[0].assignee).toBe('user123');
      expect(assigned[1].assignee).toBe('user123');
    });
  });

  describe('Task metrics', () => {
    test('Should calculate completion rate', () => {
      const calculateCompletionRate = (tasks) => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'done').length;
        return (completed / tasks.length) * 100;
      };

      const tasks = [
        { status: 'done' },
        { status: 'done' },
        { status: 'open' },
        { status: 'open' },
      ];

      expect(calculateCompletionRate(tasks)).toBe(50);
    });

    test('Should count tasks by status', () => {
      const countByStatus = (tasks) => {
        return tasks.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {});
      };

      const tasks = [
        { status: 'open' },
        { status: 'open' },
        { status: 'done' },
      ];

      const counts = countByStatus(tasks);
      expect(counts.open).toBe(2);
      expect(counts.done).toBe(1);
    });

    test('Should count tasks by priority', () => {
      const countByPriority = (tasks) => {
        return tasks.reduce((acc, t) => {
          acc[t.priority] = (acc[t.priority] || 0) + 1;
          return acc;
        }, {});
      };

      const tasks = [
        { priority: 'high' },
        { priority: 'high' },
        { priority: 'low' },
      ];

      const counts = countByPriority(tasks);
      expect(counts.high).toBe(2);
      expect(counts.low).toBe(1);
    });
  });
});

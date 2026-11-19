export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  label: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  createdAt: string;
  subtasks: { id: string; text: string; done: boolean }[];
  timeEstimateHours: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  tasksCount: number;
  completedCount: number;
  status: 'online' | 'busy' | 'offline';
}

export interface TimeLog {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  date: string;
  type: 'focus' | 'break';
}

export type ViewMode = 'board' | 'list' | 'analytics' | 'timer' | 'team';

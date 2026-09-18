export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string | null;
  priority: Priority;
  dueDate: string | null; // ISO date, e.g. "2026-09-20"
  order: number;
  createdAt: string; // ISO datetime
}

export interface NewTodoInput {
  text: string;
  category: string | null;
  priority: Priority;
  dueDate: string | null;
}

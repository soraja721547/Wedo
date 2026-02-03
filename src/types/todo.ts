export type ListType = 'general' | 'weekly' | 'monthly' | 'stash';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  listType: ListType;
  position: number;
  weekday: number | null; // 0-6 (0=Sun or 1=Mon? Usually 1=Mon in ISO, but specs say 0-6. I will use 0=Sun as standard JS Date.getDay())
  date: string | null; // YYYY-MM-DD
  createdAt: number;
  updatedAt: number;
}

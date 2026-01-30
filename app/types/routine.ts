export type RoutineCategory = 'health' | 'work' | 'mind' | 'rest';

export interface RoutineTask {
  id: string;
  date: string;
  title: string;
  start: string;
  end: string;
  category: RoutineCategory;
  notes?: string;
  completed: boolean;
}

export interface DailyReflection {
  id: string;
  date: string;
  wins: string;
  challenges: string;
  mood: 'energized' | 'steady' | 'tired';
}

export interface WeeklyGoal {
  id: string;
  title: string;
  target: string;
  progress: number;
  category: RoutineCategory;
}

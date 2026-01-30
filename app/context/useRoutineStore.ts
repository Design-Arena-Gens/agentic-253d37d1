import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { DailyReflection, RoutineTask, WeeklyGoal } from '@/app/types/routine';
import { startOfDay } from 'date-fns';

type StoreState = {
  tasks: RoutineTask[];
  selectedDate: string;
  reflections: DailyReflection[];
  goals: WeeklyGoal[];
  setSelectedDate: (date: string) => void;
  addTask: (task: Omit<RoutineTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<RoutineTask>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addReflection: (payload: Omit<DailyReflection, 'id'>) => void;
  updateReflection: (id: string, updates: Partial<DailyReflection>) => void;
  addGoal: (goal: Omit<WeeklyGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
  removeGoal: (id: string) => void;
};

const today = startOfDay(new Date()).toISOString();

export const useRoutineStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: [],
      reflections: [],
      goals: [],
      selectedDate: today,
      setSelectedDate: (date) => set({ selectedDate: date }),
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: uuidv4() }]
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      addReflection: (payload) =>
        set((state) => ({
          reflections: [
            ...state.reflections,
            { ...payload, id: uuidv4(), date: payload.date }
          ]
        })),
      updateReflection: (id, updates) =>
        set((state) => ({
          reflections: state.reflections.map((reflection) =>
            reflection.id === id ? { ...reflection, ...updates } : reflection
          )
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: uuidv4() }]
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          )
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id)
        }))
    }),
    {
      name: 'routine-compass-store',
      storage: typeof window === 'undefined'
        ? undefined
        : createJSONStorage(() => localStorage)
    }
  )
);

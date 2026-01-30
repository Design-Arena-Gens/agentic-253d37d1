'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import DateNavigator from '@/app/components/agenda/DateNavigator';
import DailyPlanner from '@/app/components/agenda/DailyPlanner';
import QuickStatsBar from '@/app/components/dashboard/QuickStatsBar';
import GoalBoard from '@/app/components/goals/GoalBoard';
import ReflectionPanel from '@/app/components/reflection/ReflectionPanel';

export default function RoutineWorkspace() {
  const { selectedDate, tasks } = useRoutineStore((state) => ({
    selectedDate: state.selectedDate,
    tasks: state.tasks
  }));

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.date === selectedDate)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [tasks, selectedDate]
  );

  const completedCount = dayTasks.filter((task) => task.completed).length;
  const focusedHours = useMemo(() => {
    return dayTasks.reduce((acc, task) => {
      const start = parseISO(task.start);
      const end = parseISO(task.end);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + Math.max(diff, 0);
    }, 0);
  }, [dayTasks]);

  return (
    <div className="workspace">
      <header className="workspace__hero glass-card">
        <div>
          <p className="workspace__label">Routine Compass</p>
          <h1 className="workspace__heading">
            map your day, honor your habits, celebrate progress
          </h1>
        </div>
        <div className="workspace__date-badge">
          <span className="workspace__day">
            {format(parseISO(selectedDate), 'EEEE, MMMM d')}
          </span>
        </div>
      </header>

      <DateNavigator />

      <QuickStatsBar
        plannedCount={dayTasks.length}
        completedCount={completedCount}
        focusHours={focusedHours}
      />

      <div className="workspace__grid">
        <div className={clsx('workspace__column', 'workspace__column--primary')}>
          <DailyPlanner tasks={dayTasks} />
        </div>
        <div className="workspace__column workspace__column--sidebar">
          <GoalBoard />
          <ReflectionPanel />
        </div>
      </div>
    </div>
  );
}

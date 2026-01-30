'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import type { RoutineTask } from '@/app/types/routine';
import TaskForm from '@/app/components/agenda/TaskForm';
import TaskCard from '@/app/components/agenda/TaskCard';

interface DailyPlannerProps {
  tasks: RoutineTask[];
}

export default function DailyPlanner({ tasks }: DailyPlannerProps) {
  const { selectedDate } = useRoutineStore((state) => ({
    selectedDate: state.selectedDate
  }));

  const timeBlocks = useMemo(() => {
    return tasks.map((task) => {
      const start = parseISO(task.start);
      const end = parseISO(task.end);
      const duration = Math.max((end.getTime() - start.getTime()) / (60 * 1000), 0);
      return {
        id: task.id,
        label: `${format(start, 'h:mm a')} → ${format(end, 'h:mm a')}`,
        duration
      };
    });
  }, [tasks]);

  return (
    <section className="glass-card planner">
      <div className="section-heading">
        <div>
          <h2>Daily ritual map</h2>
          <p>Design your day with intentional blocks aligned to your energy.</p>
        </div>
        <span className="section-heading__badge">
          {tasks.length
            ? `${tasks.length} block${tasks.length === 1 ? '' : 's'} planned`
            : 'No blocks yet'}
        </span>
      </div>

      <TaskForm selectedDate={selectedDate} />

      <div className="timeline">
        {timeBlocks.map((block) => (
          <div key={block.id} className="timeline__tick">
            <span>{block.label}</span>
            <small>{block.duration ? `${Math.round(block.duration)} min` : '—'}</small>
          </div>
        ))}
      </div>

      <div className="task-list">
        {tasks.length === 0 && (
          <p className="empty-hint">
            Nothing here yet. Start by crafting a block that reflects how you want to feel
            today.
          </p>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

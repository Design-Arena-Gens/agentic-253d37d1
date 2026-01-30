'use client';

import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import type { RoutineTask, RoutineCategory } from '@/app/types/routine';

const CATEGORY_META: Record<
  RoutineCategory,
  { label: string; accent: string; subtle: string }
> = {
  work: { label: 'Deep work', accent: '#38bdf8', subtle: 'rgba(56, 189, 248, 0.15)' },
  health: { label: 'Health', accent: '#22c55e', subtle: 'rgba(34, 197, 94, 0.14)' },
  mind: { label: 'Mind', accent: '#f97316', subtle: 'rgba(249, 115, 22, 0.14)' },
  rest: { label: 'Recovery', accent: '#a855f7', subtle: 'rgba(168, 85, 247, 0.18)' }
};

interface TaskCardProps {
  task: RoutineTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const toggleTask = useRoutineStore((state) => state.toggleTask);
  const removeTask = useRoutineStore((state) => state.removeTask);

  const start = parseISO(task.start);
  const end = parseISO(task.end);

  const meta = CATEGORY_META[task.category];

  return (
    <article
      className={clsx('task-card', task.completed && 'task-card--completed')}
      style={{
        borderColor: meta.accent,
        background: task.completed ? 'rgba(15, 23, 42, 0.85)' : meta.subtle
      }}
    >
      <header className="task-card__header">
        <div>
          <h3>{task.title}</h3>
          <p className="task-card__time">
            {format(start, 'h:mm a')} · {format(end, 'h:mm a')}
          </p>
        </div>
        <span className="task-card__badge" style={{ color: meta.accent }}>
          {meta.label}
        </span>
      </header>

      {task.notes && <p className="task-card__notes">{task.notes}</p>}

      <footer className="task-card__footer">
        <button
          type="button"
          className="secondary-button"
          onClick={() => toggleTask(task.id)}
        >
          {task.completed ? 'Mark as in-progress' : 'Mark as complete'}
        </button>
        <button
          type="button"
          className="danger-button"
          onClick={() => removeTask(task.id)}
        >
          Delete
        </button>
      </footer>
    </article>
  );
}

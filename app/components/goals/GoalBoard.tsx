'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import type { RoutineCategory } from '@/app/types/routine';

const GOAL_COLORS: Record<RoutineCategory, string> = {
  work: '#38bdf8',
  health: '#22c55e',
  mind: '#f97316',
  rest: '#a855f7'
};

export default function GoalBoard() {
  const { goals, addGoal, updateGoal, removeGoal } = useRoutineStore((state) => ({
    goals: state.goals,
    addGoal: state.addGoal,
    updateGoal: state.updateGoal,
    removeGoal: state.removeGoal
  }));

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('Describe the ritual success signal…');
  const [category, setCategory] = useState<RoutineCategory>('mind');

  const handleCreateGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    addGoal({
      title: title.trim(),
      target: target.trim(),
      category,
      progress: 0
    });
    setTitle('');
    setTarget('Describe the ritual success signal…');
    setCategory('mind');
  };

  return (
    <section className="glass-card goal-board">
      <div className="section-heading">
        <div>
          <h2>Weekly anchors</h2>
          <p>Define the habits and outcomes that keep your week grounded.</p>
        </div>
      </div>

      <form className="goal-form" onSubmit={handleCreateGoal}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="3 mindful breaks"
          required
        />
        <textarea
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          rows={2}
        />
        <div className="goal-form__footer">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as RoutineCategory)}
          >
            <option value="mind">Mind</option>
            <option value="health">Health</option>
            <option value="work">Deep work</option>
            <option value="rest">Recovery</option>
          </select>
          <button type="submit" className="primary-button">
            Add goal
          </button>
        </div>
      </form>

      <ul className="goal-list">
        {goals.length === 0 && (
          <li className="empty-hint">Set a weekly north star to focus your energy.</li>
        )}
        {goals.map((goal) => (
          <li key={goal.id} className="goal-card">
            <header>
              <h3>{goal.title}</h3>
              <button className="icon-button" type="button" onClick={() => removeGoal(goal.id)}>
                ✕
              </button>
            </header>
            <p className="goal-card__target">{goal.target}</p>
            <label className="goal-card__meter">
              <span>Progress</span>
              <input
                type="range"
                min={0}
                max={100}
                value={goal.progress}
                onChange={(event) =>
                  updateGoal(goal.id, { progress: Number(event.target.value) })
                }
                style={{ accentColor: GOAL_COLORS[goal.category] }}
              />
              <span className="goal-card__percent">{goal.progress}%</span>
            </label>
            <div className="goal-card__tags">
              <span
                className={clsx('goal-card__tag')}
                style={{
                  color: GOAL_COLORS[goal.category],
                  borderColor: GOAL_COLORS[goal.category]
                }}
              >
                {goal.category}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

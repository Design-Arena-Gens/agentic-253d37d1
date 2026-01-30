'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import type { DailyReflection } from '@/app/types/routine';

const MOODS: DailyReflection['mood'][] = ['energized', 'steady', 'tired'];

export default function ReflectionPanel() {
  const {
    selectedDate,
    reflections,
    addReflection,
    updateReflection,
    tasks
  } = useRoutineStore((state) => ({
    selectedDate: state.selectedDate,
    reflections: state.reflections,
    addReflection: state.addReflection,
    updateReflection: state.updateReflection,
    tasks: state.tasks
  }));

  const existingForDay = useMemo(
    () => reflections.find((item) => item.date === selectedDate),
    [reflections, selectedDate]
  );

  const [wins, setWins] = useState(existingForDay?.wins ?? '');
  const [challenges, setChallenges] = useState(existingForDay?.challenges ?? '');
  const [mood, setMood] = useState<DailyReflection['mood']>(
    existingForDay?.mood ?? 'steady'
  );

  const totalCompleted = useMemo(
    () => tasks.filter((task) => task.date === selectedDate && task.completed).length,
    [tasks, selectedDate]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (existingForDay) {
      updateReflection(existingForDay.id, { wins, challenges, mood });
      return;
    }
    addReflection({
      date: selectedDate,
      wins,
      challenges,
      mood
    });
  };

  return (
    <section className="glass-card reflection-panel">
      <div className="section-heading">
        <div>
          <h2>Daily reflection</h2>
          <p>Capture what felt meaningful today to reinforce momentum tomorrow.</p>
        </div>
        <span className="section-heading__badge reflection-panel__badge">
          {totalCompleted} wins logged
        </span>
      </div>

      <form className="reflection-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="visually-hidden">Mood check-in</legend>
          <div className="reflection-form__moods">
            {MOODS.map((value) => (
              <button
                type="button"
                key={value}
                className={value === mood ? 'pill-button pill-button--active' : 'pill-button'}
                onClick={() => setMood(value)}
              >
                {value === 'energized' && '⚡ Energized'}
                {value === 'steady' && '🌊 Steady'}
                {value === 'tired' && '🌙 Recharging'}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="reflection-form__control">
          <span>Highlights</span>
          <textarea
            value={wins}
            onChange={(event) => setWins(event.target.value)}
            placeholder="What energized you? What habits clicked?"
            rows={2}
          />
        </label>

        <label className="reflection-form__control">
          <span>Growth edges</span>
          <textarea
            value={challenges}
            onChange={(event) => setChallenges(event.target.value)}
            placeholder="What needs adjusting? Where did friction appear?"
            rows={2}
          />
        </label>

        <button className="primary-button" type="submit">
          {existingForDay ? 'Update reflection' : 'Save reflection'}
        </button>
      </form>

      {existingForDay && (
        <footer className="reflection-panel__meta">
          <small>
            Captured for {format(parseISO(selectedDate), 'MMM d')} · mood: {mood}
          </small>
        </footer>
      )}
    </section>
  );
}

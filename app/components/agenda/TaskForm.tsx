'use client';

import { useState } from 'react';
import { useRoutineStore } from '@/app/context/useRoutineStore';
import type { RoutineCategory } from '@/app/types/routine';

interface TaskFormProps {
  selectedDate: string;
}

const DEFAULT_CATEGORY: RoutineCategory = 'work';

export default function TaskForm({ selectedDate }: TaskFormProps) {
  const addTask = useRoutineStore((state) => state.addTask);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<RoutineCategory>(DEFAULT_CATEGORY);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Give your block a meaningful title.');
      return;
    }
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);
    if (end <= start) {
      setError('End time must be later than start time.');
      return;
    }

    addTask({
      date: selectedDate,
      title: title.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      notes: notes.trim() || undefined,
      category,
      completed: false
    });

    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setCategory(DEFAULT_CATEGORY);
    setNotes('');
    setError(null);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__grid">
        <label className="task-form__control">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Deep focus sprint, movement break…"
          />
        </label>
        <label className="task-form__control">
          <span>Start</span>
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            required
          />
        </label>
        <label className="task-form__control">
          <span>End</span>
          <input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            required
          />
        </label>
        <label className="task-form__control">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as RoutineCategory)}>
            <option value="work">Deep work</option>
            <option value="health">Health</option>
            <option value="mind">Mind</option>
            <option value="rest">Recovery</option>
          </select>
        </label>
      </div>
      <label className="task-form__control task-form__control--notes">
        <span>Notes</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          placeholder="Intentions, pacing tips, playlists…"
        />
      </label>
      <div className="task-form__footer">
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-button">
          Add block
        </button>
      </div>
    </form>
  );
}

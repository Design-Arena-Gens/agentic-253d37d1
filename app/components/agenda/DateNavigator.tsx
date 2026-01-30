'use client';

import { format, parseISO, addDays } from 'date-fns';
import { useRoutineStore } from '@/app/context/useRoutineStore';

export default function DateNavigator() {
  const { selectedDate, setSelectedDate } = useRoutineStore((state) => ({
    selectedDate: state.selectedDate,
    setSelectedDate: state.setSelectedDate
  }));

  const current = parseISO(selectedDate);

  const handleDayShift = (delta: number) => {
    const nextDate = addDays(current, delta);
    nextDate.setHours(0, 0, 0, 0);
    setSelectedDate(nextDate.toISOString());
  };

  return (
    <section className="glass-card date-navigator">
      <button
        type="button"
        className="pill-button"
        onClick={() => handleDayShift(-1)}
        aria-label="Go to previous day"
      >
        ← Yesterday
      </button>
      <div className="date-navigator__current">
        <h2>{format(current, 'EEEE')}</h2>
        <p>{format(current, 'MMMM d, yyyy')}</p>
      </div>
      <button
        type="button"
        className="pill-button"
        onClick={() => handleDayShift(1)}
        aria-label="Go to next day"
      >
        Tomorrow →
      </button>
    </section>
  );
}

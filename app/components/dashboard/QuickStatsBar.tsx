'use client';

interface QuickStatsBarProps {
  plannedCount: number;
  completedCount: number;
  focusHours: number;
}

export default function QuickStatsBar({
  plannedCount,
  completedCount,
  focusHours
}: QuickStatsBarProps) {
  const completionRate = plannedCount
    ? Math.round((completedCount / plannedCount) * 100)
    : 0;

  return (
    <section className="quick-stats">
      <div className="quick-stats__card glass-card">
        <h3>Planned</h3>
        <p className="quick-stats__number">{plannedCount}</p>
        <span className="quick-stats__hint">blocks mapped</span>
      </div>
      <div className="quick-stats__card glass-card">
        <h3>Completion</h3>
        <p className="quick-stats__number">{completionRate}%</p>
        <span className="quick-stats__hint">
          {completedCount} / {plannedCount || '—'} finished
        </span>
      </div>
      <div className="quick-stats__card glass-card">
        <h3>Focus hours</h3>
        <p className="quick-stats__number">{focusHours.toFixed(1)}</p>
        <span className="quick-stats__hint">intentional time scheduled</span>
      </div>
    </section>
  );
}

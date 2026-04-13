'use client';

import { formatMonthYear } from '@/lib/date';

interface CalendarHeaderProps {
  currentMonth: Date;
  recordCount: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  recordCount,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 px-1 py-4 sm:px-2">
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
        <button
          onClick={onPrevMonth}
          aria-label="이전 월"
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-pastel-pink/40"
        >
          <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onToday}
          className="min-w-0 truncate text-base font-bold text-text-primary transition hover:text-coral sm:text-lg md:text-xl"
        >
          {formatMonthYear(currentMonth)}
        </button>

        <button
          onClick={onNextMonth}
          aria-label="다음 월"
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-pastel-pink/40"
        >
          <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {recordCount > 0 && (
        <span className="shrink-0 whitespace-nowrap rounded-full bg-pastel-pink px-2 py-1 text-[10px] font-semibold text-coral-dark sm:px-3 sm:text-xs">
          이번 달 {recordCount}건
        </span>
      )}
    </div>
  );
}

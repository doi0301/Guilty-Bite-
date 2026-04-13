'use client';

import { useCalendar } from '@/hooks/useCalendar';
import { useRecords } from '@/hooks/useRecords';
import { useUIStore } from '@/stores/uiStore';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

export function Calendar() {
  const { currentMonth, calendarDays, yearMonth, goToPrevMonth, goToNextMonth, goToToday } =
    useCalendar();
  const { data: records = [], isLoading } = useRecords(yearMonth);
  const { openDetailSheet } = useUIStore();

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl">
      <CalendarHeader
        currentMonth={currentMonth}
        recordCount={records.length}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {isLoading ? (
        <div className="grid min-w-0 grid-cols-7 gap-px">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="h-[60px] shrink-0 animate-pulse rounded-xl bg-gray-100 md:h-[76px] lg:h-[96px]"
            />
          ))}
        </div>
      ) : (
        <CalendarGrid
          calendarDays={calendarDays}
          records={records}
          onDateClick={(dateString) => openDetailSheet(dateString)}
        />
      )}
    </div>
  );
}

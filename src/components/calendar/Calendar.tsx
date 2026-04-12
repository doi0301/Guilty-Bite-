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
    <div className="mx-auto w-full max-w-3xl">
      <CalendarHeader
        currentMonth={currentMonth}
        recordCount={records.length}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {isLoading ? (
        <div className="grid grid-cols-7 gap-px">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="min-h-[48px] animate-pulse rounded-xl bg-gray-100 md:min-h-[64px] lg:min-h-[80px]"
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

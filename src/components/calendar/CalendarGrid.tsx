'use client';

import { CalendarCell } from './CalendarCell';
import { DAY_NAMES } from '@/lib/constants';
import type { FoodRecord } from '@/types/record';

interface CalendarGridProps {
  calendarDays: {
    date: Date;
    dateString: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[];
  records: FoodRecord[];
  onDateClick: (dateString: string) => void;
}

export function CalendarGrid({ calendarDays, records, onDateClick }: CalendarGridProps) {
  const recordsByDate = records.reduce<Record<string, FoodRecord[]>>((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {});

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={`
              py-2 text-center text-xs font-semibold md:text-sm
              ${i === 0 ? 'text-coral' : i === 6 ? 'text-blue-400' : 'text-text-secondary'}
            `}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-px rounded-2xl bg-gray-100/50 overflow-hidden">
        {calendarDays.map((day) => (
          <div key={day.dateString} className="bg-bg-primary">
            <CalendarCell
              day={day.isCurrentMonth ? day.date.getDate() : null}
              dateString={day.dateString}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              records={recordsByDate[day.dateString] ?? []}
              onClick={() => onDateClick(day.dateString)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

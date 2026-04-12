'use client';

import { FoodThumbnail } from './FoodThumbnail';
import type { FoodRecord } from '@/types/record';

interface CalendarCellProps {
  day: number | null;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  records: FoodRecord[];
  onClick: () => void;
}

export function CalendarCell({
  day,
  dateString,
  isCurrentMonth,
  isToday,
  records,
  onClick,
}: CalendarCellProps) {
  if (day === null) {
    return <div className="min-h-[48px] md:min-h-[64px] lg:min-h-[80px]" />;
  }

  const visibleRecords = records.slice(0, 3);
  const extraCount = records.length - visibleRecords.length;

  return (
    <button
      onClick={onClick}
      aria-label={`${dateString} ${records.length}건의 기록`}
      className={`
        group relative flex min-h-[48px] flex-col items-center gap-0.5 rounded-xl p-1
        transition-all duration-150
        md:min-h-[64px] md:gap-1 md:p-1.5
        lg:min-h-[80px] lg:gap-1.5 lg:p-2
        ${isCurrentMonth ? 'hover:bg-pastel-pink/30' : 'opacity-40'}
        ${isToday ? 'ring-2 ring-coral ring-offset-1' : ''}
      `}
    >
      <span
        className={`
          text-xs font-medium md:text-sm
          ${isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white' : ''}
          ${isCurrentMonth ? 'text-text-primary' : 'text-text-muted'}
        `}
      >
        {day}
      </span>

      {visibleRecords.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-0.5">
          {visibleRecords.map((record) => (
            <FoodThumbnail
              key={record.id}
              thumbnailUrl={record.thumbnail_url}
              foodName={record.food_name}
              size="sm"
            />
          ))}
        </div>
      )}

      {extraCount > 0 && (
        <span className="text-[10px] font-medium text-coral">
          +{extraCount}
        </span>
      )}
    </button>
  );
}

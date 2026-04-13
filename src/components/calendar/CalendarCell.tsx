'use client';

import { FoodThumbnail } from './FoodThumbnail';
import type { FoodRecord } from '@/types/record';

/** 고정 셀 높이: 모바일 / 태블릿 / 데스크톱 */
const CELL_HEIGHT =
  'h-[60px] md:h-[76px] lg:h-[96px]';

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
    return <div className={`${CELL_HEIGHT} shrink-0`} aria-hidden />;
  }

  const visibleRecords = records.slice(0, 3);
  const extraCount = records.length - visibleRecords.length;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${dateString} ${records.length}건의 기록`}
      className={`
        group relative flex ${CELL_HEIGHT} w-full shrink-0 flex-col items-center justify-start gap-0.5
        overflow-hidden rounded-xl p-0.5 transition-all duration-150
        md:gap-1 md:p-1
        lg:gap-1 lg:p-1.5
        ${isCurrentMonth ? 'hover:bg-pastel-pink/30' : 'opacity-40'}
        ${isToday ? 'ring-2 ring-coral ring-offset-1' : ''}
      `}
    >
      <span
        className={`
          shrink-0 text-[10px] font-medium leading-none md:text-xs lg:text-sm
          ${isToday ? 'flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white md:h-6 md:w-6' : ''}
          ${isCurrentMonth ? 'text-text-primary' : 'text-text-muted'}
        `}
      >
        {day}
      </span>

      {visibleRecords.length > 0 && (
        <div className="flex min-h-0 w-full max-w-full flex-1 items-center justify-center overflow-hidden px-0.5">
          <div className="flex max-w-full items-center justify-center">
            {visibleRecords.map((record, index) => (
              <div
                key={record.id}
                className={index > 0 ? '-ml-1.5 shrink-0' : 'shrink-0'}
              >
                <FoodThumbnail
                  thumbnailUrl={record.thumbnail_url}
                  foodName={record.food_name}
                  size="sm"
                />
              </div>
            ))}
            {extraCount > 0 && (
              <span className="ml-0.5 shrink-0 text-[9px] font-semibold text-coral md:text-[10px]">
                +{extraCount}
              </span>
            )}
          </div>
        </div>
      )}
    </button>
  );
}

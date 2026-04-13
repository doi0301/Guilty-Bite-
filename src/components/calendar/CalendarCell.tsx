'use client';

import { useState } from 'react';
import type { FoodRecord } from '@/types/record';

const CELL_HEIGHT =
  'h-[60px] md:h-[76px] lg:h-[96px]';

function GridThumb({ record }: { record: FoodRecord }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center rounded-sm bg-pastel-cream text-[10px]">
        🍽️
      </div>
    );
  }

  return (
    <img
      src={record.thumbnail_url}
      alt={record.food_name}
      title={record.food_name}
      className="h-full min-h-0 w-full rounded-sm object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

function FullCellThumb({ record }: { record: FoodRecord }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-pastel-cream text-sm">
        🍽️
      </div>
    );
  }

  return (
    <img
      src={record.thumbnail_url}
      alt={record.food_name}
      title={record.food_name}
      className="h-full w-full rounded-md object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

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

  const n = records.length;
  const showOverflowBadge = n > 4;
  const extraCount = showOverflowBadge ? n - 3 : 0;

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

      {n === 1 && (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-1 md:px-1.5">
          <div className="aspect-square h-full max-h-full w-auto max-w-full overflow-hidden rounded-md">
            <FullCellThumb record={records[0]} />
          </div>
        </div>
      )}

      {n >= 2 && (
        <div className="grid min-h-0 w-full flex-1 grid-cols-2 grid-rows-2 gap-0.5 px-1 md:gap-1 md:px-1.5">
          {showOverflowBadge ? (
            <>
              <div className="min-h-0 min-w-0 overflow-hidden">
                <GridThumb record={records[0]} />
              </div>
              <div className="min-h-0 min-w-0 overflow-hidden">
                <GridThumb record={records[1]} />
              </div>
              <div className="min-h-0 min-w-0 overflow-hidden">
                <GridThumb record={records[2]} />
              </div>
              <div
                className="flex min-h-0 min-w-0 items-center justify-center rounded-sm bg-pastel-cream text-[8px] font-bold leading-none text-coral md:text-[9px] lg:text-[10px]"
                title={`외 ${extraCount}건`}
              >
                +{extraCount}
              </div>
            </>
          ) : (
            records.slice(0, 4).map((record) => (
              <div key={record.id} className="min-h-0 min-w-0 overflow-hidden">
                <GridThumb record={record} />
              </div>
            ))
          )}
        </div>
      )}
    </button>
  );
}

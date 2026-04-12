'use client';

import { PORTION_LABELS } from '@/lib/constants';
import type { FoodRecord } from '@/types/record';
import { FoodThumbnail } from '@/components/calendar/FoodThumbnail';

interface RecordItemProps {
  record: FoodRecord;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function RecordItem({ record, onEdit, onDelete, isDeleting }: RecordItemProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-white p-3 transition ${isDeleting ? 'opacity-40' : ''}`}
    >
      <FoodThumbnail
        thumbnailUrl={record.thumbnail_url}
        foodName={record.food_name}
        size="lg"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary">{record.food_name}</p>
        <p className="text-xs text-text-secondary">
          양: {PORTION_LABELS[record.portion]}
          {record.memo && ` · ${record.memo}`}
        </p>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition hover:bg-pastel-purple/50 hover:text-text-primary"
        >
          편집
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-lg px-2 py-1 text-xs font-medium text-coral transition hover:bg-pastel-pink hover:text-coral-dark disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

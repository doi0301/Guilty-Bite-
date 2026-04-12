'use client';

import { useState } from 'react';
import { RecordItem } from './RecordItem';
import { useRecordsByDate, useDeleteRecord } from '@/hooks/useRecords';
import { useUIStore } from '@/stores/uiStore';
import { formatDayLabel } from '@/lib/date';

interface RecordListProps {
  date: string;
  onClose: () => void;
}

export function RecordList({ date, onClose }: RecordListProps) {
  const { data: records = [], isLoading } = useRecordsByDate(date);
  const deleteRecord = useDeleteRecord();
  const { openAddForm, openEditForm } = useUIStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dateObj = new Date(date + 'T00:00:00');

  const handleDelete = async (record: typeof records[0]) => {
    if (!confirm('이 기록을 삭제할까요?')) return;
    setDeletingId(record.id);
    try {
      await deleteRecord.mutateAsync(record);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          {formatDayLabel(dateObj)}
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Records */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-4xl">🍽️</span>
          <p className="text-sm text-text-muted">아직 기록이 없어요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <RecordItem
              key={record.id}
              record={record}
              onEdit={() => openEditForm(record)}
              onDelete={() => handleDelete(record)}
              isDeleting={deletingId === record.id}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        onClick={() => openAddForm(date)}
        className="w-full rounded-xl border-2 border-dashed border-coral-light py-3 text-sm font-semibold text-coral transition hover:border-coral hover:bg-pastel-pink/30"
      >
        + 기록 추가
      </button>
    </div>
  );
}

'use client';

import { useUIStore } from '@/stores/uiStore';
import { formatDate } from '@/lib/date';

export function FAB() {
  const { openAddForm } = useUIStore();

  return (
    <button
      onClick={() => openAddForm(formatDate(new Date()))}
      aria-label="기록하기"
      className="
        fixed bottom-6 right-6 z-30
        flex h-14 w-14 items-center justify-center
        rounded-full bg-coral text-white shadow-lg shadow-coral/30
        transition-all duration-200
        hover:scale-110 hover:bg-coral-dark hover:shadow-xl hover:shadow-coral/40
        active:scale-95
      "
    >
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

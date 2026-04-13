'use client';

import { useState } from 'react';
import { FoodSearch } from './FoodSearch';
import { ImageSearchResult } from './ImageSearchResult';
import { PortionSelector } from './PortionSelector';
import { MemoInput } from './MemoInput';
import { useImageSearch } from '@/hooks/useImageSearch';
import { useAddRecord } from '@/hooks/useRecords';
import { formatDayLabel } from '@/lib/date';
import type { PortionSize } from '@/types/record';
import type { ImageSearchResult as ImageResult } from '@/types/kakao';

interface RecordAddFormProps {
  date: string;
  onClose: () => void;
  onSaved?: () => void;
}

export function RecordAddForm({ date, onClose, onSaved }: RecordAddFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState<PortionSize>('medium');
  const [memo, setMemo] = useState('');

  const { data: searchData, isLoading: searchLoading, error: searchError, shuffle, canShuffle } = useImageSearch(searchQuery);
  const addRecord = useAddRecord();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) setFoodName(query.trim());
  };

  const handleSelectImage = (image: ImageResult) => {
    setSelectedImage(image);
  };

  const handleSave = async () => {
    if (!foodName.trim() || !selectedImage) return;

    try {
      await addRecord.mutateAsync({
        date,
        food_name: foodName.trim(),
        image_url: selectedImage.image_url,
        thumbnail_url: selectedImage.thumbnail_url,
        portion,
        memo: memo.trim() || null,
      });
      onSaved?.();
      onClose();
    } catch {
      // error handled by mutation
    }
  };

  const dateObj = new Date(date + 'T00:00:00');
  const canSave = foodName.trim().length > 0 && selectedImage !== null;

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-none">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2 sm:px-5 sm:py-4 sm:space-y-5 lg:flex-none lg:overflow-visible lg:space-y-5 lg:p-5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-bold text-text-primary sm:text-lg">
            {formatDayLabel(dateObj)} 기록 추가
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="닫기"
          >
            <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <FoodSearch onSearch={handleSearch} />

        <ImageSearchResult
          images={searchData?.documents ?? []}
          selectedImage={selectedImage}
          onSelect={handleSelectImage}
          isLoading={searchLoading}
          error={searchError?.message}
          onShuffle={shuffle}
          canShuffle={canShuffle}
        />

        {selectedImage && (
          <>
            <PortionSelector value={portion} onChange={setPortion} />
            <MemoInput value={memo} onChange={setMemo} />
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-bg-primary px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:px-5 lg:border-t-0 lg:px-5 lg:pb-5 lg:pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || addRecord.isPending}
          className="w-full rounded-xl bg-coral py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addRecord.isPending ? '저장 중...' : '저장하기'}
        </button>

        {addRecord.isError && (
          <p className="mt-2 text-center text-sm text-coral-dark">
            앗, 저장에 실패했어요. 다시 한번 시도해주세요!
          </p>
        )}
      </div>
    </div>
  );
}

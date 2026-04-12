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
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          {formatDayLabel(dateObj)} 기록 추가
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

      {/* Search */}
      <FoodSearch onSearch={handleSearch} />

      {/* Image results */}
      <ImageSearchResult
        images={searchData?.documents ?? []}
        selectedImage={selectedImage}
        onSelect={handleSelectImage}
        isLoading={searchLoading}
        error={searchError?.message}
        onShuffle={shuffle}
        canShuffle={canShuffle}
      />

      {/* Portion & Memo */}
      {selectedImage && (
        <>
          <PortionSelector value={portion} onChange={setPortion} />
          <MemoInput value={memo} onChange={setMemo} />
        </>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!canSave || addRecord.isPending}
        className="w-full rounded-xl bg-coral py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {addRecord.isPending ? '저장 중...' : '저장하기'}
      </button>

      {addRecord.isError && (
        <p className="text-center text-sm text-coral-dark">
          앗, 저장에 실패했어요. 다시 한번 시도해주세요!
        </p>
      )}
    </div>
  );
}

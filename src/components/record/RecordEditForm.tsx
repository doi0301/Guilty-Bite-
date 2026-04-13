'use client';

import { useState } from 'react';
import { FoodSearch } from './FoodSearch';
import { ImageSearchResult } from './ImageSearchResult';
import { PortionSelector } from './PortionSelector';
import { MemoInput } from './MemoInput';
import { useImageSearch } from '@/hooks/useImageSearch';
import { useUpdateRecord } from '@/hooks/useRecords';
import type { FoodRecord, PortionSize } from '@/types/record';
import type { ImageSearchResult as ImageResult } from '@/types/kakao';

interface RecordEditFormProps {
  record: FoodRecord;
  onClose: () => void;
  onSaved?: () => void;
}

export function RecordEditForm({ record, onClose, onSaved }: RecordEditFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageResult>({
    image_url: record.image_url,
    thumbnail_url: record.thumbnail_url,
    width: 0,
    height: 0,
    display_sitename: '',
  });
  const [foodName, setFoodName] = useState(record.food_name);
  const [portion, setPortion] = useState<PortionSize>(record.portion);
  const [memo, setMemo] = useState(record.memo ?? '');

  const { data: searchData, isLoading: searchLoading, error: searchError, shuffle, canShuffle } = useImageSearch(searchQuery);
  const updateRecord = useUpdateRecord();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) setFoodName(query.trim());
  };

  const handleSave = async () => {
    if (!foodName.trim() || !selectedImage) return;

    try {
      await updateRecord.mutateAsync({
        id: record.id,
        updates: {
          food_name: foodName.trim(),
          image_url: selectedImage.image_url,
          thumbnail_url: selectedImage.thumbnail_url,
          portion,
          memo: memo.trim() || null,
        },
      });
      onSaved?.();
      onClose();
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-none">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2 sm:px-5 sm:py-4 sm:space-y-5 lg:flex-none lg:overflow-visible lg:space-y-5 lg:p-5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-bold text-text-primary sm:text-lg">기록 편집</h2>
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

        {!searchQuery && (
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-pastel-cream/50 p-3">
            <img
              src={record.thumbnail_url}
              alt={record.food_name}
              className="h-14 w-14 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-text-primary">{record.food_name}</p>
              <p className="text-xs text-text-muted">다른 이미지를 검색해 변경할 수 있어요</p>
            </div>
          </div>
        )}

        <FoodSearch onSearch={handleSearch} initialValue="" />

        {searchQuery && (
          <ImageSearchResult
            images={searchData?.documents ?? []}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
            isLoading={searchLoading}
            error={searchError?.message}
            onShuffle={shuffle}
            canShuffle={canShuffle}
          />
        )}

        <PortionSelector value={portion} onChange={setPortion} />
        <MemoInput value={memo} onChange={setMemo} />
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-bg-primary px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:px-5 lg:border-t-0 lg:px-5 lg:pb-5 lg:pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!foodName.trim() || updateRecord.isPending}
          className="w-full rounded-xl bg-coral py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateRecord.isPending ? '수정 중...' : '수정하기'}
        </button>

        {updateRecord.isError && (
          <p className="mt-2 text-center text-sm text-coral-dark">
            수정에 실패했어요. 다시 시도해주세요!
          </p>
        )}
      </div>
    </div>
  );
}

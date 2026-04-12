'use client';

import type { ImageSearchResult as ImageResult } from '@/types/kakao';

interface ImageSearchResultProps {
  images: ImageResult[];
  selectedImage: ImageResult | null;
  onSelect: (image: ImageResult) => void;
  isLoading: boolean;
  error?: string | null;
  onShuffle?: () => void;
  canShuffle?: boolean;
}

export function ImageSearchResult({
  images,
  selectedImage,
  onSelect,
  isLoading,
  error,
  onShuffle,
  canShuffle,
}: ImageSearchResultProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="text-2xl">😥</span>
        <p className="text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="text-2xl">🔍</span>
        <p className="text-sm text-text-muted">
          음식을 검색하면 이미지가 표시돼요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
      {images.map((image, index) => {
        const isSelected =
          selectedImage?.image_url === image.image_url;

        return (
          <button
            key={`${image.image_url}-${index}`}
            onClick={() => onSelect(image)}
            className={`
              relative aspect-square overflow-hidden rounded-xl border-2 transition-all
              ${isSelected ? 'border-coral shadow-lg scale-[1.02]' : 'border-transparent hover:border-coral-light'}
            `}
          >
            <img
              src={image.thumbnail_url}
              alt={`검색 결과 ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center bg-coral/20">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
      </div>

      {onShuffle && (
        <button
          onClick={onShuffle}
          disabled={!canShuffle || isLoading}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-medium text-text-secondary transition hover:border-coral-light hover:text-coral disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {canShuffle ? '다른 이미지 보기' : '마지막 결과예요'}
        </button>
      )}
    </div>
  );
}

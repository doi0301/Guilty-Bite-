'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import type { ImageSearchResponse } from '@/types/kakao';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

async function searchImages(query: string, page: number): Promise<ImageSearchResponse> {
  const response = await fetch(
    `/api/image-search?query=${encodeURIComponent(query)}&size=8&page=${page}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '이미지 검색에 실패했어요');
  }
  return response.json();
}

export function useImageSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const queryResult = useQuery({
    queryKey: ['image-search', debouncedQuery, page],
    queryFn: () => searchImages(debouncedQuery, page),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const shuffle = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const canShuffle = !(queryResult.data?.meta.is_end ?? true);

  return { ...queryResult, shuffle, canShuffle, page };
}

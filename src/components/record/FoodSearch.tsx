'use client';

import { useState } from 'react';
import { FOOD_PRESETS } from '@/lib/constants';

interface FoodSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function FoodSearch({ onSearch, initialValue = '' }: FoodSearchProps) {
  const [query, setQuery] = useState(initialValue);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="음식 이름을 검색하세요"
          autoFocus
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
        />
      </div>

      <div className="max-h-[7.5rem] overflow-y-auto overflow-x-hidden pr-0.5 [-webkit-overflow-scrolling:touch] sm:max-h-none sm:overflow-visible">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {FOOD_PRESETS.map((preset) => (
          <button
            key={preset.keyword}
            type="button"
            onClick={() => handleChange(preset.keyword)}
            className={`
              rounded-full border px-2.5 py-1 text-[11px] font-medium transition sm:px-3 sm:py-1.5 sm:text-xs
              ${query === preset.keyword
                ? 'border-coral bg-coral/10 text-coral-dark'
                : 'border-gray-200 bg-white text-text-secondary hover:border-coral-light hover:bg-pastel-pink/30'
              }
            `}
          >
            {preset.emoji} {preset.keyword}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}

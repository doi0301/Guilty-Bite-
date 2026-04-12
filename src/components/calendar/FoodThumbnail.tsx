'use client';

import { useState } from 'react';

interface FoodThumbnailProps {
  thumbnailUrl: string;
  foodName: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

export function FoodThumbnail({ thumbnailUrl, foodName, size = 'md' }: FoodThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-pastel-cream text-xs`}
        title={foodName}
      >
        🍽️
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt={foodName}
      title={foodName}
      className={`${sizeClasses[size]} rounded-lg object-cover`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

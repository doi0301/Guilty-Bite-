'use client';

import type { PortionSize } from '@/types/record';
import { PORTION_LABELS } from '@/lib/constants';

interface PortionSelectorProps {
  value: PortionSize;
  onChange: (value: PortionSize) => void;
}

const portions: { value: PortionSize; emoji: string }[] = [
  { value: 'small', emoji: '🍽️' },
  { value: 'medium', emoji: '🍽️🍽️' },
  { value: 'large', emoji: '🍽️🍽️🍽️' },
];

export function PortionSelector({ value, onChange }: PortionSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-secondary">양</label>
      <div className="flex gap-2">
        {portions.map((portion) => (
          <button
            key={portion.value}
            type="button"
            onClick={() => onChange(portion.value)}
            className={`
              flex-1 rounded-xl border py-2.5 text-center text-sm font-medium transition
              ${
                value === portion.value
                  ? 'border-coral bg-coral/10 text-coral-dark'
                  : 'border-gray-200 bg-white text-text-secondary hover:border-coral-light'
              }
            `}
          >
            <span className="block text-base">{portion.emoji}</span>
            <span className="mt-0.5 block text-xs">{PORTION_LABELS[portion.value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

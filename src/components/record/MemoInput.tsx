'use client';

interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemoInput({ value, onChange }: MemoInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-secondary">메모</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        placeholder="간단한 메모를 남겨보세요 (선택)"
        maxLength={100}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
      />
      {value.length > 0 && (
        <p className="text-right text-xs text-text-muted">{value.length}/100</p>
      )}
    </div>
  );
}

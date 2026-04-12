export const FOOD_PRESETS = [
  { keyword: '치킨', emoji: '🍗' },
  { keyword: '라면', emoji: '🍜' },
  { keyword: '피자', emoji: '🍕' },
  { keyword: '떡볶이', emoji: '🌶️' },
  { keyword: '햄버거', emoji: '🍔' },
  { keyword: '족발', emoji: '🍖' },
  { keyword: '콜라', emoji: '🥤' },
  { keyword: '아이스크림', emoji: '🍦' },
  { keyword: '과자', emoji: '🍪' },
  { keyword: '케이크', emoji: '🍰' },
  { keyword: '맥주', emoji: '🍺' },
  { keyword: '소주', emoji: '🍶' },
] as const;

export const PORTION_LABELS = {
  small: '조금',
  medium: '보통',
  large: '많이',
} as const;

export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

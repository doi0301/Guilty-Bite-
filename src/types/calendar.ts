import type { FoodRecord } from './record';

export interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  records: FoodRecord[];
}

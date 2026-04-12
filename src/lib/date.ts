import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday as isTodayFn,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function getCalendarDays(month: Date): Date[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko });
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatYearMonth(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function formatDayLabel(date: Date): string {
  return format(date, 'M월 d일 (E)', { locale: ko });
}

export function getMonthRange(month: Date) {
  return {
    start: format(startOfMonth(month), 'yyyy-MM-dd'),
    end: format(endOfMonth(month), 'yyyy-MM-dd'),
  };
}

export { addMonths, subMonths, isSameMonth, isSameDay, isTodayFn as isToday };

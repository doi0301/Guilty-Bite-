'use client';

import { useState, useMemo, useCallback } from 'react';
import { getCalendarDays, formatDate, formatYearMonth, addMonths, subMonths, isSameMonth, isToday } from '@/lib/date';

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const calendarDays = useMemo(() => {
    return getCalendarDays(currentMonth).map((date) => ({
      date,
      dateString: formatDate(date),
      isCurrentMonth: isSameMonth(date, currentMonth),
      isToday: isToday(date),
    }));
  }, [currentMonth]);

  const yearMonth = useMemo(() => formatYearMonth(currentMonth), [currentMonth]);

  return {
    currentMonth,
    calendarDays,
    yearMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  };
}

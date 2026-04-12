'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import type { FoodRecord, RecordInsert, RecordUpdate } from '@/types/record';

const supabase = createClient();

export function useRecords(yearMonth: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['records', user?.id, yearMonth],
    queryFn: async (): Promise<FoodRecord[]> => {
      const [year, month] = yearMonth.split('-').map(Number);
      const startDate = `${yearMonth}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('records')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('created_at');

      if (error) throw error;
      return data as FoodRecord[];
    },
    enabled: !!user?.id && !!yearMonth,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecordsByDate(date: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['records', user?.id, date],
    queryFn: async (): Promise<FoodRecord[]> => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('date', date!)
        .order('created_at');

      if (error) throw error;
      return data as FoodRecord[];
    },
    enabled: !!user?.id && !!date,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddRecord() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: RecordInsert) => {
      const { data, error } = await supabase
        .from('records')
        .insert({ ...record, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data as FoodRecord;
    },
    onSuccess: (data) => {
      const yearMonth = data.date.substring(0, 7);
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, data.date] });
    },
  });
}

export function useUpdateRecord() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RecordUpdate }) => {
      const { data, error } = await supabase
        .from('records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as FoodRecord;
    },
    onSuccess: (data) => {
      const yearMonth = data.date.substring(0, 7);
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, data.date] });
    },
  });
}

export function useDeleteRecord() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: FoodRecord) => {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', record.id);

      if (error) throw error;
      return record;
    },
    onSuccess: (record) => {
      const yearMonth = record.date.substring(0, 7);
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ['records', user?.id, record.date] });
    },
  });
}

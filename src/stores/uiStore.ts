import { create } from 'zustand';
import type { FoodRecord } from '@/types/record';

interface UIStore {
  isAddFormOpen: boolean;
  isDetailSheetOpen: boolean;
  isEditFormOpen: boolean;

  selectedDate: string | null;
  selectedRecord: FoodRecord | null;

  openAddForm: (date: string) => void;
  closeAddForm: () => void;
  openDetailSheet: (date: string) => void;
  closeDetailSheet: () => void;
  openEditForm: (record: FoodRecord) => void;
  closeEditForm: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAddFormOpen: false,
  isDetailSheetOpen: false,
  isEditFormOpen: false,
  selectedDate: null,
  selectedRecord: null,

  openAddForm: (date) =>
    set({ isAddFormOpen: true, isDetailSheetOpen: false, isEditFormOpen: false, selectedDate: date }),
  closeAddForm: () => set({ isAddFormOpen: false }),

  openDetailSheet: (date) =>
    set({ isDetailSheetOpen: true, isAddFormOpen: false, isEditFormOpen: false, selectedDate: date }),
  closeDetailSheet: () => set({ isDetailSheetOpen: false, selectedDate: null }),

  openEditForm: (record) =>
    set({ isEditFormOpen: true, isAddFormOpen: false, selectedRecord: record }),
  closeEditForm: () => set({ isEditFormOpen: false, selectedRecord: null }),

  closeAll: () =>
    set({
      isAddFormOpen: false,
      isDetailSheetOpen: false,
      isEditFormOpen: false,
      selectedDate: null,
      selectedRecord: null,
    }),
}));

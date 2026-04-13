'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { FAB } from '@/components/layout/FAB';
import { Modal } from '@/components/ui/Modal';
import { RecordAddForm } from '@/components/record/RecordAddForm';
import { RecordList } from '@/components/record/RecordList';
import { RecordEditForm } from '@/components/record/RecordEditForm';
import { useUIStore } from '@/stores/uiStore';

export default function CalendarPage() {
  const {
    isAddFormOpen,
    isDetailSheetOpen,
    isEditFormOpen,
    selectedDate,
    selectedRecord,
    closeAddForm,
    closeDetailSheet,
    closeEditForm,
  } = useUIStore();

  return (
    <div className="min-w-0 overflow-x-hidden px-2 py-6 sm:px-4">
      <Calendar />
      <FAB />

      {/* Detail sheet */}
      <Modal isOpen={isDetailSheetOpen && !!selectedDate} onClose={closeDetailSheet}>
        {selectedDate && (
          <RecordList date={selectedDate} onClose={closeDetailSheet} />
        )}
      </Modal>

      {/* Add form */}
      <Modal isOpen={isAddFormOpen && !!selectedDate} onClose={closeAddForm}>
        {selectedDate && (
          <RecordAddForm date={selectedDate} onClose={closeAddForm} />
        )}
      </Modal>

      {/* Edit form */}
      <Modal isOpen={isEditFormOpen && !!selectedRecord} onClose={closeEditForm}>
        {selectedRecord && (
          <RecordEditForm
            record={selectedRecord}
            onClose={closeEditForm}
          />
        )}
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDonVi } from './DonVi/useDonVi';
import { SearchBar } from '@/components/SearchBar';
import { DonViTable } from './DonVi/DonViTable';
import { DonViModal } from './DonVi/DonViModal';
import type { DonVi } from '@/types/interfaces';

export default function DonViPage() {
  const {
    filteredDonViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchDonVi, 
    toggleSortOrder,
    handleSave,
    handleDelete,
    canEdit,
    canHardDelete,
  } = useDonVi();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedDonVi, setSelectedDonVi] = useState<DonVi | null>(null);

  const openCreateModal = () => {
    setSelectedDonVi(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (donVi: DonVi) => {
    setSelectedDonVi(donVi);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (donVi: DonVi) => {
    setSelectedDonVi(donVi);
    setModalMode('view');
    setModalOpen(true);
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách đơn vị
          {canEdit && (
            <Button onClick={openCreateModal} variant="secondary">
              Tạo mới
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Tìm kiếm đơn vị..." />
        <DonViTable
          filteredDonViList={filteredDonViList}
          loading={loading}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          canEdit={canEdit}
          canHardDelete={canHardDelete}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <DonViModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          selectedDonVi={selectedDonVi}
          onSave={async (data) => {
            if (modalMode === 'create' || modalMode === 'edit') {
              await handleSave(data, modalMode, selectedDonVi?.id);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
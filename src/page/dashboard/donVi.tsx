import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDonVi } from './hooks/useDonVi';
import { SearchBar } from '@/components/SearchBar';
import { DonViTable } from './components/donVi-manager/DonViTable';
import { DonViModal } from './components/donVi-manager/DonViModal';
import { DonViViewModal } from './components/donVi-manager/DonViViewModal';
import { DeletedDonVisModal } from './components/donVi-manager/DeletedDonVisModal';
import type { DonVi } from '@/types/interfaces';

export default function DonViPage() {
  const {
    filteredDonViList,
    deletedDonViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    fetchDeletedDonVis,
    toggleSortOrder,
    handleSave,
    handleDelete,
    handlePermanentDelete,
    handleRestore,
    canEdit,
    canHardDelete,
  } = useDonVi();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [trashModalOpen, setTrashModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedDonVi, setSelectedDonVi] = useState<DonVi | null>(null);

  const openCreateModal = () => {
    setMode('create');
    setSelectedDonVi(null);
    setModalOpen(true);
  };

  const openEditModal = (donVi: DonVi) => {
    setMode('edit');
    setSelectedDonVi(donVi);
    setModalOpen(true);
  };

  const openViewModal = (donVi: DonVi) => {
    setSelectedDonVi(donVi);
    setViewModalOpen(true);
  };

  const openTrashModal = () => {
    fetchDeletedDonVis();
    setTrashModalOpen(true);
  };

  const handleSaveDonVi = async (data: any) => {
    await handleSave(data, mode, selectedDonVi?.id);
    setModalOpen(false);
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách đơn vị
          <div className="flex gap-2">
            {canHardDelete && (
              <Button onClick={openTrashModal} variant="destructive">
                Thùng rác
              </Button>
            )}
            {canEdit && (
              <Button onClick={openCreateModal} variant="secondary">
                Tạo mới
              </Button>
            )}
          </div>
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
          mode={mode}
          selectedDonVi={selectedDonVi}
          onSave={handleSaveDonVi}
        />
        <DonViViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          selectedDonVi={selectedDonVi}
        />
        <DeletedDonVisModal
          isOpen={trashModalOpen}
          onClose={() => setTrashModalOpen(false)}
          deletedDonVis={deletedDonViList}
          onPermanentDelete={handlePermanentDelete}
          onRestore={handleRestore}
        />
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePhanCong } from './hooks/usePhanCong';
import { SearchBar } from '@/components/SearchBar';
import { PhanCongTable } from './components/phanCong-manager/PhanCongTable';
import { PhanCongModal } from './components/phanCong-manager/PhanCongModal';
import { PhanCongViewModal } from './components/phanCong-manager/PhanCongViewModal';
import NoPlanSelected from '../dashboard/components/kehoach-manager/NoPlanSelected'; 
import type { PhanCongUser } from '@/types/interfaces';

export default function PhanCongPage() {
  const {
    filteredPhanCongList,
    nguoiDungList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    canEdit,
    canHardDelete,
    toggleSortOrder,
    handleSave,
    handleDelete,
    selectedPlan, // Lấy từ hook
  } = usePhanCong();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedPhanCong, setSelectedPhanCong] = useState<PhanCongUser | null>(null);

  const openCreateModal = () => {
    setMode('create');
    setSelectedPhanCong(null);
    setModalOpen(true);
  };

  const openEditModal = (phanCong: PhanCongUser) => {
    setMode('edit');
    setSelectedPhanCong(phanCong);
    setModalOpen(true);
  };

  const openViewModal = (phanCong: PhanCongUser) => {
    setSelectedPhanCong(phanCong);
    setViewModalOpen(true);
  };

  const handleSavePhanCong = async (data: any) => {
    try {
      await handleSave(data, mode, selectedPhanCong?.id);
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save phan cong:", error);
    }
  };

  if (!selectedPlan) {
    return <NoPlanSelected />;
  }

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách phân công cho Kế hoạch: <span className="text-primary">{selectedPlan.name}</span>
          <div className="flex gap-2">
            {canEdit && (
              <Button onClick={openCreateModal} variant="secondary">
                Tạo mới phân công
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Tìm kiếm phân công..." />
        <PhanCongTable
          filteredPhanCongList={filteredPhanCongList}
          loading={loading}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          canEdit={canEdit}
          canHardDelete={canHardDelete}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <PhanCongModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={mode}
          selectedPhanCong={selectedPhanCong}
          nguoiDungList={nguoiDungList} 
          onSave={handleSavePhanCong}
        />
        <PhanCongViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          selectedPhanCong={selectedPhanCong}
        />
      </CardContent>
    </Card>
  );
}
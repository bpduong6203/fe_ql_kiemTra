// src/page/dashboard/KeHoachDetail.tsx
import React, { useState } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import { useKeHoachDetail } from '@/page/dashboard/hooks/useKeHoachDetail';
import { useTaiLieu } from '@/page/dashboard/hooks/useTaiLieu';
import { useSelectedPlan } from '@/context/SelectedPlanContext';
import NoPlanSelected from './components/kehoach-manager/NoPlanSelected';
import PlanError from './components/kehoach-manager/PlanError';
import PlanInfo from './components/kehoach-manager/PlanInfo';
import UnitInfo from './components/kehoach-manager/UnitInfo';
import DocumentsTable from './components/kehoach-manager/DocumentsTable';
import DeleteConfirmationDialog from './components/kehoach-manager/DeleteConfirmationDialog';
import { useToast } from '@/components/toast-provider';
import { uploadFile } from '@/lib/api';
import { LoaiTaiLieuOptions } from '@/types/interfaces';
import { createTaiLieu } from '@/lib/apiTaiLieu';

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

const KeHoachDetail: React.FC = () => {
  const { selectedPlan } = useSelectedPlan();
  const { keHoach, taiLieus, loading, error, fetchKeHoachDetail } = useKeHoachDetail(
    selectedPlan?.id || ''
  );
  const { canEdit, handleDelete } = useTaiLieu();
  const { addToast } = useToast();
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedTaiLieuId, setSelectedTaiLieuId] = useState<string | null>(null);

  // Loại tài liệu
  const getLoaiTaiLieuText = (loai: number) => {
    return LoaiTaiLieuOptions.find((opt) => opt.value === loai)?.label || 'Không xác định';
  };

  // Xử lý xóa tài liệu
  const handleDeleteClick = (id: string) => {
    setSelectedTaiLieuId(id);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTaiLieuId) {
      await handleDelete(selectedTaiLieuId);
      setAlertOpen(false);
      setSelectedTaiLieuId(null);
      fetchKeHoachDetail();
    }
  };

  // Xử lý thêm tài liệu
  const handleAddDocument = async (files: FileWithType[]) => {
    if (!selectedPlan?.id) {
      addToast('Không tìm thấy kế hoạch để thêm tài liệu', 'error');
      return;
    }

    try {
      for (const item of files) {
        const uploadResult = await uploadFile(item.file);
        const fileUrl = uploadResult.url;

        if (!fileUrl) {
          addToast(`Không nhận được URL cho file "${item.file.name}"`, 'error');
          continue;
        }

        await createTaiLieu(item.file.name, fileUrl, selectedPlan.id, item.loaiTaiLieu);
      }
      addToast('Thêm tài liệu thành công!', 'success');
      fetchKeHoachDetail();
    } catch (error) {
      console.error('Error adding document:', error);
      addToast('Lỗi khi thêm tài liệu', 'error');
    }
  };

  if (!selectedPlan) {
    return <NoPlanSelected />;
  }

  if (loading) {
    return <LoadingSpinner variant={2} withOverlay={true} />;
  }

  if (error || !keHoach) {
    return <PlanError error={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex-1 min-w-[300px]">
          <PlanInfo keHoach={keHoach} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <UnitInfo keHoach={keHoach} />
        </div>
      </div>
      <DocumentsTable
        taiLieus={taiLieus}
        loading={loading}
        canEdit={canEdit}
        handleDeleteClick={handleDeleteClick}
        getLoaiTaiLieuText={getLoaiTaiLieuText}
        keHoachId={selectedPlan.id}
        handleAddDocument={handleAddDocument}
      />
      <DeleteConfirmationDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default KeHoachDetail;
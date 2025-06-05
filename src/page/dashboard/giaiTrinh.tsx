// src/pages/giai-trinh/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { useToast } from '@/components/toast-provider';
import { useGiaiTrinh } from './hooks/useGiaiTrinh';
import { GiaiTrinhFormModal } from './components/giaiTrinh-manager/GiaiTrinhFormModal';
import { Button } from '@/components/ui/button';
import { Edit, PlusIcon, Trash2, FileTextIcon, DownloadIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Giải Trình',
    href: '/giai-trinh',
  },
];

type GiaiTrinhForm = {
    keHoachID: string;
    nguoiGiaiTrinhID: string;
    trangThaiTongThe?: string;
};

export default function GiaiTrinhPage() {
  const {
    giaiTrinh,
    nguoiDungList,
    loading,
    handleSaveGiaiTrinh,
    handleDeleteGiaiTrinh,
    handleDeleteGiaiTrinhFile,
    handleCompleteGiaiTrinh,
    canCreateGiaiTrinh,
    canEditGiaiTrinh,
    canDeleteGiaiTrinh,
    canUploadGiaiTrinhFile,
    canDeleteGiaiTrinhFile,
    selectedPlan,

    selectedLocalFiles,
    setSelectedLocalFiles,
    handleLocalFilesChange,
    handleRemoveLocalFile,
  } = useGiaiTrinh();

  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GiaiTrinhForm>>({});

  useEffect(() => {
    if (giaiTrinh) {
      setFormData({
        keHoachID: giaiTrinh.keHoachID,
        nguoiGiaiTrinhID: giaiTrinh.nguoiGiaiTrinhID,
        trangThaiTongThe: giaiTrinh.trangThaiTongThe,
      });
    } else {
      setFormData({
        keHoachID: selectedPlan?.id || '',
        nguoiGiaiTrinhID: '',
        trangThaiTongThe: 'Chờ Giải Trình',
      });
    }
    setSelectedLocalFiles([]);
  }, [giaiTrinh, selectedPlan, setSelectedLocalFiles]);

  const handleOpenGiaiTrinhModal = useCallback(() => {
    if (!selectedPlan?.id) {
        addToast('Vui lòng chọn một Kế hoạch để quản lý Giải Trình.', 'error');
        return;
    }
    setIsModalOpen(true);
  }, [selectedPlan, addToast]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlan?.id) {
      addToast('Vui lòng chọn một kế hoạch.', 'error');
      return;
    }
    if (!formData.nguoiGiaiTrinhID) {
      addToast('Vui lòng chọn người giải trình.', 'error');
      return;
    }
    if (giaiTrinh === null && selectedLocalFiles.length === 0) {
        addToast('Vui lòng chọn ít nhất một tệp để tạo yêu cầu Giải Trình.', 'error');
        return;
    }

    try {
        await handleSaveGiaiTrinh(
            {
                keHoachID: selectedPlan.id,
                nguoiGiaiTrinhID: formData.nguoiGiaiTrinhID,
                trangThaiTongThe: formData.trangThaiTongThe,
            },
            giaiTrinh ? giaiTrinh.id : null
        );
        setIsModalOpen(false);
    } catch (error) {
      // Lỗi đã được xử lý trong hook, không cần làm gì thêm ở đây
    }
  };

  const handleDownloadFile = (linkFile: string, fileName: string) => {
    window.open(linkFile, '_blank');
    addToast(`Đang tải xuống: ${fileName}`, 'info');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6 p-4">
        <HeadingSmall title="Quản lý Giải Trình" description="Theo dõi và quản lý các yêu cầu giải trình cho kế hoạch đã chọn" />

        {!selectedPlan?.id ? (
            <div className="p-4 text-center text-muted-foreground border rounded-md">
                Vui lòng chọn một Kế hoạch từ danh sách để quản lý Giải Trình.
            </div>
        ) : loading ? (
            // Thay thế thông báo "Đang tải thông tin Giải Trình..." bằng Skeleton
            <div className="p-4 border rounded-md shadow-sm bg-background space-y-4">
              <Skeleton className="h-6 w-3/4" /> {/* Tiêu đề Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-30 mb-2" /> 
                  <Skeleton className="h-5 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-30 mb-2" /> 
                  <Skeleton className="h-5 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-30 mb-2" /> 
                  <Skeleton className="h-5 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-30 mb-2" /> 
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
              <div className="mt-4 border-t pt-4 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Skeleton className="h-9 w-32" /> 
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
        ) : (
            <>
                {giaiTrinh ? (
                    <div className="p-4 border rounded-md shadow-sm bg-background">
                        <h3 className="text-lg font-semibold mb-3">Thông tin Giải Trình cho Kế hoạch: <span className="text-primary">{selectedPlan?.name}</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Người Yêu Cầu:</p>
                                <p className="font-medium">{giaiTrinh.nguoiYeuCau.hoTen} ({giaiTrinh.nguoiYeuCau.username})</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Người Giải Trình:</p>
                                <p className="font-medium">{giaiTrinh.nguoiGiaiTrinh.hoTen} ({giaiTrinh.nguoiGiaiTrinh.username})</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ngày Tạo:</p>
                                <p className="font-medium">{format(new Date(giaiTrinh.ngayTao), 'dd/MM/yyyy HH:mm')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Trạng Thái:</p>
                                <p className="font-medium">{giaiTrinh.trangThaiTongThe}</p>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-base mb-2">Tệp đính kèm đã có:</h4>
                            {giaiTrinh.giaiTrinhFiles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Chưa có tệp đính kèm nào.</p>
                            ) : (
                            <ul className="space-y-2">
                                {giaiTrinh.giaiTrinhFiles.map((file) => (
                                <li key={file.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                    <FileTextIcon className="size-4 text-muted-foreground" />
                                    <span>{file.tenFile}</span>
                                    </div>
                                    <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownloadFile(file.linkFile, file.tenFile)}
                                    >
                                        <DownloadIcon className="size-4" />
                                    </Button>
                                    </div>
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            {canUploadGiaiTrinhFile && (
                                <Button onClick={handleOpenGiaiTrinhModal}>
                                    <Edit className="mr-2 size-4" />Quản lý File
                                </Button>
                            )}
                            {giaiTrinh.trangThaiTongThe === 'Chờ Giải Trình' && canEditGiaiTrinh && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleCompleteGiaiTrinh(giaiTrinh.id)}
                                >
                                    <CheckCircle className="mr-2 size-4" /> Hoàn thành Giải Trình
                                </Button>
                            )}
                            {canDeleteGiaiTrinh && (
                                <Button variant="destructive" onClick={() => handleDeleteGiaiTrinh(giaiTrinh.id)}>
                                    <Trash2 className="mr-2 size-4" /> Xóa Giải Trình
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-center text-muted-foreground border rounded-md">
                        Chưa có yêu cầu Giải Trình nào cho kế hoạch "{selectedPlan.name}".
                        {canCreateGiaiTrinh && (
                            <Button onClick={handleOpenGiaiTrinhModal} className="mt-4">
                                <PlusIcon className="mr-2 size-4" /> Tạo Yêu Cầu Giải Trình Mới
                            </Button>
                        )}
                    </div>
                )}
            </>
        )}

        <GiaiTrinhFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLocalFiles([]);
          }}
          currentGiaiTrinh={giaiTrinh}
          nguoiDungList={nguoiDungList}
          selectedPlanName={selectedPlan?.name || 'Loading...'}
          canEditGiaiTrinh={canEditGiaiTrinh}
          canUploadGiaiTrinhFile={canUploadGiaiTrinhFile}
          canDeleteGiaiTrinhFile={canDeleteGiaiTrinhFile}
          onSubmitForm={onSubmitForm}
          handleSelectChange={handleSelectChange}
          handleLocalFilesChange={handleLocalFilesChange}
          selectedLocalFiles={selectedLocalFiles}
          handleRemoveLocalFile={handleRemoveLocalFile}
          handleDeleteGiaiTrinhFile={handleDeleteGiaiTrinhFile}
          handleDownloadFile={handleDownloadFile}
          formData={formData}
          loading={loading}
        />
      </div>
    </AppLayout>
  );
}
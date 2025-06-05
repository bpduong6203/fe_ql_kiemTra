import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { useToast } from '@/components/toast-provider';
import { useGiaiTrinh } from './hooks/useGiaiTrinh';
import { useNDGiaiTrinh } from './hooks/useNDGiaiTrinh';
import { GiaiTrinhFormModal } from './components/giaiTrinh-manager/GiaiTrinhFormModal';
import { NDGiaiTrinhTable } from './components/giaiTrinh-manager/NDGiaiTrinhTable';
import { NDGiaiTrinhFormModal } from './components/giaiTrinh-manager/NDGiaiTrinhFormModal';
import { Button } from '@/components/ui/button';
import { Edit, PlusIcon, Trash2, FileTextIcon, DownloadIcon, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { NDGiaiTrinh } from '@/types/interfaces';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const getDownloadUrl = (linkFile: string) => {
    if (linkFile.startsWith('https://') || linkFile.startsWith('http://')) {
      return linkFile;
    }
    return `${baseUrl}${linkFile.startsWith('/') ? '' : '/'}${linkFile}`;
  };

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
    currentUsername,
    canAddNDGiaiTrinh,

    selectedLocalFiles,
    setSelectedLocalFiles,
    handleLocalFilesChange,
    handleRemoveLocalFile,
  } = useGiaiTrinh();

  const {
    ndGiaiTrinhList,
    loading: ndLoading,
    selectedNDFile,
    handleNDFileChange,
    handleRemoveNDFile,
    handleSaveNDGiaiTrinh,
    handleDeleteNDGiaiTrinh,
    handleDanhGiaNDGiaiTrinh,
  } = useNDGiaiTrinh(giaiTrinh?.id || null, currentUsername);

  const { addToast } = useToast();

  const [isGiaiTrinhModalOpen, setIsGiaiTrinhModalOpen] = useState(false);
  const [isNDGiaiTrinhModalOpen, setIsNDGiaiTrinhModalOpen] = useState(false);
  const [currentNDGiaiTrinh, setCurrentNDGiaiTrinh] = useState<NDGiaiTrinh | null>(null);
  const [formData, setFormData] = useState<Partial<GiaiTrinhForm>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedGiaiTrinhId, setSelectedGiaiTrinhId] = useState<string | null>(null);

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
    setIsGiaiTrinhModalOpen(true);
  }, [selectedPlan, addToast]);

  const handleOpenCreateNDGiaiTrinhModal = useCallback(() => {
    if (!giaiTrinh?.id) {
        addToast('Vui lòng tạo Giải Trình trước khi thêm nội dung giải trình.', 'error');
        return;
    }
    if (!canAddNDGiaiTrinh) { 
        addToast('Bạn không có quyền thêm nội dung giải trình.', 'error');
        return;
    }
    setCurrentNDGiaiTrinh(null);
    setIsNDGiaiTrinhModalOpen(true);
  }, [giaiTrinh, addToast, canAddNDGiaiTrinh]);

  const handleOpenViewNDGiaiTrinhModal = useCallback((ndGiaiTrinh: NDGiaiTrinh) => {
    setCurrentNDGiaiTrinh(ndGiaiTrinh);
    setIsNDGiaiTrinhModalOpen(true);
  }, []); 

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
        setIsGiaiTrinhModalOpen(false);
    } catch (error) {
      // Lỗi đã được xử lý trong hook, không cần làm gì thêm ở đây
    }
  };

  const onSubmitNDGiaiTrinhForm = async (data: { NoiDung: string; GiaiTrinhID: string; }, ndGiaiTrinhId: string | null) => {
    try {
      await handleSaveNDGiaiTrinh(data, ndGiaiTrinhId);
      setIsNDGiaiTrinhModalOpen(false);
    } catch (error) {
      // Lỗi đã được xử lý trong hook
    }
  };


  const handleDownloadFile = (linkFile: string, fileName: string) => {
    const fullUrl = getDownloadUrl(linkFile);
    window.open(fullUrl, '_blank');
    addToast(`Đang tải xuống: ${fileName}`, 'info');
  };

  const confirmDelete = () => {
    if (selectedGiaiTrinhId) {
      handleDeleteGiaiTrinh(selectedGiaiTrinhId);
      setAlertOpen(false);
      setSelectedGiaiTrinhId(null);
    }
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
            <div className="p-4 border rounded-md shadow-sm bg-background space-y-4">
              <Skeleton className="h-6 w-3/4" />
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

                        {/* Phần hiển thị và quản lý Nội dung Giải Trình (NDGiaiTrinh) */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold">Nội dung Giải Trình</h4>
                                {canAddNDGiaiTrinh && (
                                    <Button size="sm" onClick={handleOpenCreateNDGiaiTrinhModal}>
                                        <MessageSquarePlus className="mr-2 size-4" /> Thêm Nội dung
                                    </Button>
                                )}
                            </div>
                            <NDGiaiTrinhTable
                                ndGiaiTrinhList={ndGiaiTrinhList}
                                loading={ndLoading}
                                canEvaluate={canEditGiaiTrinh} 
                                canDeleteND={canDeleteGiaiTrinh}
                                onDeleteND={handleDeleteNDGiaiTrinh}
                                onEvaluateND={handleDanhGiaNDGiaiTrinh}
                                onViewND={handleOpenViewNDGiaiTrinhModal}
                                getDownloadUrl={getDownloadUrl}
                                canManipulateND={canAddNDGiaiTrinh}
                            />
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
          isOpen={isGiaiTrinhModalOpen}
          onClose={() => {
            setIsGiaiTrinhModalOpen(false);
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

        {giaiTrinh?.id && (
            <NDGiaiTrinhFormModal
                isOpen={isNDGiaiTrinhModalOpen}
                onClose={() => {
                    setIsNDGiaiTrinhModalOpen(false);
                    setCurrentNDGiaiTrinh(null);
                    handleRemoveNDFile();
                }}
                currentNDGiaiTrinh={currentNDGiaiTrinh}
                giaiTrinhId={giaiTrinh.id}
                loading={ndLoading}
                selectedNDFile={selectedNDFile}
                handleNDFileChange={handleNDFileChange}
                handleRemoveNDFile={handleRemoveNDFile}
                onSaveNDGiaiTrinh={onSubmitNDGiaiTrinhForm}
                getDownloadUrl={getDownloadUrl}
            />
        )}

      </div>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Xác nhận xóa Giải Trình
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa giải trình này? Hành động này không thể hoàn tác và các tệp đính kèm sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
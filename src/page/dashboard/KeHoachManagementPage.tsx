import React, { useState, useEffect, useMemo } from 'react';
import { useKeHoach } from '@/page/dashboard/hooks/useKeHoach';
import { useToast } from '@/components/toast-provider';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon } from 'lucide-react'; 
import KeHoachFormModal from './components/kehoach-manager/KeHoachFormModal';
import KeHoachTable from './components/kehoach-manager/KeHoachTable'; 
import KeHoachTableSkeleton from './components/kehoach-manager/KeHoachTableSkeleton';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Quản lý kế hoạch',
    href: '/kehoach',
  },
];

const KeHoachManagementPage: React.FC = () => {
  const {
    filteredKeHoachList,
    deletedKeHoachList,
    loading,
    searchQuery,
    setSearchQuery,
    donViList,
    fetchKeHoachs,
    fetchDeletedKeHoachs,
    handleSave,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    canEdit,
    canHardDelete,
  } = useKeHoach();

  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"current" | "deleted">("current");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingKeHoach, setEditingKeHoach] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === 'current') {
      fetchKeHoachs();
    } else {
      fetchDeletedKeHoachs();
    }
  }, [activeTab, fetchKeHoachs, fetchDeletedKeHoachs]);

  const displayedKeHoachs = useMemo(() => {
    if (activeTab === 'current') {
      return filteredKeHoachList;
    } else {
      return deletedKeHoachList.filter(keHoach =>
        keHoach.tenKeHoach.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [activeTab, filteredKeHoachList, deletedKeHoachList, searchQuery]);

  const handleCreateNew = () => {
    setEditingKeHoach(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (keHoach: any) => {
    setEditingKeHoach(keHoach);
    setIsFormModalOpen(true);
  };

  const onFormSubmit = async (data: any, mode: 'create' | 'edit', id?: string) => {
    try {
      await handleSave(data, mode, id);
      setIsFormModalOpen(false);
      addToast(`Kế hoạch ${mode === 'create' ? 'được tạo' : 'cập nhật'} thành công!`, 'success');
    } catch (error) {
      addToast(`Lỗi khi ${mode === 'create' ? 'tạo' : 'cập nhật'} kế hoạch.`, 'error');
    }
  };

  const onConfirmDelete = async (id: string, isHardDelete: boolean) => {
    try {
      await handleDelete(id, isHardDelete);
      addToast(`Kế hoạch ${isHardDelete ? 'xóa vĩnh viễn' : 'xóa mềm'} thành công!`, 'success');
    } catch (error) {
      addToast(`Lỗi khi ${isHardDelete ? 'xóa vĩnh viễn' : 'xóa mềm'} kế hoạch.`, 'error');
    }
  };

  const onConfirmRestore = async (id: string) => {
    try {
      await handleRestore(id);
      addToast('Khôi phục kế hoạch thành công!', 'success');
    } catch (error) {
      addToast('Lỗi khi khôi phục kế hoạch.', 'error');
    }
  };

  const onConfirmPermanentDelete = async (id: string) => {
    try {
      await handlePermanentDelete(id);
      addToast('Xóa vĩnh viễn kế hoạch thành công!', 'success');
    } catch (error) {
      addToast('Lỗi khi xóa vĩnh viễn kế hoạch.', 'error');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6 p-4">
        <Heading
          title="Quản lý Kế hoạch"
          description="Quản lý tất cả các kế hoạch kiểm tra, bao gồm tạo mới, chỉnh sửa, xóa và khôi phục."
        />

        <div className="flex items-center justify-between">
          <div className="flex relative mr-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kế hoạch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {canEdit && (
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 size-4" />
              Tạo mới kế hoạch
            </Button>
          )}
        </div>

        <div className="w-full">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                activeTab === 'current'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Kế hoạch hiện tại
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                activeTab === 'deleted'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('deleted')}
            >
              Kế hoạch đã xóa ({deletedKeHoachList.length})
            </button>
          </div>

          <div className="mt-4">
            {loading ? (
              <KeHoachTableSkeleton />
            ) : (
              <KeHoachTable
                keHoachs={displayedKeHoachs}
                activeTab={activeTab}
                canEdit={canEdit}
                canHardDelete={canHardDelete}
                handleEdit={handleEdit}
                onConfirmDelete={onConfirmDelete}
                onConfirmRestore={onConfirmRestore}
                onConfirmPermanentDelete={onConfirmPermanentDelete}
              />
            )}
          </div>
        </div>
      </div>

      <KeHoachFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={onFormSubmit}
        initialData={editingKeHoach}
        donViList={donViList}
        loading={loading}
      />
    </AppLayout>
  );
};

export default KeHoachManagementPage;